'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const t = useTranslations('navigation');
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };

  const locale = pathname ? pathname.split('/')[1] || 'en' : 'en';

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 h-20 bg-black/95 backdrop-blur supports-backdrop-blur border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center">
              <div className="h-16 w-auto">
                <img
                  src="/top-modern-logo-primary.png"
                  alt="Top Modern"
                  className="h-full w-auto"
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href={`/${locale}`} className="text-white/90 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">{t('home')}</Link>
            <Link href={`/${locale}/products`} className="text-white/90 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">{t('products')}</Link>
            <Link href={`/${locale}/projects`} className="text-white/90 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">{t('projects')}</Link>
            <Link href={`/${locale}/about`} className="text-white/90 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">{t('about')}</Link>
            <Link href={`/${locale}/contact`} className="text-white/90 hover:text-accent transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">{t('contact')}</Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-accent"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {/* During SSR theme may be undefined; wait until mounted to avoid hydration mismatch */}
              {mounted ? (theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />) : <Sun className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-accent"
              onClick={() => window.location.href = switchLanguage(locale === 'en' ? 'ar' : 'en')}
            >
              <span className="text-sm">{locale === 'en' ? 'العربية' : 'English'}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 hover:text-accent"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-4 space-y-4">
            <Link href={`/${locale}`} className={`block transition-colors ${isActive(`/${locale}`) ? 'text-accent' : 'text-white/90 hover:text-accent'}`} onClick={() => setIsOpen(false)}>{t('home')}</Link>
            <Link href={`/${locale}/products`} className={`block transition-colors ${isActive(`/${locale}/products`) ? 'text-accent' : 'text-white/90 hover:text-accent'}`} onClick={() => setIsOpen(false)}>{t('products')}</Link>
            <Link href={`/${locale}/projects`} className={`block transition-colors ${isActive(`/${locale}/projects`) ? 'text-accent' : 'text-white/90 hover:text-accent'}`} onClick={() => setIsOpen(false)}>{t('projects')}</Link>
            <Link href={`/${locale}/about`} className={`block transition-colors ${isActive(`/${locale}/about`) ? 'text-accent' : 'text-white/90 hover:text-accent'}`} onClick={() => setIsOpen(false)}>{t('about')}</Link>
            <Link href={`/${locale}/contact`} className={`block transition-colors ${isActive(`/${locale}/contact`) ? 'text-accent' : 'text-white/90 hover:text-accent'}`} onClick={() => setIsOpen(false)}>{t('contact')}</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export { Navigation };
