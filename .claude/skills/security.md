# Skill: Segurança — Frontend, Backend e Vazamento de Secrets

Você é um especialista em segurança web. Ao revisar ou escrever código, aplique estas regras sem exceção. Quando encontrar uma violação, sinalize com `🔴 RISCO DE SEGURANÇA` e explique o impacto real.

---

## REGRA #1 — O que vai no Frontend vs Backend

### ❌ NUNCA no Frontend (client-side)
```
- API keys de qualquer serviço externo (Stripe, OpenAI, SendGrid, etc.)
- Secrets de autenticação (JWT_SECRET, SESSION_SECRET)
- Credenciais de banco de dados (DATABASE_URL com usuário/senha)
- Chaves privadas (private keys, certificados)
- Lógica de autorização ("esse usuário pode ver isso?")
- Validação de pagamento ou cálculo de preço
- Tokens de serviços com permissão de escrita (S3, Firebase Admin)
- Senhas em qualquer forma, mesmo hasheadas
```

### ✅ Pode ir no Frontend (com `NEXT_PUBLIC_`)
```
- URLs públicas de API (sem credencial embutida)
- Chaves públicas de serviços (Stripe publishable key, Supabase anon key)
- IDs de analytics (Google Analytics, Posthog)
- Feature flags de UI
- Configurações de tema, i18n
```

### Regra prática
> Se a variável de ambiente **não tem** `NEXT_PUBLIC_`, ela só existe no servidor.
> Se **tem** `NEXT_PUBLIC_`, assume que qualquer pessoa pode lê-la — não coloque segredos.

---

## REGRA #2 — Detecção de Vazamento de API Keys

### Padrões de risco para procurar no código

```bash
# Rodar no projeto para detectar possíveis vazamentos:
grep -rn "sk-" src/                    # OpenAI keys
grep -rn "AKIA" src/                   # AWS keys
grep -rn "rk_live_\|pk_live_" src/     # Stripe live keys
grep -rn "SG\." src/                   # SendGrid
grep -rn "ghp_\|gho_\|ghu_" src/      # GitHub tokens
grep -rn "xoxb-\|xoxp-" src/          # Slack tokens
grep -rn "AIza" src/                   # Google API keys
grep -rn "EAA" src/                    # Facebook tokens
grep -rn "Bearer " src/                # Tokens hardcoded em headers
grep -rn "password\s*=\s*['\"]" src/   # Senhas hardcoded
grep -rn "secret\s*=\s*['\"]" src/     # Secrets hardcoded
grep -rn "api_key\s*=\s*['\"]" src/    # API keys hardcoded
```

### Exemplos de código PERIGOSO

```tsx
// 🔴 RISCO: key hardcoded no cliente
const stripe = new Stripe("sk_live_abc123...")  // sk_ = SECRET KEY

// 🔴 RISCO: fetch com secret no frontend
fetch("https://api.openai.com/v1/chat", {
  headers: { "Authorization": "Bearer sk-abc123..." }
})

// 🔴 RISCO: variável de ambiente exposta com NEXT_PUBLIC_
const secret = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY

// 🔴 RISCO: key no objeto de configuração client-side
const config = {
  apiKey: "AIzaSy...",   // hardcoded
  databaseURL: "https://my-app.firebaseio.com"
}
```

### Versão SEGURA

```tsx
// ✅ SEGURO: secret só existe no servidor
// app/api/payment/route.ts (Server-side)
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)  // sem NEXT_PUBLIC_

// ✅ SEGURO: frontend usa apenas chave pública
// components/CheckoutForm.tsx (Client-side)
import { loadStripe } from "@stripe/stripe-js"
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ✅ SEGURO: OpenAI só no servidor
// app/api/ai/route.ts
import OpenAI from "openai"
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })  // sem NEXT_PUBLIC_
```

---

## REGRA #3 — .env e .gitignore

### Estrutura obrigatória de arquivos .env

```bash
# .env.local (NUNCA commitar — adicionar no .gitignore)
DATABASE_URL="postgresql://user:password@host/db"
STRIPE_SECRET_KEY="sk_live_..."
OPENAI_API_KEY="sk-..."
JWT_SECRET="string-aleatoria-de-32-chars-minimo"
NEXTAUTH_SECRET="outra-string-aleatoria"

# .env.example (commitar — valores fictícios para documentar)
DATABASE_URL="postgresql://user:password@localhost/myapp"
STRIPE_SECRET_KEY="sk_live_COLOQUE_SUA_KEY_AQUI"
OPENAI_API_KEY="sk-COLOQUE_SUA_KEY_AQUI"
JWT_SECRET="GERE_UM_SECRET_FORTE_AQUI"
NEXTAUTH_SECRET="GERE_UM_SECRET_FORTE_AQUI"
```

### .gitignore obrigatório

```gitignore
# Secrets — NUNCA commitar
.env
.env.local
.env.*.local
.env.production

# Manter no repo (valores fictícios)
# .env.example  ← NÃO ignorar este
```

### Verificar se secrets já foram commitados

```bash
# Checar histórico do git por possíveis vazamentos
git log --all --full-history -- "**/.env"
git log --all --full-history -- ".env"

# Se encontrou: revogar a key IMEDIATAMENTE no painel do serviço
# Depois: limpar o histórico (mas a key já pode ter sido exposta)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all
```

---

## REGRA #4 — Validação e Sanitização

### Nunca confiar no frontend

```tsx
// 🔴 RISCO: confiar em dados do cliente sem validar
export async function POST(req: NextRequest) {
  const { userId, role } = await req.json()  // client pode enviar qualquer coisa
  await db.update({ userId, role: "admin" }) // privilege escalation!
}

// ✅ SEGURO: validar com zod + pegar userId da sessão
import { z } from "zod"
import { getServerSession } from "next-auth"

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: body.error }, { status: 400 })

  // userId vem da sessão, NÃO do body
  await db.update({ userId: session.user.id, ...body.data })
}
```

### Proteção contra injeção

```tsx
// 🔴 RISCO: SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✅ SEGURO: query parametrizada (Prisma, Drizzle fazem isso automaticamente)
const user = await prisma.user.findUnique({ where: { email } })

// 🔴 RISCO: XSS via dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ SEGURO: sanitizar antes (usar DOMPurify) ou evitar completamente
import DOMPurify from "dompurify"
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

---

## REGRA #5 — Headers de Segurança (Next.js)

Adicionar em `next.config.mjs`:

```js
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",  value: "on" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },       // anti-clickjacking
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // remover unsafe-* em prod
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https:",
    ].join("; ")
  },
]

export default {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  }
}
```

---

## Checklist de Auditoria Rápida

Execute ao revisar qualquer PR ou antes de deploy:

```
SECRETS E VARIÁVEIS
[ ] Nenhuma API key hardcoded em código fonte
[ ] Nenhum secret com prefixo NEXT_PUBLIC_
[ ] .env.local está no .gitignore
[ ] .env.example existe com valores fictícios
[ ] Secrets de produção estão apenas no painel do deploy (Vercel, Railway, etc.)

AUTENTICAÇÃO E AUTORIZAÇÃO
[ ] userId sempre vem da sessão server-side, nunca do body/params
[ ] Rotas protegidas verificam autenticação antes de qualquer lógica
[ ] Tokens têm expiração definida
[ ] Logout invalida a sessão no servidor

DADOS E INPUTS
[ ] Todos os inputs validados com zod ou similar
[ ] Queries usando ORM parametrizado (Prisma, Drizzle) — sem string interpolation
[ ] dangerouslySetInnerHTML ausente ou sanitizado com DOMPurify
[ ] Uploads de arquivo validam tipo e tamanho

EXPOSIÇÃO
[ ] Headers de segurança configurados no next.config
[ ] Erros do servidor não expõem stack trace ao cliente
[ ] Console.log sem dados sensíveis em produção
[ ] APIs internas protegidas por autenticação
```

---

## Comando de Varredura Rápida no Projeto

```bash
# Rodar na raiz do projeto para auditoria de segurança básica
echo "=== Possíveis keys hardcoded ===" && \
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" \
  -E "(sk-|AKIA|rk_live_|pk_live_|SG\.|ghp_|AIza|Bearer [A-Za-z0-9])" \
  src/ app/ components/ lib/ 2>/dev/null | grep -v "node_modules" | grep -v ".env"

echo "=== NEXT_PUBLIC com secret? ===" && \
grep -rn "NEXT_PUBLIC_.*SECRET\|NEXT_PUBLIC_.*KEY\|NEXT_PUBLIC_.*PASS" \
  src/ app/ .env* 2>/dev/null

echo "=== .env no git? ===" && \
git ls-files | grep -E "^\.env$|^\.env\."
```
