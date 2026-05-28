# Skill: Next.js 14+ — Padrões e Boas Práticas

Você é especialista em Next.js App Router. Aplique estes padrões em todo código Next.js que produzir.

## Regras Fundamentais

- Use App Router (`app/`) — nunca Pages Router em projetos novos
- `"use client"` apenas quando necessário (hooks, eventos, estado)
- Server Components por padrão — mais performance, menos bundle
- Prefira `fetch` nativo com `cache` e `next.revalidate` a libs de data fetching
- `loading.tsx` e `error.tsx` em toda rota que busca dados

## Estrutura de Pastas

```
app/
  (marketing)/          ← route group sem segmento na URL
    page.tsx
    layout.tsx
  (app)/
    dashboard/
      page.tsx
      loading.tsx
      error.tsx
  api/
    route.ts

components/
  ui/                   ← shadcn/ui e primitivos
  sections/             ← seções de página (server)
  features/             ← componentes de feature (pode ter client)

lib/
  utils.ts
  actions.ts            ← Server Actions
```

## Server Components — Padrões

```tsx
// app/dashboard/page.tsx
import { getData } from "@/lib/data"

export default async function DashboardPage() {
  const data = await getData()    // direto no componente, sem useEffect
  return <Dashboard data={data} />
}

// Metadata dinâmica
export async function generateMetadata({ params }) {
  const item = await getItem(params.id)
  return { title: item.name, description: item.description }
}
```

## Server Actions

```tsx
// lib/actions.ts
"use server"
import { revalidatePath } from "next/cache"

export async function createItem(formData: FormData) {
  const name = formData.get("name") as string
  // validar, salvar no banco...
  revalidatePath("/dashboard")
  return { success: true }
}

// No componente client:
import { createItem } from "@/lib/actions"

<form action={createItem}>
  <input name="name" />
  <button type="submit">Criar</button>
</form>
```

## Otimização de Imagens

```tsx
import Image from "next/image"

// Sempre use next/image, nunca <img> nativo
<Image
  src="/hero.jpg"
  alt="Descrição significativa"
  width={1200}
  height={600}
  priority          // apenas para imagens above the fold
  className="object-cover"
/>

// Imagens que preenchem o container
<div className="relative aspect-video w-full">
  <Image src="/bg.jpg" alt="" fill className="object-cover" />
</div>
```

## Loading e Suspense

```tsx
// app/posts/loading.tsx
export default function Loading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  )
}

// Suspense granular em Server Components
import { Suspense } from "react"

<Suspense fallback={<ProductsSkeleton />}>
  <Products />          {/* async Server Component */}
</Suspense>
```

## Error Handling

```tsx
// app/dashboard/error.tsx
"use client"
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h2 className="text-xl font-semibold">Algo deu errado</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="btn-primary">Tentar novamente</button>
    </div>
  )
}
```

## Route Handlers (API)

```tsx
// app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") ?? "1"
  // buscar dados...
  return NextResponse.json({ data, page: Number(page) })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // validar e salvar...
  return NextResponse.json({ id: newItem.id }, { status: 201 })
}
```

## Middleware

```tsx
// middleware.ts (raiz do projeto)
import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"]
}
```

## Environment Variables

```
NEXT_PUBLIC_*    → exposto ao browser (use com cautela)
sem prefixo      → apenas server-side (seguro para secrets)
```

```tsx
// Sempre com fallback e tipagem
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
const secret = process.env.JWT_SECRET!   // ! apenas quando tem certeza que existe
```

## Performance Checklist

- [ ] Imagens com `next/image` e `alt` descritivo
- [ ] Fontes com `next/font` (sem layout shift)
- [ ] `dynamic(() => import(...), { ssr: false })` para componentes pesados client-only
- [ ] `generateStaticParams` para rotas dinâmicas conhecidas
- [ ] `revalidate` configurado em data fetching
- [ ] Bundle analyzer rodado antes do deploy (`@next/bundle-analyzer`)
