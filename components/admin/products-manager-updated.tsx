"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProducts, createProduct, updateProduct, deleteProduct, type Product } from "@/lib/actions/products"
import { Plus, Edit, Trash2, X, Save, Search, Loader2, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageUpload } from "./ImageUpload"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
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
    return products.filter((p) => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(searchTermLower);
      const descriptionMatch = p.description && p.description.toLowerCase().includes(searchTermLower);
      const nameArMatch = p.name_ar && p.name_ar.toLowerCase().includes(searchTermLower);
      const descriptionArMatch = p.description_ar && p.description_ar.toLowerCase().includes(searchTermLower);
      
      return (filterCategory === "all" || p.category === filterCategory) &&
             (filterStatus === "all" || p.status === filterStatus) &&
             (nameMatch || descriptionMatch || nameArMatch || descriptionArMatch);
    });
  }, [products, searchTerm, filterCategory, filterStatus]);

  const handleOpenForm = (product: Partial<Product> | null = null) => {
    if (product) {
      setEditingProduct(product)
    } else {
      setEditingProduct({
        name: "", name_ar: "", category: "marble", slug: "", description: "", description_ar: "", origin: "", origin_ar: "", finish: "", finish_ar: "Polished", thickness: "20mm", applications: [], applications_ar: [], images: [], specifications: {}, specifications_ar: {}, status: "draft",
      })
    }
    setIsFormOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!editingProduct) return

    setImageUploadLoading(true)
    let imageUrlsToSave = editingProduct.images ? [...editingProduct.images] : [];
    const supabase = createSupabaseBrowserClient();

    try {
      if (newImageFiles.length > 0) {
        for (const file of newImageFiles) {
          const fileExtension = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
          const filePath = `product-images/${fileName}`;

          const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file, { cacheControl: "3600", upsert: false });
          if (uploadError) throw new Error(`Failed to upload image: ${file.name} - ${uploadError.message}`);
          
          const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
          if (publicUrlData && publicUrlData.publicUrl) imageUrlsToSave.push(publicUrlData.publicUrl);
          else throw new Error(`Failed to get public URL for image: ${file.name}`);
        }
      }
      
      const productToSave = { ...editingProduct, images: imageUrlsToSave } as Product;
      
      const result = editingProduct.id
        ? await updateProduct(editingProduct.id, productToSave)
        : await createProduct(productToSave);

      if (result.success) {
        const updatedProducts = editingProduct.id
          ? products.map((p) => (p.id === editingProduct.id ? (result.data as Product) : p))
          : [result.data as Product, ...products];
        setProducts(updatedProducts);
        setIsFormOpen(false);
        setEditingProduct(null);
        setNewImageFiles([]);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message)
      alert(`Error saving product: ${err.message}`)
    } finally {
      setImageUploadLoading(false)
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
    <div className="space-y-6" style={{ fontFamily: "'Segoe UI', sans-serif", animation: "slideIn 0.5s ease-out" }}>
      <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-serif text-foreground">Products</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your material inventory.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => document.body.classList.toggle('dark')} className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent hover:text-gold-600 transition-all duration-200">
              {isClient && document.body.classList.contains('dark') ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={() => handleOpenForm()} className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2 md:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-12 pl-10 px-3 py-2 bg-background border border-border rounded-lg focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full h-12 bg-background border border-border rounded-lg focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Categories</SelectItem><SelectItem value="marble">Marble</SelectItem><SelectItem value="granite">Granite</SelectItem></SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full h-12 bg-background border border-border rounded-lg focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground flex items-center justify-end">{filteredProducts.length} products</div>
        </CardContent>
      </Card>

      {loading ? <div className="h-64 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
       : error ? <div className="h-64 flex flex-col items-center justify-center text-destructive bg-card border border-dashed rounded-lg">{error}</div>
       : filteredProducts.length === 0 ? <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">No products found.</div>
       : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:scale-[1.02] cursor-pointer overflow-hidden group" onClick={() => handleOpenForm(product)}>
              <CardHeader className="p-4">
                <CardTitle className="text-lg truncate group-hover:text-gold-600 transition-colors duration-200">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{product.description}</p>
                <div className="space-y-3 pt-4 mt-4 border-t border-border/50">
                  <div className="flex justify-between items-center">
                    <Badge className={cn("capitalize text-xs", statusConfig[product.status]?.color)}>{product.status}</Badge>
                    <p className="text-xs text-muted-foreground">Origin: {product.origin}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="w-full hover:bg-accent hover:text-gold-600 transition-all duration-200" onClick={(e) => { e.stopPropagation(); handleOpenForm(product)}}><Edit className="h-4 w-4 mr-2" />Edit</Button>
                    <Button size="sm" variant="destructive" className="w-full hover:scale-105 transition-all duration-200" onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id)}}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-primary">{editingProduct?.id ? "Edit Product" : "Create Product"}</h3>
              <Button variant="outline" onClick={() => setIsFormOpen(false)} className="hover:bg-muted transition-all duration-200"><X className="h-4 w-4 mr-2" />Cancel</Button>
            </div>
            {editingProduct && (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }} className="space-y-6">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ar">Arabic</TabsTrigger></TabsList>
                  <TabsContent value="en" className="pt-6">
                    <div className="space-y-4">
                      <div><label className="block text-primary font-semibold mb-2">Product Name *</label><Input value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")})} className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200" placeholder="Enter product name" required/></div>
                      <div><label className="block text-primary font-semibold mb-2">Description *</label><Textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="min-h-[120px] bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none" placeholder="Describe the product" required/></div>
                      <div><label className="block text-primary font-semibold mb-2">Origin</label><Input value={editingProduct.origin} onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })} className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200" placeholder="Country of origin"/></div>
                      <div><label className="block text-primary font-semibold mb-2">Finish</label><Input value={editingProduct.finish} onChange={(e) => setEditingProduct({ ...editingProduct, finish: e.target.value })} className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200" placeholder="e.g., Polished, Honed"/></div>
                    </div>
                  </TabsContent>
                  <TabsContent value="ar" className="pt-6">
                    <div className="space-y-4" dir="rtl">
                      <div><label className="block text-primary font-semibold mb-2">اسم المنتج *</label><Input value={editingProduct.name_ar} onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })} className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200" placeholder="أدخل اسم المنتج"/></div>
                      <div><label className="block text-primary font-semibold mb-2">الوصف *</label><Textarea value={editingProduct.description_ar} onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value })} className="min-h-[120px] bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none" placeholder="صف المنتج"/></div>
                      <div><label className="block text-primary font-semibold mb-2">الأصل</label><Input value={editingProduct.origin_ar} onChange={(e) => setEditingProduct({ ...editingProduct, origin_ar: e.target.value })} className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200" placeholder="بلد المنشأ"/></div>
                      <div><label className="block text-primary font-semibold mb-2">التشطيب</label><Input value={editingProduct.finish_ar} onChange={(e) => setEditingProduct({ ...editingProduct, finish_ar: e.target.value })} className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200" placeholder="مثال: مصقول، شحذ"/></div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                  <div className="space-y-4"><label className="block text-primary font-semibold mb-2">Category *</label><Select value={editingProduct.category} onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v as any })}><SelectTrigger className="w-full bg-background border border-border/50 text-foreground rounded-md px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="marble">Marble</SelectItem><SelectItem value="granite">Granite</SelectItem></SelectContent></Select></div>
                  <div className="space-y-4"><label className="block text-primary font-semibold mb-2">Status *</label><Select value={editingProduct.status} onValueChange={(v) => setEditingProduct({ ...editingProduct, status: v as any })}><SelectTrigger className="w-full bg-background border border-border/50 text-foreground rounded-md px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <label className="block text-primary font-semibold mb-4">Images</label>
                  <ImageUpload initialImages={editingProduct.images} onImagesChange={(newFiles, updatedExistingUrls) => { setNewImageFiles(newFiles); setEditingProduct((prev) => ({ ...prev!, images: updatedExistingUrls, })); }} disabled={imageUploadLoading}/>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl" disabled={imageUploadLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {imageUploadLoading ? "Saving..." : "Save Product"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}