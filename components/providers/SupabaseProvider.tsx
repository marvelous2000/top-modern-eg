"use client"

import { createContext, useContext, useMemo } from "react"
import type { ReactNode } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/lib/supabase"

type SupabaseContextValue = SupabaseClient | null

const SupabaseContext = createContext<SupabaseContextValue>(null)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient()
    } catch (error) {
      console.warn("Supabase client unavailable. Did you set NEXT_PUBLIC_SUPABASE_* env vars?", error)
      return null
    }
  }, [])

  if (!supabase) {
    return <>{children}</>
  }

  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
}

export function useSupabaseClient(options?: { optional?: boolean }) {
  const supabase = useContext(SupabaseContext)

  if (!supabase) {
    if (options?.optional) {
      return null
    }
    throw new Error("Supabase client is not available. Ensure environment variables are configured.")
  }

  return supabase
}
