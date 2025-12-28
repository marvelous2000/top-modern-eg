/**
 * Run SQL from a file using Supabase exec_sql function.
 *
 * Usage:
 *   node scripts/run_sql.js <sql_file>
 *
 * Example:
 *   node scripts/run_sql.js scripts/update_rls_policies.sql
 */

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// --- Configuration ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- Main Script Logic ---
async function runSql() {
  // 1. Validate environment variables and arguments
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      "❌ Error: Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file."
    );
    process.exit(1);
  }

  const sqlFile = process.argv[2];

  if (!sqlFile) {
    console.error(
      "❌ Error: Please provide the path to the SQL file.\n" +
        "Usage: node scripts/run_sql.js <sql_file>"
    );
    process.exit(1);
  }

  // Read the SQL file
  const sqlPath = path.resolve(sqlFile);
  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Error: SQL file '${sqlFile}' does not exist.`);
    process.exit(1);
  }

  const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

  // 2. Initialize Supabase client with admin privileges
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Connecting to Supabase at ${SUPABASE_URL}...`);
  console.log(`Executing SQL from ${sqlFile}...`);

  // 3. Execute the SQL using the exec_sql function
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sqlQuery });

  if (error) {
    console.error("❌ Error executing SQL:", error.message);
    process.exit(1);
  }

  console.log("✅ SQL executed successfully.");
  console.log("Result:", data);
}

// --- Execution ---
const timeoutHandle = setTimeout(() => {
  console.error("❌ Script timed out after 30 seconds. Check your network connection and Supabase URL.");
  process.exit(1);
}, 30000);

runSql()
  .catch((error) => {
    console.error("\n❌ An unexpected error occurred:", error.message);
    process.exit(1);
  })
  .finally(() => {
    clearTimeout(timeoutHandle);
  });
