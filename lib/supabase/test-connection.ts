import { getSupabaseClient, isSupabaseConfigured } from './client';

export interface ConnectionTestResult {
  configured: boolean;
  connected: boolean;
  message: string;
  details?: {
    farmersTableAccessible?: boolean;
    farmsTableAccessible?: boolean;
    farmerCount?: number;
    error?: string;
  };
}

/**
 * Safe test to verify communication with the Supabase database.
 * Does not alter existing data or disrupt the application flow.
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      message: "Supabase credentials are not configured yet.",
      details: {
        error: "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are missing or set to placeholder values in .env.local",
      },
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      configured: false,
      connected: false,
      message: "Supabase credentials are not configured yet.",
    };
  }

  try {
    // Attempt a light read test on farmers table
    const { data: farmers, error: farmerError, count } = await client
      .from('farmers')
      .select('id, name', { count: 'exact' })
      .limit(1);

    if (farmerError) {
      return {
        configured: true,
        connected: false,
        message: `Connected to Supabase project, but query failed on 'farmers' table: ${farmerError.message}`,
        details: {
          error: farmerError.message,
        },
      };
    }

    return {
      configured: true,
      connected: true,
      message: "Successfully connected to Supabase database.",
      details: {
        farmersTableAccessible: true,
        farmerCount: count ?? (farmers ? farmers.length : 0),
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      configured: true,
      connected: false,
      message: `Failed to connect to Supabase: ${errorMsg}`,
      details: {
        error: errorMsg,
      },
    };
  }
}
