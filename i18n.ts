import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Define locales directly here to avoid import issues
const LOCALES = ['en', 'ar'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` is a known locale
  if (!LOCALES.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    // Add timeZone or other configurations if needed
    // timeZone: 'Europe/Vienna'
  };
});

