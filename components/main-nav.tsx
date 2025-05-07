"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera } from 'lucide-react'
import { ModeToggle } from "./mode-toggle"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between w-full px-4">
      {/* Left section - logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Camera className="h-5 w-5 text-primary" />
        <span className="font-bold text-base sm:text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Snap Core
        </span>
      </Link>
      
      {/* Center section - empty space */}
      <div className="flex-1" />
      
      {/* Right section - theme toggle */}
      <div className="w-24 flex justify-end">
        <ModeToggle />
      </div>
    </div>
  )
}
