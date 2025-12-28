/**
 * Create or update a Supabase admin user directly from the command line.
 *
 * This script connects to your Supabase instance and creates a new user in the
 * `auth.users` table, and then creates or updates a corresponding profile in the
 * `public.profiles` table to grant administrative privileges.
 *
 * It is idempotent: if the user already exists, it will ensure their profile
 * has the correct role.
 *
 * Usage:
 *   node scripts/create-superadmin.js <email> <password> [role]
 *
 * Example:
 *   node scripts/create-superadmin.js admin@example.com "YourSecurePassword123!" super_admin
 *
 * Arguments:
 *   - email: The email for the user.
 *   - password: The password for the user.
 *   - role: (Optional) The role to assign. Defaults to 'super_admin'.
 *
 * Requirements:
 *   - A `.env.local` file in the project root must contain:
 *     - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL.
 *     - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key (keep this secret).
 *   - The `profiles` table must exist in your public schema.
 */

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@supabase/supabase-js");

// --- Configuration ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- Main Script Logic ---
async function createSuperAdmin() {
  // 1. Validate environment variables and arguments
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      "❌ Error: Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file."
    );
    process.exit(1);
  }

  const email = process.argv[2];
  const password = process.argv[3];
  const role = process.argv[4] || "super_admin"; // Default role

  if (!email || !password) {
    console.error(
      "❌ Error: Please provide an email and password.\n" +
        "Usage: node scripts/create-superadmin.js <email> <password> [role]"
    );
    process.exit(1);
  }

  if (password.length < 8) {
      console.warn("⚠️ Warning: The provided password is short. It's recommended to use a longer, more secure password in production.");
  }


  // 2. Initialize Supabase client with admin privileges
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Connecting to Supabase at ${SUPABASE_URL}...`);
  console.log(`Attempting to create/update user: ${email} with role: ${role}`);

  // 3. Check if the user already exists in Supabase Auth
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("❌ Error listing users:", listError.message);
    process.exit(1);
  }

  const existingAuthUser = users.find(u => u.email === email);
  let userId;
  let userJustCreated = false;

  if (existingAuthUser) {
    userId = existingAuthUser.id;
    console.log(`ℹ️ Auth user ${email} already exists with ID: ${userId}.`);
  } else {
    // 4. If user doesn't exist, create them in Supabase Auth
    console.log("Creating new user in Supabase Auth...");
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
    });

    if (createError) {
      console.error("❌ Error creating auth user:", createError.message);
      process.exit(1);
    }
    userId = newUser.user.id;
    userJustCreated = true;
    console.log(`✅ New auth user created successfully with ID: ${userId}.`);
  }

  // 5. Create or Update the user's profile in the `profiles` table
  console.log(`Checking for existing profile with email: ${email}...`);
  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error("❌ Error checking existing profile:", selectError.message);
    process.exit(1);
  }

  const profileData = {
    id: userId, // Link to the auth.users table
    email: email,
    role: role,
    username: email, // Use email as username to ensure uniqueness
    status: 'active',
  };

  if (existingProfile) {
    // If profile exists with same email but different ID, delete it first
    if (existingProfile.id !== userId) {
      console.log(`Deleting existing profile with different ID: ${existingProfile.id}...`);
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("email", email);
      if (deleteError) {
        console.error("❌ Error deleting existing profile:", deleteError.message);
        process.exit(1);
      }
    }
  }

  console.log("Inserting profile...");
  const { error: insertError } = await supabase
    .from("profiles")
    .insert(profileData);

  if (insertError) {
    console.error("❌ Error inserting profile:", insertError.message);
    console.error(
        "   Possible reasons:\n" +
        "   - The 'profiles' table does not exist.\n" +
        "   - The service role key lacks permission.\n" +
        "   - The columns in `profileData` do not match your table schema."
    )
    process.exit(1);
  }

  console.log("✅ Profile inserted successfully.");

  // 6. Final success message
  console.log(
    `\n🎉 Success! User ${email} is now configured as a '${role}'.`
  );
  if (userJustCreated) {
    console.log("   You can now log in with the password you provided.");
  } else {
    console.log("   The user's role has been updated. They can log in with their existing password.");
  }
}

// --- Execution ---
const timeoutHandle = setTimeout(() => {
  console.error("❌ Script timed out after 30 seconds. Check your network connection and Supabase URL.");
  process.exit(1);
}, 30000);

createSuperAdmin()
  .catch((error) => {
    console.error("\n❌ An unexpected error occurred:", error.message);
    process.exit(1);
  })
  .finally(() => {
    clearTimeout(timeoutHandle);
  });