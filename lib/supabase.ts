/**
 * AgriAI Supabase Client Entrypoint
 * Provides safe, typed access to the Supabase client without exposing secrets.
 */
export { supabase, getSupabaseClient, isSupabaseConfigured } from './supabase/client';
export * from '@/types/database';
