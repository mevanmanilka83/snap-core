import { useState, useRef } from "react"
import { toast } from "sonner"
import { ImageFilter, TextElement } from "../types"
import { applyFilters, renderTextOnCanvas } from "../utils/imageProcessing"

export const useImageProcessing = (initialFilters?: Partial<ImageFilter>) => {
  const [imageFilters, setImageFilters] = useState<ImageFilter>({
    brightness: initialFilters?.brightness ?? 100,
    contrast: initialFilters?.contrast ?? 100,
    saturation: initialFilters?.saturation ?? 100,
    blur: initialFilters?.blur ?? 0,
    hueRotate: initialFilters?.hueRotate ?? 0,
    grayscale: initialFilters?.grayscale ?? 0,
    sepia: initialFilters?.sepia ?? 0,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const resetFilters = () => {
    setImageFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hueRotate: 0,
      grayscale: 0,
      sepia: 0,
    })
    toast.success("Image filters reset to default")
  }

  const applyPresetFilter = (preset: string) => {
    const presets = {
      grayscale: { grayscale: 100, saturation: 0 },
      sepia: { sepia: 80, saturation: 110, contrast: 110 },
      vivid: { saturation: 150, contrast: 120, brightness: 105 },
      cool: { hueRotate: 180, saturation: 90 },
      warm: { hueRotate: 30, saturation: 120, brightness: 105 },
    }

    if (preset in presets) {
      setImageFilters(prev => ({ ...prev, ...presets[preset as keyof typeof presets] }))
      toast.success(`Applied ${preset} filter`)
    } else {
      resetFilters()
    }
  }

  const createThumbnail = async (
    imageSrc: string,
    processedImageSrc: string,
    textElements: TextElement[]
  ) => {
    try {
      const bgImg = new window.Image()
      bgImg.crossOrigin = "anonymous"
      
      const fgImg = new window.Image()
      fgImg.crossOrigin = "anonymous"

      await Promise.all([
        new Promise((resolve, reject) => {
          bgImg.onload = resolve
          bgImg.onerror = reject
          bgImg.src = imageSrc
        }),
        new Promise((resolve, reject) => {
          fgImg.onload = resolve
          fgImg.onerror = reject
          fgImg.src = processedImageSrc
        })
      ])

      const canvas = canvasRef.current
      if (!canvas) throw new Error("Canvas not found")
      
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not get canvas context")

      canvas.width = bgImg.width
      canvas.height = bgImg.height

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      applyFilters(ctx, imageFilters)
      ctx.drawImage(bgImg, 0, 0)
      ctx.filter = "none"

      const backElements = textElements.filter((element) => element.visible && element.layerOrder === "back")
      const frontElements = textElements.filter((element) => element.visible && element.layerOrder === "front")
      const scaleFactor = Math.min(canvas.width, canvas.height) / 1000

      backElements.forEach((element) => {
        renderTextOnCanvas(ctx, element, canvas.width, canvas.height, scaleFactor)
      })

      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(fgImg, 0, 0)

      frontElements.forEach((element) => {
        renderTextOnCanvas(ctx, element, canvas.width, canvas.height, scaleFactor)
      })

      return canvas.toDataURL("image/png")
    } catch (error) {
      console.error("Error creating thumbnail:", error)
      throw error
    }
  }

  return {
    imageFilters,
    setImageFilters,
    resetFilters,
    applyPresetFilter,
    createThumbnail,
    canvasRef,
  }
} 