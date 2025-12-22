
'use server';

import createSupabaseServerClient from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  if (data.user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return {
        message: 'No profile found. Please contact an administrator.',
      };
    }

    const allowedRoles = ['admin', 'super_admin'];
    if (!allowedRoles.includes(profile.role)) {
      await supabase.auth.signOut();
      return {
        message: 'You do not have permission to access the admin panel.',
      };
    }
  }

  // Revalidate the admin route and root to ensure fresh server-side rendering
  try {
    revalidatePath('/');
    revalidatePath('/admin');
  } catch (err) {
    // If revalidation fails (edge cases), log the error but proceed with redirect
    console.error('Failed to revalidate:', err);
  }
  redirect('/admin');
}


export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function doesUserExist(email: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (error || !user) {
    return false;
  }

  const { data: profile, error: profileError } = await supabase
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
