import {
  FarmerProfile,
  Farm,
  CropDoctorResult,
  AdvisoryItem,
  WeatherData,
  AlertItem,
  FarmRiskItem,
} from "@/types";

export const DEFAULT_FARMER: FarmerProfile = {
  name: "Arjun Singh",
  phone: "+91 98765 43210",
  email: "farmer@agriai.demo",
  location: "Ludhiana, Punjab",
  state: "Punjab",
  farmSizeAcres: 4.2,
  primaryCrop: "Wheat",
  soilType: "Loamy",
  preferredLanguage: "English",
};

export const DEFAULT_FARMS: Farm[] = [
  {
    id: "farm-1",
    name: "Green Valley Farm",
    location: "Ludhiana, Punjab",
    areaAcres: 4.2,
    irrigationAvailability: "Available",
    soil: {
      soilType: "Loamy",
      ph: 6.8,
      nitrogen: "Medium",
      phosphorus: "High",
      potassium: "Medium",
      moisture: 62,
    },
    crop: {
      name: "Wheat",
      variety: "HD-2967",
      stage: "Flowering",
      plantingDate: "2025-11-15",
    },
    practices: {
      irrigationMethod: "Drip",
      fertilizerPractice: "Integrated / Mixed",
      pestPractice: "Integrated Pest Management (IPM)",
    },
    soilType: "Loamy",
    cropVariety: "HD-2967",
    plantingDate: "2025-11-15",
    irrigationType: "Drip",
    healthScore: 87,
    status: "Healthy",
    riskLevel: "Low",
    expectedYieldTons: 2.8,
  },
  {
    id: "farm-2",
    name: "Canal Side Acreage",
    location: "Amritsar, Punjab",
    areaAcres: 2.5,
    irrigationAvailability: "Available",
    soil: {
      soilType: "Clay Loam",
      ph: 7.2,
      nitrogen: "Medium",
      phosphorus: "Medium",
      potassium: "Low",
      moisture: 54,
    },
    crop: {
      name: "Mustard",
      variety: "Pusa Bold",
      stage: "Vegetative",
      plantingDate: "2025-10-20",
    },
    practices: {
      irrigationMethod: "Sprinkler",
      fertilizerPractice: "Chemical / Synthetic",
      pestPractice: "Chemical Spray",
    },
    soilType: "Clay Loam",
    cropVariety: "Pusa Bold",
    plantingDate: "2025-10-20",
    irrigationType: "Sprinkler",
    healthScore: 74,
    status: "Attention Needed",
    riskLevel: "Medium",
    expectedYieldTons: 1.4,
  },
  {
    id: "farm-3",
    name: "South Ridge Field",
    location: "Bathinda, Punjab",
    areaAcres: 3.0,
    irrigationAvailability: "Limited",
    soil: {
      soilType: "Sandy Loam",
      ph: 7.5,
      nitrogen: "Low",
      phosphorus: "Medium",
      potassium: "High",
      moisture: 42,
    },
    crop: {
      name: "Chickpea / Gram",
      variety: "BG-372",
      stage: "Tillering",
      plantingDate: "2025-11-02",
    },
    practices: {
      irrigationMethod: "Canal / Flood",
      fertilizerPractice: "Organic / Bio-fertilizer",
      pestPractice: "Preventive Scouting",
    },
    soilType: "Sandy Loam",
    cropVariety: "BG-372",
    plantingDate: "2025-11-02",
    irrigationType: "Canal / Flood",
    healthScore: 91,
    status: "Healthy",
    riskLevel: "Low",
    expectedYieldTons: 1.9,
  },
];

export const DEMO_CROP_DOCTOR_RESULT: CropDoctorResult = {
  id: "diag-rust-01",
  timestamp: "Just now",
  crop: "Wheat",
  healthScore: 72,
  disease: "Leaf Rust (Brown Rust)",
  scientificName: "Puccinia triticina",
  severity: "Moderate",
  confidence: 94,
  explanation:
    "Early stage yellow-orange uredinial pustules detected on the upper leaf surface. If left unmanaged, the spores can spread rapidly across neighboring tillers under warm and humid canopy conditions.",
  recommendations: [
    "Follow locally approved fungicide guidance (e.g. Propiconazole 25% EC at 1ml/L water).",
    "Monitor nearby plants and border rows daily for orange powdery pustules.",
    "Avoid excessive overhead irrigation to minimize leaf wetness duration.",
    "Remove and safely dispose of severely affected lower leaf foliage where appropriate.",
    "Recheck crop health with AgriAI scanner in 3–5 days to track recovery.",
  ],
  imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  affectedAreaPercentage: 18,
};

export const DEFAULT_ADVISORIES: AdvisoryItem[] = [
  {
    id: "adv-flowering",
    category: "Crop Care",
    categoryLabel: "🌾 Crop Care",
    title: "Flowering Stage Care",
    description: "Flowering is the most sensitive phenological phase for grain formation. Avoid moisture stress or chemical drift.",
    priority: "High",
    reason: "Wheat is currently at the flowering stage.",
    action: "Maintain appropriate moisture and closely monitor crop health.",
    timing: "This week",
    scheduledTime: "This week",
    iconName: "Sprout",
    actionUrl: "/farms",
    actionCta: "View Farm",
  },
  {
    id: "adv-irrigation-delay",
    category: "Irrigation",
    categoryLabel: "💧 Irrigation",
    title: "Delay Irrigation",
    description: "Natural precipitation (65% probability) will hydrate root zones. Topsoil moisture is already at 62%.",
    priority: "Medium",
    reason: "Rainfall is expected soon and soil moisture is currently adequate.",
    action: "Monitor soil moisture and avoid unnecessary irrigation before rainfall.",
    timing: "Next 24 hours",
    scheduledTime: "Next 24 hours",
    iconName: "Droplets",
    actionUrl: "/weather",
    actionCta: "Check Weather",
  },
  {
    id: "adv-disease-risk",
    category: "Disease",
    categoryLabel: "🛡️ Disease",
    title: "Monitor Fungal Disease Risk",
    description: "Ambient humidity is at 62%. Spores of Leaf Rust proliferate when leaves stay moist for over 6 hours.",
    priority: "Medium",
    reason: "Humidity and existing crop health conditions may increase fungal disease risk.",
    action: "Inspect leaves regularly for spots, discoloration, or spreading symptoms.",
    timing: "Today",
    scheduledTime: "Today",
    iconName: "AlertTriangle",
    actionUrl: "/crop-doctor",
    actionCta: "Open Crop Doctor",
  },
  {
    id: "adv-nutrients-balance",
    category: "Nutrients",
    categoryLabel: "🌱 Nutrients",
    title: "Balanced Nutrient Management",
    description: "Prevent phosphorus lock-up by balancing secondary micronutrients like Zinc.",
    priority: "Low",
    reason: "Phosphorus is high while nitrogen and potassium are at medium levels.",
    action: "Hold additional phosphate applications; maintain balanced split nitrogen doses.",
    timing: "Next 7 days",
    scheduledTime: "Next 7 days",
    iconName: "Sparkles",
    actionUrl: "/farms",
    actionCta: "View Farm",
  },
];

export const DEFAULT_WEATHER: WeatherData = {
  location: "Ludhiana, Punjab",
  temperature: 28,
  condition: "Partly Cloudy",
  feelsLike: 29,
  humidity: 62,
  rainChance: 20,
  windSpeedKmH: 12,
  windDirection: "NW",
  uvIndex: 6,
  airQuality: "Moderate (AQI 95)",
  current: {
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 62,
    rainChance: 20,
    windSpeedKmH: 12,
    feelsLike: 29,
    windDirection: "NW",
    uvIndex: 6,
    airQuality: "Moderate (AQI 95)",
  },
  forecast: [
    { day: "Today", temperature: 28, tempMin: 18, tempMax: 28, condition: "Partly Cloudy", rainChance: 20, rainProb: 20 },
    { day: "Tomorrow", temperature: 26, tempMin: 17, tempMax: 26, condition: "Light Rain", rainChance: 65, rainProb: 65 },
    { day: "Day 3", temperature: 27, tempMin: 18, tempMax: 27, condition: "Cloudy", rainChance: 40, rainProb: 40 },
    { day: "Day 4", temperature: 30, tempMin: 19, tempMax: 30, condition: "Sunny", rainChance: 10, rainProb: 10 },
    { day: "Day 5", temperature: 29, tempMin: 19, tempMax: 29, condition: "Partly Cloudy", rainChance: 25, rainProb: 25 },
  ],
  farmingAdvice: [
    {
      id: "adv-1",
      title: "Precipitation Preparedness",
      advice: "Avoid unnecessary irrigation before rainfall.",
      recommendation: "Hold scheduled tube-well pumping to conserve water and prevent root waterlogging.",
      type: "irrigation",
      priority: "High",
    },
    {
      id: "adv-2",
      title: "Crop Scouting Window",
      advice: "Good conditions for crop monitoring today.",
      recommendation: "Take clear field photos for the AI Crop Doctor while sunlight and canopy are dry.",
      type: "monitoring",
      priority: "Medium",
    },
    {
      id: "adv-3",
      title: "Disease Vigilance",
      advice: "Monitor humidity because higher humidity may increase fungal disease risk.",
      recommendation: "Inspect leaf undersides for rust pustules or powdery mildew spores.",
      type: "disease",
      priority: "High",
    },
  ],
  risks: [
    {
      category: "Disease Risk",
      level: "Medium",
      status: "Moderate spore risk",
      type: "disease",
      explanation: "Humidity at 62% encourages active foliar scouting.",
    },
    {
      category: "Weather Risk",
      level: "Low",
      status: "Light showers in 36h",
      type: "weather",
      explanation: "Scattered light showers expected; favorable for tillering.",
    },
    {
      category: "Water Stress",
      level: "Low",
      status: "Root moisture optimal",
      type: "water",
      explanation: "Soil moisture at 62% is within the ideal 55–70% range.",
    },
    {
      category: "Pest Risk",
      level: "Medium",
      status: "Aphid monitoring alert",
      type: "pest",
      explanation: "Vegetative temperature (26–30°C) is conducive to sucking pest populations.",
    },
  ],
  agriAdvice: [
    {
      title: "Delay Irrigation",
      description: "Avoid unnecessary irrigation before rainfall.",
      impact: "warning",
    },
    {
      title: "Good Monitoring Day",
      description: "Good conditions for crop monitoring today.",
      impact: "positive",
    },
    {
      title: "Humidity Watch",
      description: "Monitor humidity because higher humidity may increase fungal disease risk.",
      impact: "caution",
    },
  ],
};

export const DEFAULT_ALERTS: AlertItem[] = [
  {
    id: "alert-disease-rust",
    level: "HIGH",
    priority: "HIGH",
    type: "disease",
    title: "Disease Risk Requires Attention",
    reason: "Crop Doctor detected Leaf Rust with moderate severity.",
    message: "Crop Doctor detected Leaf Rust with moderate severity.",
    action: "Inspect affected wheat leaves and monitor whether symptoms are spreading.",
    timing: "Today",
    farmId: "farm-1",
    farmName: "Green Valley Farm",
    date: "Today, 08:30 AM",
    createdAt: "Today, 08:30 AM",
    read: false,
    actionUrl: "/crop-doctor",
    actionCta: "Open Crop Doctor",
  },
  {
    id: "alert-weather-humidity",
    level: "WARNING",
    priority: "WARNING",
    type: "weather",
    title: "Monitor Humidity",
    reason: "Current humidity may increase fungal disease risk.",
    message: "Current humidity may increase fungal disease risk.",
    action: "Inspect the crop regularly for fungal symptoms.",
    timing: "Today",
    farmId: "farm-1",
    farmName: "Green Valley Farm",
    date: "Today, 09:15 AM",
    createdAt: "Today, 09:15 AM",
    read: false,
    actionUrl: "/weather",
    actionCta: "Check Weather",
  },
  {
    id: "alert-weather-rain",
    level: "INFO",
    priority: "INFO",
    type: "weather",
    title: "Weather Update",
    reason: "Rain is expected in the forecast.",
    message: "Rain is expected in the forecast.",
    action: "Review irrigation plans before rainfall.",
    timing: "Tomorrow",
    farmId: "farm-1",
    farmName: "Green Valley Farm",
    date: "Yesterday, 05:00 PM",
    createdAt: "Yesterday, 05:00 PM",
    read: false,
    actionUrl: "/weather",
    actionCta: "Check Weather",
  },
  {
    id: "alert-stage-flowering",
    level: "INFO",
    priority: "INFO",
    type: "advisory",
    title: "Flowering Stage Advisory",
    reason: "Wheat is currently at the sensitive flowering phase.",
    message: "Wheat is currently at the sensitive flowering phase.",
    action: "Maintain steady hydration and avoid chemical drift.",
    timing: "This week",
    farmId: "farm-1",
    farmName: "Green Valley Farm",
    date: "Yesterday, 11:30 AM",
    createdAt: "Yesterday, 11:30 AM",
    read: true,
    actionUrl: "/advisory",
    actionCta: "View Advisory",
  },
];

export const ANALYTICS_DATA = {
  healthTrend: [
    { week: "Week 1", score: 68, benchmark: 65 },
    { week: "Week 2", score: 72, benchmark: 68 },
    { week: "Week 3", score: 75, benchmark: 72 },
    { week: "Week 4", score: 81, benchmark: 76 },
    { week: "Week 5", score: 84, benchmark: 80 },
    { week: "Week 6", score: 87, benchmark: 82 },
  ],
  waterUsage: [
    { day: "Mon", actual: 140, optimal: 150 },
    { day: "Tue", actual: 160, optimal: 155 },
    { day: "Wed", actual: 130, optimal: 140 },
    { day: "Thu", actual: 110, optimal: 130 },
    { day: "Fri", actual: 95, optimal: 100 },
    { day: "Sat", actual: 120, optimal: 125 },
    { day: "Sun", actual: 145, optimal: 140 },
  ],
  riskBreakdown: [
    { category: "Disease Risk", level: 45, status: "Medium" },
    { category: "Weather Risk", level: 25, status: "Low" },
    { category: "Water Stress", level: 20, status: "Low" },
    { category: "Pest Risk", level: 50, status: "Medium" },
    { category: "Nutrient Deficit", level: 30, status: "Low" },
  ],
  yieldFactors: [
    { factor: "Seed Quality & Genetics", score: 92 },
    { factor: "Soil Nutrient Status", score: 85 },
    { factor: "Water Management", score: 88 },
    { factor: "Pest / Disease Control", score: 74 },
    { factor: "Weather Favorability", score: 82 },
  ],
};

export const EXPERT_DEMO_DATA = {
  stats: {
    totalFarmers: 1248,
    highRiskFarms: 32,
    pendingCases: 18,
    resolvedCases: 246,
  },
  diseaseTrends: [
    { disease: "Leaf Rust", incidence: 38, change: "+12%" },
    { disease: "Powdery Mildew", incidence: 24, change: "-4%" },
    { disease: "Yellow Mosaic", incidence: 19, change: "+3%" },
    { disease: "Stem Rot", incidence: 11, change: "-8%" },
  ],
  cropDistribution: [
    { name: "Wheat", percentage: 55 },
    { name: "Rice", percentage: 25 },
    { name: "Mustard", percentage: 12 },
    { name: "Pulses & Others", percentage: 8 },
  ],
  highRiskFarms: [
    { id: "HR-1", farmer: "Harpreet Singh", farm: "Noorpur Block", crop: "Wheat", issue: "Severe Yellow Rust", risk: "High", contact: "+91 98140-xxxxx" },
    { id: "HR-2", farmer: "Rajinder Kaur", farm: "Gill Road Plot", crop: "Mustard", issue: "Aphid Infestation", risk: "High", contact: "+91 98722-xxxxx" },
    { id: "HR-3", farmer: "Balwinder Sandhu", farm: "Raikot Basin", crop: "Wheat", issue: "Waterlogging Stress", risk: "Medium", contact: "+91 94173-xxxxx" },
  ],
};

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: "crop" | "weather" | "farm";
}

export const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    title: "Crop analyzed",
    timestamp: "2 hours ago",
    type: "crop",
  },
  {
    id: "act-2",
    title: "Weather updated",
    timestamp: "5 hours ago",
    type: "weather",
  },
  {
    id: "act-3",
    title: "Farm information updated",
    timestamp: "Yesterday",
    type: "farm",
  },
];

export const DEFAULT_FARM_RISKS: FarmRiskItem[] = [
  {
    category: "Disease Risk",
    level: "Medium",
    status: "Moderate spore risk",
    type: "disease",
    explanation: "Humidity at 62% encourages active foliar scouting.",
  },
  {
    category: "Weather Risk",
    level: "Low",
    status: "Light showers in 36h",
    type: "weather",
    explanation: "Scattered light showers expected; favorable for tillering.",
  },
  {
    category: "Water Stress",
    level: "Low",
    status: "Root moisture optimal",
    type: "water",
    explanation: "Soil moisture at 62% is within the ideal 55–70% range.",
  },
  {
    category: "Pest Risk",
    level: "Medium",
    status: "Aphid monitoring alert",
    type: "pest",
    explanation: "Vegetative temperature (26–30°C) is conducive to sucking pest populations.",
  },
];

// Storage helper keys
const STORAGE_KEYS = {
  FARMS: "agriai_farms",
  ALERTS: "agriai_alerts",
  FARMER: "agriai_farmer",
  DIAGNOSIS_HISTORY: "agriai_history",
  ACTIVE_USER_ID: "agriai_active_user_id",
};

export const DEMO_FARMER_ID = '00000000-0000-0000-0000-000000000001';

let memoryFarms: Farm[] | null = null;
const memoryUserFarms: Record<string, Farm[]> = {};
let memorySelectedFarmId: string | null = null;
const memoryUserSelectedFarmId: Record<string, string> = {};
let memoryActiveUserId: string | null = null;

export function getActiveUserId(): string | null {
  if (typeof window === "undefined") return memoryActiveUserId;
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID) || memoryActiveUserId;
  } catch {
    return memoryActiveUserId;
  }
}

export function setActiveUserId(userId: string | null) {
  memoryActiveUserId = userId;
  if (typeof window === "undefined") return;
  try {
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    }
  } catch (err) {
    console.warn("Failed to set active user ID in localStorage", err);
  }
}

export function getStoredFarms(userId?: string | null): Farm[] {
  const effectiveUserId = userId !== undefined ? userId : getActiveUserId();

  if (typeof window === "undefined") {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      return memoryUserFarms[effectiveUserId] ?? [];
    }
    return memoryFarms || DEFAULT_FARMS;
  }

  try {
    // If a specific non-demo user is active, check user-scoped storage
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      const userRaw = localStorage.getItem(`${STORAGE_KEYS.FARMS}_${effectiveUserId}`);
      if (userRaw !== null) {
        return JSON.parse(userRaw);
      }
      // If user is authenticated as a non-demo user and has no stored farms, return []
      return [];
    }

    // Demo farmer or unauthenticated demo mode
    const raw = localStorage.getItem(STORAGE_KEYS.FARMS);
    if (raw !== null) {
      return JSON.parse(raw);
    }

    const authStatus = localStorage.getItem('agriai_auth_status');
    if ((authStatus === 'supabase_authenticated' || authStatus === 'custom_authenticated') && effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      return [];
    }

    return DEFAULT_FARMS;
  } catch {
    return effectiveUserId && effectiveUserId !== DEMO_FARMER_ID ? [] : DEFAULT_FARMS;
  }
}

export function saveStoredFarms(farms: Farm[], userId?: string | null) {
  const effectiveUserId = userId !== undefined ? userId : getActiveUserId();
  if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
    memoryUserFarms[effectiveUserId] = farms;
  } else {
    memoryFarms = farms;
  }

  if (typeof window === "undefined") {
    return;
  }

  try {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      localStorage.setItem(`${STORAGE_KEYS.FARMS}_${effectiveUserId}`, JSON.stringify(farms));
    }
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(farms));
    window.dispatchEvent(new Event("agriai:farms-updated"));
  } catch (err) {
    console.error("Failed to save farms to localStorage", err);
  }
}

export function getSelectedFarmId(userId?: string | null): string {
  const farms = getStoredFarms(userId);
  if (farms.length === 0) return "";

  const effectiveUserId = userId !== undefined ? userId : getActiveUserId();

  if (typeof window === "undefined") {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      const userSel = memoryUserSelectedFarmId[effectiveUserId];
      if (userSel && farms.some((f) => f.id === userSel)) {
        return userSel;
      }
      return farms[0].id;
    }
    if (memorySelectedFarmId && farms.some((f) => f.id === memorySelectedFarmId)) {
      return memorySelectedFarmId;
    }
    return farms[0].id;
  }

  try {
    const key = effectiveUserId && effectiveUserId !== DEMO_FARMER_ID
      ? `agriai_selected_farm_id_${effectiveUserId}`
      : "agriai_selected_farm_id";
    const stored = localStorage.getItem(key) || localStorage.getItem("agriai_selected_farm_id");
    if (stored && farms.some((f) => f.id === stored)) {
      return stored;
    }
    return farms[0].id;
  } catch {
    return farms[0].id;
  }
}

export function saveSelectedFarmId(id: string, userId?: string | null) {
  const effectiveUserId = userId !== undefined ? userId : getActiveUserId();
  if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
    memoryUserSelectedFarmId[effectiveUserId] = id;
  } else {
    memorySelectedFarmId = id;
  }

  if (typeof window === "undefined") {
    return;
  }

  try {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      localStorage.setItem(`agriai_selected_farm_id_${effectiveUserId}`, id);
    }
    localStorage.setItem("agriai_selected_farm_id", id);
    window.dispatchEvent(new Event("agriai:farms-updated"));
  } catch (err) {
    console.error("Failed to save selected farm ID", err);
  }
}

export function getSelectedFarm(userId?: string | null): Farm | null {
  const farms = getStoredFarms(userId);
  if (farms.length === 0) return null;
  const selectedId = getSelectedFarmId(userId);
  return farms.find((f) => f.id === selectedId) || farms[0] || null;
}

export function getStoredAlerts(userId?: string | null): AlertItem[] {
  const effectiveUserId = userId !== undefined ? userId : getActiveUserId();
  if (typeof window === "undefined") {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      return [];
    }
    return DEFAULT_ALERTS;
  }
  try {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      const userRaw = localStorage.getItem(`${STORAGE_KEYS.ALERTS}_${effectiveUserId}`);
      if (userRaw !== null) return JSON.parse(userRaw);
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (raw !== null) return JSON.parse(raw);

    const authStatus = localStorage.getItem('agriai_auth_status');
    if (authStatus === 'supabase_authenticated' || authStatus === 'custom_authenticated') {
      return [];
    }
    return DEFAULT_ALERTS;
  } catch {
    return effectiveUserId && effectiveUserId !== DEMO_FARMER_ID ? [] : DEFAULT_ALERTS;
  }
}

export function saveStoredAlerts(alerts: AlertItem[], userId?: string | null) {
  const effectiveUserId = userId !== undefined ? userId : getActiveUserId();
  if (typeof window === "undefined") return;
  try {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      localStorage.setItem(`${STORAGE_KEYS.ALERTS}_${effectiveUserId}`, JSON.stringify(alerts));
    }
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (err) {
    console.error("Failed to save alerts to localStorage", err);
  }
}

let memoryFarmer: FarmerProfile | null = null;
const memoryUserFarmers: Record<string, FarmerProfile> = {};

export function getStoredFarmer(userId?: string | null): FarmerProfile {
  const effectiveUserId = userId !== undefined ? userId : getActiveUserId();

  if (typeof window === "undefined") {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      return memoryUserFarmers[effectiveUserId] || {
        name: "Farmer",
        phone: "",
        email: "",
        location: "",
        state: "",
        district: "",
        farmSizeAcres: 0,
        primaryCrop: "",
        soilType: "",
        preferredLanguage: "en",
      };
    }
    return memoryFarmer || DEFAULT_FARMER;
  }

  try {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      const userRaw = localStorage.getItem(`${STORAGE_KEYS.FARMER}_${effectiveUserId}`);
      if (userRaw) return JSON.parse(userRaw);
      return {
        name: "Farmer",
        phone: "",
        email: "",
        location: "",
        state: "",
        district: "",
        farmSizeAcres: 0,
        primaryCrop: "",
        soilType: "",
        preferredLanguage: "en",
      };
    }

    const authStatus = localStorage.getItem('agriai_auth_status');
    if (authStatus === 'supabase_authenticated' || authStatus === 'custom_authenticated') {
      const raw = localStorage.getItem(STORAGE_KEYS.FARMER);
      if (raw) return JSON.parse(raw);
      return {
        name: "Farmer",
        phone: "",
        email: "",
        location: "",
        state: "",
        district: "",
        farmSizeAcres: 0,
        primaryCrop: "",
        soilType: "",
        preferredLanguage: "en",
      };
    }

    const raw = localStorage.getItem(STORAGE_KEYS.FARMER);
    return raw ? JSON.parse(raw) : DEFAULT_FARMER;
  } catch {
    return effectiveUserId && effectiveUserId !== DEMO_FARMER_ID
      ? {
          name: "Farmer",
          phone: "",
          email: "",
          location: "",
          state: "",
          district: "",
          farmSizeAcres: 0,
          primaryCrop: "",
          soilType: "",
          preferredLanguage: "en",
        }
      : DEFAULT_FARMER;
  }
}

export function saveStoredFarmer(farmer: FarmerProfile, userId?: string | null) {
  const effectiveUserId = userId !== undefined ? userId : getActiveUserId();

  if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
    memoryUserFarmers[effectiveUserId] = farmer;
  } else {
    memoryFarmer = farmer;
  }

  if (typeof window === "undefined") {
    return;
  }
  try {
    if (effectiveUserId && effectiveUserId !== DEMO_FARMER_ID) {
      localStorage.setItem(`${STORAGE_KEYS.FARMER}_${effectiveUserId}`, JSON.stringify(farmer));
    }
    localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(farmer));
    window.dispatchEvent(new Event("agriai:profile-updated"));
  } catch (err) {
    console.error("Failed to save farmer to localStorage", err);
  }
}

export const DEFAULT_DIAGNOSIS: CropDoctorResult = {
  id: "diag-rust-01",
  timestamp: "Just now",
  crop: "Wheat",
  healthScore: 72,
  disease: "Leaf Rust",
  scientificName: "Puccinia triticina",
  severity: "Moderate",
  confidence: 94,
  explanation:
    "AI analysis indicates possible leaf rust symptoms. The detected pattern is consistent with a moderate level of infection. Monitor nearby plants and follow locally approved agricultural guidance.",
  disclaimer:
    "Prototype AI result. This is not a professional agricultural diagnosis. Follow local agricultural guidance before treatment.",
  recommendations: [
    "Follow locally approved fungicide guidance.",
    "Monitor nearby plants for similar symptoms.",
    "Avoid excessive irrigation.",
    "Remove severely affected plant material where appropriate.",
    "Recheck crop health in 3–5 days.",
  ],
  healthBreakdown: {
    leafHealth: 72,
    soilCondition: 80,
    waterStress: 65,
    diseaseRisk: 58,
    weatherRisk: 30,
  },
  imageUrl:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  affectedAreaPercentage: 18,
};

let memoryDiagnosis: CropDoctorResult | null = null;

export function getStoredDiagnosis(): CropDoctorResult {
  if (typeof window === "undefined") return memoryDiagnosis || DEFAULT_DIAGNOSIS;
  try {
    const raw = localStorage.getItem("agriai_last_diagnosis");
    return raw ? JSON.parse(raw) : (memoryDiagnosis || DEFAULT_DIAGNOSIS);
  } catch {
    return memoryDiagnosis || DEFAULT_DIAGNOSIS;
  }
}

export function saveStoredDiagnosis(diagnosis: CropDoctorResult) {
  memoryDiagnosis = diagnosis;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("agriai_last_diagnosis", JSON.stringify(diagnosis));
    window.dispatchEvent(new CustomEvent("agriai:diagnosis-updated", { detail: diagnosis }));
  } catch (err) {
    console.error("Failed to save diagnosis to localStorage", err);
  }
}
