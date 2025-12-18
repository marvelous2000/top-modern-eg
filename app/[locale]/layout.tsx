import { type ReactNode } from 'react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Footer from '@/components/footer';
import NormalizeLinks from '@/components/NormalizeLinks';
import clsx from 'clsx';
import { ThemeProvider } from '@/components/theme-provider';
import { incrementPageViews } from '@/lib/actions/dashboard_metrics'; // Import the function

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  // Increment page views on every page load
  try {
    await incrementPageViews();
  } catch (err) {
    // Defensive: if incrementPageViews throws unexpectedly, do not block
    // page rendering. Log and continue so the site remains available.
    // The function itself returns structured errors in normal operation,
    // but this fence prevents unexpected exceptions from crashing the app.
    console.error('[layout] incrementPageViews failed:', err);
  }

  return (
    <div dir={direction} className={clsx("flex flex-col min-h-screen", {
      "rtl": direction === "rtl",
      "ltr": direction === "ltr",
    })}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NormalizeLinks />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </ThemeProvider>
    </div>
  );
}