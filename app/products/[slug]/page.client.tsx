"use client"

import { notFound } from "next/navigation"
import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactTracking } from "@/components/contact-tracking"

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
  product: (typeof products)[keyof typeof products] | undefined
}

export function ProductPageClient({ params, product }: ProductPageProps) {
  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#FAFAFA] relative overflow-hidden">
      <MarbleBackground />
      <ContactTracking />
      <Navigation />

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[#D4AF37] font-semibold uppercase tracking-wide">{product.category}</span>
                <span className="text-[#FAFAFA]/40">•</span>
                <span className="text-[#FAFAFA]/60">{product.origin}</span>
              </div>

              <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-8 text-balance">{product.name}</h1>

              <p className="text-xl text-[#FAFAFA]/80 leading-relaxed mb-8">{product.description}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="bg-[#D4AF37] text-[#0F0F0F] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#C41E3A] hover:text-[#FAFAFA] transition-colors duration-300 text-center"
                >
                  Request Quote
                </a>
                <a
                  href="tel:+201234567890"
                  className="border border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors duration-300 text-center"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("contactClick", {
                        detail: { type: "phone", identifier: "+201234567890", page: `/products/${params.slug}` },
                      }),
                    )
                  }
                >
                  Call Expert
                </a>
              </div>
            </div>

            <div className="relative">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </section>

        {/* Product Gallery */}
        <section className="container mx-auto px-6 py-20">
          <h2 className="font-playfair text-4xl font-bold mb-12 text-center">
            Product <span className="text-[#D4AF37]">Gallery</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.images.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - View ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Features & Specifications */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Features */}
            <div>
              <h2 className="font-playfair text-4xl font-bold mb-8">
                Key <span className="text-[#D4AF37]">Features</span>
              </h2>

              <div className="space-y-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-[#FAFAFA]/90">{feature}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="font-playfair text-2xl font-bold mb-6">Applications</h3>
                <div className="flex flex-wrap gap-3">
                  {product.applications.map((app) => (
                    <span key={app} className="bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 rounded-full font-semibold">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="font-playfair text-4xl font-bold mb-8">
                Technical <span className="text-[#D4AF37]">Specifications</span>
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-6 border border-[#D4AF37]/20 rounded-lg">
                  <div>
                    <p className="text-[#D4AF37] font-semibold mb-2">Origin</p>
                    <p className="text-[#FAFAFA]/90">{product.origin}</p>
                  </div>
                  <div>
                    <p className="text-[#D4AF37] font-semibold mb-2">Finish</p>
                    <p className="text-[#FAFAFA]/90">{product.finish}</p>
                  </div>
                  <div>
                    <p className="text-[#D4AF37] font-semibold mb-2">Thickness</p>
                    <p className="text-[#FAFAFA]/90">{product.thickness}</p>
                  </div>
                  <div>
                    <p className="text-[#D4AF37] font-semibold mb-2">Category</p>
                    <p className="text-[#FAFAFA]/90">{product.category}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-[#D4AF37]/20">
                      <span className="text-[#FAFAFA]/80">{key}</span>
                      <span className="text-[#D4AF37] font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        <section className="container mx-auto px-6 py-20">
          <h2 className="font-playfair text-4xl font-bold mb-12 text-center">
            Featured in <span className="text-[#D4AF37]">Projects</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {product.relatedProjects.map((project, index) => (
              <div key={index} className="text-center p-8 border border-[#D4AF37]/20 rounded-lg">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#0F0F0F] text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="font-playfair text-xl font-bold mb-4">{project}</h3>
                <p className="text-[#FAFAFA]/80">
                  Premium installation showcasing the beauty and durability of {product.name}.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8">
              Ready to Use <span className="text-[#D4AF37]">{product.name}?</span>
            </h2>
            <p className="text-xl text-[#FAFAFA]/80 mb-12 leading-relaxed">
              Contact our experts to discuss your project requirements and get a detailed quote for {product.name}.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="bg-[#D4AF37] text-[#0F0F0F] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#C41E3A] hover:text-[#FAFAFA] transition-colors duration-300"
              >
                Get Quote
              </a>
              <a
                href="mailto:info@topmodern.com"
                className="border border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors duration-300"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("contactClick", {
                      detail: { type: "email", identifier: "info@topmodern.com", page: `/products/${params.slug}` },
                    }),
                  )
                }
              >
                Email Expert
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ProductPageClient
