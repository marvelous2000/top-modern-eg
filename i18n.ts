import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Define locales directly here to avoid import issues
const LOCALES = ['en', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is a value you await (not a function) that resolves to
  // the detected locale (or undefined). Mirror the approach used in
  // `i18n/request.ts` to be defensive and type-safe.
  const requested = await requestLocale;
  const locale = typeof requested === 'string' ? requested : 'en';

  // Validate that the incoming `locale` is a known locale
  if (!LOCALES.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    // Add timeZone or other configurations if needed
    // timeZone: 'Europe/Vienna'
  };
});

