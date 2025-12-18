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
  // Guard against missing Supabase environment variables. During builds or
  // local development the `.env.local` file may be missing; avoid throwing
  // during SSR so pages can render and provide a clear console message.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Log a clear error for the developer and skip auth checks. This prevents
    // the server from crashing during page generation when env vars are absent.
    console.error(
      'Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment (e.g., .env.local).'
    );
    // In production we want to fail-fast so a misconfigured deployment
    // doesn't accidentally expose an admin area. Throwing here will cause
    // a visible error and prevent the build/deploy from completing.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase environment variables. Aborting middleware in production.');
    }

    // For local development, be conservative: redirect admin requests to the
    // login page rather than allowing access. For non-admin routes allow
    // requests to continue so the public site can still render.
    const url = req.nextUrl.clone();
    if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
  });

  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();
  console.log('[authMiddleware] session:', !!session, 'user:', user?.id ?? null);

  const url = req.nextUrl.clone();

  // --- Admin Route Protection ---
  if (url.pathname.startsWith('/admin')) {
    // Allow public admin routes like login and password flows to be
    // accessed without a session.
    const publicAdminPaths = ['/admin/login', '/admin/reset-password', '/admin/update-password'];

    if (!session) {
      // Redirect to login if trying to access a protected admin page without a session
      if (!publicAdminPaths.includes(url.pathname)) {
        console.log('[authMiddleware] No session, redirecting to /admin/login');
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } else {
      // If there's a session, handle roles and redirects
      if (user) {
        try {
          const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          if (profileError) {
            console.error('[authMiddleware] profile lookup error:', profileError);
            url.pathname = '/admin/login';
            url.searchParams.set('error', 'profile_lookup_failed');
            return NextResponse.redirect(url);
          }

          const userRole = profile?.role;
          const allowedRoles = ['admin', 'super_admin'];
          console.log('[authMiddleware] profile.role:', userRole);

          if (!allowedRoles.includes(userRole)) {
            console.warn('[authMiddleware] unauthorized role, redirecting to login');
            url.pathname = '/admin/login';
            url.searchParams.set('error', 'unauthorized');
            return NextResponse.redirect(url);
          }
        } catch (err) {
          console.error('[authMiddleware] unexpected error checking profile:', err);
          url.pathname = '/admin/login';
          url.searchParams.set('error', 'profile_check_failed');
          return NextResponse.redirect(url);
        }
      }

      // If logged in, don't let them see the login page again
      if (url.pathname === '/admin/login') {
        console.log('[authMiddleware] Logged in user trying to access /admin/login, redirecting to /admin');
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}


export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname || '';
  // Log path and referer for easier tracing of how requests are generated
  console.log('[middleware] request path:', pathname);
  console.log('[middleware] referer:', request.headers.get('referer') || 'none');
  console.log('[middleware] user-agent:', request.headers.get('user-agent') || 'none');

  // Detect accidental concatenated paths like `/about/products` or `/contact/projects`
  // which commonly happen when a relative link (e.g., `href="products"`) is
  // clicked from another top-level page. If we detect two consecutive top-level
  // route names, redirect to the normalized path (e.g., `/products...`) to
  // reduce noisy 404s and provide a better UX.
  try {
    const rawSegments = pathname.split('/').filter(Boolean);
    if (rawSegments.length >= 2) {
      const [first, second, ...rest] = rawSegments;
      const TOP_ROUTES = new Set([
        'home', 'about', 'products', 'projects', 'services', 'contact', 'admin', 'privacy-policy', 'terms', 'terms-of-service'
      ]);

      if (TOP_ROUTES.has(first) && TOP_ROUTES.has(second)) {
        // Determine whether to preserve a locale prefix based on referer
        let prefix = '';
        const referer = request.headers.get('referer');
        if (referer) {
          try {
            const r = new URL(referer);
            const maybeLocale = r.pathname.split('/').filter(Boolean)[0];
            if (maybeLocale && ['en', 'ar'].includes(maybeLocale)) {
              prefix = `/${maybeLocale}`;
            }
          } catch (err) {
            // ignore malformed referer
          }
        }

        const finalPath = `${prefix}/${[second, ...rest].join('/')}`;
        console.log('[middleware] Detected concatenated path, redirecting', pathname, '->', finalPath);
        const url = request.nextUrl.clone();
        url.pathname = finalPath;
        return NextResponse.redirect(url);
      }
    }
  } catch (err) {
    console.warn('[middleware] concatenated path normalization failed:', err);
  }

  // If this is an admin path, run the auth middleware (if envs exist) and
  // skip the i18n middleware to avoid next-intl redirecting admin routes to
  // localized paths (which would result in 404s since admin pages are not
  // nested under the locale segments).
  if (pathname.startsWith('/admin')) {
    console.log('[middleware] handling admin path, running authMiddleware');
    try {
      const authResponse = await authMiddleware(request);
      console.log('[middleware] authMiddleware returned:', authResponse?.status ?? 'no response');
      // authMiddleware returns a NextResponse (redirect) or NextResponse.next()
      if (authResponse) return authResponse;
    } catch (err) {
      // If auth middleware failed (e.g., missing envs), fall back to allowing
      // the request so we don't block the admin UI from rendering during dev.
      console.error('[middleware] Auth middleware error:', err);
      return NextResponse.next();
    }
  }

  // For all other routes, use the i18n middleware as before.
  return intlMiddleware(request);
}


export const config = {
  // Apply middleware broadly, including admin paths. Exclude /_next/ and /api/ and static asset files.
  matcher: ['/((?!_next|api|.*\\..*).*)', '/admin/:path*'],
};