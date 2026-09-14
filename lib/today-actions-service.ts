import { Farm, WeatherData, TodayActionItem } from '@/types';

export const todayActionsService = {
  getTodayActions(farm: Farm, weather?: WeatherData | null): TodayActionItem[] {
    const actions: TodayActionItem[] = [];
    const crop = farm.crop?.name || "Crop";
    const stage = farm.crop?.stage || "Vegetative";
    const moisture = farm.soil?.moisture ?? 55;
    const rainChance = weather?.current?.rainChance ?? weather?.rainChance ?? 15;
    const temp = weather?.current?.temperature ?? weather?.temperature ?? 28;
    const windSpeed = weather?.current?.windSpeedKmH ?? weather?.windSpeedKmH ?? 12;

    // 1. Weather / Spraying Decision
    if (rainChance >= 60) {
      actions.push({
        id: "act-weather-rain",
        priority: "HIGH",
        action: "Postpone Foliar Spraying & Chemical Applications",
        reason: `High probability of rainfall (${rainChance}%) will wash away foliar nutrients or pesticides before absorption.`,
        timeframe: "Next 24–48 Hours",
        relevantData: `Forecast Rain Chance: ${rainChance}% | Temp: ${temp}°C`,
        category: "Weather Prep"
      });
    } else if (windSpeed > 22) {
      actions.push({
        id: "act-weather-wind",
        priority: "MEDIUM",
        action: "Avoid High-Pressure Spraying Due to Wind Drift",
        reason: `Wind speeds of ${windSpeed} km/h cause excessive chemical drift and uneven field coverage.`,
        timeframe: "Today Morning / Evening",
        relevantData: `Wind Speed: ${windSpeed} km/h (Threshold: 20 km/h)`,
        category: "Crop Care"
      });
    }

    // 2. Irrigation Action based on Soil Moisture & Rain
    if (moisture < 45 && rainChance < 40) {
      actions.push({
        id: "act-irrigation-needed",
        priority: "HIGH",
        action: `Schedule ${farm.practices?.irrigationMethod || 'Micro'}-Irrigation for ${crop}`,
        reason: `Soil moisture is depleted to ${moisture}%, approaching root stress threshold for the ${stage} stage.`,
        timeframe: "Before 11:00 AM or after 4:00 PM",
        relevantData: `Soil Moisture: ${moisture}% (Target: 60-70%) | Rain Chance: ${rainChance}%`,
        category: "Irrigation"
      });
    } else if (moisture > 78) {
      actions.push({
        id: "act-irrigation-excess",
        priority: "MEDIUM",
        action: "Inspect Field Drainage & Avoid Additional Water Input",
        reason: `Soil moisture is at ${moisture}%. Excess saturation inhibits root respiration and promotes fungal pathogens.`,
        timeframe: "Immediate Inspection",
        relevantData: `Soil Moisture: ${moisture}% (Saturation Risk > 75%)`,
        category: "Irrigation"
      });
    } else {
      actions.push({
        id: "act-irrigation-optimal",
        priority: "LOW",
        action: "Maintain Soil Moisture Monitoring",
        reason: `Current soil moisture (${moisture}%) is well within the healthy root zone range.`,
        timeframe: "Next Check in 2 Days",
        relevantData: `Soil Moisture: ${moisture}% | Adequate`,
        category: "Irrigation"
      });
    }

    // 3. Stage-Specific Crop Care Action
    if (stage.toLowerCase().includes("vegetative") || stage.toLowerCase().includes("tillering")) {
      actions.push({
        id: "act-stage-veg",
        priority: "MEDIUM",
        action: `Top-Dress Balanced Nitrogen & Scout for Early Defoliators`,
        reason: `${crop} is in active ${stage} development requiring adequate nitrogen for canopy synthesis.`,
        timeframe: "Morning Hours (7:00 AM – 10:00 AM)",
        relevantData: `Stage: ${stage} | Practice: ${farm.practices?.fertilizerPractice || 'Split Application'}`,
        category: "Nutrients"
      });
    } else if (stage.toLowerCase().includes("flowering")) {
      actions.push({
        id: "act-stage-flower",
        priority: "HIGH",
        action: `Maintain Consistent Moisture & Avoid Stress at Flowering`,
        reason: `Flowering is the most sensitive phenological phase; moisture or heat stress can cause flower drop.`,
        timeframe: "Throughout Current Week",
        relevantData: `Stage: ${stage} | High Sensitivity Phase`,
        category: "Crop Care"
      });
    } else if (stage.toLowerCase().includes("grain") || stage.toLowerCase().includes("maturity") || stage.toLowerCase().includes("harvest")) {
      actions.push({
        id: "act-stage-harvest",
        priority: "MEDIUM",
        action: `Check Grain Moisture & Plan Harvest Logistics`,
        reason: `Approaching maturity stage. Monitor moisture to ensure harvest at optimal grain hardness (14–18% moisture).`,
        timeframe: "Within 3–5 Days",
        relevantData: `Stage: ${stage} | Maturity Monitoring`,
        category: "Crop Care"
      });
    } else {
      actions.push({
        id: "act-stage-seedling",
        priority: "MEDIUM",
        action: `Inspect Seedling Emergence & Stand Uniformity`,
        reason: `Verify uniform germination rate across all quadrants of your ${farm.areaAcres}-acre plot.`,
        timeframe: "Today",
        relevantData: `Plot Size: ${farm.areaAcres} Acres | Stage: ${stage}`,
        category: "Crop Care"
      });
    }

    // 4. Pest & Disease Surveillance
    actions.push({
      id: "act-pest-scout",
      priority: temp > 30 && moisture > 65 ? "HIGH" : "LOW",
      action: `Scout Under-Canopy Leaves for Sucking Pests & Fungal Spots`,
      reason: `Warm temperature (${temp}°C) combined with moisture creates conducive conditions for micro-pest breeding.`,
      timeframe: "Early Evening (4:30 PM – 6:00 PM)",
      relevantData: `Temp: ${temp}°C | Humidity: ${weather?.current?.humidity ?? 60}%`,
      category: "Pest & Disease"
    });

    return actions.slice(0, 4);
  }
};
