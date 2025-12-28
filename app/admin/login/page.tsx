import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { login } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
// Note: Admin styles are imported in the parent layout

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Check if user is already authenticated
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If already authenticated, check profile and redirect if authorized
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    if (!profileError && profile && ['admin', 'super_admin'].includes(profile.role) && profile.status === 'active') {
      redirect('/admin');
    }
  }

  const t = await getTranslations('auth');
  let errorMessage = '';
  
  // Handle error messages from search parameters
  if (searchParams?.error === 'invalid_credentials') {
    errorMessage = 'Invalid email or password. Please try again.';
  } else if (searchParams?.error === 'session_expired') {
    errorMessage = 'Your session has expired. Please sign in again.';
  } else if (searchParams?.error === 'unauthorized') {
    errorMessage = 'Access denied. Admin privileges required.';
  } else if (searchParams?.error === 'insufficient_privileges') {
    errorMessage = 'Insufficient privileges. Contact administrator.';
  } else if (searchParams?.error === 'profile_not_found') {
    errorMessage = 'Profile not found. Contact administrator.';
  } else if (searchParams?.error === 'account_inactive') {
    errorMessage = 'Account is inactive. Contact administrator.';
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/adminbackground.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/80" /> {/* Dark overlay */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-slate-800/90 backdrop-blur-sm border border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/top-modern-final-logo.png"
                alt="Top Modern Logo"
                width={120}
                height={40}
                className="h-auto w-auto max-w-[120px]"
              />
            </div>
            <CardTitle className="text-2xl font-serif text-white">
              {t('admin_login_title', { defaultValue: 'Admin Login' })}
            </CardTitle>
            <CardDescription className="text-white/80">
              {t('admin_login_subtitle', { defaultValue: 'Sign in to access the admin dashboard' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={login} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">
                  {t('email_label', { defaultValue: 'Email' })}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('email_placeholder', { defaultValue: 'admin@example.com' })}
                  required
                  className="bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/90">
                    {t('password_label', { defaultValue: 'Password' })}
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-accent hover:underline"
                  >
                    {t('forgot_password_link', { defaultValue: 'Forgot password?' })}
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('password_placeholder', { defaultValue: '••••••••' })}
                  required
                  className="bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent/20"
                />
              </div>
              {errorMessage && (
                <div className="text-destructive text-sm">{errorMessage}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
              >
                {t('sign_in_button', { defaultValue: 'Sign In' })}
              </Button>
            </form>
            <p className="text-center text-sm text-white/70 mt-6">
              {t('admin_only_message', { defaultValue: 'Admin access only' })}{' '}
              <Link 
                href="/" 
                className="text-accent hover:underline"
              >
                {t('return_home_link', { defaultValue: 'Return to homepage' })}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}