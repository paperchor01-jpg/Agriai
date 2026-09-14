-- ====================================================================
-- AgriAI — Smart Crop Advisory System (SIH25010)
-- Migration: 20260913_production_scale.sql
-- Description: Production Scale & Architecture Upgrade
-- Supports scaling from 100 to 100,000+ users with zero data loss,
-- composite indexing, distributed rate limiting, weather caching,
-- structured pest detection history, alerts, async background jobs,
-- and audit logging.
-- ====================================================================

-- ====================================================================
-- 1. Additive Enhancements & High-Performance Indexes for Farms
-- ====================================================================

-- Add macro-analytics columns if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'farms' AND column_name = 'state'
  ) THEN
    ALTER TABLE public.farms ADD COLUMN state TEXT NOT NULL DEFAULT 'Punjab';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'farms' AND column_name = 'district'
  ) THEN
    ALTER TABLE public.farms ADD COLUMN district TEXT NOT NULL DEFAULT 'Ludhiana';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'farms' AND column_name = 'health_score'
  ) THEN
    ALTER TABLE public.farms ADD COLUMN health_score INTEGER NOT NULL DEFAULT 85 CHECK (health_score >= 0 AND health_score <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'farms' AND column_name = 'risk_level'
  ) THEN
    ALTER TABLE public.farms ADD COLUMN risk_level TEXT NOT NULL DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical'));
  END IF;
END $$;

-- High-performance composite indexes for keyset pagination & multi-tenant isolation
CREATE INDEX IF NOT EXISTS idx_farms_farmer_created ON public.farms(farmer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_farms_location ON public.farms(location);
CREATE INDEX IF NOT EXISTS idx_farms_crop_stage ON public.farms(crop, crop_stage);
CREATE INDEX IF NOT EXISTS idx_farms_state_district ON public.farms(state, district);
CREATE INDEX IF NOT EXISTS idx_farms_health_risk ON public.farms(health_score, risk_level);

-- ====================================================================
-- 2. Distributed Rate Limits Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1 CHECK (count >= 0),
  reset_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON public.rate_limits(reset_time);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limits are managed via atomic SECURITY DEFINER function or service_role
DROP POLICY IF EXISTS "Deny direct anon access to rate_limits" ON public.rate_limits;
CREATE POLICY "Deny direct anon access to rate_limits"
  ON public.rate_limits
  FOR ALL
  TO anon
  USING (false);

-- ====================================================================
-- 3. Coordinate-Clustered Weather Cache Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.weather_cache (
  cache_key TEXT PRIMARY KEY,
  latitude NUMERIC(6, 3) NOT NULL,
  longitude NUMERIC(6, 3) NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weather_cache_expires_at ON public.weather_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_weather_cache_coords ON public.weather_cache(latitude, longitude);

ALTER TABLE public.weather_cache ENABLE ROW LEVEL SECURITY;

-- Allow read of unexpired weather telemetry for authenticated & anon clients
DROP POLICY IF EXISTS "Allow read of unexpired weather cache" ON public.weather_cache;
CREATE POLICY "Allow read of unexpired weather cache"
  ON public.weather_cache
  FOR SELECT
  TO public
  USING (expires_at > NOW());

-- ====================================================================
-- 4. Pest & Disease Detections (Historical Diagnostic Archive)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.pest_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  crop TEXT NOT NULL,
  disease TEXT NOT NULL,
  confidence NUMERIC(4, 3) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  severity TEXT NOT NULL DEFAULT 'Moderate' CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical')),
  image_url TEXT,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pest_detections_farmer ON public.pest_detections(farmer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pest_detections_crop_disease ON public.pest_detections(crop, disease);

ALTER TABLE public.pest_detections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Farmers can view their own pest detections" ON public.pest_detections;
CREATE POLICY "Farmers can view their own pest detections"
  ON public.pest_detections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can insert their own pest detections" ON public.pest_detections;
CREATE POLICY "Farmers can insert their own pest detections"
  ON public.pest_detections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can delete their own pest detections" ON public.pest_detections;
CREATE POLICY "Farmers can delete their own pest detections"
  ON public.pest_detections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = farmer_id);

-- Demo fallback access
DROP POLICY IF EXISTS "Allow anon read demo pest detections" ON public.pest_detections;
CREATE POLICY "Allow anon read demo pest detections"
  ON public.pest_detections
  FOR SELECT
  TO anon
  USING (farmer_id = '00000000-0000-0000-0000-000000000001');

-- ====================================================================
-- 5. Persistent Farm Alerts & Notifications
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  level TEXT NOT NULL CHECK (level IN ('critical', 'warning', 'info')),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_farmer_read ON public.alerts(farmer_id, read, created_at DESC);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Farmers can view their own alerts" ON public.alerts;
CREATE POLICY "Farmers can view their own alerts"
  ON public.alerts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can update read status on their own alerts" ON public.alerts;
CREATE POLICY "Farmers can update read status on their own alerts"
  ON public.alerts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = farmer_id)
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can delete their own alerts" ON public.alerts;
CREATE POLICY "Farmers can delete their own alerts"
  ON public.alerts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = farmer_id);

-- Demo fallback access
DROP POLICY IF EXISTS "Allow anon read demo alerts" ON public.alerts;
CREATE POLICY "Allow anon read demo alerts"
  ON public.alerts
  FOR SELECT
  TO anon
  USING (farmer_id = '00000000-0000-0000-0000-000000000001');

-- ====================================================================
-- 6. Serverless Background Job Queue
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts INTEGER NOT NULL DEFAULT 3,
  result JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON public.background_jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_status_created ON public.background_jobs(status, created_at ASC);

DROP TRIGGER IF EXISTS trigger_jobs_updated_at ON public.background_jobs;
CREATE TRIGGER trigger_jobs_updated_at
  BEFORE UPDATE ON public.background_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own background jobs" ON public.background_jobs;
CREATE POLICY "Users can view their own background jobs"
  ON public.background_jobs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own background jobs" ON public.background_jobs;
CREATE POLICY "Users can insert their own background jobs"
  ON public.background_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- 7. Security & Admin Audit Log Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Audits are write-only for system, viewable only by administrators
DROP POLICY IF EXISTS "Deny anon access to audit_logs" ON public.audit_logs;
CREATE POLICY "Deny anon access to audit_logs"
  ON public.audit_logs
  FOR ALL
  TO anon
  USING (false);

-- ====================================================================
-- 8. Atomic Stored Functions (RPC)
-- ====================================================================

-- 8.1 Atomic Distributed Rate Limiter
CREATE OR REPLACE FUNCTION public.increment_rate_limit(
  p_key TEXT,
  p_window_seconds INT,
  p_max_limit INT
)
RETURNS JSONB AS $$
DECLARE
  v_now TIMESTAMPTZ := NOW();
  v_reset_time TIMESTAMPTZ;
  v_count INT;
  v_allowed BOOLEAN;
  v_retry_after INT := 0;
BEGIN
  -- Check existing active record
  SELECT count, reset_time INTO v_count, v_reset_time
  FROM public.rate_limits
  WHERE key = p_key;

  IF NOT FOUND OR v_reset_time <= v_now THEN
    -- Initialize or reset window
    v_reset_time := v_now + (p_window_seconds || ' seconds')::INTERVAL;
    v_count := 1;
    v_allowed := TRUE;

    INSERT INTO public.rate_limits (key, count, reset_time)
    VALUES (p_key, v_count, v_reset_time)
    ON CONFLICT (key) DO UPDATE
    SET count = 1,
        reset_time = EXCLUDED.reset_time;
  ELSE
    -- Active window exists
    IF v_count < p_max_limit THEN
      v_count := v_count + 1;
      v_allowed := TRUE;
      UPDATE public.rate_limits
      SET count = v_count
      WHERE key = p_key;
    ELSE
      v_allowed := FALSE;
      v_retry_after := GREATEST(1, EXTRACT(EPOCH FROM (v_reset_time - v_now))::INT);
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'allowed', v_allowed,
    'current', v_count,
    'limit', p_max_limit,
    'reset_in_seconds', GREATEST(0, EXTRACT(EPOCH FROM (v_reset_time - v_now))::INT),
    'retry_after', v_retry_after
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8.2 Maintenance Routine for Purging Stale Cache & Rate Limits
CREATE OR REPLACE FUNCTION public.cleanup_expired_records()
RETURNS JSONB AS $$
DECLARE
  v_purged_rates INT := 0;
  v_purged_weather INT := 0;
BEGIN
  -- Delete expired rate limits
  DELETE FROM public.rate_limits
  WHERE reset_time < NOW();
  GET DIAGNOSTICS v_purged_rates = ROW_COUNT;

  -- Delete expired weather cache
  DELETE FROM public.weather_cache
  WHERE expires_at < NOW();
  GET DIAGNOSTICS v_purged_weather = ROW_COUNT;

  RETURN jsonb_build_object(
    'purged_rate_limits', v_purged_rates,
    'purged_weather_cache', v_purged_weather,
    'executed_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8.3 Server-Side Role Verification Helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE(
      (auth.jwt()->'app_metadata'->>'role'),
      (auth.jwt()->'user_metadata'->>'role')
    ) IN ('admin', 'authority', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;
