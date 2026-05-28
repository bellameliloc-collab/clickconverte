"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CRMLogin() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/crm-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push("/crm")
        router.refresh()
      } else {
        setError("Senha incorreta. Tente novamente.")
        setPassword("")
      }
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0d0d0d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        fontFamily: "var(--font-manrope), system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Image
            src="/logo.png"
            alt="ClickConverte"
            width={180}
            height={45}
            style={{ height: 36, width: "auto", objectFit: "contain" }}
            priority
          />
          <span
            style={{
              color: "#444",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Pipeline
          </span>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            background: "#161616",
            border: "1px solid #242424",
            borderRadius: 16,
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                color: "#666",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
              autoComplete="current-password"
              required
              style={{
                width: "100%",
                background: "#1a1a1a",
                border: `1px solid ${error ? "#c0392b" : "#2a2a2a"}`,
                borderRadius: 10,
                padding: "13px 14px",
                color: "#fff",
                fontSize: 16,
                outline: "none",
                boxSizing: "border-box",
                letterSpacing: 2,
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#cfb53b")}
              onBlur={(e) =>
                (e.target.style.borderColor = error ? "#c0392b" : "#2a2a2a")
              }
            />
            {error && (
              <p
                style={{
                  color: "#e05555",
                  fontSize: 13,
                  margin: "8px 0 0",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%",
              background: loading || !password ? "#2a2200" : "#cfb53b",
              color: loading || !password ? "#665820" : "#000",
              border: "none",
              borderRadius: 10,
              padding: "14px",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
