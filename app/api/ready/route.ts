import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { testSupabaseConnection } from '@/lib/supabase/test-connection';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ready
 * Readiness probe for Kubernetes / cloud platforms / deployment verification.
 * Verifies dependencies and operational subsystems without exposing secrets or credentials.
 */
export async function GET(request: Request) {
  const correlationId = request.headers.get('x-request-id') || crypto.randomUUID();

  // 1. Check Database subsystem
  let databaseStatus: 'connected' | 'disconnected' | 'demo_mode' = 'demo_mode';
  if (isSupabaseConfigured()) {
    try {
      const connTest = await testSupabaseConnection();
      databaseStatus = connTest.connected ? 'connected' : 'disconnected';
    } catch {
      databaseStatus = 'disconnected';
    }
  }

  // 2. Check AI Vision Provider
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY);
  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);
  const aiStatus = hasGeminiKey
    ? 'gemini-active'
    : hasOpenAiKey
    ? 'openai-active'
    : 'rule-based-fallback';

  // 3. Check Rate Limiter
  const hasRedis = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
  const rateLimiterTier = hasRedis ? 'tier1-redis' : isSupabaseConfigured() ? 'tier2-supabase' : 'tier3-memory';

  // 4. Overall Readiness
  const isReady = databaseStatus !== 'disconnected';

  return NextResponse.json(
    {
      status: isReady ? 'ready' : 'degraded',
      service: 'agriai-api',
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseStatus,
        aiVision: aiStatus,
        rateLimiter: rateLimiterTier,
        weatherCache: 'clustered-active',
        storage: isSupabaseConfigured() ? 'supabase-storage' : 'data-url-fallback',
      },
    },
    {
      status: isReady ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'x-request-id': correlationId,
      },
    }
  );
}
