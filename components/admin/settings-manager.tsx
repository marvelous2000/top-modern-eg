"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Save, RotateCcw, Facebook, Instagram, Linkedin, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SiteSettings {
  logo: {
    main: string
    footer: string
    admin: string
  }
  contact: {
    phone1: string
    phone2: string
    email1: string
    email2: string
    whatsapp: string
  }
  social: {
    facebook: string
    instagram: string
    linkedin: string
  }
  company: {
    name: string
    description: string
    address: string
  }
}

const defaultSettings: SiteSettings = {
  logo: {
    main: "/top-modern-logo-gold.png",
    footer: "/top-modern-logo-gold.png",
    admin: "/top-modern-logo-gold.png",
  },
  contact: {
    phone1: "+20 123 456 7890",
    phone2: "+971 50 123 4567",
    email1: "info@topmodern.com",
    email2: "sales@topmodern.com",
    whatsapp: "+201234567890",
  },
  social: {
    facebook: "https://facebook.com/topmodern",
    instagram: "https://instagram.com/topmodern",
    linkedin: "https://linkedin.com/company/topmodern",
  },
  company: {
    name: "Top Modern",
    description:
      "Premium marble and granite solutions for luxury real estate, hotels, and restaurants across the MENA region.",
    address: "MENA Region",
  },
}

export function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("siteSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Save to localStorage
      localStorage.setItem("siteSettings", JSON.stringify(settings))

      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: settings }))

      toast({
        title: "Settings Saved",
        description: "Your site settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    })
  }

  const handleLogoUpload = (type: keyof SiteSettings["logo"]) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setSettings((prev) => ({
            ...prev,
            logo: {
              ...prev.logo,
              [type]: result,
            },
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const updateSetting = (section: keyof SiteSettings, field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Site Settings</h1>
          <p className="text-muted-foreground">Configure your website settings and branding</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-primary text-primary-foreground">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Logo Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Logo Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label>Main Navigation Logo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <img
                  src={settings.logo.main || "/placeholder.svg"}
                  alt="Main Logo"
                  className="h-12 w-auto mx-auto mb-2"
                />
                <Button variant="outline" size="sm" onClick={() => handleLogoUpload("main")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Footer Logo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <img
                  src={settings.logo.footer || "/placeholder.svg"}
                  alt="Footer Logo"
                  className="h-12 w-auto mx-auto mb-2"
                />
                <Button variant="outline" size="sm" onClick={() => handleLogoUpload("footer")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Admin Panel Logo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <img
                  src={settings.logo.admin || "/placeholder.svg"}
                  alt="Admin Logo"
                  className="h-12 w-auto mx-auto mb-2"
                />
                <Button variant="outline" size="sm" onClick={() => handleLogoUpload("admin")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone1">Primary Phone</Label>
              <Input
                id="phone1"
                value={settings.contact.phone1}
                onChange={(e) => updateSetting("contact", "phone1", e.target.value)}
                placeholder="+20 123 456 7890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone2">Secondary Phone</Label>
              <Input
                id="phone2"
                value={settings.contact.phone2}
                onChange={(e) => updateSetting("contact", "phone2", e.target.value)}
                placeholder="+971 50 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email1">Primary Email</Label>
              <Input
                id="email1"
                type="email"
                value={settings.contact.email1}
                onChange={(e) => updateSetting("contact", "email1", e.target.value)}
                placeholder="info@topmodern.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email2">Sales Email</Label>
              <Input
                id="email2"
                type="email"
                value={settings.contact.email2}
                onChange={(e) => updateSetting("contact", "email2", e.target.value)}
                placeholder="sales@topmodern.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={settings.contact.whatsapp}
                onChange={(e) => updateSetting("contact", "whatsapp", e.target.value)}
                placeholder="+201234567890"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5" />
            Social Media Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Facebook className="h-5 w-5 text-[#1877F2]" />
              <div className="flex-1">
                <Label htmlFor="facebook">Facebook Page URL</Label>
                <Input
                  id="facebook"
                  value={settings.social.facebook}
                  onChange={(e) => updateSetting("social", "facebook", e.target.value)}
                  placeholder="https://facebook.com/topmodern"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Instagram className="h-5 w-5 text-[#E4405F]" />
              <div className="flex-1">
                <Label htmlFor="instagram">Instagram Profile URL</Label>
                <Input
                  id="instagram"
                  value={settings.social.instagram}
                  onChange={(e) => updateSetting("social", "instagram", e.target.value)}
                  placeholder="https://instagram.com/topmodern"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              <div className="flex-1">
                <Label htmlFor="linkedin">LinkedIn Company URL</Label>
                <Input
                  id="linkedin"
                  value={settings.social.linkedin}
                  onChange={(e) => updateSetting("social", "linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/topmodern"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={settings.company.name}
              onChange={(e) => updateSetting("company", "name", e.target.value)}
              placeholder="Top Modern"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] px-3 py-2 border border-border rounded-md bg-background text-foreground"
              value={settings.company.description}
              onChange={(e) => updateSetting("company", "description", e.target.value)}
              placeholder="Premium marble and granite solutions..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={settings.company.address}
              onChange={(e) => updateSetting("company", "address", e.target.value)}
              placeholder="MENA Region"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

