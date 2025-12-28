'use client';

import { ReactNode, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-utils';

interface AdminAuthWrapperProps {
  children: ReactNode;
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  useEffect(() => {
    const supabase = getSupabaseClient();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // The `SIGNED_OUT` event is triggered when the session is removed or becomes invalid.
      // This can happen if the refresh token expires or is revoked.
      if (event === 'SIGNED_OUT') {
        // Force a redirect to the login page. A full page reload is necessary
        // to ensure all server components re-run their authentication checks.
        window.location.href = '/admin/login?reason=session_expired';
      }
    });

    // The onAuthStateChange listener is the primary mechanism, but a periodic check
    // can serve as a fallback in case the event is not received.
    const interval = setInterval(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          // If the session is gone, trigger the redirect.
          window.location.href = '/admin/login?reason=session_expired_fallback';
        }
      });
    }, 5 * 60 * 1000); // Check every 5 minutes

    // Cleanup function to remove the listener and interval when the component unmounts.
    return () => {
      authListener?.subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
}
