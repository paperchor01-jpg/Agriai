/**
 * AgriAI Real Data Architecture — Provider Types & Interfaces
 * 
 * Enforces unified data provenance, freshness metadata, quality scoring,
 * and transparent source attribution across all external agricultural datasets.
 */

export type ProviderStatus = 
  | 'LIVE'             // Real-time API response from official source
  | 'CACHED'           // Fresh cached response within valid TTL
  | 'FALLBACK'         // Secondary reliable provider or official regional benchmark
  | 'STALE'            // Cached response past TTL, awaiting refresh
  | 'CONFIG_REQUIRED'  // Official API exists but requires API credentials/key
  | 'UNAVAILABLE';     // External provider temporarily unreachable

export interface FreshnessMetadata {
  fetchedAt: string;          // ISO timestamp of retrieval
  sourceTimestamp?: string;   // ISO timestamp when source updated this record
  expiresAt: string;          // ISO timestamp when this record should be refreshed
  provider: string;           // e.g. "IMD", "AGMARKNET", "Open-Meteo", "ICAR"
  sourceName: string;         // Human-readable source name e.g. "India Meteorological Department"
  datasetName?: string;       // e.g. "Daily Mandi Market Bulletin (data.gov.in)"
  attributionUrl?: string;    // Link to official portal
  status: ProviderStatus;
  isStale: boolean;
  ttlSeconds: number;
  fallbackReason?: string;    // Diagnosis code / reason for fallback
  recordsCount?: number;      // Count of live records returned
  filterLevel?: 'district' | 'state' | 'national_benchmark';
  isLive?: boolean;           // Explicit live flag
}

export interface DataQualityReport {
  isValid: boolean;
  confidenceScore: number;    // 0 to 100 percentage
  checksPassed: string[];
  warnings: string[];
  validationTimestamp: string;
}

export interface DataProviderResult<T> {
  success: boolean;
  data: T;
  metadata: FreshnessMetadata;
  quality: DataQualityReport;
  error?: string;
}

/**
 * Common Weather Observation Model conforming to IMD & Open-Meteo data
 */
export interface NormalizedWeatherObservation {
  latitude: number;
  longitude: number;
  locationName: string;
  state: string;
  district: string;
  temperatureC: number;
  tempMinC: number;
  tempMaxC: number;
  apparentTempC: number;
  humidityPercent: number;
  rainChancePercent: number;
  rainfallMm: number;                // Current or 1h precipitation in mm
  rainfall24hMm: number;             // 24-hour accumulated rainfall in mm
  rainfallAnomaly?: string;          // "Normal" | "Deficient" | "Excess" | "Unavailable"
  windSpeedKmH: number;
  windDirection: string;
  weatherCondition: string;
  uvIndex: number;
  airQualityDesc: string;
  forecastDays: Array<{
    date: string;
    dayLabel: string;
    tempMaxC: number;
    tempMinC: number;
    condition: string;
    rainChancePercent: number;
    expectedRainfallMm: number;
  }>;
  severeWarning?: {
    level: 'None' | 'Yellow' | 'Orange' | 'Red';
    title: string;
    description: string;
    issuedAt: string;
    validUntil: string;
  };
}

/**
 * Normalized Agricultural Market Price Model conforming to AGMARKNET & data.gov.in
 */
export interface NormalizedMarketPrice {
  id: string;
  commodity: string;
  variety: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;       // ₹ per quintal (100 kg)
  maxPrice: number;       // ₹ per quintal
  modalPrice: number;     // ₹ per quintal (predominant traded rate)
  msp?: number;           // Government Minimum Support Price benchmark
  priceDate: string;      // YYYY-MM-DD
  unit: string;           // "₹ / Quintal"
  disclaimer?: string;    // Transparent user-facing guidance
  trend7d?: {
    direction: 'UP' | 'DOWN' | 'STABLE';
    changePercent: number;
    historicalModal: Array<{ date: string; price: number }>;
  };
}

/**
 * Normalized 12-parameter Soil Test Profile
 */
export interface NormalizedSoilProfile {
  id: string;
  farmId: string;
  farmerId: string;
  sampleDate: string;
  labName?: string;
  sampleLocation: string;
  soilType: string;
  ph: number;
  electricalConductivityDsm?: number; // EC in dS/m (salinity indicator)
  organicCarbonPercent?: number;      // OC % (humus & microbial activity)
  availableNitrogenKgHa?: number;     // N in kg/ha
  nitrogenRating: 'Low' | 'Medium' | 'High';
  availablePhosphorusKgHa?: number;   // P in kg/ha
  phosphorusRating: 'Low' | 'Medium' | 'High';
  availablePotassiumKgHa?: number;    // K in kg/ha
  potassiumRating: 'Low' | 'Medium' | 'High';
  // Micronutrients (ppm / mg/kg)
  zincPpm?: number;
  ironPpm?: number;
  copperPpm?: number;
  manganesePpm?: number;
  boronPpm?: number;
  sulphurPpm?: number;
  isLabVerified: boolean;
  status: 'Complete' | 'Partial' | 'Insufficient';
}

/**
 * Normalized Official Government Agro-Meteorological Advisory
 */
export interface NormalizedAgroAdvisory {
  id: string;
  title: string;
  agency: string;           // e.g. "IMD-Agromet / ICAR-KVK"
  state: string;
  district: string;
  crops: string[];
  issuedAt: string;
  validUntil: string;
  urgency: 'Routine' | 'Advisory' | 'Urgent' | 'Alert';
  bulletinSummary: string;
  farmingInstructions: string[];
  officialSourceUrl: string;
  isExpired: boolean;
}
