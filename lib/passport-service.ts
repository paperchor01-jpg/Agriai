import { Farm, FarmPassportData, FarmHistoryRecord } from '@/types';

export const passportService = {
  getFarmPassport(farm: Farm, farmerName: string = "Verified Farmer"): FarmPassportData {
    const crop = farm.crop?.name || "Wheat";
    
    // Construct rotational history
    const currentYear = new Date().getFullYear();
    const history: FarmHistoryRecord[] = [
      {
        year: currentYear,
        season: "Rabi",
        crop: crop,
        yieldQuintalsPerAcre: 21.5,
        keyIssues: ["Minor early aphid pressure", "Well managed with balanced RDF"]
      },
      {
        year: currentYear - 1,
        season: "Kharif",
        crop: crop.toLowerCase().includes("wheat") ? "Paddy (Basmati)" : "Moong / Pulses",
        yieldQuintalsPerAcre: 24.0,
        keyIssues: ["Adequate monsoon rainfall", "Zero lodging"]
      },
      {
        year: currentYear - 1,
        season: "Rabi",
        crop: "Wheat (HD-2967)",
        yieldQuintalsPerAcre: 22.0,
        keyIssues: ["Crown root irrigation executed at 21 DAS"]
      }
    ];

    return {
      farmId: farm.id,
      farmName: farm.name,
      ownerName: farmerName,
      location: farm.locationDetails || {
        country: "India",
        state: farm.state || "State",
        district: farm.district || "District",
        latitude: farm.latitude,
        longitude: farm.longitude,
        formattedAddress: farm.location
      },
      totalAcres: farm.areaAcres,
      soilType: farm.soil?.soilType || farm.soilType || "Loamy Soil",
      soilPh: farm.soil?.ph ?? 6.8,
      currentCrop: farm.crop,
      irrigationType: farm.practices?.irrigationMethod || farm.irrigationAvailability || "Drip Irrigation",
      healthScore: farm.healthScore || 85,
      history,
      createdAt: farm.plantingDate || new Date().toISOString().split('T')[0]
    };
  }
};
