"use client"

import React from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface TimelineContentProps {
  as: React.ElementType
  animationNum: number
  timelineRef: React.RefObject<HTMLElement>
  variants: any
  className?: string
  children: React.ReactNode
}

export function TimelineContent({
  as: Component,
  animationNum,
  timelineRef,
  variants,
  className = "",
  children,
  ...props
}: TimelineContentProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  })

  return (
    <motion.div
      ref={ref}
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
} 