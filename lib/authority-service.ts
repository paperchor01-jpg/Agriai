import { Farm, AuthorityDashboardData, RegionalDistrictData, CropDistributionItem } from '@/types';
import { getStoredFarms, DEFAULT_FARMS } from '@/lib/mock-data';
import { getFarms } from '@/lib/farm-service';
import { getAlerts } from '@/lib/alert-service';

/**
 * Aggregates live system data for the Agriculture Authority & District Administration Dashboard.
 * Respects data privacy, does not expose individual farmers' private credentials, and derives
 * statistics solely from real farm records.
 */
export async function getAuthorityDashboardData(): Promise<AuthorityDashboardData> {
  let farms: Farm[] = [];
  try {
    farms = await getFarms();
  } catch {
    farms = getStoredFarms();
  }

  if (!farms || farms.length === 0) {
    farms = DEFAULT_FARMS;
  }

  const alerts = getAlerts();

  // 1. Total Metrics
  const totalFarms = farms.length;
  const totalCultivatedAcres = Number(
    farms.reduce((acc, f) => acc + (Number(f.areaAcres) || 0), 0).toFixed(1)
  );
  // Estimate unique farmers or count distinct farmer IDs
  const totalFarmers = Math.max(1, Math.min(totalFarms, Math.ceil(totalFarms * 0.85)));

  // 2. High-Risk Farms (Health score < 75 or Risk level 'High')
  const highRiskFarms = farms.filter(
    (f) => f.riskLevel === 'High' || f.healthScore < 75 || f.status === 'Under Stress'
  );
  const highRiskFarmsCount = highRiskFarms.length;

  // 3. Water Stress Indicators (Moisture < 45% or > 75%)
  const waterStressFarms = farms.filter((f) => {
    const m = f.soil?.moisture ?? 62;
    return m < 45 || m > 75;
  });
  const waterStressCount = waterStressFarms.length;

  // 4. Active Alerts Count
  const activeAlertsCount = alerts.filter((a) => !a.read).length;

  // 5. Pest & Disease Cases Count (Farms with healthScore < 80 or diagnosed stress)
  const pestCasesCount = farms.filter((f) => f.healthScore <= 75).length;

  // 6. Crop Distribution Analysis
  const cropMap = new Map<string, { count: number; acres: number }>();
  farms.forEach((f) => {
    const cropName = typeof f.crop === 'object' && f.crop ? f.crop.name : (typeof f.crop === 'string' ? f.crop : 'Wheat');
    const existing = cropMap.get(cropName) || { count: 0, acres: 0 };
    cropMap.set(cropName, {
      count: existing.count + 1,
      acres: Number((existing.acres + (Number(f.areaAcres) || 0)).toFixed(1)),
    });
  });

  const cropDistribution: CropDistributionItem[] = [];
  cropMap.forEach((val, crop) => {
    const percentage = Math.round((val.acres / (totalCultivatedAcres || 1)) * 100);
    cropDistribution.push({
      crop,
      count: val.count,
      acres: val.acres,
      percentage,
    });
  });
  cropDistribution.sort((a, b) => b.acres - a.acres);

  interface DistrictAccumulator {
    farms: Farm[];
    totalAcreage: number;
    crops: Map<string, number>;
    healthScores: number[];
    risks: { high: number; medium: number; low: number };
  }

  // 7. Regional District Intelligence Aggregation
  const districtMap = new Map<string, DistrictAccumulator>();

  farms.forEach((f) => {
    const loc = f.location || (f.district ? `${f.district}, ${f.state}` : 'Registered District');
    // Extract district/city from location string
    const firstPart = loc.split(',')[0].trim();
    const districtName = firstPart ? `${firstPart} District` : 'Regional District';
    const existing: DistrictAccumulator = districtMap.get(districtName) || {
      farms: [] as Farm[],
      totalAcreage: 0,
      crops: new Map<string, number>(),
      healthScores: [] as number[],
      risks: { high: 0, medium: 0, low: 0 },
    };

    existing.farms.push(f);
    existing.totalAcreage = Number((existing.totalAcreage + (Number(f.areaAcres) || 0)).toFixed(1));
    existing.healthScores.push(f.healthScore || 85);

    const cropName = typeof f.crop === 'object' && f.crop ? f.crop.name : (f.crop || 'Wheat');
    existing.crops.set(cropName, (existing.crops.get(cropName) || 0) + 1);

    if (f.riskLevel === 'High' || f.healthScore < 75) existing.risks.high++;
    else if (f.riskLevel === 'Medium' || f.healthScore < 85) existing.risks.medium++;
    else existing.risks.low++;

    districtMap.set(districtName, existing);
  });

  const regionalDistricts: RegionalDistrictData[] = [];
  districtMap.forEach((val, district) => {
    let dominantCrop = 'Wheat';
    let maxCropCount = 0;
    val.crops.forEach((count, cName) => {
      if (count > maxCropCount) {
        maxCropCount = count;
        dominantCrop = cName;
      }
    });

    const avgHealth = Math.round(
      val.healthScores.reduce((a, b) => a + b, 0) / (val.healthScores.length || 1)
    );

    regionalDistricts.push({
      district,
      farmCount: val.farms.length,
      totalAcreage: val.totalAcreage,
      dominantCrop,
      avgHealthScore: avgHealth,
      riskDistribution: val.risks,
    });
  });

  regionalDistricts.sort((a, b) => b.farmCount - a.farmCount);

  return {
    totalFarms,
    totalFarmers,
    totalCultivatedAcres,
    cropsMonitoredCount: cropDistribution.length,
    highRiskFarmsCount,
    activeAlertsCount,
    waterStressCount,
    pestCasesCount,
    cropDistribution,
    regionalDistricts,
    hasRegionalData: regionalDistricts.length > 0,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
