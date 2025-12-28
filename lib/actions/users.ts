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
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching users:", error)
      return { success: false, error: error.message, data: [] }
    }

    const transformedData = (data || []).map((profile: any) => ({
      id: profile.id,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username || profile.email,
      email: profile.email,
      role: profile.role,
      status: profile.status,
      avatar: profile.avatar || '',
      bio: profile.bio || '',
      phone: profile.phone || '',
      location: profile.location || '',
      website: profile.website || '',
      socialLinks: profile.social_links || {},
      preferences: profile.preferences || {},
      lastLogin: profile.last_active,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    }))

    return { success: true, data: transformedData }
  } catch (error: any) {
    console.error("[v0] Exception in getUsers:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getUserById(id: string) {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle()

    if (error) {
      console.error("[v0] Error fetching user by id:", error)
      return { success: false, error: error.message, data: null }
    }

    if (!data) return { success: true, data: null }

    const transformedData = {
      id: data.id,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username || data.email,
      email: data.email,
      role: data.role,
      status: data.status,
      avatar: data.avatar || '',
      bio: data.bio || '',
      phone: data.phone || '',
      location: data.location || '',
      website: data.website || '',
      socialLinks: data.social_links || {},
      preferences: data.preferences || {},
      lastLogin: data.last_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return { success: true, data: transformedData }
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

    // Transform user data to match database schema
    const nameParts = user.name.split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || null

    const dbUser = {
      username: user.email, // Use email as username
      email: user.email,
      first_name: firstName,
      last_name: lastName,
      role: user.role,
      status: user.status,
      avatar: user.avatar || null,
      bio: user.bio || null,
      phone: user.phone || null,
      location: user.location || null,
      website: user.website || null,
      social_links: user.socialLinks || {},
      preferences: user.preferences || {},
      last_active: user.lastLogin,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert([dbUser])
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

    // Transform user data to match database schema
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (user.name !== undefined) {
      const nameParts = user.name.split(' ')
      updateData.first_name = nameParts[0] || ''
      updateData.last_name = nameParts.slice(1).join(' ') || null
    }

    if (user.email !== undefined) updateData.email = user.email
    if (user.role !== undefined) updateData.role = user.role
    if (user.status !== undefined) updateData.status = user.status
    if (user.avatar !== undefined) updateData.avatar = user.avatar || null
    if (user.bio !== undefined) updateData.bio = user.bio || null
    if (user.phone !== undefined) updateData.phone = user.phone || null
    if (user.location !== undefined) updateData.location = user.location || null
    if (user.website !== undefined) updateData.website = user.website || null
    if (user.socialLinks !== undefined) updateData.social_links = user.socialLinks || {}
    if (user.preferences !== undefined) updateData.preferences = user.preferences || {}
    if (user.lastLogin !== undefined) updateData.last_active = user.lastLogin

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
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

    const { error } = await supabase.from("profiles").delete().eq("id", id)

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
