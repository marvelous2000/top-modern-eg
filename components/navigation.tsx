'use client';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
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
    router.replace(pathname as any, { locale: newLocale });
  };

  const isActive = (href: string) => {
    // Convert pathname to string safely - this is the key fix
    const currentPath = pathname ? String(pathname) : '';
    
    if (!currentPath) {
      return false;
    }
    
    if (href === '/') {
      return currentPath === '/';
    }
    
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
            <Link href="/" className="flex items-center">
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className={cn(
                  "text-white/90 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full",
                  isActive(link.href) ? "text-accent after:w-full" : "hover:text-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-accent"
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
              className="md:hidden text-white hover:bg-white/10 hover:text-accent"
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div id="mobile-menu" className={`md:hidden fixed top-0 left-0 w-full h-screen bg-gray-800/80 z-60 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`absolute top-4 ${locale === 'ar' ? 'left-4' : 'right-4'}`}>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-accent"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center h-full px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg transition-colors",
                  isActive(link.href) ? 'text-accent' : 'text-white/90 hover:text-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export { Navigation };