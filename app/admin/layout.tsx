import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ReactNode } from 'react'
import DashboardLayout from './dashboard-layout'

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get the authenticated user
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      // No valid session, redirect to login
      redirect('/admin/login')
    }

    // Fetch the user's profile to check admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    // If profile doesn't exist or user doesn't have admin role, redirect to login
    if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role) || profile.status !== 'active') {
      console.log('[AdminLayout] Unauthorized access attempt:', {
        userId: user.id,
        profileExists: !!profile,
        role: profile?.role,
        status: profile?.status
      })
      redirect('/admin/login?error=unauthorized')
    }

    // User is authenticated and has admin role, render the children within the dashboard layout
    return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
    )
  } catch (error) {
    console.error('[AdminLayout] Authentication error:', error)
    // On any error, redirect to login to prevent white page
    redirect('/admin/login?error=auth_error')
  }
}
