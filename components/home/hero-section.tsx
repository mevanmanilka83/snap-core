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
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight">
                <span className="block text-green-400 font-instrument">Transform</span>
                <span className="block font-black text-white font-inter">ANYTHING</span>
                <span className="block text-green-400 font-instrument">Into Magic</span>
              </h1>

              <div className="max-w-2xl">
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-light font-inter">
                  Transform your content into eye-catching thumbnails that drive engagement. 
                  <span className="text-green-300 font-medium"> No uploads needed.</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md sm:max-w-none">
              <button
                onClick={scrollToMainSection}
                aria-label="Start creating thumbnails"
                className="group relative flex h-12 w-full sm:w-[170px] items-center justify-between border-2 border-white/20 rounded-full bg-gradient-to-r from-white/10 to-white/5 font-medium text-white"
              >
                <span className="pl-4">Start Creating</span>
                <div className="relative h-9 w-9 overflow-hidden bg-white/20 rounded-full mr-1">
                  <div className="absolute top-[0.7em] left-[-0.1em] grid place-content-center transition-all w-full h-full duration-200 group-hover:-translate-y-5 group-hover:translate-x-4">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-white"
                    >
                      <path
                        d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mb-1 -translate-x-4 fill-white"
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
                aria-label="Learn more about how it works"
                className="group relative flex h-12 w-full sm:w-[170px] items-center justify-between border-2 border-white/10 rounded-full bg-gradient-to-r from-white/5 to-white/5 font-medium text-white"
              >
                <span className="pl-4">Learn More</span>
                <div className="relative h-9 w-9 overflow-hidden bg-white/10 rounded-full mr-1">
                  <div className="grid place-content-center w-full h-full">
                    <ChevronsRight className="h-5 w-5 text-white" />
                  </div>
                </div>
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
})

export default HeroSection
