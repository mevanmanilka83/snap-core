"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from 'lucide-react'
import { WordPullUp } from "@/components/eldoraui/wordpullup"

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
  const isInView = useInView(heroRef, { amount: 0.3 })

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section ref={heroRef} className="min-h-[80vh] px-4 py-16 max-w-5xl mx-auto flex flex-col justify-center items-center text-center relative overflow-hidden rounded-3xl mb-24">
      <div className="min-h-[120px] flex items-center justify-center">
        <WordPullUp text="Create Perfect Thumbnails from Videos or Images" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 max-w-2xl" />
      </div>

      <motion.p
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={1}
        variants={revealVariants}
        className="text-muted-foreground mb-8 max-w-xl text-base sm:text-lg md:text-xl"
      >
        Upload images directly or capture frames from videos. Remove backgrounds, add text, and create stunning thumbnails - all processed locally in your browser for maximum privacy and speed.
      </motion.p>

      <motion.div 
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={2}
        variants={revealVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md inline-flex items-center justify-center hover:bg-primary/90 transition-colors text-sm sm:text-base font-medium">
          Start Creating <ArrowRight className="ml-2 h-4 w-4" />
        </button>
        <button 
          onClick={scrollToHowItWorks}
          className="px-6 py-3 border border-input text-foreground hover:bg-accent hover:text-accent-foreground rounded-md inline-flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          Learn More
        </button>
      </motion.div>
    </section>
  )
}

export default HeroSection
