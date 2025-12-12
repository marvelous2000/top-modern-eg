export const getSafeLocale = (locale: string | string[] | undefined): string => {
  if (Array.isArray(locale)) {
    return locale[0] || 'en';
  }
  return locale || 'en';
};

export const isArabic = (locale: string | string[] | undefined): boolean => {
  return getSafeLocale(locale) === 'ar';
};