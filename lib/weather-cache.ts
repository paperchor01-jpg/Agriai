/**
 * AgriAI Weather Cache & Coordinate Clustering Engine
 * 
 * Clustered coordinate grid (~1.1 km precision at 2 decimal places)
 * Multi-tier caching:
 * - L1: Memory Cache (instant local access)
 * - L2: Supabase weather_cache table (distributed serverless cache)
 */

import { CurrentWeather, ForecastItem } from '@/types';
import { getSupabaseClient } from './supabase/client';
import { logger } from './logger';

export interface WeatherPayload {
  current: CurrentWeather;
  forecast: ForecastItem[];
  source: 'open-meteo' | 'weatherapi' | 'fallback';
  isFallback: boolean;
  timestamp: number;
}

// L1 Memory Cache
const l1Cache = new Map<string, { data: WeatherPayload; expiresAt: number }>();

// Prune L1 cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of l1Cache.entries()) {
    if (entry.expiresAt <= now) {
      l1Cache.delete(key);
    }
  }
}, 60000).unref?.();

/**
 * Cluster coordinates to ~1.1km grid (2 decimal places).
 * Example: (30.91234, 75.85432) -> key "geo:30.91:75.85"
 */
export function clusterCoordinates(lat: number, lon: number): {
  clusterLat: number;
  clusterLon: number;
  cacheKey: string;
} {
  const clusterLat = Number(lat.toFixed(2));
  const clusterLon = Number(lon.toFixed(2));
  const cacheKey = `weather:geo:${clusterLat}:${clusterLon}`;
  return { clusterLat, clusterLon, cacheKey };
}

/**
 * Retrieves cached weather payload from L1 (Memory) or L2 (Supabase).
 */
export async function getCachedWeather(
  cacheKey: string
): Promise<WeatherPayload | null> {
  const now = Date.now();

  // 1. Check L1 Memory Cache
  const l1Entry = l1Cache.get(cacheKey);
  if (l1Entry && l1Entry.expiresAt > now) {
    return l1Entry.data;
  }

  // 2. Check L2 Database Cache
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('weather_cache' as any)
      .select('data, expires_at')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (!error && data && (data as any).data) {
      const payload = (data as any).data as WeatherPayload;
      const expiresAt = new Date((data as any).expires_at).getTime();

      // Populate L1 cache for subsequent fast reads
      l1Cache.set(cacheKey, { data: payload, expiresAt });
      return payload;
    }
  } catch (err) {
    logger.warn('L2 weather cache read warning', { error: (err as Error).message });
  }

  return null;
}

/**
 * Stores weather payload in both L1 (Memory) and L2 (Supabase).
 * Default TTL: 15 minutes (900 seconds).
 */
export async function setCachedWeather(
  cacheKey: string,
  lat: number,
  lon: number,
  payload: WeatherPayload,
  ttlSeconds: number = 900
): Promise<void> {
  const expiresAtMs = Date.now() + ttlSeconds * 1000;
  const expiresAtIso = new Date(expiresAtMs).toISOString();

  // 1. Store in L1 Memory Cache
  l1Cache.set(cacheKey, { data: payload, expiresAt: expiresAtMs });

  // 2. Store in L2 Database Cache
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase
      .from('weather_cache' as any)
      .upsert(
        {
          cache_key: cacheKey,
          latitude: Number(lat.toFixed(3)),
          longitude: Number(lon.toFixed(3)),
          data: payload,
          expires_at: expiresAtIso,
        } as any,
        { onConflict: 'cache_key' }
      );
  } catch (err) {
    logger.warn('L2 weather cache write warning', { error: (err as Error).message });
  }
}
