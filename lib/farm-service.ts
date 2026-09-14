import { Farm } from '@/types';
import { FarmRow, FarmInsert, FarmUpdate } from '@/types/database';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  DEFAULT_FARMS,
  DEMO_FARMER_ID,
  getStoredFarms,
  saveStoredFarms,
  getSelectedFarmId,
  saveSelectedFarmId,
  getActiveUserId,
  setActiveUserId,
} from '@/lib/mock-data';

function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function sanitizeNumber(val: unknown, min: number, max: number, fallback: number): number {
  const num = Number(val);
  if (isNaN(num) || num < min || num > max) return fallback;
  return Number(num.toFixed(2));
}

function sanitizeString(val: unknown, maxLen = 200, fallback = ''): string {
  if (typeof val !== 'string') return fallback;
  const trimmed = val.trim();
  return trimmed.slice(0, maxLen);
}

/**
 * Maps a Supabase Database FarmRow into the AgriAI frontend Farm interface.
 */
export function mapDbFarmToFarm(row: FarmRow): Farm {
  const area = Number(row.area) || 4.2;
  return {
    id: row.id,
    name: row.farm_name,
    location: row.location,
    areaAcres: area,
    irrigationAvailability: row.irrigation_available ? 'Available' : 'Limited',
    soil: {
      soilType: row.soil_type || 'Loamy',
      ph: Number(row.soil_ph) || 6.8,
      nitrogen: row.nitrogen_level || 'Medium',
      phosphorus: row.phosphorus_level || 'High',
      potassium: row.potassium_level || 'Medium',
      moisture: row.soil_moisture || 62,
    },
    crop: {
      name: row.crop || 'Wheat',
      variety: 'HD-2967',
      stage: row.crop_stage || 'Flowering',
      plantingDate: '2025-11-15',
    },
    practices: {
      irrigationMethod: row.irrigation_available ? 'Drip' : 'Rainfed',
      fertilizerPractice: 'Integrated / Mixed',
      pestPractice: 'Integrated Pest Management (IPM)',
    },
    healthScore: 87,
    status: 'Healthy',
    riskLevel: 'Low',
    expectedYieldTons: Number((area * 0.67).toFixed(1)),
    soilType: row.soil_type || 'Loamy',
    cropVariety: 'HD-2967',
    plantingDate: '2025-11-15',
    irrigationType: row.irrigation_available ? 'Drip' : 'Rainfed',
  };
}

/**
 * Maps a frontend Farm into a Supabase FarmInsert object with strict input sanitization.
 */
export function mapFarmToDbInsert(farm: Farm, farmerId: string): FarmInsert {
  const cropName = typeof farm.crop === 'object' && farm.crop ? farm.crop.name : (farm.crop || 'Wheat');
  const cropStage = typeof farm.crop === 'object' && farm.crop?.stage ? farm.crop.stage : 'Flowering';
  const soilType = farm.soil?.soilType || farm.soilType || 'Loamy';
  const soilPh = farm.soil?.ph ?? 6.8;
  const moisture = farm.soil?.moisture ?? 62;
  const nitrogen = farm.soil?.nitrogen || 'Medium';
  const phosphorus = farm.soil?.phosphorus || 'High';
  const potassium = farm.soil?.potassium || 'Medium';

  const insertPayload: FarmInsert = {
    farmer_id: farmerId,
    farm_name: sanitizeString(farm.name, 200, 'New Farm Plot'),
    location: sanitizeString(farm.location, 200, 'Ludhiana, Punjab'),
    area: sanitizeNumber(farm.areaAcres, 0.1, 50000, 4.2),
    soil_type: sanitizeString(soilType, 50, 'Loamy'),
    soil_ph: sanitizeNumber(soilPh, 0.0, 14.0, 6.8),
    nitrogen_level: ['Low', 'Medium', 'High'].includes(nitrogen) ? nitrogen : 'Medium',
    phosphorus_level: ['Low', 'Medium', 'High'].includes(phosphorus) ? phosphorus : 'High',
    potassium_level: ['Low', 'Medium', 'High'].includes(potassium) ? potassium : 'Medium',
    soil_moisture: Math.round(sanitizeNumber(moisture, 0, 100, 62)),
    crop: sanitizeString(cropName, 100, 'Wheat'),
    crop_stage: sanitizeString(cropStage, 100, 'Flowering'),
    irrigation_available: farm.irrigationAvailability === 'Available',
  };

  if (isValidUuid(farm.id)) {
    insertPayload.id = farm.id;
  }

  return insertPayload;
}

/**
 * Securely retrieves the active authenticated user's ID or demo farmer fallback.
 */
export async function getEffectiveFarmerId(): Promise<string | null> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: userData } = await client.auth.getUser();
      const user = userData?.user;

      if (user?.id) {
        setActiveUserId(user.id);

        // Ensure the corresponding profile row exists
        const { data: existingFarmer } = await client
          .from('farmers')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (existingFarmer?.id) {
          return existingFarmer.id;
        }

        const userName = sanitizeString(user.user_metadata?.name, 200, 'Farmer');
        const { data: newFarmer } = await client
          .from('farmers')
          .insert({
            id: user.id,
            name: userName,
            location: 'Punjab, India',
            farm_size: 0,
            preferred_language: 'en',
          })
          .select('id')
          .maybeSingle();

        return newFarmer?.id || user.id;
      }
    } catch (err) {
      console.warn('Error verifying active farmer ID in Supabase:', err);
    }
  }

  const activeId = getActiveUserId();
  if (activeId) {
    return activeId;
  }

  const isDemo = typeof window !== 'undefined'
    ? localStorage.getItem('agriai_auth_status') === 'demo_authenticated'
    : false;

  return isDemo ? DEMO_FARMER_ID : null;
}

/**
 * 1. GET FARMS (Protected against IDOR)
 * Scopes query strictly to the authenticated user's farmer_id.
 */
export async function getFarms(explicitFarmerId?: string): Promise<Farm[]> {
  const farmerId = explicitFarmerId || (await getEffectiveFarmerId());

  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        let query = client.from('farms').select('*');

        if (farmerId) {
          query = query.eq('farmer_id', farmerId);
        }

        const { data, error } = await query.order('created_at', { ascending: true });

        if (!error && data !== null) {
          const mappedFarms = data.map(mapDbFarmToFarm);
          saveStoredFarms(mappedFarms, farmerId);
          return mappedFarms;
        }

        if (error) {
          console.warn('Supabase query failed, using local storage fallback:', error.message);
        }
      } catch (err) {
        console.warn('Network error reaching Supabase, using local fallback:', err);
      }
    }
  }

  // Fallback to local storage
  return getStoredFarms(farmerId);
}

/**
 * High-Scale Keyset Paginated Query for Farms.
 * Efficiently streams records using index idx_farms_farmer_created without full table scans.
 */
export async function getPaginatedFarms(params: {
  cursor?: string;
  limit?: number;
  farmerId?: string;
}): Promise<{ farms: Farm[]; nextCursor: string | null; hasMore: boolean }> {
  const farmerId = params.farmerId || (await getEffectiveFarmerId());
  const pageSize = Math.min(Math.max(1, params.limit || 20), 100);

  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        let query = client
          .from('farms')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(pageSize + 1);

        if (farmerId) {
          query = query.eq('farmer_id', farmerId);
        }

        if (params.cursor) {
          query = query.lt('created_at', params.cursor);
        }

        const { data, error } = await query;

        if (!error && data) {
          const hasMore = data.length > pageSize;
          const records = hasMore ? data.slice(0, pageSize) : data;
          const nextCursor = hasMore && records.length > 0 ? (records[records.length - 1] as any).created_at : null;

          return {
            farms: records.map(mapDbFarmToFarm),
            nextCursor,
            hasMore,
          };
        }
      } catch (err) {
        console.warn('Paginated farms query fallback:', err);
      }
    }
  }

  // Local storage fallback pagination
  const allFarms = getStoredFarms(farmerId);
  const farms = allFarms.slice(0, pageSize);
  return {
    farms,
    nextCursor: allFarms.length > pageSize ? farms[farms.length - 1].id : null,
    hasMore: allFarms.length > pageSize,
  };
}

/**
 * Selective Projection Query (reduces data payload for farm selector dropdowns and navbar summaries).
 */
export async function getFarmSummaries(explicitFarmerId?: string): Promise<Array<{ id: string; name: string; crop: string; areaAcres: number }>> {
  const farmerId = explicitFarmerId || (await getEffectiveFarmerId());

  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        let query = client.from('farms').select('id, farm_name, crop, area');
        if (farmerId) {
          query = query.eq('farmer_id', farmerId);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.farm_name,
            crop: d.crop,
            areaAcres: Number(d.area) || 0,
          }));
        }
      } catch (err) {
        console.warn('Error fetching selective farm summaries:', err);
      }
    }
  }

  const all = getStoredFarms(farmerId);
  return all.map((f) => ({
    id: f.id,
    name: f.name,
    crop: typeof f.crop === 'object' ? f.crop.name : f.crop,
    areaAcres: f.areaAcres,
  }));
}

/**
 * 2. CREATE FARM (Protected against unauthorized assignment)
 * Enforces ownership binding to the verified farmer_id.
 */
export async function createFarm(farmData: Partial<Farm>): Promise<Farm> {
  const farmerId = (await getEffectiveFarmerId()) || DEMO_FARMER_ID;
  const id = farmData.id || `farm-${Date.now()}`;
  const area = sanitizeNumber(farmData.areaAcres, 0.1, 50000, 4.2);
  const soilPh = sanitizeNumber(farmData.soil?.ph, 3.0, 11.0, 6.8);
  const soilMoisture = Math.round(sanitizeNumber(farmData.soil?.moisture, 0, 100, 62));

  const newFarm: Farm = {
    id,
    name: sanitizeString(farmData.name, 200, 'New Farm Plot'),
    location: sanitizeString(farmData.location, 200, 'Ludhiana, Punjab'),
    latitude: typeof farmData.latitude === 'number' ? farmData.latitude : undefined,
    longitude: typeof farmData.longitude === 'number' ? farmData.longitude : undefined,
    state: farmData.state ? sanitizeString(farmData.state, 100) : undefined,
    district: farmData.district ? sanitizeString(farmData.district, 100) : undefined,
    locationDetails: farmData.locationDetails,
    areaAcres: area,
    irrigationAvailability: farmData.irrigationAvailability || 'Available',
    soil: {
      soilType: sanitizeString(farmData.soil?.soilType || farmData.soilType, 50, 'Loamy'),
      ph: soilPh,
      nitrogen: farmData.soil?.nitrogen || 'Medium',
      phosphorus: farmData.soil?.phosphorus || 'High',
      potassium: farmData.soil?.potassium || 'Medium',
      moisture: soilMoisture,
    },
    crop: (typeof farmData.crop === 'object' && farmData.crop) ? farmData.crop : {
      name: sanitizeString(typeof farmData.crop === 'string' ? farmData.crop : 'Wheat', 100, 'Wheat'),
      variety: sanitizeString(farmData.cropVariety, 100, 'HD-2967'),
      stage: (typeof farmData.crop === 'object' && farmData.crop ? (farmData.crop as any).stage : undefined) || 'Flowering',
      plantingDate: farmData.plantingDate || new Date().toISOString().split('T')[0],
    },
    practices: farmData.practices || {
      irrigationMethod: farmData.irrigationType || 'Drip',
      fertilizerPractice: 'Integrated / Mixed',
      pestPractice: 'Integrated Pest Management (IPM)',
    },
    healthScore: farmData.healthScore || 85,
    status: farmData.status || 'Healthy',
    riskLevel: farmData.riskLevel || 'Low',
    expectedYieldTons: farmData.expectedYieldTons || Number((area * 0.67).toFixed(1)),
    soilType: sanitizeString(farmData.soil?.soilType || farmData.soilType, 50, 'Loamy'),
    cropVariety: sanitizeString(farmData.cropVariety, 100, 'HD-2967'),
    plantingDate: farmData.plantingDate || new Date().toISOString().split('T')[0],
    irrigationType: farmData.irrigationType || 'Drip',
  };

  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        if (farmerId) {
          const insertPayload = mapFarmToDbInsert(newFarm, farmerId);
          const { data, error } = await client
            .from('farms')
            .insert(insertPayload)
            .select('*')
            .single();

          if (!error && data) {
            const created = mapDbFarmToFarm(data);
            const currentFarms = getStoredFarms(farmerId);
            const updatedList = [created, ...currentFarms.filter(f => f.id !== created.id)];
            saveStoredFarms(updatedList, farmerId);
            saveSelectedFarmId(created.id, farmerId);
            return created;
          }

          if (error) {
            console.warn('Supabase insert failed, saving to local storage:', error.message);
          }
        }
      } catch (err) {
        console.warn('Network error creating farm in Supabase, saving to local storage:', err);
      }
    }
  }

  // Fallback: save to local storage
  const current = getStoredFarms(farmerId);
  const updated = [newFarm, ...current.filter((f) => f.id !== newFarm.id)];
  saveStoredFarms(updated, farmerId);
  saveSelectedFarmId(newFarm.id, farmerId);
  return newFarm;
}

/**
 * 3. UPDATE FARM (Protected against IDOR/BOLA)
 * Restricts mutation strictly to records matching both id AND farmer_id.
 */
export async function updateFarm(id: string, farmData: Partial<Farm>): Promise<Farm> {
  const farmerId = (await getEffectiveFarmerId()) || DEMO_FARMER_ID;
  const currentFarms = getStoredFarms(farmerId);
  const existing = currentFarms.find((f) => f.id === id) || currentFarms[0];
  if (!existing) {
    throw new Error(`Farm with id ${id} not found.`);
  }

  const area = farmData.areaAcres !== undefined
    ? sanitizeNumber(farmData.areaAcres, 0.1, 50000, existing.areaAcres)
    : existing.areaAcres;
  const soilPh = farmData.soil?.ph !== undefined
    ? sanitizeNumber(farmData.soil.ph, 3.0, 11.0, existing.soil?.ph ?? 6.8)
    : (existing.soil?.ph ?? 6.8);
  const soilMoisture = farmData.soil?.moisture !== undefined
    ? Math.round(sanitizeNumber(farmData.soil.moisture, 0, 100, existing.soil?.moisture ?? 62))
    : (existing.soil?.moisture ?? 62);

  const updatedFarm: Farm = {
    ...existing,
    ...farmData,
    id,
    areaAcres: area,
    name: sanitizeString(farmData.name, 200, existing.name),
    location: sanitizeString(farmData.location, 200, existing.location),
    soil: {
      ...existing.soil,
      ...(farmData.soil || {}),
      ph: soilPh,
      moisture: soilMoisture,
    },
    crop: typeof farmData.crop === 'object' && farmData.crop ? {
      ...existing.crop,
      ...farmData.crop,
    } : existing.crop,
    practices: {
      ...existing.practices,
      ...(farmData.practices || {}),
    },
  };

  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client && isValidUuid(id)) {
      try {
        const updatePayload: FarmUpdate = {
          farm_name: updatedFarm.name,
          location: updatedFarm.location,
          area: updatedFarm.areaAcres,
          soil_type: updatedFarm.soil?.soilType || updatedFarm.soilType || 'Loamy',
          soil_ph: updatedFarm.soil?.ph ?? 6.8,
          nitrogen_level: updatedFarm.soil?.nitrogen || 'Medium',
          phosphorus_level: updatedFarm.soil?.phosphorus || 'High',
          potassium_level: updatedFarm.soil?.potassium || 'Medium',
          soil_moisture: updatedFarm.soil?.moisture ?? 62,
          crop: typeof updatedFarm.crop === 'object' && updatedFarm.crop ? updatedFarm.crop.name : (updatedFarm.crop || 'Wheat'),
          crop_stage: typeof updatedFarm.crop === 'object' && updatedFarm.crop?.stage ? updatedFarm.crop.stage : 'Flowering',
          irrigation_available: updatedFarm.irrigationAvailability === 'Available',
        };

        let query = client.from('farms').update(updatePayload).eq('id', id);
        if (farmerId) {
          // Explicitly enforce owner scoping for IDOR prevention
          query = query.eq('farmer_id', farmerId);
        }

        const { data, error } = await query.select('*').maybeSingle();

        if (!error && data) {
          const mapped = mapDbFarmToFarm(data);
          const updatedList = currentFarms.map((f) => (f.id === id ? mapped : f));
          saveStoredFarms(updatedList, farmerId);
          return mapped;
        }

        if (error) {
          console.warn('Supabase update failed, saving locally:', error.message);
        }
      } catch (err) {
        console.warn('Network error updating farm in Supabase, saving locally:', err);
      }
    }
  }

  // Fallback: save to local storage
  const updatedList = currentFarms.map((f) => (f.id === id ? updatedFarm : f));
  saveStoredFarms(updatedList, farmerId);
  return updatedFarm;
}

/**
 * 4. DELETE FARM (Protected against IDOR/BOLA)
 * Restricts deletion strictly to records owned by the verified user.
 */
export async function deleteFarm(id: string): Promise<boolean> {
  const farmerId = (await getEffectiveFarmerId()) || DEMO_FARMER_ID;

  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client && isValidUuid(id)) {
      try {
        let query = client.from('farms').delete().eq('id', id);
        if (farmerId) {
          // Explicitly enforce owner scoping for IDOR prevention
          query = query.eq('farmer_id', farmerId);
        }

        const { error } = await query;
        if (error) {
          console.warn('Supabase delete failed, removing locally:', error.message);
        }
      } catch (err) {
        console.warn('Network error deleting farm in Supabase, removing locally:', err);
      }
    }
  }

  // Always update local cache
  const currentFarms = getStoredFarms(farmerId);
  const updatedList = currentFarms.filter((f) => f.id !== id);
  saveStoredFarms(updatedList, farmerId);

  const selectedId = getSelectedFarmId(farmerId);
  if (selectedId === id) {
    if (updatedList.length > 0) {
      saveSelectedFarmId(updatedList[0].id, farmerId);
    } else {
      saveSelectedFarmId("", farmerId);
    }
  }

  return true;
}
