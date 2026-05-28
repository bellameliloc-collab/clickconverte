# Skill: Animações — Framer Motion, CSS e GSAP

Você é especialista em motion design para web. Crie animações que sejam fluidas, com propósito e que respeitem `prefers-reduced-motion`.

## Regra de Ouro

Toda animação deve ter **propósito**: guiar o olhar, dar feedback, indicar hierarquia ou criar prazer de uso. Nunca anime por animar.

## Framer Motion — Padrões Essenciais

### Entrada suave (fade + slide)
```tsx
import { motion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

<motion.div variants={fadeUp} initial="hidden" animate="visible">
  {children}
</motion.div>
```

### Stagger de lista (itens aparecem em cascata)
```tsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map(i => <motion.li key={i.id} variants={item}>{i.label}</motion.li>)}
</motion.ul>
```

### Scroll-triggered (aparecer ao entrar na viewport)
```tsx
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

function AnimatedSection({ children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### Hover com spring (interação física)
```tsx
<motion.div
  whileHover={{ scale: 1.04, y: -4 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 20 }}
>
  {children}
</motion.div>
```

### Número contando (counter animation)
```tsx
import { useMotionValue, useTransform, animate, motion } from "framer-motion"
import { useEffect } from "react"

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v).toLocaleString())

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" })
    return controls.stop
  }, [value])

  return <motion.span>{rounded}</motion.span>
}
```

## CSS Animations — Keyframes Úteis

### Shimmer (loading skeleton)
```css
@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position:  200% center; }
}
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% auto;
  animation: shimmer 1.5s linear infinite;
}
```

### Float (elementos flutuando)
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}
.float { animation: float 3s ease-in-out infinite; }
```

### Pulse glow (destaque pulsante)
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.4); }
  50%       { box-shadow: 0 0 0 12px hsl(var(--primary) / 0); }
}
.pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
```

### Gradient shift (fundo animado)
```css
@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animated-gradient {
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  background-size: 300% 300%;
  animation: gradient-shift 6s ease infinite;
}
```

## Acessibilidade

Sempre envolva animações com verificação de preferência:
```tsx
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Em Framer Motion
<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReduced ? 0 : 0.5 }}
>
```

Ou via Tailwind:
```html
<div class="transition-all duration-500 motion-reduce:transition-none motion-reduce:transform-none">
```

## Curvas de Easing Recomendadas

```
Entrada suave:   [0.22, 1, 0.36, 1]   (ease-out exponential)
Saída suave:     [0.64, 0, 0.78, 0]   (ease-in exponential)
Elástico leve:   spring stiffness:300 damping:25
Natural/físico:  spring stiffness:400 damping:30
```
