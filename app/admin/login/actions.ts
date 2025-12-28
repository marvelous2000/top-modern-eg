
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseServiceRoleClient } from '@/lib/supabase/service-role'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    redirect('/admin/login?error=invalid_credentials')
  }

  if (data.session) {
    // Use a service role client to bypass RLS for this internal check
    const supabaseService = createSupabaseServiceRoleClient()

    let { data: profile, error: profileError } = await supabaseService
      .from('profiles')
      .select('role, status')
      .eq('id', data.session.user.id)
      .single()

    // If profile doesn't exist, create a basic user profile
    if (profileError || !profile) {
      console.log('Profile not found, creating basic user profile...')
      const { error: createError } = await supabaseService
        .from('profiles')
        .insert({
          id: data.session.user.id,
          email: data.session.user.email,
          username: data.session.user.email,
          role: 'user', // Default to user role, admin should be set manually in DB
          status: 'active',
          first_name: null,
          last_name: null,
          avatar: null,
          bio: null,
          phone: null,
          location: null,
          website: null,
          social_links: {},
          preferences: {},
          last_active: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (createError) {
        console.error('Error creating profile:', createError)
        await supabase.auth.signOut()
        redirect('/admin/login?error=profile_creation_failed')
      }

      // Fetch the newly created profile
      const { data: newProfile, error: newProfileError } = await supabaseService
        .from('profiles')
        .select('role, status')
        .eq('id', data.session.user.id)
        .single()

      if (newProfileError) {
        console.error('Error fetching new profile:', newProfileError)
        await supabase.auth.signOut()
        redirect('/admin/login?error=profile_fetch_failed')
      }

      profile = newProfile
    }

    // Check if user has admin privileges
    const allowedRoles = ['admin', 'super_admin']
    if (!profile || !allowedRoles.includes(profile.role) || profile.status !== 'active') {
      console.log('User does not have admin privileges:', profile)
      if (profile && profile.role === 'user') {
        // If the user has a 'user' role, it means they were just created but not granted admin access
        await supabase.auth.signOut()
        redirect('/admin/login?error=unauthorized_user_role')
      }
      await supabase.auth.signOut()
      redirect('/admin/login?error=unauthorized')
    }

    // Redirect to admin dashboard
    redirect('/admin')
  }

  redirect('/admin/login?error=login_failed')
}


export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function doesUserExist(email: string): Promise<boolean> {
  const supabaseService = createSupabaseServiceRoleClient();
  const { data: user, error } = await supabaseService
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (error || !user) {
    return false;
  }

  const { data: profile, error: profileError } = await supabaseService
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return false;
  }

  const allowedRoles = ['admin', 'super_admin'];
  return allowedRoles.includes(profile.role);
}
