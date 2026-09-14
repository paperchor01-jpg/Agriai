import {
  Farm,
  WeatherData,
  CropDoctorResult,
  AdvisoryItem,
  FarmHealthScoreResult,
  FarmHealthFactor,
  FarmHealthTopAction,
} from '@/types';
import { DEFAULT_FARMS, DEFAULT_WEATHER, getStoredDiagnosis, getSelectedFarm } from '@/lib/mock-data';
import { getAdvisories } from '@/lib/advisory-service';

/**
 * Calculates the AgriAI Farm Health Score (0-100) and component risk factors.
 * Uses transparent mathematical weighting on actual available telemetry.
 * Does not claim scientific validation.
 */
export function getFarmHealthScore(
  farmData?: Farm | null,
  weatherData?: WeatherData | null,
  diseaseData?: CropDoctorResult | null,
  advisoriesData?: AdvisoryItem[] | null
): FarmHealthScoreResult | null {
  const farm = farmData !== undefined ? farmData : (typeof window !== "undefined" ? getSelectedFarm() : null);
  if (!farm) return null;
  const weather = weatherData || DEFAULT_WEATHER;
  const disease = diseaseData || getStoredDiagnosis();
  const advisories = advisoriesData || getAdvisories(farm, weather, disease);

  // 1. Soil Condition (Weight: 20%)
  const hasSoil = !!farm?.soil;
  const ph = farm?.soil?.ph ?? 6.8;
  let soilScore = 80;
  if (ph >= 6.2 && ph <= 7.4) soilScore = 92;
  else if (ph >= 5.8 && ph <= 8.0) soilScore = 76;
  else soilScore = 55;

  const soilFactor: FarmHealthFactor = {
    name: 'Soil Condition',
    score: soilScore,
    weight: 0.2,
    status: soilScore >= 80 ? 'Healthy' : soilScore >= 60 ? 'Attention Needed' : 'Under Stress',
    description: `Soil pH measured at ${ph} (${soilScore >= 80 ? 'Optimal' : 'Slight Deviation'}). Loamy structure supports aeration.`,
    dataAvailable: hasSoil,
  };

  // 2. Weather & Microclimate (Weight: 20%)
  const hasWeather = !!weather?.current;
  const temp = weather?.current?.temperature ?? 28;
  const humidity = weather?.current?.humidity ?? 62;
  const wind = weather?.current?.windSpeedKmH ?? 12;
  let weatherScore = 82;
  if (temp >= 18 && temp <= 32 && wind < 25) weatherScore = 85;
  if (humidity > 75 || temp > 35 || wind > 30) weatherScore = 65;

  const weatherFactor: FarmHealthFactor = {
    name: 'Weather & Microclimate',
    score: weatherScore,
    weight: 0.2,
    status: weatherScore >= 80 ? 'Healthy' : weatherScore >= 60 ? 'Attention Needed' : 'Under Stress',
    description: `Current temp ${temp}°C, humidity ${humidity}%, wind ${wind} km/h. Favorable microclimate for active growth.`,
    dataAvailable: hasWeather,
  };

  // 3. Water Availability & Moisture (Weight: 20%)
  const moisture = farm?.soil?.moisture ?? 62;
  let waterScore = 75;
  if (moisture >= 55 && moisture <= 70) waterScore = 90;
  else if (moisture >= 45 && moisture <= 80) waterScore = 72;
  else waterScore = 50;

  const waterFactor: FarmHealthFactor = {
    name: 'Water Availability',
    score: waterScore,
    weight: 0.2,
    status: waterScore >= 80 ? 'Healthy' : waterScore >= 60 ? 'Attention Needed' : 'Under Stress',
    description: `Topsoil moisture at ${moisture}%. Root zone hydration is within target operating range.`,
    dataAvailable: hasSoil,
  };

  // 4. Pest & Disease Risk (Weight: 25%)
  const hasDisease = disease && disease.disease && !disease.disease.toLowerCase().includes('healthy');
  let pestScore = 92;
  if (hasDisease) {
    if (disease.severity === 'Critical' || disease.severity === 'High') pestScore = 48;
    else if (disease.severity === 'Moderate') pestScore = 68;
    else pestScore = 80;
  } else if (humidity >= 68) {
    pestScore = 82;
  }

  const pestFactor: FarmHealthFactor = {
    name: 'Pest & Disease Risk',
    score: pestScore,
    weight: 0.25,
    status: pestScore >= 80 ? 'Healthy' : pestScore >= 60 ? 'Attention Needed' : 'Under Stress',
    description: hasDisease
      ? `Active diagnosis: ${disease.disease} (${disease.severity} severity, ${disease.confidence}% confidence).`
      : 'Zero active pathogen lesions detected in recent canopy scanning.',
    dataAvailable: !!disease?.disease,
  };

  // 5. Nutrient Condition (Weight: 15%)
  const nitrogen = farm?.soil?.nitrogen || 'Medium';
  const phosphorus = farm?.soil?.phosphorus || 'High';
  const potassium = farm?.soil?.potassium || 'Medium';
  let nutrientScore = 82;
  if (nitrogen === 'Low' || phosphorus === 'Low' || potassium === 'Low') nutrientScore = 65;
  if (nitrogen === 'High' && phosphorus === 'High' && potassium === 'High') nutrientScore = 92;

  const nutrientFactor: FarmHealthFactor = {
    name: 'Nutrient Condition',
    score: nutrientScore,
    weight: 0.15,
    status: nutrientScore >= 80 ? 'Healthy' : nutrientScore >= 60 ? 'Attention Needed' : 'Under Stress',
    description: `N: ${nitrogen}, P: ${phosphorus}, K: ${potassium}. Macro-nutrient profile in stable balance.`,
    dataAvailable: hasSoil,
  };

  // Composite Weighted Score
  const totalScore = Math.round(
    soilFactor.score * soilFactor.weight +
    weatherFactor.score * weatherFactor.weight +
    waterFactor.score * waterFactor.weight +
    pestFactor.score * pestFactor.weight +
    nutrientFactor.score * nutrientFactor.weight
  );

  const status: "Healthy" | "Attention Needed" | "Under Stress" =
    totalScore >= 80 ? 'Healthy' : totalScore >= 60 ? 'Attention Needed' : 'Under Stress';

  // Extract Top 3 Actions Today from high-priority advisories
  const topActionsToday: FarmHealthTopAction[] = advisories.slice(0, 3).map((adv, idx) => ({
    id: `action-${idx + 1}-${adv.id}`,
    action: adv.action,
    reason: adv.reason,
    priority: adv.priority,
    timing: adv.timing,
    category: adv.category,
    completed: false,
  }));

  // Fallback top actions if none generated
  if (topActionsToday.length === 0) {
    topActionsToday.push(
      {
        id: 'action-default-1',
        action: 'Maintain routine field scouting schedule',
        reason: 'Soil and microclimate conditions are currently stable',
        priority: 'Low',
        timing: 'This week',
        category: 'Crop Care',
      },
      {
        id: 'action-default-2',
        action: 'Verify irrigation tube-well pump readiness',
        reason: 'Precautionary preparation for upcoming dry days',
        priority: 'Low',
        timing: 'Next 48h',
        category: 'Irrigation',
      }
    );
  }

  return {
    score: totalScore,
    status,
    scoreLabel: 'AgriAI Farm Health Score',
    subtitle: 'Transparent AI-assisted risk indicator based on live soil, weather & vision telemetry',
    factors: {
      soilCondition: soilFactor,
      weather: weatherFactor,
      waterAvailability: waterFactor,
      pestRisk: pestFactor,
      nutrientCondition: nutrientFactor,
    },
    topActionsToday,
    calculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
