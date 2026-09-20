-- ====================================================================
-- AgriAI — Production Hardening & Long-Term Data Retention (SIH25010)
-- File: supabase/migrations/20260920_production_hardening.sql
--
-- Non-destructive, idempotent migration to support high-scale operations:
-- 1. Upgrades maintenance routine for automated pruning of stale records
-- 2. Adds composite indexes for job queue and audit log maintenance
-- ====================================================================

-- 1. Performance Indexes for Background Jobs & Audit Logs
CREATE INDEX IF NOT EXISTS idx_jobs_status_updated 
  ON public.background_jobs(status, updated_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
  ON public.audit_logs(created_at DESC);

-- 2. Enhanced Maintenance & Pruning Routine
-- Purges stale rate limits, expired weather cache, old completed jobs, and aged audit logs
CREATE OR REPLACE FUNCTION public.cleanup_expired_records()
RETURNS JSONB AS $$
DECLARE
  v_purged_rates INT := 0;
  v_purged_weather INT := 0;
  v_purged_completed_jobs INT := 0;
  v_purged_failed_jobs INT := 0;
  v_purged_audit_logs INT := 0;
BEGIN
  -- A. Purge expired sliding-window rate limit counters
  DELETE FROM public.rate_limits 
  WHERE reset_time < NOW();
  GET DIAGNOSTICS v_purged_rates = ROW_COUNT;

  -- B. Purge expired spatial weather cache entries
  DELETE FROM public.weather_cache 
  WHERE expires_at < NOW();
  GET DIAGNOSTICS v_purged_weather = ROW_COUNT;

  -- C. Purge completed background jobs older than 7 days
  DELETE FROM public.background_jobs 
  WHERE status = 'completed' 
    AND updated_at < (NOW() - INTERVAL '7 days');
  GET DIAGNOSTICS v_purged_completed_jobs = ROW_COUNT;

  -- D. Purge failed dead-letter background jobs older than 14 days
  DELETE FROM public.background_jobs 
  WHERE status = 'failed' 
    AND updated_at < (NOW() - INTERVAL '14 days');
  GET DIAGNOSTICS v_purged_failed_jobs = ROW_COUNT;

  -- E. Purge compliance audit logs older than 90 days
  DELETE FROM public.audit_logs 
  WHERE created_at < (NOW() - INTERVAL '90 days');
  GET DIAGNOSTICS v_purged_audit_logs = ROW_COUNT;

  RETURN jsonb_build_object(
    'purged_rate_limits', v_purged_rates,
    'purged_weather_cache', v_purged_weather,
    'purged_completed_jobs', v_purged_completed_jobs,
    'purged_failed_jobs', v_purged_failed_jobs,
    'purged_audit_logs', v_purged_audit_logs,
    'executed_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
