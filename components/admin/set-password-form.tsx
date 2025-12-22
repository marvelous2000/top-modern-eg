"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createSupabaseBrowserClient } from "@/lib/supabase/index";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthFormContainer } from "./auth-form-container";

export function SetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());

    if (!accessToken) {
      setError("No access token found. Please use the invitation link from your email.");
    }
  }, [accessToken]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!supabase) {
      setError("Supabase client not initialized.");
      setLoading(false);
      return;
    }

    if (!accessToken) {
      setError("Missing access token. Please try setting your password again.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { error: setSessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: '' });
      if (setSessionError) {
        throw setSessionError;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage("Your password has been set successfully. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch (err: any) {
      console.error("Password set error:", err);
      setError(err.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer
      title="Set Your Password"
      description="Enter and confirm your new password."
      footerText="Back to"
      footerLink="/admin/login"
      footerLinkText="Sign In"
    >
      <form onSubmit={handleSetPassword} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert variant="default" className="bg-green-100 border-green-200 text-green-800">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="text-yellow-500 font-medium">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="bg-background border-input text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-yellow-500 font-medium">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            className="bg-background border-input text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent/20"
          />
        </div>

        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium transition-all duration-200" disabled={loading}>
          {loading ? "Setting Password..." : "Set Password"}
        </Button>
      </form>
    </AuthFormContainer>
  );
}
