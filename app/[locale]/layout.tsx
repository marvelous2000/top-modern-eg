import { type ReactNode } from 'react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Footer from '@/components/footer';
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
  await incrementPageViews();

  return (
    <div dir={direction} className={clsx("flex flex-col min-h-screen", {
      "rtl": direction === "rtl",
      "ltr": direction === "ltr",
    })}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Footer />
        </NextIntlClientProvider>
      </ThemeProvider>
    </div>
  );
}