-- ====================================================================
-- AgriAI Real Agricultural Data Architecture Migration
-- Version: 20260922_real_data_architecture
-- Idempotent, Non-destructive schema extensions
-- ====================================================================

-- 1. Table: public.soil_profiles (12-parameter laboratory test records)
CREATE TABLE IF NOT EXISTS public.soil_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  sample_date DATE DEFAULT CURRENT_DATE,
  lab_name TEXT,
  sample_location TEXT,
  soil_type TEXT NOT NULL,
  ph NUMERIC(4,2) NOT NULL CHECK (ph >= 3.0 AND ph <= 11.0),
  ec_dsm NUMERIC(6,2),
  oc_percent NUMERIC(5,2),
  n_kg_ha NUMERIC(6,2),
  n_rating TEXT DEFAULT 'Medium',
  p_kg_ha NUMERIC(6,2),
  p_rating TEXT DEFAULT 'Medium',
  k_kg_ha NUMERIC(6,2),
  k_rating TEXT DEFAULT 'Medium',
  zn_ppm NUMERIC(6,2),
  fe_ppm NUMERIC(6,2),
  cu_ppm NUMERIC(6,2),
  mn_ppm NUMERIC(6,2),
  b_ppm NUMERIC(6,2),
  s_ppm NUMERIC(6,2),
  is_lab_verified BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'Complete' CHECK (status IN ('Complete', 'Partial', 'Insufficient')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_soil_profiles_farm UNIQUE (farm_id)
);

CREATE INDEX IF NOT EXISTS idx_soil_profiles_farmer ON public.soil_profiles (farmer_id);
CREATE INDEX IF NOT EXISTS idx_soil_profiles_farm ON public.soil_profiles (farm_id);

-- Enable RLS on soil_profiles
ALTER TABLE public.soil_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'soil_profiles' AND policyname = 'Farmers can manage their own soil profiles'
  ) THEN
    CREATE POLICY "Farmers can manage their own soil profiles"
      ON public.soil_profiles
      FOR ALL
      TO authenticated
      USING (auth.uid() = farmer_id)
      WITH CHECK (auth.uid() = farmer_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'soil_profiles' AND policyname = 'Demo farmer soil profiles readable'
  ) THEN
    CREATE POLICY "Demo farmer soil profiles readable"
      ON public.soil_profiles
      FOR SELECT
      TO anon, authenticated
      USING (farmer_id = '00000000-0000-0000-0000-000000000001'::uuid);
  END IF;
END $$;


-- 2. Table: public.market_prices (Daily APMC Mandi commodity rates)
CREATE TABLE IF NOT EXISTS public.market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity TEXT NOT NULL,
  variety TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  market TEXT NOT NULL,
  min_price NUMERIC(10,2),
  max_price NUMERIC(10,2),
  modal_price NUMERIC(10,2) NOT NULL,
  msp NUMERIC(10,2),
  price_date DATE NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_prices_lookup ON public.market_prices (commodity, state, district, price_date DESC);

-- Enable RLS on market_prices (Public Reference Data)
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'market_prices' AND policyname = 'Public read-only market prices'
  ) THEN
    CREATE POLICY "Public read-only market prices"
      ON public.market_prices
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;


-- 3. Table: public.government_advisories (Official AMFU / IMD Agromet Bulletins)
CREATE TABLE IF NOT EXISTS public.government_advisories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  agency TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  crops TEXT[],
  urgency TEXT NOT NULL DEFAULT 'Advisory',
  bulletin_summary TEXT NOT NULL,
  farming_instructions JSONB,
  issued_at TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  official_source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gov_advisories_validity ON public.government_advisories (valid_until DESC);
CREATE INDEX IF NOT EXISTS idx_gov_advisories_region ON public.government_advisories (state, district);

-- Enable RLS on government_advisories (Public Reference Data)
ALTER TABLE public.government_advisories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'government_advisories' AND policyname = 'Public read-only government advisories'
  ) THEN
    CREATE POLICY "Public read-only government advisories"
      ON public.government_advisories
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;


-- 4. Extend maintenance procedure to prune expired agricultural datasets
CREATE OR REPLACE FUNCTION public.cleanup_expired_records()
RETURNS void AS $$
BEGIN
  -- Prune expired rate limit counters
  DELETE FROM public.rate_limits WHERE reset_time < NOW();

  -- Prune expired weather cache rows
  DELETE FROM public.weather_cache WHERE expires_at < NOW();

  -- Prune completed background jobs older than 7 days
  DELETE FROM public.background_jobs 
  WHERE status = 'completed' AND updated_at < NOW() - INTERVAL '7 days';

  -- Prune dead-letter failed jobs older than 14 days
  DELETE FROM public.background_jobs 
  WHERE status = 'failed' AND updated_at < NOW() - INTERVAL '14 days';

  -- Prune market prices older than 60 days
  DELETE FROM public.market_prices 
  WHERE price_date < CURRENT_DATE - INTERVAL '60 days';

  -- Prune expired government advisories older than 30 days
  DELETE FROM public.government_advisories 
  WHERE valid_until < NOW() - INTERVAL '30 days';

  -- Prune audit logs older than 90 days
  DELETE FROM public.audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
