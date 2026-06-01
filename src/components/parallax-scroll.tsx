"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const slides = [
  {
    src: "/images/scroll-04.png",
    alt: "Método ClickConverte",
    label: "Método",
  },
  {
    src: "/images/scroll-02.png",
    alt: "Identidade Visual ClickConverte",
    label: "Identidade",
  },
  {
    src: "/images/scroll-03.png",
    alt: "Resultado Digital ClickConverte",
    label: "Resultado",
  },
]

export function ParallaxScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".ps-panel")

      panels.forEach((panel) => {
        const img = panel.querySelector<HTMLElement>(".ps-img")
        if (!img) return

        gsap.fromTo(
          img,
          { yPercent: -18 },
          {
            yPercent: 18,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="ps-wrapper">
      <style>{`
        .ps-wrapper {
          width: 100%;
        }
        .ps-panel {
          position: relative;
          height: 100svh;
          overflow: hidden;
        }
        .ps-img {
          position: absolute;
          inset: -20% 0;
          width: 100%;
          height: 140%;
          object-fit: cover;
          object-position: center;
          will-change: transform;
        }
        .ps-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(13,21,32,0.18) 0%,
            rgba(13,21,32,0.05) 40%,
            rgba(13,21,32,0.35) 100%
          );
          z-index: 1;
        }
        .ps-label {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .ps-label-text {
          font-family: var(--font-poppins), sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(244,242,235,0.7);
          font-weight: 600;
        }
        .ps-label-line {
          width: 1px;
          height: 2rem;
          background: rgba(207,181,59,0.5);
        }
      `}</style>

      {slides.map((slide, i) => (
        <div key={i} className="ps-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ps-img"
            src={slide.src}
            alt={slide.alt}
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="ps-overlay" />
          <div className="ps-label">
            <span className="ps-label-text">{slide.label}</span>
            <div className="ps-label-line" />
          </div>
        </div>
      ))}
    </div>
  )
}
