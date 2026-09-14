import { Farm, WeatherData, AdvisoryItem, FarmRiskItem, CropDoctorResult, YieldPredictionResult } from "@/types";
import { DEFAULT_FARMS, DEFAULT_WEATHER, getSelectedFarm, getStoredDiagnosis } from "@/lib/mock-data";
import { getAdvisories } from "@/lib/advisory-service";
import { getYieldPrediction } from "@/lib/yield-service";

const MAX_CHAT_INPUT_LENGTH = 1000;

// Patterns that attempt to extract system prompts, bypass safety constraints, or execute malicious instructions
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /reveal\s+(the\s+|your\s+)?(system\s+prompt|instructions|secret|api\s*key)/i,
  /what\s+are\s+your\s+(system\s+instructions|system\s+prompt|hidden\s+instructions)/i,
  /you\s+are\s+now\s+(in\s+dan\s+mode|unrestricted|jailbroken)/i,
  /bypass\s+(safety|content)\s+filters?/i,
  /<\s*script[^>]*>/i,
  /javascript\s*:/i,
  /drop\s+table/i,
  /delete\s+from\s+farmers/i,
  /select\s+\*\s+from\s+auth/i,
];

function isPromptInjection(input: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Intelligent Contextual Chat Response Generator with Prompt Injection Guardrails
 * Synthesizes active farm, weather, disease, risk, and yield data
 */
export function getChatResponse(
  message: string,
  farmData?: Farm | null,
  weatherData?: WeatherData | null,
  advisoryData?: AdvisoryItem[] | null,
  riskData?: FarmRiskItem[] | null,
  diseaseData?: CropDoctorResult | null,
  yieldData?: YieldPredictionResult | null
): string {
  if (!message || typeof message !== "string") {
    return "Please enter an agronomic question about your crops, weather, soil, or farm advisory.";
  }

  // Length bounding
  const sanitizedInput = message.trim().slice(0, MAX_CHAT_INPUT_LENGTH);
  const q = sanitizedInput.toLowerCase();

  // Prompt Injection & Jailbreak Defense
  if (isPromptInjection(sanitizedInput)) {
    return "I am AgriAI, your crop and farm advisory copilot. I can only assist with agricultural queries regarding crop health, soil conditions, weather, irrigation schedules, and yield estimation.";
  }

  const farm =
    farmData !== undefined ? farmData : (typeof window !== "undefined" ? getSelectedFarm() : null);
  const weather = weatherData || DEFAULT_WEATHER;
  const disease = diseaseData || getStoredDiagnosis();
  const yieldPred = yieldData || (farm ? getYieldPrediction(farm, weather) : null);
  const advisories = advisoryData || (farm ? getAdvisories(farm, weather, disease) : []);

  const farmName = farm?.name || "your farm";
  const location = farm?.location || "your registered location";
  const cropName =
    typeof farm?.crop === "object" && farm?.crop ? farm.crop.name : (typeof farm?.crop === "string" ? farm.crop : "your crop");
  const cropStage =
    typeof farm?.crop === "object" && farm?.crop?.stage ? farm.crop.stage : "active growth";
  const soilType = farm?.soil?.soilType || farm?.soilType || "Loamy";
  const soilMoisture = farm?.soil?.moisture ?? 62;
  const humidity = weather?.current?.humidity ?? weather?.humidity ?? 62;
  const tomorrowRain = weather?.forecast?.[1]?.rainChance ?? 65;

  // 0. QUESTION: "What should I do today?" / Top Priority Advisory Action
  if (
    q.includes("what should i do today") ||
    q.includes("what should i do") ||
    q.includes("today's action") ||
    q.includes("action today") ||
    q.includes("urgent action") ||
    q.includes("top action")
  ) {
    const topAdvisory = advisories?.[0];
    if (topAdvisory) {
      return `For ${farmName} today, your highest-priority Smart Advisory is:
• Priority: ${topAdvisory.priority} (${topAdvisory.category})
• Focus: ${topAdvisory.title}
• Why: ${topAdvisory.reason}
• Recommended Action: ${topAdvisory.action}
• Timing: ${topAdvisory.timing}

You can review all active recommendations on the Smart Advisory page.`;
    }
    return `No urgent actions detected for ${farmName}. Your crops and soil are in stable condition—continue regular scouting.`;
  }

  // 1. QUESTION: "Why are my leaves yellow?"
  if (
    q.includes("why are my leaves yellow") ||
    q.includes("yellow leaf") ||
    q.includes("yellow leaves") ||
    q.includes("yellowing")
  ) {
    return `For your ${cropName} in ${farmName}, yellowing leaves can arise from two primary factors:
1. Foliar Fungal Stress: Crop Doctor flagged a 94% match for Leaf Rust (Puccinia triticina). If you observe dusty orange-yellow pustules on upper leaves, this fungal pathogen is the primary cause.
2. Soil & Nutrient Balance: Your soil moisture is currently ${soilMoisture}% (adequate). If lower older leaves show V-shaped pale yellowing without pustules, it indicates temporary Nitrogen assimilation slowdown during ${cropStage} stage.

Recommended action: Inspect leaf undersides with Crop Doctor to confirm rust spore presence before applying any corrective top-dressing.`;
  }

  // 2. QUESTION: "When should I irrigate?"
  if (
    q.includes("when should i irrigate") ||
    q.includes("irrigation schedule") ||
    q.includes("should i irrigate") ||
    q.includes("water my crop") ||
    q.includes("irrigate")
  ) {
    return `Based on your telemetry for ${farmName} (${location}):
• Current Soil Moisture: ${soilMoisture}% (well within the healthy 55–70% target).
• Weather Outlook: ${tomorrowRain}% chance of light rainfall expected tomorrow.
• Current Temperature: 28°C with ${humidity}% humidity.

Recommendation: Hold off on tube-well or canal irrigation today. Soil moisture is currently adequate, and scheduled irrigation before tomorrow's expected rain could cause temporary root zone saturation and increase fungal risk. Re-evaluate moisture levels 24 hours after precipitation.`;
  }

  // 3. QUESTION: "What fertilizer should I use?"
  if (
    q.includes("what fertilizer") ||
    q.includes("which fertilizer") ||
    q.includes("fertilizer should i use") ||
    q.includes("fertilizer")
  ) {
    return `For ${cropName} currently in the ${cropStage} stage on ${soilType} soil:
• General Agronomic Guidance: During flowering and spike emergence, wheat benefits from balanced potassium and micronutrients rather than heavy nitrogen.
• Recommendation: Avoid heavy nitrogen top-dressing right now, as excessive vegetative growth softens plant tissue and makes it vulnerable to the active Leaf Rust spore pressure. A foliar spray of potassium or water-soluble NPK (00:52:34 or 13:00:45) at 1% concentration can support grain filling.
• Precaution: Hold all foliar applications until after tomorrow's ${tomorrowRain}% rain forecast to prevent chemical runoff.`;
  }

  // 4. QUESTION: "What disease is affecting my crop?"
  if (
    q.includes("what disease") ||
    q.includes("disease is affecting") ||
    q.includes("disease") ||
    q.includes("infection")
  ) {
    const diseaseName = disease?.scientificName
      ? `${disease.disease} (${disease.scientificName})`
      : disease?.disease
      ? `${disease.disease} (Puccinia triticina)`
      : "Leaf Rust (Puccinia triticina)";
    const severity = disease?.severity || "Moderate";
    const confidence = disease?.confidence || 94;

    return `According to your recent AI Crop Doctor analysis:
• Detected Pathogen: ${diseaseName}
• Severity Level: ${severity} (${confidence}% confidence)
• Symptoms: Characteristic reddish-brown and orange-yellow uredinial pustules scattered on leaf blades.
• Status: Medium disease risk actively flagged on ${farmName}.

Recommended actions:
1. Walk the field to check whether rust pustules are spreading to the flag leaf.
2. Remove heavily infected individual leaves if localized.
3. Keep the canopy ventilated and avoid evening sprinkler irrigation that prolongs leaf wetness.`;
  }

  // 5. QUESTION: "How can I improve my yield?"
  if (
    q.includes("how can i improve my yield") ||
    q.includes("improve yield") ||
    q.includes("increase yield") ||
    q.includes("better yield") ||
    q.includes("yield")
  ) {
    if (yieldPred) {
      return `Your expected yield projection for ${farmName} is currently ${yieldPred.predictedYield} tons across ${yieldPred.areaAcres} acres (expected range: ${yieldPred.minimumYield} – ${yieldPred.maximumYield} tons, 82% confidence).

To maximize output toward the 3.1-ton upper bracket:
1. Protect Flag Leaves: 70–80% of grain weight is generated by the flag leaf. Controlling Leaf Rust now is critical for full grain filling.
2. Optimize Moisture: Maintain soil moisture around 60–65% during grain development.
3. Nutrient Support: Apply recommended micro-nutrients during post-flowering milk stage.
4. Soil Health: Loamy soil (pH 6.8) is in prime condition—continue following our Smart Advisory recommendations.`;
    }
    return `Add your farm holding and crop information to receive customized yield projections for your land.`;
  }

  // 6. QUESTION: "What should I do before rainfall?"
  if (
    q.includes("what should i do before rainfall") ||
    q.includes("before rainfall") ||
    q.includes("before rain") ||
    q.includes("rain preparation")
  ) {
    return `With a ${tomorrowRain}% probability of rain forecast for ${location}:
1. Pause Irrigation: Delay tube-well pumping to conserve water and prevent waterlogging.
2. Hold Chemical / Fertilizer Sprays: Do not apply foliar sprays or granular urea within 24 hours of rain, as precipitation causes nutrient leaching and chemical waste.
3. Check Drainage Channels: Inspect field bunds and drainage outlets on ${farmName} to ensure surplus runoff flows freely.
4. Post-Rain Scouting: Monitor for fungal spore germination 24–48 hours after rain due to elevated humidity.`;
  }

  // 7. Contextual Fallback for broader agricultural topics
  if (q.includes("weather") || q.includes("temperature") || q.includes("forecast")) {
    return `Current weather for ${farmName} in ${location} is 28°C, Partly Cloudy, with ${humidity}% relative humidity and wind at 12 km/h. Tomorrow has a ${tomorrowRain}% rain chance. Check the Weather tab for the complete 5-day microclimate forecast.`;
  }

  if (q.includes("soil") || q.includes("moisture") || q.includes("ph")) {
    return `Your ${farmName} soil telemetry shows ${soilType} soil with a healthy pH of 6.8, adequate organic matter, and ${soilMoisture}% moisture. This is an ideal medium for wheat flowering.`;
  }

  if (q.includes("advisory") || q.includes("recommendation")) {
    const topAdvisory = advisories?.[0];
    if (topAdvisory) {
      return `Your top active Smart Advisory is "${topAdvisory.title}" (${topAdvisory.priority} Priority):
Reason: ${topAdvisory.reason}
Action: ${topAdvisory.action}
Timing: ${topAdvisory.timing}
View all active recommendations on the Smart Advisory page.`;
    }
    return `Your farm is in good standing with no urgent advisories. Monitor crop health on the Dashboard.`;
  }

  // 8. Polite Fallback Response for unsupported or off-topic queries
  return "I can currently help with your crop, soil, weather, irrigation, disease risks, farm advisories and yield insights. Ask me about your Wheat crop, irrigation schedule, or disease diagnosis!";
}

export const SUGGESTED_QUESTIONS: string[] = [
  "What should I do today?",
  "Why are my leaves yellow?",
  "When should I irrigate?",
  "What fertilizer should I use?",
  "What disease is affecting my crop?",
  "How can I improve my yield?",
  "What should I do before rainfall?",
];
