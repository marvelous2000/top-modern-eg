// lib/settings.ts - Server-side settings utilities
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Helper to unflatten database records to nested settings
function unflattenSettings(records: Array<{key: string, value: string}>): any {
  const settings: any = {
    logo: { main: "", footer: "", admin: "", background: "" },
    contact: { phone1: "", phone2: "", email1: "", email2: "", whatsapp: "" },
    social: { facebook: "", instagram: "", linkedin: "" },
    company: { name: "", description: "", address: "" }
  }

  records.forEach(({ key, value }) => {
    const parts = key.split('.')
    if (parts.length === 2) {
      const [section, field] = parts as [keyof any, string]

      // Type-safe assignment
      if (section in settings && field in (settings[section] as any)) {
        ;(settings[section] as any)[field] = value || ""
      }
    }
  })

  return settings
}

export async function getPublicSettings() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .order("key")

    if (error) {
      console.error("Error fetching public settings:", error)
      return null
    }

    // If no settings exist, return defaults
    if (!data || data.length === 0) {
      return {
        logo: { main: "", footer: "", admin: "", background: "" },
        contact: { phone1: "", phone2: "", email1: "", email2: "", whatsapp: "" },
        social: { facebook: "", instagram: "", linkedin: "" },
        company: { name: "", description: "", address: "" }
      }
    }

    // Transform flat key-value pairs into structured object
    return unflattenSettings(data)
  } catch (error) {
    console.error("Exception in getPublicSettings:", error)
    return null
  }
}