"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createSupabaseBrowserClient } from "@/lib/supabase/index";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!supabase) {
      setError("Supabase client not initialized.");
      setLoading(false);
      return;
    }

    try {
      // For password reset, Supabase needs the URL where the user will be redirected
      // after clicking the link in the email.
      // This should point to a page in your app that handles the password reset form.
      const redirectUrl = `${window.location.origin}/admin/update-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        throw resetError;
      }

      setMessage("If an account with that email exists, you will receive a password reset link.");
      setEmail(""); // Clear email field after submission
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to send reset email.");
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
          <CardTitle className="text-foreground text-2xl font-serif">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email to receive a password reset link.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
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
            <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@topmodern.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-background border-input text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent/20"
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium transition-all duration-200" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Remember your password?{" "}
            <Link href="/admin/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
