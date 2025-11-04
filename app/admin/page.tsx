"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Eye, Plus, Package, FolderOpen, Target, ShieldCheck, BarChart3, FileText, Users, MessageSquare } from "lucide-react"
import { PageTransition } from "@/components/ui/page-transition"
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
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigationGroups = [
    {
      title: "Dashboard & Analytics",
      items: [
        { id: "dashboard", label: "Overview", icon: BarChart3 },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
      ]
    },
    {
      title: "Content Management",
      items: [
        { id: "products", label: "Products", icon: Package },
        { id: "projects", label: "Projects", icon: FolderOpen },
        { id: "legal", label: "Legal Pages", icon: FileText },
      ]
    },
    {
      title: "User Management",
      items: [
        { id: "contacts", label: "Contacts", icon: Users },
        { id: "users", label: "Users", icon: ShieldCheck },
        { id: "tracking", label: "Tracking", icon: Eye },
        { id: "leads", label: "Leads", icon: MessageSquare },
      ]
    },
    {
      title: "Marketing",
      items: [
        { id: "pixels", label: "Pixels", icon: Target },
      ]
    },
    {
      title: "System",
      items: [
        { id: "settings", label: "Settings", icon: Settings },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background admin-panel">
      <AdminNavigation onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className={`admin-sidebar w-full lg:w-64 bg-card/95 backdrop-blur-sm text-card-foreground border-r border-accent/30 p-4 lg:p-6 shadow-lg admin-card ${sidebarOpen ? 'open' : ''}`}>
          <div className="space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  {group.title}
                </h3>
                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "luxury" : "ghost"}
                        className={`flex-shrink-0 lg:w-full justify-start whitespace-nowrap admin-focus ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/10 hover:text-accent"
                        }`}
                        onClick={() => {
                          setActiveTab(item.id)
                          setSidebarOpen(false)
                        }}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {activeTab === "dashboard" && (
            <PageTransition>
              <div className="space-y-6 lg:space-y-8">
                <div>
                  <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Welcome back to your Top Modern admin panel
                  </p>
                </div>
                <AdminStats />
              </div>
            </PageTransition>
          )}

          {activeTab === "contacts" && (
            <PageTransition>
              <div className="space-y-4 lg:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-2">Contact Management</h1>
                    <p className="text-muted-foreground text-sm lg:text-base">Manage and track all customer inquiries</p>
                  </div>
                  <Button variant="luxury" className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Contact
                  </Button>
                </div>
                <ContactsTable />
              </div>
            </PageTransition>
          )}
          {activeTab === "users" && (
            <PageTransition>
              <div className="space-y-6">
                <UsersManager />
              </div>
            </PageTransition>
          )}

          {activeTab === "tracking" && (
            <PageTransition>
              <div className="space-y-6">
                <ContactTrackingViewer />
              </div>
            </PageTransition>
          )}

          {activeTab === "products" && (
            <PageTransition>
              <div className="space-y-6">
                <ProductsManager />
              </div>
            </PageTransition>
          )}

          {activeTab === "projects" && (
            <PageTransition>
              <div className="space-y-6">
                <ProjectsManager />
              </div>
            </PageTransition>
          )}

          {activeTab === "leads" && (
            <PageTransition>
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Leads</h1>
                  <p className="text-muted-foreground">Every submitted form flows into the lead inbox</p>
                </div>
                <LeadsManager />
              </div>
            </PageTransition>
          )}

          {activeTab === "legal" && (
            <PageTransition>
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Legal Pages</h1>
                  <p className="text-muted-foreground">Manage privacy policy and terms of service</p>
                </div>
                <LegalPagesManager />
              </div>
            </PageTransition>
          )}

          {activeTab === "analytics" && (
            <PageTransition>
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Analytics</h1>
                  <p className="text-muted-foreground">Track website performance and user engagement</p>
                </div>
                <AnalyticsDashboard />
              </div>
            </PageTransition>
          )}

          {activeTab === "pixels" && (
            <PageTransition>
              <div className="space-y-6">
                <PixelManager />
              </div>
            </PageTransition>
          )}

          {activeTab === "settings" && (
            <PageTransition>
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Settings</h1>
                  <p className="text-muted-foreground">Configure your admin preferences</p>
                </div>
                <SettingsManager />
              </div>
            </PageTransition>
          )}
        </div>
      </div>
    </div>
  )
}
