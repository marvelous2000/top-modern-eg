"use client";

import { useEffect } from 'react';
import { LOCALES } from '@/lib/url-utils';

export default function NormalizeLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.('a') as HTMLAnchorElement | null;
      if (!el) return;

      const href = el.getAttribute('href');
      if (!href) return;

      // Skip external and special schemes
      if (/^(https?:)|^(mailto:)|^(tel:)|^#/.test(href)) return;

      // If already absolute (starts with /), it's fine
      if (href.startsWith('/')) return;

      // Otherwise, normalize and navigate
      e.preventDefault();
      const candidate = href.startsWith('/') ? href : `/${href}`;
      const segments = window.location.pathname.split('/');
      const maybeLocale = segments[1];
      const shouldPrefix = maybeLocale && LOCALES.includes(maybeLocale as any);
      const finalUrl = shouldPrefix ? `/${maybeLocale}${candidate}` : candidate;
      console.debug('[NormalizeLinks] normalized', href, '->', finalUrl);
      window.location.href = finalUrl;
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
