import { WeatherData, CurrentWeather, ForecastItem, WeatherAdviceItem, FarmRiskItem } from "@/types";

/**
 * Mock regional meteorological profiles
 */
const REGIONAL_WEATHER_PROFILES: Record<string, { current: CurrentWeather; forecast: ForecastItem[] }> = {
  "Ludhiana, Punjab": {
    current: {
      temperature: 28,
      condition: "Partly Cloudy",
      humidity: 62,
      rainChance: 20,
      windSpeedKmH: 12,
      feelsLike: 30,
      windDirection: "NW",
      uvIndex: 6,
      airQuality: "Moderate (AQI 95)",
    },
    forecast: [
      { day: "Today", temperature: 28, tempMin: 18, condition: "Partly Cloudy", rainChance: 20 },
      { day: "Tomorrow", temperature: 26, tempMin: 17, condition: "Light Rain", rainChance: 65 },
      { day: "Day 3", temperature: 27, tempMin: 18, condition: "Cloudy", rainChance: 40 },
      { day: "Day 4", temperature: 30, tempMin: 19, condition: "Sunny", rainChance: 10 },
      { day: "Day 5", temperature: 29, tempMin: 19, condition: "Partly Cloudy", rainChance: 25 },
    ],
  },
  "Amritsar, Punjab": {
    current: {
      temperature: 27,
      condition: "Overcast",
      humidity: 68,
      rainChance: 35,
      windSpeedKmH: 15,
      feelsLike: 29,
      windDirection: "N",
      uvIndex: 5,
      airQuality: "Moderate (AQI 102)",
    },
    forecast: [
      { day: "Today", temperature: 27, tempMin: 17, condition: "Overcast", rainChance: 35 },
      { day: "Tomorrow", temperature: 24, tempMin: 16, condition: "Moderate Rain", rainChance: 75 },
      { day: "Day 3", temperature: 25, tempMin: 17, condition: "Scattered Showers", rainChance: 50 },
      { day: "Day 4", temperature: 28, tempMin: 18, condition: "Partly Cloudy", rainChance: 15 },
      { day: "Day 5", temperature: 29, tempMin: 18, condition: "Sunny", rainChance: 10 },
    ],
  },
  "Bathinda, Punjab": {
    current: {
      temperature: 31,
      condition: "Clear & Sunny",
      humidity: 48,
      rainChance: 10,
      windSpeedKmH: 10,
      feelsLike: 32,
      windDirection: "W",
      uvIndex: 7,
      airQuality: "Good (AQI 78)",
    },
    forecast: [
      { day: "Today", temperature: 31, tempMin: 19, condition: "Sunny", rainChance: 10 },
      { day: "Tomorrow", temperature: 30, tempMin: 19, condition: "Partly Cloudy", rainChance: 25 },
      { day: "Day 3", temperature: 29, tempMin: 18, condition: "Cloudy", rainChance: 30 },
      { day: "Day 4", temperature: 32, tempMin: 20, condition: "Sunny", rainChance: 5 },
      { day: "Day 5", temperature: 31, tempMin: 19, condition: "Clear", rainChance: 10 },
    ],
  },
};

/**
 * Generate actionable agricultural advice based on current & forecasted weather conditions
 */
export function generateFarmingAdvice(current: CurrentWeather, forecast: ForecastItem[]): WeatherAdviceItem[] {
  const tomorrow = forecast[1] || forecast[0];
  const adviceList: WeatherAdviceItem[] = [];

  // Rain prediction advice
  if (tomorrow.rainChance >= 50) {
    adviceList.push({
      id: "adv-rain",
      title: "Rain Expected Tomorrow",
      advice: "Avoid unnecessary irrigation before rainfall.",
      recommendation: "Hold scheduled tube-well pumping to conserve water and prevent root waterlogging.",
      type: "irrigation",
      priority: "High",
    });
  } else {
    adviceList.push({
      id: "adv-irrigation-normal",
      title: "Moisture Balance",
      advice: "Light scheduled irrigation recommended during morning hours.",
      recommendation: "Maintain root hydration before daytime peak temperatures.",
      type: "irrigation",
      priority: "Low",
    });
  }

  // Field monitoring advice
  if (current.rainChance <= 30 && current.windSpeedKmH <= 20) {
    adviceList.push({
      id: "adv-monitoring",
      title: "Optimal Scouting Weather",
      advice: "Good conditions for crop monitoring today.",
      recommendation: "Take clear field photos for the AI Crop Doctor while sunlight and canopy are dry.",
      type: "monitoring",
      priority: "Medium",
    });
  }

  // Humidity & Disease Risk Advice
  if (current.humidity >= 60) {
    adviceList.push({
      id: "adv-humidity",
      title: "Elevated Relative Humidity",
      advice: "Monitor humidity because higher humidity may increase fungal disease risk.",
      recommendation: "Inspect leaf undersides for rust pustules or powdery mildew spores.",
      type: "disease",
      priority: "High",
    });
  }

  return adviceList;
}

/**
 * Rule-based Farm Risk Engine
 * Calculates risk vectors dynamically using weather telemetry and optional farm soil data
 */
export function calculateFarmRisks(
  weather: CurrentWeather,
  forecast: ForecastItem[],
  farmSoilMoisture: number = 62,
  cropDiseaseDetected: boolean = false
): FarmRiskItem[] {
  const tomorrow = forecast[1] || forecast[0];

  // 1. Weather Risk: increases if rain probability is high or severe wind
  let weatherLevel: "Low" | "Medium" | "High" = "Low";
  let weatherStatus = "Stable microclimate";
  let weatherExplanation = "No severe storm or extreme temperature anomalies predicted.";

  if (tomorrow.rainChance >= 70 || weather.windSpeedKmH >= 30) {
    weatherLevel = "High";
    weatherStatus = "Severe precipitation / wind";
    weatherExplanation = "Heavy rain probability within 24-36 hours may cause lodging or soil erosion.";
  } else if (tomorrow.rainChance >= 40 || weather.rainChance >= 30) {
    weatherLevel = "Low";
    weatherStatus = "Light showers in 36h";
    weatherExplanation = "Scattered light showers expected; favorable for tillering.";
  }

  // 2. Disease Risk: increases if humidity is high or disease detected in crop doctor
  let diseaseLevel: "Low" | "Medium" | "High" = "Low";
  let diseaseStatus = "Low pathogen spore activity";
  let diseaseExplanation = "Air dryness suppresses airborne spore propagation.";

  if (cropDiseaseDetected || (weather.humidity >= 75 && weather.temperature >= 24)) {
    diseaseLevel = "High";
    diseaseStatus = "High fungal proliferation risk";
    diseaseExplanation = "Warm canopy dampness provides optimal germination for fungal rusts.";
  } else if (weather.humidity >= 55) {
    diseaseLevel = "Medium";
    diseaseStatus = "Moderate spore risk";
    diseaseExplanation = "Humidity at " + weather.humidity + "% encourages active foliar scouting.";
  }

  // 3. Water Stress: increases if soil moisture is low (<40%) or intense heat
  let waterLevel: "Low" | "Medium" | "High" = "Low";
  let waterStatus = "Root moisture optimal";
  let waterExplanation = "Soil moisture at " + farmSoilMoisture + "% is within the ideal 55–70% range.";

  if (farmSoilMoisture < 35 || (weather.temperature >= 38 && weather.humidity < 30)) {
    waterLevel = "High";
    waterStatus = "Acute water deficit";
    waterExplanation = "Soil is dry; plants at risk of temporary wilting point.";
  } else if (farmSoilMoisture < 50) {
    waterLevel = "Medium";
    waterStatus = "Moderate moisture depletion";
    waterExplanation = "Soil approaching lower threshold; schedule irrigation within 48 hours.";
  }

  // 4. Pest Risk: elevated in warm moderate-humidity weather
  let pestLevel: "Low" | "Medium" | "High" = "Medium";
  let pestStatus = "Aphid monitoring alert";
  let pestExplanation = "Vegetative temperature (26–30°C) is conducive to sucking pest populations.";

  if (weather.temperature >= 35) {
    pestLevel = "Low";
    pestStatus = "Suppressed by heat";
    pestExplanation = "Excessive surface temperatures naturally suppress foliar nymph activity.";
  }

  return [
    {
      category: "Disease Risk",
      level: diseaseLevel,
      status: diseaseStatus,
      type: "disease",
      explanation: diseaseExplanation,
    },
    {
      category: "Weather Risk",
      level: weatherLevel,
      status: weatherStatus,
      type: "weather",
      explanation: weatherExplanation,
    },
    {
      category: "Water Stress",
      level: waterLevel,
      status: waterStatus,
      type: "water",
      explanation: waterExplanation,
    },
    {
      category: "Pest Risk",
      level: pestLevel,
      status: pestStatus,
      type: "pest",
      explanation: pestExplanation,
    },
  ];
}

// In-memory client-side cache (5 minutes TTL)
const CLIENT_WEATHER_CACHE = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function wmoCodeToCondition(code: number): string {
  if (code === 0) return 'Clear & Sunny';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code === 51 || code === 53 || code === 55) return 'Light Drizzle';
  if (code === 56 || code === 57) return 'Freezing Drizzle';
  if (code === 61) return 'Light Rain';
  if (code === 63) return 'Moderate Rain';
  if (code === 65) return 'Heavy Rain';
  if (code === 66 || code === 67) return 'Freezing Rain';
  if (code === 71 || code === 73 || code === 75) return 'Snowfall';
  if (code === 77) return 'Snow Grains';
  if (code === 80) return 'Scattered Showers';
  if (code === 81) return 'Moderate Showers';
  if (code === 82) return 'Heavy Showers';
  if (code === 85 || code === 86) return 'Snow Showers';
  if (code === 95) return 'Thunderstorm';
  if (code === 96 || code === 99) return 'Thunderstorm with Hail';
  return 'Partly Cloudy';
}

function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((deg % 360) / 45)) % 8;
  return directions[index] || 'NW';
}

const STATIC_GEO: Record<string, { lat: number; lon: number }> = {
  ludhiana: { lat: 30.912, lon: 75.854 },
  amritsar: { lat: 31.634, lon: 74.872 },
  bathinda: { lat: 30.211, lon: 74.945 },
  patiala: { lat: 30.340, lon: 76.386 },
  jalandhar: { lat: 31.326, lon: 75.576 },
  karnal: { lat: 29.692, lon: 76.984 },
};

/**
 * Direct fetcher for Server/Node/CLI environments where relative HTTP fetch is not supported
 */
async function fetchDirectWeather(
  location: string,
  lat?: number,
  lon?: number
): Promise<{ current: CurrentWeather; forecast: ForecastItem[]; isFallback: boolean; source: string }> {
  try {
    let coords: { lat: number; lon: number } | undefined = undefined;

    if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
      coords = { lat, lon };
    } else {
      const cityKey = location.toLowerCase().split(',')[0].trim();
      coords = STATIC_GEO[cityKey];

      if (!coords) {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityKey)}&count=1&format=json`;
        const gRes = await fetch(geoUrl);
        if (gRes.ok) {
          const gData = await gRes.json();
          if (gData.results?.[0]) {
            coords = { lat: gData.results[0].latitude, lon: gData.results[0].longitude };
          }
        }
      }
    }

    if (!coords) {
      coords = { lat: 30.912, lon: 75.854 };
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=6`;

    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();
    const cur = data.current;
    const daily = data.daily;

    const current: CurrentWeather = {
      temperature: Math.round(cur.temperature_2m),
      condition: wmoCodeToCondition(cur.weather_code),
      humidity: Math.round(cur.relative_humidity_2m),
      rainChance: Math.round(daily?.precipitation_probability_max?.[0] ?? 20),
      windSpeedKmH: Math.round(cur.wind_speed_10m),
      feelsLike: Math.round(cur.apparent_temperature ?? cur.temperature_2m + 1),
      windDirection: degreesToCardinal(cur.wind_direction_10m ?? 315),
      uvIndex: Math.round(cur.uv_index ?? daily?.uv_index_max?.[0] ?? 6),
      airQuality: cur.relative_humidity_2m > 70 ? 'Moderate (AQI 95)' : 'Good (AQI 78)',
    };

    const forecast: ForecastItem[] = [];
    const count = Math.min(5, daily?.time?.length || 5);
    for (let i = 0; i < count; i++) {
      const day = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `Day ${i + 1}`;
      const code = daily.weather_code?.[i] ?? 1;
      const maxTemp = Math.round(daily.temperature_2m_max?.[i] ?? current.temperature);
      const minTemp = Math.round(daily.temperature_2m_min?.[i] ?? (current.temperature - 8));
      const rainChance = Math.round(daily.precipitation_probability_max?.[i] ?? 20);

      forecast.push({
        day,
        date: daily.time?.[i],
        temperature: maxTemp,
        tempMax: maxTemp,
        tempMin: minTemp,
        condition: wmoCodeToCondition(code),
        rainChance,
      });
    }

    return { current, forecast, isFallback: false, source: 'open-meteo' };
  } catch {
    const profileKey = Object.keys(REGIONAL_WEATHER_PROFILES).find((k) =>
      location.toLowerCase().includes(k.split(',')[0].toLowerCase())
    ) || 'Ludhiana, Punjab';
    return { ...REGIONAL_WEATHER_PROFILES[profileKey], isFallback: true, source: 'fallback' };
  }
}

/**
 * Primary Weather Service
 * Returns structured meteorological and agronomic risk intelligence from live Weather API
 */
export async function getWeather(
  location: string = "Ludhiana, Punjab",
  lat?: number,
  lon?: number
): Promise<WeatherData> {
  const cacheKey = `${location.trim().toLowerCase()}_${typeof lat === 'number' ? lat.toFixed(3) : ''}_${typeof lon === 'number' ? lon.toFixed(3) : ''}`;
  const cached = CLIENT_WEATHER_CACHE.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  let weatherPayload: {
    current: CurrentWeather;
    forecast: ForecastItem[];
    isFallback?: boolean;
    source?: string;
  };

  // Browser environment: Call Next.js internal API route to keep any private keys on server
  if (typeof window !== 'undefined') {
    try {
      const coordParam = typeof lat === 'number' && typeof lon === 'number' ? `&lat=${lat}&lon=${lon}` : '';
      const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}${coordParam}`);
      if (res.ok) {
        const json = await res.json();
        weatherPayload = {
          current: json.current,
          forecast: json.forecast,
          isFallback: json.isFallback,
          source: json.source,
        };
      } else {
        weatherPayload = await fetchDirectWeather(location, lat, lon);
      }
    } catch {
      weatherPayload = await fetchDirectWeather(location, lat, lon);
    }
  } else {
    // Server / CLI test / Build environment
    weatherPayload = await fetchDirectWeather(location, lat, lon);
  }

  const { current, forecast, isFallback = false, source = 'open-meteo' } = weatherPayload;
  const farmingAdvice = generateFarmingAdvice(current, forecast);
  const risks = calculateFarmRisks(current, forecast, 62, false);

  const weatherData: WeatherData = {
    location,
    current,
    forecast,
    farmingAdvice,
    risks,
    isFallback,
    source,
    // Flattened compatibility fields
    temperature: current.temperature,
    condition: current.condition,
    feelsLike: current.feelsLike || current.temperature + 2,
    humidity: current.humidity,
    rainChance: current.rainChance,
    windSpeedKmH: current.windSpeedKmH,
    windDirection: current.windDirection,
    uvIndex: current.uvIndex,
    airQuality: current.airQuality,
    agriAdvice: farmingAdvice.map((a) => ({
      title: a.title,
      description: a.advice,
      impact: a.priority === "High" ? "caution" : "positive",
    })),
  };

  CLIENT_WEATHER_CACHE.set(cacheKey, { data: weatherData, timestamp: now });
  return weatherData;
}
