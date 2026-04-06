"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealByWordProps {
  text: string
  className?: string
  color?: string
}

export function TextRevealByWord({
  text,
  className,
  color = "#324b67",
}: TextRevealByWordProps) {
  const words = text.split(" ")

  return (
    <div className={cn("max-w-4xl mx-auto px-4 py-8", className)}>
      <motion.p
        className="flex flex-wrap text-2xl font-display md:text-3xl lg:text-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.04 }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="mx-1 lg:mx-2"
            style={{ color }}
            variants={{
              hidden: { opacity: 0.2 },
              visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    </div>
  )
}
