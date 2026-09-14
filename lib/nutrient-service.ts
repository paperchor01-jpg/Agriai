import { Farm, NutrientAdvisorData, NutrientLevel } from '@/types';

export const nutrientService = {
  getNutrientAdvice(farm: Farm): NutrientAdvisorData {
    const soil = farm.soil;
    const crop = farm.crop?.name || "Crop";
    const ph = soil?.ph ?? 6.8;
    
    // Check whether farmer provided specific laboratory values or standard estimates
    const hasSoilTest = Boolean(soil && soil.ph && soil.nitrogen && soil.phosphorus && soil.potassium);

    let phStatus: "Acidic" | "Neutral" | "Alkaline" | "Optimal" = "Optimal";
    if (ph < 6.0) phStatus = "Acidic";
    else if (ph > 7.8) phStatus = "Alkaline";
    else if (ph >= 6.5 && ph <= 7.5) phStatus = "Optimal";
    else phStatus = "Neutral";

    const nStatus = (soil?.nitrogen || "Medium") as string;
    const pStatus = (soil?.phosphorus || "Medium") as string;
    const kStatus = (soil?.potassium || "Medium") as string;

    const nitrogenLevel: NutrientLevel = {
      level: (nStatus === "High" ? "High" : nStatus === "Low" ? "Low" : "Optimal") as any,
      recommendation: nStatus === "Low"
        ? `Apply split application of Urea / Neem-Coated Urea in 2–3 doses matching ${crop} vegetative surge.`
        : nStatus === "High"
        ? `Reduce basal Nitrogen application by 20% to prevent excessive vegetative lodging and pest susceptibility.`
        : `Apply standard recommended dose (RDF) in splits: 50% basal, 25% at tillering, 25% at panicle/flower initiation.`
    };

    const phosphorusLevel: NutrientLevel = {
      level: (pStatus === "High" ? "High" : pStatus === "Low" ? "Low" : "Optimal") as any,
      recommendation: pStatus === "Low"
        ? `Apply Single Super Phosphate (SSP) or DAP @ 50 kg/acre as basal dose placed near root zone.`
        : `Apply maintenance dose of SSP/DAP to support robust root architecture.`
    };

    const potassiumLevel: NutrientLevel = {
      level: (kStatus === "High" ? "High" : kStatus === "Low" ? "Low" : "Optimal") as any,
      recommendation: kStatus === "Low"
        ? `Apply MOP (Muriate of Potash) @ 25-30 kg/acre to improve disease resilience and grain quality.`
        : `Potassium status is balanced. Maintain standard soil health practices.`
    };

    const recommendations: string[] = [
      `Maintain balanced NPK ratio (typically 4:2:1 for cereals, 1:2:1 for pulses).`,
      ph < 6.2 
        ? `Apply agricultural lime (calcium carbonate) @ 200 kg/acre to neutralize acidic soil.`
        : ph > 8.0 
        ? `Apply gypsum @ 250 kg/acre to reclaim alkaline soil structure and improve permeability.`
        : `Soil pH (${ph}) is optimal for broad micronutrient availability (Zinc, Iron, Manganese).`,
      `Incorporate secondary nutrient Zinc Sulphate (21% Zn) @ 10 kg/acre once every 2 years.`
    ];

    const organicAlternatives: string[] = [
      `Well-rotted Farm Yard Manure (FYM) @ 4–5 tonnes/acre before final ploughing.`,
      `Vermicompost @ 1.5 tonnes/acre enriched with Trichoderma viride.`,
      `Neem Cake @ 100 kg/acre for slow-release Nitrogen and soil pest suppression.`,
      `Bio-fertilizer seed treatment: Azotobacter / Rhizobium + PSB (Phosphate Solubilizing Bacteria).`
    ];

    const disclaimer = hasSoilTest
      ? "Calculated based on your recorded soil health parameters."
      : "Estimated from regional soil baseline. We strongly recommend getting a laboratory Soil Health Card test from your nearest KVK or Agri lab.";

    return {
      hasSoilTest,
      soilPh: ph,
      phStatus,
      nitrogen: nitrogenLevel,
      phosphorus: phosphorusLevel,
      potassium: potassiumLevel,
      recommendations,
      organicAlternatives,
      disclaimer
    };
  }
};
