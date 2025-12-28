import { ThemeProvider } from '@/components/theme-provider';
import '@/app/globals.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="admin-theme">{children}</div>
    </ThemeProvider>
  );
}
