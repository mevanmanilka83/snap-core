"use client"

import type React from "react"

import { useState } from "react"
import { Disclosure } from "@headlessui/react"
import { motion } from "framer-motion"
import { Search, Menu, X } from "lucide-react"
import { Link } from "@/components/ui/link"
import { PlusGrid, PlusGridItem, PlusGridRow } from "@/components/eldoraui/plusgrid"
import { Logo } from "@/components/logo"
import { siteConfig } from "@/config/site"
import ModeToggle from "@/main-header/ModeToggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="relative">
      {isSearchOpen ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "250px", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <Input placeholder="Search..." className="pr-8 h-9" autoFocus onBlur={() => setIsSearchOpen(false)} />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9"
            onClick={() => setIsSearchOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      ) : (
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsSearchOpen(true)}>
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

function DesktopNav() {
  return (
    <nav className="relative hidden lg:flex items-center gap-4">
      <div className="flex items-center gap-2 ml-4">
        <PlusGridItem>
          <SearchBar />
        </PlusGridItem>
        <PlusGridItem>
          <ModeToggle />
        </PlusGridItem>
      </div>
    </nav>
  )
}

function MobileNavButton({ open }: { open: boolean }) {
  return (
    <div className="flex items-center gap-2 lg:hidden">
      <SearchBar />
      <ModeToggle />
      <Disclosure.Button as={Button} variant="ghost" size="icon" className="ml-1">
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Disclosure.Button>
    </div>
  )
}

function MobileNav() {
  return (
    <Disclosure.Panel className="lg:hidden">
      <div className="flex flex-col gap-2 py-4 px-4">
        {/* Mobile navigation content removed */}
      </div>
    </Disclosure.Panel>
  )
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  return (
    <Disclosure
      as="header"
      className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-full bg-background/30 backdrop-blur-md border border-border/20 shadow-sm"
    >
      {({ open }) => (
        <>
          <div className="px-4 py-2">
            <PlusGrid>
              <PlusGridRow className="relative flex justify-between">
                <div className="relative flex gap-6">
                  <PlusGridItem className="py-1">
                    <Link href="/" title="Home">
                      <div className="flex items-center space-x-2">
                        <div className="-mt-1">
                          <Logo className="mr-2 size-6" />
                        </div>
                        <span className="hidden font-bold md:inline-block">{siteConfig.name}</span>
                      </div>
                    </Link>
                  </PlusGridItem>
                  {banner && <div className="relative hidden items-center py-1 lg:flex">{banner}</div>}
                </div>
                <DesktopNav />
                <MobileNavButton open={open} />
              </PlusGridRow>
            </PlusGrid>
          </div>
          <MobileNav />
        </>
      )}
    </Disclosure>
  )
}
