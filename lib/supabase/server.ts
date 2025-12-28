import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

export const runtime = "nodejs"

export async function createSupabaseServerClient() {
  const cookieStore = cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // Fail fast with a clear message when server-side code tries to create
    // a Supabase client but the required env vars are not set. This gives
    // a better developer experience than the generic error from the
    // Supabase client library.
    // Helpful hint: if someone placed their envs under `scripts/.env.local`
    // (used by the seed script) the Next process will not pick them up. Check
    // for that common mistake and provide a clear actionable hint.
    const scriptsEnv = path.join(process.cwd(), 'scripts', '.env.local')
    if (fs.existsSync(scriptsEnv)) {
      console.error(
        'Missing Supabase env variables in process.env. I found a `scripts/.env.local` file - copy its contents to a project root `.env.local` so Next can load them.'
      )
    }

    throw new Error(
      'Missing Supabase env variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required on the server. Please add them to your environment (e.g., .env.local at the project root).'
    )
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          console.error('Error setting cookie:', error)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          console.error('Error removing cookie:', error)
        }
      },
    },
  })
}

export default createSupabaseServerClient