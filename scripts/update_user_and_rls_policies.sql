-- Complete script to update user role and RLS policies
-- This script updates medhat@gmail.com to super_admin and fixes RLS policies

-- First, update the user medhat@gmail.com to super_admin role
UPDATE profiles
SET role = 'super_admin', updated_at = NOW()
WHERE email = 'medhat@gmail.com';

-- Handle dashboard_metrics table (only one row allowed)
-- Check if row exists, if not insert, if yes update
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dashboard_metrics WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11') THEN
        INSERT INTO dashboard_metrics (id, total_contacts, total_page_views)
        VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 0, 0);
    END IF;
END $$;

-- Now update the RLS policies to allow both admin and super_admin roles

-- Profiles update policy
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Site settings policies
DROP POLICY IF EXISTS "Admins can update settings" ON site_settings;
CREATE POLICY "Admins can update settings" ON site_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can insert site settings" ON site_settings;
CREATE POLICY "Admins can insert site settings" ON site_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete site settings" ON site_settings;
CREATE POLICY "Admins can delete site settings" ON site_settings
  FOR DELETE USING (
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

-- Confirm the user update
SELECT email, role, status FROM profiles WHERE email = 'medhat@gmail.com';
