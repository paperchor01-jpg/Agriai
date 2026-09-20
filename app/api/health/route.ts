import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const startTime = Date.now();

/**
 * GET /api/health
 * Lightweight liveness probe for container orchestrators, edge gateways, and uptime monitors.
 * Executes instantly without touching external databases or services.
 */
export async function GET(request: Request) {
  const correlationId = request.headers.get('x-request-id') || crypto.randomUUID();

  return NextResponse.json(
    {
      status: 'ok',
      service: 'agriai-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      environment: process.env.NODE_ENV || 'production',
      version: '0.1.0',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'x-request-id': correlationId,
      },
    }
  );
}
