"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FeatureCardHoverProps {
  items: {
    title: string
    description: string
    icon?: React.ReactNode
    link?: string
  }[]
  className?: string
}

export const FeatureCardHover = ({ items, className }: FeatureCardHoverProps) => {
  return (
    <div className={cn("grid gap-4", className)}>
      {items.map((item, index) => (
        <motion.div
          key={`feature-${index}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-foreground/50 transition-colors"
        >
          <div className="flex flex-col gap-2">
            {item.icon && (
              <div className="mb-2 text-muted-foreground">
                {item.icon}
              </div>
            )}
            <h3 className="font-semibold leading-none tracking-tight">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
          {item.link && (
            <a
              href={item.link}
              className="absolute inset-0 z-10"
              aria-label={`Learn more about ${item.title}`}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
} 