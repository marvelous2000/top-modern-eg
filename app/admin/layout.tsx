"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/admin/auth-guard"
import { GoldenGridBackground } from "@/components/backgrounds/GoldenGridBackground"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginRoute = pathname?.startsWith("/admin/login")

  if (isLoginRoute) {
    return <>{children}</>
  }

  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-background overflow-hidden">
        <GoldenGridBackground className="opacity-100" />
        <div className="relative z-10">{children}</div>
      </div>
    </AuthGuard>
  )
}
