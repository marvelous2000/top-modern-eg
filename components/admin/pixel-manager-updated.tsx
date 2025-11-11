"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, ToggleLeft, ToggleRight, Edit, Trash2, X, Code, Save } from "lucide-react"

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
  {
    id: "1",
    name: "Facebook Pixel",
    type: "facebook",
    pixelId: "1234567890123456",
    code: `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1234567890123456');
fbq('track', 'PageView');
</script>`,
    status: "active",
    pages: ["all"],
    events: ["PageView", "Lead", "Contact"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Google Analytics 4",
    type: "google_analytics",
    pixelId: "G-XXXXXXXXXX",
    code: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`,
    status: "active",
    pages: ["all"],
    events: ["page_view", "contact_form_submit", "phone_click"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
]

export function PixelManager() {
  const [pixels, setPixels] = useState<PixelConfig[]>(samplePixels)
  const [selectedPixel, setSelectedPixel] = useState<PixelConfig | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | PixelConfig["type"]>("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")

  const filteredPixels = pixels.filter((pixel) => {
    const matchesSearch =
      pixel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pixel.pixelId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || pixel.type === filterType
    const matchesStatus = filterStatus === "all" || pixel.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleCreatePixel = () => {
    const newPixel: PixelConfig = {
      id: Date.now().toString(),
      name: "",
      type: "facebook",
      pixelId: "",
      code: "",
      status: "inactive",
      pages: ["all"],
      events: [],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setSelectedPixel(newPixel)
    setIsEditing(true)
  }

  const handleSavePixel = (pixel: PixelConfig) => {
    if (pixels.find((p) => p.id === pixel.id)) {
      setPixels(
        pixels.map((p) => (p.id === pixel.id ? { ...pixel, updatedAt: new Date().toISOString().split("T")[0] } : p)),
      )
    } else {
      setPixels([...pixels, pixel])
    }
    setSelectedPixel(null)
    setIsEditing(false)
  }

  const handleDeletePixel = (pixelId: string) => {
    if (confirm("Are you sure you want to delete this pixel?")) {
      setPixels(pixels.filter((p) => p.id !== pixelId))
      if (selectedPixel?.id === pixelId) {
        setSelectedPixel(null)
        setIsEditing(false)
      }
    }
  }

  const togglePixelStatus = (pixelId: string) => {
    setPixels(
      pixels.map((p) =>
        p.id === pixelId
          ? {
              ...p,
              status: p.status === "active" ? "inactive" : "active",
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : p,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent/20 text-accent"
      case "inactive":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "facebook":
        return "bg-[var(--chart-1)]/20 text-[var(--chart-1)]"
      case "google_analytics":
        return "bg-[var(--chart-2)]/20 text-[var(--chart-2)]"
      case "google_ads":
        return "bg-[var(--chart-3)]/20 text-[var(--chart-3)]"
      case "linkedin":
        return "bg-[var(--chart-4)]/20 text-[var(--chart-4)]"
      case "twitter":
        return "bg-[var(--chart-5)]/20 text-[var(--chart-5)]"
      case "tiktok":
        return "bg-pink-500/20 text-pink-400"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  const generatePixelCode = (type: PixelConfig["type"], pixelId: string) => {
    switch (type) {
      case "facebook":
        return `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>`

      case "google_analytics":
        return `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${pixelId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${pixelId}');
</script>`

      case "google_ads":
        return `<!-- Google Ads Conversion Tracking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${pixelId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${pixelId}');
</script>`

      default:
        return `<!-- Custom Pixel Code -->
<script>
  // Add your custom tracking code here
  // Pixel ID: ${pixelId}
</script>`
    }
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-3xl font-bold text-primary">Pixel Manager</h2>
        <Button
          onClick={handleCreatePixel}
          className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Pixel
        </Button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4">
        <Input
          placeholder="Search pixels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background/50 border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="w-full bg-background/50 border border-border/50 text-foreground rounded-md px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
        >
          <option value="all">All Types</option>
          <option value="facebook">Facebook</option>
          <option value="google_analytics">Google Analytics</option>
          <option value="google_ads">Google Ads</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter</option>
          <option value="tiktok">TikTok</option>
          <option value="custom">Custom</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="w-full bg-background/50 border border-border/50 text-foreground rounded-md px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="text-muted-foreground flex items-center">{filteredPixels.length} pixels found</div>
      </div>

      {/* Pixels Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredPixels.map((pixel) => (
          <div
            key={pixel.id}
            className="border border-border/50 rounded-lg p-6 space-y-4 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-playfair text-xl font-bold text-foreground mb-2">{pixel.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">ID: {pixel.pixelId}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`${getStatusColor(pixel.status)} border-0`}>{pixel.status}</Badge>
                  <Badge className={`${getTypeColor(pixel.type)} border-0`}>{pixel.type.replace("_", " ")}</Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Pages: {pixel.pages.join(", ")}</p>
                  <p>Events: {pixel.events.length} configured</p>
                  <p>Updated: {pixel.updatedAt}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => togglePixelStatus(pixel.id)}
                className={`${pixel.status === "active" ? "bg-destructive text-destructive-foreground hover:bg-destructive/80" : "bg-accent text-accent-foreground hover:bg-accent/80"} hover:scale-105 transition-all duration-200`}
              >
                {pixel.status === "active" ? <ToggleLeft className="h-4 w-4 mr-2" /> : <ToggleRight className="h-4 w-4 mr-2" />}
                {pixel.status === "active" ? "Deactivate" : "Activate"}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedPixel(pixel)
                  setIsEditing(true)
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/80 flex-1 hover:scale-105 transition-all duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeletePixel(pixel.id)}
                className="border-destructive text-destructive-foreground hover:bg-destructive/20 hover:scale-105 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredPixels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No pixels found matching your criteria.</p>
        </div>
      )}

      {/* Pixel Editor Modal */}
      {isEditing && selectedPixel && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-primary">
                {selectedPixel.id ? "Edit Pixel" : "Create Pixel"}
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPixel(null)
                  setIsEditing(false)
                }}
                className="hover:bg-muted transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-primary font-semibold mb-2">Pixel Name *</label>
                  <Input
                    value={selectedPixel.name}
                    onChange={(e) =>
                      setSelectedPixel({
                        ...selectedPixel,
                        name: e.target.value,
                      })
                    }
                    className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                    placeholder="Enter pixel name"
                  />
                </div>

                <div>
                  <label className="block text-primary font-semibold mb-2">Pixel Type *</label>
                  <select
                    value={selectedPixel.type}
                    onChange={(e) => {
                      const newType = e.target.value as PixelConfig["type"]
                      setSelectedPixel({
                        ...selectedPixel,
                        type: newType,
                        code: generatePixelCode(newType, selectedPixel.pixelId),
                      })
                    }}
                    className="w-full bg-background border border-border/50 text-foreground rounded-md px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  >
                    <option value="facebook">Facebook Pixel</option>
                    <option value="google_analytics">Google Analytics</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="linkedin">LinkedIn Insight Tag</option>
                    <option value="twitter">Twitter Pixel</option>
                    <option value="tiktok">TikTok Pixel</option>
                    <option value="custom">Custom Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-primary font-semibold mb-2">Pixel ID *</label>
                  <Input
                    value={selectedPixel.pixelId}
                    onChange={(e) => {
                      const newPixelId = e.target.value
                      setSelectedPixel({
                        ...selectedPixel,
                        pixelId: newPixelId,
                        code: generatePixelCode(selectedPixel.type, newPixelId),
                      })
                    }}
                    className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                    placeholder="Enter pixel ID"
                  />
                </div>

                <div>
                  <label className="block text-primary font-semibold mb-2">Status *</label>
                  <select
                    value={selectedPixel.status}
                    onChange={(e) =>
                      setSelectedPixel({
                        ...selectedPixel,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                    className="w-full bg-background border border-border/50 text-foreground rounded-md px-3 py-2 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  >
                    <option value="inactive">Inactive</option>
                    <option value="active">Active</option>
                  </select>
                </div>

                <div>
                  <label className="block text-primary font-semibold mb-2">Pages (comma-separated)</label>
                  <Input
                    value={selectedPixel.pages.join(", ")}
                    onChange={(e) =>
                      setSelectedPixel({
                        ...selectedPixel,
                        pages: e.target.value
                          .split(",")
                          .map((page) => page.trim())
                          .filter(Boolean),
                      })
                    }
                    className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                    placeholder="all, /contact, /products"
                  />
                </div>

                <div>
                  <label className="block text-primary font-semibold mb-2">Events (comma-separated)</label>
                  <Input
                    value={selectedPixel.events.join(", ")}
                    onChange={(e) =>
                      setSelectedPixel({
                        ...selectedPixel,
                        events: e.target.value
                          .split(",")
                          .map((event) => event.trim())
                          .filter(Boolean),
                      })
                    }
                    className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                    placeholder="PageView, Lead, Contact"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-primary font-semibold mb-2">Pixel Code</label>
                  <Textarea
                    value={selectedPixel.code}
                    onChange={(e) =>
                      setSelectedPixel({
                        ...selectedPixel,
                        code: e.target.value,
                      })
                    }
                    className="min-h-[400px] font-mono text-sm bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                    placeholder="Pixel tracking code will appear here"
                  />
                </div>

                <Button
                  onClick={() =>
                    setSelectedPixel({
                      ...selectedPixel,
                      code: generatePixelCode(selectedPixel.type, selectedPixel.pixelId),
                    })
                  }
                  className="w-full bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-200"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Generate Code
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={() => handleSavePixel(selectedPixel)}
                className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Pixel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
