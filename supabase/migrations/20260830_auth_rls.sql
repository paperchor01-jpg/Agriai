-- ====================================================================
-- AgriAI — Smart Crop Advisory System (SIH25010)
-- Migration: 20260830_auth_rls.sql
-- Description: Connect Farmers & Farms to Supabase Auth with RLS
-- ====================================================================

-- 1. Automated trigger function: creates farmer profile upon signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.farmers (id, name, location, farm_size, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New Farmer'),
    COALESCE(NEW.raw_user_meta_data->>'location', 'Punjab, India'),
    COALESCE((NEW.raw_user_meta_data->>'farm_size')::numeric, 4.2),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to Supabase auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 2. Row Level Security Policies for Authenticated Users
-- ====================================================================

-- Farmers Table Policies (Owner-only access)
DROP POLICY IF EXISTS "Farmers can view their own profile" ON farmers;
CREATE POLICY "Farmers can view their own profile"
  ON farmers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Farmers can insert their own profile" ON farmers;
CREATE POLICY "Farmers can insert their own profile"
  ON farmers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Farmers can update their own profile" ON farmers;
CREATE POLICY "Farmers can update their own profile"
  ON farmers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Farms Table Policies (Owner-only access: farmer_id = auth.uid())
DROP POLICY IF EXISTS "Farmers can view their own farms" ON farms;
CREATE POLICY "Farmers can view their own farms"
  ON farms
  FOR SELECT
  TO authenticated
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can insert their own farms" ON farms;
CREATE POLICY "Farmers can insert their own farms"
  ON farms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can update their own farms" ON farms;
CREATE POLICY "Farmers can update their own farms"
  ON farms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = farmer_id)
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can delete their own farms" ON farms;
CREATE POLICY "Farmers can delete their own farms"
  ON farms
  FOR DELETE
  TO authenticated
  USING (auth.uid() = farmer_id);

-- 3. Hardened Anonymous Access (Demo Only)
-- Prevent public enumeration of real farmers' plots.
-- Anon users can only query the explicit public demo farmer record.
DROP POLICY IF EXISTS "Allow anon read of demo farms" ON farms;
CREATE POLICY "Allow anon read of demo farms"
  ON farms
  FOR SELECT
  TO anon
  USING (farmer_id = '00000000-0000-0000-0000-000000000001');

DROP POLICY IF EXISTS "Allow anon read of demo farmers" ON farmers;
CREATE POLICY "Allow anon read of demo farmers"
  ON farmers
  FOR SELECT
  TO anon
  USING (id = '00000000-0000-0000-0000-000000000001');
