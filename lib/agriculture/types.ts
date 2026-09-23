/**
 * AgriAI Verified Agricultural Knowledge Types
 * Grounded in ICAR (Indian Council of Agricultural Research) & State Agricultural University publications.
 */

export interface AgronomicCropProfile {
  cropName: string;
  botanicalName: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
  commonVarieties: string[];
  suitableSoilTypes: string[];
  optimalPhRange: [number, number];
  temperatureRangeC: [number, number];
  criticalHighTempC: number;
  criticalLowTempC: number;
  waterRequirementMm: [number, number];
  sowingWindow: string;
  harvestWindow: string;
  growthStages: Array<{
    stageName: string;
    durationDays: [number, number];
    waterSensitivity: 'Low' | 'Medium' | 'Critical';
    managementFocus: string;
  }>;
  // Recommended Dose of Fertilizers (RDF) in kg/acre
  rdfKgPerAcre: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    zincSulphate?: number;
    applicationSplits: string[];
  };
  commonPests: string[];
  commonDiseases: string[];
  sourceReference: string;
}

export interface VerifiedPestDiseaseGuide {
  id: string;
  crop: string;
  conditionName: string;
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Insect/Pest' | 'Nutritional Deficiency';
  scientificName?: string;
  visibleSymptoms: string[];
  affectedPlantParts: ('Leaves' | 'Stem' | 'Root' | 'Flower' | 'Grain / Fruit')[];
  conduciveConditions: {
    minHumidityPercent?: number;
    tempRangeC?: [number, number];
    waterlogging?: boolean;
  };
  preventiveMeasures: string[];
  integratedPestManagement: string[];
  certifiedSource: string;
}
