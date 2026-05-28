# Skill: Design de Posts e Conteúdo Visual

Você é especialista em criar componentes React/Next.js que se parecem e funcionam como posts de redes sociais, banners e conteúdo visual premium para web.

## Formatos de Post

### Post de Feed (quadrado 1:1)
```tsx
// 600×600px — Instagram feed, LinkedIn
<div className="relative aspect-square w-full max-w-[600px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
  {/* Fundo */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

  {/* Conteúdo */}
  <div className="relative flex h-full flex-col items-center justify-center gap-6 p-10 text-center text-white">
    <p className="text-sm font-medium uppercase tracking-widest text-primary">categoria</p>
    <h2 className="text-4xl font-bold leading-tight tracking-tight">Título do Post</h2>
    <p className="text-base text-white/70">Subtítulo ou descrição curta aqui</p>
  </div>

  {/* Logo/marca */}
  <div className="absolute bottom-6 right-6 text-sm font-semibold text-white/50">@marca</div>
</div>
```

### Post Story/Vertical (9:16)
```tsx
// 1080×1920px — Instagram Stories, TikTok, Reels cover
<div className="relative w-full overflow-hidden rounded-3xl bg-black" style={{ aspectRatio: '9/16' }}>
  {/* Background visual */}
  <div className="absolute inset-0 animated-gradient opacity-80" />

  {/* Conteúdo centralizado */}
  <div className="relative flex h-full flex-col items-center justify-center gap-8 px-8 text-center text-white">
    <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
      Tag ou categoria
    </div>
    <h1 className="text-5xl font-black leading-none tracking-tighter">
      TÍTULO<br/>IMPACTANTE
    </h1>
    <p className="text-lg text-white/80">Descrição de apoio com até duas linhas</p>
    <button className="mt-4 rounded-full bg-white px-8 py-3 font-bold text-black">
      CTA aqui
    </button>
  </div>
</div>
```

### Banner Horizontal (16:9)
```tsx
// Capa de YouTube, banner de site, LinkedIn cover
<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />

  {/* Imagem de fundo */}
  <img src="/img/bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />

  {/* Texto */}
  <div className="relative flex h-full flex-col justify-center px-12">
    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">subtítulo</p>
    <h1 className="text-5xl font-black leading-tight text-white">
      Título Principal<br />do Banner
    </h1>
    <p className="mt-4 max-w-md text-lg text-white/70">Descrição complementar</p>
  </div>
</div>
```

## Elementos Visuais Reutilizáveis

### Noise texture overlay (textura de grão)
```tsx
<div
  className="absolute inset-0 opacity-[0.03]"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
  }}
/>
```

### Grid dot pattern (fundo de pontos)
```tsx
<div
  className="absolute inset-0 opacity-10"
  style={{
    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
    backgroundSize: '24px 24px'
  }}
/>
```

### Glow spot (brilho colorido)
```tsx
<div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
<div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />
```

### Badge / Tag de status
```tsx
<span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
  AO VIVO
</span>
```

## Animações de Post

### Post que entra com reveal
```tsx
"use client"
import { motion } from "framer-motion"

const postVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

<motion.div variants={postVariants} initial="hidden" animate="visible">
  {/* post content */}
</motion.div>
```

### Texto digitando (typewriter)
```tsx
"use client"
import { useState, useEffect } from "react"

function Typewriter({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  )
}
```

### Contador de likes / métricas
```tsx
import { motion, animate, useMotionValue, useTransform } from "framer-motion"
import { useEffect } from "react"

function MetricCounter({ value, prefix = "", suffix = "" }) {
  const count = useMotionValue(0)
  const display = useTransform(count, v =>
    `${prefix}${Math.round(v).toLocaleString("pt-BR")}${suffix}`
  )
  useEffect(() => {
    animate(count, value, { duration: 1.8, ease: "easeOut" })
  }, [value])
  return <motion.span>{display}</motion.span>
}

// Uso: <MetricCounter value={12450} suffix="+" />
```

## Paletas de Cor para Posts

### Dark Premium
```
bg: #0a0a0a  |  surface: #111111  |  accent: #6366f1  |  text: #f8f8f8
```

### Light Clean
```
bg: #ffffff  |  surface: #f9fafb  |  accent: #0ea5e9  |  text: #111827
```

### Vibrant Social
```
bg: linear(135deg, #667eea → #764ba2)  |  text: #ffffff  |  accent: #fbbf24
```

### Brand Warm
```
bg: #fef7ee  |  surface: #fff  |  accent: #f97316  |  text: #1c1917
```
