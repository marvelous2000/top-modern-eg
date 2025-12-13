"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/admin/login")
          return
        }

        // Check if user has admin role
        const { data: userData, error } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", session.user.id)
          .single()

        if (error || !userData) {
          await supabase.auth.signOut()
          router.push("/admin/login")
          return
        }

        if (userData.status !== "active") {
          await supabase.auth.signOut()
          router.push("/admin/login")
          return
        }

        if (!["super_admin", "admin"].includes(userData.role)) {
          await supabase.auth.signOut()
          router.push("/admin/login")
          return
        }

        setAuthorized(true)
      } catch (error) {
        console.error("[v0] Auth check error:", error)
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/admin/login")
      }
    })

    return () => {
      try {
        subscription?.unsubscribe?.()
      } catch (err) {
        console.warn('Failed to unsubscribe from auth changes:', err)
      }
    }
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}
