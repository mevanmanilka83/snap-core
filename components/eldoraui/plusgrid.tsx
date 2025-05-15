"use client"

import { cn } from "@/lib/utils"

interface PlusGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PlusGrid({ className, children, ...props }: PlusGridProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface PlusGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PlusGridRow({ className, children, ...props }: PlusGridRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface PlusGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PlusGridItem({ className, children, ...props }: PlusGridItemProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 