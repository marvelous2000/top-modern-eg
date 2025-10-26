import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return response
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value
      },
      set(name, value, options) {
        response.cookies.set({ name, value, ...options })
      },
      remove(name, options) {
        response.cookies.set({ name, value: "", ...options, maxAge: 0 })
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Refresh session if exists
  if (session) {
    await supabase.auth.refreshSession()
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Check if user has admin role
    const { data: userData } = await supabase.from("users").select("role, status").eq("id", session.user.id).single()

    if (
      !userData ||
      userData.status !== "active" ||
      !["super_admin", "admin", "editor", "viewer"].includes(userData.role)
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Redirect to admin if already logged in and trying to access login page
  if (request.nextUrl.pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
