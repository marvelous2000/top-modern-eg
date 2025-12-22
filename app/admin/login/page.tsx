
"use client"

import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SiteSettings, defaultSettings } from "@/lib/types";
import "../admin.css";

// This page is a client component. Dynamic rendering is controlled by server wrapper components.

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, setState] = useState<{ message: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [bgImage, setBgImage] = useState('/adminbackground.jpg'); // Default background
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('expired') === '1') {
      setState({ message: 'You were logged out due to inactivity. Please sign in again.' });
    }
  }, [searchParams]);

  useEffect(() => {
    // This effect runs only on the client
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem("siteSettings");
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          if (parsedSettings.logo.background) {
            setBgImage(parsedSettings.logo.background);
          }
        } catch (error) {
          console.error("Error loading settings:", error);
        }
      }
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    const result = await login(formData);
    if (result && 'message' in result) {
      setState(result);
    }
    setPending(false);
  };



  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{
        backgroundImage: `url("${bgImage}")`, // Use state for background image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/80 z-0" />{" "}
      {/* Black overlay */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="text-center">
          <Image
            src="/top-modern-final-logo.png"
            alt="Top Modern Logo"
            width={300} // Added width
            height={300} // Added height
            className="h-auto w-auto max-w-full"
          />
        </div>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center p-8 lg:p-12">
        <Card className="w-full max-w-md bg-slate-800 backdrop-blur-sm border border-border/50 shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <Image
                src="/top-modern-final-logo.png"
                alt="Top Modern Logo"
                width={64}
                height={64}
                className="h-16 w-auto"
              />
            </div>
            <div>
              <CardTitle className="text-white text-2xl font-serif">
                Admin Login
              </CardTitle>
              <CardDescription className="text-white">
                Sign in to access the admin dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-yellow-500 font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@topmodern.com"
                  required
                  className="bg-background border-input text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-yellow-500 font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    href="/auth/reset-password"
                    className="text-sm text-yellow-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-background border-input text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent/20"
                />
              </div>

              {state?.message && (
                <div className="text-red-500 text-sm">{state.message}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium transition-all duration-200"
                disabled={pending}
              >
                {pending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
