import { Farm, WeatherData, YieldPredictionResult } from "@/types";
import { DEFAULT_FARMS, DEFAULT_WEATHER, getSelectedFarm } from "@/lib/mock-data";
import { getYieldPrediction } from "@/lib/yield-service";

export interface HealthTrendPoint {
  day: string;
  score: number;
  benchmark: number;
}

export interface WaterUsagePoint {
  day: string;
  usage: number;
}

export interface DiseaseRiskPoint {
  day: string;
  risk: "Low" | "Medium" | "High";
  score: number;
}

export interface FarmAnalyticsData {
  farmName: string;
  cropName: string;
  location: string;
  summary: {
    cropHealth: number; // 87%
    waterUsageTotalLiters: string; // "1,240 L"
    diseaseRisk: string; // "Medium"
    expectedYield: string; // "2.8 tons"
  };
  healthTrend: HealthTrendPoint[];
  waterUsage: WaterUsagePoint[];
  diseaseRiskTrend: DiseaseRiskPoint[];
  expectedYield: {
    current: number; // 2.8
    range: string; // "2.5 – 3.1 tons"
    min: number; // 2.5
    max: number; // 3.1
    unit: string; // "tons"
  };
  insights: string[];
  disclaimer: string;
}

/**
 * Deterministic Prototype Analytics Service
 * Synthesizes 7-day crop health telemetry, weekly water consumption,
 * disease progression radar, and expected yield metrics.
 */
export function getFarmAnalytics(
  farmData?: Farm | null,
  weatherData?: WeatherData | null,
  yieldData?: YieldPredictionResult | null
): FarmAnalyticsData | null {
  const farm =
    farmData !== undefined ? farmData : (typeof window !== "undefined" ? getSelectedFarm() : null);
  if (!farm) return null;
  const weather = weatherData || DEFAULT_WEATHER;
  const yieldPred = yieldData || getYieldPrediction(farm, weather);
  if (!yieldPred) return null;

  const cropName =
    typeof farm?.crop === "object" && farm.crop ? farm.crop.name : farm?.crop || "Wheat";
  const healthScore = farm?.healthScore ?? 87;
  const diseaseRisk =
    weather?.risks?.find((r) => r.category.toLowerCase().includes("disease"))?.level || "Medium";

  // 1. Crop Health Over Time (Exact mock data requested: Day 1: 78% -> Day 7: 87%)
  const healthTrend: HealthTrendPoint[] = [
    { day: "Day 1", score: 78, benchmark: 76 },
    { day: "Day 2", score: 80, benchmark: 76 },
    { day: "Day 3", score: 82, benchmark: 77 },
    { day: "Day 4", score: 81, benchmark: 77 },
    { day: "Day 5", score: 84, benchmark: 78 },
    { day: "Day 6", score: 86, benchmark: 79 },
    { day: "Day 7", score: healthScore, benchmark: 80 },
  ];

  // 2. Weekly Water Usage (Exact mock data requested: Mon 180L, Tue 160L, Wed 210L, Thu 140L, Fri 190L, Sat 170L, Sun 190L -> Total = 1,240 L)
  const waterUsage: WaterUsagePoint[] = [
    { day: "Mon", usage: 180 },
    { day: "Tue", usage: 160 },
    { day: "Wed", usage: 210 },
    { day: "Thu", usage: 140 },
    { day: "Fri", usage: 190 },
    { day: "Sat", usage: 170 },
    { day: "Sun", usage: 190 },
  ];

  const totalWater = waterUsage.reduce((acc, curr) => acc + curr.usage, 0);

  // 3. Disease Risk Trend Over Time (Exact mock trend requested: Low -> Medium -> Medium -> Low -> Medium)
  const diseaseRiskTrend: DiseaseRiskPoint[] = [
    { day: "Mon", risk: "Low", score: 25 },
    { day: "Tue", risk: "Medium", score: 55 },
    { day: "Wed", risk: "Medium", score: 60 },
    { day: "Thu", risk: "Low", score: 30 },
    { day: "Fri", risk: "Medium", score: 50 },
  ];

  // 4. Farm Insights (Exact mock insights requested)
  const insights: string[] = [
    "Crop health has improved over the past week.",
    "Soil moisture is currently adequate.",
    "Disease risk should continue to be monitored.",
    "Current yield estimate remains within the expected range.",
  ];

  return {
    farmName: farm?.name || "Green Valley Farm",
    cropName,
    location: farm?.location || "Ludhiana, Punjab",
    summary: {
      cropHealth: healthScore,
      waterUsageTotalLiters: `${totalWater.toLocaleString()} L`,
      diseaseRisk,
      expectedYield: `${yieldPred.predictedYield} tons`,
    },
    healthTrend,
    waterUsage,
    diseaseRiskTrend,
    expectedYield: {
      current: yieldPred.predictedYield,
      range: `${yieldPred.minimumYield} – ${yieldPred.maximumYield} tons`,
      min: yieldPred.minimumYield,
      max: yieldPred.maximumYield,
      unit: "tons",
    },
    insights,
    disclaimer: "Prototype Analytics — Data simulated for demonstration & agronomic modeling.",
  };
}
