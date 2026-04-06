"use client"

import { useEffect, useRef, RefObject } from "react"

export function useMousePositionRef(containerRef: RefObject<HTMLDivElement>) {
  const mousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mousePositionRef.current = {
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [containerRef])

  return mousePositionRef
}
