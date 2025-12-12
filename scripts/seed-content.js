require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@supabase/supabase-js")

// Set timeout to prevent hanging
const TIMEOUT_MS = 30000 // 30 seconds
const timeoutHandle = setTimeout(() => {
  console.error("❌ Seed script timed out after 30 seconds")
  process.exit(1)
}, TIMEOUT_MS)

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("🔍 Validating seed script environment variables...")
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

console.log("✅ Seed script environment variables validated")

const supabase = createClient(url, serviceKey, {
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
    name_ar: "رخام كرارا الأبيض",
    category: "marble",
    description: "Premium Italian Carrara marble with distinctive grey veining, perfect for luxury flooring and wall applications.",
    description_ar: "رخام كرارا إيطالي فاخر مع عروق رمادية مميزة، مثالي للأرضيات الفاخرة وتطبيقات الجدران.",
    origin: "Carrara, Italy",
    origin_ar: "كرارا، إيطاليا",
    finish: "Polished",
    finish_ar: "مصقول",
    thickness: "20mm, 30mm",
    applications: ["Flooring", "Wall Cladding", "Countertops", "Bathroom Surfaces"],
    applications_ar: ["الأرضيات", "تكسية الجدران", "أسطح العمل", "أسطح الحمامات"],
    images: ["/luxurious-white-carrara-marble-with-grey-veining-c.jpg", "/carrara-marble-flooring-in-luxury-hotel-lobby.jpg", "/carrara-marble-bathroom-with-elegant-vanity.jpg", "/carrara-marble-kitchen-countertop-with-gold-fixtur.jpg"],
    specifications: { Density: "2.7 g/cm³", "Water Absorption": "< 0.5%", "Compressive Strength": "120 MPa", "Flexural Strength": "15 MPa" },
    specifications_ar: { الكثافة: "2.7 جم/سم³", "امتصاص الماء": "< 0.5%", "قوة الضغط": "120 ميجا باسكال", "قوة الانثناء": "15 ميجا باسكال" },
    status: "active",
  },
  {
    slug: "nero-marquina-marble",
    name: "Nero Marquina Marble",
    name_ar: "رخام نيرو ماركينا",
    category: "marble",
    description: "Sophisticated black marble with striking white veining, ideal for dramatic accent walls and luxury surfaces.",
    description_ar: "رخام أسود أنيق مع عروق بيضاء مذهلة، مثالي لجدران التمييز والأسطح الفاخرة.",
    origin: "Markina, Spain",
    origin_ar: "ماركينا، إسبانيا",
    finish: "Polished",
    finish_ar: "مصقول",
    thickness: "20mm, 30mm",
    applications: ["Feature Walls", "Bathroom Surfaces", "Decorative Elements", "Reception Areas"],
    applications_ar: ["جدران مميزة", "أسطح الحمامات", "عناصر زخرفية", "مناطق الاستقبال"],
    images: ["/elegant-black-nero-marquina-marble-with-white-vein.jpg", "/luxury-hotel-lobby-marble-installation-four-season.jpg", "/luxurious-white-carrara-marble-with-grey-veining.jpg"],
    specifications: { Density: "2.7 g/cm³", "Water Absorption": "< 0.4%", "Compressive Strength": "110 MPa", "Flexural Strength": "12 MPa" },
    specifications_ar: { الكثافة: "2.7 جم/سم³", "امتصاص الماء": "< 0.4%", "قوة الضغط": "110 ميجا باسكال", "قوة الانثناء": "12 ميجا باسكال" },
    status: "active",
  },
  {
    slug: "black-galaxy-granite",
    name: "Black Galaxy Granite",
    name_ar: "جرانيت بلاك جالاكسي",
    category: "granite",
    description: "Stunning black granite with golden speckles, prized for countertops, flooring, and statement surfaces in luxury spaces.",
    description_ar: "جرانيت أسود مذهل مع بقع ذهبية، يُقدَّر لأسطح العمل والأرضيات والأسطح المميزة في المساحات الفاخرة.",
    origin: "Andhra Pradesh, India",
    origin_ar: "أندرا براديش، الهند",
    finish: "Polished",
    finish_ar: "مصقول",
    thickness: "20mm, 30mm",
    applications: ["Countertops", "Flooring", "Wall Cladding", "Reception Desks"],
    applications_ar: ["أسطح العمل", "الأرضيات", "تكسية الجدران", "مكاتب الاستقبال"],
    images: ["/black-galaxy-granite-golden-speckles-luxury.jpg", "/premium-absolute-black-granite-with-mirror-finish.jpg", "/luxury-marble-workshop-with-craftsmen-working-on-p.jpg"],
    specifications: { Density: "2.9 g/cm³", "Water Absorption": "< 0.2%", "Compressive Strength": "200 MPa", "Flexural Strength": "18 MPa" },
    specifications_ar: { الكثافة: "2.9 جم/سم³", "امتصاص الماء": "< 0.2%", "قوة الضغط": "200 ميجا باسكال", "قوة الانثناء": "18 ميجا باسكال" },
    status: "active",
  },
]

const projectSeeds = [
  {
    slug: "four-seasons-cairo",
    title: "Four Seasons Hotel Cairo",
    title_ar: "فندق فور سيزونز القاهرة",
    category: "Luxury Hotel",
    category_ar: "فندق فخم",
    location: "Cairo, Egypt",
    location_ar: "القاهرة، مصر",
    year: "2023",
    client: "Four Seasons Hotels & Resorts",
    client_ar: "فنادق ومنتجعات فور سيزونز",
    description: "Complete marble installation for the prestigious Four Seasons Hotel Cairo, featuring premium Carrara marble flooring, Nero Marquina feature walls, and custom-designed reception areas.",
    description_ar: "تركيب رخام كامل لفندق فور سيزونز القاهرة المرموق، ويضم أرضيات رخام كرارا فاخرة، وجدران مميزة من نيرو ماركينا، ومناطق استقبال مصممة خصيصًا.",
    challenge: "Creating a luxurious yet durable stone installation that could withstand high traffic while maintaining the Four Seasons' exacting standards for elegance and sophistication.",
    challenge_ar: "إنشاء تركيب حجري فاخر ومتين يمكنه تحمل حركة المرور العالية مع الحفاظ على معايير فور سيزونز الصارمة للأناقة والرقي.",
    solution: "Premium Italian Carrara marble for the main lobby flooring, complemented by dramatic Nero Marquina marble feature walls. Custom fabrication ensured perfect fit and finish throughout the 500-room property.",
    solution_ar: "رخام كرارا إيطالي فاخر لأرضية الردهة الرئيسية، يكمله جدران مميزة من رخام نيرو ماركينا. التصنيع المخصص يضمن التوافق والتشطيب المثالي في جميع أنحاء العقار المكون من 500 غرفة.",
    results: ["15,000 sqm of premium marble installation", "Zero maintenance issues in first year", "Featured in Architectural Digest Middle East", "Client satisfaction score: 98%"],
    results_ar: ["تركيب 15000 متر مربع من الرخام الفاخر", "صفر مشاكل صيانة في السنة الأولى", "تم عرضه في مجلة Architectural Digest Middle East", "درجة رضا العملاء: 98%"],
    materials: ["Carrara White Marble - 8,000 sqm", "Nero Marquina Marble - 3,500 sqm", "Calacatta Gold Marble - 2,000 sqm", "Absolute Black Granite - 1,500 sqm"],
    materials_ar: ["رخام كرارا الأبيض - 8000 متر مربع", "رخام نيرو ماركينا - 3500 متر مربع", "رخام كالاكاتا الذهبي - 2000 متر مربع", "جرانيت أبسولوت بلاك - 1500 متر مربع"],
    images: ["/luxury-hotel-lobby-marble-installation-four-season.jpg", "/luxurious-white-carrara-marble-with-grey-veining.jpg", "/luxurious-calacatta-gold-marble-with-golden-veinin.jpg", "/elegant-black-nero-marquina-marble-with-white-vein.jpg"],
    testimonial: { quote: "Top Modern delivered exceptional quality and service. Their attention to detail and commitment to excellence made them the perfect partner for our Cairo property.", author: "Sarah Johnson", position: "Regional Director of Operations, Four Seasons Hotels" },
    testimonial_ar: { quote: "قدمت توب مودرن جودة وخدمة استثنائية. إن اهتمامهم بالتفاصيل والتزامهم بالتميز جعلهم الشريك المثالي لممتلكاتنا في القاهرة.", author: "سارة جونسون", position: "المدير الإقليمي للعمليات، فنادق فور سيزونز" },
    status: "active",
    featured: true,
  },
  {
    slug: "luxury-residential-tower",
    title: "Luxury Residential Tower - New Capital",
    title_ar: "برج سكني فاخر - العاصمة الجديدة",
    category: "Residential",
    category_ar: "سكني",
    location: "New Administrative Capital, Egypt",
    location_ar: "العاصمة الإدارية الجديدة، مصر",
    year: "2023",
    client: "Premium Development Group",
    client_ar: "مجموعة التطوير المتميزة",
    description: "High-end residential tower featuring premium marble and granite installations across 200 luxury apartments, including lobbies, common areas, and select private residences.",
    description_ar: "برج سكني فاخر يضم تركيبات من الرخام والجرانيت الفاخر في 200 شقة فاخرة، بما في ذلك الردهات والمناطق المشتركة وبعض المساكن الخاصة المختارة.",
    challenge: "Coordinating marble installation across 40 floors while maintaining consistent quality and meeting tight construction deadlines for Egypt's most prestigious residential development.",
    challenge_ar: "تنسيق تركيب الرخام عبر 40 طابقًا مع الحفاظ على جودة متسقة والوفاء بالمواعيد النهائية الضيقة للبناء لأرقى مشروع سكني في مصر.",
    solution: "Implemented a phased installation approach with dedicated quality control teams. Used premium Kashmir White granite for durability in high-traffic areas and Emperador Dark marble for luxury accent walls.",
    solution_ar: "تم تنفيذ نهج تركيب مرحلي مع فرق مراقبة جودة مخصصة. تم استخدام جرانيت كشمير الأبيض الفاخر للمتانة في المناطق ذات حركة المرور العالية ورخام إمبيرادور الداكن لجدران التمييز الفاخرة.",
    results: ["200 luxury apartments completed", "12,000 sqm of stone installation", "100% on-time delivery", "Featured in Egypt Today Magazine"],
    results_ar: ["إنجاز 200 شقة فاخرة", "تركيب 12000 متر مربع من الحجر", "تسليم في الوقت المحدد بنسبة 100%", "تم عرضه في مجلة Egypt Today"],
    materials: ["Kashmir White Granite - 5,000 sqm", "Emperador Dark Marble - 4,000 sqm", "Carrara White Marble - 2,500 sqm", "Absolute Black Granite - 500 sqm"],
    materials_ar: ["جرانيت كشمير الأبيض - 5000 متر مربع", "رخام إمبيرادور الداكن - 4000 متر مربع", "رخام كرارا الأبيض - 2500 متر مربع", "جرانيت أبسولوت بلاك - 500 متر مربع"],
    images: ["/luxurious-calacatta-gold-marble-with-golden-veinin.jpg", "/kashmir-white-granite-with-subtle-grey-and-black-s.jpg", "/luxury-marble-workshop-with-craftsmen-working-on-p.jpg"],
    testimonial: { quote: "The quality of Top Modern's work exceeded our expectations. They transformed our vision into reality with impeccable craftsmanship and professional service.", author: "Ahmed Mansour", position: "Development Director, Premium Development Group" },
    testimonial_ar: { quote: "جودة عمل توب مودرن فاقت توقعاتنا. لقد حولوا رؤيتنا إلى حقيقة بحرفية لا تشوبها شائبة وخدمة احترافية.", author: "أحمد منصور", position: "مدير التطوير، مجموعة التطوير المتميزة" },
    status: "active",
    featured: true,
  },
  {
    slug: "luxury-boutique-hotel-zamalek",
    title: "Luxury Boutique Hotel - Zamalek",
    title_ar: "فندق بوتيك فاخر - الزمالك",
    category: "Hospitality",
    category_ar: "ضيافة",
    location: "Zamalek, Cairo",
    location_ar: "الزمالك، القاهرة",
    year: "2024",
    client: "Signature Hospitality Group",
    client_ar: "مجموعة سيجنتشر للضيافة",
    description: "Boutique hospitality renovation featuring Nero Marquina accent walls, Calacatta Gold reception counters, and bespoke stonework throughout suites and penthouses.",
    description_ar: "تجديد فندق بوتيك يضم جدران مميزة من نيرو ماركينا، وعدادات استقبال من كالاكاتا الذهبي، وأعمال حجرية مخصصة في جميع الأجنحة والبنتهاوس.",
    challenge: "Delivering handcrafted stone elements in a live hotel environment with minimal disruption to guests and operations.",
    challenge_ar: "تسليم عناصر حجرية مصنوعة يدويًا في بيئة فندقية حية بأقل قدر من الإزعاج للضيوف والعمليات.",
    solution: "Night-shift installation schedules, modular prefabricated stone panels, and on-site finishing teams ensured rapid delivery without compromising quality.",
    solution_ar: "جداول تركيب ليلية، وألواح حجرية مسبقة الصنع، وفرق تشطيب في الموقع لضمان التسليم السريع دون المساس بالجودة.",
    results: ["Completed 30 luxury suites in 10 weeks", "98% guest satisfaction post-renovation", "Awarded Best Luxury Boutique Hotel Renovation 2024"],
    results_ar: ["إنجاز 30 جناحًا فاخرًا في 10 أسابيع", "رضا الضيوف بنسبة 98% بعد التجديد", "حائز على جائزة أفضل تجديد فندق بوتيك فاخر 2024"],
    materials: ["Nero Marquina Marble", "Calacatta Gold Marble", "Black Galaxy Granite"],
    materials_ar: ["رخام نيرو ماركينا", "رخام كالاكاتا الذهبي", "جرانيت بلاك جالاكسي"],
    images: ["/elegant-black-nero-marquina-marble-with-white-vein.jpg", "/luxurious-calacatta-gold-marble-with-golden-veinin.jpg", "/black-galaxy-granite-golden-speckles-luxury.jpg"],
    testimonial: { quote: "Top Modern's team delivered a flawless transformation while keeping our hotel fully operational.", author: "Layla Mostafa", position: "General Manager, Signature Hospitality Group" },
    testimonial_ar: { quote: "قدم فريق توب مودرن تحولًا لا تشوبه شائبة مع الحفاظ على فندقنا يعمل بكامل طاقته.", author: "ليلى مصطفى", position: "المدير العام، مجموعة سيجنتشر للضيافة" },
    status: "active",
    featured: false,
  },
]

async function seedTable({ table, rows, conflictKey }) {
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

async function main() {
  try {
    await seedTable({ table: "products", rows: productSeeds, conflictKey: "slug" })
    console.log("Seeded products")

    await seedTable({ table: "projects", rows: projectSeeds, conflictKey: "slug" })
    console.log("Seeded projects")

    console.log("Seeding completed successfully.")
    process.exit(0)
  } catch (error) {
    console.error(error.message ?? error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("❌ Seed script failed:", error.message)
  clearTimeout(timeoutHandle)
  process.exit(1)
}).finally(() => {
  clearTimeout(timeoutHandle)
})

