const { createClient } = require("@supabase/supabase-js")

exports.handler = async (event, context) => {
  const TIMEOUT_MS = 30000
  const timeoutHandle = setTimeout(() => {
    console.error("❌ Seed function timed out")
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

    const now = new Date().toISOString()

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
    ]

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
    ]

    const seedTable = async (table, rows, conflictKey) => {
      const payload = rows.map((row) => ({
        ...row,
        created_at: row.created_at ?? now,
        updated_at: now,
      }))

      const { error } = await supabase.from(table).upsert(payload, { onConflict: conflictKey })

      if (error) {
        throw new Error(`Failed to seed ${table}: ${error.message}`)
      }
    }

    await seedTable("products", productSeeds, "slug")
    await seedTable("projects", projectSeeds, "slug")

    clearTimeout(timeoutHandle)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Content seeded successfully" })
    }

  } catch (error) {
    clearTimeout(timeoutHandle)
    console.error("Seed content error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
