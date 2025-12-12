"use client"

import { useState } from "react"
import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"

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

import { useTranslations } from "next-intl";

export default function ServicesPage() {
  const t = useTranslations("services");
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory
    const typeMatch = selectedType === "all" || product.type === selectedType
    return categoryMatch && typeMatch
  })

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <MarbleBackground />
      <ContactTracking />
      <Navigation />

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-h1 mb-8 text-balance">
              {t("title")}
            </h1>
            <p className="text-body text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </section>


        {/* Filters */}
        <section className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="flex flex-col items-center">
              <label className="text-primary font-semibold mb-3">{t("filters.materialType")}</label>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-300 ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {t("filters.allMaterials")}
                </button>
                <button
                  onClick={() => setSelectedCategory("marble")}
                  className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-300 ${
                    selectedCategory === "marble"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {t("filters.marble")}
                </button>
                <button
                  onClick={() => setSelectedCategory("granite")}
                  className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-300 ${
                    selectedCategory === "granite"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {t("filters.granite")}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <label className="text-primary font-semibold mb-3">{t("filters.application")}</label>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedType("all")}
                  className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-300 ${
                    selectedType === "all"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {t("filters.allTypes")}
                </button>
                <button
                  onClick={() => setSelectedType("flooring")}
                  className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-300 ${
                    selectedType === "flooring"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {t("filters.flooring")}
                </button>
                <button
                  onClick={() => setSelectedType("wall")}
                  className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-300 ${
                    selectedType === "wall"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {t("filters.wall")}
                </button>
                <button
                  onClick={() => setSelectedType("countertop")}
                  className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-300 ${
                    selectedType === "countertop"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {t("filters.countertop")}
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
                <div className="relative overflow-hidden rounded-lg mb-6 aspect-video">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-6 right-6">
                      <a
                        href={`/${t('locale')}/products/${product.slug}`}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold inline-block hover:bg-primary/80 hover:text-primary-foreground transition-colors duration-300"
                      >
                        {t("viewDetails")}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-h2 truncate">{product.name}</h3>
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide shrink-0">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed line-clamp-3">{product.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {product.applications.map((app) => (
                      <span key={app} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm break-words">
                        {t(`applications.${app.replace(/\s/g, '_').toLowerCase()}`)}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="truncate">{t('product_origin')}: {product.origin}</span>
                    <span className="truncate">{t('product_finish')}: {product.finish}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-h1 mb-8">
              {t("cta.customSolution")}
            </h2>
            <p className="text-body text-muted-foreground mb-12 leading-relaxed">
              {t("cta.consultation")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                              <a
                                href={`/${t('locale')}/contact`}
                                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/80 hover:text-primary-foreground transition-colors duration-300"
                              >                {t("cta.requestConsultation")}
              </a>
              <a
                href="mailto:info@topmodern.com"
                className="border border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("contactClick", {
                      detail: { type: "email", identifier: "info@topmodern.com", page: "/services" },
                    }),
                  )
                }
              >
                {t("cta.emailUs")}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
