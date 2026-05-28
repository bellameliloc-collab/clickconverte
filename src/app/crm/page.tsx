"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

// ─── Types ────────────────────────────────────────────────────────────────────

type Status =
  | "Frio"
  | "Contatado"
  | "Respondeu"
  | "Reunião Marcada"
  | "Proposta Enviada"
  | "Fechado"
  | "Perdido"

type ICP = "A" | "B" | "C" | "D"
type Canal = "Email" | "WhatsApp" | "DM Instagram" | "LinkedIn"
type Setor = "Beleza" | "Saúde" | "Marketplace" | "B2B" | "Outro"

interface Lead {
  id: string
  negocio: string
  responsavel: string
  setor: Setor
  icp: ICP
  status: Status
  canal: Canal
  contato: { email?: string; whatsapp?: string; instagram?: string }
  sinalDeDor: string
  acoesFeitas: string[]
  proximasAcoes: string[]
  scripts: { email?: string; whatsapp?: string; dm?: string }
  notas: string
  criadoEm: string
  atualizadoEm: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES: Status[] = [
  "Frio",
  "Contatado",
  "Respondeu",
  "Reunião Marcada",
  "Proposta Enviada",
  "Fechado",
  "Perdido",
]

const SETORES: Setor[] = ["Beleza", "Saúde", "Marketplace", "B2B", "Outro"]
const CANAIS: Canal[] = ["Email", "WhatsApp", "DM Instagram", "LinkedIn"]

const STATUS_META: Record<Status, { color: string; emoji: string; bg: string }> = {
  Frio:             { color: "#5ba4c4", emoji: "🧊", bg: "rgba(91,164,196,0.13)" },
  Contatado:        { color: "#cfb53b", emoji: "📬", bg: "rgba(207,181,59,0.13)" },
  Respondeu:        { color: "#7eb87e", emoji: "💬", bg: "rgba(126,184,126,0.13)" },
  "Reunião Marcada":{ color: "#9b7fd4", emoji: "📅", bg: "rgba(155,127,212,0.13)" },
  "Proposta Enviada":{ color: "#e8913f", emoji: "📋", bg: "rgba(232,145,63,0.13)" },
  Fechado:          { color: "#4caf50", emoji: "✅", bg: "rgba(76,175,80,0.13)" },
  Perdido:          { color: "#666666", emoji: "❌", bg: "rgba(102,102,102,0.13)" },
}

const ICP_COLOR: Record<ICP, string> = {
  A: "#4caf50",
  B: "#cfb53b",
  C: "#e8913f",
  D: "#888888",
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    negocio: "Elegance Salon BH",
    responsavel: "Livia",
    setor: "Beleza",
    icp: "A",
    status: "Contatado",
    canal: "Email",
    contato: { email: "livia.elegance@hotmail.com", instagram: "@elegancesalonbh" },
    sinalDeDor:
      "Site sem preços, sem agendamento online, botão 'Agende' sem destino. Email no Hotmail. 23K seguidores que não convertem.",
    acoesFeitas: [
      '📬 Email enviado em 28/05/2026 — "Livia, fui ao site do Elegance agora — e saí sem agendar"',
    ],
    proximasAcoes: [
      "⏳ Aguardar resposta até 31/05",
      "📱 Follow-up via DM @elegancesalonbh se não responder",
      "🎯 Oferecer Raio-X de Conversão (15 min)",
    ],
    scripts: {
      email: `Oi Livia, tudo bem?\n\nVi o site do Elegance Salon — vocês têm 23 mil seguidores e uma presença forte no Instagram, mas o site não tem preços nem agendamento online. O botão Agende aparece mas não vai a lugar nenhum.\n\nNa prática, quem chega pelo Instagram e tenta fechar pelo site desiste antes de ligar.\n\nFaço um diagnóstico rápido (15 min, sem compromisso) onde mostro os 3 pontos específicos que estão impedindo o digital de vocês de virar agendamento real.\n\nToparia dar uma olhada?\n\nIsabella\nClickConverte — Cliques que viram clientes`,
    },
    notas: "Rua Ouro Preto 1588, Santo Agostinho. Tel: (31) 3462-6992. elegancesalon.com.br",
    criadoEm: "28/05/2026",
    atualizadoEm: "28/05/2026",
  },
  {
    id: "lead-2",
    negocio: "Ei, Beleza? LAB.",
    responsavel: "Não identificado",
    setor: "Beleza",
    icp: "A",
    status: "Frio",
    canal: "DM Instagram",
    contato: { instagram: "@lojaeibeleza" },
    sinalDeDor:
      "Site lojaeibeleza.com.br fora do ar. 14K seguidores. Vende por WhatsApp sem funil. Loja física em Savassi.",
    acoesFeitas: [],
    proximasAcoes: [
      "📱 Enviar DM no Instagram @lojaeibeleza",
      "🎯 Oferecer Raio-X de Conversão (15 min)",
    ],
    scripts: {
      dm: `Oi, tudo bem?\n\nPassei pelo site de vocês agora e estava fora do ar. Para uma loja com 14 mil seguidores que vende cosméticos online, isso é venda perdida em tempo real.\n\nFaço um diagnóstico rápido (15 min, sem compromisso) onde mostro o que está travando o digital de vocês de converter de verdade.\n\nToparia conversar?\n\nIsabella, ClickConverte`,
    },
    notas: "Fundada 2021. Rua Sergipe 1233 Loja 4, Savassi. CNPJ: 43.207.914/0001-30.",
    criadoEm: "28/05/2026",
    atualizadoEm: "28/05/2026",
  },
  {
    id: "lead-3",
    negocio: "Casa Blessed BH",
    responsavel: "Brenda Azevedo",
    setor: "Beleza",
    icp: "B",
    status: "Frio",
    canal: "WhatsApp",
    contato: { whatsapp: "(31) 99649-8715", instagram: "@casablessedbh" },
    sinalDeDor:
      "25 anos de mercado, 12K seguidores, sem site próprio. Autoridade offline que não converte no digital.",
    acoesFeitas: [],
    proximasAcoes: [
      "💬 WhatsApp para Brenda: (31) 99649-8715",
      "🎯 Oferecer Raio-X de Conversão (15 min)",
    ],
    scripts: {
      whatsapp: `Oi Brenda, tudo bem?\n\nVi o perfil do Casa Blessed — 25 anos de história, reputação sólida, 12 mil seguidores. Mas quem pesquisa no Google e nunca foi lá não encontra quase nada além do Instagram.\n\nUm negócio com essa trajetória merece uma presença digital à altura.\n\nFaço um diagnóstico rápido (15 min, sem compromisso) onde mostro como transformar essa autoridade em clientes novos pelo digital. Toparia conversar?\n\nIsabella, ClickConverte`,
    },
    notas: "Rua Juruá 330, BH. Tel: (31) 2514-4418.",
    criadoEm: "28/05/2026",
    atualizadoEm: "28/05/2026",
  },
  {
    id: "lead-4",
    negocio: "Salão Estúdio A",
    responsavel: "Não identificado",
    setor: "Beleza",
    icp: "B",
    status: "Frio",
    canal: "WhatsApp",
    contato: { whatsapp: "(31) 9902-8880", instagram: "@salaoestudioa" },
    sinalDeDor:
      "Sem site próprio — usa Trinks (plataforma genérica com taxa por agendamento, sem identidade do salão).",
    acoesFeitas: [],
    proximasAcoes: [
      "💬 WhatsApp: (31) 9902-8880",
      "🎯 Oferecer Raio-X de Conversão (15 min)",
    ],
    scripts: {
      whatsapp: `Oi, tudo bem?\n\nVi que o Estúdio A usa o Trinks para agendamentos — funciona, mas todo agendamento passa por uma plataforma genérica, sem a cara do salão, e o cliente não fica com vocês.\n\nDá pra ter isso dentro de uma página própria de vocês, sem pagar taxa por agendamento e sem depender de plataforma de terceiro.\n\nFaço um diagnóstico rápido (15 min, sem compromisso) pra mostrar como ficaria na prática. Toparia?\n\nIsabella, ClickConverte`,
    },
    notas: "Av. Américo Vespúcio 926, Aparecida, BH. Tel: (31) 3564-7958. trinks.com/salaoestudioa",
    criadoEm: "28/05/2026",
    atualizadoEm: "28/05/2026",
  },
  {
    id: "lead-5",
    negocio: "Studio Beleza & Companhia",
    responsavel: "Não identificado",
    setor: "Beleza",
    icp: "C",
    status: "Frio",
    canal: "DM Instagram",
    contato: { instagram: "@belezaecompanhia" },
    sinalDeDor:
      "Sem site, sem email público. Agendamento 100% via WhatsApp — perde clientes fora do horário de atendimento.",
    acoesFeitas: [],
    proximasAcoes: [
      "📱 DM Instagram @belezaecompanhia",
      "✔️ Confirmar contato antes de avançar",
      "🎯 Oferecer Raio-X de Conversão (15 min)",
    ],
    scripts: {
      dm: `Oi, tudo bem?\n\nVi o perfil do Studio Beleza & Companhia — agendamento 100% pelo WhatsApp funciona, mas você provavelmente perde cliente fora do horário de atendimento, quando ninguém responde.\n\nCom uma página simples de conversão, o agendamento acontece mesmo enquanto você está atendendo.\n\nFaço um diagnóstico rápido (15 min, sem compromisso) pra mostrar como ficaria. Toparia?\n\nIsabella, ClickConverte`,
    },
    notas: "Jardim América, BH. Ter-Sáb 9h-19h.",
    criadoEm: "28/05/2026",
    atualizadoEm: "28/05/2026",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function todayStr() {
  return new Date().toLocaleDateString("pt-BR")
}

// ─── Supabase mapping ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDb(row: any): Lead {
  return {
    id: row.id,
    negocio: row.negocio,
    responsavel: row.responsavel,
    setor: row.setor,
    icp: row.icp,
    status: row.status,
    canal: row.canal,
    contato: row.contato,
    sinalDeDor: row.sinal_de_dor,
    acoesFeitas: row.acoes_feitas,
    proximasAcoes: row.proximas_acoes,
    scripts: row.scripts,
    notas: row.notas,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  }
}

function toDb(l: Lead) {
  return {
    id: l.id,
    negocio: l.negocio,
    responsavel: l.responsavel,
    setor: l.setor,
    icp: l.icp,
    status: l.status,
    canal: l.canal,
    contato: l.contato,
    sinal_de_dor: l.sinalDeDor,
    acoes_feitas: l.acoesFeitas,
    proximas_acoes: l.proximasAcoes,
    scripts: l.scripts,
    notas: l.notas,
    criado_em: l.criadoEm,
    atualizado_em: l.atualizadoEm,
  }
}

// ─── Storage hook ─────────────────────────────────────────────────────────────

function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("crm_leads")
        .select("*")
        .order("criado_em", { ascending: false })

      if (error || !data) {
        // Fallback para localStorage se Supabase falhar
        try {
          const raw = localStorage.getItem("cc_crm_v1")
          setLeads(raw ? JSON.parse(raw) : INITIAL_LEADS)
        } catch {
          setLeads(INITIAL_LEADS)
        }
        setReady(true)
        return
      }

      if (data.length === 0) {
        // Banco vazio: migra dados do localStorage (ou usa os iniciais)
        let seed: Lead[]
        try {
          const raw = localStorage.getItem("cc_crm_v1")
          seed = raw ? JSON.parse(raw) : INITIAL_LEADS
        } catch {
          seed = INITIAL_LEADS
        }
        if (seed.length > 0) {
          await supabase.from("crm_leads").insert(seed.map(toDb))
          localStorage.removeItem("cc_crm_v1")
        }
        setLeads(seed)
      } else {
        setLeads(data.map(fromDb))
      }
      setReady(true)
    }
    load()
  }, [])

  const upsert = useCallback((lead: Lead) => {
    setLeads((prev) =>
      prev.find((l) => l.id === lead.id)
        ? prev.map((l) => (l.id === lead.id ? lead : l))
        : [...prev, lead]
    )
    supabase.from("crm_leads").upsert(toDb(lead))
  }, [])

  const remove = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id))
    supabase.from("crm_leads").delete().eq("id", id)
  }, [])

  return { leads, ready, upsert, remove }
}

// ─── Small components ─────────────────────────────────────────────────────────

function StatusBadge({ status, small }: { status: Status; small?: boolean }) {
  const m = STATUS_META[status]
  return (
    <span
      style={{
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.color}44`,
        borderRadius: 999,
        padding: small ? "2px 8px" : "3px 11px",
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        whiteSpace: "nowrap" as const,
      }}
    >
      {m.emoji} {status}
    </span>
  )
}

function ICPBadge({ icp }: { icp: ICP }) {
  return (
    <span
      style={{
        color: ICP_COLOR[icp],
        border: `1px solid ${ICP_COLOR[icp]}66`,
        borderRadius: 4,
        padding: "1px 7px",
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      ICP {icp}
    </span>
  )
}

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      onClick={() =>
        navigator.clipboard.writeText(text).then(() => {
          setDone(true)
          setTimeout(() => setDone(false), 2200)
        })
      }
      style={{
        background: done ? "rgba(76,175,80,0.15)" : "rgba(207,181,59,0.12)",
        color: done ? "#4caf50" : "#cfb53b",
        border: `1px solid ${done ? "#4caf5044" : "#cfb53b44"}`,
        borderRadius: 7,
        padding: "7px 14px",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      {done ? "✓ Copiado!" : `📋 Copiar ${label}`}
    </button>
  )
}

// ─── Lead Drawer ──────────────────────────────────────────────────────────────

type DrawerTab = "resumo" | "acoes" | "scripts" | "notas"

function LeadDrawer({
  lead,
  onClose,
  onUpdate,
  onDelete,
}: {
  lead: Lead
  onClose: () => void
  onUpdate: (l: Lead) => void
  onDelete: (id: string) => void
}) {
  const [tab, setTab] = useState<DrawerTab>("resumo")
  const [notas, setNotas] = useState(lead.notas)
  const [newFeita, setNewFeita] = useState("")
  const [newTodo, setNewTodo] = useState("")
  const [statusMenu, setStatusMenu] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  // Keep local notas in sync when lead changes externally
  useEffect(() => setNotas(lead.notas), [lead.notas])

  const update = (patch: Partial<Lead>) =>
    onUpdate({ ...lead, ...patch, atualizadoEm: todayStr() })

  const addFeita = () => {
    if (!newFeita.trim()) return
    update({ acoesFeitas: [...lead.acoesFeitas, newFeita.trim()] })
    setNewFeita("")
  }

  const addTodo = () => {
    if (!newTodo.trim()) return
    update({ proximasAcoes: [...lead.proximasAcoes, newTodo.trim()] })
    setNewTodo("")
  }

  const tabs: { id: DrawerTab; label: string }[] = [
    { id: "resumo", label: "Resumo" },
    { id: "acoes", label: "Ações" },
    { id: "scripts", label: "Scripts" },
    { id: "notas", label: "Notas" },
  ]

  const inputStyle: React.CSSProperties = {
    flex: 1,
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.72)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#161616",
          borderRadius: "18px 18px 0 0",
          border: "1px solid #2a2a2a",
          maxHeight: "91dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 2px" }}>
          <div style={{ width: 38, height: 4, background: "#333", borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{ padding: "8px 20px 14px", borderBottom: "1px solid #222" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <div>
              <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: 0 }}>
                {lead.negocio}
              </h2>
              <p style={{ color: "#777", fontSize: 13, margin: "3px 0 0" }}>
                {lead.responsavel} · {lead.setor}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                fontSize: 20,
                cursor: "pointer",
                padding: "0 4px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {/* Status (tappable → change) */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setStatusMenu((v) => !v)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                <StatusBadge status={lead.status} />
              </button>
              {statusMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    zIndex: 10,
                    background: "#1e1e1e",
                    border: "1px solid #333",
                    borderRadius: 10,
                    padding: 4,
                    minWidth: 185,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        update({ status: s })
                        setStatusMenu(false)
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        background: s === lead.status ? "#2a2a2a" : "none",
                        border: "none",
                        color: STATUS_META[s].color,
                        padding: "8px 12px",
                        fontSize: 13,
                        cursor: "pointer",
                        borderRadius: 6,
                      }}
                    >
                      {STATUS_META[s].emoji} {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ICPBadge icp={lead.icp} />
            <span style={{ color: "#666", fontSize: 12 }}>📡 {lead.canal}</span>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #222",
            background: "#0d0d0d",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: "11px 0",
                fontSize: 13,
                fontWeight: tab === t.id ? 700 : 500,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: tab === t.id ? "#cfb53b" : "#555",
                borderBottom: tab === t.id ? "2px solid #cfb53b" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ overflowY: "auto", flex: 1, padding: 20 }}>
          {/* ── Resumo ── */}
          {tab === "resumo" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <section>
                <SectionTitle color="#cfb53b">🎯 Sinal de Dor</SectionTitle>
                <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                  {lead.sinalDeDor}
                </p>
              </section>
              <section>
                <SectionTitle color="#cfb53b">📇 Contato</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {lead.contato.email && (
                    <span style={{ color: "#bbb", fontSize: 14 }}>📧 {lead.contato.email}</span>
                  )}
                  {lead.contato.whatsapp && (
                    <span style={{ color: "#bbb", fontSize: 14 }}>
                      💬 {lead.contato.whatsapp}
                    </span>
                  )}
                  {lead.contato.instagram && (
                    <span style={{ color: "#bbb", fontSize: 14 }}>
                      📸 {lead.contato.instagram}
                    </span>
                  )}
                </div>
              </section>
              <section>
                <SectionTitle color="#cfb53b">📌 Informações</SectionTitle>
                <p style={{ color: "#777", fontSize: 13, lineHeight: 1.55, margin: 0 }}>
                  {lead.notas || "—"}
                </p>
              </section>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ color: "#444", fontSize: 11 }}>Criado: {lead.criadoEm}</span>
                <span style={{ color: "#333", fontSize: 11 }}>·</span>
                <span style={{ color: "#444", fontSize: 11 }}>
                  Atualizado: {lead.atualizadoEm}
                </span>
              </div>
            </div>
          )}

          {/* ── Ações ── */}
          {tab === "acoes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {/* Feitas */}
              <section>
                <SectionTitle color="#4caf50">✅ Ações Feitas</SectionTitle>
                {lead.acoesFeitas.length === 0 && (
                  <p style={{ color: "#444", fontSize: 13 }}>Nenhuma ação registrada ainda.</p>
                )}
                {lead.acoesFeitas.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "rgba(76,175,80,0.08)",
                      border: "1px solid rgba(76,175,80,0.2)",
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: "#aaa", fontSize: 13, flex: 1 }}>{a}</span>
                    <button
                      onClick={() =>
                        update({
                          acoesFeitas: lead.acoesFeitas.filter((_, idx) => idx !== i),
                        })
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "#444",
                        cursor: "pointer",
                        fontSize: 16,
                        marginLeft: 8,
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    value={newFeita}
                    onChange={(e) => setNewFeita(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFeita()}
                    placeholder="Registrar ação feita..."
                    style={inputStyle}
                  />
                  <AddBtn onClick={addFeita} />
                </div>
              </section>

              {/* Próximas */}
              <section>
                <SectionTitle color="#e8913f">⏳ Próximas Ações</SectionTitle>
                {lead.proximasAcoes.length === 0 && (
                  <p style={{ color: "#444", fontSize: 13 }}>Nenhuma ação pendente.</p>
                )}
                {lead.proximasAcoes.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "rgba(232,145,63,0.08)",
                      border: "1px solid rgba(232,145,63,0.2)",
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: "#ccc", fontSize: 13, flex: 1 }}>{a}</span>
                    <button
                      onClick={() =>
                        update({
                          proximasAcoes: lead.proximasAcoes.filter((_, idx) => idx !== i),
                        })
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "#444",
                        cursor: "pointer",
                        fontSize: 16,
                        marginLeft: 8,
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    placeholder="Adicionar próxima ação..."
                    style={inputStyle}
                  />
                  <AddBtn onClick={addTodo} />
                </div>
              </section>
            </div>
          )}

          {/* ── Scripts ── */}
          {tab === "scripts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {!lead.scripts.email && !lead.scripts.whatsapp && !lead.scripts.dm && (
                <p style={{ color: "#444", fontSize: 14 }}>Nenhum script cadastrado.</p>
              )}
              {lead.scripts.email && (
                <ScriptBlock
                  title="📧 Email"
                  titleColor="#cfb53b"
                  label="Email"
                  text={lead.scripts.email}
                />
              )}
              {lead.scripts.whatsapp && (
                <ScriptBlock
                  title="💬 WhatsApp"
                  titleColor="#4caf50"
                  label="WhatsApp"
                  text={lead.scripts.whatsapp}
                />
              )}
              {lead.scripts.dm && (
                <ScriptBlock
                  title="📸 DM Instagram"
                  titleColor="#9b7fd4"
                  label="DM"
                  text={lead.scripts.dm}
                />
              )}
            </div>
          )}

          {/* ── Notas ── */}
          {tab === "notas" && (
            <div>
              <SectionTitle color="#cfb53b">📝 Notas livres</SectionTitle>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Observações, próximos passos, histórico..."
                style={{
                  width: "100%",
                  minHeight: 190,
                  background: "#0d0d0d",
                  border: "1px solid #2a2a2a",
                  borderRadius: 10,
                  padding: 14,
                  color: "#ccc",
                  fontSize: 14,
                  lineHeight: 1.65,
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => update({ notas })}
                  style={{
                    background: "#cfb53b",
                    color: "#000",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Salvar
                </button>
                {!confirmDel ? (
                  <button
                    onClick={() => setConfirmDel(true)}
                    style={{
                      background: "rgba(200,50,50,0.08)",
                      color: "#e05555",
                      border: "1px solid rgba(200,50,50,0.25)",
                      borderRadius: 8,
                      padding: "10px 16px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Excluir lead
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => {
                        onDelete(lead.id)
                        onClose()
                      }}
                      style={{
                        background: "#c0392b",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 16px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setConfirmDel(false)}
                      style={{
                        background: "#2a2a2a",
                        color: "#777",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 14px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Add Lead Modal ───────────────────────────────────────────────────────────

function AddLeadModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (l: Lead) => void
}) {
  const [negocio, setNegocio] = useState("")
  const [responsavel, setResponsavel] = useState("")
  const [setor, setSetor] = useState<Setor>("Beleza")
  const [icp, setIcp] = useState<ICP>("B")
  const [status, setStatus] = useState<Status>("Frio")
  const [canal, setCanal] = useState<Canal>("WhatsApp")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [instagram, setInstagram] = useState("")
  const [sinalDeDor, setSinalDeDor] = useState("")
  const [script, setScript] = useState("")
  const [notas, setNotas] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!negocio.trim()) return

    const scripts: Lead["scripts"] = {}
    if (script.trim()) {
      if (canal === "Email") scripts.email = script.trim()
      else if (canal === "WhatsApp") scripts.whatsapp = script.trim()
      else scripts.dm = script.trim()
    }

    onAdd({
      id: uid(),
      negocio: negocio.trim(),
      responsavel: responsavel.trim() || "Não identificado",
      setor,
      icp,
      status,
      canal,
      contato: {
        email: email.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        instagram: instagram.trim() || undefined,
      },
      sinalDeDor: sinalDeDor.trim(),
      acoesFeitas: [],
      proximasAcoes: [],
      scripts,
      notas: notas.trim(),
      criadoEm: todayStr(),
      atualizadoEm: todayStr(),
    })
    onClose()
  }

  const inp: React.CSSProperties = {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.72)",
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#161616",
          borderRadius: "18px 18px 0 0",
          border: "1px solid #2a2a2a",
          maxHeight: "91dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 2px" }}>
          <div style={{ width: 38, height: 4, background: "#333", borderRadius: 2 }} />
        </div>
        <div
          style={{
            padding: "8px 20px 14px",
            borderBottom: "1px solid #222",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: 0 }}>Novo Lead</h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#555",
              fontSize: 20,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <FormField label="Nome do negócio *">
            <input required style={inp} value={negocio} onChange={(e) => setNegocio(e.target.value)} placeholder="Ex: Salão da Carla" />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Responsável">
              <input style={inp} value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Nome" />
            </FormField>
            <FormField label="Setor">
              <select style={{ ...inp, cursor: "pointer" }} value={setor} onChange={(e) => setSetor(e.target.value as Setor)}>
                {SETORES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <FormField label="ICP">
              <select style={{ ...inp, cursor: "pointer" }} value={icp} onChange={(e) => setIcp(e.target.value as ICP)}>
                {(["A", "B", "C", "D"] as ICP[]).map((v) => <option key={v}>{v}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...inp, cursor: "pointer" }} value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Canal">
              <select style={{ ...inp, cursor: "pointer" }} value={canal} onChange={(e) => setCanal(e.target.value as Canal)}>
                {CANAIS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Contato">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input style={inp} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="📧 Email" />
              <input style={inp} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="💬 WhatsApp" />
              <input style={inp} value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="📸 @instagram" />
            </div>
          </FormField>

          <FormField label="Sinal de dor">
            <textarea style={{ ...inp, minHeight: 72, resize: "vertical" }} value={sinalDeDor} onChange={(e) => setSinalDeDor(e.target.value)} placeholder="O que indica que o digital não está convertendo?" />
          </FormField>

          <FormField label="Script de abordagem">
            <textarea style={{ ...inp, minHeight: 100, resize: "vertical" }} value={script} onChange={(e) => setScript(e.target.value)} placeholder="Cole o script de DM, WhatsApp ou email aqui..." />
          </FormField>

          <FormField label="Notas">
            <textarea style={{ ...inp, minHeight: 56, resize: "vertical" }} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Endereço, telefone, observações..." />
          </FormField>
        </div>

        <div style={{ padding: "14px 20px", borderTop: "1px solid #222" }}>
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#cfb53b",
              color: "#000",
              border: "none",
              borderRadius: 10,
              padding: 14,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Salvar Lead
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Lead Card ────────────────────────────────────────────────────────────────

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const next = lead.proximasAcoes[0]
  return (
    <div
      onClick={onClick}
      style={{
        background: "#161616",
        border: "1px solid #242424",
        borderLeft: `3px solid ${STATUS_META[lead.status].color}`,
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "background 0.12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1c1c1c")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#161616")}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              margin: "0 0 2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {lead.negocio}
          </h3>
          <p style={{ color: "#666", fontSize: 12, margin: 0 }}>
            {lead.responsavel} · {lead.setor}
          </p>
        </div>
        <ICPBadge icp={lead.icp} />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: next ? 10 : 0 }}>
        <StatusBadge status={lead.status} small />
        <span style={{ color: "#555", fontSize: 11 }}>📡 {lead.canal}</span>
        {(lead.scripts.email || lead.scripts.whatsapp || lead.scripts.dm) && (
          <span style={{ color: "#444", fontSize: 11 }}>📋 Scripts</span>
        )}
      </div>

      {next && (
        <div
          style={{
            background: "rgba(232,145,63,0.07)",
            border: "1px solid rgba(232,145,63,0.18)",
            borderRadius: 7,
            padding: "6px 10px",
          }}
        >
          <p
            style={{
              color: "#c47830",
              fontSize: 12,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {next}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Micro components ─────────────────────────────────────────────────────────

function SectionTitle({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <h3
      style={{
        color,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1,
        margin: "0 0 10px",
      }}
    >
      {children}
    </h3>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          color: "#777",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "#cfb53b",
        color: "#000",
        border: "none",
        borderRadius: 8,
        padding: "9px 16px",
        fontSize: 18,
        fontWeight: 700,
        cursor: "pointer",
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      +
    </button>
  )
}

function ScriptBlock({
  title,
  titleColor,
  label,
  text,
}: {
  title: string
  titleColor: string
  label: string
  text: string
}) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <SectionTitle color={titleColor}>{title}</SectionTitle>
        <CopyBtn text={text} label={label} />
      </div>
      <pre
        style={{
          background: "#0d0d0d",
          border: "1px solid #222",
          borderRadius: 10,
          padding: 14,
          color: "#bbb",
          fontSize: 13,
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          margin: 0,
        }}
      >
        {text}
      </pre>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CRMPage() {
  const { leads, ready, upsert, remove } = useLeads()
  const [filter, setFilter] = useState<Status | "Todos">("Todos")
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = leads.filter((l) => {
    if (filter !== "Todos" && l.status !== filter) return false
    const q = search.toLowerCase()
    if (q && !l.negocio.toLowerCase().includes(q) && !l.responsavel.toLowerCase().includes(q))
      return false
    return true
  })

  const selectedLead = selectedId ? leads.find((l) => l.id === selectedId) ?? null : null

  const counts: Record<string, number> = { Todos: leads.length }
  for (const s of STATUSES) counts[s] = leads.filter((l) => l.status === s).length

  if (!ready)
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#0d0d0d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            border: "3px solid #333",
            borderTopColor: "#cfb53b",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0d0d0d",
        fontFamily: "var(--font-manrope), system-ui, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: "#111",
          borderBottom: "1px solid #1e1e1e",
          padding: "10px 16px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image
              src="/logo.png"
              alt="ClickConverte"
              width={130}
              height={32}
              style={{ height: 26, width: "auto", objectFit: "contain" }}
              priority
            />
            <span
              style={{
                color: "#444",
                fontSize: 12,
                fontWeight: 600,
                borderLeft: "1px solid #2a2a2a",
                paddingLeft: 10,
              }}
            >
              Pipeline
            </span>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: "#cfb53b",
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + Lead
          </button>
        </div>
      </header>

      {/* ── Status filter bar ── */}
      <div
        style={{
          background: "#111",
          borderBottom: "1px solid #1a1a1a",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: 640,
            margin: "0 auto",
            padding: "0 8px",
          }}
        >
          {/* Todos */}
          <FilterBtn
            label={`Todos (${counts.Todos})`}
            active={filter === "Todos"}
            onClick={() => setFilter("Todos")}
          />
          {STATUSES.map((s) => (
            <FilterBtn
              key={s}
              label={`${STATUS_META[s].emoji} ${s}${counts[s] ? ` (${counts[s]})` : ""}`}
              active={filter === s}
              onClick={() => setFilter(s)}
            />
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "12px 16px 4px" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar por nome ou responsável..."
          style={{
            width: "100%",
            background: "#1a1a1a",
            border: "1px solid #282828",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#ddd",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* ── Lead list ── */}
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "8px 16px 90px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "#3a3a3a", fontSize: 14 }}>
              {leads.length === 0
                ? "Nenhum lead ainda."
                : "Nenhum lead com esse filtro."}
            </p>
            {leads.length === 0 && (
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  background: "#cfb53b",
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: 12,
                }}
              >
                Adicionar primeiro lead
              </button>
            )}
          </div>
        ) : (
          filtered.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedId(lead.id)} />
          ))
        )}
      </div>

      {/* ── FAB ── */}
      <button
        onClick={() => setShowAdd(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 20,
          background: "#cfb53b",
          color: "#000",
          border: "none",
          borderRadius: "50%",
          width: 54,
          height: 54,
          fontSize: 26,
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(207,181,59,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
          lineHeight: 1,
        }}
      >
        +
      </button>

      {/* ── Lead Drawer ── */}
      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedId(null)}
          onUpdate={(l) => upsert(l)}
          onDelete={(id) => {
            remove(id)
            setSelectedId(null)
          }}
        />
      )}

      {/* ── Add Lead Modal ── */}
      {showAdd && (
        <AddLeadModal
          onClose={() => setShowAdd(false)}
          onAdd={(l) => {
            upsert(l)
            setShowAdd(false)
          }}
        />
      )}
    </div>
  )
}

function FilterBtn({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "10px 10px",
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        color: active ? "#cfb53b" : "#555",
        borderBottom: active ? "2px solid #cfb53b" : "2px solid transparent",
        whiteSpace: "nowrap",
        transition: "color 0.12s",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  )
}
