'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PathFix() {
  const pathname = usePathname();

  useEffect(() => {
    const fixImagePaths = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && (src.startsWith('/en/') || src.startsWith('/ar/'))) {
          img.setAttribute('src', src.substring(3));
        }
      });
    };
    fixImagePaths();
    setTimeout(fixImagePaths, 100);
    setTimeout(fixImagePaths, 500);
  }, [pathname]);

  return null;
}
