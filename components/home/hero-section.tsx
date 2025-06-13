"use client"

import { useCallback, memo } from "react"
import { ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Spline from "@splinetool/react-spline"


const HeroSection = memo(function HeroSection() {
  const sceneUrl = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"

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
    <div className="relative flex flex-col items-center justify-center min-h-[90vh]">
      <div className="relative w-full max-w-7xl aspect-[16/9] overflow-hidden rounded-lg bg-black/[0.96]">
        <div className="absolute flex w-full flex-col items-center justify-center gap-8 p-10 text-center font-heading text-white">
          <span className="text-5xl sm:text-6xl md:text-7xl font-semibold">Create Perfect Thumbnails</span>
          <span className="font-sans font-light max-w-3xl text-xl sm:text-2xl">
            Upload images directly or capture frames from videos. Remove backgrounds, add text, and create stunning
            thumbnails - all processed locally in your browser for maximum privacy and speed.
          </span>
          <div className="flex flex-col sm:flex-row gap-8 mt-10">
            <button
              onClick={scrollToMainSection}
              className={cn(
                "group relative flex h-14 w-[220px] items-center justify-between",
                "border-2 dark:border-[#656fe2] border-[#394481] rounded-full",
                "bg-gradient-to-r dark:from-[#1a1f4b] dark:to-[#2d3a8c] from-[#f7f8ff] to-[#ffffff]",
                "font-medium dark:text-white text-black text-xl",
                "transition-all duration-200 hover:scale-105",
              )}
              aria-label="Start creating thumbnails"
            >
              <span className="pl-7">Start Creating</span>
              <div className="relative h-11 w-11 overflow-hidden dark:bg-[#656fe2] bg-black rounded-full mr-2">
                <div className="absolute inset-0 grid place-content-center transition-transform duration-200 group-hover:translate-x-4">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 dark:fill-white fill-white"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            </button>
            <button
              onClick={scrollToHowItWorks}
              className={cn(
                "flex gap-3 cursor-pointer px-7 py-3.5",
                "dark:hover:bg-black bg-black hover:bg-white hover:text-black text-white",
                "border-black dark:hover:text-white transition-all border-2",
                "dark:border-white dark:bg-white dark:text-black rounded-full font-semibold text-xl",
                "hover:scale-105",
              )}
              aria-label="Learn more about how it works"
            >
              Learn More
              <ChevronsRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="flex h-full">
          <Spline
            scene={sceneUrl}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
})

export default HeroSection
