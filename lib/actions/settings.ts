"use server"

import { createSupabaseServiceClient } from "@/lib/supabase/service"
import { revalidatePath } from "next/cache"

export interface Settings {
  id?: string
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  faviconUrl: string
  customCss: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
  googleAnalyticsId: string
  smtpHost: string
  smtpPort: string
  smtpUsername: string
  smtpPassword: string
  emailTemplates: string
  enable2FA: boolean
  sessionTimeout: string
  passwordPolicy: string
  enableRateLimiting: boolean
  allowedIPs: string
  created_at?: string
  updated_at?: string
}

export async function getSettings() {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from("settings").select("*").maybeSingle()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching settings:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data: data || {} }
  } catch (error: any) {
    console.error("[v0] Exception in getSettings:", error)
    return { success: false, error: error.message, data: null }
  }
}

export async function updateSettings(settings: Partial<Settings>) {
  try {
    const supabase = createSupabaseServiceClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { data, error } = await supabase
      .from("settings")
      .upsert({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating settings:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Exception in updateSettings:", error)
    return { success: false, error: error.message }
  }
}
