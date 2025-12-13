import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import DashboardLayout from './dashboard-layout';
import AdminThemeWrapper from '@/components/admin/AdminThemeWrapper';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeWrapper>
      <SupabaseProvider>
                  <div className="admin-panel admin-theme">          <DashboardLayout>
            <AdminAuthWrapper>{children}</AdminAuthWrapper>
          </DashboardLayout>
        </div>
      </SupabaseProvider>
    </AdminThemeWrapper>
  );
}
