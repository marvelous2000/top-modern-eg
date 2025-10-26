import type { Metadata } from "next"
import { ProductPageClient } from "./page.client"

// Sample product data - in real app this would come from database
const products = {
  "carrara-white-marble": {
    name: "Carrara White Marble",
    category: "Marble",
    origin: "Carrara, Italy",
    finish: "Polished",
    thickness: "20mm, 30mm",
    applications: ["Flooring", "Wall Cladding", "Countertops", "Bathroom Surfaces"],
    description:
      "Premium Italian Carrara marble with distinctive grey veining, perfect for luxury flooring and wall applications. This timeless stone has been used in iconic architecture for centuries and continues to be the gold standard for luxury projects.",
    features: [
      "Natural grey veining patterns",
      "High durability and longevity",
      "Heat and scratch resistant",
      "Easy maintenance",
      "Timeless aesthetic appeal",
    ],
    specifications: {
      Density: "2.7 g/cm³",
      "Water Absorption": "< 0.5%",
      "Compressive Strength": "120 MPa",
      "Flexural Strength": "15 MPa",
      "Frost Resistance": "Excellent",
    },
    images: [
      "/luxurious-white-carrara-marble-with-grey-veining-c.jpg",
      "/carrara-marble-flooring-in-luxury-hotel-lobby.jpg",
      "/carrara-marble-bathroom-with-elegant-vanity.jpg",
      "/carrara-marble-kitchen-countertop-with-gold-fixtur.jpg",
    ],
    relatedProjects: [
      "Four Seasons Hotel Cairo",
      "Luxury Residential Tower - New Capital",
      "Premium Restaurant Chain - Alexandria",
    ],
  },
  "nero-marquina-marble": {
    name: "Nero Marquina Marble",
    category: "Marble",
    origin: "Markina, Spain",
    finish: "Polished",
    thickness: "20mm, 30mm",
    applications: ["Wall Cladding", "Feature Walls", "Bathroom Surfaces", "Decorative Elements"],
    description:
      "Sophisticated black marble with striking white veining, ideal for creating dramatic accent walls and luxury surfaces. This premium Spanish marble adds elegance and drama to any space.",
    features: [
      "Distinctive white veining on black background",
      "High contrast dramatic appearance",
      "Excellent for feature walls",
      "Premium Spanish quality",
      "Unique natural patterns",
    ],
    specifications: {
      Density: "2.7 g/cm³",
      "Water Absorption": "< 0.4%",
      "Compressive Strength": "110 MPa",
      "Flexural Strength": "12 MPa",
      "Frost Resistance": "Good",
    },
    images: [
      "/elegant-black-nero-marquina-marble-with-white-vein.jpg",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    relatedProjects: [
      "Luxury Boutique Hotel - Zamalek",
      "High-end Restaurant - Maadi",
      "Executive Office Building - Downtown",
    ],
  },
  // Add more products as needed
}

type ProductPageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products[params.slug as keyof typeof products]

  if (!product) {
    return {
      title: "Product Not Found - Top Modern",
    }
  }

  return {
    title: `${product.name} - Top Modern | Premium ${product.category}`,
    description: product.description,
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products[params.slug as keyof typeof products]

  return <ProductPageClient product={product} params={params} />
}
