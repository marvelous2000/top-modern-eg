'use client';

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { AdminStats } from "@/components/admin/admin-stats";
import { ContactsTable } from "@/components/admin/contacts-table";
import { LegalPagesManager } from "@/components/admin/legal-pages-manager";
import { ContactTrackingViewer } from "@/components/admin/contact-tracking-viewer";
import { ProductsManager } from "@/components/admin/products-manager-updated";
import { ProjectsManager } from "@/components/admin/projects-manager-updated";
import { UsersManager } from "@/components/admin/users-manager-updated";
import { PixelManager } from "@/components/admin/pixel-manager-updated";
import { LeadsManager } from "@/components/admin/leads-manager-updated";
import { SettingsManager } from "@/components/admin/settings-manager-updated";
import { DatabaseSetupManager } from "@/components/admin/database-setup-manager";
import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { SupportPage } from "@/components/admin/support-page";

// A simple component for the default dashboard view
function DashboardView() {
  return <DashboardOverview />;
}

export default function AdminPageContentWrapper() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const renderContent = () => {
    switch (page) {
      case "leads":
        return <LeadsManager />;
      case "users":
        return <UsersManager />;
      case "analytics":
        return <ContactTrackingViewer />;
      case "contacts":
        return <ContactsTable />;
      case "products":
        return <ProductsManager />;
      case "projects":
        return <ProjectsManager />;
      case "legal":
        return <LegalPagesManager />;
      case "pixels":
        return <PixelManager />;
      case "settings":
        return <SettingsManager />;
      case "setup":
        return <DatabaseSetupManager />;
      case "support":
        return <SupportPage />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Suspense fallback={<div>Loading admin content...</div>}>
      {renderContent()}
    </Suspense>
  );
}