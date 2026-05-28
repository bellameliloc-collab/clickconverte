import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password !== process.env.CRM_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
  }

  const token = process.env.CRM_AUTH_TOKEN!
  const response = NextResponse.json({ ok: true })

  response.cookies.set("cc_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: "/",
  })

  return response
}
