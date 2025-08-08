"use client"

import { useCallback, memo } from "react"
import { Sparkles, Zap, ChevronsRight } from "lucide-react"

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
              <button
                onClick={scrollToMainSection}
                className="group relative flex h-12 w-full sm:w-[170px] items-center justify-center border-2 border-black rounded-full bg-white font-medium text-black transition-all duration-300 hover:scale-105 hover:shadow-xl"
                aria-label="Start creating thumbnails"
              >
                <span>Start Creating</span>
                <div className="relative h-9 w-9 overflow-hidden bg-black/10 rounded-full ml-2 backdrop-blur-sm">
                  <div className="absolute top-[0.7em] left-[-0.1em] grid place-content-center transition-all w-full h-full duration-200 group-hover:-translate-y-5 group-hover:translate-x-4">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-black"
                    >
                      <path
                        d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mb-1 -translate-x-4 fill-black"
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
                className="group relative flex h-12 w-full sm:w-[170px] items-center justify-center border-2 border-black rounded-full bg-white font-medium text-black transition-all duration-300 hover:scale-105 hover:shadow-xl"
                aria-label="Learn more about how it works"
              >
                <span>Learn More</span>
                <div className="relative h-9 w-9 overflow-hidden bg-black/10 rounded-full ml-2 backdrop-blur-sm">
                  <div className="absolute top-[0.7em] left-[-0.1em] grid place-content-center transition-all w-full h-full duration-200 group-hover:-translate-y-5 group-hover:translate-x-4">
                    <ChevronsRight className="h-5 w-5 text-black" />
                    <ChevronsRight className="h-5 w-5 mb-1 -translate-x-4 text-black" />
                  </div>
                </div>
              </button>
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
})

export default HeroSection
