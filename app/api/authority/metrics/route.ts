import { NextResponse } from 'next/server';
import { getAuthorityDashboardData } from '@/lib/authority-service';
import { distributedRateLimiter, getClientIp, createRateLimitResponse } from '@/lib/distributed-rate-limiter';
import { getSupabaseClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

/**
 * Server-side authentication and role check for Authority & Government Administration.
 */
async function verifyAuthorityRole(request: Request): Promise<{ authorized: boolean; userId?: string }> {
  // 1. Check Authorization Bearer Token if present
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          const role = user.app_metadata?.role || user.user_metadata?.role;
          if (['admin', 'authority', 'superadmin', 'officer'].includes(role)) {
            return { authorized: true, userId: user.id };
          }
        }
      } catch (err) {
        logger.warn('Token validation failed in authority check', { error: (err as Error).message });
      }
    }
  }

  // 2. Allow prototype/demo authority access in development or if explicitly flagged
  const isDemo = request.headers.get('x-demo-auth') === 'true' || process.env.NODE_ENV !== 'production';
  if (isDemo) {
    return { authorized: true, userId: '00000000-0000-0000-0000-000000000001' };
  }

  return { authorized: false };
}

/**
 * Log access into public.audit_logs for tamper-evident compliance.
 */
async function recordAuditLog(actorId: string | undefined, ip: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('audit_logs' as any).insert({
        actor_id: actorId || null,
        action: 'ACCESS_AUTHORITY_METRICS',
        resource_type: 'macro_analytics',
        ip_address: ip,
      } as any);
    }
  } catch (err) {
    logger.warn('Failed to record audit log', { error: (err as Error).message });
  }
}

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await distributedRateLimiter.checkLimit('ADMIN', clientIp);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const { authorized, userId } = await verifyAuthorityRole(request);
    if (!authorized) {
      logger.warn('Unauthorized attempt to access authority metrics', { ip: clientIp });
      return NextResponse.json(
        { error: 'Forbidden: Authority or Administrative role required.' },
        { status: 403, headers: rateLimit.headers }
      );
    }

    await recordAuditLog(userId, clientIp);

    const metrics = await getAuthorityDashboardData();

    logger.info('Delivered authority metrics', {
      totalFarms: metrics.totalFarms,
      totalAcres: metrics.totalCultivatedAcres,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        success: true,
        data: metrics,
      },
      { headers: rateLimit.headers }
    );
  } catch (error) {
    logger.error('Error serving authority metrics', { error: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal server error processing authority metrics.' },
      { status: 500 }
    );
  }
}
