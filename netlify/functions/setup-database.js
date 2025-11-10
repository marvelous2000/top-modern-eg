const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

exports.handler = async (event, context) => {
  // Set timeout to prevent hanging
  const TIMEOUT_MS = 30000 // 30 seconds
  const timeoutHandle = setTimeout(() => {
    console.error("❌ Function timed out after 30 seconds")
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Function timed out" })
    }
  }, TIMEOUT_MS)

  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      clearTimeout(timeoutHandle)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing environment variables" })
      }
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if tables already exist
    const { error: checkError } = await supabase.from('profiles').select('id').limit(1)
    if (!checkError) {
      clearTimeout(timeoutHandle)
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Database already initialized" })
      }
    }

    // Run schema setup
    const schemaPath = path.join(process.cwd(), 'scripts', 'supabase-schema.sql')
    if (!fs.existsSync(schemaPath)) {
      clearTimeout(timeoutHandle)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Schema file not found" })
      }
    }

    const sql = fs.readFileSync(schemaPath, 'utf8')
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          console.log(`⚠️ SQL warning: ${error.message}`)
        }
      }
    }

    clearTimeout(timeoutHandle)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Database schema created successfully" })
    }

  } catch (error) {
    clearTimeout(timeoutHandle)
    console.error("Setup database error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
