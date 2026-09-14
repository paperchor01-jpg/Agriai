import { Farm, WeatherData, IrrigationAdvisorData } from '@/types';

export const irrigationService = {
  getIrrigationAdvice(farm: Farm, weather?: WeatherData | null): IrrigationAdvisorData {
    const moisture = farm.soil?.moisture ?? 58;
    const soilType = farm.soil?.soilType || farm.soilType || "Loamy";
    const stage = farm.crop?.stage || "Vegetative";
    const method = farm.practices?.irrigationMethod || "Drip";
    const rainChance = weather?.current?.rainChance ?? weather?.rainChance ?? 10;
    const rainExpectedNext48hMm = rainChance > 70 ? 25 : rainChance > 40 ? 8 : 0;

    let status: "Adequate" | "Irrigation Needed" | "High Moisture / Hold Off" = "Adequate";
    let waterStressLevel: "Low" | "Medium" | "High" = "Low";
    let recommendation = "";
    let timing = "Routine monitoring";

    if (rainExpectedNext48hMm >= 15) {
      status = "High Moisture / Hold Off";
      waterStressLevel = "Low";
      recommendation = `Hold off on irrigation. Significant rainfall (~${rainExpectedNext48hMm} mm) forecast over next 48 hours will recharge the root zone naturally.`;
      timing = "Suspend watering for 2–3 days";
    } else if (moisture < 42) {
      status = "Irrigation Needed";
      waterStressLevel = "High";
      recommendation = `Immediate irrigation recommended. Soil moisture is critical (${moisture}%), causing potential stomatal closure and vegetative slowdown.`;
      timing = "Run irrigation early morning (6:00 AM – 9:00 AM)";
    } else if (moisture < 52) {
      status = "Irrigation Needed";
      waterStressLevel = "Medium";
      recommendation = `Plan next irrigation cycle within 24–36 hours to maintain optimal moisture during the ${stage} phase.`;
      timing = "Tomorrow early morning or late afternoon";
    } else if (moisture > 75) {
      status = "High Moisture / Hold Off";
      waterStressLevel = "Low";
      recommendation = `Soil moisture is high (${moisture}%). Hold further irrigation to avoid root hypoxia and fungal proliferation.`;
      timing = "Pause watering until moisture drops below 65%";
    } else {
      status = "Adequate";
      waterStressLevel = "Low";
      recommendation = `Moisture levels are optimal (${moisture}%) for healthy transpiration and nutrient uptake.`;
      timing = "Maintain current cycle";
    }

    // Method-specific advice
    let methodSpecificAdvice = "";
    if (method.toLowerCase().includes("drip")) {
      methodSpecificAdvice = `Drip System: Run at 1.2–1.5 bar operating pressure for 2.5 hours. Add water-soluble fertigation (19:19:19) during the final 30 minutes.`;
    } else if (method.toLowerCase().includes("sprinkler")) {
      methodSpecificAdvice = `Sprinkler System: Operate during low-wind morning hours to minimize evaporative loss and droplet drift.`;
    } else if (method.toLowerCase().includes("canal") || method.toLowerCase().includes("flood")) {
      methodSpecificAdvice = `Furrow / Flood: Irrigate alternate furrows to save 30% water and prevent soil compaction. Ensure field drainage channels are clear.`;
    } else {
      methodSpecificAdvice = `Rainfed Plot: Use organic mulch or in-situ crop residue retention to minimize moisture evaporation from soil surface.`;
    }

    const waterConservationTip = `Mulching with dry biomass or using micro-drip systems reduces irrigation demand by up to 35% while suppressing weed growth.`;

    return {
      status,
      soilMoisturePercent: moisture,
      soilType,
      cropStage: stage,
      rainExpectedNext48hMm,
      waterStressLevel,
      recommendation,
      timing,
      methodSpecificAdvice,
      waterConservationTip
    };
  }
};
