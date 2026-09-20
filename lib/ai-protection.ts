/**
 * AgriAI AI Concurrency Lock & Deduplication Protection
 * 
 * Protects AI vision and chat endpoints from duplicate concurrent clicks,
 * rapid spam, abuse, and excessive LLM API costs.
 */

import crypto from 'crypto';
import { logger } from './logger';

export interface CacheEntry<T> {
  result: T;
  expiresAt: number;
}

// In-Flight Promise Tracker (Locks duplicate concurrent requests on the same payload)
const inFlightRequests = new Map<string, Promise<unknown>>();

// Deduplication Cache (SHA-256 payload hash -> result)
const deduplicationCache = new Map<string, CacheEntry<unknown>>();

// Global Active Request Counter (Serverless concurrency brake)
let activeAiRequests = 0;
const MAX_GLOBAL_CONCURRENT_AI = 25;

// Per-User Quota Accounting (Window: 1 hour)
interface UserAiUsage {
  count: number;
  resetTime: number;
}
const userAiQuotas = new Map<string, UserAiUsage>();
const USER_HOURLY_AI_LIMIT = 30; // 30 AI diagnoses per user per hour

/**
 * Computes SHA-256 hash of a string or buffer.
 */
export function computePayloadHash(payload: string | Buffer): string {
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Check deduplication cache.
 */
export function getCachedAiResult<T>(hash: string): T | null {
  const entry = deduplicationCache.get(hash);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    deduplicationCache.delete(hash);
    return null;
  }

  return entry.result as T;
}

/**
 * Set deduplication cache with TTL in seconds (default 15 mins).
 */
export function setCachedAiResult<T>(
  hash: string,
  result: T,
  ttlSeconds: number = 900
): void {
  deduplicationCache.set(hash, {
    result,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Prune stale cache entries and quota records periodically.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of deduplicationCache.entries()) {
    if (entry.expiresAt <= now) {
      deduplicationCache.delete(key);
    }
  }
  for (const [user, usage] of userAiQuotas.entries()) {
    if (usage.resetTime <= now) {
      userAiQuotas.delete(user);
    }
  }
}, 60000).unref?.();

/**
 * Validates and accounts for per-user AI quotas.
 */
export function checkUserAiQuota(
  userId: string = 'anonymous',
  hourlyLimit: number = USER_HOURLY_AI_LIMIT
): { allowed: boolean; current: number; limit: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = 3600 * 1000;
  const usage = userAiQuotas.get(userId);

  if (!usage || usage.resetTime <= now) {
    userAiQuotas.set(userId, { count: 1, resetTime: now + windowMs });
    return { allowed: true, current: 1, limit: hourlyLimit, resetInSeconds: 3600 };
  }

  if (usage.count >= hourlyLimit) {
    const resetInSeconds = Math.max(1, Math.ceil((usage.resetTime - now) / 1000));
    logger.warn('User exceeded AI quota', { userId, current: usage.count, limit: hourlyLimit });
    return { allowed: false, current: usage.count, limit: hourlyLimit, resetInSeconds };
  }

  usage.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((usage.resetTime - now) / 1000));
  return { allowed: true, current: usage.count, limit: hourlyLimit, resetInSeconds };
}

/**
 * Validates AI request parameters to guard against oversized payloads and prompt injection.
 */
export function validateAiInput(
  cropHint?: string,
  base64Length?: number
): { valid: boolean; error?: string } {
  if (cropHint && cropHint.length > 200) {
    return { valid: false, error: 'Crop hint exceeds maximum 200 characters.' };
  }

  // 14MB base64 equates to ~10MB binary file
  if (base64Length && base64Length > 14 * 1024 * 1024) {
    return { valid: false, error: 'Image payload exceeds 10MB binary limit.' };
  }

  if (cropHint) {
    const injectionRegex = /\b(ignore\s+previous\s+instructions|system\s+prompt|system\s+override|jailbreak)\b/i;
    if (injectionRegex.test(cropHint)) {
      logger.warn('Potential prompt injection detected in AI hint', { cropHint });
      return { valid: false, error: 'Invalid or unsupported crop hint provided.' };
    }
  }

  return { valid: true };
}

/**
 * Executes an AI operation protected by an in-flight concurrency lock.
 * If another request with the exact same payload hash is already executing,
 * this function awaits the existing in-flight promise rather than firing a second API call.
 */
export async function executeProtectedAiTask<T>(
  taskKey: string,
  fn: () => Promise<T>
): Promise<{ result: T; wasInFlight: boolean }> {
  // Check if identical task is currently running
  const existingPromise = inFlightRequests.get(taskKey);
  if (existingPromise) {
    logger.info('Awaiting duplicate in-flight AI request', { taskKey: taskKey.slice(0, 12) });
    const result = await existingPromise;
    return { result: result as T, wasInFlight: true };
  }

  // Check global concurrency ceiling
  if (activeAiRequests >= MAX_GLOBAL_CONCURRENT_AI) {
    throw new Error('AI engine is currently experiencing high load. Please try again in a few moments.');
  }

  activeAiRequests++;
  const executionPromise = (async () => {
    try {
      return await fn();
    } finally {
      inFlightRequests.delete(taskKey);
      activeAiRequests = Math.max(0, activeAiRequests - 1);
    }
  })();

  inFlightRequests.set(taskKey, executionPromise);

  const result = await executionPromise;
  return { result, wasInFlight: false };
}
