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
function ConversionFlowAnimation() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const GROUND_Y = 395
    const NODE_R_BASE = 38
    const STEPS = 7

    const NODES = [
      { id: "cursor",    x: 110,  y: 300, z: 0.85, kind: "cursor" },
      { id: "play",      x: 300,  y: 170, z: 0.45, kind: "play" },
      { id: "heart",     x: 520,  y: 330, z: 0.95, kind: "heart" },
      { id: "message",   x: 720,  y: 160, z: 0.30, kind: "message" },
      { id: "cart",      x: 910,  y: 335, z: 0.90, kind: "cart" },
      { id: "click",     x: 1120, y: 180, z: 0.50, kind: "click" },
      { id: "handshake", x: 1300, y: 310, z: 1.00, kind: "handshake" },
    ]

    const ICON: Record<string, string> = {
      cursor: `<path class="glyph" d="M -8 -12 L -8 10 L -2 4 L 2 12 L 5 10 L 1 3 L 9 3 Z" />`,
      play: `
        <rect class="glyph" x="-16" y="-11" width="32" height="22" rx="1" />
        <path class="glyph fillable" d="M -3 -5 L 6 0 L -3 5 Z" />
        <line class="glyph" x1="-16" y1="-5" x2="-12" y2="-5" stroke-opacity="0.35"/>
        <line class="glyph" x1="12" y1="5" x2="16" y2="5" stroke-opacity="0.35"/>
      `,
      heart: `<path class="glyph fillable" d="M 0 11 C -4 6, -14 4, -14 -3 C -14 -9, -8 -11, -4 -8 C -1 -6, 0 -3, 0 -1 C 0 -3, 1 -6, 4 -8 C 8 -11, 14 -9, 14 -3 C 14 4, 4 6, 0 11 Z" />`,
      message: `
        <path class="glyph" d="M -16 -10 H 16 V 7 H -4 L -10 13 L -10 7 H -16 Z" />
        <circle class="glyph" cx="-7" cy="-1" r="1.1" />
        <circle class="glyph" cx="0"  cy="-1" r="1.1" />
        <circle class="glyph" cx="7"  cy="-1" r="1.1" />
      `,
      cart: `
        <path class="glyph" d="M -14 -8 L -10 -8 L -7 8 H 12 L 15 -3 H -8" />
        <circle class="glyph" cx="-5" cy="13" r="2" />
        <circle class="glyph" cx="10" cy="13" r="2" />
      `,
      click: `
        <path class="glyph" d="M -1 -12 L -1 -2 L -5 -4 C -8 -5 -10 -3 -8 0 L -2 12 H 7 L 10 6 L 10 -4 C 10 -6 8 -7 6 -6 L 6 -1 L 6 -4 C 6 -6 4 -7 2 -6 L 2 -1 L 2 -4 C 2 -6 0 -7 -1 -6" />
        <path class="glyph" d="M -14 -12 L -10 -10" stroke-opacity="0.35"/>
        <path class="glyph" d="M 14 -12 L 10 -10" stroke-opacity="0.35"/>
        <path class="glyph" d="M -14 0 L -10 -2" stroke-opacity="0.35"/>
      `,
      handshake: `
        <path class="glyph" d="M -18 0 L -11 -5 L -4 -3 L 2 1 L -2 5 L -9 3 L -13 6 Z" />
        <path class="glyph" d="M  18 0 L  11 -5 L  4 -3 L -2 1 L 2 5 L 9 3 L 13 6 Z" />
        <line class="glyph" x1="-18" y1="0" x2="-22" y2="-2" />
        <line class="glyph" x1="18"  y1="0" x2="22"  y2="-2" />
        <line class="glyph" x1="-13" y1="6" x2="-16" y2="9" stroke-opacity="0.35"/>
        <line class="glyph" x1="13"  y1="6" x2="16"  y2="9" stroke-opacity="0.35"/>
      `,
    }

    function depthScale(z: number)    { return 0.55 + z * 0.55 }
    function depthOpacity(z: number)  { return 0.45 + z * 0.55 }
    function depthStroke(z: number)   { return 0.9 + z * 0.9 }
    function depthShadowOp(z: number) { return 0.04 + z * 0.10 }

    function bezierBetween(a: typeof NODES[0], b: typeof NODES[0]) {
      const dx = b.x - a.x
      const c1x = a.x + dx * (0.30 + a.z * 0.15)
      const c1y = a.y - (1 - a.z) * 20
      const c2x = b.x - dx * (0.30 + b.z * 0.15)
      const c2y = b.y - (1 - b.z) * 20
      return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`
    }

    const ns = "http://www.w3.org/2000/svg"
    const trunkGroup      = svg.querySelector("#cf-trunk-group")  as SVGGElement
    const trunkActiveGroup = svg.querySelector("#cf-trunk-active-group") as SVGGElement
    const shadowsGroup    = svg.querySelector("#cf-shadows-group") as SVGGElement
    const nodesGroup      = svg.querySelector("#cf-nodes-group")  as SVGGElement
    const pulseDot        = svg.querySelector("#cf-pulse-dot")    as SVGCircleElement
    const pulseRing       = svg.querySelector("#cf-pulse-ring")   as SVGCircleElement
    const cam             = svg.querySelector("#cf-cam")          as SVGGElement

    // Build trunk segments
    type Seg = { bg: SVGPathElement; fg: SVGPathElement; len: number }
    const segments: Seg[] = []

    for (let i = 0; i < NODES.length - 1; i++) {
      const a = NODES[i], b = NODES[i + 1]
      const d = bezierBetween(a, b)
      const midZ = (a.z + b.z) / 2

      const bg = document.createElementNS(ns, "path")
      bg.setAttribute("d", d)
      bg.setAttribute("class", "cf-trunk")
      bg.setAttribute("stroke-width", String(depthStroke(midZ) * 0.9))
      bg.setAttribute("stroke-opacity", String(0.12 + midZ * 0.16))
      trunkGroup.appendChild(bg)

      const fg = document.createElementNS(ns, "path")
      fg.setAttribute("d", d)
      fg.setAttribute("class", "cf-trunk-active")
      fg.setAttribute("stroke-width", String(depthStroke(midZ) * 1.1))
      fg.style.filter = `drop-shadow(0 0 ${4 + midZ * 6}px rgba(207,181,59,${0.35 + midZ * 0.35}))`
      trunkActiveGroup.appendChild(fg)

      const len = bg.getTotalLength()
      fg.style.strokeDasharray = String(len)
      fg.style.strokeDashoffset = String(len)

      segments.push({ bg, fg, len })
    }

    // Shadows
    NODES.forEach((n) => {
      const scale = depthScale(n.z)
      const el = document.createElementNS(ns, "ellipse")
      el.setAttribute("cx", String(n.x))
      el.setAttribute("cy", String(GROUND_Y))
      el.setAttribute("rx", String(NODE_R_BASE * scale * 0.75))
      el.setAttribute("ry", String(NODE_R_BASE * scale * 0.14))
      el.setAttribute("class", "cf-node-shadow")
      el.setAttribute("opacity", String(depthShadowOp(n.z)))
      shadowsGroup.appendChild(el)
    })

    // Nodes — rendered sorted by z (far first = behind)
    const nodeEls: SVGGElement[] = new Array(NODES.length)
    const nodeHalos: NodeListOf<Element>[] = new Array(NODES.length)

    const zOrder = NODES.map((n, i) => ({ n, i })).sort((a, b) => a.n.z - b.n.z)
    zOrder.forEach(({ n, i }) => {
      const scale = depthScale(n.z)
      const op = depthOpacity(n.z)

      const g = document.createElementNS(ns, "g")
      g.setAttribute("class", "cf-node")
      g.setAttribute("transform", `translate(${n.x} ${n.y}) scale(${scale})`)
      g.style.opacity = String(op)
      if (n.z < 0.45) g.setAttribute("filter", "url(#cf-far-blur)")

      g.innerHTML = `
        <circle class="cf-node-halo" r="${NODE_R_BASE}" />
        <circle class="cf-node-halo" r="${NODE_R_BASE + 6}" style="animation-delay:120ms"/>
        <circle class="cf-node-ring" r="${NODE_R_BASE}" stroke-width="1.25" />
        ${ICON[n.kind]}
      `
      nodesGroup.appendChild(g)
      nodeEls[i] = g
      nodeHalos[i] = g.querySelectorAll(".cf-node-halo")
    })

    // Animation state
    const state = {
      progress: 0,
      speed: 1 / 1500,
      pauseAtNode: 650,
      lingerLeft: 0,
      lastTs: 0,
      lastActiveIdx: -1,
      endHold: undefined as number | undefined,
      t: 0,
    }

    function setTrunkProgress(p: number) {
      for (let i = 0; i < segments.length; i++) {
        let frac = 0
        if (p >= i + 1) frac = 1
        else if (p <= i) frac = 0
        else frac = p - i
        segments[i].fg.style.strokeDashoffset = String(segments[i].len * (1 - frac))
      }
    }

    function positionPulse(p: number) {
      if (p <= 0 || p >= STEPS - 1) {
        pulseDot.style.opacity = "0"
        pulseRing.style.opacity = "0"
        return
      }
      const segIdx = Math.floor(p)
      const frac = p - segIdx
      const seg = segments[segIdx]
      if (!seg) return
      const pt = seg.bg.getPointAtLength(seg.len * frac)
      const a = NODES[segIdx], b = NODES[segIdx + 1]
      const z = a.z + (b.z - a.z) * frac
      const sc = depthScale(z)
      pulseDot.setAttribute("cx", String(pt.x))
      pulseDot.setAttribute("cy", String(pt.y))
      pulseDot.setAttribute("r", String(3.5 * sc))
      pulseRing.setAttribute("cx", String(pt.x))
      pulseRing.setAttribute("cy", String(pt.y))
      pulseRing.setAttribute("r", String(10 * sc))
      pulseDot.style.filter = `drop-shadow(0 0 ${6 * sc}px rgba(207,181,59,0.9))`
      const edgeFade = Math.min(frac * 8, (1 - frac) * 8, 1)
      pulseDot.style.opacity = String(edgeFade)
      pulseRing.style.opacity = String(edgeFade * 0.5)
    }

    function setActiveNode(idx: number) {
      NODES.forEach((_, i) => nodeEls[i].classList.toggle("cf-active", i <= idx))
      if (idx !== state.lastActiveIdx && idx >= 0 && idx < NODES.length) {
        nodeHalos[idx].forEach((h) => {
          h.classList.remove("cf-burst")
          void (h as HTMLElement).getBoundingClientRect()
          h.classList.add("cf-burst")
        })
        state.lastActiveIdx = idx
      }
    }

    function updateCamera(p: number, t: number) {
      let focusX = 700
      if (p < STEPS - 1) {
        const si = Math.floor(p), frac = p - Math.floor(p)
        const a = NODES[si], b = NODES[si + 1] || NODES[si]
        focusX = a.x + (b.x - a.x) * frac
      } else {
        focusX = NODES[STEPS - 1].x
      }
      const offsetX = (700 - focusX) * 0.05
      const sway = Math.sin(t / 2400) * 4
      cam.setAttribute("transform", `translate(${offsetX + sway} ${Math.sin(t / 3100) * 2})`)
    }

    function renderFrame() {
      setTrunkProgress(state.progress)
      positionPulse(state.progress)
      const activeIdx = Math.min(STEPS - 1, Math.floor(state.progress + 0.001))
      setActiveNode(activeIdx)
      updateCamera(state.progress, state.t)
    }

    let raf = 0
    function tick(ts: number) {
      if (!state.lastTs) state.lastTs = ts
      const dt = ts - state.lastTs
      state.lastTs = ts
      state.t += dt

      const atNode = Math.abs(state.progress - Math.round(state.progress)) < 0.01
      if (atNode && state.lingerLeft > 0) {
        state.lingerLeft -= dt
      } else {
        const prev = state.progress
        state.progress += dt * state.speed
        if (Math.floor(state.progress) > Math.floor(prev) && state.progress < STEPS - 1) {
          state.progress = Math.floor(state.progress)
          state.lingerLeft = state.pauseAtNode
        }
        if (state.progress >= STEPS - 1) {
          state.progress = STEPS - 1
          if (state.endHold === undefined) state.endHold = 1600
          state.endHold -= dt
          if (state.endHold <= 0) {
            state.progress = 0
            state.endHold = undefined
            state.lastActiveIdx = -1
            NODES.forEach((_, i) => nodeHalos[i].forEach((h) => h.classList.remove("cf-burst")))
          }
        }
      }

      renderFrame()
      raf = requestAnimationFrame(tick)
    }

    renderFrame()
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="w-full">
      <style>{`
        .cf-trunk { fill: none; stroke: #324b67; stroke-linecap: round; }
        .cf-trunk-active { fill: none; stroke: #cfb53b; stroke-linecap: round; }
        .cf-node-shadow { fill: #324b67; }
        .cf-node-ring {
          fill: transparent; stroke: #324b67; stroke-opacity: 0.35;
          transition: stroke 350ms cubic-bezier(0.22,1,0.36,1),
                      stroke-opacity 350ms cubic-bezier(0.22,1,0.36,1);
        }
        .cf-node.cf-active .cf-node-ring { stroke: #cfb53b; stroke-opacity: 1; }
        .cf-node-halo {
          fill: none; stroke: #cfb53b; stroke-width: 1; opacity: 0;
          transform-box: fill-box; transform-origin: center;
        }
        .cf-node-halo.cf-burst { animation: cf-halo-burst 1400ms cubic-bezier(0.22,1,0.36,1); }
        @keyframes cf-halo-burst {
          0%   { opacity: 0.9; transform: scale(0.9); }
          60%  { opacity: 0.35; transform: scale(1.3); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        .glyph {
          fill: none; stroke: #324b67; stroke-opacity: 0.55;
          stroke-linecap: round; stroke-linejoin: round;
          transition: stroke 350ms cubic-bezier(0.22,1,0.36,1),
                      stroke-opacity 350ms cubic-bezier(0.22,1,0.36,1);
        }
        .glyph.fillable {
          transition: fill 350ms cubic-bezier(0.22,1,0.36,1),
                      stroke 350ms cubic-bezier(0.22,1,0.36,1),
                      stroke-opacity 350ms cubic-bezier(0.22,1,0.36,1);
        }
        .cf-node.cf-active .glyph { stroke: #cfb53b; stroke-opacity: 1; }
        .cf-node.cf-active .glyph.fillable { fill: #cfb53b; fill-opacity: 0.15; }
      `}</style>
      <svg
        ref={svgRef}
        viewBox="0 0 1400 500"
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Fluxo de conversão animado"
      >
        <defs>
          <filter id="cf-far-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
          <linearGradient id="cf-horizon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#324b67" stopOpacity="0" />
            <stop offset="100%" stopColor="#324b67" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <rect x="0" y="330" width="1400" height="170" fill="url(#cf-horizon)" />
        <g id="cf-cam">
          <g id="cf-shadows-group" />
          <g id="cf-trunk-group" />
          <g id="cf-trunk-active-group" />
          <g id="cf-pulse-group">
            <circle id="cf-pulse-ring" fill="none" stroke="#cfb53b" strokeWidth="1" r="10" cx="0" cy="0" style={{ opacity: 0 }} />
            <circle id="cf-pulse-dot"  fill="#cfb53b" r="3.5" cx="0" cy="0" style={{ opacity: 0 }} />
          </g>
          <g id="cf-nodes-group" />
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
