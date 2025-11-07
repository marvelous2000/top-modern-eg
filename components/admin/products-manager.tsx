"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getProducts, createProduct, updateProduct, deleteProduct, type Product } from "@/lib/actions/products"
import { Plus, Edit, Trash2, X, Save, Search, Loader2, Package } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getProducts()
        if (result.success) {
          setProducts(result.data as Product[])
        } else {
          setError(result.error || "Failed to fetch products")
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      (filterCategory === "all" || p.category === filterCategory) &&
      (filterStatus === "all" || p.status === filterStatus) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [products, searchTerm, filterCategory, filterStatus])

  const handleOpenForm = (product: Partial<Product> | null = null) => {
    if (product) {
      setEditingProduct(product)
    } else {
      setEditingProduct({
        name: "", category: "marble", slug: "", description: "", origin: "", finish: "Polished", thickness: "20mm", applications: [], images: [], specifications: {}, status: "draft",
      })
    }
    setIsFormOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!editingProduct) return
    try {
      if (editingProduct.id) {
        const result = await updateProduct(editingProduct.id, editingProduct as Product)
        if (result.success) setProducts(products.map((p) => (p.id === editingProduct.id ? (result.data as Product) : p)))
        else throw new Error(result.error)
      } else {
        const result = await createProduct(editingProduct as Product)
        if (result.success) setProducts([result.data as Product, ...products])
        else throw new Error(result.error)
      }
      setIsFormOpen(false)
      setEditingProduct(null)
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(productId)
      if (result.success) setProducts(products.filter((p) => p.id !== productId))
      else alert(`Failed to delete product: ${result.error}`)
    }
  }

  const statusConfig: { [key: string]: { color: string } } = {
    active: { color: "bg-[hsl(var(--chart-2)_/_0.2)] text-[hsl(var(--chart-2))]" },
    draft: { color: "bg-[hsl(var(--chart-3)_/_0.2)] text-[hsl(var(--chart-3))]" },
    archived: { color: "bg-muted text-muted-foreground" },
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><CardTitle className="text-2xl font-serif text-foreground">Products</CardTitle><p className="text-sm text-muted-foreground">Manage your material inventory.</p></div>
          <Button onClick={() => handleOpenForm()}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2 md:col-span-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-muted/50 w-full" /></div>
          <Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem><SelectItem value="marble">Marble</SelectItem><SelectItem value="granite">Granite</SelectItem></SelectContent></Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
          <div className="text-sm text-muted-foreground flex items-center justify-end">{filteredProducts.length} products</div>
        </CardContent>
      </Card>

      {loading ? <div className="h-64 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div> :
       error ? <div className="h-64 flex flex-col items-center justify-center text-destructive bg-card border border-dashed rounded-lg">{error}</div> :
       filteredProducts.length === 0 ? <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">No products found.</div> :
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="flex flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
              </div>
              {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md border" />}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{product.description}</p>
              <div className="space-y-3 pt-4 mt-4 border-t">
                <div className="flex justify-between items-center">
                  <Badge className={cn("capitalize", statusConfig[product.status]?.color)}>{product.status}</Badge>
                  <p className="text-xs text-muted-foreground">Origin: {product.origin}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleOpenForm(product)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
                  <Button size="sm" variant="destructive" className="w-full" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b text-center">
            <DialogTitle className="text-2xl font-serif">
              {editingProduct?.id ? <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md">Edit Product</span> : <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md">Create New Product</span>}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Fill in the details of the product below.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && <>
            <div className="p-6 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2"><Label>Product Name</Label><Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="min-h-[120px]" /></div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Category</Label><Select value={editingProduct.category} onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="marble">Marble</SelectItem><SelectItem value="granite">Granite</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Status</Label><Select value={editingProduct.status} onValueChange={(v) => setEditingProduct({ ...editingProduct, status: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Origin</Label><Input value={editingProduct.origin} onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter className="p-4 border-t bg-muted/50"><Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button><Button onClick={handleSaveProduct}><Save className="h-4 w-4 mr-2" />Save Product</Button></DialogFooter>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}