"use client"

import React, { useRef, memo } from "react"
import { Camera, Eraser, Type, Download, RefreshCw, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { WordPullUp } from "@/components/eldoraui/wordpullup"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
  link: string;
}

const features: Feature[] = [
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Multiple Input Options",
    description: "Upload images directly or load videos to capture frames. Support for MP4, WebM, MOV, JPG, and PNG formats with instant preview.",
    link: "#"
  },
  {
    icon: <Eraser className="h-5 w-5" />,
    title: "Smart Frame Capture",
    description: "For videos, automatically detect key moments or manually select frames. For images, use our drag-and-drop interface for instant upload.",
    link: "#"
  },
  {
    icon: <Type className="h-5 w-5" />,
    title: "Real-time Processing",
    description: "Remove backgrounds and add text overlays with instant preview. All changes are processed in real-time for immediate feedback.",
    link: "#"
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Automatic Keyframe Detection",
    description: "For videos, our AI analyzes content to find significant moments. Set custom intervals for automatic capture of key scenes.",
    link: "#"
  },
  {
    icon: <Download className="h-5 w-5" />,
    title: "Instant Export",
    description: "Download your processed thumbnails in high quality. All processing happens locally in your browser for maximum speed.",
    link: "#"
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Privacy-First Processing",
    description: "Your content never leaves your device. All processing happens locally in your browser, ensuring complete privacy and data security.",
    link: "#"
  }
]

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const FeatureSection = memo(function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { 
    amount: 0.3,
    once: true 
  });

  return (
    <section 
      ref={sectionRef} 
      className={cn(
        "max-w-5xl mx-auto mb-24 px-4",
        "scroll-mt-24"
      )}
      id="how-it-works"
    >
      <div className="text-center mb-12">
        <Badge 
          variant="outline" 
          className={cn(
            "mb-4 text-xs sm:text-sm",
            "animate-fade-in"
          )}
        >
          Features
        </Badge>
        <div className="min-h-[120px] flex items-center justify-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={titleVariants}
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
          Create professional thumbnails from your videos or images with our powerful browser-based tools. Upload images directly or capture frames from videos.
        </motion.p>
      </div>

      <HoverEffect 
        items={features} 
        className={cn(
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
          "animate-fade-in"
        )} 
      />
    </section>
  )
})

export default FeatureSection
