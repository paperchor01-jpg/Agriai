import { NextResponse } from 'next/server';
import { soilService } from '@/lib/soil-service';
import { distributedRateLimiter, getClientIp } from '@/lib/distributed-rate-limiter';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await distributedRateLimiter.checkLimit('GENERAL_API', clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimit.retryAfter },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const farmId = searchParams.get('farmId');
    const farmerId = searchParams.get('farmerId') || undefined;

    if (!farmId) {
      return NextResponse.json({ error: 'farmId parameter is required' }, { status: 400 });
    }

    const profile = await soilService.getSoilProfile(farmId, farmerId);

    if (!profile) {
      return NextResponse.json({
        hasData: false,
        status: 'Insufficient',
        message: 'Insufficient soil data recorded for this farm plot. Please enter laboratory test parameters.',
      });
    }

    return NextResponse.json({
      hasData: true,
      profile,
    }, { headers: rateLimit.headers });
  } catch (error) {
    logger.error('Soil GET route error', { error: (error as Error).message });
    return NextResponse.json({ error: 'Internal server error fetching soil profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await distributedRateLimiter.checkLimit('GENERAL_API', clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimit.retryAfter },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const body = await request.json();
    const result = await soilService.saveSoilProfile(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { headers: rateLimit.headers });
  } catch (error) {
    logger.error('Soil POST route error', { error: (error as Error).message });
    return NextResponse.json({ error: 'Internal server error saving soil profile' }, { status: 500 });
  }
}
