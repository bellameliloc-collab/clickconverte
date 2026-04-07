"use client"

import { cn } from "@/lib/utils"
import React, { ReactNode } from "react"

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
  showRadialGradient?: boolean
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative min-h-screen bg-[#f4f2eb] text-[#1b1c18]",
        className
      )}
      {...props}
    >
      {/* Aurora effect layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            "[--white-gradient:repeating-linear-gradient(100deg,#f4f2eb_0%,#f4f2eb_7%,transparent_10%,transparent_12%,#f4f2eb_16%)]",
            "[--aurora:repeating-linear-gradient(100deg,#324b67_10%,#cfb53b_15%,#324b67_20%,#f4f2eb_25%,#324b67_30%)]",
            "[background-image:var(--white-gradient),var(--aurora)]",
            "[background-size:300%,_200%]",
            "[background-position:50%_50%,50%_50%]",
            "filter blur-[10px] invert",
            "after:content-[''] after:absolute after:inset-0",
            "after:[background-image:var(--white-gradient),var(--aurora)]",
            "after:[background-size:200%,_100%]",
            "after:animate-aurora",
            "after:[background-attachment:fixed]",
            "after:mix-blend-difference",
            "absolute -inset-[10px] opacity-20 will-change-transform",
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
          )}
        />
      </div>
      {children}
    </div>
  )
}
