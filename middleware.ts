import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const config = {
  matcher: [
    '/((?!admin|_next/static|_next/image|favicon.ico|api|.*\\..*).*)'
  ]
};