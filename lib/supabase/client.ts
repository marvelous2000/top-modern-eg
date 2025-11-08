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
