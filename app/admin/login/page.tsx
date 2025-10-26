"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createSupabaseBrowserClient } from "@/lib/supabase/index"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

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
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="text-4xl font-bold text-yellow-500">TM</div>
          </div>
          <div>
            <CardTitle className="text-white text-2xl">Admin Login</CardTitle>
            <CardDescription className="text-gray-400">Sign in to access the admin dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-700">
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@topmodern.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
