"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSettings, updateSettings, type SiteSettings } from "@/lib/actions/settings"
import { SingleImageUpload } from "./SingleImageUpload" // Import the new component
import { Save, Loader2, Upload, Phone, Facebook, Instagram, Linkedin, Building } from "lucide-react"
import { toast } from "sonner"

export function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>({
    logo: { main: "", footer: "", admin: "", background: "" },
    contact: { phone1: "", phone2: "", email1: "", email2: "", whatsapp: "" },
    social: { facebook: "", instagram: "", linkedin: "" },
    company: { name: "", description: "", address: "" }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getSettings()
        if (result.success && result.data) {
          setSettings(result.data)
        } else {
          setError(result.error || "Failed to fetch settings")
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const result = await updateSettings(settings)
      if (result.success) {
        toast.success("Settings saved successfully!")
        
        // Update local storage and notify other components
        localStorage.setItem("siteSettings", JSON.stringify(settings));
        window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: settings }));

      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      toast.error(`Error saving settings: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (section: keyof SiteSettings, field: string, value: string | null) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value || "",
      },
    }))
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-destructive bg-card border border-dashed rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Site Settings</h1>
          <p className="text-muted-foreground">Configure your website settings and branding</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
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
                <Textarea
                  id="description"
                  value={settings.company.description}
                  onChange={(e) => updateSetting("company", "description", e.target.value)}
                  placeholder="Premium marble and granite solutions..."
                  rows={4}
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
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 mt-6">
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
        </TabsContent>

        <TabsContent value="social" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-muted-foreground" />
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
                <Instagram className="h-5 w-5 text-muted-foreground" />
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
                <Linkedin className="h-5 w-5 text-muted-foreground" />
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Logo Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Main Navigation Logo</Label>
                  <SingleImageUpload
                    value={settings.logo.main}
                    onChange={(url) => updateSetting("logo", "main", url)}
                    disabled={saving}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Footer Logo</Label>
                  <SingleImageUpload
                    value={settings.logo.footer}
                    onChange={(url) => updateSetting("logo", "footer", url)}
                    disabled={saving}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Admin Panel Logo</Label>
                  <SingleImageUpload
                    value={settings.logo.admin}
                    onChange={(url) => updateSetting("logo", "admin", url)}
                    disabled={saving}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Admin Background Image</Label>
                  <SingleImageUpload
                    value={settings.logo.background}
                    onChange={(url) => updateSetting("logo", "background", url)}
                    disabled={saving}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}