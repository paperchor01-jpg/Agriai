/**
 * AgriAI Serverless Background Job Queue
 * 
 * Provides asynchronous task offloading for compute-heavy workloads
 * (e.g. multi-farm satellite analysis, macro yield modeling, PDF export generation)
 * backed by Supabase background_jobs with in-memory local fallback.
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
    userId?: string
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
      maxAttempts: 3,
      createdAt: now,
      updatedAt: now,
    };

    // Store in memory fallback
    memoryJobStore.set(jobId, jobRecord);

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
          max_attempts: 3,
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
  public async getJob(jobId: string, userId?: string): Promise<BackgroundJob | null> {
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
          };
        }
      }
    } catch (err) {
      logger.warn('Error reading job from Supabase', { error: (err as Error).message });
    }

    // Memory fallback
    const mem = memoryJobStore.get(jobId);
    if (!mem) return null;
    if (userId && mem.userId && mem.userId !== userId) return null;
    return mem;
  }

  /**
   * Updates job status and result/error.
   */
  public async updateStatus(
    jobId: string,
    status: JobStatus,
    result?: any,
    errorMessage?: string
  ): Promise<void> {
    const now = new Date().toISOString();

    const mem = memoryJobStore.get(jobId);
    if (mem) {
      mem.status = status;
      mem.updatedAt = now;
      if (result !== undefined) mem.result = result;
      if (errorMessage !== undefined) mem.errorMessage = errorMessage;
    }

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase
          .from('background_jobs' as any)
          .update({
            status,
            result: result || null,
            error_message: errorMessage || null,
            updated_at: now,
          } as any)
          .eq('id', jobId);
      }
    } catch (err) {
      logger.warn('Failed to update job status in Supabase', { error: (err as Error).message, jobId });
    }

    logger.info('Updated background job status', { jobId, status });
  }
}

export const jobQueue = new JobQueue();
