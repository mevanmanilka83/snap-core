"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import ModeToggle from "./ModeToggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
]

export default function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section - logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          <Camera className="h-5 w-5 text-primary" />
          <span className="font-bold text-base sm:text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Snap Core
          </span>
        </Link>

        {/* Center section - desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 mx-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative py-2",
                pathname === item.href
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']"
                  : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right section - actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            Sign In
          </Button>
          <Button size="sm" className="hidden md:flex">
            Get Started
          </Button>
          <ModeToggle />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary px-2 py-2 rounded-md",
                      pathname === item.href ? "text-primary bg-muted" : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full justify-start">
                    Sign In
                  </Button>
                  <Button className="w-full justify-start">Get Started</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
