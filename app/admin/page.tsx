"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, FileText, BarChart3, Settings, Eye, Plus, Package, FolderOpen, Target, ShieldCheck } from "lucide-react"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { AdminStats } from "@/components/admin/admin-stats"
import { ContactsTable } from "@/components/admin/contacts-table"
import { LegalPagesManager } from "@/components/admin/legal-pages-manager"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { ContactTrackingViewer } from "@/components/admin/contact-tracking-viewer"
import { ProductsManager } from "@/components/admin/products-manager"
import { ProjectsManager } from "@/components/admin/projects-manager"
import { UsersManager } from "@/components/admin/users-manager"
import { PixelManager } from "@/components/admin/pixel-manager"
import { LeadsManager } from "@/components/admin/leads-manager"
import { SettingsManager } from "@/components/admin/settings-manager"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-64 bg-card border-r border-border p-4 lg:p-6">
          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </Button>
            <Button
              variant={activeTab === "contacts" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("contacts")}
            >
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("users")}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </Button>
            <Button
              variant={activeTab === "tracking" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("tracking")}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Tracking</span>
            </Button>
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("products")}
            >
              <Package className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </Button>
            <Button
              variant={activeTab === "projects" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("projects")}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </Button>
            <Button
              variant={activeTab === "leads" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("leads")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Leads</span>
            </Button>
            <Button
              variant={activeTab === "legal" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("legal")}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Legal</span>
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            <Button
              variant={activeTab === "pixels" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("pixels")}
            >
              <Target className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Pixels</span>
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
                <p className="text-muted-foreground text-sm lg:text-base">
                  Welcome back to your Top Modern admin panel
                </p>
              </div>
              <AdminStats />
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-2">Contact Management</h1>
                  <p className="text-muted-foreground text-sm lg:text-base">Manage and track all customer inquiries</p>
                </div>
                <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </div>
              <ContactsTable />
            </div>
          )}
          {activeTab === "users" && (
            <div className="space-y-6">
              <UsersManager />
            </div>
          )}

          {activeTab === "tracking" && (
            <div className="space-y-6">
              <ContactTrackingViewer />
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-6">
              <ProductsManager />
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <ProjectsManager />
            </div>
          )}

          {activeTab === "leads" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Leads</h1>
                <p className="text-muted-foreground">Every submitted form flows into the lead inbox</p>
              </div>
              <LeadsManager />
            </div>
          )}

          {activeTab === "legal" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Legal Pages</h1>
                <p className="text-muted-foreground">Manage privacy policy and terms of service</p>
              </div>
              <LegalPagesManager />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Analytics</h1>
                <p className="text-muted-foreground">Track website performance and user engagement</p>
              </div>
              <AnalyticsDashboard />
            </div>
          )}

          {activeTab === "pixels" && (
            <div className="space-y-6">
              <PixelManager />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Settings</h1>
                <p className="text-muted-foreground">Configure your admin preferences</p>
              </div>
              <SettingsManager />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
