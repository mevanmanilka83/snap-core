"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface Position {
  x: number
  y: number
}

interface RenderPosition {
  dot: Position
  border: Position
}

const DOT_SMOOTHNESS = 0.2
const BORDER_DOT_SMOOTHNESS = 0.1
const INTERACTIVE_SELECTORS = "a, button, img, input, textarea, select"

export default function SmoothFollower() {
  const mousePosition = useRef<Position>({ x: 0, y: 0 })
  const dotPosition = useRef<Position>({ x: 0, y: 0 })
  const borderDotPosition = useRef<Position>({ x: 0, y: 0 })
  const animationFrameRef = useRef<number | undefined>(undefined)

  const [renderPos, setRenderPos] = useState<RenderPosition>({
    dot: { x: 0, y: 0 },
    border: { x: 0, y: 0 },
  })
  const [isHovering, setIsHovering] = useState(false)

  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }, [])

  const animate = useCallback(() => {
    dotPosition.current.x = lerp(dotPosition.current.x, mousePosition.current.x, DOT_SMOOTHNESS)
    dotPosition.current.y = lerp(dotPosition.current.y, mousePosition.current.y, DOT_SMOOTHNESS)

    borderDotPosition.current.x = lerp(borderDotPosition.current.x, mousePosition.current.x, BORDER_DOT_SMOOTHNESS)
    borderDotPosition.current.y = lerp(borderDotPosition.current.y, mousePosition.current.y, BORDER_DOT_SMOOTHNESS)

    setRenderPos({
      dot: { ...dotPosition.current },
      border: { ...borderDotPosition.current },
    })

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [lerp])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener("mousemove", handleMouseMove)

    const interactiveElements = document.querySelectorAll(INTERACTIVE_SELECTORS)
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter)
      element.addEventListener("mouseleave", handleMouseLeave)
    })

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter)
        element.removeEventListener("mouseleave", handleMouseLeave)
      })
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animate])

  if (typeof window === "undefined") return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className={cn(
          "absolute rounded-full transform -translate-x-1/2 -translate-y-1/2",
          "dark:bg-white bg-black"
        )}
        style={{
          width: "8px",
          height: "8px",
          left: `${renderPos.dot.x}px`,
          top: `${renderPos.dot.y}px`,
        }}
      />

      <div
        className={cn(
          "absolute rounded-full border transform -translate-x-1/2 -translate-y-1/2",
          "dark:border-white border-black",
          "transition-all duration-300 ease-in-out"
        )}
        style={{
          width: isHovering ? "44px" : "28px",
          height: isHovering ? "44px" : "28px",
          left: `${renderPos.border.x}px`,
          top: `${renderPos.border.y}px`,
        }}
      />
    </div>
  )
}
