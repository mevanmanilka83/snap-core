"use client"

import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      <Camera className="h-5 w-5 text-primary" />
    </div>
  )
} 