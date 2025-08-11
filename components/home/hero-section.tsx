"use client"

import { useCallback, memo } from "react"
import { ChevronsRight, ArrowUpRight } from "lucide-react"


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
    <div className="min-h-[90vh] relative overflow-hidden rounded-3xl mb-8">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 rounded-3xl"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-black/40 rounded-3xl" />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center min-h-[90vh] px-4">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-10">
            {/* Main Heading */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-extralight text-white leading-[0.85] tracking-tight">
                <span className="block">CRAFTING</span>
                <span className="block bg-gradient-to-r from-green-300 via-green-200 to-green-100 bg-clip-text text-transparent font-light">
                  PERFECT
                </span>
                <span className="block font-normal">THUMBNAILS</span>
              </h1>

              <div className="max-w-2xl">
                <p className="text-xl lg:text-2xl text-white leading-relaxed font-light">
                  Transform your content with stunning thumbnails. Upload images, extract video frames, remove
                  backgrounds, and add compelling text—all processed locally for
                  <span className="text-green-200 font-medium"> ultimate privacy</span>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md sm:max-w-none">
              <button
                onClick={scrollToMainSection}
                aria-label="Start creating thumbnails"
                className="flex h-12 w-full sm:w-[170px] items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium transition-all duration-300"
              >
                <span>Start Creating</span>
                <ArrowUpRight className="h-5 w-5 text-white/90" />
              </button>

              <button
                onClick={scrollToHowItWorks}
                aria-label="Learn more about how it works"
                className="flex h-12 w-full sm:w-[170px] items-center justify-center gap-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium transition-all duration-300"
              >
                <span>Learn More</span>
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
})

export default HeroSection
