import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // This can be configured to load the correct messages
  // based on the incoming request.
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});