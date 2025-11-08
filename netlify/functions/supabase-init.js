const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  // This function runs on every request to initialize Supabase connection
  // Environment variables are automatically available in Netlify functions

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Supabase configuration missing' })
    }
  }

  // Test the connection
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data, error } = await supabase.from('site_settings').select('key, value').limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database connection failed' })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Supabase connection successful',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Supabase initialization error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Supabase initialization failed' })
    }
  }
}
