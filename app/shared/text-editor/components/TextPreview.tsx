import React, { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { TextElement } from "../types"
import { renderTextOnCanvas } from "../utils/textRendering"

interface TextPreviewProps {
  processedImageSrc: string | null
  textElements: TextElement[]
  onExport?: () => void
}

export const TextPreview: React.FC<TextPreviewProps> = ({
  processedImageSrc,
  textElements,
  onExport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)

  // Draw preview on canvas
  useEffect(() => {
    if (!canvasRef.current || !processedImageSrc) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 320
    canvas.height = 180

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background image if available
    if (previewImageRef.current) {
      // Check if the image is actually loaded and not broken
      if (previewImageRef.current.complete && previewImageRef.current.naturalWidth !== 0) {
        try {
          ctx.drawImage(previewImageRef.current, 0, 0, canvas.width, canvas.height)
        } catch (error) {
          console.error("Error drawing image to canvas:", error)
          // Draw a placeholder or error state
          ctx.fillStyle = "#f0f0f0"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = "#666"
          ctx.font = "14px Arial"
          ctx.textAlign = "center"
          ctx.fillText("Image failed to load", canvas.width / 2, canvas.height / 2)
        }
      } else {
        // Image is not loaded yet or is broken
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#666"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Loading image...", canvas.width / 2, canvas.height / 2)
      }
    }

    // Draw text elements
    const elements = textElements.filter(element => element.visible)
    elements.forEach((element) => {
      try {
        renderTextOnCanvas(ctx, element, canvas.width, canvas.height, 1)
      } catch (error) {
        console.error("Error rendering text element:", error)
      }
    })
  }, [processedImageSrc, textElements])

  // Add error handling for the preview image
  const handlePreviewImageError = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.fillStyle = "#666"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Image failed to load", canvasRef.current.width / 2, canvasRef.current.height / 2)
      }
    }
  }

  const handleExport = () => {
    if (!canvasRef.current) return

    try {
      const dataUrl = canvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = "thumbnail-preview.png"
      link.click()
      toast.success("Preview image downloaded")
      if (onExport) {
        onExport()
      }
    } catch (error) {
      toast.error("Failed to download preview")
      console.error("Export error:", error)
    }
  }

  return (
    <div className="relative border rounded-md overflow-hidden w-full md:w-auto">
      <canvas ref={canvasRef} className="w-full md:w-[160px] h-[90px]" />
      <img
        ref={previewImageRef}
        src={processedImageSrc || "/placeholder.svg"}
        alt="Background"
        className="hidden"
        onLoad={() => {
          if (canvasRef.current && previewImageRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            if (ctx && previewImageRef.current.complete && previewImageRef.current.naturalWidth !== 0) {
              try {
                ctx.drawImage(previewImageRef.current, 0, 0, canvas.width, canvas.height)
              } catch (error) {
                console.error("Error drawing image to canvas:", error)
                handlePreviewImageError()
              }
            }
          }
        }}
        onError={handlePreviewImageError}
        crossOrigin="anonymous"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70"
        onClick={handleExport}
      >
        <Download className="h-3 w-3 text-white" />
      </Button>
    </div>
  )
} 