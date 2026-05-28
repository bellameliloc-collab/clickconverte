# Skill: Motion Design — Micro-interações e Efeitos Visuais

Você é especialista em motion design para web. Crie movimentos que sejam expressivos, com personalidade e que elevem a percepção de qualidade do produto.

## Filosofia de Motion

- **Propósito**: movimento deve comunicar, não decorar
- **Física real**: springs simulam objetos físicos, mais natural que ease linear
- **Consistência**: mesma linguagem de motion em todo o produto
- **Velocidade**: 200–400ms para micro, 400–700ms para transições de página

## Micro-interações Premium

### Botão com ripple
```tsx
"use client"
import { motion } from "framer-motion"
import { useState } from "react"

function RippleButton({ children, onClick, className = "" }) {
  const [ripples, setRipples] = useState([])

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples(r => [...r, { x, y, id }])
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600)
    onClick?.()
  }

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      whileTap={{ scale: 0.97 }}
      onClick={addRipple}
    >
      {children}
      {ripples.map(rp => (
        <motion.span
          key={rp.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{ left: rp.x - 20, top: rp.y - 20, width: 40, height: 40 }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  )
}
```

### Toggle com spring
```tsx
function AnimatedToggle({ checked, onChange }) {
  return (
    <motion.button
      className={`relative h-7 w-12 rounded-full ${checked ? 'bg-primary' : 'bg-muted'}`}
      onClick={() => onChange(!checked)}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}
```

### Card flip (frente e verso)
```tsx
"use client"
import { motion } from "framer-motion"
import { useState } from "react"

function FlipCard({ front, back }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="relative h-64 w-48 cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-2xl bg-card shadow-lg p-6" style={{ backfaceVisibility: "hidden" }}>
          {front}
        </div>
        <div className="absolute inset-0 rounded-2xl bg-primary shadow-lg p-6 text-white" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          {back}
        </div>
      </motion.div>
    </div>
  )
}
```

### Accordeon animado
```tsx
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border">
      <button
        className="flex w-full items-center justify-between py-4 text-left font-medium"
        onClick={() => setOpen(o => !o)}
      >
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          ↓
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="pb-4 text-muted-foreground">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### Cursor personalizado
```tsx
"use client"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"

function CustomCursor() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 200, damping: 20 })
  const smoothY = useSpring(y, { stiffness: 200, damping: 20 })

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-5 w-5 rounded-full bg-primary mix-blend-difference"
      style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
    />
  )
}
```

## Transições de Página (Next.js App Router)

```tsx
// app/template.tsx — envolve todas as páginas
"use client"
import { motion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}
```

## Efeitos de Parallax

```tsx
"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

function ParallaxSection({ children, speed = 0.5 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
```

## Loading States com Personalidade

### Skeleton com shimmer
```tsx
function Skeleton({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-muted ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
```

### Dots loader
```tsx
function DotsLoader() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-primary"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  )
}
```
