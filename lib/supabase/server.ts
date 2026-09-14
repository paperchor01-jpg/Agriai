import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

/**
 * AgriAI Supabase Server-Side Client Module
 * 
 * STRICT ARCHITECTURAL SECURITY RULE:
 * This module must NEVER be imported into client-side components ('use client').
 * It provides elevated access utilizing the server-side SUPABASE_SERVICE_ROLE_KEY
 * for serverless background tasks, administrative queries, and tamper-evident audit logging.
 */

function ensureServerContext(): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      'FATAL SECURITY EXCEPTION: Supabase server/admin client cannot be instantiated in a browser or client-side runtime.'
    );
  }
}

/**
 * Validates if the server-only SUPABASE_SERVICE_ROLE_KEY is configured.
 */
export function isServiceRoleConfigured(): boolean {
  ensureServerContext();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return false;
  if (key.includes('your-') || key.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')) return false;
  return key.trim().length > 20;
}

let serverAdminClientInstance: SupabaseClient<Database> | null = null;

/**
 * Returns an elevated Supabase client initialized with the SUPABASE_SERVICE_ROLE_KEY.
 * This client bypasses PostgreSQL Row-Level Security (RLS) and must only be used in
 * trusted server-side execution contexts (e.g. background job processing, audit logging).
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> | null {
  ensureServerContext();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  if (url.includes('your-project-ref') || serviceRoleKey.includes('your-') || serviceRoleKey.length < 20) {
    return null;
  }

  if (!serverAdminClientInstance) {
    serverAdminClientInstance = createClient<Database>(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverAdminClientInstance;
}

/**
 * Returns a server-side Supabase client.
 * Prioritizes the service role key if configured, or gracefully falls back to the anon key.
 */
export function getSupabaseServerClient(): SupabaseClient<Database> | null {
  ensureServerContext();

  if (isServiceRoleConfigured()) {
    return getSupabaseAdminClient();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('your-project-ref')) {
    return null;
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
