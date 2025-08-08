"use client"

import { useCallback, memo } from "react"
import { ChevronsRight } from "lucide-react"
import CTAButton from "@/components/ui/cta-button"

const HeroSection = memo(function HeroSection() {
  const scrollToHowItWorks = useCallback(() => {
    const element = document.getElementById("how-it-works")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  const scrollToMainSection = useCallback(() => {
    const element = document.getElementById("transform-content")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-rose-400/10 to-orange-400/10 rounded-full blur-3xl"></div>

        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Content */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-10">


            {/* Main Heading */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-extralight text-black leading-[0.85] tracking-tight">
                <span className="block">CRAFTING</span>
                <span className="block bg-gradient-to-r from-gray-700 via-gray-700 to-gray-700 bg-clip-text text-transparent font-light">
                  PERFECT
                </span>
                <span className="block font-normal">THUMBNAILS</span>
              </h1>

              <div className="max-w-2xl">
                <p className="text-xl lg:text-2xl text-black leading-relaxed font-light">
                  Transform your content with stunning thumbnails. Upload images, extract video frames, remove
                  backgrounds, and add compelling text—all processed locally for
                  <span className="text-black font-medium"> ultimate privacy</span>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md sm:max-w-none">
              <CTAButton
                onClick={scrollToMainSection}
                aria-label="Start creating thumbnails"
                label="Start Creating"
                icon={<ChevronsRight />}
              />

              <CTAButton
                onClick={scrollToHowItWorks}
                aria-label="Learn more about how it works"
                label="Learn More"
                icon={<ChevronsRight />}
              />
            </div>
          </div>

          {/* Right Content - Enhanced Visual */}
          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="relative">
              {/* Main Gallery Grid with Glassmorphism */}
              <div className="relative">
                {/* Background Glass Effect */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl"></div>


              </div>


            </div>
          </div>
        </div>
      </div>


    </div>
  )
})

export default HeroSection
