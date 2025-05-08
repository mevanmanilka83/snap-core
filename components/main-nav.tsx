"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera, Menu, X } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

export function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/projects", label: "Projects" },
    { href: "/templates", label: "Templates" },
    { href: "/help", label: "Help" },
  ]

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
      <nav className="hidden md:flex items-center justify-center flex-1 px-4">
        <ul className="flex space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-3 py-2 text-sm rounded-md transition-colors hover:text-primary hover:bg-muted ${
                  pathname === item.href ? "text-primary font-medium bg-muted" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right section - theme toggle and mobile menu */}
      <div className="flex items-center space-x-2">
        <ModeToggle />

        {/* Mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] sm:w-[350px] pr-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 pr-6">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <Camera className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Snap Core
                  </span>
                </Link>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Close">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </div>

              <nav className="flex-1">
                <ul className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-6 py-3 text-base rounded-l-md transition-colors hover:text-primary hover:bg-muted ${
                          pathname === item.href
                            ? "text-primary font-medium bg-muted border-r-2 border-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto pt-6 pb-8 px-6 border-t">
                <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Snap Core</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
