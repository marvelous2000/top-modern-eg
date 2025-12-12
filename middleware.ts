import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const runtime = 'nodejs';

// Internationalization Middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' 
});

// Authentication and Authorization Middleware
async function authMiddleware(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // The `set` method here is a stub for server-side operations.
          // The actual cookie setting is handled by the browser.
        },
        remove(name: string, options: CookieOptions) {
          // The `remove` method is also a stub for server-side.
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();

  const url = req.nextUrl.clone();

  // --- Admin Route Protection ---
  if (url.pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect to login if trying to access any admin page without a session
      if (url.pathname !== '/admin/login') {
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } else {
      // If there's a session, handle roles and redirects
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        const userRole = profile?.role;
        const allowedRoles = ['admin', 'super_admin'];

        if (!allowedRoles.includes(userRole)) {
          url.pathname = '/admin/login';
          url.searchParams.set('error', 'unauthorized');
          return NextResponse.redirect(url);
        }
      }

      // If logged in, don't let them see the login page again
      if (url.pathname === '/admin/login') {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}


export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const authResponse = await authMiddleware(request);
  if (authResponse.status !== 200) {
    return authResponse;
  }
  
  const i18nResponse = intlMiddleware(request);
  
  return i18nResponse;
}


export const config = {
  // Exclude /_next/ (Next.js internals), /api/ (API routes),
  // files with an extension (e.g., .js, .css, .png), and /admin paths.
  matcher: ['/((?!_next|api|.*\\..*|admin).*)'],
};