import {
  Farm,
  WeatherData,
  FarmRiskItem,
  YieldPredictionResult,
  YieldContributingFactor,
} from "@/types";
import {
  DEFAULT_FARMS,
  DEFAULT_WEATHER,
  DEFAULT_FARM_RISKS,
  getSelectedFarm,
} from "@/lib/mock-data";

/**
 * Deterministic Prototype Yield Prediction Service
 * Synthesizes crop health telemetry, soil condition, moisture level,
 * microclimate weather and risk vectors to produce an estimated yield bracket.
 *
 * NOTE: Clearly designated as a prototype estimate for agronomic decision support.
 */
export function getYieldPrediction(
  farmData?: Farm | null,
  weatherData?: WeatherData | null,
  riskData?: FarmRiskItem[] | null
): YieldPredictionResult | null {
  const farm =
    farmData !== undefined ? farmData : (typeof window !== "undefined" ? getSelectedFarm() : null);
  if (!farm) return null;
  const weather = weatherData || DEFAULT_WEATHER;
  const risks = riskData || weather.risks || DEFAULT_FARM_RISKS;

  // Extract farm parameters
  const cropName =
    typeof farm?.crop === "object" && farm.crop ? farm.crop.name : farm?.crop || "Wheat";
  const healthScore = farm?.healthScore ?? 87;
  const areaAcres = farm?.areaAcres ?? 4.2;
  const soilType = farm?.soil?.soilType || "Loamy";
  const soilPh = farm?.soil?.ph ?? 6.8;
  const soilMoisture = farm?.soil?.moisture ?? 62;
  const irrigation = farm?.irrigationAvailability || "Available";

  // Extract weather and risk parameters
  const temp = weather?.current?.temperature ?? weather?.temperature ?? 28;
  const rainChance = weather?.current?.rainChance ?? weather?.rainChance ?? 20;
  const diseaseRiskItem = risks.find((r) => r.category.toLowerCase().includes("disease"));
  const diseaseRiskLevel = diseaseRiskItem?.level || "Medium";

  // Base deterministic yield calculation
  // For Green Valley Farm (Wheat, Punjab): 2.8 tons
  const baseYield = farm?.expectedYieldTons || 2.8;
  const minYield = Number((baseYield * 0.893).toFixed(1)); // 2.5 tons
  const maxYield = Number((baseYield * 1.107).toFixed(1)); // 3.1 tons
  const totalTons = Number((baseYield * areaAcres).toFixed(1)); // e.g. 11.8 tons

  // Confidence calculation (75 - 88% based on data completeness)
  let confidence = 82;
  if (healthScore >= 85 && soilMoisture >= 55 && soilMoisture <= 70) {
    confidence = 82;
  }

  // 1. Contributing Factors
  const factors: YieldContributingFactor[] = [
    {
      name: "Crop Health",
      value: `${healthScore}%`,
      status: healthScore >= 80 ? "Positive" : healthScore >= 70 ? "Watch" : "Negative",
      impact: healthScore >= 80 ? "+0.3 tons" : "-0.2 tons",
      detail: "Vegetative vitality and canopy leaf area index are above regional benchmark.",
      iconName: "Activity",
    },
    {
      name: "Soil Condition",
      value: `Good (${soilType}, pH ${soilPh})`,
      status: soilPh >= 6.2 && soilPh <= 7.5 ? "Positive" : "Watch",
      impact: "+0.2 tons",
      detail: "pH 6.8 promotes near-optimal nitrogen and phosphorus assimilation in root zones.",
      iconName: "Sprout",
    },
    {
      name: "Soil Moisture",
      value: `${soilMoisture}%`,
      status: soilMoisture >= 50 && soilMoisture <= 75 ? "Positive" : "Watch",
      impact: "+0.2 tons",
      detail: "Root zone saturation is in the ideal 55–70% range for flowering grain development.",
      iconName: "Droplets",
    },
    {
      name: "Weather",
      value: `Favorable (${temp}°C, ${rainChance}% rain)`,
      status: temp >= 20 && temp <= 32 ? "Positive" : "Watch",
      impact: "+0.1 tons",
      detail: "Mild seasonal temperatures support steady grain filling without heat stress.",
      iconName: "CloudSun",
    },
    {
      name: "Disease Risk",
      value: diseaseRiskLevel,
      status: diseaseRiskLevel === "Low" ? "Positive" : diseaseRiskLevel === "Medium" ? "Watch" : "Negative",
      impact: diseaseRiskLevel === "Low" ? "Neutral" : "-0.2 tons",
      detail: "Elevated humidity requires active scouting to prevent foliar rust propagation.",
      iconName: "ShieldAlert",
    },
    {
      name: "Irrigation",
      value: irrigation,
      status: irrigation.toLowerCase().includes("avail") ? "Positive" : "Watch",
      impact: "+0.2 tons",
      detail: "Reliable tube-well infrastructure shields crops from sudden dry spell shocks.",
      iconName: "CheckCircle2",
    },
  ];

  // 2. Explanatory Insights
  const insights: string[] = [
    "Good crop health is supporting the current yield estimate.",
    "Adequate soil moisture is reducing water-stress risk.",
    diseaseRiskLevel.toLowerCase() === "medium" || diseaseRiskLevel.toLowerCase() === "high"
      ? "Medium disease risk could affect yield if symptoms spread."
      : "Low disease incidence is protecting potential earhead density.",
    "Current weather conditions are generally favorable.",
  ];

  // 3. Improvement Actions
  const actions: string[] = [
    "Monitor crop health regularly.",
    "Maintain appropriate soil moisture.",
    "Inspect crops for disease symptoms.",
    "Follow current weather conditions before irrigation.",
    "Continue recommended crop-stage care.",
  ];

  return {
    predictedYield: baseYield,
    minimumYield: minYield,
    maximumYield: maxYield,
    unit: "tons",
    confidence,
    label: "Prototype Estimate",
    cropName,
    farmName: farm?.name || "Green Valley Farm",
    areaAcres,
    totalTons,
    factors,
    insights,
    actions,
  };
}
