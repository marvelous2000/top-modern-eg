"use server"

import { createSupabaseServiceClient } from "@/lib/supabase/service"
import { promises as fs } from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function executeSqlFile(supabase: any, filePath: string) {
  const sql = await fs.readFile(path.join(process.cwd(), filePath), "utf8")
  const { error } = await supabase.rpc('execute_sql', { sql_statement: sql });
  if (error) {
    // It's better to throw here to be caught by the calling function's try/catch
    throw new Error(`Error executing ${filePath}: ${error.message}`)
  }
}

export async function resetDatabase() {
  try {
    const supabase = createSupabaseServiceClient()

    // is only called from trusted server-side environments.
    
    await executeSqlFile(supabase, "scripts/000_create_execute_sql_function.sql")
    await executeSqlFile(supabase, "scripts/000_drop_all_tables.sql")
    await executeSqlFile(supabase, "scripts/001_create_products_table.sql")
    await executeSqlFile(supabase, "scripts/002_create_projects_table.sql")

    return { success: true, message: "Database reset successfully." }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function seedDatabase() {
  try {
    // Check authentication if needed, assuming only admins can run this.
    const supabase = createSupabaseServiceClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { stdout, stderr } = await execAsync("node scripts/seed-content.js")

    if (stderr) {
      // Don't treat all stderr as a failure, but log it.
      console.error("Stderr from seed script:", stderr)
    }

    return { success: true, message: `Database seeded successfully. Output: ${stdout}` }
  } catch (error: any) {
    return { success: false, error: `Failed to execute seed script: ${error.message}` }
  }
}