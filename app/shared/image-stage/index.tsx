"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ImageIcon } from "lucide-react"

interface ImageStageProps {
  src?: string | null
  alt: string
  zoom?: number
  containerClassName?: string
  imageClassName?: string
  emptyState?: React.ReactNode
  loading?: boolean
  overlay?: React.ReactNode
}

export default function ImageStage({
  src,
  alt,
  zoom = 100,
  containerClassName,
  imageClassName,
  emptyState,
  loading,
  overlay,
}: ImageStageProps) {
  return (
    <div className={cn(
      "relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center",
      "overflow-hidden rounded-md border border-gray-200 dark:border-gray-700",
      containerClassName
    )}>
      <div className="relative w-full h-full">
        {src ? (
          <img
            src={src}
            alt={alt}
            className={cn("object-contain w-full h-full", imageClassName)}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
              transform: `scale(${zoom / 100})`,
            }}
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Error loading image: ", alt)
              ;(e.currentTarget as HTMLImageElement).src = "/placeholder.svg"
            }}
          />
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        ) : (
          emptyState ?? (
            <div className="flex flex-col items-center justify-center h-full">
              <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No image</p>
            </div>
          )
        )}
      </div>
      {overlay}
    </div>
  )
}
