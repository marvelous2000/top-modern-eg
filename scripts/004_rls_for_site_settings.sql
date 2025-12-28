-- scripts/004_rls_for_site_settings.sql

-- First, create a helper function to get a user's role from the profiles table.
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on the site_settings table if not already enabled
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow admins to read all settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow admins to update settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow all users to read settings" ON public.site_settings;


-- Create a new policy for SELECT
-- Allow any authenticated user to read the settings.
CREATE POLICY "Allow authenticated users to read settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (true);

-- Create a new policy for UPDATE
-- Allow users with 'admin' or 'super_admin' roles to update settings.
CREATE POLICY "Allow admins to update settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (
  get_user_role(auth.uid()) IN ('admin', 'super_admin')
)
WITH CHECK (
  get_user_role(auth.uid()) IN ('admin', 'super_admin')
);

-- Create a new policy for INSERT
-- Allow users with 'admin' or 'super_admin' roles to insert settings.
CREATE POLICY "Allow admins to insert settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (
  get_user_role(auth.uid()) IN ('admin', 'super_admin')
);

-- Note: We are not creating policies for INSERT or DELETE.
-- This setup assumes settings are seeded initially and only updated.
-- If new settings can be created via the UI, an INSERT policy would be needed.
