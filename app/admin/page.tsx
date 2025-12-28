import AdminPageContentWrapper from "@/components/admin/AdminPageContentWrapper";

// Removed server-side check - middleware now handles authentication
// This prevents double-checking and session refresh issues

export default async function AdminPage() {
  return <AdminPageContentWrapper />;
}