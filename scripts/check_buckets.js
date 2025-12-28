/**
 * Check storage buckets in Supabase.
 */

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@supabase/supabase-js");

// --- Configuration ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- Main Script Logic ---
async function checkBuckets() {
  // 1. Validate environment variables
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      "❌ Error: Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file."
    );
    process.exit(1);
  }

  // 2. Initialize Supabase client with admin privileges
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Connecting to Supabase at ${SUPABASE_URL}...`);

  // 3. List buckets
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error("❌ Error listing buckets:", error.message);
    process.exit(1);
  }

  console.log("✅ Buckets found:");
  buckets.forEach(bucket => {
    console.log(`- ${bucket.id} (public: ${bucket.public})`);
  });
}

// --- Execution ---
checkBuckets()
  .catch((error) => {
    console.error("\n❌ An unexpected error occurred:", error.message);
    process.exit(1);
  });
