const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Email validation helper
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com'
      : 'http://localhost:3000',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const { action, ...payload } = JSON.parse(event.body || '{}')
    
    if (!action || typeof action !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid action required' })
      }
    }

    let result

    switch (action) {
      case 'signIn':
        if (!payload.email || !isValidEmail(payload.email)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Valid email required' })
          }
        }
        if (!payload.password || payload.password.length < 6) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Password must be at least 6 characters' })
          }
        }
        
        result = await supabase.auth.signInWithPassword(payload)
        break
        
      case 'signUp':
        result = await supabase.auth.signUp({
          ...payload,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
          }
        })
        break
        
      case 'signOut':
        const authHeader = event.headers.authorization
        if (authHeader?.startsWith('Bearer ')) {
          const token = authHeader.substring(7)
          result = await supabase.auth.signOut({ accessToken: token })
        } else {
          result = await supabase.auth.signOut()
        }
        break
        
      // ✅ ADDED: Password reset request (sends email)
      case 'resetPassword':
        if (!payload.email || !isValidEmail(payload.email)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Valid email required' })
          }
        }
        
        result = await supabase.auth.resetPasswordForEmail(payload.email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/update-password`
        })
        break
        
      // ✅ ADDED: Password update after clicking reset link
      case 'updatePassword':
        if (!payload.newPassword || payload.newPassword.length < 6) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'New password must be at least 6 characters' })
          }
        }
        
        result = await supabase.auth.updateUser({
          password: payload.newPassword
        })
        break
        
      case 'getSession':
        result = await supabase.auth.getSession()
        break
        
      case 'getUser':
        result = await supabase.auth.getUser()
        break
        
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    }
  } catch (error) {
    console.error('Auth function error:', error)
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Authentication error' 
      : error.message
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errorMessage })
    }
  }
}