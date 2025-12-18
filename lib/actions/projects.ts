"use server"

import { cookies } from "next/headers"
import { createSupabaseServiceClient } from "@/lib/supabase/service"
import { revalidatePath } from "next/cache"

export interface Project {
  id: string
  title: string
  title_ar?: string
  category: string
  category_ar?: string
  location: string
  location_ar?: string
  year: string
  client: string
  client_ar?: string
  slug: string
  description: string
  description_ar?: string
  challenge: string
  challenge_ar?: string
  solution: string
  solution_ar?: string
  results: string[]
  results_ar?: string[]
  materials: string[]
  materials_ar?: string[]
  images: string[]
  testimonial?: {
    quote?: string
    author?: string
    position?: string
  }
  testimonial_ar?: {
    quote?: string
    author?: string
    position?: string
  }
  status: "active" | "draft" | "archived"
  featured: boolean
  created_at: string
  updated_at: string
}

export async function getProjects() {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("[v0] Exception in getProjects:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getActiveProjects() {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching active projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("[v0] Exception in getActiveProjects:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle()

    if (error) {
      console.error("[v0] Error fetching project by slug:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data: data || null }
  } catch (error: any) {
    console.error("[v0] Exception in getProjectBySlug:", error)
    return { success: false, error: error.message, data: null }
  }
}

export async function getFeaturedProjects() {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .eq("status", "active") // Only fetch active featured projects
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching featured projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("[v0] Exception in getFeaturedProjects:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function createProject(project: Omit<Project, "id" | "created_at" | "updated_at">) {
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
      .from("projects")
      .insert([
        {
          ...project,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Exception in createProject:", error)
    return { success: false, error: error.message }
  }
}

export async function updateProject(id: string, project: Partial<Project>) {
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
      .from("projects")
      .update({
        ...project,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Exception in updateProject:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = createSupabaseServiceClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Exception in deleteProject:", error)
    return { success: false, error: error.message }
  }
}
