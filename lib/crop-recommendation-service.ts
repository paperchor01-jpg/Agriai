import { Farm, CropRecommendation, CropRecommendationResult } from '@/types';

interface CropProfile {
  cropName: string;
  scientificName: string;
  seasons: string[];
  waterRequirement: "Low" | "Medium" | "High";
  suitableSoils: string[];
  minPh: number;
  maxPh: number;
  optimalPhMin: number;
  optimalPhMax: number;
  durationDays: number;
  yieldRangeQuintalsPerAcre: string;
  marketDemand: "Strong Demand" | "Moderate" | "Volatile";
  bestPractices: string[];
  keyRisks: string[];
}

const INDIAN_CROP_KNOWLEDGE_BASE: CropProfile[] = [
  {
    cropName: "Wheat",
    scientificName: "Triticum aestivum",
    seasons: ["Rabi", "Winter"],
    waterRequirement: "Medium",
    suitableSoils: ["Loamy", "Clayey", "Alluvial", "Sandy Loam", "Clay Loam"],
    minPh: 5.8,
    maxPh: 8.0,
    optimalPhMin: 6.2,
    optimalPhMax: 7.5,
    durationDays: 130,
    yieldRangeQuintalsPerAcre: "18 - 25 Q/acre",
    marketDemand: "Strong Demand",
    bestPractices: ["Line sowing at 20cm spacing", "Apply balanced NPK 120:60:40", "Crown root irrigation at 21 days"],
    keyRisks: ["Terminal heat stress during grain fill", "Yellow rust if unmonitored"]
  },
  {
    cropName: "Paddy (Rice)",
    scientificName: "Oryza sativa",
    seasons: ["Kharif", "Monsoon"],
    waterRequirement: "High",
    suitableSoils: ["Clayey", "Clay Loam", "Alluvial", "Loamy"],
    minPh: 5.5,
    maxPh: 7.8,
    optimalPhMin: 6.0,
    optimalPhMax: 7.0,
    durationDays: 135,
    yieldRangeQuintalsPerAcre: "22 - 32 Q/acre",
    marketDemand: "Strong Demand",
    bestPractices: ["Transplanting 21-day seedlings", "Maintain 2-5cm standing water in early vegetative stage", "Split Nitrogen application"],
    keyRisks: ["Stem borer infestation", "Bacterial leaf blight in humid conditions"]
  },
  {
    cropName: "Cotton",
    scientificName: "Gossypium hirsutum",
    seasons: ["Kharif"],
    waterRequirement: "Medium",
    suitableSoils: ["Black Soil", "Regur Soil", "Clayey", "Loamy", "Deep Alluvial"],
    minPh: 6.0,
    maxPh: 8.2,
    optimalPhMin: 6.5,
    optimalPhMax: 7.8,
    durationDays: 160,
    yieldRangeQuintalsPerAcre: "8 - 14 Q/acre",
    marketDemand: "Strong Demand",
    bestPractices: ["Drip irrigation with fertigation", "Scout for pink bollworm", "Maintain 90x60cm spacing"],
    keyRisks: ["Whitefly & pink bollworm attacks", "Waterlogging sensitivity in seedling stage"]
  },
  {
    cropName: "Mustard (Sarson)",
    scientificName: "Brassica juncea",
    seasons: ["Rabi"],
    waterRequirement: "Low",
    suitableSoils: ["Sandy Loam", "Loamy", "Alluvial", "Clay Loam"],
    minPh: 6.0,
    maxPh: 8.0,
    optimalPhMin: 6.5,
    optimalPhMax: 7.5,
    durationDays: 110,
    yieldRangeQuintalsPerAcre: "6 - 10 Q/acre",
    marketDemand: "Strong Demand",
    bestPractices: ["Pre-sowing irrigation", "Sulphur application @ 20kg/ha for oil content", "Aphid monitoring at flowering"],
    keyRisks: ["Aphid attack during cloudy weather", "Frost during pod formation"]
  },
  {
    cropName: "Gram (Chickpea / Chana)",
    scientificName: "Cicer arietinum",
    seasons: ["Rabi"],
    waterRequirement: "Low",
    suitableSoils: ["Sandy Loam", "Loamy", "Black Soil", "Alluvial"],
    minPh: 6.0,
    maxPh: 8.0,
    optimalPhMin: 6.5,
    optimalPhMax: 7.5,
    durationDays: 115,
    yieldRangeQuintalsPerAcre: "7 - 12 Q/acre",
    marketDemand: "Strong Demand",
    bestPractices: ["Seed treatment with Rhizobium & Trichoderma", "Nipping at 35-40 DAS to promote branching", "Light irrigation at pod development"],
    keyRisks: ["Wilt disease in heavy waterlogged soils", "Pod borer (Helicoverpa)"]
  },
  {
    cropName: "Maize (Corn)",
    scientificName: "Zea mays",
    seasons: ["Kharif", "Rabi", "Zaid"],
    waterRequirement: "Medium",
    suitableSoils: ["Loamy", "Sandy Loam", "Alluvial", "Clay Loam", "Red Soil"],
    minPh: 5.8,
    maxPh: 7.8,
    optimalPhMin: 6.2,
    optimalPhMax: 7.2,
    durationDays: 105,
    yieldRangeQuintalsPerAcre: "20 - 30 Q/acre",
    marketDemand: "Moderate",
    bestPractices: ["Ridge and furrow planting", "Fall Armyworm pheromone trap monitoring", "Zinc sulphate soil application"],
    keyRisks: ["Fall Armyworm defoliation", "Waterlogging at knee-high stage"]
  },
  {
    cropName: "Soybean",
    scientificName: "Glycine max",
    seasons: ["Kharif"],
    waterRequirement: "Medium",
    suitableSoils: ["Black Soil", "Clayey", "Loamy", "Clay Loam"],
    minPh: 6.0,
    maxPh: 7.5,
    optimalPhMin: 6.3,
    optimalPhMax: 7.0,
    durationDays: 95,
    yieldRangeQuintalsPerAcre: "8 - 14 Q/acre",
    marketDemand: "Strong Demand",
    bestPractices: ["Broadbed furrow planting for drainage", "Biofertilizer seed inoculation", "Timely weed management in first 30 days"],
    keyRisks: ["Yellow mosaic virus", "Excess continuous rain at maturity"]
  },
  {
    cropName: "Bajra (Pearl Millet)",
    scientificName: "Pennisetum glaucum",
    seasons: ["Kharif", "Zaid"],
    waterRequirement: "Low",
    suitableSoils: ["Sandy", "Sandy Loam", "Red Soil", "Loamy"],
    minPh: 6.0,
    maxPh: 8.5,
    optimalPhMin: 6.5,
    optimalPhMax: 8.0,
    durationDays: 85,
    yieldRangeQuintalsPerAcre: "12 - 18 Q/acre",
    marketDemand: "Strong Demand",
    bestPractices: ["Minimal irrigation requirement", "Thrives in warm climates", "Excellent drought tolerance"],
    keyRisks: ["Ergot and blast in humid periods", "Bird damage at dough stage"]
  },
  {
    cropName: "Tomato",
    scientificName: "Solanum lycopersicum",
    seasons: ["Rabi", "Kharif", "Zaid"],
    waterRequirement: "Medium",
    suitableSoils: ["Loamy", "Sandy Loam", "Red Soil", "Black Soil"],
    minPh: 6.0,
    maxPh: 7.5,
    optimalPhMin: 6.2,
    optimalPhMax: 6.8,
    durationDays: 120,
    yieldRangeQuintalsPerAcre: "100 - 180 Q/acre",
    marketDemand: "Volatile",
    bestPractices: ["Staking for indeterminate varieties", "Drip irrigation with calcium fertigation", "Mulching to conserve moisture"],
    keyRisks: ["Early/Late blight in humid weather", "Price fluctuations in local mandis"]
  }
];

export const cropRecommendationService = {
  getRecommendationsForFarm(farm: Farm): CropRecommendationResult {
    const soilType = farm.soil?.soilType || farm.soilType || "Loamy";
    const soilPh = farm.soil?.ph ?? 6.8;
    const irrigation = farm.irrigationAvailability || farm.practices?.irrigationMethod || "Available";
    
    // Determine current agricultural season based on month
    const currentMonth = new Date().getMonth() + 1; // 1-12
    let currentSeason = "Kharif";
    if (currentMonth >= 10 || currentMonth <= 3) {
      currentSeason = "Rabi";
    } else if (currentMonth >= 4 && currentMonth <= 6) {
      currentSeason = "Zaid";
    }

    const scoredCrops = INDIAN_CROP_KNOWLEDGE_BASE.map(crop => {
      let score = 50;
      const whyFactors: string[] = [];
      const riskFactors: string[] = [];

      // 1. Season Match (weight: 25)
      if (crop.seasons.includes(currentSeason) || crop.seasons.includes("Year-Round")) {
        score += 25;
        whyFactors.push(`Optimal timing for ${currentSeason} season in your agro-zone.`);
      } else {
        score -= 15;
        riskFactors.push(`Off-season for ${currentSeason} (optimal: ${crop.seasons.join(', ')}).`);
      }

      // 2. Soil Type Match (weight: 25)
      const soilMatch = crop.suitableSoils.some(s => s.toLowerCase().includes(soilType.toLowerCase()) || soilType.toLowerCase().includes(s.toLowerCase()));
      if (soilMatch) {
        score += 20;
        whyFactors.push(`Excellent match with your farm's ${soilType} soil texture.`);
      } else {
        score += 5;
        riskFactors.push(`${soilType} soil is sub-optimal; requires soil conditioning.`);
      }

      // 3. Soil pH Match (weight: 20)
      if (soilPh >= crop.optimalPhMin && soilPh <= crop.optimalPhMax) {
        score += 20;
        whyFactors.push(`Soil pH (${soilPh}) is in the optimal range (${crop.optimalPhMin} - ${crop.optimalPhMax}).`);
      } else if (soilPh >= crop.minPh && soilPh <= crop.maxPh) {
        score += 10;
        whyFactors.push(`Soil pH (${soilPh}) is acceptable (${crop.minPh} - ${crop.maxPh}).`);
      } else {
        score -= 10;
        riskFactors.push(`Soil pH ${soilPh} is outside optimal range (${crop.optimalPhMin}-${crop.optimalPhMax}); lime or gypsum amendment required.`);
      }

      // 4. Irrigation Match (weight: 20)
      if (irrigation === "Available") {
        score += 15;
        whyFactors.push(`Sufficient water access supports ${crop.waterRequirement.toLowerCase()} water requirement.`);
      } else if (irrigation === "Limited") {
        if (crop.waterRequirement === "Low" || crop.waterRequirement === "Medium") {
          score += 12;
          whyFactors.push(`Low-to-medium water requirement is well-suited for limited irrigation.`);
        } else {
          score -= 15;
          riskFactors.push(`High water demand risks yield deficit under limited irrigation.`);
        }
      } else {
        // Rainfed
        if (crop.waterRequirement === "Low") {
          score += 15;
          whyFactors.push(`Drought resilience makes it suitable for rainfed cultivation.`);
        } else {
          score -= 25;
          riskFactors.push(`Requires reliable water source; high risk for rainfed cultivation.`);
        }
      }

      // Normalization
      const finalScore = Math.min(98, Math.max(25, score));

      const recommendation: CropRecommendation = {
        cropName: crop.cropName,
        scientificName: crop.scientificName,
        suitabilityScore: finalScore,
        season: crop.seasons.join(' / '),
        waterRequirement: crop.waterRequirement,
        soilSuitability: `${soilType} (${soilMatch ? 'Highly Compatible' : 'Moderate'})`,
        expectedDurationDays: crop.durationDays,
        estimatedYieldRange: crop.yieldRangeQuintalsPerAcre,
        whyFactors,
        riskFactors,
        recommendedPractices: crop.bestPractices,
        marketOutlook: crop.marketDemand
      };

      return recommendation;
    });

    // Sort by suitability score descending
    scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    return {
      farmId: farm.id,
      farmName: farm.name,
      season: currentSeason,
      soilType,
      soilPh,
      irrigationAvailability: irrigation,
      topRecommendations: scoredCrops.slice(0, 4),
      generatedAt: new Date().toISOString()
    };
  }
};
