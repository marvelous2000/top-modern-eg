/**
 * Simple script to update RLS policies directly
 */

require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Error: Missing environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function updateRLSPolicies() {
  console.log("Updating RLS policies...");

  const sql = `
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

    -- Site settings policies
    DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
    CREATE POLICY "Admins can update site settings" ON site_settings
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
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error("❌ Error updating policies:", error.message);
      process.exit(1);
    }

    console.log("✅ RLS policies updated successfully!");
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
    process.exit(1);
  }
}

updateRLSPolicies();
