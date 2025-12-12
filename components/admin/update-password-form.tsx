"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createSupabaseBrowserClient } from "@/lib/supabase/index";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function UpdatePasswordForm() {
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
    
    // Check if there's an access_token in the URL.
    // If not, it means the user probably arrived here incorrectly,
    // or the token is missing. We might want to redirect them.
    if (!accessToken) {
      setError("No access token found. Please use the password reset link from your email.");
    }
  }, [accessToken]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
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
      setError("Missing access token. Please try resetting your password again.");
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
      // Set the session with the access token from the URL to allow password update
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

      setMessage("Your password has been updated successfully. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
      // Optionally redirect to login after a short delay
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch (err: any) {
      console.error("Password update error:", err);
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm border border-border/50 shadow-2xl">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <img src="/top-modern-final-logo.png" alt="Top Modern Logo" className="h-16 w-auto" />
        </div>
        <div>
          <CardTitle className="text-foreground text-2xl font-serif">Set New Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter and confirm your new password.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
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
            <Label htmlFor="password" className="text-foreground font-medium">New Password</Label>
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
            <Label htmlFor="confirm-password" className="text-foreground font-medium">Confirm New Password</Label>
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
            {loading ? "Updating..." : "Update Password"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Back to{" "}
            <Link href="/admin/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
