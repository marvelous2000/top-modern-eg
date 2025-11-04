"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getActiveProducts } from "@/lib/actions/products"

// No fallback products - always fetch from database

const formatCategory = (value: string | undefined) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : ""

export function ProductsSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getActiveProducts()
        if (result.success) {
          setProducts(result.data.slice(0, 3)) // Show first 3 products
        } else {
          setError(result.error || "Failed to fetch products")
          setProducts([])
        }
      } catch (err) {
        console.error("[v0] Error fetching products:", err)
        setError("Failed to fetch products")
        setProducts([])
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
            <p className="text-xl text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="products" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-destructive">Failed to load products. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section id="products" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-foreground mb-6">
              Premium <span className="text-primary gold-glow">Stone Collection</span>
            </h2>
            <p className="text-body text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover our curated selection of the world's finest marble and granite, sourced from the most prestigious
              quarries
            </p>
            <p className="text-xl text-muted-foreground">No products available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-h2 text-foreground mb-6">
            Premium <span className="text-primary gold-glow">Stone Collection</span>
          </h2>
          <p className="text-body text-muted-foreground max-w-3xl mx-auto">
            Discover our curated selection of the world's finest marble and granite, sourced from the most prestigious
            quarries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <Card
              key={product.id || index}
              className="bg-card/80 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-300 group shadow-lg"
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
                      {formatCategory(product.category)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-h3 text-foreground mb-3">{product.name}</h3>
                  <p className="text-body-sm mb-4">{product.description}</p>
                  <Button
                    variant="glass"
                    className="w-full group-hover:shadow-primary/20 transition-all duration-300"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="btn-primary">
            View Full Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}



