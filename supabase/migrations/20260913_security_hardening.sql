-- ====================================================================
-- AgriAI — Smart Crop Advisory System (SIH25010)
-- Migration: 20260913_security_hardening.sql
-- Description: Comprehensive 8-Layer Security Hardening for Supabase RLS
-- ====================================================================

-- 1. Secure Timestamp Maintenance Function with Fixed Search Path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ====================================================================
-- 2. Hardened Farmers Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 200),
  location TEXT NOT NULL CHECK (length(location) > 0 AND length(location) <= 200),
  farm_size NUMERIC(6, 2) NOT NULL DEFAULT 4.2 CHECK (farm_size >= 0 AND farm_size <= 50000),
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (length(preferred_language) <= 20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farmers_location ON public.farmers(location);

DROP TRIGGER IF EXISTS trigger_farmers_updated_at ON public.farmers;
CREATE TRIGGER trigger_farmers_updated_at
  BEFORE UPDATE ON public.farmers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 3. Hardened Farms Table
-- ====================================================================
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farms_farmer_id ON public.farms(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farms_crop ON public.farms(crop);

DROP TRIGGER IF EXISTS trigger_farms_updated_at ON public.farms;
CREATE TRIGGER trigger_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 4. Clean Up Legacy Insecure Development Policies
-- ====================================================================
DROP POLICY IF EXISTS "Allow read access to farmers during development" ON public.farmers;
DROP POLICY IF EXISTS "Allow insert to farmers during development" ON public.farmers;
DROP POLICY IF EXISTS "Allow update to farmers during development" ON public.farmers;
DROP POLICY IF EXISTS "Allow read access to farms during development" ON public.farms;
DROP POLICY IF EXISTS "Allow insert to farms during development" ON public.farms;
DROP POLICY IF EXISTS "Allow update to farms during development" ON public.farms;

-- ====================================================================
-- 5. Strict Owner-Only Row Level Security (RLS)
-- ====================================================================
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- Farmers Table Policies (Owner-Only Access)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Farmers can view their own profile" ON public.farmers;
CREATE POLICY "Farmers can view their own profile"
  ON public.farmers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Farmers can insert their own profile" ON public.farmers;
CREATE POLICY "Farmers can insert their own profile"
  ON public.farmers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Farmers can update their own profile" ON public.farmers;
CREATE POLICY "Farmers can update their own profile"
  ON public.farmers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------------------
-- Farms Table Policies (Owner-Only Access + Anti-Reassignment)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Farmers can view their own farms" ON public.farms;
CREATE POLICY "Farmers can view their own farms"
  ON public.farms
  FOR SELECT
  TO authenticated
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can insert their own farms" ON public.farms;
CREATE POLICY "Farmers can insert their own farms"
  ON public.farms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can update their own farms" ON public.farms;
CREATE POLICY "Farmers can update their own farms"
  ON public.farms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = farmer_id)
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can delete their own farms" ON public.farms;
CREATE POLICY "Farmers can delete their own farms"
  ON public.farms
  FOR DELETE
  TO authenticated
  USING (auth.uid() = farmer_id);

-- --------------------------------------------------------------------
-- Hardened Anonymous Access (Demo Farmer Only)
-- Prevent public enumeration of real farmers or farms.
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon read of demo farms" ON public.farms;
CREATE POLICY "Allow anon read of demo farms"
  ON public.farms
  FOR SELECT
  TO anon
  USING (farmer_id = '00000000-0000-0000-0000-000000000001');

DROP POLICY IF EXISTS "Allow anon read of demo farmers" ON public.farmers;
CREATE POLICY "Allow anon read of demo farmers"
  ON public.farmers
  FOR SELECT
  TO anon
  USING (id = '00000000-0000-0000-0000-000000000001');

-- ====================================================================
-- 6. Hardened Signup Trigger Function
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
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
