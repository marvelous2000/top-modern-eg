const { createClient } = require("@supabase/supabase-js")

exports.handler = async (event, context) => {
  const TIMEOUT_MS = 30000
  const timeoutHandle = setTimeout(() => {
    console.error("❌ Superadmin function timed out")
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Function timed out" })
    }
  }, TIMEOUT_MS)

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      clearTimeout(timeoutHandle)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing environment variables" })
      }
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const email = "admin@topmodern.com"
    const password = "Admin123!"
    const role = "super_admin"

    // Check if superadmin already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("email", email)
      .eq("role", role)
      .single()

    if (existingUser) {
      clearTimeout(timeoutHandle)
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Super admin already exists" })
      }
    }

    // Create user
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) {
      if (createError.message?.toLowerCase().includes("already been registered")) {
        // User exists, update password
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          created?.user?.id || existingUser.id,
          { password, email_confirm: true }
        )
        if (updateError) throw updateError
      } else {
        throw createError
      }
    }

    const userId = created?.user?.id || existingUser.id

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

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(profilePayload, { onConflict: "id" })

    if (upsertError) {
      throw upsertError
    }

    clearTimeout(timeoutHandle)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Super admin created successfully",
        email,
        password
      })
    }

  } catch (error) {
    clearTimeout(timeoutHandle)
    console.error("Create superadmin error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
