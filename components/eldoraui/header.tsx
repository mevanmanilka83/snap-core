"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars2Icon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Link } from "@/components/ui/link";
import {
  PlusGrid,
  PlusGridItem,
  PlusGridRow,
} from "@/components/eldoraui/plusgrid";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";
import ModeToggle from "@/main-header/ModeToggle";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/company", label: "Company" },
];

function DesktopNav() {
  return (
    <nav className="relative hidden lg:flex items-center gap-4">
      <PlusGridItem>
        <ModeToggle />
      </PlusGridItem>
    </nav>
  );
}

function MobileNavButton() {
  return (
    <div className="lg:hidden">
      <ModeToggle />
    </div>
  );
}

function MobileNav() {
  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        <motion.div
          initial={{ opacity: 0, rotateX: -90 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.15,
            ease: "easeInOut",
            rotateX: { duration: 0.3, delay: 0.1 },
          }}
        >
          <ModeToggle />
        </motion.div>
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5 dark:border-white/5" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5 dark:border-white/5" />
      </div>
    </DisclosurePanel>
  );
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  return (
    <Disclosure as="header" className="pt-4">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title="Home">
                <div className="flex items-center space-x-2">
                  {" "}
                  {/* Flex container to align items horizontally */}
                  <div className="-mt-1">
                    <Logo className="mr-2 size-6" />
                  </div>
                  <span className="hidden font-bold md:inline-block">
                    {siteConfig.name}
                  </span>
                </div>
              </Link>
            </PlusGridItem>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <DesktopNav />
          <MobileNavButton />
        </PlusGridRow>
      </PlusGrid>
      <MobileNav />
    </Disclosure>
  );
}
