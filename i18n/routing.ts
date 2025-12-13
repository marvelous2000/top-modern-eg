import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
  ,
  // Provide an empty `pathnames` object; populate if you need named localized routes.
  pathnames: {}
});
