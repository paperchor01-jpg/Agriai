import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

/**
 * Checks if Supabase credentials are validly configured in environment variables.
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return false;
  if (url.includes('your-project-id') || url.includes('your-project-ref')) return false;
  try {
    new URL(url);
    return key.trim().length > 10;
  } catch {
    return false;
  }
}

let clientInstance: SupabaseClient<Database> | null = null;

/**
 * Returns a typed Supabase client singleton, or null if credentials are not yet configured.
 * This prevents the application from throwing unhandled configuration errors during prototyping.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!clientInstance && url && key) {
    clientInstance = createClient<Database>(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return clientInstance;
}

/**
 * Direct typed client accessor exported for convenience.
 */
export const supabase: SupabaseClient<Database> | null = getSupabaseClient();

