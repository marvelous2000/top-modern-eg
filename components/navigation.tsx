'use client';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const t = useTranslations('navigation');
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const isActive = (href: string) => {
    // Safely get the pathname, defaulting to empty string if undefined/null
    const currentPath = typeof pathname === 'string' ? pathname : '';

    // Exact match for home page
    if (href === '/') {
      return currentPath === '/';
    }
    // Check if the current path starts with the link's href for other pages
    return currentPath.startsWith(href);
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/projects', label: t('projects') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-50 h-20 bg-black/95 backdrop-blur supports-backdrop-blur border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Button variant="link" onClick={() => router.push('/')} className="flex items-center">
              <div className="h-16 w-auto">
                <img
                  src="/top-modern-logo-primary.png"
                  alt="Top Modern"
                  className="h-full w-auto"
                />
              </div>
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="link"
                onClick={() => router.push(link.href)}
                className={cn(
                  "text-white/90 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full",
                  isActive(link.href) ? "text-gold-500 after:w-full" : "hover:text-gold-600"
                )}
              >
                {link.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-gold-600"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {mounted ? (theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />) : <Sun className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-gold-600"
              onClick={() => switchLanguage(locale === 'en' ? 'ar' : 'en')}
            >
              <span className="text-sm">{locale === 'en' ? 'العربية' : 'English'}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 hover:text-gold-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="link"
                onClick={() => {
                  router.push(link.href);

                  setIsOpen(false);
                }}
                className={cn(
                  "block transition-colors",
                  isActive(link.href) ? 'text-gold-500' : 'text-white/90 hover:text-gold-600'
                )}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export { Navigation };