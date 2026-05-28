import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Só protege rotas /crm — deixa login e API de auth passarem
  if (
    pathname === "/crm/login" ||
    pathname.startsWith("/api/crm-auth")
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/crm")) {
    const token = request.cookies.get("cc_auth")?.value
    const expected = process.env.CRM_AUTH_TOKEN

    if (!expected || token !== expected) {
      return NextResponse.redirect(new URL("/crm/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/crm/:path*"],
}
