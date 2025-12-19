import { createClient } from "@supabase/supabase-js"

export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    // Return a mock client that throws network errors for all operations
    // This prevents the app from crashing when env vars are missing
    return {
      from: () => ({
        select: () => Promise.reject(new Error("Network error: Supabase configuration missing")),
        insert: () => Promise.reject(new Error("Network error: Supabase configuration missing")),
        update: () => Promise.reject(new Error("Network error: Supabase configuration missing")),
        delete: () => Promise.reject(new Error("Network error: Supabase configuration missing")),
        eq: () => ({
          select: () => Promise.reject(new Error("Network error: Supabase configuration missing")),
          update: () => Promise.reject(new Error("Network error: Supabase configuration missing")),
          delete: () => Promise.reject(new Error("Network error: Supabase configuration missing")),
        }),
        maybeSingle: () => Promise.reject(new Error("Network error: Supabase configuration missing")),
      }),
      auth: {
        getUser: () => Promise.reject(new Error("Network error: Supabase configuration missing")),
      },
    } as any
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
