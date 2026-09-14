/**
 * AgriAI Distributed Multi-Tier Rate Limiter
 * 
 * Supports scaling from 100 to 100,000+ users by decoupling rate limiting from
 * single-node process memory.
 * 
 * Hierarchy:
 * 1. Tier 1: Upstash Redis REST API (zero npm dependencies, edge/serverless native)
 * 2. Tier 2: Supabase PostgreSQL atomic stored procedure increment_rate_limit()
 * 3. Tier 3: In-Memory sliding-window with auto-cleanup (fallback)
 */

import { NextResponse } from 'next/server';
import { getSupabaseClient } from './supabase/client';
import { logger } from './logger';

export type RateLimitTier =
  | 'AUTH'
  | 'AI_VISION'
  | 'AI_CHAT'
  | 'WEATHER'
  | 'GENERAL_API'
  | 'ADMIN';

export interface TierConfig {
  maxRequests: number;
  windowSeconds: number;
}

export const RATE_LIMIT_TIERS: Record<RateLimitTier, TierConfig> = {
  AUTH: { maxRequests: 10, windowSeconds: 60 },
  AI_VISION: { maxRequests: 10, windowSeconds: 60 },
  AI_CHAT: { maxRequests: 20, windowSeconds: 60 },
  WEATHER: { maxRequests: 60, windowSeconds: 60 },
  GENERAL_API: { maxRequests: 100, windowSeconds: 60 },
  ADMIN: { maxRequests: 30, windowSeconds: 60 },
};

export interface RateLimitResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
  resetInSeconds: number;
  retryAfter: number;
  tier: RateLimitTier;
  source: 'redis' | 'supabase' | 'memory';
  headers: Record<string, string>;
}

// In-Memory Fallback Map
interface MemoryWindow {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, MemoryWindow>();

// Prune memory store periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (record.resetTime <= now) {
      memoryStore.delete(key);
    }
  }
}, 60000).unref?.();

/**
 * Extracts client IP safely from Next.js / Edge request headers.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0].trim();
    if (ip) return ip;
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();
  return '127.0.0.1';
}

export class DistributedRateLimiter {
  private redisUrl?: string;
  private redisToken?: string;

  constructor() {
    this.redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    this.redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  }

  /**
   * Checks rate limit for a specific tier and client identifier.
   */
  public async checkLimit(
    tier: RateLimitTier,
    identifier: string
  ): Promise<RateLimitResult> {
    const config = RATE_LIMIT_TIERS[tier];
    const key = `ratelimit:${tier.toLowerCase()}:${identifier}`;

    // Tier 1: Try Redis REST API if credentials exist
    if (this.redisUrl && this.redisToken) {
      try {
        const redisResult = await this.checkRedis(key, config, tier);
        if (redisResult) return redisResult;
      } catch (err) {
        logger.warn('Upstash Redis rate limit check failed, falling back to database', {
          error: (err as Error).message,
        });
      }
    }

    // Tier 2: Try Supabase PostgreSQL RPC if configured
    try {
      const dbResult = await this.checkDatabase(key, config, tier);
      if (dbResult) return dbResult;
    } catch (err) {
      logger.warn('Supabase DB rate limit check failed, falling back to memory', {
        error: (err as Error).message,
      });
    }

    // Tier 3: In-Memory Sliding Window Fallback
    return this.checkMemory(key, config, tier);
  }

  /**
   * Check Upstash Redis via REST API (INCR + EXPIRE pipeline).
   */
  private async checkRedis(
    key: string,
    config: TierConfig,
    tier: RateLimitTier
  ): Promise<RateLimitResult | null> {
    const url = `${this.redisUrl}/pipeline`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['TTL', key],
      ]),
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const count = Number(data[0]?.result || 1);
    let ttl = Number(data[1]?.result || -1);

    // If key is newly created (TTL was -1), set its expiration
    if (ttl === -1) {
      await fetch(`${this.redisUrl}/expire/${key}/${config.windowSeconds}`, {
        headers: { Authorization: `Bearer ${this.redisToken}` },
        signal: AbortSignal.timeout(1000),
      }).catch(() => {});
      ttl = config.windowSeconds;
    }

    const allowed = count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - count);
    const retryAfter = allowed ? 0 : Math.max(1, ttl);
    const resetTime = Math.floor(Date.now() / 1000) + (ttl > 0 ? ttl : config.windowSeconds);

    return {
      allowed,
      current: count,
      limit: config.maxRequests,
      remaining,
      resetInSeconds: ttl > 0 ? ttl : config.windowSeconds,
      retryAfter,
      tier,
      source: 'redis',
      headers: {
        'X-RateLimit-Limit': String(config.maxRequests),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(resetTime),
        ...(allowed ? {} : { 'Retry-After': String(retryAfter) }),
      },
    };
  }

  /**
   * Check Supabase via PostgreSQL increment_rate_limit stored function.
   */
  private async checkDatabase(
    key: string,
    config: TierConfig,
    tier: RateLimitTier
  ): Promise<RateLimitResult | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await (supabase as any).rpc('increment_rate_limit', {
      p_key: key,
      p_window_seconds: config.windowSeconds,
      p_max_limit: config.maxRequests,
    });

    if (error || !data) return null;

    const rpcData = data as any;
    const current = Number(rpcData.current || 1);
    const allowed = Boolean(rpcData.allowed);
    const remaining = Math.max(0, config.maxRequests - current);
    const resetInSeconds = Number(rpcData.reset_in_seconds || config.windowSeconds);
    const retryAfter = Number(rpcData.retry_after || 0);
    const resetTime = Math.floor(Date.now() / 1000) + resetInSeconds;

    return {
      allowed,
      current,
      limit: config.maxRequests,
      remaining,
      resetInSeconds,
      retryAfter,
      tier,
      source: 'supabase',
      headers: {
        'X-RateLimit-Limit': String(config.maxRequests),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(resetTime),
        ...(allowed ? {} : { 'Retry-After': String(retryAfter) }),
      },
    };
  }

  /**
   * Check local in-memory sliding window cache.
   */
  private checkMemory(
    key: string,
    config: TierConfig,
    tier: RateLimitTier
  ): RateLimitResult {
    const now = Date.now();
    const existing = memoryStore.get(key);

    let count = 1;
    let resetTime = now + config.windowSeconds * 1000;

    if (existing && existing.resetTime > now) {
      count = existing.count + 1;
      resetTime = existing.resetTime;
      existing.count = count;
    } else {
      memoryStore.set(key, { count, resetTime });
    }

    const allowed = count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - count);
    const resetInSeconds = Math.max(0, Math.ceil((resetTime - now) / 1000));
    const retryAfter = allowed ? 0 : Math.max(1, resetInSeconds);
    const resetEpoch = Math.floor(resetTime / 1000);

    return {
      allowed,
      current: count,
      limit: config.maxRequests,
      remaining,
      resetInSeconds,
      retryAfter,
      tier,
      source: 'memory',
      headers: {
        'X-RateLimit-Limit': String(config.maxRequests),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(resetEpoch),
        ...(allowed ? {} : { 'Retry-After': String(retryAfter) }),
      },
    };
  }
}

export const distributedRateLimiter = new DistributedRateLimiter();

/**
 * Standardized HTTP 429 response builder.
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: `Rate limit exceeded for tier ${result.tier}. Please wait ${result.retryAfter} seconds before trying again.`,
      tier: result.tier,
      limit: result.limit,
      retryAfter: result.retryAfter,
    },
    {
      status: 429,
      headers: result.headers,
    }
  );
}
