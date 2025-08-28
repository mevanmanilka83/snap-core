import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter, Poppins, Roboto, Open_Sans, Montserrat, Lato } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/footer/footer"
import { cn } from "@/lib/utils"
import ClientWrapper from "@/components/client-wrapper"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}
export const metadata: Metadata = {
  title: {
    default: "Snap Core | Create thumbnails and snapshots",
    template: "%s | Snap Core"
  },
  description: "Create professional thumbnails and snapshots from your videos and images with our powerful browser-based tools. Upload images directly or capture frames from videos.",
  keywords: ["thumbnail creator", "video frame capture", "image processing", "background removal", "video to image", "screenshot tool", "image editor", "video thumbnail maker"],
  authors: [{ name: "Snap Core Team" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification', // Add your Google Search Console verification code
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Snap Core | Create thumbnails and snapshots',
    description: 'Create professional thumbnails and snapshots from your videos and images',
    siteName: 'Snap Core',
    images: [
      {
        url: '/og-image.jpg', // Local OG image path
        width: 1200,
        height: 630,
        alt: 'Snap Core - Thumbnail and Snapshot Creator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snap Core | Create thumbnails and snapshots',
    description: 'Create professional thumbnails and snapshots from your videos and images',
    creator: '@snapcore', // Add your Twitter handle
    images: ['/twitter-image.jpg'], // Local Twitter image path
  },
  manifest: '/manifest.json', // We'll create this file next
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          poppins.variable,
          roboto.variable,
          openSans.variable,
          montserrat.variable,
          lato.variable,
          "antialiased min-h-screen bg-background text-foreground"
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <ClientWrapper>
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-screen-2xl mx-auto w-full">
              {children}
            </main>
            <Footer />
          </ClientWrapper>
          <Toaster className="fixed top-4 right-4 z-50" />
        </div>
      </body>
    </html>
  )
}
