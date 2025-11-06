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
      <div className="relative min-h-screen bg-background admin-panel">
        {/* Marble texture overlay with controlled opacity */}
        <div className="absolute inset-0 marble-texture opacity-30"></div>

        <div className="relative z-10">{children}</div>
      </div>
    </AuthGuard>
  )
}
