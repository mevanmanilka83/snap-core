"use client"

import React, { useState, useRef, memo, useCallback } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { WordPullUp } from "@/components/eldoraui/wordpullup"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface FAQ {
  question: string;
  answer: string;
}

const faqVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

const faqs: FAQ[] = [
  {
    question: "What is Snap Core and how does it work?",
    answer: "Snap Core is a powerful browser-based thumbnail generator that lets you create professional thumbnails from both videos and images. You can upload images directly or capture frames from videos, remove backgrounds, and add text overlays - all processed locally in your browser for maximum privacy and speed."
  },
  {
    question: "Can I use both videos and images?",
    answer: "Yes! Snap Core supports both workflows. You can either upload images directly using drag and drop, or load videos to capture specific frames. Both methods provide instant preview and processing capabilities."
  },
  {
    question: "What file formats are supported?",
    answer: "Snap Core supports all major video formats (MP4, WebM, MOV) and image formats (JPG, PNG). For videos, you can capture frames instantly, and for images, you can upload them directly through our drag-and-drop interface."
  },
  {
    question: "How does the background removal work?",
    answer: "Our AI-powered background removal works on both captured video frames and uploaded images. It automatically detects and removes backgrounds with pixel-perfect precision, maintaining fine details like hair and transparent elements. The process happens in real-time with instant preview."
  },
  {
    question: "Can I customize my thumbnails?",
    answer: "Yes! After capturing a frame or uploading an image, you can add text overlays with various fonts and styles, apply image filters, and customize every aspect of your thumbnail. All changes are previewed in real-time."
  },
  {
    question: "Is my content private?",
    answer: "Yes, Snap Core processes everything locally in your browser. We don't store any of your videos, images, or generated content. All processing happens on your device, and closing the page clears all local data."
  },
  {
    question: "How does the automatic keyframe detection work?",
    answer: "For videos, our automatic keyframe detection analyzes your content to identify the most significant moments. You can set custom intervals for automatic capture, and the system will intelligently select frames that represent key scenes or transitions in your video."
  },
  {
    question: "What are the system requirements?",
    answer: "Snap Core works in any modern web browser. Since all processing happens locally, performance may vary based on your device's capabilities. For optimal results, we recommend using a device with at least 4GB of RAM and a modern processor."
  }
]

const FAQSection = memo(function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { 
    amount: 0.3,
    once: true 
  })

  const handleAccordionClick = useCallback((index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }, [openIndex])

  return (
    <section 
      ref={sectionRef} 
      className={cn(
        "max-w-3xl mx-auto mb-24 px-4",
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
          FAQ
        </Badge>
        <div className="min-h-[120px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <WordPullUp 
              text="Frequently Asked Questions" 
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
          Find answers to common questions about creating thumbnails from videos and images with Snap Core.
        </motion.p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={faqVariants}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger
                  className={cn(
                    "text-left text-xs sm:text-sm font-display font-medium",
                    "hover:no-underline"
                  )}
                  onClick={() => handleAccordionClick(index)}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className={cn(
                    "text-muted-foreground",
                    "text-xs sm:text-sm"
                  )}>
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        ))}
      </div>
    </section>
  )
})

export default FAQSection