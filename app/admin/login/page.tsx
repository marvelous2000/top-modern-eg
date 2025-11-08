"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createSupabaseBrowserClient } from "@/lib/supabase/index"
import { MarbleBackground } from "@/components/marble-background"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient())
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (data.user) {
        // Check if user has admin role
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("id, role, status")
          .eq("id", data.user.id)
          .maybeSingle()

        if (userError) {
          await supabase.auth.signOut()
          throw new Error(userError.message || "Unable to validate user profile")
        }

        if (!userData) {
          const { data: profileByEmail, error: emailLookupError } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", email)
            .maybeSingle()

          if (emailLookupError) {
            await supabase.auth.signOut()
            throw new Error(emailLookupError.message || "Unable to locate user profile")
          }

          if (profileByEmail && profileByEmail.id !== data.user.id) {
            await supabase.auth.signOut()
            throw new Error(
              "Profile mismatch detected. Update the profile's id in Supabase to match the auth user id.",
            )
          }

          await supabase.auth.signOut()
          throw new Error("User profile not found. Contact an administrator to provision access.")
        }

        if (userData.status !== "active") {
          await supabase.auth.signOut()
          throw new Error("Your account is not active. Contact an administrator.")
        }

        if (!["super_admin", "admin", "editor"].includes(userData.role)) {
          await supabase.auth.signOut()
          throw new Error("You don't have permission to access the admin panel")
        }

        router.push("/admin")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <MarbleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-md border-border/50 shadow-2xl relative z-10">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="text-4xl font-bold text-accent">TM</div>
          </div>
          <div>
            <CardTitle className="text-foreground text-2xl font-serif">Admin Login</CardTitle>
            <CardDescription className="text-muted-foreground">Sign in to access the admin dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
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

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium transition-all duration-200" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
