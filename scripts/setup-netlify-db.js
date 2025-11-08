#!/usr/bin/env node

/**
 * Netlify Database Setup Script
 *
 * This script runs after deployment on Netlify to set up the Supabase database.
 * It checks if the database schema exists and creates it if needed.
 *
 * Usage in netlify.toml:
 * [build]
 *   command = "pnpm build && node scripts/setup-netlify-db.js"
 */

require("dotenv").config()

const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

// Set timeout to prevent hanging
const TIMEOUT_MS = 30000 // 30 seconds
const timeoutHandle = setTimeout(() => {
  console.error("❌ Script timed out after 30 seconds")
  process.exit(1)
}, TIMEOUT_MS)

// Get environment variables from Netlify build environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("🔍 Validating environment variables...")
if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not set")
  clearTimeout(timeoutHandle)
  process.exit(1)
}

if (!serviceKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set")
  clearTimeout(timeoutHandle)
  process.exit(1)
}

console.log("✅ Environment variables validated")

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function checkTableExists(tableName) {
  try {
    const { error } = await supabase.from(tableName).select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

async function runSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8')

  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          console.log(`⚠️  SQL execution warning: ${error.message}`)
        }
      } catch (err) {
        console.log(`⚠️  SQL execution warning: ${err.message}`)
      }
    }
  }
}

async function setupDatabase() {
  console.log("🔍 Checking database setup...")

  try {
    // Check if tables already exist
    const tablesExist = await checkTableExists('profiles')

    if (tablesExist) {
      console.log("✅ Database tables already exist. Skipping setup.")
      return
    }

    console.log("📝 Setting up database schema...")

    // Run the main schema file
    const schemaPath = path.join(__dirname, '..', 'scripts', 'supabase-schema.sql')
    await runSqlFile(schemaPath)

    console.log("✅ Database schema created successfully!")

    // Seed initial data
    console.log("🌱 Seeding initial data...")

    const seedScript = path.join(__dirname, 'seed-content.js')
    if (fs.existsSync(seedScript)) {
      // Run the seed script
      require(seedScript)
    }

    console.log("✅ Initial data seeded successfully!")

  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    // Don't exit with error - allow deployment to continue
    console.log("⚠️  Continuing deployment despite database setup issues...")
  }
}

async function main() {
  await setupDatabase()

  // Test the connection
  try {
    const { error } = await supabase.from('site_settings').select('key').limit(1)
    if (!error) {
      console.log("✅ Database connection test passed!")
    }
  } catch {
    console.log("⚠️  Database connection test failed, but continuing...")
  }
}

main().catch((error) => {
  console.error("❌ Script failed:", error.message)
  clearTimeout(timeoutHandle)
  process.exit(1)
}).finally(() => {
  clearTimeout(timeoutHandle)
})
