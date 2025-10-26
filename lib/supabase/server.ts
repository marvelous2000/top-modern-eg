import { createServerClient, type CookieOptions } from "@supabase/ssr"

type CookieStore = {
  get: (name: string) => { value: string } | undefined
  set?: (options: { name: string; value: string } & Partial<CookieOptions>) => void
  delete?: (options: { name: string } & Partial<CookieOptions>) => void
}

export function createSupabaseServerClient(store?: CookieStore) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return store?.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        store?.set?.({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        store?.delete?.({ name, ...options })
      },
    },
  })
}
