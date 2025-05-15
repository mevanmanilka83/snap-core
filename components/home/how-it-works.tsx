"use client"

import React, { useRef, memo } from "react"
import { motion, useInView } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { WordPullUp } from "@/components/eldoraui/wordpullup"
import { StaticStep } from "@/components/eldoraui/staticstepper"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { cn } from "@/lib/utils"

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: "Choose Your Source",
    description: "Upload an image directly or select a video file. For videos, use our intelligent frame detection to capture the perfect moment. Support for MP4, WebM, MOV, JPG, and PNG formats."
  },
  {
    title: "Capture or Upload",
    description: "For videos, capture frames using automatic keyframe detection or manual selection. For images, simply drag and drop or upload directly. Both methods provide instant preview."
  },
  {
    title: "Process & Customize",
    description: "Remove backgrounds with AI precision, add text overlays, and apply filters. All processing happens in real-time with instant preview of your changes."
  },
  {
    title: "Generate & Download",
    description: "Preview your thumbnail in real-time and download in high quality. The entire process happens locally in your browser, ensuring privacy and speed."
  }
]

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

const HowItWorks = memo(function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { 
    amount: 0.3,
    once: true 
  })

  return (
    <section 
      ref={sectionRef} 
      id="how-it-works" 
      className={cn(
        "max-w-3xl mx-auto mb-24 px-4 pt-16",
        "scroll-mt-24"
      )}
    >
      <div className="text-center mb-12">
        <Badge 
          variant="outline" 
          className={cn(
            "mb-4 text-xs sm:text-sm",
            "animate-fade-in"
          )}
        >
          How It Works
        </Badge>
        <div className="min-h-[120px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <WordPullUp 
              text="Create Thumbnails from Videos or Images" 
              className="text-2xl sm:text-3xl md:text-4xl mb-4" 
            />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "text-muted-foreground max-w-2xl mx-auto",
            "text-sm sm:text-base"
          )}
        >
          Transform your videos or images into eye-catching thumbnails. Upload images directly or capture frames from videos - all processed locally in your browser.
        </motion.p>
      </div>

      <TracingBeam>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={stepVariants}
            >
              <StaticStep step={index + 1} title={step.title}>
                <p className={cn(
                  "text-muted-foreground",
                  "text-xs sm:text-sm"
                )}>
                  {step.description}
                </p>
              </StaticStep>
            </motion.div>
          ))}
        </div>
      </TracingBeam>
    </section>
  )
})

export default HowItWorks 