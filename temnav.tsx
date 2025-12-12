'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

export default function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const t = useTranslations('navigation');

  const switchLanguage = (newLocale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };

  const locale = pathname ? pathname.split('/')[1] || 'en' : 'en';

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center">
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-700 font-bold">TM</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Top Modern</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}`} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">{t('home')}</Link>
            <Link href={`/${locale}/products`} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">{t('products')}</Link>
            <Link href={`/${locale}/about`} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">{t('about')}</Link>
            <Link href={`/${locale}/contact`} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">{t('contact')}</Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Link href={switchLanguage('en')} className={`px-3 py-1 rounded-md text-sm font-medium ${pathname && pathname.startsWith('/en') ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>EN</Link>
              <Link href={switchLanguage('ar')} className={`px-3 py-1 rounded-md text-sm font-medium ${pathname && pathname.startsWith('/ar') ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>AR</Link>
            </div>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { Navigation };
