-- ====================================================================
-- AgriAI — Smart Crop Advisory System (SIH25010)
-- Migration: 20260830_initial_schema.sql
-- Description: Initial database foundation for Farmers and Farms
-- ====================================================================

-- 1. Helper function for automated updated_at timestamp maintenance
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 2. Farmers Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  farm_size NUMERIC(6, 2) NOT NULL DEFAULT 4.2 CHECK (farm_size >= 0),
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for searching farmers by name or location
CREATE INDEX IF NOT EXISTS idx_farmers_location ON farmers(location);

-- Trigger to auto-update updated_at on farmers
DROP TRIGGER IF EXISTS trigger_farmers_updated_at ON farmers;
CREATE TRIGGER trigger_farmers_updated_at
  BEFORE UPDATE ON farmers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 3. Farms Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  farm_name TEXT NOT NULL,
  location TEXT NOT NULL,
  area NUMERIC(6, 2) NOT NULL CHECK (area > 0),
  soil_type TEXT NOT NULL DEFAULT 'Loamy',
  soil_ph NUMERIC(3, 1) NOT NULL DEFAULT 6.8 CHECK (soil_ph >= 0 AND soil_ph <= 14),
  nitrogen_level TEXT NOT NULL DEFAULT 'Medium',
  phosphorus_level TEXT NOT NULL DEFAULT 'High',
  potassium_level TEXT NOT NULL DEFAULT 'Medium',
  soil_moisture INTEGER NOT NULL DEFAULT 62 CHECK (soil_moisture >= 0 AND soil_moisture <= 100),
  crop TEXT NOT NULL DEFAULT 'Wheat',
  crop_stage TEXT NOT NULL DEFAULT 'Flowering',
  irrigation_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Foreign Key & performance indexes
CREATE INDEX IF NOT EXISTS idx_farms_farmer_id ON farms(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farms_crop ON farms(crop);

-- Trigger to auto-update updated_at on farms
DROP TRIGGER IF EXISTS trigger_farms_updated_at ON farms;
CREATE TRIGGER trigger_farms_updated_at
  BEFORE UPDATE ON farms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 4. Row Level Security (RLS) Configuration
-- ====================================================================
-- Enable RLS on both tables
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- DEVELOPMENT POLICIES:
-- Note: Authentication is not implemented in this step.
-- These read policies allow the frontend prototype to query demo data.
-- When Supabase Auth is added in a subsequent step, replace these with:
--   USING (auth.uid() = id) for farmers
--   USING (auth.uid() = farmer_id) for farms
-- --------------------------------------------------------------------

-- Policy: Allow read access for farmers (Development Prototype)
DROP POLICY IF EXISTS "Allow read access to farmers during development" ON farmers;
CREATE POLICY "Allow read access to farmers during development"
  ON farmers
  FOR SELECT
  USING (true);

-- Policy: Allow read access to farms (Development Prototype)
DROP POLICY IF EXISTS "Allow read access to farms during development" ON farms;
CREATE POLICY "Allow read access to farms during development"
  ON farms
  FOR SELECT
  USING (true);

-- Policy: Allow insert/update for development testing
DROP POLICY IF EXISTS "Allow insert to farmers during development" ON farmers;
CREATE POLICY "Allow insert to farmers during development"
  ON farmers
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update to farmers during development" ON farmers;
CREATE POLICY "Allow update to farmers during development"
  ON farmers
  FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow insert to farms during development" ON farms;
CREATE POLICY "Allow insert to farms during development"
  ON farms
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update to farms during development" ON farms;
CREATE POLICY "Allow update to farms during development"
  ON farms
  FOR UPDATE
  USING (true);

-- ====================================================================
-- 5. Initial Seed Data (Demo Farmer & Demo Farm)
-- ====================================================================
DO $$
DECLARE
  v_farmer_id UUID;
BEGIN
  -- Insert demo farmer if not already present
  IF NOT EXISTS (SELECT 1 FROM farmers WHERE name = 'Arjun Singh' AND location = 'Ludhiana, Punjab') THEN
    INSERT INTO farmers (name, location, farm_size, preferred_language)
    VALUES ('Arjun Singh', 'Ludhiana, Punjab', 4.20, 'English')
    RETURNING id INTO v_farmer_id;

    -- Insert primary demo farm
    INSERT INTO farms (
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
      irrigation_available
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
      TRUE
    );

    -- Insert secondary demo farm
    INSERT INTO farms (
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
      irrigation_available
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
      TRUE
    );
  END IF;
END $$;
