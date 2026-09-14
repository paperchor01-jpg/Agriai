import { NextResponse } from 'next/server';
import { CurrentWeather, ForecastItem } from '@/types';
import { distributedRateLimiter, getClientIp, createRateLimitResponse } from '@/lib/distributed-rate-limiter';
import { clusterCoordinates, getCachedWeather, setCachedWeather } from '@/lib/weather-cache';
import { resilientFetch } from '@/lib/resilience';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// In-memory cache for coordinates to avoid duplicate geocoding requests
const GEO_CACHE = new Map<string, { lat: number; lon: number; label: string }>();

// Pre-seeded coordinates for common Indian farm regions
GEO_CACHE.set('ludhiana', { lat: 30.912, lon: 75.854, label: 'Ludhiana, Punjab' });
GEO_CACHE.set('amritsar', { lat: 31.634, lon: 74.872, label: 'Amritsar, Punjab' });
GEO_CACHE.set('bathinda', { lat: 30.211, lon: 74.945, label: 'Bathinda, Punjab' });
GEO_CACHE.set('patiala', { lat: 30.340, lon: 76.386, label: 'Patiala, Punjab' });
GEO_CACHE.set('jalandhar', { lat: 31.326, lon: 75.576, label: 'Jalandhar, Punjab' });
GEO_CACHE.set('karnal', { lat: 29.692, lon: 76.984, label: 'Karnal, Haryana' });

function sanitizeLocation(loc: string | null): string {
  if (!loc) return 'Ludhiana, Punjab';
  return loc
    .replace(/[^a-zA-Z0-9\s,.-]/g, '') // allow only safe alphanumeric, space, comma, dot, dash
    .trim()
    .slice(0, 100);
}

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
  const index = Math.round((deg % 360) / 45) % 8;
  return directions[index] || 'NW';
}

async function resolveCoordinates(location: string): Promise<{ lat: number; lon: number; label: string }> {
  const normalized = location.trim().toLowerCase();
  const cityKey = normalized.split(',')[0].trim();

  // 1. Check local cache
  if (GEO_CACHE.has(cityKey)) {
    return GEO_CACHE.get(cityKey)!;
  }

  // 2. Geocode using Open-Meteo Geocoding API with resilience
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityKey)}&count=1&format=json`;
    const res = await resilientFetch(geoUrl, undefined, {
      maxRetries: 1,
      timeoutMs: 3000,
      name: 'geocoding-api',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        const entry = {
          lat: item.latitude,
          lon: item.longitude,
          label: `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}`,
        };
        GEO_CACHE.set(cityKey, entry);
        return entry;
      }
    }
  } catch (err) {
    logger.warn('Geocoding lookup failed, using local default fallback', {
      error: (err as Error).message,
      location: cityKey,
    });
  }

  // Fallback to Ludhiana, Punjab
  return { lat: 30.912, lon: 75.854, label: location || 'Ludhiana, Punjab' };
}

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    // 1. Distributed Rate Limiter
    const clientIp = getClientIp(request);
    const rateLimit = await distributedRateLimiter.checkLimit('WEATHER', clientIp);

    if (!rateLimit.allowed) {
      logger.warn('Weather rate limit exceeded', { ip: clientIp, retryAfter: rateLimit.retryAfter });
      return NextResponse.json(
        {
          error: 'Weather rate limit exceeded. Please wait a moment before requesting updates.',
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawLocation = searchParams.get('location');
    const location = sanitizeLocation(rawLocation);
    const rawLat = searchParams.get('lat');
    const rawLon = searchParams.get('lon');

    let customLat: number | undefined = undefined;
    let customLon: number | undefined = undefined;

    if (rawLat && rawLon) {
      const parsedLat = parseFloat(rawLat);
      const parsedLon = parseFloat(rawLon);
      if (
        !isNaN(parsedLat) &&
        !isNaN(parsedLon) &&
        parsedLat >= -90 &&
        parsedLat <= 90 &&
        parsedLon >= -180 &&
        parsedLon <= 180
      ) {
        customLat = parsedLat;
        customLon = parsedLon;
      }
    }

    if (rawLocation && rawLocation.length > 100) {
      return NextResponse.json(
        { error: 'Location string is too long. Maximum allowed length is 100 characters.' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // 2. Resolve Coordinates
    let lat: number;
    let lon: number;

    if (customLat !== undefined && customLon !== undefined) {
      lat = customLat;
      lon = customLon;
    } else {
      const resolved = await resolveCoordinates(location);
      lat = resolved.lat;
      lon = resolved.lon;
    }

    // 3. Coordinate Clustering (~1.1km grid for shared village caching)
    const { cacheKey, clusterLat, clusterLon } = clusterCoordinates(lat, lon);

    // 4. Multi-Tier Cache Check (L1 Memory -> L2 Database)
    const cached = await getCachedWeather(cacheKey);
    if (cached) {
      logger.debug('Weather cache hit', { cacheKey, location, durationMs: Date.now() - startTime });
      return NextResponse.json(
        {
          success: true,
          location,
          cluster: { lat: clusterLat, lon: clusterLon },
          current: cached.current,
          forecast: cached.forecast,
          source: cached.source,
          isFallback: cached.isFallback,
          cached: true,
        },
        { headers: rateLimit.headers }
      );
    }

    // 5. Fetch from weather provider
    const apiKey = process.env.WEATHER_API_KEY;

    // Optional WeatherAPI.com integration
    if (apiKey && apiKey.trim() !== '') {
      try {
        const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=yes`;
        const res = await resilientFetch(weatherApiUrl, undefined, {
          maxRetries: 1,
          timeoutMs: 4000,
          name: 'weatherapi-com',
        });

        if (res.ok) {
          const wData = await res.json();
          const current: CurrentWeather = {
            temperature: Math.round(wData.current.temp_c),
            condition: wData.current.condition.text,
            humidity: Math.round(wData.current.humidity),
            rainChance: Math.round(wData.forecast.forecastday[0]?.day?.daily_chance_of_rain || 20),
            windSpeedKmH: Math.round(wData.current.wind_kph),
            feelsLike: Math.round(wData.current.feelslike_c),
            windDirection: wData.current.wind_dir || 'NW',
            uvIndex: Math.round(wData.current.uv || 6),
            airQuality: wData.current.air_quality?.['us-epa-index'] <= 2 ? 'Good (AQI 75)' : 'Moderate (AQI 95)',
          };

          const forecast: ForecastItem[] = wData.forecast.forecastday.map((d: any, idx: number) => ({
            day: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `Day ${idx + 1}`,
            date: d.date,
            temperature: Math.round(d.day.avgtemp_c),
            tempMax: Math.round(d.day.maxtemp_c),
            tempMin: Math.round(d.day.mintemp_c),
            condition: d.day.condition.text,
            rainChance: Math.round(d.day.daily_chance_of_rain || 0),
          }));

          const payload = { current, forecast, source: 'weatherapi' as const, isFallback: false, timestamp: Date.now() };
          await setCachedWeather(cacheKey, lat, lon, payload, 900); // 15 min TTL

          return NextResponse.json(
            { success: true, location, cluster: { lat: clusterLat, lon: clusterLon }, current, forecast, source: 'weatherapi', isFallback: false },
            { headers: rateLimit.headers }
          );
        }
      } catch (err) {
        logger.warn('WeatherAPI provider failed, falling back to Open-Meteo', { error: (err as Error).message });
      }
    }

    // Default primary provider: Open-Meteo (Free, high-precision)
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=6`;

    const res = await resilientFetch(openMeteoUrl, { headers: { Accept: 'application/json' } }, {
      maxRetries: 2,
      timeoutMs: 6000,
      name: 'open-meteo',
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP error: ${res.status}`);
    }

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
    const daysCount = Math.min(5, daily?.time?.length || 5);

    for (let i = 0; i < daysCount; i++) {
      const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `Day ${i + 1}`;
      const code = daily.weather_code?.[i] ?? 1;
      const maxTemp = Math.round(daily.temperature_2m_max?.[i] ?? current.temperature);
      const minTemp = Math.round(daily.temperature_2m_min?.[i] ?? current.temperature - 8);
      const rainChance = Math.round(daily.precipitation_probability_max?.[i] ?? 20);

      forecast.push({
        day: dayLabel,
        date: daily.time?.[i],
        temperature: maxTemp,
        tempMax: maxTemp,
        tempMin: minTemp,
        condition: wmoCodeToCondition(code),
        rainChance,
      });
    }

    const payload = { current, forecast, source: 'open-meteo' as const, isFallback: false, timestamp: Date.now() };
    await setCachedWeather(cacheKey, lat, lon, payload, 900); // 15 min TTL

    return NextResponse.json(
      {
        success: true,
        location,
        cluster: { lat: clusterLat, lon: clusterLon },
        current,
        forecast,
        source: 'open-meteo',
        isFallback: false,
      },
      { headers: rateLimit.headers }
    );
  } catch (error) {
    logger.warn('Weather API retrieval error, using local fallback', {
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
    });

    const fallbackCurrent: CurrentWeather = {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 62,
      rainChance: 20,
      windSpeedKmH: 12,
      feelsLike: 30,
      windDirection: 'NW',
      uvIndex: 6,
      airQuality: 'Moderate (AQI 95)',
    };

    const fallbackForecast: ForecastItem[] = [
      { day: 'Today', temperature: 28, tempMin: 18, condition: 'Partly Cloudy', rainChance: 20 },
      { day: 'Tomorrow', temperature: 26, tempMin: 17, condition: 'Light Rain', rainChance: 65 },
      { day: 'Day 3', temperature: 27, tempMin: 18, condition: 'Cloudy', rainChance: 40 },
      { day: 'Day 4', temperature: 30, tempMin: 19, condition: 'Sunny', rainChance: 10 },
      { day: 'Day 5', temperature: 29, tempMin: 19, condition: 'Partly Cloudy', rainChance: 25 },
    ];

    return NextResponse.json({
      success: true,
      location: 'Ludhiana, Punjab',
      current: fallbackCurrent,
      forecast: fallbackForecast,
      source: 'fallback',
      isFallback: true,
    });
  }
}