"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Floating, { FloatingElement } from "@/components/ui/floating"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { TextRevealByWord } from "@/components/ui/text-reveal"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion-1"
import Image from "next/image"
import Link from "next/link"

// ─── Animation helpers ───────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "#hero", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#servicos", label: "Serviços" },
    { href: "#cases", label: "Cases" },
    { href: "#faq", label: "FAQ" },
    { href: "#contato", label: "Contato" },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#f4f2eb]/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="flex justify-between items-center px-6 py-3 w-full max-w-7xl mx-auto">
        <Link href="#hero" className="flex items-center">
          <Image
            src="/logo.png"
            alt="ClickConverte"
            width={320}
            height={80}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
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

        {/* Mobile hamburger */}
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

      {/* Mobile menu */}
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
const floatingWords = [
  { text: "Branding", className: "top-[12%] left-[5%] text-3xl", depth: 2 },
  { text: "Estratégia", className: "top-[20%] right-[8%] text-xl", depth: 1 },
  { text: "Identidade", className: "top-[55%] left-[3%] text-2xl", depth: 3 },
  { text: "Conteúdo", className: "bottom-[25%] right-[5%] text-2xl", depth: 1.5 },
  { text: "Resultado", className: "bottom-[15%] left-[15%] text-xl", depth: 2.5 },
  { text: "Autoridade", className: "top-[38%] right-[12%] text-3xl", depth: 0.8 },
]

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      <AuroraBackground className="min-h-screen" showRadialGradient>
        {/* Floating parallax words */}
        <Floating sensitivity={0.8} easingFactor={0.04}>
          {floatingWords.map((w) => (
            <FloatingElement key={w.text} className={w.className} depth={w.depth}>
              <span
                className="font-display italic select-none pointer-events-none text-accent"
                style={{ opacity: 0.18 }}
              >
                {w.text}
              </span>
            </FloatingElement>
          ))}
        </Floating>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display text-primary leading-[1.08] mb-8 font-medium max-w-4xl"
          >
            Branding que posiciona.{" "}
            <em className="italic text-accent not-italic font-display" style={{ fontStyle: "italic" }}>
              Ações
            </em>{" "}
            que convertem.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="text-lg md:text-xl text-primary/70 max-w-xl mb-12 leading-relaxed font-body"
          >
            Ajudamos sua marca a atrair e conquistar os clientes certos com estratégia,
            design e conteúdo inteligente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-8 items-start sm:items-center"
          >
            <a
              href="#servicos"
              className="inline-block bg-primary text-white px-10 py-5 font-headline font-semibold text-sm tracking-wide rounded-none hover:-translate-y-0.5 transition-all duration-200 hover:bg-primary/90"
            >
              Conheça nosso trabalho
            </a>
            <a
              href="#contato"
              className="relative font-headline text-primary/80 text-sm font-medium group"
            >
              Descubra nossa abordagem
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-[1px] h-10 bg-primary/30"
            />
          </motion.div>
        </div>
      </AuroraBackground>
    </section>
  )
}

// ─── Sobre ────────────────────────────────────────────────────────────────────
function Sobre() {
  return (
    <section id="sobre" className="bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 mb-0">
          <FadeUp delay={0}>
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-headline font-bold mb-6 block">
              About
            </span>
            <h2 className="text-4xl md:text-5xl font-display italic text-primary">
              Sobre a ClickConverte
            </h2>
          </FadeUp>
          <FadeUp delay={0.15} className="self-start pt-12 hidden md:block">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/30 font-headline">
              Role para descobrir
            </p>
          </FadeUp>
        </div>
      </div>

      <TextRevealByWord
        text="A ClickConverte nasceu da crença de que marketing bom não precisa ser barulhento para ser eficaz. Operando 100% online a partir de Belo Horizonte, ajudamos marcas a construírem autoridade real através de uma abordagem estratégica e design minimalista. No nosso atelier digital, cada detalhe é pensado para eliminar o ruído e focar no que realmente importa: a conexão genuína entre o seu serviço e quem precisa dele."
      />
    </section>
  )
}

// ─── Serviços ─────────────────────────────────────────────────────────────────
const services = [
  {
    title: "Identidade Estratégica",
    desc: "Construímos o posicionamento da sua marca antes de qualquer execução. Logo, identidade visual e diretrizes que comunicam quem você é para as pessoas certas.",
  },
  {
    title: "Presença Digital Completa",
    desc: "Do planejamento à execução: criamos sua estratégia de conteúdo, perfis e materiais para que sua marca chegue onde seu cliente está.",
  },
  {
    title: "Gestão de Autoridade",
    desc: "Acompanhamento mensal contínuo. Planejamento, produção de conteúdo e análise de resultados para construir autoridade consistente no longo prazo.",
  },
  {
    title: "Tráfego e Performance",
    desc: "Campanhas de anúncios no Google e Meta para gerar leads qualificados e aumentar visibilidade no mercado certo.",
  },
  {
    title: "Branding Corporativo",
    desc: "Para empresas que precisam profissionalizar sua comunicação interna e externa com coerência e consistência de marca.",
  },
  {
    title: "Consultoria Pontual",
    desc: "Uma sessão estratégica para diagnosticar onde sua presença digital está falhando e o que fazer para mudar isso.",
  },
  {
    title: "Gestão e Consultoria de Vendas em Marketplaces",
    desc: "Estruturamos sua presença e operação em marketplaces como Amazon, Mercado Livre e Shopee. Do cadastro estratégico de produtos ao acompanhamento de métricas, entregamos uma operação rentável e escalável.",
  },
]

function ServiceCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <FadeUp delay={index * 0.07}>
      <details
        className="service-card group p-8 list-none"
        open={open}
        onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="flex justify-between items-center cursor-pointer list-none">
          <h3 className="text-lg font-headline font-semibold text-primary">{title}</h3>
          <span
            className="card-icon-plus text-accent text-2xl font-light select-none"
            aria-hidden
          >
            +
          </span>
        </summary>
        <div className="card-content mt-6 text-primary/70 font-body leading-relaxed text-sm">
          {desc}
        </div>
      </details>
    </FadeUp>
  )
}

function Servicos() {
  return (
    <section id="servicos" className="py-14 md:py-20 px-6 md:px-12 bg-[#faf9f4]">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-headline font-bold mb-4 block">
            Serviços
          </span>
          <h2 className="text-4xl md:text-6xl font-display text-primary font-medium mb-12">
            Soluções sob medida para o seu negócio
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} title={s.title} desc={s.desc} index={i} />
          ))}
        </div>

        <FadeUp delay={0.3} className="mt-12">
          <a
            href="#contato"
            className="inline-block bg-primary text-white px-12 py-5 font-headline font-semibold text-sm tracking-wide rounded-none hover:-translate-y-0.5 transition-all duration-200 hover:bg-primary/90"
          >
            Solicitar diagnóstico gratuito
          </a>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Conversion Flow Animation ───────────────────────────────────────────────
type CfNodeKind = "cursor" | "play" | "heart" | "message" | "cart" | "click" | "handshake"

interface CfNode {
  id: string
  x: number
  y: number
  z: number
  kind: CfNodeKind
}

const CF_NODES: CfNode[] = [
  { id: "cursor",    x: 110,  y: 300, z: 0.85, kind: "cursor"    },
  { id: "play",      x: 300,  y: 170, z: 0.45, kind: "play"      },
  { id: "heart",     x: 520,  y: 330, z: 0.95, kind: "heart"     },
  { id: "message",   x: 720,  y: 160, z: 0.30, kind: "message"   },
  { id: "cart",      x: 910,  y: 335, z: 0.90, kind: "cart"      },
  { id: "click",     x: 1120, y: 180, z: 0.50, kind: "click"     },
  { id: "handshake", x: 1300, y: 310, z: 1.00, kind: "handshake" },
]

const CF_ICONS: Record<CfNodeKind, string> = {
  cursor: `<path d="M6 4 L6 20 L10 16 L14 22 L16 21 L12 15 L17 15 Z" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>`,
  play: `<polygon points="8,6 8,18 18,12" stroke-width="1.4" stroke-linejoin="round"/>`,
  heart: `<path d="M12 21 C12 21 4 14 4 8.5 A4.5 4.5 0 0 1 12 6.1 A4.5 4.5 0 0 1 20 8.5 C20 14 12 21 12 21Z" stroke-width="1.4" stroke-linejoin="round"/>`,
  message: `<path d="M4 5 h16 a1 1 0 0 1 1 1 v9 a1 1 0 0 1-1 1 H8 L4 20 V6 a1 1 0 0 1 1-1Z" stroke-width="1.4" stroke-linejoin="round"/>`,
  cart: `<circle cx="9" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/><path d="M2 3 h2 l2.68 10.39 A2 2 0 0 0 8.6 15 H17 a2 2 0 0 0 1.94-1.51 L20.5 8 H6" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  click: `<path d="M9 3v4M15 3v4M3 9h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" stroke-width="1.4" stroke-linecap="round"/><path d="M9 13l2 2 4-4" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  handshake: `<path d="M4 12 L9 17 L20 6" stroke-width="0"/><path d="M2 11 L8 5 C9 4 10 4 11 5 L13 7 L17 3 C18 2 20 2 21 3 L22 4 C23 5 23 7 22 8 L14 16 C13 17 12 17 11 16 L9 14 L6 17 C5 18 4 18 3 17 L2 16 C1 15 1 12 2 11Z" stroke-width="1.4" stroke-linejoin="round"/>`,
}

function bezierPath(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2
  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`
}

function ConversionFlowAnimation() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const cam = svg.getElementById("cf-cam") as SVGGElement
    const trunksG = svg.getElementById("cf-trunks") as SVGGElement
    const trunksA = svg.getElementById("cf-trunks-a") as SVGGElement
    const shadowsG = svg.getElementById("cf-shadows") as SVGGElement
    const nodesG = svg.getElementById("cf-nodes") as SVGGElement
    const pring = svg.getElementById("cf-pring") as SVGCircleElement
    const pdot = svg.getElementById("cf-pdot") as SVGCircleElement

    const ns = "http://www.w3.org/2000/svg"

    // Build trunk paths
    const paths: SVGPathElement[] = []
    const pathsA: SVGPathElement[] = []
    for (let i = 0; i < CF_NODES.length - 1; i++) {
      const a = CF_NODES[i], b = CF_NODES[i + 1]
      const d = bezierPath(a.x, a.y, b.x, b.y)

      const p = document.createElementNS(ns, "path")
      p.setAttribute("d", d)
      p.setAttribute("fill", "none")
      p.setAttribute("stroke", "#324b67")
      p.setAttribute("stroke-width", "1.2")
      p.setAttribute("opacity", "0.18")
      trunksG.appendChild(p)
      paths.push(p)

      const pa = document.createElementNS(ns, "path")
      pa.setAttribute("d", d)
      pa.setAttribute("fill", "none")
      pa.setAttribute("stroke", "#cfb53b")
      pa.setAttribute("stroke-width", "1.6")
      pa.setAttribute("opacity", "0")
      const len = p.getTotalLength()
      pa.setAttribute("stroke-dasharray", String(len))
      pa.setAttribute("stroke-dashoffset", String(len))
      trunksA.appendChild(pa)
      pathsA.push(pa)
    }

    // Build shadow ellipses
    CF_NODES.forEach((n) => {
      const e = document.createElementNS(ns, "ellipse")
      const r = 16 * n.z
      e.setAttribute("cx", String(n.x))
      e.setAttribute("cy", String(n.y + 28 * n.z))
      e.setAttribute("rx", String(r))
      e.setAttribute("ry", String(r * 0.3))
      e.setAttribute("fill", "#324b67")
      e.setAttribute("opacity", String(0.07 * n.z))
      shadowsG.appendChild(e)
    })

    // Build node groups
    const nodeEls: SVGGElement[] = []
    CF_NODES.forEach((n) => {
      const s = n.z
      const r = 22 * s

      const g = document.createElementNS(ns, "g")
      g.id = `cf-node-${n.id}`
      g.setAttribute("class", "cf-node")
      g.setAttribute("transform", `translate(${n.x},${n.y})`)

      const ring = document.createElementNS(ns, "circle")
      ring.setAttribute("class", "cf-node-ring")
      ring.setAttribute("r", String(r))
      ring.setAttribute("fill", "transparent")
      ring.setAttribute("stroke", "#324b67")
      ring.setAttribute("stroke-width", String(1.2 * s))
      ring.setAttribute("opacity", "0.35")
      g.appendChild(ring)

      const halo = document.createElementNS(ns, "circle")
      halo.setAttribute("class", "cf-halo")
      halo.setAttribute("r", String(r))
      halo.setAttribute("fill", "none")
      halo.setAttribute("stroke", "#cfb53b")
      halo.setAttribute("stroke-width", String(1.5 * s))
      halo.setAttribute("opacity", "0")
      g.appendChild(halo)

      const icon = document.createElementNS(ns, "g")
      icon.setAttribute("class", "cf-glyph")
      icon.setAttribute("fill", "none")
      icon.setAttribute("stroke", "#324b67")
      icon.setAttribute("stroke-width", "1.3")
      icon.setAttribute("opacity", String(0.55 + 0.4 * s))
      const sc = (r * 1.25) / 12
      icon.setAttribute("transform", `scale(${sc}) translate(-12,-12)`)
      icon.innerHTML = CF_ICONS[n.kind]
      g.appendChild(icon)

      nodesG.appendChild(g)
      nodeEls.push(g)
    })

    // Animation state
    let raf = 0
    let t = 0
    let activeIdx = 0
    let activeProg = 0

    function activate(idx: number) {
      activeIdx = idx
      activeProg = 0
      nodeEls.forEach((el, i) => {
        if (i === idx) {
          el.classList.add("cf-active")
          const ring = el.querySelector(".cf-node-ring")
          const halo = el.querySelector(".cf-halo")
          if (ring) ring.setAttribute("stroke", "#cfb53b")
          if (halo) {
            halo.setAttribute("opacity", "0.7")
            halo.setAttribute("class", "cf-halo cf-burst")
          }
        } else if (i < idx) {
          el.classList.add("cf-active")
          const ring = el.querySelector(".cf-node-ring")
          if (ring) ring.setAttribute("stroke", "#cfb53b")
        } else {
          el.classList.remove("cf-active")
          const ring = el.querySelector(".cf-node-ring")
          const halo = el.querySelector(".cf-halo")
          if (ring) ring.setAttribute("stroke", "#324b67")
          if (halo) {
            halo.setAttribute("opacity", "0")
            halo.setAttribute("class", "cf-halo")
          }
        }
      })
      pathsA.forEach((pa, i) => {
        if (i < idx) {
          pa.setAttribute("opacity", "0.7")
          pa.setAttribute("stroke-dashoffset", "0")
        } else {
          pa.setAttribute("opacity", "0")
        }
      })
    }

    function tick() {
      t += 0.008
      activeProg += 0.025

      // Animate active path
      if (activeIdx < pathsA.length) {
        const pa = pathsA[activeIdx]
        const len = paths[activeIdx].getTotalLength()
        const off = len * Math.max(0, 1 - activeProg)
        pa.setAttribute("stroke-dashoffset", String(off))
        pa.setAttribute("opacity", String(Math.min(0.7, activeProg * 2)))

        // Pulse dot along active path
        const pt = paths[activeIdx].getPointAtLength(len * Math.min(1, activeProg))
        pring.setAttribute("cx", String(pt.x))
        pring.setAttribute("cy", String(pt.y))
        pring.setAttribute("r", "6")
        pring.style.opacity = String(Math.min(0.8, activeProg * 3))
        pdot.setAttribute("cx", String(pt.x))
        pdot.setAttribute("cy", String(pt.y))
        pdot.style.opacity = String(Math.min(1, activeProg * 3))

        if (activeProg >= 1 && activeIdx < CF_NODES.length - 1) {
          setTimeout(() => activate(activeIdx + 1), 200)
        }
        if (activeIdx >= CF_NODES.length - 1 && activeProg >= 1) {
          pring.style.opacity = "0"
          pdot.style.opacity = "0"
          // Restart after pause
          setTimeout(() => {
            nodeEls.forEach((el) => {
              el.classList.remove("cf-active")
              const ring = el.querySelector(".cf-node-ring")
              const halo = el.querySelector(".cf-halo")
              if (ring) ring.setAttribute("stroke", "#324b67")
              if (halo) { halo.setAttribute("opacity", "0"); halo.setAttribute("class", "cf-halo") }
            })
            pathsA.forEach((pa) => { pa.setAttribute("opacity", "0"); pa.setAttribute("stroke-dashoffset", pa.getAttribute("stroke-dasharray") || "0") })
            activate(0)
          }, 1800)
        }
      }

      // Camera sway
      const swayX = Math.sin(t * 0.4) * 6
      const swayY = Math.sin(t * 0.27) * 3
      cam.setAttribute("transform", `translate(${swayX},${swayY})`)

      raf = requestAnimationFrame(tick)
    }

    activate(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-sm">
      <style>{`
        .cf-node-ring { transition: stroke 0.4s; }
        .cf-glyph { transition: stroke 0.4s; }
        .cf-node.cf-active .cf-glyph { stroke: #cfb53b; }
        @keyframes cf-halo {
          0%   { opacity: 0.7; r: 22px; stroke-width: 2px; }
          60%  { opacity: 0.2; r: 36px; stroke-width: 1px; }
          100% { opacity: 0;   r: 44px; stroke-width: 0.5px; }
        }
        .cf-halo.cf-burst { animation: cf-halo 1400ms ease-out forwards; }
      `}</style>
      <svg
        ref={svgRef}
        viewBox="0 0 1400 480"
        style={{ width: "100%", aspectRatio: "14/4.8", display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="cf-blur"><feGaussianBlur stdDeviation="0.5" /></filter>
          <linearGradient id="cf-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4f2eb" stopOpacity="0" />
            <stop offset="100%" stopColor="#f4f2eb" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect x="0" y="360" width="1400" height="120" fill="url(#cf-floor)" />
        <g id="cf-cam">
          <g id="cf-shadows" />
          <g id="cf-trunks" />
          <g id="cf-trunks-a" />
          <circle id="cf-pring" r="6" cx="0" cy="0" fill="none" stroke="#cfb53b" strokeWidth="1.5" style={{ opacity: 0 }} />
          <circle id="cf-pdot" r="3" cx="0" cy="0" fill="#cfb53b" style={{ opacity: 0 }} />
          <g id="cf-nodes" />
        </g>
      </svg>
    </div>
  )
}

// ─── Cases ────────────────────────────────────────────────────────────────────
function Cases() {
  return (
    <section id="cases" className="bg-surface py-14 md:py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-headline font-bold mb-6 block">
            Cases
          </span>
        </FadeUp>
      </div>

      <TextRevealByWord
        text="Resultados que falam por si"
        className="max-w-7xl mx-auto px-6 md:px-12"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
        <FadeUp delay={0.1}>
          <p className="text-lg md:text-xl text-primary/70 font-body leading-relaxed max-w-4xl mb-12">
            Ao longo da nossa trajetória, construímos resultados expressivos para negócios de
            diferentes segmentos — do varejo físico ao digital, de profissionais autônomos a
            empresas em expansão. Trabalhamos com marcas que precisavam ir além da presença online e
            construir autoridade real. Crescemos comunidades do zero até centenas de milhares de
            pessoas. Estruturamos operações comerciais que transformaram a forma de captar clientes.
            Transformamos seguidores em compradores. Cada projeto é tratado como único — porque
            acreditamos que resultado consistente só vem de estratégia personalizada, não de fórmulas
            prontas.
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h3 className="text-3xl md:text-4xl font-display italic text-primary mb-8">
            Todas as ações para a conversão
          </h3>
          <ConversionFlowAnimation />
        </FadeUp>

        <FadeUp delay={0.1} className="mt-16 text-center">
          <a
            href="#contato"
            className="relative font-headline text-primary/80 text-sm font-medium group"
          >
            Quer fazer parte dessa história?
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </a>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const faqItems = [
  {
    question: "Para quem é a ClickConverte?",
    answer:
      "Para quem tem um negócio real e quer que o digital trabalhe por ele. Atendemos prestadores de serviço, donos de produtos físicos e criadores de produtos digitais que faturam, mas não convertem online. Se você tem tráfego e não tem venda, ou tem produto bom e não tem visibilidade, é exatamente isso que a gente resolve.",
  },
  {
    question: "Qual a diferença entre vocês e uma agência comum?",
    answer:
      "A maioria das agências entrega conteúdo. A gente entrega conversão. Surgimos para transformar cliques em clientes — por isso cada estratégia começa com posicionamento e termina com resultado mensurável. Não fazemos post pelo post. Fazemos post para vender.",
  },
  {
    question: "Como funciona para começar?",
    answer:
      "Preencha o formulário aqui do site e agende sua sessão de consultoria gratuita. Em uma conversa rápida, a gente entende o seu negócio, onde você está e o que faz sentido para o seu momento. O diagnóstico vem primeiro — porque o que converte para um produto físico é diferente do que converte para um serviço ou infoproduto.",
  },
]

function FAQ() {
  return (
    <section id="faq" className="bg-[#faf9f4] py-14 md:py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-headline font-bold mb-6 block">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-primary font-medium mb-12">
            Perguntas frequentes
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Accordion
            type="single"
            collapsible
            className="w-full border-t border-primary/10"
          >
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-primary/10">
                <AccordionTrigger className="text-left text-base md:text-lg font-headline font-semibold text-primary py-6 hover:text-accent transition-colors [&[data-state=open]>svg]:text-accent">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-primary/70 font-body text-sm md:text-base leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Contato ──────────────────────────────────────────────────────────────────
function Contato() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [form, setForm] = useState({ nome: "", email: "", negocio: "", mensagem: "" })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        setForm({ nome: "", email: "", negocio: "", mensagem: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  const inputClass =
    "w-full bg-transparent border-0 border-b border-white/20 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors duration-300 font-body text-sm"

  return (
    <section id="contato" className="py-14 md:py-20 px-6 md:px-12 bg-primary">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* Left */}
        <FadeUp>
          <h2 className="text-5xl md:text-7xl font-display text-white mb-8 font-medium leading-tight">
            Vamos conversar?
          </h2>
          <p className="text-accent/80 font-body text-lg mb-12 leading-relaxed max-w-sm">
            Sem pitch. Sem promessas vazias. Só uma conversa honesta sobre o seu negócio.
          </p>
          <div className="space-y-3 text-white/60 font-body text-sm">
            <p>contato@clickconverte.com.br</p>
            <p>Belo Horizonte · 100% online</p>
          </div>
        </FadeUp>

        {/* Right — form */}
        <FadeUp delay={0.2}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <select
              name="negocio"
              value={form.negocio}
              onChange={handleChange}
              className={`${inputClass} text-white/50`}
            >
              <option value="" className="bg-primary">
                Tipo de negócio
              </option>
              <option value="servicos" className="bg-primary text-white">
                Prestação de Serviços
              </option>
              <option value="ecommerce" className="bg-primary text-white">
                E-commerce
              </option>
              <option value="corporativo" className="bg-primary text-white">
                Corporativo
              </option>
              <option value="outro" className="bg-primary text-white">
                Outro
              </option>
            </select>

            <textarea
              name="mensagem"
              value={form.mensagem}
              onChange={handleChange}
              placeholder="Mensagem"
              required
              rows={4}
              className={`${inputClass} resize-none`}
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-accent text-[#1b1c18] py-5 font-headline font-semibold text-sm tracking-widest uppercase rounded-none hover:bg-accent/90 transition-all duration-200 disabled:opacity-60"
            >
              {status === "sending" ? "Enviando..." : "Enviar"}
            </button>

            {status === "success" && (
              <p className="text-accent font-body text-sm text-center">
                Mensagem enviada! Entraremos em contato em breve.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-400 font-body text-sm text-center">
                Erro ao enviar. Tente novamente ou entre em contato diretamente.
              </p>
            )}
          </form>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="w-full bg-[#1b1c18] py-14 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-center md:text-left">
          <span className="text-xl font-display italic text-white font-bold block mb-2">
            ClickConverte
          </span>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
            Belo Horizonte · 100% online
          </p>
          <p className="text-xs text-white/20 font-body">
            © 2024 ClickConverte. Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-white/15 font-body mt-1 tracking-wide">
            CEO: Renata Cardoso
          </p>
        </div>

        <div className="flex gap-10">
          <a
            href="#servicos"
            className="text-xs uppercase tracking-widest text-white/40 hover:text-accent transition-colors font-headline"
          >
            Serviços
          </a>
          <a
            href="#sobre"
            className="text-xs uppercase tracking-widest text-white/40 hover:text-accent transition-colors font-headline"
          >
            Sobre
          </a>
          <a
            href="#contato"
            className="text-xs uppercase tracking-widest text-white/40 hover:text-accent transition-colors font-headline"
          >
            Contato
          </a>
        </div>

        <div className="flex flex-col gap-1 text-right">
          <a
            href="mailto:contato@clickconverte.com.br"
            className="text-xs text-white/40 hover:text-accent transition-colors font-body"
          >
            contato@clickconverte.com.br
          </a>
          <span className="text-xs text-white/20 font-body">@clickconverte</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Sobre />
        <Servicos />
        <Cases />
        <FAQ />
        <Contato />
      </main>
      <Footer />
    </>
  )
}
