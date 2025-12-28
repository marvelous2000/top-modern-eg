import { createSupabaseBrowserClient } from "./client";

export const getSupabaseClient = () => {
  // Always create a new client on the client-side.
  // The createSupabaseBrowserClient function handles returning a mock for SSR,
  // so we don't need to worry about caching a server-side instance.
  return createSupabaseBrowserClient();
};

// Session refresh utility
export const refreshSession = async () => {
  try {
    const supabase = getSupabaseClient();

    // Try to get the session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session refresh error:", error);
      return null;
    }

    if (!session) {
      // No session exists, return null
      return null;
    }

    // Check if session is expired or about to expire
    if (session.expires_at) {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const timeUntilExpiry = session.expires_at - now;

      // If the session expires in less than 5 minutes, try to refresh it
      if (timeUntilExpiry < 5 * 60) {
        const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError) {
          console.error("Session refresh failed:", refreshError);
          // Return the original session even if refresh failed
          return session;
        }

        return refreshedData.session;
      }
    }

    return session;
  } catch (error) {
    console.error("Refresh session error:", error);
    return null;
  }
};
