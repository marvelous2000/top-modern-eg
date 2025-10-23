"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  category: "marble" | "granite"
  slug: string
  description: string
  origin: string
  finish: string
  thickness: string
  applications: string[]
  images: string[]
  specifications: Record<string, string>
  status: "active" | "draft" | "archived"
  createdAt: string
  updatedAt: string
}

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Carrara White Marble",
    category: "marble",
    slug: "carrara-white-marble",
    description: "Premium Italian Carrara marble with distinctive grey veining",
    origin: "Carrara, Italy",
    finish: "Polished",
    thickness: "20mm, 30mm",
    applications: ["Flooring", "Wall Cladding", "Countertops"],
    images: ["/placeholder.svg?height=400&width=400"],
    specifications: {
      Density: "2.7 g/cm³",
      "Water Absorption": "< 0.5%",
      "Compressive Strength": "120 MPa",
    },
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Nero Marquina Marble",
    category: "marble",
    slug: "nero-marquina-marble",
    description: "Sophisticated black marble with striking white veining",
    origin: "Markina, Spain",
    finish: "Polished",
    thickness: "20mm, 30mm",
    applications: ["Wall Cladding", "Feature Walls", "Bathroom Surfaces"],
    images: ["/placeholder.svg?height=400&width=400"],
    specifications: {
      Density: "2.7 g/cm³",
      "Water Absorption": "< 0.4%",
      "Compressive Strength": "110 MPa",
    },
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
]

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | "marble" | "granite">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft" | "archived">("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    const matchesStatus = filterStatus === "all" || product.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleCreateProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      category: "marble",
      slug: "",
      description: "",
      origin: "",
      finish: "Polished",
      thickness: "20mm",
      applications: [],
      images: [],
      specifications: {},
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setSelectedProduct(newProduct)
    setIsEditing(true)
  }

  const handleSaveProduct = (product: Product) => {
    if (products.find((p) => p.id === product.id)) {
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...product, updatedAt: new Date().toISOString().split("T")[0] } : p,
        ),
      )
    } else {
      setProducts([...products, product])
    }
    setSelectedProduct(null)
    setIsEditing(false)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId))
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null)
        setIsEditing(false)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "draft":
        return "bg-yellow-500/20 text-yellow-400"
      case "archived":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-3xl font-bold text-[#D4AF37]">Products Manager</h2>
        <Button onClick={handleCreateProduct} className="bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C41E3A]">
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as any)}
          className="bg-[#0F0F0F] border border-[#D4AF37]/20 text-[#FAFAFA] rounded-md px-3 py-2"
        >
          <option value="all">All Categories</option>
          <option value="marble">Marble</option>
          <option value="granite">Granite</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-[#0F0F0F] border border-[#D4AF37]/20 text-[#FAFAFA] rounded-md px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <div className="text-[#FAFAFA]/60 flex items-center">{filteredProducts.length} products found</div>
      </div>

      {/* Products Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border border-[#D4AF37]/20 rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-playfair text-xl font-bold text-[#FAFAFA] mb-2">{product.name}</h3>
                <p className="text-[#FAFAFA]/60 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`${getStatusColor(product.status)} border-0`}>{product.status}</Badge>
                  <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-0">{product.category}</Badge>
                </div>

                <div className="text-xs text-[#FAFAFA]/40 space-y-1">
                  <p>Origin: {product.origin}</p>
                  <p>Updated: {product.updatedAt}</p>
                </div>
              </div>

              {product.images[0] && (
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg ml-4"
                />
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedProduct(product)
                  setIsEditing(true)
                }}
                className="bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C41E3A] flex-1"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteProduct(product.id)}
                className="border-red-500 text-red-400 hover:bg-red-500/20"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FAFAFA]/60 text-lg">No products found matching your criteria.</p>
        </div>
      )}

      {/* Product Editor Modal */}
      {isEditing && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-[#D4AF37]">
                {selectedProduct.id ? "Edit Product" : "Create Product"}
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedProduct(null)
                  setIsEditing(false)
                }}
                className="border-[#D4AF37]/20 text-[#FAFAFA]"
              >
                Cancel
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Product Name</label>
                  <Input
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Category</label>
                  <select
                    value={selectedProduct.category}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        category: e.target.value as "marble" | "granite",
                      })
                    }
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 text-[#FAFAFA] rounded-md px-3 py-2"
                  >
                    <option value="marble">Marble</option>
                    <option value="granite">Granite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Origin</label>
                  <Input
                    value={selectedProduct.origin}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        origin: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                    placeholder="e.g., Carrara, Italy"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Finish</label>
                  <Input
                    value={selectedProduct.finish}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        finish: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                    placeholder="e.g., Polished, Honed"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Status</label>
                  <select
                    value={selectedProduct.status}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        status: e.target.value as "active" | "draft" | "archived",
                      })
                    }
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 text-[#FAFAFA] rounded-md px-3 py-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Description</label>
                  <Textarea
                    value={selectedProduct.description}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        description: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA] min-h-[120px]"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Thickness</label>
                  <Input
                    value={selectedProduct.thickness}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        thickness: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                    placeholder="e.g., 20mm, 30mm"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Applications (comma-separated)</label>
                  <Input
                    value={selectedProduct.applications.join(", ")}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        applications: e.target.value
                          .split(",")
                          .map((app) => app.trim())
                          .filter(Boolean),
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                    placeholder="e.g., Flooring, Wall Cladding, Countertops"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-2">Slug</label>
                  <Input
                    value={selectedProduct.slug}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        slug: e.target.value,
                      })
                    }
                    className="bg-[#0F0F0F] border-[#D4AF37]/20 text-[#FAFAFA]"
                    placeholder="URL-friendly slug"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={() => handleSaveProduct(selectedProduct)}
                className="bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C41E3A]"
              >
                Save Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
