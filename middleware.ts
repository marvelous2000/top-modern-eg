import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. Bypass for static assets, even if matcher is imperfect.
  // This is crucial to ensure CSS, images, and other assets are not processed.
  if (
    /\.(jpg|jpeg|png|gif|svg|ico|css|js|woff2?)$/.test(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Create a Supabase client in the middleware
  // This client will handle refreshing sessions and setting new cookies in the response
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Fetch the session from Supabase. This will also refresh the session if needed
  // and update the cookies in the `response` object.
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Handle Admin routes (no i18n)
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    // If user has a valid session
    if (session) {
      if (isLoginPage) {
        // User is logged in and trying to access login page, redirect to dashboard.
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      // For any other protected admin page, allow access.
      return response; // Return the response from createMiddlewareClient to ensure cookies are set
    }
    // User does NOT have a valid session
    else {
      if (!isLoginPage) {
        // User is not logged in and trying to access a protected admin page, redirect to login.
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      // User is not logged in and is on the login page, allow access.
      return response; // Return the response from createMiddlewareClient
    }
  }

  // 3. Handle public auth routes (no auth check, no i18n)
  if (pathname.startsWith('/auth')) {
    // For auth routes, just return the response from createMiddlewareClient
    // This is important so that Supabase can set/clear auth cookies correctly.
    return response;
  }

  // 4. For all other public-facing routes, apply i18n middleware
  // intlMiddleware returns a NextResponse, so we need to copy headers from our 'response'
  const i18nResponse = intlMiddleware(request);
  
  // Important: Copy the set-cookie headers from the supabase client response to the i18n response.
  // This ensures any refreshed session cookies are propagated.
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      i18nResponse.headers.append('set-cookie', value);
    }
  });

  return i18nResponse;
}

export const config = {
  // Matcher runs on all paths except those that start with /_next or /api,
  // or that contain a dot (likely a file extension).
  matcher: ['/((?!_next|api|.*\..*).*)'],
};
