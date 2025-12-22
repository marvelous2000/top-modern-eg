"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthFormContainer } from "./auth-form-container";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch('/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetPassword',
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || 'Failed to send reset link.');
      }

      setMessage("Check your email for a password reset link.");
      setEmail("");
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer
      title="Reset Password"
      description="Enter your email to receive a password reset link."
      footerText="Remember your password?"
      footerLink="/admin/login"
      footerLinkText="Sign In"
    >
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
          <Label htmlFor="email" className="text-yellow-500 font-medium">Email</Label>
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
      </form>
    </AuthFormContainer>
  );
}
