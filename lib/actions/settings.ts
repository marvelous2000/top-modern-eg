"use server"

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from "next/cache"

export interface SiteSettings {
  logo: {
    main: string
    footer: string
    admin: string
    background: string
  }
  contact: {
    phone1: string
    phone2: string
    email1: string
    email2: string
    whatsapp: string
  }
  social: {
    facebook: string
    instagram: string
    linkedin: string
  }
  company: {
    name: string
    description: string
    address: string
  }
}

// Helper to flatten nested settings for database storage
function flattenSettings(settings: Partial<SiteSettings>): Record<string, string> {
  const flattened: Record<string, string> = {}
  if (settings.logo) Object.entries(settings.logo).forEach(([key, value]) => { flattened[`logo.${key}`] = value || "" });
  if (settings.contact) Object.entries(settings.contact).forEach(([key, value]) => { flattened[`contact.${key}`] = value || "" });
  if (settings.social) Object.entries(settings.social).forEach(([key, value]) => { flattened[`social.${key}`] = value || "" });
  if (settings.company) Object.entries(settings.company).forEach(([key, value]) => { flattened[`company.${key}`] = value || "" });
  return flattened
}

// Helper to unflatten database records to nested settings
function unflattenSettings(records: Array<{key: string, value: string}>): SiteSettings {
  const settings: SiteSettings = {
    logo: { main: "", footer: "", admin: "", background: "" },
    contact: { phone1: "", phone2: "", email1: "", email2: "", whatsapp: "" },
    social: { facebook: "", instagram: "", linkedin: "" },
    company: { name: "", description: "", address: "" }
  }
  records.forEach(({ key, value }) => {
    const parts = key.split('.')
    if (parts.length === 2) {
      const [section, field] = parts as [keyof SiteSettings, string]
      if (section in settings && field in (settings[section] as any)) {
        ;(settings[section] as any)[field] = value || ""
      }
    }
  })
  return settings
}

export async function getSettings() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
        },
      }
    )

    const { data, error } = await supabase.from("site_settings").select("key, value").order("key")
    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return { success: true, data: {
        logo: { main: "", footer: "", admin: "", background: "" },
        contact: { phone1: "", phone2: "", email1: "", email2: "", whatsapp: "" },
        social: { facebook: "", instagram: "", linkedin: "" },
        company: { name: "", description: "", address: "" }
      }}
    }
    
    return { success: true, data: unflattenSettings(data) }
  } catch (error: any) {
    return { success: false, error: error.message, data: null }
  }
}

export async function updateSettings(settings: Partial<SiteSettings>) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const flattenedSettings = flattenSettings(settings)
    const upsertPromises = Object.entries(flattenedSettings).map(([key, value]) =>
      supabase.from("site_settings").upsert({
        key,
        value: value || "",
        updated_at: new Date().toISOString(),
        updated_by: user.id
      }, { onConflict: 'key' })
    );

    const results = await Promise.all(upsertPromises);
    const firstError = results.find(res => res.error);

    if (firstError?.error) {
      console.error("Error updating settings:", firstError.error);
      if (firstError.error.message.includes("violates row-level security policy")) {
        return { success: false, error: "Permission Denied: You do not have the required role to modify settings." };
      }
      return { success: false, error: firstError.error.message };
    }

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");

    return { success: true, data: settings }
  } catch (error: any) {
    console.error("Exception in updateSettings:", error)
    return { success: false, error: error.message }
  }
}