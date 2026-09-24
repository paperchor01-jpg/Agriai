import { NextResponse } from 'next/server';
import { fetchMandiPrices } from '@/lib/data-providers/market/agmarknet-provider';
import { distributedRateLimiter, getClientIp } from '@/lib/distributed-rate-limiter';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    // 1. Rate Limiting Check
    const clientIp = getClientIp(request);
    const rateLimit = await distributedRateLimiter.checkLimit('GENERAL_API', clientIp);

    if (!rateLimit.allowed) {
      logger.warn('Market API rate limit exceeded', { ip: clientIp, retryAfter: rateLimit.retryAfter });
      return NextResponse.json(
        {
          error: 'Rate limit exceeded for market price queries. Please wait a moment.',
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const commodity = searchParams.get('crop') || searchParams.get('commodity') || 'Wheat';
    const state = searchParams.get('state') || 'Punjab';
    const district = searchParams.get('district') || 'Ludhiana';

    // 2. Fetch normalized mandi price
    const result = await fetchMandiPrices(commodity, state, district);

    const isLive = result.metadata.status === 'LIVE';
    logger.info('Market API query completed', {
      commodity,
      state,
      district,
      provider: result.metadata.provider,
      status: result.metadata.status,
      isLive,
      fallbackUsed: !isLive,
      fallbackReason: result.metadata.fallbackReason,
      recordsCount: result.metadata.recordsCount ?? (result.data ? 1 : 0),
      durationMs: Date.now() - startTime,
    });

    // Provide both array and object representations to guarantee compatibility across all frontends and services
    const records = Array.isArray(result.data)
      ? result.data
      : (result.data ? [result.data] : []);

    const responsePayload = {
      ...result,
      data: records,
      primaryPrice: records[0] || null,
    };

    return NextResponse.json(responsePayload, { headers: rateLimit.headers });
  } catch (error) {
    logger.error('Market price API handler failure', {
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Unable to retrieve agricultural market price data at this time.',
      },
      { status: 500 }
    );
  }
}
