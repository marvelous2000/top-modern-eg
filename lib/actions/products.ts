"use server"

import { cookies } from "next/headers"
import { createSupabaseServiceClient } from "@/lib/supabase/service"
import { revalidatePath } from "next/cache"

export interface Product {
  id: string
  name: string
  name_ar?: string
  category: "marble" | "granite"
  slug: string
  description: string
  description_ar?: string
  origin: string
  origin_ar?: string
  finish: string
  finish_ar?: string
  thickness: string
  applications: string[]
  applications_ar?: string[]
  images: string[]
  specifications: Record<string, string>
  specifications_ar?: Record<string, string>
  status: "active" | "draft" | "archived"
  created_at: string
  updated_at: string
}

export async function getProducts() {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching products:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("[v0] Exception in getProducts:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getActiveProducts() {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching active products:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("[v0] Exception in getActiveProducts:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle()

    if (error) {
      console.error("[v0] Error fetching product by slug:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data: data || null }
  } catch (error: any) {
    console.error("[v0] Exception in getProductBySlug:", error)
    return { success: false, error: error.message, data: null }
  }
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
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
      .from("products")
      .insert([
        {
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating product:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Exception in createProduct:", error)
    return { success: false, error: error.message }
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
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
      .from("products")
      .update({
        ...product,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating product:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Exception in updateProduct:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = createSupabaseServiceClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting product:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Exception in deleteProduct:", error)
    return { success: false, error: error.message }
  }
}
