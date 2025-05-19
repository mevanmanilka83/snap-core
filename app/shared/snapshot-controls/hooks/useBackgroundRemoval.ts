import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import * as backgroundRemoval from "@imgly/background-removal"

export const useBackgroundRemoval = (inputImageSrc: string) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processedImageSrc, setProcessedImageSrc] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const processedUrl = useRef<string | null>(null)

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(processedUrl.current)
      }
    }
  }, [])

  // Validate input image
  useEffect(() => {
    if (inputImageSrc) {
      const img = new window.Image()
      img.onload = () => {
        if (img.width === 0 || img.height === 0) {
          setError("Invalid image dimensions")
        } else {
          setError(null)
        }
      }
      img.onerror = () => {
        setError("Failed to load image")
      }
      img.src = inputImageSrc
    }
  }, [inputImageSrc])

  const handleRemoveBackground = async () => {
    if (!inputImageSrc) {
      toast.error("No image to process")
      return
    }

    try {
      setError(null)
      setIsProcessing(true)
      setProgress(0)

      // Process the image with imgly background removal
      const blob = await backgroundRemoval.removeBackground(inputImageSrc, {
        progress: (message: string, progress: number) => {
          setProgress(Math.round(progress * 100))
        },
      })
      
      // Create a URL from the resulting blob
      const processedImageUrl = URL.createObjectURL(blob)
      
      // Revoke the old processed URL if it was a blob
      if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(processedUrl.current)
      }
      
      // Save the transparent background image URL
      processedUrl.current = processedImageUrl
      setProcessedImageSrc(processedImageUrl)
      
      toast.success("Background removed successfully")
    } catch (err) {
      console.error("Error removing background:", err)
      toast.error("Failed to remove background")
      setError("Failed to remove background. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    isProcessing,
    error,
    processedImageSrc,
    progress,
    handleRemoveBackground,
  }
} 