-- Update RLS policies to allow super_admin as well as admin

-- Profiles update policy
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Site settings update policy
DROP POLICY IF EXISTS "Admins can update settings" ON site_settings;
CREATE POLICY "Admins can update settings" ON site_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Legal pages policy
DROP POLICY IF EXISTS "Admins can manage legal pages" ON legal_pages;
CREATE POLICY "Admins can manage legal pages" ON legal_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Tracking pixels policy
DROP POLICY IF EXISTS "Admins can manage pixels" ON tracking_pixels;
CREATE POLICY "Admins can manage pixels" ON tracking_pixels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
