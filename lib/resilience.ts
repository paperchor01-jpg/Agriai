/**
 * AgriAI Resilience, Retry & Circuit Breaker Utilities
 * 
 * Provides production-grade timeout enforcement, exponential backoff with full jitter,
 * and lightweight circuit breakers to protect against third-party API degradation.
 */

import { logger } from './logger';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
  retryOnStatus?: number[];
  name?: string;
}

const DEFAULT_RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];

/**
 * Calculates exponential backoff with full jitter.
 */
export function calculateBackoff(
  attempt: number,
  initialDelayMs: number = 500,
  maxDelayMs: number = 5000
): number {
  const exponential = Math.min(maxDelayMs, initialDelayMs * Math.pow(2, attempt));
  const jitter = Math.random() * initialDelayMs;
  return Math.min(maxDelayMs, exponential + jitter);
}

/**
 * Sleep helper.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes a network fetch with enforced timeout, exponential backoff, and jitter.
 */
export async function resilientFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 2,
    initialDelayMs = 500,
    maxDelayMs = 3000,
    timeoutMs = 15000,
    retryOnStatus = DEFAULT_RETRYABLE_STATUSES,
    name = 'resilient-fetch',
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    // Merge abort signals if caller already provided one
    const combinedSignal = controller.signal;
    if (init?.signal) {
      const originalSignal = init.signal;
      originalSignal.addEventListener('abort', () => controller.abort());
    }

    const startTime = Date.now();

    try {
      const response = await fetch(input, {
        ...init,
        signal: combinedSignal,
      });

      clearTimeout(timer);

      if (response.ok || !retryOnStatus.includes(response.status) || attempt === maxRetries) {
        return response;
      }

      logger.warn(`Transient HTTP error received for ${name}`, {
        status: response.status,
        attempt: attempt + 1,
        maxRetries,
        url: typeof input === 'string' ? input : input.toString(),
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      const error = err as Error;
      lastError = error;

      const isAbort = error.name === 'AbortError';
      logger.warn(`Fetch failure during ${name}`, {
        attempt: attempt + 1,
        maxRetries,
        isTimeout: isAbort,
        error: error.message,
        durationMs: Date.now() - startTime,
      });

      if (attempt === maxRetries) {
        throw error;
      }
    }

    const backoff = calculateBackoff(attempt, initialDelayMs, maxDelayMs);
    await sleep(backoff);
  }

  throw lastError || new Error(`Failed to execute ${name} after ${maxRetries} retries`);
}

/**
 * Circuit Breaker State Machine
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private state: CircuitState = 'CLOSED';

  constructor(
    private readonly name: string,
    private readonly failureThreshold: number = 5,
    private readonly resetTimeoutMs: number = 30000,
    private readonly halfOpenSuccessThreshold: number = 2
  ) {}

  public getState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
        logger.info(`Circuit breaker [${this.name}] transitioned to HALF_OPEN`);
      }
    }
    return this.state;
  }

  public async execute<T>(fn: () => Promise<T>, fallback?: () => Promise<T> | T): Promise<T> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      logger.warn(`Circuit breaker [${this.name}] is OPEN. Fast-failing request.`);
      if (fallback) {
        return await fallback();
      }
      throw new Error(`Service [${this.name}] temporarily unavailable (circuit open)`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) {
        logger.info(`Invoking fallback for [${this.name}] after execution failure.`);
        return await fallback();
      }
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.halfOpenSuccessThreshold) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        logger.info(`Circuit breaker [${this.name}] recovered and is now CLOSED`);
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      logger.error(`Circuit breaker [${this.name}] tripped to OPEN state`, {
        failures: this.failureCount,
        threshold: this.failureThreshold,
      });
    }
  }
}
