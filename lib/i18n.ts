export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export async function getTranslations(locale: Locale) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    return (await import(`../messages/en.json`)).default;
  }
}

export function isLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
