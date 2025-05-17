"use client"

import type React from "react"
import { Disclosure } from "@headlessui/react"
import { Link } from "@/components/ui/link"
import { PlusGrid, PlusGridItem, PlusGridRow } from "@/components/eldoraui/plusgrid"
import { siteConfig } from "@/config/site"
import ModeToggle from "@/main-header/ModeToggle"
import Image from "next/image"


function DesktopNav() {
  return (
    <nav className="relative hidden lg:flex items-center gap-4">
      <div className="flex items-center gap-2 ml-4">
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
      <ModeToggle />
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
      className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-full bg-background/30 backdrop-blur-md border border-border/20"
    >
      {({ open }) => (
        <>
          <div className="px-4 py-2">
            <PlusGrid>
              <PlusGridRow className="relative flex justify-between">
                <div className="relative flex gap-6">
                  <PlusGridItem className="py-1">
                    <Link href="/" title="Home" onClick={() => window.location.reload()}>
                      <div className="flex items-center space-x-2">
                        <div className="-mt-1">
                          <Image
                            src="/logo.jpeg"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="mr-2 rounded"
                            priority
                          />
                        </div>
                        <span className="font-bold">{siteConfig.name}</span>
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
