"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from 'lucide-react'

const revealVariants = {
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
  hidden: {
    opacity: 0,
    y: 15,
  },
}

function HeroSection() {
  const heroRef = useRef(null)

  return (
    <section ref={heroRef} className="min-h-[80vh] px-4 py-16 max-w-5xl mx-auto flex flex-col justify-center items-center text-center relative overflow-hidden rounded-3xl mb-24">
      <motion.h1
        initial="hidden"
        animate="visible"
        custom={0}
        variants={revealVariants}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-2xl"
      >
        Create Eye-Catching Thumbnails with AI
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        custom={1}
        variants={revealVariants}
        className="text-muted-foreground mb-8 max-w-xl text-lg md:text-xl"
      >
        Transform your content with professional-looking thumbnails. Our AI-powered generator makes it easy to create stunning visuals that grab attention.
      </motion.p>

      <motion.div 
        initial="hidden"
        animate="visible"
        custom={2}
        variants={revealVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md inline-flex items-center justify-center hover:bg-primary/90 transition-colors font-medium">
          Try Generator <ArrowRight className="ml-2 h-4 w-4" />
        </button>
        <button className="px-6 py-3 border border-input text-foreground hover:bg-accent hover:text-accent-foreground rounded-md inline-flex items-center justify-center transition-colors">
          Learn More
        </button>
      </motion.div>
    </section>
  )
}

export default HeroSection
