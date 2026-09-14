import { NextResponse } from 'next/server';
import { jobQueue } from '@/lib/job-queue';
import { distributedRateLimiter, getClientIp, createRateLimitResponse } from '@/lib/distributed-rate-limiter';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await distributedRateLimiter.checkLimit('GENERAL_API', clientIp);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const { id } = await context.params;

    if (!id || typeof id !== 'string' || id.length > 100) {
      return NextResponse.json(
        { error: 'Invalid or missing job ID.' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const job = await jobQueue.getJob(id);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found.' },
        { status: 404, headers: rateLimit.headers }
      );
    }

    logger.debug('Polled job status', { jobId: id, status: job.status });

    return NextResponse.json(
      {
        success: true,
        job: {
          id: job.id,
          type: job.type,
          status: job.status,
          result: job.result,
          errorMessage: job.errorMessage,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        },
      },
      { headers: rateLimit.headers }
    );
  } catch (error) {
    logger.error('Error fetching job status', { error: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal server error fetching job status.' },
      { status: 500 }
    );
  }
}
