"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TextRevealByWord } from "@/components/ui/text-reveal"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"

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

const values = [
  {
    title: "Estratégia antes de execução",
    desc: "Nunca criamos antes de entender. Cada peça de conteúdo, cada campanha, cada decisão criativa é precedida por um diagnóstico real do seu mercado, do seu posicionamento e do seu cliente.",
  },
  {
    title: "Resultado mensurável",
    desc: "Marketing que não converte é custo. Por isso cada ação que entregamos tem métricas claras: leads gerados, vendas realizadas, autoridade construída. Se não move o negócio, não fazemos.",
  },
  {
    title: "Design com propósito",
    desc: "Minimalismo não é falta de criatividade, é respeito pelo tempo do seu cliente. Criamos identidades e materiais que comunicam com clareza, sem ruído, sem exagero.",
  },
  {
    title: "Parceria de longo prazo",
    desc: "Não somos uma agência que entrega e some. Acompanhamos, ajustamos e evoluímos junto com o seu negócio. Crescemos quando você cresce.",
  },
]

export default function SobrePage() {
  return (
    <>
      <SiteHeader basePath="/" />
      <main>
        {/* Hero da página */}
        <section className="relative min-h-[60vh] bg-surface flex items-end pb-0 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-0">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs uppercase tracking-[0.2em] text-accent font-headline font-bold mb-6 block"
            >
              Sobre
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display italic text-primary leading-[1.08] font-medium max-w-4xl mb-12"
            >
              Sobre a ClickConverte
            </motion.h1>
          </div>
        </section>

        {/* Manifesto */}
        <TextRevealByWord
          text="A ClickConverte nasceu da crença de que marketing bom não precisa ser barulhento para ser eficaz. Operando 100% online a partir de Belo Horizonte, ajudamos marcas a construírem autoridade real através de uma abordagem estratégica e design minimalista. No nosso atelier digital, cada detalhe é pensado para eliminar o ruído e focar no que realmente importa: a conexão genuína entre o seu serviço e quem precisa dele."
        />

        {/* O que nos diferencia */}
        <section className="py-14 md:py-20 px-6 md:px-12 bg-[#faf9f4]">
          <div className="max-w-7xl mx-auto">
            <FadeUp>
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-headline font-bold mb-6 block">
                Nossos valores
              </span>
              <h2 className="text-4xl md:text-5xl font-display text-primary font-medium mb-16 max-w-xl">
                O que guia cada decisão que tomamos
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {values.map((v, i) => (
                <FadeUp key={v.title} delay={i * 0.1}>
                  <div className="border-l-4 border-accent pl-8">
                    <h3 className="text-xl font-headline font-semibold text-primary mb-4">
                      {v.title}
                    </h3>
                    <p className="text-primary/70 font-body leading-relaxed text-sm md:text-base">
                      {v.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Quem está por trás */}
        <section className="py-14 md:py-20 px-6 md:px-12 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
              <FadeUp>
                <span className="text-xs uppercase tracking-[0.2em] text-accent font-headline font-bold mb-6 block">
                  Fundadora
                </span>
                <h2 className="text-4xl md:text-5xl font-display italic text-primary mb-8">
                  Isabella Melilo
                </h2>
                <p className="text-primary/70 font-body leading-relaxed text-base mb-6">
                  À frente da ClickConverte, Isabella construiu uma agência que pensa diferente: menos barulho, mais estratégia. Com experiência prática em branding, gestão de conteúdo e performance digital, ela lidera cada projeto com o compromisso de transformar presença online em resultado concreto para o cliente.
                </p>
                <p className="text-primary/70 font-body leading-relaxed text-base">
                  Baseada em Belo Horizonte e operando 100% online, a ClickConverte atende marcas em todo o Brasil que cansaram de investir em marketing sem retorno.
                </p>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div className="bg-primary/5 border border-primary/10 p-10 md:p-12">
                  <p className="text-primary/50 font-body text-xs uppercase tracking-[0.2em] mb-6">
                    Em números
                  </p>
                  <div className="space-y-8">
                    <div>
                      <span className="text-5xl font-display font-medium text-accent block mb-1">100%</span>
                      <span className="text-sm font-headline text-primary/60">Online, atendemos todo o Brasil</span>
                    </div>
                    <div>
                      <span className="text-5xl font-display font-medium text-accent block mb-1">+3</span>
                      <span className="text-sm font-headline text-primary/60">Anos de experiência em marketing digital</span>
                    </div>
                    <div>
                      <span className="text-5xl font-display font-medium text-accent block mb-1">7</span>
                      <span className="text-sm font-headline text-primary/60">Serviços especializados disponíveis</span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 md:px-12 bg-primary">
          <div className="max-w-7xl mx-auto text-center">
            <FadeUp>
              <h2 className="text-4xl md:text-6xl font-display text-white font-medium mb-8 leading-tight">
                Pronto para transformar cliques em conversões?
              </h2>
              <p className="text-accent/80 font-body text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                Uma conversa sem compromisso para entender o seu negócio e o que faz sentido para o seu momento.
              </p>
              <Link
                href="/#contato"
                className="inline-block bg-accent text-[#0d1520] px-12 py-5 font-headline font-semibold text-sm tracking-widest uppercase rounded-none hover:-translate-y-0.5 transition-all duration-200 hover:bg-accent/90"
              >
                Fale com a gente
              </Link>
            </FadeUp>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
