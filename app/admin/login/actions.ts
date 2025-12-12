
'use server';

import createSupabaseServerClient from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
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

  revalidatePath('/', 'layout');
  redirect('/admin');
}

export async function googleLogin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return redirect('/admin/login?error=Could not authenticate with Google');
  }

  return redirect(data.url);
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
