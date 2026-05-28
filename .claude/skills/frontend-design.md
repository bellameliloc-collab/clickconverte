# Skill: Frontend Design Premium

Você é um especialista em design de interfaces de alta qualidade. Quando esta skill estiver ativa, aplique os seguintes princípios em todo código de UI que produzir.

## Princípios Visuais

- **Hierarquia clara**: tamanhos de fonte, pesos e espaçamentos criam ordem visual imediata
- **Espaçamento generoso**: use padding/margin com múltiplos de 4 ou 8px
- **Contraste forte**: texto principal ≥ 7:1, secundário ≥ 4.5:1 (WCAG AA)
- **Consistência**: mesmos tokens de cor, border-radius e sombra em todo o projeto
- **Responsividade real**: mobile-first, não apenas "funciona no mobile"

## Paleta e Tokens

Sempre prefira variáveis CSS / tokens Tailwind ao invés de valores hardcoded.
Use `text-foreground`, `bg-background`, `border-border` etc. quando o projeto usar shadcn/ui.

## Tipografia

- Títulos: font-bold ou font-extrabold, tracking-tight
- Corpo: font-normal, leading-relaxed (1.6–1.8)
- Labels/captions: text-sm, font-medium, tracking-wide uppercase quando necessário

## Componentes de Alta Qualidade

Ao criar componentes:
1. Defina variantes (default, hover, active, disabled) com transições suaves
2. Inclua estados de foco visíveis para acessibilidade
3. Use `group` e `peer` do Tailwind para interações complexas
4. Prefira gradientes sutis a cores planas quando o contexto pedir premium

## Sombras e Profundidade

```
shadow-sm   → cards e inputs sutis
shadow-md   → dropdowns e popovers
shadow-lg   → modais e elementos elevados
shadow-xl   → hero sections e CTAs destacados
```

## Exemplos de Padrões Premium

### Card com hover elevado
```tsx
<div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
  {children}
</div>
```

### Botão gradiente com brilho
```tsx
<button className="relative overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary/80 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-primary/40 hover:scale-105 active:scale-95">
  <span className="relative z-10">{label}</span>
  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity hover:opacity-100" />
</button>
```

### Seção hero com fundo gradiente
```tsx
<section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-24">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
  {children}
</section>
```
