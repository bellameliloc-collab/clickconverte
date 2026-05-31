"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export function SiteHeader({ basePath = "" }: { basePath?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: `${basePath}#hero`, label: "Início" },
    { href: "/sobre", label: "Sobre" },
    { href: `${basePath}#servicos`, label: "Serviços" },
    { href: `${basePath}#cases`, label: "Cases" },
    { href: `${basePath}#faq`, label: "FAQ" },
    { href: `${basePath}#contato`, label: "Contato" },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#f4f2eb]/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="flex justify-between items-center px-6 py-3 w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="ClickConverte"
            width={320}
            height={80}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex gap-10 items-center">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-headline text-sm text-primary/70 hover:text-accent transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[1.5px] bg-primary"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-[1.5px] bg-primary"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[1.5px] bg-primary"
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#f4f2eb]/95 backdrop-blur-md border-t border-primary/5"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-headline text-primary/80 hover:text-accent transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
