"use client"

import { useState } from "react"
import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactTracking } from "@/components/contact-tracking"

const products = [
  {
    id: 1,
    name: "Carrara White Marble",
    category: "marble",
    type: "flooring",
    image: "/luxurious-white-carrara-marble-with-grey-veining.jpg",
    description:
      "Premium Italian Carrara marble with distinctive grey veining, perfect for luxury flooring and wall applications.",
    applications: ["Flooring", "Wall Cladding", "Countertops"],
    origin: "Italy",
    finish: "Polished",
    slug: "carrara-white-marble",
  },
  {
    id: 2,
    name: "Nero Marquina Marble",
    category: "marble",
    type: "wall",
    image: "/elegant-black-nero-marquina-marble-with-white-vein.jpg",
    description:
      "Sophisticated black marble with striking white veining, ideal for creating dramatic accent walls and luxury surfaces.",
    applications: ["Wall Cladding", "Feature Walls", "Bathroom Surfaces"],
    origin: "Spain",
    finish: "Polished",
    slug: "nero-marquina-marble",
  },
  {
    id: 3,
    name: "Absolute Black Granite",
    category: "granite",
    type: "countertop",
    image: "/premium-absolute-black-granite-with-mirror-finish.jpg",
    description:
      "Pure black granite with exceptional durability and mirror-like finish, perfect for high-end kitchen and bathroom applications.",
    applications: ["Countertops", "Kitchen Islands", "Bathroom Vanities"],
    origin: "India",
    finish: "Polished",
    slug: "absolute-black-granite",
  },
  {
    id: 4,
    name: "Calacatta Gold Marble",
    category: "marble",
    type: "countertop",
    image: "/luxurious-calacatta-gold-marble-with-golden-veinin.jpg",
    description:
      "Exquisite white marble with bold golden veining, the epitome of luxury for premium hospitality and residential projects.",
    applications: ["Countertops", "Feature Walls", "Luxury Bathrooms"],
    origin: "Italy",
    finish: "Polished",
    slug: "calacatta-gold-marble",
  },
  {
    id: 5,
    name: "Kashmir White Granite",
    category: "granite",
    type: "flooring",
    image: "/kashmir-white-granite-with-subtle-grey-and-black-s.jpg",
    description:
      "Light-colored granite with subtle grey and black speckles, offering durability and elegance for large-scale installations.",
    applications: ["Flooring", "Exterior Cladding", "Commercial Spaces"],
    origin: "India",
    finish: "Polished",
    slug: "kashmir-white-granite",
  },
  {
    id: 6,
    name: "Emperador Dark Marble",
    category: "marble",
    type: "wall",
    image: "/rich-brown-emperador-dark-marble-with-cream-veinin.jpg",
    description:
      "Rich brown marble with cream veining, perfect for creating warm, sophisticated interiors in luxury hospitality settings.",
    applications: ["Wall Cladding", "Lobby Features", "Restaurant Interiors"],
    origin: "Spain",
    finish: "Polished",
    slug: "emperador-dark-marble",
  },
]

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory
    const typeMatch = selectedType === "all" || product.type === selectedType
    return categoryMatch && typeMatch
  })

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#FAFAFA] relative overflow-hidden">
      <MarbleBackground />
      <ContactTracking />
      <Navigation />

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-8 text-balance">
              Premium <span className="text-[#D4AF37]">Stone</span> Collection
            </h1>
            <p className="text-xl md:text-2xl text-[#FAFAFA]/80 leading-relaxed">
              Discover our curated selection of the world's finest marble and granite, sourced from premium quarries for
              luxury projects.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="flex flex-col items-center">
              <label className="text-[#D4AF37] font-semibold mb-3">Material Type</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    selectedCategory === "all"
                      ? "bg-[#D4AF37] text-[#0F0F0F]"
                      : "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                  }`}
                >
                  All Materials
                </button>
                <button
                  onClick={() => setSelectedCategory("marble")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    selectedCategory === "marble"
                      ? "bg-[#D4AF37] text-[#0F0F0F]"
                      : "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                  }`}
                >
                  Marble
                </button>
                <button
                  onClick={() => setSelectedCategory("granite")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    selectedCategory === "granite"
                      ? "bg-[#D4AF37] text-[#0F0F0F]"
                      : "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                  }`}
                >
                  Granite
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <label className="text-[#D4AF37] font-semibold mb-3">Application</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedType("all")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    selectedType === "all"
                      ? "bg-[#D4AF37] text-[#0F0F0F]"
                      : "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setSelectedType("flooring")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    selectedType === "flooring"
                      ? "bg-[#D4AF37] text-[#0F0F0F]"
                      : "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                  }`}
                >
                  Flooring
                </button>
                <button
                  onClick={() => setSelectedType("wall")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    selectedType === "wall"
                      ? "bg-[#D4AF37] text-[#0F0F0F]"
                      : "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                  }`}
                >
                  Wall Cladding
                </button>
                <button
                  onClick={() => setSelectedType("countertop")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    selectedType === "countertop"
                      ? "bg-[#D4AF37] text-[#0F0F0F]"
                      : "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                  }`}
                >
                  Countertops
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-6 right-6">
                      <a
                        href={`/products/${product.slug}`}
                        className="bg-[#D4AF37] text-[#0F0F0F] px-6 py-3 rounded-lg font-semibold inline-block hover:bg-[#C41E3A] hover:text-[#FAFAFA] transition-colors duration-300"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-playfair text-2xl font-bold">{product.name}</h3>
                    <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wide">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-[#FAFAFA]/80 leading-relaxed">{product.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {product.applications.map((app) => (
                      <span key={app} className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-sm">
                        {app}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-[#FAFAFA]/60">
                    <span>Origin: {product.origin}</span>
                    <span>Finish: {product.finish}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8">
              Need a <span className="text-[#D4AF37]">Custom Solution?</span>
            </h2>
            <p className="text-xl text-[#FAFAFA]/80 mb-12 leading-relaxed">
              Our experts can help you select the perfect stone for your specific project requirements and provide
              custom fabrication services.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="bg-[#D4AF37] text-[#0F0F0F] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#C41E3A] hover:text-[#FAFAFA] transition-colors duration-300"
              >
                Request Consultation
              </a>
              <a
                href="mailto:info@topmodern.com"
                className="border border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors duration-300"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("contactClick", {
                      detail: { type: "email", identifier: "info@topmodern.com", page: "/services" },
                    }),
                  )
                }
              >
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
