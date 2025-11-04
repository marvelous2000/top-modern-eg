"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { LogOut, User, Moon, Sun, BarChart3, MessageSquare, FolderOpen } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface AdminNavigationProps {
  onMenuClick?: () => void
}

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
}

export function AdminNavigation({ onMenuClick }: AdminNavigationProps) {
  const [userEmail, setUserEmail] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { theme, setTheme } = useTheme()
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

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
    <nav className="bg-card/95 backdrop-blur-sm border-b border-accent/30 p-4 shadow-lg admin-card">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/top-modern-logo-gold.png" alt="Top Modern Admin" className="h-8 w-auto" />
          <span className="font-serif text-xl font-bold text-card-foreground">Admin Panel</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin?page=dashboard')}
              className="text-muted-foreground hover:text-accent hover:bg-accent/10 admin-focus"
              title="Dashboard Overview"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin?page=contacts')}
              className="text-muted-foreground hover:text-accent hover:bg-accent/10 admin-focus"
              title="View Contacts"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin?page=projects')}
              className="text-muted-foreground hover:text-accent hover:bg-accent/10 admin-focus"
              title="Manage Projects"
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="border-accent/30 hover:bg-accent/10 hover:border-accent text-card-foreground admin-focus"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="flex items-center space-x-2 px-3 py-2 bg-secondary/50 rounded-md admin-card">
            <User className="h-4 w-4 text-accent" />
            <span className="text-sm text-secondary-foreground font-medium">{userEmail || "Loading..."}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={loading}
            className="border-accent/30 hover:bg-accent/10 hover:border-accent text-card-foreground admin-focus"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </nav>
  )
}
