'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

export default function AdminThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add('admin-theme');
    return () => {
      document.body.classList.remove('admin-theme');
    };
  }, []);

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      {children}
    </ThemeProvider>
  );
}
