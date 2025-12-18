import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is a value (not a function); await it to get the locale
  const requested = await requestLocale;
  const locale = typeof requested === 'string' ? requested : 'en';

  // This can be configured to load the correct messages based on the incoming request.
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});