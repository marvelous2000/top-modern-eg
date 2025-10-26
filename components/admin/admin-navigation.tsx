"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export function AdminNavigation() {
  const [userEmail, setUserEmail] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "Admin User")
      }
    }
    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      alert("Failed to logout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/top-modern-logo-gold.png" alt="Top Modern Admin" className="h-8 w-auto" />
          <span className="font-serif text-xl font-bold text-foreground">Admin Panel</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{userEmail || "Loading..."}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
            <LogOut className="h-4 w-4 mr-2" />
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </nav>
  )
}
