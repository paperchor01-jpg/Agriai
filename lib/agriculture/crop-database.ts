import { AgronomicCropProfile } from './types';

/**
 * ICAR-Verified Crop Knowledge Database
 * Extracted from Indian Council of Agricultural Research (ICAR) packages of practices,
 * PAU (Punjab Agricultural University), and IARI (Indian Agricultural Research Institute).
 */
export const VERIFIED_CROP_PROFILES: Record<string, AgronomicCropProfile> = {
  wheat: {
    cropName: 'Wheat',
    botanicalName: 'Triticum aestivum',
    season: 'Rabi',
    commonVarieties: ['PBW-824', 'PBW-725', 'HD-3086 (Pusa Gautami)', 'HD-2967', 'DBW-187 (Karan Vandana)', 'DBW-303'],
    suitableSoilTypes: ['Loam', 'Sandy Loam', 'Clay Loam'],
    optimalPhRange: [6.0, 7.5],
    temperatureRangeC: [12, 25],
    criticalHighTempC: 32, // Terminal heat stress during grain filling
    criticalLowTempC: 3,
    waterRequirementMm: [450, 600],
    sowingWindow: 'October 25 to November 15 (Timely); up to December 10 (Late)',
    harvestWindow: 'April 1 to April 30',
    growthStages: [
      { stageName: 'Crown Root Initiation (CRI)', durationDays: [20, 25], waterSensitivity: 'Critical', managementFocus: 'First irrigation essential; apply 1/3rd Nitrogen' },
      { stageName: 'Tillering', durationDays: [40, 45], waterSensitivity: 'Medium', managementFocus: 'Weed management and secondary Nitrogen top-dress' },
      { stageName: 'Jointing / Stem Elongation', durationDays: [60, 65], waterSensitivity: 'Critical', managementFocus: 'Avoid moisture stress; canopy density inspection' },
      { stageName: 'Flowering / Anthesis', durationDays: [80, 90], waterSensitivity: 'Critical', managementFocus: 'Sensitive to heat stress; avoid spray during peak pollen shed' },
      { stageName: 'Milk & Dough (Grain Filling)', durationDays: [100, 120], waterSensitivity: 'Medium', managementFocus: 'Monitor for terminal heat and aphids' },
      { stageName: 'Maturity & Harvest', durationDays: [125, 140], waterSensitivity: 'Low', managementFocus: 'Stop irrigation 10-14 days before harvest' },
    ],
    rdfKgPerAcre: {
      nitrogen: 50, // ~110 kg Urea/acre
      phosphorus: 25, // ~55 kg DAP/acre
      potassium: 12, // ~20 kg MOP/acre
      zincSulphate: 10, // 21% ZnSO4 once in 2 years
      applicationSplits: [
        '50% Nitrogen + 100% Phosphorus + 100% Potassium as basal at sowing',
        '25% Nitrogen at First Irrigation (CRI stage)',
        '25% Nitrogen at Second Irrigation (Tillering stage)',
      ],
    },
    commonPests: ['Wheat Aphid (Sitobion avenae)', 'Armyworm', 'Termites'],
    commonDiseases: ['Yellow Rust (Puccinia striiformis)', 'Brown / Leaf Rust (Puccinia triticina)', 'Karnal Bunt', 'Powdery Mildew'],
    sourceReference: 'ICAR-IIWBR (Indian Institute of Wheat & Barley Research), Karnal',
  },

  paddy: {
    cropName: 'Paddy (Rice)',
    botanicalName: 'Oryza sativa',
    season: 'Kharif',
    commonVarieties: ['PR-126', 'PR-121', 'PR-131', 'Pusa Basmati 1121', 'Pusa Basmati 1509', 'Pusa Basmati 1718'],
    suitableSoilTypes: ['Clay', 'Clay Loam', 'Heavy Silt Loam'],
    optimalPhRange: [5.5, 7.2],
    temperatureRangeC: [22, 35],
    criticalHighTempC: 38,
    criticalLowTempC: 15,
    waterRequirementMm: [1100, 1500],
    sowingWindow: 'Nursery: May 15 - June 10; Transplanting: June 20 - July 10',
    harvestWindow: 'October 10 to November 15',
    growthStages: [
      { stageName: 'Seedling / Nursery', durationDays: [25, 30], waterSensitivity: 'Medium', managementFocus: 'Maintain shallow water layer; zinc nursery spray' },
      { stageName: 'Active Tillering', durationDays: [30, 50], waterSensitivity: 'Critical', managementFocus: 'Shallow ponding (2-3 cm); weed management' },
      { stageName: 'Panicle Initiation', durationDays: [60, 75], waterSensitivity: 'Critical', managementFocus: 'Nitrogen top dressing; water adequacy mandatory' },
      { stageName: 'Flowering & Heading', durationDays: [80, 95], waterSensitivity: 'Critical', managementFocus: 'Do not allow soil to dry; monitor stem borer' },
      { stageName: 'Grain Filling', durationDays: [100, 115], waterSensitivity: 'Medium', managementFocus: 'Alternate wetting and drying (AWD) to save water' },
      { stageName: 'Maturity / Ripening', durationDays: [120, 135], waterSensitivity: 'Low', managementFocus: 'Drain field 7-10 days before harvest' },
    ],
    rdfKgPerAcre: {
      nitrogen: 50,
      phosphorus: 12,
      potassium: 12,
      zincSulphate: 10,
      applicationSplits: [
        '1/3rd Nitrogen + all Phosphorus + all Potassium as basal dose',
        '1/3rd Nitrogen at 21 days after transplanting (Active Tillering)',
        '1/3rd Nitrogen at 42 days after transplanting (Panicle Initiation)',
      ],
    },
    commonPests: ['Yellow Stem Borer', 'Brown Plant Hopper (BPH)', 'Leaf Folder'],
    commonDiseases: ['Bacterial Leaf Blight (BLB)', 'Sheath Blight', 'Blast', 'False Smut'],
    sourceReference: 'ICAR-NRRI (National Rice Research Institute), Cuttack',
  },

  cotton: {
    cropName: 'Cotton',
    botanicalName: 'Gossypium hirsutum',
    season: 'Kharif',
    commonVarieties: ['Bt Cotton Hybrids (Bollgard II)', 'RCH-650', 'Ankur-3028'],
    suitableSoilTypes: ['Deep Black Cotton Soil (Regur)', 'Medium Deep Alluvial Loam'],
    optimalPhRange: [6.5, 8.2],
    temperatureRangeC: [21, 32],
    criticalHighTempC: 40,
    criticalLowTempC: 16,
    waterRequirementMm: [650, 900],
    sowingWindow: 'April 15 to May 15 (North Zone); June 15 to July 15 (Central/South)',
    harvestWindow: 'October 15 to January 31 (multiple pickings)',
    growthStages: [
      { stageName: 'Germination & Seedling', durationDays: [15, 25], waterSensitivity: 'Low', managementFocus: 'Thinning to single plant/hill; collar rot scouting' },
      { stageName: 'Square Formation', durationDays: [45, 60], waterSensitivity: 'Medium', managementFocus: 'Monitor sucking pests (whitefly, thrips, jassids)' },
      { stageName: 'Flowering & Boll Setting', durationDays: [70, 100], waterSensitivity: 'Critical', managementFocus: 'Moisture stress causes square/boll shedding; NPK spray' },
      { stageName: 'Boll Development & Bursting', durationDays: [110, 150], waterSensitivity: 'Medium', managementFocus: 'Dry weather preferred for clean fiber picking' },
    ],
    rdfKgPerAcre: {
      nitrogen: 60,
      phosphorus: 25,
      potassium: 25,
      zincSulphate: 10,
      applicationSplits: [
        '1/3rd Nitrogen + 100% P & K as basal',
        '1/3rd Nitrogen at squaring stage',
        '1/3rd Nitrogen at peak flowering stage',
      ],
    },
    commonPests: ['Pink Bollworm', 'Whitefly', 'American Bollworm', 'Jassids', 'Aphids'],
    commonDiseases: ['Cotton Leaf Curl Virus (CLCuV)', 'Bacterial Blight', 'Root Rot'],
    sourceReference: 'ICAR-CICR (Central Institute for Cotton Research), Nagpur',
  },

  mustard: {
    cropName: 'Mustard (Sarson)',
    botanicalName: 'Brassica juncea',
    season: 'Rabi',
    commonVarieties: ['Pusa Bold', 'RH-749', 'Giriraj', 'RLC-3', 'Pusa Mustard 30'],
    suitableSoilTypes: ['Sandy Loam', 'Light Loam'],
    optimalPhRange: [6.0, 7.8],
    temperatureRangeC: [15, 25],
    criticalHighTempC: 30,
    criticalLowTempC: 4,
    waterRequirementMm: [250, 400],
    sowingWindow: 'October 1 to October 25',
    harvestWindow: 'February 15 to March 20',
    growthStages: [
      { stageName: 'Vegetative & Branching', durationDays: [25, 35], waterSensitivity: 'Critical', managementFocus: 'First irrigation (flower primordia initiation); thin plants' },
      { stageName: 'Flowering', durationDays: [45, 65], waterSensitivity: 'Critical', managementFocus: 'Monitor for mustard aphids; avoid overhead irrigation' },
      { stageName: 'Siliqua (Pod) Development', durationDays: [70, 95], waterSensitivity: 'Medium', managementFocus: 'Second irrigation if soil dries; seed filling' },
      { stageName: 'Maturity & Harvest', durationDays: [110, 130], waterSensitivity: 'Low', managementFocus: 'Harvest when 75% pods turn golden yellowish' },
    ],
    rdfKgPerAcre: {
      nitrogen: 40,
      phosphorus: 20,
      potassium: 15,
      zincSulphate: 10,
      applicationSplits: [
        '50% Nitrogen + 100% P, K & Sulphur (20 kg/acre) as basal',
        '50% Nitrogen top-dressed at first irrigation (30-35 DAS)',
      ],
    },
    commonPests: ['Mustard Aphid (Lipaphis erysimi)', 'Sawfly', 'Painted Bug'],
    commonDiseases: ['White Rust (Albugo candida)', 'Alternaria Blight', 'Downy Mildew', 'Sclerotinia Rot'],
    sourceReference: 'ICAR-DRMR (Directorate of Rapeseed-Mustard Research), Bharatpur',
  },
};

export const cropKnowledgeService = {
  getCropProfile(cropName: string): AgronomicCropProfile {
    const lower = cropName.toLowerCase().trim();
    for (const [key, profile] of Object.entries(VERIFIED_CROP_PROFILES)) {
      if (lower.includes(key)) {
        return profile;
      }
    }
    return VERIFIED_CROP_PROFILES.wheat;
  },

  getAllVerifiedCrops(): string[] {
    return Object.values(VERIFIED_CROP_PROFILES).map((p) => p.cropName);
  },
};
