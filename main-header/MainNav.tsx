"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera } from "lucide-react"
import ModeToggle from "./ModeToggle"

export default function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left section - logo */}
      <Link href="/" className="flex items-center space-x-2 shrink-0">
        <Camera className="h-5 w-5 text-primary" />
        <span className="font-bold text-base sm:text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Snap Core
        </span>
      </Link>
      {/* Center section - desktop navigation */}
      <nav className="hidden md:flex items-center gap-4 mx-auto">
        {/* No links here now */}
      </nav>
      {/* Right section - theme toggle */}
      <div className="flex items-center">
        <ModeToggle />
      </div>
    </div>
  )
} 