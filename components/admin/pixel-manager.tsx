"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, X, Save, Search, Loader2, Code, ToggleLeft, ToggleRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PixelConfig {
  id: string
  name: string
  type: "facebook" | "google_analytics" | "google_ads" | "linkedin" | "twitter" | "tiktok" | "custom"
  pixelId: string
  code: string
  status: "active" | "inactive"
  pages: string[]
  events: string[]
  createdAt: string
  updatedAt: string
}

const samplePixels: PixelConfig[] = [
  { id: "1", name: "Facebook Pixel", type: "facebook", pixelId: "1234567890123456", code: `...`, status: "active", pages: ["all"], events: ["PageView", "Lead", "Contact"], createdAt: "2024-01-15", updatedAt: "2024-01-20" },
  { id: "2", name: "Google Analytics 4", type: "google_analytics", pixelId: "G-XXXXXXXXXX", code: `...`, status: "active", pages: ["all"], events: ["page_view"], createdAt: "2024-01-10", updatedAt: "2024-01-18" },
]

const generatePixelCode = (type: PixelConfig["type"], pixelId: string) => {
    switch (type) {
      case "facebook": return `!function(f,b,e,v,n,t,s){...fbq('init', '${pixelId}');...}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');`;
      case "google_analytics": return `<script async src="https://www.googletagmanager.com/gtag/js?id=${pixelId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${pixelId}');</script>`;
      case "google_ads": return `<script async src="https://www.googletagmanager.com/gtag/js?id=${pixelId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${pixelId}');</script>`;
      default: return `<!-- Custom Pixel Code for ${pixelId} -->`;
    }
};

export function PixelManager() {
  const [pixels, setPixels] = useState<PixelConfig[]>(samplePixels.map(p => ({...p, code: generatePixelCode(p.type, p.pixelId)})))
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPixel, setEditingPixel] = useState<Partial<PixelConfig> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredPixels = useMemo(() => {
    return pixels.filter(p =>
      (filterType === "all" || p.type === filterType) &&
      (filterStatus === "all" || p.status === filterStatus) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.pixelId.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [pixels, searchTerm, filterType, filterStatus])

  const handleOpenForm = (pixel: Partial<PixelConfig> | null = null) => {
    if (pixel) {
      setEditingPixel(pixel)
    } else {
      setEditingPixel({ name: "", type: "custom", pixelId: "", code: "", status: "inactive", pages: ["all"], events: [], createdAt: new Date().toISOString().split("T")[0] })
    }
    setIsFormOpen(true)
  }

  const handleSavePixel = () => {
    if (!editingPixel) return
    const isNew = !editingPixel.id
    const pixelToSave = { ...editingPixel, id: editingPixel.id || Date.now().toString(), updatedAt: new Date().toISOString().split("T")[0] } as PixelConfig

    if (isNew) {
      setPixels([pixelToSave, ...pixels])
    } else {
      setPixels(pixels.map(p => p.id === pixelToSave.id ? pixelToSave : p))
    }
    setIsFormOpen(false)
    setEditingPixel(null)
  }

  const handleDeletePixel = (pixelId: string) => {
    if (confirm("Are you sure you want to delete this pixel?")) {
      setPixels(pixels.filter(p => p.id !== pixelId))
    }
  }

  const togglePixelStatus = (pixelId: string) => {
    setPixels(pixels.map(p => p.id === pixelId ? { ...p, status: p.status === "active" ? "inactive" : "active", updatedAt: new Date().toISOString().split("T")[0] } : p))
  }

  const statusConfig: { [key: string]: string } = {
    active: "bg-green-500/20 text-green-500",
    inactive: "bg-red-500/20 text-red-500",
  }

  const typeConfig: { [key: string]: string } = {
    facebook: "bg-blue-600/20 text-blue-500",
    google_analytics: "bg-orange-500/20 text-orange-500",
    google_ads: "bg-yellow-500/20 text-yellow-500",
    linkedin: "bg-sky-500/20 text-sky-500",
    custom: "bg-gray-500/20 text-gray-500",
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><CardTitle className="text-2xl font-bold">Pixel Manager</CardTitle><p className="text-sm text-muted-foreground">Manage all tracking pixels and scripts.</p></div>
          <Button onClick={() => handleOpenForm()} className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5"><Plus className="h-4 w-4 mr-2" />Add New Pixel</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2 md:col-span-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search pixels..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 rounded-lg w-full" /></div>
          <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="rounded-lg"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="facebook">Facebook</SelectItem><SelectItem value="google_analytics">Google Analytics</SelectItem><SelectItem value="google_ads">Google Ads</SelectItem><SelectItem value="linkedin">LinkedIn</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="rounded-lg"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select>
          <div className="text-sm text-muted-foreground flex items-center justify-end">{filteredPixels.length} pixels</div>
        </CardContent>
      </Card>

      {filteredPixels.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground bg-card border border-dashed rounded-lg">No pixels found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPixels.map((pixel) => (
            <Card key={pixel.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg truncate group-hover:text-accent">{pixel.name}</CardTitle>
                <p className="text-sm text-muted-foreground">ID: {pixel.pixelId}</p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={cn("capitalize text-xs rounded-md", statusConfig[pixel.status])}>{pixel.status}</Badge>
                  <Badge className={cn("capitalize text-xs rounded-md", typeConfig[pixel.type])}>{pixel.type.replace(/_/g, " ")}</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 flex-grow">
                  <p>Pages: {pixel.pages.join(", ")}</p>
                  <p>Events: {pixel.events.length > 0 ? pixel.events.join(", ") : "None"}</p>
                </div>
                <div className="flex gap-2 pt-4 mt-4 border-t">
                  <Button size="sm" variant="outline" className="w-full rounded-md" onClick={() => togglePixelStatus(pixel.id)}>
                    {pixel.status === 'active' ? <ToggleLeft className="h-4 w-4 mr-2" /> : <ToggleRight className="h-4 w-4 mr-2" />}
                    {pixel.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="outline" className="w-full rounded-md" onClick={() => handleOpenForm(pixel)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
                  <Button size="sm" variant="destructive" className="w-full rounded-md" onClick={() => handleDeletePixel(pixel.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-xl animate-fade-in-slide-down">
          <DialogHeader className="p-6 bg-accent text-accent-foreground text-center relative rounded-t-xl">
            <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"><Code className="w-6 h-6" /></div>
                <div>
                    <DialogTitle className="text-2xl font-bold">{editingPixel?.id ? "Edit Pixel" : "Create New Pixel"}</DialogTitle>
                    <DialogDescription className="text-accent-foreground/80">Manage tracking script details below.</DialogDescription>
                </div>
            </div>
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"><X className="h-6 w-6" /><span className="sr-only">Close</span></DialogClose>
          </DialogHeader>
          {editingPixel && <>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label className="font-semibold">Pixel Name</Label><Input className="rounded-lg" value={editingPixel.name} onChange={(e) => setEditingPixel({ ...editingPixel, name: e.target.value })} placeholder="e.g., Main Facebook Pixel" /></div>
                <div className="space-y-2"><Label className="font-semibold">Pixel ID</Label><Input className="rounded-lg" value={editingPixel.pixelId} onChange={(e) => setEditingPixel({ ...editingPixel, pixelId: e.target.value, code: generatePixelCode(editingPixel.type as any, e.target.value) })} placeholder="e.g., 1234567890" /></div>
                <div className="space-y-2"><Label className="font-semibold">Pixel Type</Label><Select value={editingPixel.type} onValueChange={(v) => setEditingPixel({ ...editingPixel, type: v as any, code: generatePixelCode(v as any, editingPixel.pixelId || "") })}><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="facebook">Facebook</SelectItem><SelectItem value="google_analytics">Google Analytics</SelectItem><SelectItem value="google_ads">Google Ads</SelectItem><SelectItem value="linkedin">LinkedIn</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label className="font-semibold">Status</Label><Select value={editingPixel.status} onValueChange={(v) => setEditingPixel({ ...editingPixel, status: v as any })}><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="active">Active</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label className="font-semibold">Pages (comma-separated)</Label><Input className="rounded-lg" value={editingPixel.pages?.join(", ")} onChange={(e) => setEditingPixel({ ...editingPixel, pages: e.target.value.split(",").map(s => s.trim()) })} placeholder="all, /contact, /products" /></div>
              <div className="space-y-2"><Label className="font-semibold">Events (comma-separated)</Label><Input className="rounded-lg" value={editingPixel.events?.join(", ")} onChange={(e) => setEditingPixel({ ...editingPixel, events: e.target.value.split(",").map(s => s.trim()) })} placeholder="PageView, Lead, AddToCart" /></div>
              <div className="space-y-2"><Label className="font-semibold">Pixel Code</Label><Textarea value={editingPixel.code} onChange={(e) => setEditingPixel({ ...editingPixel, code: e.target.value })} className="min-h-[200px] rounded-lg font-mono text-sm" /></div>
            </div>
            <DialogFooter className="flex justify-end space-x-3 p-4 bg-muted/30 border-t rounded-b-xl">
                <Button variant="outline" className="rounded-lg" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button className="rounded-lg transition-transform duration-200 hover:-translate-y-0.5" onClick={handleSavePixel}><Save className="h-4 w-4 mr-2" />Save Pixel</Button>
            </DialogFooter>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
