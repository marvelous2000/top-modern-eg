"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  // Do not show the main admin layout on the login page
  if (pathname?.startsWith("/admin/login")) {
    return <>{children}</>
  }

  return (
    <AuthGuard>
      <div className="min-h-screen w-full flex bg-background">
        {/* Desktop Sidebar */}
        <AdminSidebar className="hidden lg:flex" />

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out lg:hidden",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={cn(
            "fixed top-0 left-0 h-full z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <AdminNavigation onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
