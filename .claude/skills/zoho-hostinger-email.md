# Skill: Configurar Zoho Mail com domínio Hostinger

## Objetivo
Configurar caixa de entrada profissional no Zoho Mail (gratuito) usando o domínio da ClickConverte, com DNS gerenciado pela Hostinger.

## Pré-requisitos
- Acesso ao painel Hostinger (hostinger.com.br)
- Acesso ao domínio `clickconverte.com.br`
- Email pessoal para criar conta Zoho: `bellameliloc@gmail.com`

## Passo 1 — Criar conta no Zoho Mail
1. Acesse zoho.com/mail
2. Clique em "Get Started" → selecione plano **Forever Free** (1 usuário, 5GB)
3. Escolha "Add your existing domain"
4. Digite `clickconverte.com.br` e confirme

## Passo 2 — Verificar domínio (TXT record na Hostinger)
O Zoho fornece um registro TXT de verificação. Para adicioná-lo:
1. Acesse hostinger.com.br → painel → **Domínios**
2. Clique no domínio `clickconverte.com.br` → **Gerenciar DNS**
3. Adicione um novo registro:
   - **Tipo:** TXT
   - **Host/Nome:** `@`
   - **Valor:** *(copiar exatamente do Zoho)*
   - **TTL:** 3600
4. Salve e volte ao Zoho → clique em **Verify TXT Record**

## Passo 3 — Adicionar registros MX na Hostinger
Ainda em Gerenciar DNS, adicione os 3 registros MX abaixo (remova qualquer MX existente antes):

| Tipo | Host | Valor | Prioridade |
|------|------|-------|------------|
| MX | @ | mx.zoho.com | 10 |
| MX | @ | mx2.zoho.com | 20 |
| MX | @ | mx3.zoho.com | 50 |

## Passo 4 — Adicionar registro SPF (opcional mas recomendado)
Adiciona um TXT para evitar que emails caiam no spam:
- **Tipo:** TXT
- **Host:** `@`
- **Valor:** `v=spf1 include:zoho.com ~all`

## Passo 5 — Criar endereço de email no Zoho
1. No painel Zoho Mail → **Mail Accounts** → **Add Account**
2. Crie o endereço desejado, ex: `oi@clickconverte.com.br` ou `contato@clickconverte.com.br`
3. Defina senha

## Passo 6 — Aguardar propagação DNS
- Normalmente 1–2 horas, máximo 24h
- Para verificar se propagou: acesse mxtoolbox.com e busca por `clickconverte.com.br`

## Resultado esperado
- Isabella recebe emails em `oi@clickconverte.com.br` via Zoho Mail
- Pode responder aparecendo como `oi@clickconverte.com.br`
- Acesso via zoho.com/mail ou app Zoho Mail no celular

## Notas
- Plano Free suporta 1 usuário — suficiente para uso solo
- Se quiser integrar com o formulário do site, atualizar `to:` no arquivo `src/app/api/contact/route.ts` para o novo endereço Zoho
