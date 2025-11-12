"use server"

import { createSupabaseServiceClient } from "@/lib/supabase/service"
import { revalidatePath } from "next/cache"

export interface TrackingPixel {
  id: string
  name: string
  type: "facebook" | "google_analytics" | "google_ads" | "linkedin" | "twitter" | "tiktok" | "custom"
  pixel_id: string
  code: string
  status: "active" | "inactive"
  pages: string[]
  events: string[]
  created_at: string
  updated_at: string
  created_by?: string
}

export async function getTrackingPixels() {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from("tracking_pixels").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching tracking pixels:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("[v0] Exception in getTrackingPixels:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getActiveTrackingPixels() {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase
      .from("tracking_pixels")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching active tracking pixels:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("[v0] Exception in getActiveTrackingPixels:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function createTrackingPixel(pixel: Omit<TrackingPixel, "id" | "created_at" | "updated_at">) {
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
      .from("tracking_pixels")
      .insert([
        {
          ...pixel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating tracking pixel:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Exception in createTrackingPixel:", error)
    return { success: false, error: error.message }
  }
}

export async function updateTrackingPixel(id: string, pixel: Partial<TrackingPixel>) {
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
      .from("tracking_pixels")
      .update({
        ...pixel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating tracking pixel:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Exception in updateTrackingPixel:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteTrackingPixel(id: string) {
  try {
    const supabase = createSupabaseServiceClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { error } = await supabase.from("tracking_pixels").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting tracking pixel:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Exception in deleteTrackingPixel:", error)
    return { success: false, error: error.message }
  }
}
