import { createBrowserClient as createSupabaseClientFromSsr } from "@supabase/ssr"

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (typeof window === 'undefined' || !url || !anonKey) {
    // Return a mock client during SSR or if env vars are missing
    return createSupabaseClientFromSsr("https://placeholder.supabase.co", "placeholder-key")
  }

  return createSupabaseClientFromSsr(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  })
}

export async function signInWithPassword(email: string, password: string) {
  try {
    const response = await fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'signIn',
        email,
        password,
      }),
    })

    if (!response.ok) {
      throw new Error('Authentication failed')
    }

    const result = await response.json()
    return result
  } catch (error: unknown) {
    // Provide a clearer message if the fetch failed due to missing local
    // auth endpoint (e.g., Netlify functions not running) or network issues.
    console.error('Sign in error:', error)
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && /fetch failed|network|Failed to fetch/i.test(error.message)) {
      throw new Error(
        'Unable to contact the authentication backend. If you are running locally, ensure Netlify functions or your auth proxy is available, or perform server-side login from the admin page.'
      )
    }
    throw error
  }
}
