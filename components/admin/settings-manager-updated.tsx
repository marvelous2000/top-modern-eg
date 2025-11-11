"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSettings, updateSettings, type Settings } from "@/lib/actions/settings"
import { Save, Loader2, Settings as SettingsIcon, Palette, Globe, Mail, Shield, Database } from "lucide-react"
import { cn } from "@/lib/utils"

export function SettingsManager() {
  const [settings, setSettings] = useState<Partial<Settings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getSettings()
        if (result.success) {
          setSettings(result.data as Settings)
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
      const result = await updateSettings(settings as Settings)
      if (result.success) {
        setSettings(result.data as Settings)
        alert("Settings saved successfully!")
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`)
    } finally {
      setSaving(false)
    }
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
    <div className="space-y-6 animate-slide-in">
      <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-serif text-foreground">Settings</CardTitle>
            <p className="text-sm text-muted-foreground">Configure your application settings.</p>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Settings
          </Button>
        </CardHeader>
      </Card>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50">
          <TabsTrigger value="general" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200">
            <Globe className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Site Name</Label>
                <Input
                  value={settings.siteName || ""}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="Your Site Name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Site Description</Label>
                <Input
                  value={settings.siteDescription || ""}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="Brief description of your site"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Contact Email</Label>
                <Input
                  type="email"
                  value={settings.contactEmail || ""}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="contact@yourdomain.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Contact Phone</Label>
                <Input
                  value={settings.contactPhone || ""}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-foreground">Address</Label>
                <Textarea
                  value={settings.address || ""}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="min-h-[80px] bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                  placeholder="Your business address"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Primary Color</Label>
                <Input
                  type="color"
                  value={settings.primaryColor || "#000000"}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Secondary Color</Label>
                <Input
                  type="color"
                  value={settings.secondaryColor || "#ffffff"}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Logo URL</Label>
                <Input
                  value={settings.logoUrl || ""}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Favicon URL</Label>
                <Input
                  value={settings.faviconUrl || ""}
                  onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-foreground">Custom CSS</Label>
                <Textarea
                  value={settings.customCss || ""}
                  onChange={(e) => setSettings({ ...settings, customCss: e.target.value })}
                  className="min-h-[120px] font-mono text-sm bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                  placeholder="Add custom CSS here..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Meta Title</Label>
                <Input
                  value={settings.metaTitle || ""}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="Default page title"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Meta Description</Label>
                <Input
                  value={settings.metaDescription || ""}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="Default page description"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Meta Keywords</Label>
                <Input
                  value={settings.metaKeywords || ""}
                  onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Open Graph Image</Label>
                <Input
                  value={settings.ogImage || ""}
                  onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-foreground">Google Analytics ID</Label>
                <Input
                  value={settings.googleAnalyticsId || ""}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="GA-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 mt-6">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">SMTP Host</Label>
                <Input
                  value={settings.smtpHost || ""}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="smtp.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">SMTP Port</Label>
                <Input
                  type="number"
                  value={settings.smtpPort || ""}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="587"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">SMTP Username</Label>
                <Input
                  value={settings.smtpUsername || ""}
                  onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="your-email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">SMTP Password</Label>
                <Input
                  type="password"
                  value={settings.smtpPassword || ""}
                  onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="Your SMTP password"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-foreground">Email Templates</Label>
                <Textarea
                  value={settings.emailTemplates || ""}
                  onChange={(e) => setSettings({ ...settings, emailTemplates: e.target.value })}
                  className="min-h-[120px] bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                  placeholder="JSON configuration for email templates"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Enable Two-Factor Authentication</Label>
                <Checkbox
                  checked={settings.enable2FA || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, enable2FA: !!checked })}
                  className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout || ""}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Password Policy</Label>
                <Select
                  value={settings.passwordPolicy || "medium"}
                  onValueChange={(value) => setSettings({ ...settings, passwordPolicy: value })}
                >
                  <SelectTrigger className="bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Enable Rate Limiting</Label>
                <Checkbox
                  checked={settings.enableRateLimiting || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableRateLimiting: !!checked })}
                  className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-foreground">Allowed IP Addresses</Label>
                <Textarea
                  value={settings.allowedIPs || ""}
                  onChange={(e) => setSettings({ ...settings, allowedIPs: e.target.value })}
                  className="min-h-[80px] bg-background border-border/50 focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
                  placeholder="192.168.1.0/24, 10.0.0.0/8"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
