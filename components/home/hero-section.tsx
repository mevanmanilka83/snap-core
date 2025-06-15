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
    const element = document.getElementById("thumbnail-creator")
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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-black">AI-Powered • Privacy First</span>
            </div>

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
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={scrollToMainSection}
                className="group relative flex h-12 w-[170px] items-center justify-between border-2 border-black rounded-full bg-white font-medium text-black transition-all duration-300 hover:scale-105 hover:shadow-xl"
                aria-label="Start creating thumbnails"
              >
                <span className="pl-4">Start Creating</span>
                <div className="relative h-9 w-9 overflow-hidden bg-black/10 rounded-full mr-1 backdrop-blur-sm">
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
                className="flex items-center gap-2 cursor-pointer px-6 py-3 bg-white border-2 border-black text-black rounded-full transition-all duration-300 font-medium hover:scale-105"
                aria-label="Learn more about how it works"
              >
                Explore
                <ChevronsRight className="h-5 w-5 text-black" />
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

                <div className="relative p-8 grid grid-cols-2 gap-6 max-w-lg mx-auto lg:max-w-none">
                  {/* Large Featured Card */}
                  <div className="col-span-2">
                    <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src="/img/car%20vs%20plane.jpg"
                          alt="Car vs Plane thumbnail example"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white text-sm font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                            AI Enhanced
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smaller Cards */}
                  <div>
                    <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src="/img/formula.png"
                          alt="Formula thumbnail example"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src="/img/sanfrancisco.png"
                          alt="San Francisco thumbnail example"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-110 animate-float">
                <Sparkles className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-400 to-blue-400 rounded-3xl blur-xl opacity-50 -z-10"></div>
              </div>

              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-110 animate-float delay-1000">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-xl opacity-50 -z-10"></div>
              </div>

              {/* Floating Feature Cards */}
              <div className="absolute -left-12 top-1/4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/50 hidden lg:block animate-float delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">Instant</div>
                    <div className="text-xs text-gray-500">Processing</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-12 bottom-1/4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/50 hidden lg:block animate-float delay-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">100%</div>
                    <div className="text-xs text-gray-500">Private</div>
                  </div>
                </div>
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
