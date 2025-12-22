import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/products': '/products',
    '/products/[slug]': '/products/[slug]',
    '/projects': '/projects',
    '/about': '/about',
    '/contact': '/contact',
    '/admin/login': '/admin/login',
    '/admin/reset-password': '/admin/reset-password',
    '/admin/update-password': '/admin/update-password',
    '/auth/reset-password': '/auth/reset-password',
    '/auth/update-password': '/auth/update-password',
    '/privacy-policy': '/privacy-policy',
    '/terms': '/terms',
  }
});
