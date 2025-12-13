import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const requestedStr = typeof requested === 'string' ? requested : undefined;

  // Narrow the types so TypeScript understands `requestedStr` matches one of the
  // known routing locales (e.g. 'en' | 'ar'). If it does not match, fall back
  // to the routing default.
  const locale =
    requestedStr && (routing.locales as readonly string[]).includes(requestedStr)
      ? (requestedStr as typeof routing.locales[number])
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
