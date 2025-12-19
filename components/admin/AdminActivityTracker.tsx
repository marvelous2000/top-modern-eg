"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes
const COOKIE_NAME = "tm_last_activity"

function setLastActivity() {
  try {
    const value = Date.now().toString()
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 7}` // 1 week
  } catch (err) {
    // no-op
  }
}

export default function AdminActivityTracker() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    // start with an initial timestamp
    setLastActivity()

    function scheduleLogout() {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(async () => {
        try {
          await supabase.auth.signOut()
        } catch (err) {
          // ignore
        } finally {
          document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
          router.push('/admin/login?expired=1')
        }
      }, TIMEOUT_MS)
    }

    function activityHandler() {
      setLastActivity()
      scheduleLogout()
    }

    // Events that mean the user is active
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "visibilitychange"]

    events.forEach((ev) => {
      window.addEventListener(ev, activityHandler)
    })

    // Also schedule on mount
    scheduleLogout()

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, activityHandler))
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
    // supabase and router are stable (singletons), no need to add them to deps
  }, [])

  return null
}
