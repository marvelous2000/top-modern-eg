"use server";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export interface DashboardMetrics {
  id: string;
  total_contacts: number;
  total_page_views: number;
  created_at: string;
  updated_at: string;
}

const METRICS_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // Must match the ID in the SQL migration

export async function getDashboardMetrics(): Promise<{ success: boolean; data?: DashboardMetrics; error?: string }> {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("dashboard_metrics")
      .select("*")
      .eq("id", METRICS_ID)
      .single();

    if (error) {
      console.error("[Dashboard Metrics] Error fetching dashboard metrics:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("[Dashboard Metrics] Exception in getDashboardMetrics:", error);
    return { success: false, error: error.message };
  }
}

export async function incrementPageViews(): Promise<{ success: boolean; error?: string }> {
  try {
    // If the service role or URL are missing, avoid attempting the RPC which
    // would throw. This can happen in local dev when env vars are not set.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('[Dashboard Metrics] Supabase service config missing, skipping incrementPageViews')
      return { success: false, error: 'missing_supabase_config' }
    }
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.rpc('increment_page_views_function');

    if (error) {
      // Helpful message for missing DB function or permission issues
      if ((error as any)?.code === 'PGRST202') {
        console.warn("[Dashboard Metrics] Supabase RPC error: missing function `increment_page_views_function`. Ensure DB migrations were run (see scripts/003_create_dashboard_metrics_table.sql).", error);
      } else {
        console.error("[Dashboard Metrics] Error incrementing page views:", error);
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("[Dashboard Metrics] Exception in incrementPageViews:", error);
    return { success: false, error: error.message };
  }
}

export async function incrementTotalContacts(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.rpc('increment_total_contacts_function');

    if (error) {
      console.error("[Dashboard Metrics] Error incrementing total contacts:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("[Dashboard Metrics] Exception in incrementTotalContacts:", error);
    return { success: false, error: error.message };
  }
}