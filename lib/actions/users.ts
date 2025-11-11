"use server"

import { createSupabaseServiceClient } from "@/lib/supabase/service"
import { revalidatePath } from "next/cache"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "moderator" | "user"
  status: "active" | "inactive" | "suspended"
  avatar: string
  bio: string
  phone: string
  location: string
  website: string
  socialLinks: Record<string, string>
  preferences: Record<string, any>
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export async function getUsers() {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching users:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("[v0] Exception in getUsers:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getUserById(id: string) {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle()

    if (error) {
      console.error("[v0] Error fetching user by id:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data: data || null }
  } catch (error: any) {
    console.error("[v0] Exception in getUserById:", error)
    return { success: false, error: error.message, data: null }
  }
}

export async function createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">) {
  try {
    const supabase = createSupabaseServiceClient()

    // Check authentication
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) {
      return { success: false, error: "Unauthorized" }
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...user,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating user:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Exception in createUser:", error)
    return { success: false, error: error.message }
  }
}

export async function updateUser(id: string, user: Partial<User>) {
  try {
    const supabase = createSupabaseServiceClient()

    // Check authentication
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) {
      return { success: false, error: "Unauthorized" }
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        ...user,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating user:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Exception in updateUser:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteUser(id: string) {
  try {
    const supabase = createSupabaseServiceClient()

    // Check authentication
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) {
      return { success: false, error: "Unauthorized" }
    }

    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting user:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Exception in deleteUser:", error)
    return { success: false, error: error.message }
  }
}
