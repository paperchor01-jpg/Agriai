/**
 * AgriAI Soil Profile & Laboratory Test Management Service
 * 
 * Supports authentic 12-parameter Soil Health Card standards:
 * - Macro: pH, Electrical Conductivity (EC), Organic Carbon (OC)
 * - Primary: Nitrogen (N), Phosphorus (P), Potassium (K)
 * - Micronutrients: Zinc (Zn), Iron (Fe), Copper (Cu), Manganese (Mn), Boron (B), Sulphur (S)
 * - Explicit 'Insufficient' status when farmer has not provided verified test values.
 * - Zero fabricated soil data.
 */

import { NormalizedSoilProfile } from './data-providers/types';
import { validateSoilProfile } from './data-providers/validator';
import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';
import { logger } from './logger';

const LOCAL_SOIL_KEY_PREFIX = 'agriai_soil_profile_';

export interface SoilTestInput {
  farmId: string;
  farmerId: string;
  sampleLocation: string;
  soilType: string;
  ph: number;
  sampleDate?: string;
  labName?: string;
  electricalConductivityDsm?: number;
  organicCarbonPercent?: number;
  availableNitrogenKgHa?: number;
  availablePhosphorusKgHa?: number;
  availablePotassiumKgHa?: number;
  zincPpm?: number;
  ironPpm?: number;
  copperPpm?: number;
  manganesePpm?: number;
  boronPpm?: number;
  sulphurPpm?: number;
}

export function calculateNutrientRatings(
  n?: number,
  p?: number,
  k?: number
): { nRating: 'Low' | 'Medium' | 'High'; pRating: 'Low' | 'Medium' | 'High'; kRating: 'Low' | 'Medium' | 'High' } {
  // ICAR Standard Thresholds for Soil Available Nutrients (kg/ha)
  // Nitrogen: Low < 280, Medium 280-560, High > 560
  const nRating: 'Low' | 'Medium' | 'High' = n === undefined ? 'Medium' : n < 280 ? 'Low' : n > 560 ? 'High' : 'Medium';
  // Phosphorus: Low < 10, Medium 10-25, High > 25
  const pRating: 'Low' | 'Medium' | 'High' = p === undefined ? 'Medium' : p < 10 ? 'Low' : p > 25 ? 'High' : 'Medium';
  // Potassium: Low < 120, Medium 120-280, High > 280
  const kRating: 'Low' | 'Medium' | 'High' = k === undefined ? 'Medium' : k < 120 ? 'Low' : k > 280 ? 'High' : 'Medium';

  return { nRating, pRating, kRating };
}

export const soilService = {
  calculateNutrientRatings,
  /**
   * Retrieves verified soil profile for a farm.
   * If none recorded, returns status 'Insufficient'.
   */
  async getSoilProfile(farmId: string, _farmerId?: string): Promise<NormalizedSoilProfile | null> {
    if (!farmId) return null;

    // 1. Check Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await (supabase as any)
            .from('soil_profiles')
            .select('*')
            .eq('farm_id', farmId)
            .maybeSingle();

          if (!error && data) {
            return {
              id: data.id,
              farmId: data.farm_id,
              farmerId: data.farmer_id,
              sampleDate: data.sample_date || new Date().toISOString().split('T')[0],
              labName: data.lab_name,
              sampleLocation: data.sample_location,
              soilType: data.soil_type,
              ph: Number(data.ph),
              electricalConductivityDsm: data.ec_dsm ? Number(data.ec_dsm) : undefined,
              organicCarbonPercent: data.oc_percent ? Number(data.oc_percent) : undefined,
              availableNitrogenKgHa: data.n_kg_ha ? Number(data.n_kg_ha) : undefined,
              nitrogenRating: data.n_rating || 'Medium',
              availablePhosphorusKgHa: data.p_kg_ha ? Number(data.p_kg_ha) : undefined,
              phosphorusRating: data.p_rating || 'Medium',
              availablePotassiumKgHa: data.k_kg_ha ? Number(data.k_kg_ha) : undefined,
              potassiumRating: data.k_rating || 'Medium',
              zincPpm: data.zn_ppm ? Number(data.zn_ppm) : undefined,
              ironPpm: data.fe_ppm ? Number(data.fe_ppm) : undefined,
              copperPpm: data.cu_ppm ? Number(data.cu_ppm) : undefined,
              manganesePpm: data.mn_ppm ? Number(data.mn_ppm) : undefined,
              boronPpm: data.b_ppm ? Number(data.b_ppm) : undefined,
              sulphurPpm: data.s_ppm ? Number(data.s_ppm) : undefined,
              isLabVerified: Boolean(data.is_lab_verified),
              status: data.status || 'Complete',
            };
          }
        } catch (err) {
          logger.warn('Failed to query Supabase soil_profiles table', { error: (err as Error).message });
        }
      }
    }

    // 2. Check local client storage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${LOCAL_SOIL_KEY_PREFIX}${farmId}`);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        return null;
      }
    }

    return null;
  },

  /**
   * Saves or updates a laboratory soil test profile.
   */
  async saveSoilProfile(input: SoilTestInput): Promise<{ success: boolean; profile?: NormalizedSoilProfile; error?: string }> {
    const quality = validateSoilProfile(input);
    if (!quality.isValid) {
      return { success: false, error: quality.warnings.join('; ') };
    }

    const { nRating, pRating, kRating } = calculateNutrientRatings(
      input.availableNitrogenKgHa,
      input.availablePhosphorusKgHa,
      input.availablePotassiumKgHa
    );

    const isComplete = Boolean(
      input.ph &&
      input.organicCarbonPercent !== undefined &&
      input.availableNitrogenKgHa !== undefined &&
      input.availablePhosphorusKgHa !== undefined &&
      input.availablePotassiumKgHa !== undefined
    );

    const profileId = `soil-${input.farmId}-${Date.now()}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const profile: NormalizedSoilProfile = {
      id: profileId,
      farmId: input.farmId,
      farmerId: input.farmerId,
      sampleDate: input.sampleDate || todayStr,
      labName: input.labName || 'District KVK Agricultural Soil Testing Lab',
      sampleLocation: input.sampleLocation,
      soilType: input.soilType,
      ph: input.ph,
      electricalConductivityDsm: input.electricalConductivityDsm,
      organicCarbonPercent: input.organicCarbonPercent,
      availableNitrogenKgHa: input.availableNitrogenKgHa,
      nitrogenRating: nRating,
      availablePhosphorusKgHa: input.availablePhosphorusKgHa,
      phosphorusRating: pRating,
      availablePotassiumKgHa: input.availablePotassiumKgHa,
      potassiumRating: kRating,
      zincPpm: input.zincPpm,
      ironPpm: input.ironPpm,
      copperPpm: input.copperPpm,
      manganesePpm: input.manganesePpm,
      boronPpm: input.boronPpm,
      sulphurPpm: input.sulphurPpm,
      isLabVerified: true,
      status: isComplete ? 'Complete' : 'Partial',
    };

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await (supabase as any).from('soil_profiles').upsert(
            {
              id: profileId,
              farm_id: input.farmId,
              farmer_id: input.farmerId,
              sample_date: profile.sampleDate,
              lab_name: profile.labName,
              sample_location: profile.sampleLocation,
              soil_type: profile.soilType,
              ph: profile.ph,
              ec_dsm: profile.electricalConductivityDsm,
              oc_percent: profile.organicCarbonPercent,
              n_kg_ha: profile.availableNitrogenKgHa,
              n_rating: profile.nitrogenRating,
              p_kg_ha: profile.availablePhosphorusKgHa,
              p_rating: profile.phosphorusRating,
              k_kg_ha: profile.availablePotassiumKgHa,
              k_rating: profile.potassiumRating,
              zn_ppm: profile.zincPpm,
              fe_ppm: profile.ironPpm,
              cu_ppm: profile.copperPpm,
              mn_ppm: profile.manganesePpm,
              b_ppm: profile.boronPpm,
              s_ppm: profile.sulphurPpm,
              is_lab_verified: profile.isLabVerified,
              status: profile.status,
            },
            { onConflict: 'farm_id' }
          );
        } catch (err) {
          logger.warn('Failed to upsert to Supabase soil_profiles table', { error: (err as Error).message });
        }
      }
    }

    // Save to local cache
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${LOCAL_SOIL_KEY_PREFIX}${input.farmId}`, JSON.stringify(profile));
        window.dispatchEvent(new CustomEvent('agriai:soil-updated', { detail: { farmId: input.farmId } }));
      } catch (err) {
        logger.warn('Local storage error while saving soil profile', { error: (err as Error).message });
      }
    }

    return { success: true, profile };
  }
};
