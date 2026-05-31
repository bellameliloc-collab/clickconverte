import type { Metadata, Viewport } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Pipeline — ClickConverte",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pipeline",
  },
  icons: {
    apple: "/icon-180.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
