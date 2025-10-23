"use client"

import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function AdminNavigation() {
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
            <span className="text-sm text-muted-foreground">Admin User</span>
          </div>
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

