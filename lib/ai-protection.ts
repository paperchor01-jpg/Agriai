/**
 * AgriAI AI Concurrency Lock & Deduplication Protection
 * 
 * Protects AI vision and chat endpoints from duplicate concurrent clicks,
 * rapid spam, and excessive LLM API costs.
 */

import crypto from 'crypto';
import { logger } from './logger';

export interface CacheEntry<T> {
  result: T;
  expiresAt: number;
}

// In-Flight Promise Tracker (Locks duplicate concurrent requests on the same payload)
const inFlightRequests = new Map<string, Promise<any>>();

// Deduplication Cache (SHA-256 payload hash -> result)
const deduplicationCache = new Map<string, CacheEntry<any>>();

// Global Active Request Counter (Serverless concurrency brake)
let activeAiRequests = 0;
const MAX_GLOBAL_CONCURRENT_AI = 25;

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
 * Prune stale cache entries periodically.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of deduplicationCache.entries()) {
    if (entry.expiresAt <= now) {
      deduplicationCache.delete(key);
    }
  }
}, 60000).unref?.();

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
    return { result, wasInFlight: true };
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
