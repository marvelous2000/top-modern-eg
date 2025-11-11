"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
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
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())))
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

  const statusConfig: { [key: string]: string } = {
    active: "bg-green-500/20 text-green-500",
    draft: "bg-orange-500/20 text-orange-500",
    archived: "bg-gray-500/20 text-gray-500",
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><CardTitle className="text-2xl font-bold">Products</CardTitle><p className="text-sm text-muted-foreground">Manage your material inventory.</p></div>
          <Button onClick={() => handleOpenForm()} className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5"><Plus className="h-4 w-4 mr-2" />Add Product</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2 md:col-span-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 rounded-lg w-full" /></div>
          <Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger className="rounded-lg"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem><SelectItem value="marble">Marble</SelectItem><SelectItem value="granite">Granite</SelectItem></SelectContent></Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="rounded-lg"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
          <div className="text-sm text-muted-foreground flex items-center justify-end">{filteredProducts.length} products</div>
        </CardContent>
      </Card>

      {loading ? <div className="h-64 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div> :
       error ? <div className="h-64 flex flex-col items-center justify-center text-destructive bg-destructive/10 border border-dashed border-destructive rounded-lg p-4 text-center">{error}</div> :
       filteredProducts.length === 0 ? <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">No products found.</div> :
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl flex flex-col">
            <CardHeader className="flex flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-lg truncate group-hover:text-accent">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
              </div>
              {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-lg border" />}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{product.description}</p>
              <div className="space-y-3 pt-4 mt-4 border-t">
                <div className="flex justify-between items-center">
                  <Badge className={cn("capitalize text-xs rounded-md", statusConfig[product.status])}>{product.status}</Badge>
                  <p className="text-xs text-muted-foreground">Origin: {product.origin}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="w-full rounded-md" onClick={() => handleOpenForm(product)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
                  <Button size="sm" variant="destructive" className="w-full rounded-md" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-xl animate-fade-in-slide-down">
          <DialogHeader className="p-6 bg-accent text-accent-foreground text-center relative rounded-t-xl">
            <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                </div>
                <div>
                    <DialogTitle className="text-2xl font-bold">{editingProduct?.id ? "Edit Product" : "Create New Product"}</DialogTitle>
                    <DialogDescription className="text-accent-foreground/80">Fill in the details of the product below.</DialogDescription>
                </div>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          {editingProduct && <>
            <div className="p-6 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2"><Label className="font-semibold">Product Name</Label><Input className="rounded-lg p-3" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} /></div>
                <div className="space-y-2"><Label className="font-semibold">Description</Label><Textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="min-h-[120px] rounded-lg p-3" /></div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2"><Label className="font-semibold">Category</Label><Select value={editingProduct.category} onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v as any })}><SelectTrigger className="rounded-lg p-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="marble">Marble</SelectItem><SelectItem value="granite">Granite</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label className="font-semibold">Status</Label><Select value={editingProduct.status} onValueChange={(v) => setEditingProduct({ ...editingProduct, status: v as any })}><SelectTrigger className="rounded-lg p-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label className="font-semibold">Origin</Label><Input className="rounded-lg p-3" value={editingProduct.origin} onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter className="flex justify-end space-x-3 p-4 bg-muted/30 border-t rounded-b-xl">
                <Button variant="outline" className="rounded-lg" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5" onClick={handleSaveProduct}><Save className="h-4 w-4 mr-2" />Save Product</Button>
            </DialogFooter>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}