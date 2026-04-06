import type { Metadata } from "next"
import { Newsreader, Poppins, Manrope } from "next/font/google"
import "./globals.css"

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
})

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ClickConverte | Branding & Social Media",
  description:
    "Ajudamos sua marca a atrair e conquistar os clientes certos com estratégia, design e conteúdo inteligente.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${newsreader.variable} ${poppins.variable} ${manrope.variable} scroll-smooth`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
