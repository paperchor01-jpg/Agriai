-- ====================================================================
-- AgriAI — Smart Crop Advisory & Early Warning System (SIH25010)
-- File: supabase/staging-setup.sql
-- Target: NEW Staging Supabase Project
--
-- INSTRUCTIONS FOR SUPABASE SQL EDITOR:
-- 1. Open your NEW Supabase Staging Project dashboard.
-- 2. Go to the "SQL Editor" tab on the left sidebar.
-- 3. Click "+ New query".
-- 4. Paste this ENTIRE file into the editor.
-- 5. Ensure NO TEXT is highlighted/selected (click anywhere to deselect).
-- 6. Click the green "Run" button (or press Ctrl+Enter / Cmd+Enter).
-- ====================================================================

-- ====================================================================
-- 1. Automated updated_at Timestamp Helper Function
-- ====================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ====================================================================
-- 2. Core Tables
-- ====================================================================

-- 2.1 Farmers Table (Profile entity mapped to auth.users)
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 200),
  location TEXT NOT NULL CHECK (length(location) > 0 AND length(location) <= 200),
  farm_size NUMERIC(6, 2) NOT NULL DEFAULT 4.2 CHECK (farm_size >= 0 AND farm_size <= 50000),
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (length(preferred_language) <= 20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Farms Table (Agricultural plot holdings)
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  farm_name TEXT NOT NULL CHECK (length(farm_name) > 0 AND length(farm_name) <= 200),
  location TEXT NOT NULL CHECK (length(location) > 0 AND length(location) <= 200),
  area NUMERIC(6, 2) NOT NULL CHECK (area > 0 AND area <= 50000),
  soil_type TEXT NOT NULL DEFAULT 'Loamy' CHECK (length(soil_type) <= 50),
  soil_ph NUMERIC(3, 1) NOT NULL DEFAULT 6.8 CHECK (soil_ph >= 0 AND soil_ph <= 14),
  nitrogen_level TEXT NOT NULL DEFAULT 'Medium' CHECK (nitrogen_level IN ('Low', 'Medium', 'High')),
  phosphorus_level TEXT NOT NULL DEFAULT 'High' CHECK (phosphorus_level IN ('Low', 'Medium', 'High')),
  potassium_level TEXT NOT NULL DEFAULT 'Medium' CHECK (potassium_level IN ('Low', 'Medium', 'High')),
  soil_moisture INTEGER NOT NULL DEFAULT 62 CHECK (soil_moisture >= 0 AND soil_moisture <= 100),
  crop TEXT NOT NULL DEFAULT 'Wheat' CHECK (length(crop) <= 100),
  crop_stage TEXT NOT NULL DEFAULT 'Flowering' CHECK (length(crop_stage) <= 100),
  irrigation_available BOOLEAN NOT NULL DEFAULT TRUE,
  state TEXT NOT NULL DEFAULT 'Punjab',
  district TEXT NOT NULL DEFAULT 'Ludhiana',
  health_score INTEGER NOT NULL DEFAULT 85 CHECK (health_score >= 0 AND health_score <= 100),
  risk_level TEXT NOT NULL DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 Distributed Rate Limits Table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1 CHECK (count >= 0),
  reset_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 Weather Cache Table (Coordinate Clustered)
CREATE TABLE IF NOT EXISTS public.weather_cache (
  cache_key TEXT PRIMARY KEY,
  latitude NUMERIC(6, 3) NOT NULL,
  longitude NUMERIC(6, 3) NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 Pest & Disease Detections Table
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

-- 2.6 Farm Alerts & Notifications Table
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

-- 2.7 Serverless Background Jobs Table
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

-- 2.8 Security Audit Logs Table
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

-- ====================================================================
-- 3. Performance & Composite Indexes
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_farmers_location ON public.farmers(location);

CREATE INDEX IF NOT EXISTS idx_farms_farmer_id ON public.farms(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farms_crop ON public.farms(crop);
CREATE INDEX IF NOT EXISTS idx_farms_location ON public.farms(location);
CREATE INDEX IF NOT EXISTS idx_farms_farmer_created ON public.farms(farmer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_farms_crop_stage ON public.farms(crop, crop_stage);
CREATE INDEX IF NOT EXISTS idx_farms_state_district ON public.farms(state, district);
CREATE INDEX IF NOT EXISTS idx_farms_health_risk ON public.farms(health_score, risk_level);

CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON public.rate_limits(reset_time);

CREATE INDEX IF NOT EXISTS idx_weather_cache_expires_at ON public.weather_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_weather_cache_coords ON public.weather_cache(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_pest_detections_farmer ON public.pest_detections(farmer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pest_detections_crop_disease ON public.pest_detections(crop, disease);

CREATE INDEX IF NOT EXISTS idx_alerts_farmer_read ON public.alerts(farmer_id, read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON public.background_jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_status_created ON public.background_jobs(status, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action, created_at DESC);

-- ====================================================================
-- 4. Automated Triggers for updated_at
-- ====================================================================
DROP TRIGGER IF EXISTS trigger_farmers_updated_at ON public.farmers;
CREATE TRIGGER trigger_farmers_updated_at
  BEFORE UPDATE ON public.farmers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_farms_updated_at ON public.farms;
CREATE TRIGGER trigger_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_jobs_updated_at ON public.background_jobs;
CREATE TRIGGER trigger_jobs_updated_at
  BEFORE UPDATE ON public.background_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 5. Automated Signup Profile Creation Trigger
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.farmers (id, name, location, farm_size, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''), 'New Farmer'),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'location'), ''), 'Ludhiana, Punjab'),
    COALESCE((NEW.raw_user_meta_data->>'farm_size')::numeric, 4.2),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'preferred_language'), ''), 'en')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 6. Row Level Security (RLS) Configuration
-- ====================================================================

-- Enable RLS across all 8 tables
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pest_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6.1 Farmers Policies (Owner Only)
DROP POLICY IF EXISTS "Farmers can view their own profile" ON public.farmers;
CREATE POLICY "Farmers can view their own profile"
  ON public.farmers FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Farmers can insert their own profile" ON public.farmers;
CREATE POLICY "Farmers can insert their own profile"
  ON public.farmers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Farmers can update their own profile" ON public.farmers;
CREATE POLICY "Farmers can update their own profile"
  ON public.farmers FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 6.2 Farms Policies (Owner Only)
DROP POLICY IF EXISTS "Farmers can view their own farms" ON public.farms;
CREATE POLICY "Farmers can view their own farms"
  ON public.farms FOR SELECT TO authenticated
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can insert their own farms" ON public.farms;
CREATE POLICY "Farmers can insert their own farms"
  ON public.farms FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can update their own farms" ON public.farms;
CREATE POLICY "Farmers can update their own farms"
  ON public.farms FOR UPDATE TO authenticated
  USING (auth.uid() = farmer_id)
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can delete their own farms" ON public.farms;
CREATE POLICY "Farmers can delete their own farms"
  ON public.farms FOR DELETE TO authenticated
  USING (auth.uid() = farmer_id);

-- 6.3 Demo Farmer Anon Read-Only Isolation (Arjun Singh)
DROP POLICY IF EXISTS "Allow anon read of demo farms" ON public.farms;
CREATE POLICY "Allow anon read of demo farms"
  ON public.farms FOR SELECT TO anon
  USING (farmer_id = '00000000-0000-0000-0000-000000000001');

DROP POLICY IF EXISTS "Allow anon read of demo farmers" ON public.farmers;
CREATE POLICY "Allow anon read of demo farmers"
  ON public.farmers FOR SELECT TO anon
  USING (id = '00000000-0000-0000-0000-000000000001');

-- 6.4 Rate Limits Policies (Denied direct anon access, managed via RPC)
DROP POLICY IF EXISTS "Deny direct anon access to rate_limits" ON public.rate_limits;
CREATE POLICY "Deny direct anon access to rate_limits"
  ON public.rate_limits FOR ALL TO anon
  USING (false);

-- 6.5 Weather Cache Policies (Public read on unexpired records)
DROP POLICY IF EXISTS "Allow read of unexpired weather cache" ON public.weather_cache;
CREATE POLICY "Allow read of unexpired weather cache"
  ON public.weather_cache FOR SELECT TO public
  USING (expires_at > NOW());

-- 6.6 Pest Detections Policies (Owner access + Demo fallback)
DROP POLICY IF EXISTS "Farmers can view their own pest detections" ON public.pest_detections;
CREATE POLICY "Farmers can view their own pest detections"
  ON public.pest_detections FOR SELECT TO authenticated
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can insert their own pest detections" ON public.pest_detections;
CREATE POLICY "Farmers can insert their own pest detections"
  ON public.pest_detections FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can delete their own pest detections" ON public.pest_detections;
CREATE POLICY "Farmers can delete their own pest detections"
  ON public.pest_detections FOR DELETE TO authenticated
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Allow anon read demo pest detections" ON public.pest_detections;
CREATE POLICY "Allow anon read demo pest detections"
  ON public.pest_detections FOR SELECT TO anon
  USING (farmer_id = '00000000-0000-0000-0000-000000000001');

-- 6.7 Alerts Policies (Owner access + Demo fallback)
DROP POLICY IF EXISTS "Farmers can view their own alerts" ON public.alerts;
CREATE POLICY "Farmers can view their own alerts"
  ON public.alerts FOR SELECT TO authenticated
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can update read status on their own alerts" ON public.alerts;
CREATE POLICY "Farmers can update read status on their own alerts"
  ON public.alerts FOR UPDATE TO authenticated
  USING (auth.uid() = farmer_id)
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can delete their own alerts" ON public.alerts;
CREATE POLICY "Farmers can delete their own alerts"
  ON public.alerts FOR DELETE TO authenticated
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Allow anon read demo alerts" ON public.alerts;
CREATE POLICY "Allow anon read demo alerts"
  ON public.alerts FOR SELECT TO anon
  USING (farmer_id = '00000000-0000-0000-0000-000000000001');

-- 6.8 Background Jobs Policies (Owner access)
DROP POLICY IF EXISTS "Users can view their own background jobs" ON public.background_jobs;
CREATE POLICY "Users can view their own background jobs"
  ON public.background_jobs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own background jobs" ON public.background_jobs;
CREATE POLICY "Users can insert their own background jobs"
  ON public.background_jobs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 6.9 Audit Logs Policies (System write-only, denied anon access)
DROP POLICY IF EXISTS "Deny anon access to audit_logs" ON public.audit_logs;
CREATE POLICY "Deny anon access to audit_logs"
  ON public.audit_logs FOR ALL TO anon
  USING (false);

-- ====================================================================
-- 7. Atomic Stored Functions (RPC)
-- ====================================================================

-- 7.1 Atomic Distributed Rate Limiter
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
  SELECT count, reset_time INTO v_count, v_reset_time
  FROM public.rate_limits
  WHERE key = p_key;

  IF NOT FOUND OR v_reset_time <= v_now THEN
    v_reset_time := v_now + (p_window_seconds || ' seconds')::INTERVAL;
    v_count := 1;
    v_allowed := TRUE;

    INSERT INTO public.rate_limits (key, count, reset_time)
    VALUES (p_key, v_count, v_reset_time)
    ON CONFLICT (key) DO UPDATE
    SET count = 1,
        reset_time = EXCLUDED.reset_time;
  ELSE
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

-- 7.2 Cache & Rate Limit Purge Maintenance Routine
CREATE OR REPLACE FUNCTION public.cleanup_expired_records()
RETURNS JSONB AS $$
DECLARE
  v_purged_rates INT := 0;
  v_purged_weather INT := 0;
BEGIN
  DELETE FROM public.rate_limits WHERE reset_time < NOW();
  GET DIAGNOSTICS v_purged_rates = ROW_COUNT;

  DELETE FROM public.weather_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS v_purged_weather = ROW_COUNT;

  RETURN jsonb_build_object(
    'purged_rate_limits', v_purged_rates,
    'purged_weather_cache', v_purged_weather,
    'executed_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7.3 Server-Side Role Verification Helper
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

-- ====================================================================
-- 8. Initial Demo Seed Data (Deterministic UUID)
-- ====================================================================
DO $$
DECLARE
  v_farmer_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.farmers WHERE id = v_farmer_id) THEN
    INSERT INTO public.farmers (id, name, location, farm_size, preferred_language)
    VALUES (v_farmer_id, 'Arjun Singh', 'Ludhiana, Punjab', 4.20, 'English');

    INSERT INTO public.farms (
      farmer_id,
      farm_name,
      location,
      area,
      soil_type,
      soil_ph,
      nitrogen_level,
      phosphorus_level,
      potassium_level,
      soil_moisture,
      crop,
      crop_stage,
      irrigation_available,
      state,
      district,
      health_score,
      risk_level
    )
    VALUES (
      v_farmer_id,
      'Green Valley Farm',
      'Ludhiana, Punjab',
      4.20,
      'Loamy',
      6.8,
      'Medium',
      'High',
      'Medium',
      62,
      'Wheat',
      'Flowering',
      TRUE,
      'Punjab',
      'Ludhiana',
      88,
      'Low'
    );

    INSERT INTO public.farms (
      farmer_id,
      farm_name,
      location,
      area,
      soil_type,
      soil_ph,
      nitrogen_level,
      phosphorus_level,
      potassium_level,
      soil_moisture,
      crop,
      crop_stage,
      irrigation_available,
      state,
      district,
      health_score,
      risk_level
    )
    VALUES (
      v_farmer_id,
      'Canal Side Acreage',
      'Amritsar, Punjab',
      2.50,
      'Clay Loam',
      7.2,
      'Medium',
      'Medium',
      'Low',
      54,
      'Mustard',
      'Vegetative',
      TRUE,
      'Punjab',
      'Amritsar',
      82,
      'Low'
    );
  END IF;
END $$;

-- ====================================================================
-- 9. Supabase Storage Bucket for Crop Foliar Diagnosis Images
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('crop-images', 'crop-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view crop inspection images
DROP POLICY IF EXISTS "Allow public read of crop images" ON storage.objects;
CREATE POLICY "Allow public read of crop images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'crop-images');

-- Storage RLS: Authenticated users can upload crop inspection images
DROP POLICY IF EXISTS "Allow authenticated upload of crop images" ON storage.objects;
CREATE POLICY "Allow authenticated upload of crop images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'crop-images');
