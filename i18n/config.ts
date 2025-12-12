import {defineRouting} from 'next-intl/routing';

export const locales = ['en', 'ar'];

export const routing = defineRouting({
  locales: locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});
