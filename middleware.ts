import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname
  const isAdminLogin = path === "/admin/login"

  if (path.startsWith("/admin")) {
    if (!session && !isAdminLogin) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
    if (session && isAdminLogin) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  if (path.startsWith("/api/admin")) {
    if (path.startsWith("/api/admin/dev")) {
      return res
    }
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return res
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/staff/:path*", "/api/staff/:path*"] }
