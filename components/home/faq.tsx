"use client"

import React, { useState, useRef, memo, useCallback } from 'react'
import {  motion, useInView } from 'framer-motion'
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
    answer: "Snap Core is a browser-based thumbnail generator. Upload images or capture video frames, remove backgrounds, and add text - all processed locally in your browser."
  },
  {
    question: "Can I use both videos and images?",
    answer: "Yes! You can use either videos or images, but not at the same time. Choose one type per thumbnail."
  },
  {
    question: "Can I create image and video thumbnails simultaneously?",
    answer: "No, work with one type at a time. Complete your current thumbnail before starting a new one."
  },
  {
    question: "What file formats are supported?",
    answer: "Videos: MP4, WebM, MOV. Images: JPG, PNG."
  },
  {
    question: "How does the background removal work?",
    answer: "AI-powered removal works on both video frames and images. It detects and removes backgrounds instantly with high precision."
  },
  {
    question: "Can I customize my thumbnails?",
    answer: "Yes! Add text, apply filters, and customize everything. All changes preview in real-time."
  },
  {
    question: "Is my content private?",
    answer: "Yes, everything processes locally in your browser. We don't store any of your content."
  },
  {
    question: "How does the automatic keyframe detection work?",
    answer: "It analyzes your video to find important moments. Set custom intervals for automatic capture."
  },
  {
    question: "What are the system requirements?",
    answer: "Works in any modern browser. For best results, use a device with 4GB+ RAM."
  },
  {
    question: "Is Snap Core optimized for mobile devices?", 
    answer: "Works on mobile but best on desktop. Advanced editing features need larger screens for optimal use."
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
                    "text-left text-sm sm:text-base font-display font-medium",
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