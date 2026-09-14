export interface FarmLocationDetails {
  country: string;
  state: string;
  district: string;
  subDistrict?: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
}

export interface FarmerProfile {
  name: string;
  phone: string;
  email: string;
  location: string;
  state: string;
  farmSizeAcres: number;
  primaryCrop: string;
  soilType: string;
  preferredLanguage: "en" | "hi" | "pa" | "English" | "Hindi" | "Punjabi" | string;
  role?: "farmer" | "authority" | "admin" | string;
  latitude?: number;
  longitude?: number;
  district?: string;
  locationDetails?: FarmLocationDetails;
}

export interface SoilCondition {
  soilType: string;
  ph: number;
  nitrogen: "Low" | "Medium" | "High" | string;
  phosphorus: "Low" | "Medium" | "High" | string;
  potassium: "Low" | "Medium" | "High" | string;
  moisture: number; // percentage e.g. 62
}

export interface CropInfo {
  name: string;
  variety?: string;
  stage: "Seedling" | "Vegetative" | "Tillering" | "Flowering" | "Grain Filling" | "Maturity / Harvest" | string;
  plantingDate: string;
}

export interface FarmPractices {
  irrigationMethod: "Drip" | "Sprinkler" | "Canal / Flood" | "Furrow" | "Rainfed" | string;
  fertilizerPractice: "Chemical / Synthetic" | "Organic / Bio-fertilizer" | "Integrated / Mixed" | string;
  pestPractice: "Integrated Pest Management (IPM)" | "Chemical Spray" | "Biological / Organic" | "Preventive Scouting" | string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  areaAcres: number;
  irrigationAvailability: "Available" | "Limited" | "Rainfed" | string;
  soil: SoilCondition;
  crop: CropInfo;
  practices: FarmPractices;
  healthScore: number;
  status: "Healthy" | "Attention Needed" | "Under Stress";
  riskLevel: "Low" | "Medium" | "High";
  expectedYieldTons: number;
  latitude?: number;
  longitude?: number;
  state?: string;
  district?: string;
  subDistrict?: string;
  village?: string;
  locationDetails?: FarmLocationDetails;
  // Compatibility fields
  soilType?: string;
  cropVariety?: string;
  plantingDate?: string;
  irrigationType?: string;
}

export interface CropDoctorRecommendation {
  id: number;
  title: string;
  description: string;
  urgency: "Immediate" | "Within 48h" | "Routine";
}

export interface CropHealthBreakdown {
  leafHealth: number;
  soilCondition: number;
  waterStress: number;
  diseaseRisk: number;
  weatherRisk: number;
}

export interface CropDoctorResult {
  id: string;
  timestamp: string;
  crop: string;
  healthScore: number;
  disease: string;
  scientificName?: string;
  severity: "Low" | "Moderate" | "High" | "Critical";
  confidence: number;
  explanation: string;
  disclaimer?: string;
  recommendations: string[];
  healthBreakdown?: CropHealthBreakdown;
  imageUrl?: string;
  affectedAreaPercentage?: number;
  isFallback?: boolean;
  source?: string;
  symptoms?: string[];
}

export type AdvisoryCategory =
  | "Irrigation"
  | "Nutrients"
  | "Pest"
  | "Disease"
  | "Weather"
  | "Crop Care"
  | string;

/**
 * Feature 1: Explainable AI Advisory Model
 */
export interface AdvisoryExplainability {
  suitabilityScore: number; // e.g. 87 ("AgriAI suitability score")
  scoreLabel: string; // e.g. "AgriAI suitability score"
  recommendedCrop?: string;
  whyFactors: string[]; // e.g. ["✓ Soil pH is suitable (6.8)", "✓ Soil moisture is adequate (62%)"]
  riskFactors: string[]; // e.g. ["Low rainfall expected", "Moderate water stress"]
  recommendedAction: string;
  dataSources: string[]; // e.g. ["Soil Telemetry", "Open-Meteo Microclimate", "Crop Doctor Vision"]
  dataAvailable: {
    soilData: boolean;
    weatherData: boolean;
    diseaseData: boolean;
    cropStageData: boolean;
  };
}

export interface AdvisoryItem {
  id: string;
  title: string;
  category: AdvisoryCategory;
  categoryLabel?: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
  action: string;
  timing: string;
  description?: string;
  scheduledTime?: string;
  iconName?: string;
  actionUrl?: string;
  actionCta?: string;
  explainability?: AdvisoryExplainability;
}

export interface CurrentWeather {
  temperature: number;
  condition: string;
  humidity: number;
  rainChance: number;
  windSpeedKmH: number;
  feelsLike?: number;
  windDirection?: string;
  uvIndex?: number;
  airQuality?: string;
  lastUpdatedTimestamp?: number;
}

export interface ForecastItem {
  day: string; // Today, Tomorrow, Day 3, Day 4, Day 5
  date?: string;
  temperature: number;
  tempMin?: number;
  tempMax?: number;
  condition: string;
  rainChance: number;
  rainProb?: number;
  icon?: string;
}

export interface WeatherAdviceItem {
  id: string;
  title: string;
  advice: string;
  recommendation?: string;
  type?: "irrigation" | "monitoring" | "disease" | "general" | string;
  priority?: "High" | "Medium" | "Low";
}

export interface FarmRiskItem {
  category: "Disease Risk" | "Weather Risk" | "Water Stress" | "Pest Risk" | string;
  level: "Low" | "Medium" | "High";
  status: string;
  type: "disease" | "weather" | "water" | "pest" | string;
  explanation?: string;
}

export interface WeatherData {
  location: string;
  current: CurrentWeather;
  forecast: ForecastItem[];
  farmingAdvice: WeatherAdviceItem[];
  risks: FarmRiskItem[];
  lastSyncedAt?: string;
  isCached?: boolean;
  // Flat compatibility properties
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  rainChance: number;
  windSpeedKmH: number;
  windDirection?: string;
  uvIndex?: number;
  airQuality?: string;
  isFallback?: boolean;
  source?: string;
  agriAdvice?: {
    title: string;
    description: string;
    impact: "positive" | "caution" | "warning";
  }[];
}

export interface AlertItem {
  id: string;
  level: "HIGH" | "WARNING" | "INFO";
  priority: "HIGH" | "WARNING" | "INFO";
  title: string;
  type?: "disease" | "weather" | "irrigation" | "advisory" | "general" | string;
  reason: string;
  message: string;
  action: string;
  timing: string;
  farmId?: string;
  farmName?: string;
  date?: string;
  createdAt?: string;
  read: boolean;
  actionUrl?: string;
  actionCta?: string;
}

export interface YieldContributingFactor {
  name: string;
  value: string;
  status: "Positive" | "Watch" | "Negative";
  impact: string;
  detail?: string;
  iconName?: string;
}

export interface YieldPredictionResult {
  predictedYield: number;
  minimumYield: number;
  maximumYield: number;
  unit: string;
  confidence: number;
  label: string;
  cropName: string;
  farmName: string;
  areaAcres: number;
  totalTons: number;
  factors: YieldContributingFactor[];
  insights: string[];
  actions: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

/**
 * Feature 2: Farm Health & Risk Score Model
 */
export interface FarmHealthFactor {
  name: string;
  score: number; // 0-100
  weight: number;
  status: "Healthy" | "Attention Needed" | "Under Stress";
  description: string;
  dataAvailable: boolean;
}

export interface FarmHealthTopAction {
  id: string;
  action: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  timing: string;
  category: string;
  completed?: boolean;
}

export interface FarmHealthScoreResult {
  score: number; // 0-100
  status: "Healthy" | "Attention Needed" | "Under Stress";
  scoreLabel: string; // "AgriAI Farm Health Score"
  subtitle: string;
  factors: {
    soilCondition: FarmHealthFactor;
    weather: FarmHealthFactor;
    waterAvailability: FarmHealthFactor;
    pestRisk: FarmHealthFactor;
    nutrientCondition: FarmHealthFactor;
  };
  topActionsToday: FarmHealthTopAction[];
  calculatedAt: string;
}

/**
 * Feature 3: Agriculture Authority Dashboard Model
 */
export interface RegionalDistrictData {
  district: string;
  farmCount: number;
  totalAcreage: number;
  dominantCrop: string;
  avgHealthScore: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface CropDistributionItem {
  crop: string;
  count: number;
  percentage: number;
  acres: number;
}

export interface AuthorityDashboardData {
  totalFarms: number;
  totalFarmers: number;
  totalCultivatedAcres: number;
  cropsMonitoredCount: number;
  highRiskFarmsCount: number;
  activeAlertsCount: number;
  waterStressCount: number;
  pestCasesCount: number;
  cropDistribution: CropDistributionItem[];
  regionalDistricts: RegionalDistrictData[];
  hasRegionalData: boolean;
  lastUpdated: string;
}

/**
 * Feature 5: Impact & Evidence Dashboard Model
 */
export interface PrototypeMetricItem {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  description: string;
  category: "Telemetry" | "Advisories" | "AI Diagnostics" | "System Performance";
}

export interface ProjectedImpactItem {
  id: string;
  title: string;
  estimate: string;
  statusText: "To be validated through field trials" | "Expected benefit" | "Potential impact";
  rationale: string;
  baselineComparison: string;
}

export interface ImpactDashboardData {
  actualMetrics: PrototypeMetricItem[];
  projectedImpact: ProjectedImpactItem[];
  generatedAt: string;
}

/**
 * Feature: Crop Recommendation Engine Model
 */
export interface CropRecommendation {
  cropName: string;
  scientificName?: string;
  suitabilityScore: number; // 0-100
  season: "Kharif" | "Rabi" | "Zaid" | "Year-Round" | string;
  waterRequirement: "Low" | "Medium" | "High";
  soilSuitability: string;
  expectedDurationDays: number;
  estimatedYieldRange: string;
  whyFactors: string[];
  riskFactors: string[];
  recommendedPractices: string[];
  marketOutlook: "Strong Demand" | "Moderate" | "Volatile";
}

export interface CropRecommendationResult {
  farmId: string;
  farmName: string;
  season: string;
  soilType: string;
  soilPh: number;
  irrigationAvailability: string;
  topRecommendations: CropRecommendation[];
  generatedAt: string;
}

/**
 * Feature: Today's Prioritized Actions Model
 */
export interface TodayActionItem {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  action: string;
  reason: string;
  timeframe: string;
  relevantData: string;
  category: "Irrigation" | "Nutrients" | "Pest & Disease" | "Crop Care" | "Weather Prep" | string;
  completed?: boolean;
}

/**
 * Feature: Crop Calendar Lifecycle Model
 */
export interface CropStageInfo {
  stageName: string;
  order: number;
  startDay: number;
  endDay: number;
  isCurrent: boolean;
  isCompleted: boolean;
  description: string;
  keyTasks: string[];
  risksToWatch: string[];
}

export interface CropCalendarData {
  cropName: string;
  variety: string;
  plantingDate: string;
  daysElapsed: number;
  estimatedHarvestDate: string;
  totalDurationDays: number;
  currentStage: string;
  currentStageOrder: number;
  stages: CropStageInfo[];
  progressPercentage: number;
}

/**
 * Feature: Nutrient Advisor Model
 */
export interface NutrientLevel {
  level: "Low" | "Medium" | "High" | "Optimal" | "Unknown";
  value?: number;
  unit?: string;
  recommendation: string;
}

export interface NutrientAdvisorData {
  hasSoilTest: boolean;
  soilPh: number;
  phStatus: "Acidic" | "Neutral" | "Alkaline" | "Optimal";
  nitrogen: NutrientLevel;
  phosphorus: NutrientLevel;
  potassium: NutrientLevel;
  recommendations: string[];
  organicAlternatives: string[];
  disclaimer: string;
}

/**
 * Feature: Irrigation Advisor Model
 */
export interface IrrigationAdvisorData {
  status: "Adequate" | "Irrigation Needed" | "High Moisture / Hold Off";
  soilMoisturePercent: number;
  soilType: string;
  cropStage: string;
  rainExpectedNext48hMm: number;
  waterStressLevel: "Low" | "Medium" | "High";
  recommendation: string;
  timing: string;
  methodSpecificAdvice: string;
  waterConservationTip: string;
}

/**
 * Feature: Mandi Market Watch Model
 */
export interface MandiPriceItem {
  crop: string;
  state: string;
  district: string;
  marketName: string;
  modalPrice: number; // in ₹/quintal
  minPrice: number;
  maxPrice: number;
  unit: string;
  msp: number; // Minimum Support Price benchmark
  date: string;
  isLive: boolean;
  disclaimer: string;
}

/**
 * Feature: Government Schemes Model
 */
export interface GovSchemeItem {
  id: string;
  name: string;
  shortName: string;
  category: "Income Support" | "Insurance" | "Soil & Inputs" | "Irrigation" | "Mechanization" | "Credit";
  description: string;
  eligibility: string;
  benefits: string;
  howToApplyUrl: string;
  officialPortal: string;
}

/**
 * Feature: Crop Economics Model
 */
export interface CropEconomicsData {
  farmAcreage: number;
  cropName: string;
  costs: {
    seeds: number;
    fertilizers: number;
    pesticides: number;
    labor: number;
    irrigation: number;
    machinery: number;
    totalCost: number;
  };
  revenue: {
    expectedYieldQuintals: number;
    expectedPricePerQuintal: number;
    grossRevenue: number;
  };
  profit: {
    netProfit: number;
    returnOnInvestmentPercent: number;
    isProfitable: boolean;
  };
}

/**
 * Feature: Farm Digital Passport Model
 */
export interface FarmHistoryRecord {
  year: number;
  season: "Kharif" | "Rabi" | "Zaid";
  crop: string;
  yieldQuintalsPerAcre: number;
  keyIssues: string[];
}

export interface FarmPassportData {
  farmId: string;
  farmName: string;
  ownerName: string;
  location: FarmLocationDetails;
  totalAcres: number;
  soilType: string;
  soilPh: number;
  currentCrop: CropInfo;
  irrigationType: string;
  healthScore: number;
  history: FarmHistoryRecord[];
  createdAt: string;
}

export * from './database';

