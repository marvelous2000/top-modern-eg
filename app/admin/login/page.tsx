
"use client"

import { useRouter } from "next/navigation";
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
import { login, googleLogin } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(login, null);

  const { pending } = useFormStatus();

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{
        backgroundImage: 'url("/adminbackground.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/80 z-0" />{" "}
      {/* Black overlay */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="text-center text-white font-serif tracking-widest leading-none">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-serif mb-4">
            TOP
          </h1>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-serif">
            MODERN
          </h1>
        </div>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center p-8 lg:p-12">
        <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm border border-border/50 shadow-2xl">
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
              <CardTitle className="text-foreground text-2xl font-serif">
                Admin Login
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to access the admin dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground font-medium"
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
                    className="text-foreground font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    href="/admin/reset-password"
                    className="text-sm text-primary hover:underline"
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
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <form action={googleLogin}>
              <Button variant="outline" className="w-full" disabled={pending}>
                {pending ? "..." : "Google"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
