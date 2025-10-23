import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClientLayout } from "./ClientLayout"

export const metadata: Metadata = {
  title: "Top Modern - Luxury Marble & Granite Solutions",
  description:
    "Premium marble and granite solutions for luxury real estate, hotels, and restaurants across the MENA region.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
