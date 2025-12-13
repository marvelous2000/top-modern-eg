import AdminPageContentWrapper from "@/components/admin/AdminPageContentWrapper";
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Server-side check: ensure the user has an admin session before rendering
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      redirect('/admin/login');
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/admin/login');
    }

    const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', user.id).single();
    const allowedRoles = ['admin', 'super_admin'];
    if (!profile || !allowedRoles.includes(profile.role) || profile.status !== 'active') {
      redirect('/admin/login');
    }
  } catch (err) {
    // If envs are missing or an unexpected error occurred, be conservative
    // and redirect to login (fail-closed). In production missing envs should
    // be fatal, but during development we prefer a redirect to avoid crashing.
    console.error('[admin page] server-side auth check failed:', err);
    redirect('/admin/login');
  }

  return <AdminPageContentWrapper />;
}
