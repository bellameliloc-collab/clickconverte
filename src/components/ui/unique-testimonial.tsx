"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { UserCircle } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote: "Antes da ClickConverte eu tinha qualidade no meu serviço, mas zero visibilidade. Em três meses minha agenda estava lotada com clientes que chegaram já sabendo exatamente o que eu entrego.",
    author: "Rafael M.",
    role: "Prestador de serviços · Belo Horizonte",
  },
  {
    id: 2,
    quote: "Passei dois anos criando conteúdo sem resultado. A ClickConverte me fez entender que eu não tinha estratégia, tinha apenas publicações. A diferença nos números foi imediata e mensurável.",
    author: "Camila R.",
    role: "E-commerce de moda · MG",
  },
  {
    id: 3,
    quote: "Uma sessão de consultoria foi suficiente para reorganizar toda a minha comunicação. Hoje sei exatamente para quem estou falando e como transformar atenção em receita real.",
    author: "Bruno A.",
    role: "Consultor de negócios",
  },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0].quote)
  const [displayedRole, setDisplayedRole] = useState(testimonials[0].role)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setDisplayedQuote(testimonials[index].quote)
      setDisplayedRole(testimonials[index].role)
      setActiveIndex(index)
      setTimeout(() => setIsAnimating(false), 400)
    }, 200)
  }

  return (
    <div className="flex flex-col items-center gap-10 py-16">
      <div className="relative px-8">
        <span className="absolute -left-2 -top-6 text-7xl font-serif text-[#f4f2eb]/10 select-none pointer-events-none">
          &ldquo;
        </span>

        <p
          className={cn(
            "text-2xl md:text-3xl font-display italic text-[#f4f2eb] text-center max-w-2xl leading-relaxed transition-all duration-400 ease-out",
            isAnimating ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100",
          )}
        >
          {displayedQuote}
        </p>

        <span className="absolute -right-2 -bottom-8 text-7xl font-serif text-[#f4f2eb]/10 select-none pointer-events-none">
          &rdquo;
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 mt-2">
        <p
          className={cn(
            "text-xs text-[#f4f2eb]/50 tracking-[0.2em] uppercase font-headline transition-all duration-500 ease-out",
            isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
          )}
        >
          {displayedRole}
        </p>

        <div className="flex items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index
            const isHovered = hoveredIndex === index && !isActive
            const showName = isActive || isHovered

            return (
              <button
                key={testimonial.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex items-center gap-0 rounded-full cursor-pointer",
                  "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive ? "bg-[#f4f2eb] shadow-lg" : "bg-transparent hover:bg-[#f4f2eb]/10",
                  showName ? "pr-4 pl-2 py-2" : "p-0.5",
                )}
              >
                <div
                  className={cn(
                    "relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    "transition-all duration-500",
                    isActive ? "bg-primary/10 ring-2 ring-accent/50" : "bg-[#f4f2eb]/10",
                  )}
                >
                  <UserCircle
                    className={cn(
                      "w-7 h-7 transition-colors duration-300",
                      isActive ? "text-primary" : "text-[#f4f2eb]/60",
                    )}
                    strokeWidth={1.2}
                  />
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName ? "grid-cols-[1fr] opacity-100 ml-2" : "grid-cols-[0fr] opacity-0 ml-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "text-sm font-headline font-medium whitespace-nowrap block",
                        "transition-colors duration-300",
                        isActive ? "text-primary" : "text-[#f4f2eb]",
                      )}
                    >
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
