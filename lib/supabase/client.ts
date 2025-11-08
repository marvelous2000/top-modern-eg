import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time, environment variables might not be available
  // Return a mock client that will be replaced at runtime
  if (!url || !anonKey) {
    return createSupabaseBrowserClient("https://placeholder.supabase.co", "placeholder-key")
  }

  return createSupabaseBrowserClient(url, anonKey)
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
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}
