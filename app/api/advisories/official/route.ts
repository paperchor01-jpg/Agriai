import { NextResponse } from 'next/server';
import { fetchOfficialAgroAdvisories } from '@/lib/data-providers/advisories/agromet-provider';
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
    const state = searchParams.get('state') || undefined;
    const district = searchParams.get('district') || undefined;
    const crop = searchParams.get('crop') || undefined;

    const result = await fetchOfficialAgroAdvisories(state, district, crop);
    return NextResponse.json(result, { headers: rateLimit.headers });
  } catch (error) {
    logger.error('Official advisories GET route error', { error: (error as Error).message });
    return NextResponse.json({ error: 'Internal server error fetching advisories' }, { status: 500 });
  }
}
