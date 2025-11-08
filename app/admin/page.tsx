"use client"

import { useSearchParams } from "next/navigation"

// Import all the components that will be displayed on the admin pages
import { AdminStats } from "@/components/admin/admin-stats"
import { ContactsTable } from "@/components/admin/contacts-table"
import { LegalPagesManager } from "@/components/admin/legal-pages-manager"
import { ContactTrackingViewer } from "@/components/admin/contact-tracking-viewer"
import { ProductsManager } from "@/components/admin/products-manager"
import { ProjectsManager } from "@/components/admin/projects-manager"
import { UsersManager } from "@/components/admin/users-manager"
import { PixelManager } from "@/components/admin/pixel-manager"
import { LeadsManager } from "@/components/admin/leads-manager"
import { SettingsManager } from "@/components/admin/settings-manager"

// A simple component for the default dashboard view
function DashboardView() {
  return (
    <div className="space-y-6">
      <AdminStats />
      {/* We can add more dashboard-specific components here in the future */}
    </div>
  )
}

export default function AdminPage() {
  const searchParams = useSearchParams()
  const page = searchParams.get("page")

  // This function determines which component to render based on the 'page' URL query parameter
  const renderContent = () => {
    switch (page) {
      case "leads":
        return <LeadsManager />
      case "users":
        return <UsersManager />
      case "analytics":
        return <ContactTrackingViewer />
      case "contacts":
        return <ContactsTable />
      case "products":
        return <ProductsManager />
      case "projects":
        return <ProjectsManager />
      case "legal":
        return <LegalPagesManager />
      case "pixels":
        return <PixelManager />
      case "settings":
        return <SettingsManager />
      // The default case renders the main dashboard overview
      default:
        return <DashboardView />
    }
  }

  return <>{renderContent()}</>
}

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'
