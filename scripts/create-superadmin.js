/**
 * Create or update a Supabase admin user directly from the command line.
 *
 * Usage:
 *   node scripts/create-superadmin.js admin@topmodern.com "StrongPassword123!" super_admin
 *
 * Requirements:
 *   - .env.local (or your shell) must expose NEXT_PUBLIC_SUPABASE_URL
 *     and SUPABASE_SERVICE_ROLE_KEY.
 *   - The `profiles` table must exist and accept the fields used below.
 *   - Never commit the service role key. Keep it secret.
 */

require("dotenv").config({ path: ".env.local" })

const { createClient } = require("@supabase/supabase-js")

// Set timeout to prevent hanging
const TIMEOUT_MS = 30000 // 30 seconds
const timeoutHandle = setTimeout(() => {
  console.error("❌ Superadmin script timed out after 30 seconds")
  process.exit(1)
}, TIMEOUT_MS)

const email = process.argv[2] ?? "admin@topmodern.com"
const password = process.argv[3]
const role = process.argv[4] ?? "super_admin"

async function main() {
  if (!password) {
    console.error(
      "Missing password argument.\nRun: node scripts/create-superadmin.js admin@example.com \"SuperSecure123!\" super_admin",
    )
    clearTimeout(timeoutHandle)
    process.exit(1)
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log("🔍 Validating superadmin script environment variables...")
  if (!url) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not set")
    clearTimeout(timeoutHandle)
    process.exit(1)
  }

  if (!serviceKey) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set")
    clearTimeout(timeoutHandle)
    process.exit(1)
  }

  console.log("✅ Superadmin script environment variables validated")

  const supabase = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    let userId

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) {
      if (createError.message?.toLowerCase().includes("already been registered")) {
        const lowerEmail = email.toLowerCase()
        const perPage = 100
        let page = 1
        let foundUser = null
        let listError = null

        while (!foundUser) {
          const { data: listed, error: pageError } = await supabase.auth.admin.listUsers({
            page,
            perPage,
          })

          if (pageError) {
            listError = pageError
            break
          }

          foundUser =
            listed?.users?.find((user) => user.email?.toLowerCase() === lowerEmail) ?? null

          if (foundUser || !listed?.nextPage) {
            break
          }

          page = listed.nextPage
        }

        if (listError) {
          throw listError
        }

        if (!foundUser) {
          throw createError
        }

        userId = foundUser.id

        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
          password,
          email_confirm: true,
        })

        if (updateError) {
          throw updateError
        }
      } else {
        throw createError
      }
    } else {
      userId = created?.user?.id
    }

    if (!userId) {
      throw new Error("Unable to resolve user id.")
    }

    const timestamp = new Date().toISOString()
    const profilePayload = {
      id: userId,
      username: email,
      email,
      first_name: email.split("@")[0],
      role,
      status: "active",
      created_at: timestamp,
      updated_at: timestamp,
    }

    const { error: upsertError } = await supabase.from("profiles").upsert(
      {
        ...profilePayload,
      },
      { onConflict: "id" },
    )

    if (upsertError) {
      throw upsertError
    }

    const { data: verifyRow, error: verifyError } = await supabase
      .from("profiles")
      .select("id, role, status, updated_at")
      .eq("id", userId)
      .single()

    if (verifyError) {
      throw verifyError
    }

    console.log(
      `Super admin created/updated:\n  email: ${email}\n  role: ${role}\n  user id: ${userId}\n  status: ${
        verifyRow?.status
      }\n  updated: ${verifyRow?.updated_at}`,
    )
  } catch (err) {
    console.error("Failed to create super admin:", err.message ?? err)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("❌ Superadmin script failed:", error.message)
  clearTimeout(timeoutHandle)
  process.exit(1)
}).finally(() => {
  clearTimeout(timeoutHandle)
})
