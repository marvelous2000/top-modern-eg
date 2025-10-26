"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getActiveProducts } from "@/lib/actions/products"

// Fallback products for when DB is not set up yet
const fallbackProducts = [
  {
    name: "Carrara Marble",
    description: "Premium Italian marble with distinctive white and gray veining, perfect for luxury interiors.",
    images: ["/carrara-marble-white-gray-veining-luxury.jpg"],
    category: "Marble",
  },
  {
    name: "Black Galaxy Granite",
    description: "Stunning black granite with golden speckles, ideal for countertops and flooring.",
    images: ["/black-galaxy-granite-golden-speckles-luxury.jpg"],
    category: "Granite",
  },
  {
    name: "Calacatta Gold",
    description: "Exquisite marble with bold gold veining, the epitome of luxury and elegance.",
    images: ["/calacatta-gold-marble-bold-veining-luxury.jpg"],
    category: "Marble",
  },
]

export function ProductsSection() {
  const [products, setProducts] = useState<any[]>(fallbackProducts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getActiveProducts()
      if (result.success && result.data.length > 0) {
        // Use database products if available
        setProducts(result.data.slice(0, 3)) // Show first 3 products
      } else {
        // Use fallback products if DB not set up or no products
        console.log("[v0] Using fallback products - DB may not be set up yet")
        setProducts(fallbackProducts)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section id="products" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-gray-300">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Premium <span className="text-primary">Stone Collection</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our curated selection of the world's finest marble and granite, sourced from the most prestigious
            quarries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <Card
              key={product.id || index}
              className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-black px-3 py-1 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-bold text-white mb-3">{product.name}</h3>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <Button
                    variant="outline"
                    className="border-primary text-[#FAFAFA] hover:bg-primary hover:text-[#FAFAFA] w-full bg-transparent"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-primary text-[#FAFAFA] hover:bg-primary/90">
            View Full Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
