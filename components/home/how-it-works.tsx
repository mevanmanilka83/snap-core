"use client"
import React, { memo } from "react"
import { Badge } from "@/components/ui/badge"
import { StaticStep } from "./staticstepper"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { HoverVideoPlayer } from "@/components/ui/hover-video-player"
interface Step {
  title: string;
  description: string;
}
const steps: Step[] = [
  {
    title: "Choose Your Source",
    description: "Upload an image directly or select a video file. For videos, use our intelligent frame detection to capture the perfect moment. Support for MP4, WebM, MOV, JPG, and PNG formats."
  },
  {
    title: "Capture or Upload",
    description: "For videos, capture frames using automatic keyframe detection or manual selection. For images, simply drag and drop or upload directly. Both methods provide instant preview."
  },
  {
    title: "Process & Customize",
    description: "Remove backgrounds with AI precision, add text overlays, and apply filters. All processing happens in real-time with instant preview of your changes."
  },
  {
    title: "Generate & Download",
    description: "Preview your thumbnail in real-time and download in high quality. The entire process happens locally in your browser, ensuring privacy and speed."
  }
]
const HowItWorks = () => {
  return (
    <section 
      id="how-it-works" 
      className={cn(
        "max-w-7xl mx-auto mb-24 px-4 pt-16",
        "scroll-mt-24"
      )}
    >
      <div className="text-center mb-12">
        <Badge 
          variant="outline" 
          className={cn(
            "mb-4 text-xs sm:text-sm"
          )}
        >
         How It Works
        </Badge>
        <div className="min-h-[120px] flex items-center justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4">
            Create Thumbnails from Videos or Images
          </h2>
        </div>
        <p className={cn(
          "text-muted-foreground max-w-2xl mx-auto",
          "text-sm sm:text-base"
        )}>
          Transform your videos or images into eye-catching thumbnails. Upload images directly or capture frames from videos - all processed locally in your browser.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index}>
              <StaticStep step={index + 1} title={step.title}>
                <p className={cn(
                  "text-muted-foreground",
                  "text-xs sm:text-sm"
                )}>
                  {step.description}
                </p>
              </StaticStep>
            </div>
          ))}
        </div>
         <div className="lg:sticky lg:top-24">
           <div className="text-center lg:text-left space-y-8">
             <div>
               <h4 className="text-lg mb-4 font-inter text-center lg:text-left">
                 Video Thumbnail
               </h4>
               <motion.div
                 whileHover={{ scale: 1.02 }}
                 transition={{
                   duration: 0.2,
                   ease: "easeOut",
                 }}
                 className={cn(
                   "group relative flex flex-col overflow-hidden rounded-lg w-full max-w-2xl mx-auto lg:mx-0",
                   "bg-white shadow-sm ring-1 ring-black/5",
                   "data-[dark]:bg-stone-800 data-[dark]:ring-white/15"
                 )}
               >
               <HoverVideoPlayer
                 videoSrc="/dummy.mp4"
                 enableControls
                 style={{
                   width: "100%",
                   maxWidth: "100%",
                   aspectRatio: "16/9",
                 }}
               />
               </motion.div>
             </div>
             <div>
               <h4 className="text-lg mb-4 font-inter text-center lg:text-left">
                 Image Thumbnail
               </h4>
               <motion.div
                 whileHover={{ scale: 1.02 }}
                 transition={{
                   duration: 0.2,
                   ease: "easeOut",
                 }}
                 className={cn(
                   "group relative flex flex-col overflow-hidden rounded-lg w-full max-w-2xl mx-auto lg:mx-0",
                   "bg-white shadow-sm ring-1 ring-black/5",
                   "data-[dark]:bg-stone-800 data-[dark]:ring-white/15"
                 )}
               >
                 <HoverVideoPlayer
                   videoSrc="/dummy.mp4"
                   enableControls
                   style={{
                     width: "100%",
                     maxWidth: "100%",
                     aspectRatio: "16/9",
                 }}
               />
               </motion.div>
             </div>
           </div>
         </div>
      </div>
    </section>
  )
}
export default memo(HowItWorks) 