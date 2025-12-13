"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "./auth-guard";

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // Don't guard the public admin pages (login and password flows).
  // These routes must remain accessible so unauthenticated users can sign in
  // or reset their passwords.
  const publicAdminPaths = [
    "/admin/login",
    "/admin/reset-password",
    "/admin/update-password",
  ];

  if (publicAdminPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return <AuthGuard>{children}</AuthGuard>;
}
