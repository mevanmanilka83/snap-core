import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import ThemeProvider from "@/main-header/ThemeProvider"
import SiteHeader from "@/main-header/SiteHeader"
import Footer from "@/footer/footer"
import Dot from "@/components/dot"
import { cn } from "@/lib/utils"
import SmoothScroll from "@/components/smooth-scroll"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Snap Core | Create thumbnails and snapshots",
  description: "Create thumbnails and snapshots from your videos and images",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="snap-core-theme"
        >
          <Dot className="min-h-screen">
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <SmoothScroll>
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-screen-2xl mx-auto w-full">
                  {children}
                </main>
              </SmoothScroll>
              <Footer />
            </div>
          </Dot>
          <Toaster position="top-right" className="sm:max-w-sm md:max-w-md" />
        </ThemeProvider>
      </body>
    </html>
  )
}
