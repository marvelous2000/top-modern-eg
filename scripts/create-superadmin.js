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

try {
  require("dotenv").config({ path: ".env.local" })
} catch (err) {
  // dotenv not available locally — assume environment variables are present in shell
}

const { createClient } = require("@supabase/supabase-js")

// Set timeout to prevent hanging
const TIMEOUT_MS = 30000 // 30 seconds
const timeoutHandle = setTimeout(() => {
  console.error("❌ Superadmin script timed out after 30 seconds")
  process.exit(1)
}, TIMEOUT_MS)

const email = process.argv[2] ?? 'admin@topmodern.com'
    const password = process.argv[3]
    const role = process.argv[4] ?? 'super_admin'

    // 1. FIRST, check if a user with this email exists in Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) throw listError

    const existingAuthUser = users.find(u => u.email === email)
    let userId = existingAuthUser?.id

    // 2. Determine if we need to create the auth user or just the profile
    if (!existingAuthUser) {
        // Create the auth user (new user)
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        })
        if (createError) throw createError
        userId = newUser.user.id
        console.log('✅ Auth user created')
    } else {
        console.log('ℹ️ Auth user already exists')
    }

    // 3. NOW, check the public 'profiles' table for this user
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

    if (existingProfile && existingProfile.role === role) {
        console.log('✅ Super admin already fully set up')
        return
    }

    // 4. Upsert the profile
    const timestamp = new Date().toISOString()
    const profilePayload = {
        id: userId,
        username: email,
        email,
        first_name: email.split('@')[0],
        role,
        status: 'active',
        created_at: timestamp,
        updated_at: timestamp,
    }

    const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' })

    if (upsertError) throw upsertError
    console.log('✅ Profile upserted')

    console.log({
        message: existingAuthUser ? 'Super admin profile updated' : 'Super admin created successfully',
        email,
        userId
    })

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
