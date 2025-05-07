"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera } from 'lucide-react'
import { ModeToggle } from "./moode-toggle"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 mx-auto my-2">
          {/* Left section - empty for balance */}
          <div className="w-24" />
          
          {/* Center section - logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-primary" />
            <span className="font-bold text-base sm:text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Snap Core
            </span>
          </Link>
          
          {/* Right section - theme toggle */}
          <div className="w-24 flex justify-end">
            <div className="p-1.5 rounded-full bg-background/10 backdrop-blur-sm border border-border/10 hover:bg-background/20 transition-all duration-200">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
