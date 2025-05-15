"use client"

import NextLink from "next/link"
import { cn } from "@/lib/utils"

interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  className?: string
}

export function Link({ className, ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
} 