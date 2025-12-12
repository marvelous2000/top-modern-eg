import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function LoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}