"use client"

import type React from "react"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SupabaseProvider } from "@/components/providers/SupabaseProvider"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${playfairDisplay.variable} ${inter.variable}`}>
        <SupabaseProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  )
}
