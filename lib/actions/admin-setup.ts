// lib/actions/admin-setup.ts
'use server';

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

// Helper to create Supabase client with service role for server actions
const createServiceRoleSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase environment variables for service role client");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Helper to create direct PostgreSQL client for schema setup
const createPgClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase environment variables for PostgreSQL client");
  }

  // Extract database connection details from Supabase URL
  const url = new URL(supabaseUrl);
  const host = url.hostname;
  const port = 5432; // Default PostgreSQL port
  const database = url.pathname.slice(1); // Remove leading slash

  return new Client({
    host,
    port,
    database,
    user: 'postgres', // Supabase uses 'postgres' as the user
    password: serviceKey,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
  });
};

export async function setupDatabaseSchema() {
  let client: Client | null = null;
  try {
    // Use direct PostgreSQL client for schema setup
    client = createPgClient();
    await client.connect();

    // Read the schema SQL file
    const schemaPath = join(process.cwd(), 'scripts', 'supabase-schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf8');

    // Execute the schema SQL directly
    await client.query(schemaSql);

    return { success: true, message: "Database schema set up successfully" };
  } catch (error: any) {
    console.error("setupDatabaseSchema Server Action error:", error);
    return { success: false, message: `Failed to set up database schema: ${error.message}` };
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export async function createSuperAdmin() {
  try {
    const supabase = createServiceRoleSupabaseClient();

    const adminEmail = process.env.SUPERADMIN_EMAIL || "admin@topmodern.com";
    const adminPassword = process.env.SUPERADMIN_PASSWORD || "Admin123!"; // IMPORTANT: In a real app, do not hardcode default passwords. Use environment variables and proper secrets management.

    // Check if an admin user already exists
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("Error listing users:", usersError);
      return { success: false, message: `Failed to list users: ${usersError.message}` };
    }

    const existingAdmin = usersData.users.find(user => user.email === adminEmail);

    if (existingAdmin) {
      // If admin user already exists, check/update profile role in 'profiles' table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', adminEmail)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Error fetching admin profile:", profileError);
        return { success: false, message: `Failed to check admin profile: ${profileError.message}` };
      }

      if (profile && profile.role !== 'admin') {
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', profile.id);

        if (updateProfileError) {
          console.error("Error updating existing admin profile role:", updateProfileError);
          return { success: false, message: `Failed to update existing admin role: ${updateProfileError.message}` };
        }
        return { success: true, message: `Admin user '${adminEmail}' already exists and profile role updated to admin.` };
      } else if (profile) {
        return { success: true, message: `Admin user '${adminEmail}' already exists with correct role.` };
      }
      return { success: true, message: `Admin user '${adminEmail}' already exists.` };
    }

    // Create the admin user
    const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: "Super",
        last_name: "Admin",
        role: "admin",
      },
    });

    if (createUserError) {
      console.error("Error creating superadmin user:", createUserError);
      return { success: false, message: `Failed to create superadmin user: ${createUserError.message}` };
    }

    // Insert into the public.profiles table
    const { error: insertProfileError } = await supabase
      .from('profiles')
      .insert({
        id: newUser.user.id,
        username: "superadmin",
        email: adminEmail,
        first_name: "Super",
        last_name: "Admin",
        role: "admin",
        status: "active",
      });

    if (insertProfileError) {
      console.error("Error inserting into profiles table:", insertProfileError);
      await supabase.auth.admin.deleteUser(newUser.user.id); // Rollback user creation
      return { success: false, message: `Failed to create admin profile: ${insertProfileError.message}` };
    }

    return { success: true, message: `Super admin user '${adminEmail}' created successfully.` };
  } catch (error: any) {
    console.error("createSuperAdmin Server Action general error:", error);
    return { success: false, message: error.message || "An unknown error occurred during superadmin creation" };
  }
}

export async function seedInitialContent() {
  try {
    const supabase = createServiceRoleSupabaseClient();
    const now = new Date().toISOString();

    const productSeeds = [
      {
        slug: "carrara-white-marble",
        name: "Carrara White Marble",
        category: "marble",
        description: "Premium Italian Carrara marble with distinctive grey veining, perfect for luxury flooring and wall applications.",
        origin: "Carrara, Italy",
        finish: "Polished",
        thickness: "20mm, 30mm",
        applications: ["Flooring", "Wall Cladding", "Countertops", "Bathroom Surfaces"],
        images: ["/luxurious-white-carrara-marble-with-grey-veining-c.jpg", "/carrara-marble-flooring-in-luxury-hotel-lobby.jpg", "/carrara-marble-bathroom-with-elegant-vanity.jpg", "/carrara-marble-kitchen-countertop-with-gold-fixtur.jpg"],
        specifications: { Density: "2.7 g/cm³", "Water Absorption": "< 0.5%", "Compressive Strength": "120 MPa", "Flexural Strength": "15 MPa", "Featured Projects": "Four Seasons Hotel Cairo, Luxury Residential Tower - New Capital, Premium Restaurant Chain - Alexandria" },
        status: "active",
      },
      {
        slug: "nero-marquina-marble",
        name: "Nero Marquina Marble",
        category: "marble",
        description: "Sophisticated black marble with striking white veining, ideal for dramatic accent walls and luxury surfaces.",
        origin: "Markina, Spain",
        finish: "Polished",
        thickness: "20mm, 30mm",
        applications: ["Feature Walls", "Bathroom Surfaces", "Decorative Elements", "Reception Areas"],
        images: ["/elegant-black-nero-marquina-marble-with-white-vein.jpg", "/luxury-hotel-lobby-marble-installation-four-season.jpg", "/luxurious-white-carrara-marble-with-grey-veining.jpg"],
        specifications: { Density: "2.7 g/cm³", "Water Absorption": "< 0.4%", "Compressive Strength": "110 MPa", "Flexural Strength": "12 MPa", "Featured Projects": "Luxury Boutique Hotel - Zamalek, High-end Restaurant - Maadi, Executive Office Building - Downtown" },
        status: "active",
      },
      {
        slug: "black-galaxy-granite",
        name: "Black Galaxy Granite",
        category: "granite",
        description: "Stunning black granite with golden speckles, prized for countertops, flooring, and statement surfaces in luxury spaces.",
        origin: "Andhra Pradesh, India",
        finish: "Polished",
        thickness: "20mm, 30mm",
        applications: ["Countertops", "Flooring", "Wall Cladding", "Reception Desks"],
        images: ["/black-galaxy-granite-golden-speckles-luxury.jpg", "/premium-absolute-black-granite-with-mirror-finish.jpg", "/luxury-marble-workshop-with-craftsmen-working-on-p.jpg"],
        specifications: { Density: "2.9 g/cm³", "Water Absorption": "< 0.2%", "Compressive Strength": "200 MPa", "Flexural Strength": "18 MPa", "Featured Projects": "Prestige Office Tower - New Cairo, Luxury Villa Collection - Palm Hills" },
        status: "active",
      },
    ];

    const projectSeeds = [
      {
        slug: "four-seasons-cairo",
        title: "Four Seasons Hotel Cairo",
        category: "Luxury Hotel",
        location: "Cairo, Egypt",
        year: "2023",
        client: "Four Seasons Hotels & Resorts",
        description: "Complete marble installation for the prestigious Four Seasons Hotel Cairo, featuring premium Carrara marble flooring, Nero Marquina feature walls, and custom-designed reception areas.",
        challenge: "Creating a luxurious yet durable stone installation that could withstand high traffic while maintaining the Four Seasons' exacting standards for elegance and sophistication.",
        solution: "Premium Italian Carrara marble for the main lobby flooring, complemented by dramatic Nero Marquina marble feature walls. Custom fabrication ensured perfect fit and finish throughout the 500-room property.",
        results: ["15,000 sqm of premium marble installation", "Zero maintenance issues in first year", "Featured in Architectural Digest Middle East", "Client satisfaction score: 98%"],
        materials: ["Carrara White Marble - 8,000 sqm", "Nero Marquina Marble - 3,500 sqm", "Calacatta Gold Marble - 2,000 sqm", "Absolute Black Granite - 1,500 sqm"],
        images: ["/luxury-hotel-lobby-marble-installation-four-season.jpg", "/luxurious-white-carrara-marble-with-grey-veining.jpg", "/luxurious-calacatta-gold-marble-with-golden-veinin.jpg", "/elegant-black-nero-marquina-marble-with-white-vein.jpg"],
        testimonial: { quote: "Top Modern delivered exceptional quality and service. Their attention to detail and commitment to excellence made them the perfect partner for our Cairo property.", author: "Sarah Johnson", position: "Regional Director of Operations, Four Seasons Hotels" },
        status: "active",
        featured: true,
      },
      {
        slug: "luxury-residential-tower",
        title: "Luxury Residential Tower - New Capital",
        category: "Residential",
        location: "New Administrative Capital, Egypt",
        year: "2023",
        client: "Premium Development Group",
        description: "High-end residential tower featuring premium marble and granite installations across 200 luxury apartments, including lobbies, common areas, and select private residences.",
        challenge: "Coordinating marble installation across 40 floors while maintaining consistent quality and meeting tight construction deadlines for Egypt's most prestigious residential development.",
        solution: "Implemented a phased installation approach with dedicated quality control teams. Used premium Kashmir White granite for durability in high-traffic areas and Emperador Dark marble for luxury accent walls.",
        results: ["200 luxury apartments completed", "12,000 sqm of stone installation", "100% on-time delivery", "Featured in Egypt Today Magazine"],
        materials: ["Kashmir White Granite - 5,000 sqm", "Emperador Dark Marble - 4,000 sqm", "Carrara White Marble - 2,500 sqm", "Absolute Black Granite - 500 sqm"],
        images: ["/luxurious-calacatta-gold-marble-with-golden-veinin.jpg", "/kashmir-white-granite-with-subtle-grey-and-black-s.jpg", "/luxury-marble-workshop-with-craftsmen-working-on-p.jpg"],
        testimonial: { quote: "The quality of Top Modern's work exceeded our expectations. They transformed our vision into reality with impeccable craftsmanship and professional service.", author: "Ahmed Mansour", position: "Development Director, Premium Development Group" },
        status: "active",
        featured: true,
      },
    ];

    const seedTable = async (table: string, rows: any[], conflictKey: string) => {
      const payload = rows.map((row) => ({
        ...row,
        created_at: row.created_at ?? now,
        updated_at: now,
      }));

      const { error } = await supabase.from(table).upsert(payload, { onConflict: conflictKey });

      if (error) {
        throw new Error(`Failed to seed ${table}: ${error.message}`);
      }
    };

    await seedTable("products", productSeeds, "slug");
    await seedTable("projects", projectSeeds, "slug");

    return { success: true, message: "Initial content seeded successfully" };
  } catch (error: any) {
    console.error("seedInitialContent Server Action error:", error);
    return { success: false, message: error.message || "An unknown error occurred during content seeding" };
  }
}
