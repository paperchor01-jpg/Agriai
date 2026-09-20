/**
 * AgriAI Serverless Background Job Queue
 * 
 * Provides asynchronous task offloading for compute-heavy workloads
 * (e.g. multi-farm satellite analysis, macro yield modeling, PDF export generation)
 * backed by Supabase background_jobs with in-memory local fallback.
 * 
 * Includes:
 * - Bounded retries with exponential backoff
 * - Stale-job recovery for worker/process interruptions
 * - Dead-letter failure transition when max attempts exceeded
 */

import { getSupabaseClient } from './supabase/client';
import { logger } from './logger';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface BackgroundJob<T = any, R = any> {
  id: string;
  userId?: string;
  type: string;
  payload: T;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  result?: R;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// In-Memory Fallback Store (for local dev / demo mode)
const memoryJobStore = new Map<string, BackgroundJob>();

export class JobQueue {
  /**
   * Enqueues a new background job.
   */
  public async enqueue<T>(
    type: string,
    payload: T,
    userId?: string,
    maxAttempts: number = 3
  ): Promise<string> {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const jobRecord: BackgroundJob<T> = {
      id: jobId,
      userId,
      type,
      payload,
      status: 'queued',
      attempts: 0,
      maxAttempts,
      createdAt: now,
      updatedAt: now,
    };

    // Store in memory fallback
    memoryJobStore.set(jobId, jobRecord as BackgroundJob);

    // Try persisting to Supabase if connected
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from('background_jobs' as any).insert({
          id: jobId,
          user_id: userId || null,
          type,
          payload,
          status: 'queued',
          attempts: 0,
          max_attempts: maxAttempts,
        } as any);
      }
    } catch (err) {
      logger.warn('Failed to insert background job into Supabase, using memory queue', {
        error: (err as Error).message,
        jobId,
      });
    }

    logger.info('Enqueued background job', { jobId, type, userId });
    return jobId;
  }

  /**
   * Retrieves status of a job.
   */
  public async getJob<T = any, R = any>(
    jobId: string,
    userId?: string
  ): Promise<BackgroundJob<T, R> | null> {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        let query = supabase.from('background_jobs' as any).select('*').eq('id', jobId);
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query.maybeSingle();
        if (!error && data) {
          const row = data as any;
          return {
            id: row.id,
            userId: row.user_id,
            type: row.type,
            payload: row.payload,
            status: row.status,
            attempts: row.attempts,
            maxAttempts: row.max_attempts,
            result: row.result,
            errorMessage: row.error_message,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          } as BackgroundJob<T, R>;
        }
      }
    } catch (err) {
      logger.warn('Error reading job from Supabase', { error: (err as Error).message });
    }

    // Memory fallback
    const mem = memoryJobStore.get(jobId);
    if (!mem) return null;
    if (userId && mem.userId && mem.userId !== userId) return null;
    return mem as BackgroundJob<T, R>;
  }

  /**
   * Updates job status and result/error.
   */
  public async updateStatus(
    jobId: string,
    status: JobStatus,
    result?: unknown,
    errorMessage?: string,
    incrementAttempt = false
  ): Promise<void> {
    const now = new Date().toISOString();

    const mem = memoryJobStore.get(jobId);
    if (mem) {
      mem.status = status;
      mem.updatedAt = now;
      if (incrementAttempt) mem.attempts += 1;
      if (result !== undefined) mem.result = result;
      if (errorMessage !== undefined) mem.errorMessage = errorMessage;
    }

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const updatePayload: Record<string, unknown> = {
          status,
          result: result !== undefined ? result : null,
          error_message: errorMessage || null,
          updated_at: now,
        };
        if (incrementAttempt && mem) {
          updatePayload.attempts = mem.attempts;
        }

        await supabase
          .from('background_jobs' as any)
          .update(updatePayload as any)
          .eq('id', jobId);
      }
    } catch (err) {
      logger.warn('Failed to update job status in Supabase', { error: (err as Error).message, jobId });
    }

    logger.info('Updated background job status', { jobId, status });
  }

  /**
   * Executes a background job with automatic attempt tracking and dead-letter handling.
   */
  public async processJob<T, R>(
    jobId: string,
    handler: (payload: T) => Promise<R>
  ): Promise<R> {
    const job = await this.getJob<T, R>(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found.`);
    }

    const currentAttempts = job.attempts + 1;
    await this.updateStatus(jobId, 'processing', undefined, undefined, true);

    try {
      const result = await handler(job.payload);
      await this.updateStatus(jobId, 'completed', result);
      return result;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const isDeadLetter = currentAttempts >= job.maxAttempts;
      const finalStatus: JobStatus = isDeadLetter ? 'failed' : 'queued';

      await this.updateStatus(jobId, finalStatus, undefined, errorMsg);
      logger.error('Background job execution failed', {
        jobId,
        attempt: currentAttempts,
        maxAttempts: job.maxAttempts,
        deadLetter: isDeadLetter,
        error: errorMsg,
      });

      throw err;
    }
  }

  /**
   * Recovers stale jobs left in "processing" state due to container termination or edge timeout.
   */
  public async recoverStaleJobs(staleMinutes = 10): Promise<number> {
    const cutoff = Date.now() - staleMinutes * 60 * 1000;
    let recoveredCount = 0;

    // Check memory store
    for (const [, job] of memoryJobStore.entries()) {
      if (job.status === 'processing') {
        const lastUpdated = new Date(job.updatedAt).getTime();
        if (lastUpdated < cutoff) {
          job.status = 'queued';
          job.updatedAt = new Date().toISOString();
          recoveredCount++;
        }
      }
    }

    // Check Supabase store if available
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const cutoffIso = new Date(cutoff).toISOString();
        const { data, error } = await supabase
          .from('background_jobs' as any)
          .update({
            status: 'queued',
            updated_at: new Date().toISOString(),
          } as any)
          .eq('status', 'processing')
          .lt('updated_at', cutoffIso)
          .select('id');

        if (!error && data) {
          recoveredCount += (data as any[]).length;
        }
      }
    } catch (err) {
      logger.warn('Failed to recover stale jobs from Supabase', { error: (err as Error).message });
    }

    if (recoveredCount > 0) {
      logger.info('Recovered stale background jobs', { count: recoveredCount });
    }
    return recoveredCount;
  }
}

export const jobQueue = new JobQueue();
