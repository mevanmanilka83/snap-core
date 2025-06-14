"use client"

import { useCallback, memo } from "react"
import { ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"

const HeroSection = memo(function HeroSection() {
  const scrollToHowItWorks = useCallback(() => {
    const element = document.getElementById("how-it-works")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  const scrollToMainSection = useCallback(() => {
    const element = document.getElementById("thumbnail-creator")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      const elements = document.getElementsByClassName("text-xs sm:text-sm")
      const targetElement = Array.from(elements).find((el) =>
        el.textContent?.includes("Create Thumbnails"),
      ) as HTMLElement

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        const absoluteTop = rect.top + window.scrollY
        window.scrollTo({
          top: absoluteTop,
          behavior: "smooth",
        })
      }
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0">
        {/* Large geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/20 rounded-lg rotate-12 blur-sm"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-600/30 rounded-full blur-md"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-red-400/10 rounded-lg -rotate-6"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-red-500/25 rounded-full blur-sm"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto">
        {/* Hero Text */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Create Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Thumbnails
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Upload images directly or capture frames from videos. Remove backgrounds, add text, and create stunning
            thumbnails - all processed locally in your browser for maximum privacy and speed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={scrollToMainSection}
            className={cn(
              "group relative flex h-14 w-[220px] items-center justify-between",
              "border-2 border-red-500 rounded-full",
              "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
              "font-semibold text-white text-lg",
              "transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25",
            )}
            aria-label="Start creating thumbnails"
          >
            <span className="pl-7">Start Creating</span>
            <div className="relative h-11 w-11 overflow-hidden bg-white/20 rounded-full mr-2 backdrop-blur-sm">
              <div className="absolute inset-0 grid place-content-center transition-transform duration-200 group-hover:translate-x-1">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 fill-white"
                  aria-hidden="true"
                >
                  <path
                    d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </button>

          <button
            onClick={scrollToHowItWorks}
            className={cn(
              "flex items-center gap-3 px-8 py-4",
              "bg-transparent border-2 border-white/30 text-white rounded-full",
              "hover:bg-white hover:text-black transition-all duration-300",
              "font-semibold text-lg hover:scale-105 backdrop-blur-sm",
            )}
            aria-label="Learn more about how it works"
          >
            Learn More
            <ChevronsRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  )
})

export default HeroSection
