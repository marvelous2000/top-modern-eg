import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import DashboardLayout from './dashboard-layout';
import AdminThemeWrapper from '@/components/admin/AdminThemeWrapper';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeWrapper>
      <SupabaseProvider>
        <div className="admin-panel">
          <DashboardLayout>{children}</DashboardLayout>
        </div>
      </SupabaseProvider>
    </AdminThemeWrapper>
  );
}
