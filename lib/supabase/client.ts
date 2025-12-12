import { createBrowserClient as createSupabaseClientFromSsr } from "@supabase/ssr"

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (typeof window === 'undefined' || !url || !anonKey) {
    // Return a mock client during SSR or if env vars are missing
    return createSupabaseClientFromSsr("https://placeholder.supabase.co", "placeholder-key")
  }

  return createSupabaseClientFromSsr(url, anonKey)
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
