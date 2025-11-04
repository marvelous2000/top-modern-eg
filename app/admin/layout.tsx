"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/admin/auth-guard"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginRoute = pathname?.startsWith("/admin/login")

  if (isLoginRoute) {
    return <>{children}</>
  }

  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-primary/20">
        {/* Marble texture overlay */}
        <div className="absolute inset-0 marble-texture"></div>

        {/* Removed subtle gold accent gradients and additional luxury overlay for better contrast */}

        <div className="relative z-10">{children}</div>
      </div>
    </AuthGuard>
  )
}
