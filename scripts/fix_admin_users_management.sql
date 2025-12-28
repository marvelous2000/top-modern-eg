-- Fix admin users management in admin panel
-- This script adds missing RLS policies to allow super_admin users to manage other admin users

-- Profiles table policies for admin user management

-- Allow super_admins to view all profiles (including other admins)
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
CREATE POLICY "Super admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Allow super_admins to insert new admin users
DROP POLICY IF EXISTS "Super admins can create admin users" ON profiles;
CREATE POLICY "Super admins can create admin users" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Allow super_admins to update any profile (including other admins)
DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;
CREATE POLICY "Super admins can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Allow super_admins to delete admin users (but not other super_admins)
DROP POLICY IF EXISTS "Super admins can delete admin users" ON profiles;
CREATE POLICY "Super admins can delete admin users" ON profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    ) AND profiles.role IN ('admin', 'editor', 'viewer', 'advertiser')
  );

-- Regular admins can only update their own profile (keep existing policy)
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ) OR auth.uid() = profiles.id
  );

-- Ensure authenticated users can still view profiles (for general access)
-- This policy allows authenticated users to view profiles, but super_admins get broader access via the policy above
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Display current admin users for verification
SELECT email, role, status, created_at
FROM profiles
WHERE role IN ('admin', 'super_admin')
ORDER BY created_at DESC;
