export type Project = {
  title: string
  category: string
  location: string
  year: string
  client: string
  description: string
  challenge: string
  solution: string
  results: string[]
  materials: string[]
  images: string[]
  testimonial: {
    quote: string
    author: string
    position: string
  }
}

export const projects: Record<string, Project> = {
  "four-seasons-cairo": {
    title: "Four Seasons Hotel Cairo",
    category: "Luxury Hotel",
    location: "Cairo, Egypt",
    year: "2023",
    client: "Four Seasons Hotels & Resorts",
    description:
      "Complete marble installation for the prestigious Four Seasons Hotel Cairo, featuring premium Carrara marble flooring, Nero Marquina feature walls, and custom-designed reception areas.",
    challenge:
      "Creating a luxurious yet durable stone installation that could withstand high traffic while maintaining the Four Seasons' exacting standards for elegance and sophistication.",
    solution:
      "We selected premium Italian Carrara marble for the main lobby flooring, complemented by dramatic Nero Marquina marble feature walls. Custom fabrication ensured perfect fit and finish throughout the 500-room property.",
    results: [
      "15,000 sqm of premium marble installation",
      "Zero maintenance issues in first year",
      "Featured in Architectural Digest Middle East",
      "Client satisfaction score: 98%",
    ],
    materials: [
      "Carrara White Marble - 8,000 sqm",
      "Nero Marquina Marble - 3,500 sqm",
      "Calacatta Gold Marble - 2,000 sqm",
      "Absolute Black Granite - 1,500 sqm",
    ],
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    testimonial: {
      quote:
        "Top Modern delivered exceptional quality and service. Their attention to detail and commitment to excellence made them the perfect partner for our Cairo property.",
      author: "Sarah Johnson",
      position: "Regional Director of Operations, Four Seasons Hotels",
    },
  },
  "luxury-residential-tower": {
    title: "Luxury Residential Tower - New Capital",
    category: "Residential",
    location: "New Administrative Capital, Egypt",
    year: "2023",
    client: "Premium Development Group",
    description:
      "High-end residential tower featuring premium marble and granite installations across 200 luxury apartments, including lobbies, common areas, and select private residences.",
    challenge:
      "Coordinating marble installation across 40 floors while maintaining consistent quality and meeting tight construction deadlines for Egypt's most prestigious residential development.",
    solution:
      "Implemented a phased installation approach with dedicated quality control teams on each floor. Used premium Kashmir White granite for durability in high-traffic areas and Emperador Dark marble for luxury accent walls.",
    results: [
      "200 luxury apartments completed",
      "12,000 sqm of stone installation",
      "100% on-time delivery",
      "Featured in Egypt Today Magazine",
    ],
    materials: [
      "Kashmir White Granite - 5,000 sqm",
      "Emperador Dark Marble - 4,000 sqm",
      "Carrara White Marble - 2,500 sqm",
      "Absolute Black Granite - 500 sqm",
    ],
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    testimonial: {
      quote:
        "The quality of Top Modern's work exceeded our expectations. They transformed our vision into reality with impeccable craftsmanship and professional service.",
      author: "Ahmed Mansour",
      position: "Development Director, Premium Development Group",
    },
  },
}

export const projectList = Object.entries(projects).map(([slug, project]) => ({
  slug,
  ...project,
}))
