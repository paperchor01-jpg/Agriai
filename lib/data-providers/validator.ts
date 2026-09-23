import { DataQualityReport } from './types';

/**
 * Validates meteorological observations against physical boundaries.
 */
export function validateWeatherObservation(data: any): DataQualityReport {
  const checksPassed: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (typeof data.temperatureC !== 'number' || isNaN(data.temperatureC)) {
    warnings.push('Temperature is missing or not a valid number');
    score -= 30;
  } else if (data.temperatureC < -20 || data.temperatureC > 60) {
    warnings.push(`Temperature ${data.temperatureC}°C is outside realistic Indian climate range (-20 to 60°C)`);
    score -= 25;
  } else {
    checksPassed.push('Temperature within physical range');
  }

  if (typeof data.humidityPercent !== 'number' || isNaN(data.humidityPercent)) {
    warnings.push('Humidity is missing');
    score -= 20;
  } else if (data.humidityPercent < 0 || data.humidityPercent > 100) {
    warnings.push(`Humidity ${data.humidityPercent}% outside 0-100% boundary`);
    score -= 20;
  } else {
    checksPassed.push('Humidity within 0-100%');
  }

  if (typeof data.rainfallMm !== 'number' || data.rainfallMm < 0) {
    warnings.push('Rainfall observation is invalid or negative');
    score -= 15;
  } else {
    checksPassed.push('Rainfall non-negative numeric value');
  }

  if (!Array.isArray(data.forecastDays) || data.forecastDays.length === 0) {
    warnings.push('No forecast days provided');
    score -= 20;
  } else {
    checksPassed.push(`Forecast days count (${data.forecastDays.length}) verified`);
  }

  return {
    isValid: score >= 50 && warnings.length <= 2,
    confidenceScore: Math.max(0, Math.min(100, score)),
    checksPassed,
    warnings,
    validationTimestamp: new Date().toISOString(),
  };
}

/**
 * Validates APMC Mandi commodity market prices against agricultural market norms.
 */
export function validateMarketPrice(data: any): DataQualityReport {
  const checksPassed: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!data.commodity || typeof data.commodity !== 'string') {
    warnings.push('Commodity name is missing');
    score -= 30;
  } else {
    checksPassed.push('Commodity identifier present');
  }

  if (typeof data.modalPrice !== 'number' || data.modalPrice <= 0) {
    warnings.push('Modal price must be a positive integer/float in ₹/quintal');
    score -= 40;
  } else {
    checksPassed.push('Modal price is positive number');
  }

  if (data.minPrice && data.maxPrice) {
    if (data.minPrice > data.maxPrice) {
      warnings.push(`Min price (${data.minPrice}) cannot exceed Max price (${data.maxPrice})`);
      score -= 55;
    } else if (data.modalPrice < data.minPrice || data.modalPrice > data.maxPrice) {
      warnings.push(`Modal price (${data.modalPrice}) is outside [min, max] range [${data.minPrice}, ${data.maxPrice}]`);
      score -= 55;
    } else {
      checksPassed.push('Price bounds (min <= modal <= max) verified');
    }
  }

  if (!data.state || !data.district) {
    warnings.push('Geographical location (state, district) is incomplete');
    score -= 15;
  } else {
    checksPassed.push('Location hierarchy verified');
  }

  return {
    isValid: score >= 50 && warnings.length <= 1,
    confidenceScore: Math.max(0, Math.min(100, score)),
    checksPassed,
    warnings,
    validationTimestamp: new Date().toISOString(),
  };
}

/**
 * Validates Soil Test Profile against agronomic chemistry bounds.
 */
export function validateSoilProfile(data: any): DataQualityReport {
  const checksPassed: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (typeof data.ph !== 'number' || isNaN(data.ph)) {
    warnings.push('Soil pH is required');
    score -= 30;
  } else if (data.ph < 3.0 || data.ph > 11.0) {
    warnings.push(`Soil pH (${data.ph}) is outside arable soil limits (3.0 - 11.0)`);
    score -= 25;
  } else {
    checksPassed.push('Soil pH within arable range (3.0 - 11.0)');
  }

  if (data.organicCarbonPercent !== undefined) {
    if (data.organicCarbonPercent < 0 || data.organicCarbonPercent > 15) {
      warnings.push(`Organic carbon (${data.organicCarbonPercent}%) is atypical for mineral agricultural soil`);
      score -= 10;
    } else {
      checksPassed.push('Organic carbon percentage verified');
    }
  }

  if (data.electricalConductivityDsm !== undefined) {
    if (data.electricalConductivityDsm < 0 || data.electricalConductivityDsm > 30) {
      warnings.push('Electrical conductivity is outside typical boundary');
      score -= 10;
    } else {
      checksPassed.push('Electrical conductivity (EC) verified');
    }
  }

  return {
    isValid: score >= 50,
    confidenceScore: Math.max(0, Math.min(100, score)),
    checksPassed,
    warnings,
    validationTimestamp: new Date().toISOString(),
  };
}

export const dataValidator = {
  validateWeather: validateWeatherObservation,
  validateWeatherObservation,
  validateMarketPrice,
  validateSoilProfile,
};

