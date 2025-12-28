// This component is no longer needed since authentication is handled at the server level
// in the middleware and admin layout. Keeping this file as a placeholder to prevent import errors.
// The authentication logic has been moved to the server-side middleware.

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Simply render children since auth is handled at the server/middleware level
  return <>{children}</>;
}