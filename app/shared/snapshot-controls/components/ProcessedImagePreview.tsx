import React from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"

interface ProcessedImagePreviewProps {
  processedImageSrc: string
  width?: number
  height?: number
  showDownload?: boolean
}

export const ProcessedImagePreview: React.FC<ProcessedImagePreviewProps> = ({
  processedImageSrc,
  width,
  height,
  showDownload = true,
}) => {
  const handleSaveProcessedImage = () => {
    if (!processedImageSrc) {
      toast.error("No processed image to save")
      return
    }

    // Create a download link
    const link = document.createElement('a')
    link.href = processedImageSrc
    link.download = `processed-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success("Image saved successfully")
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        <div className="relative w-full h-full">
          <img
            src={processedImageSrc}
            alt="Background Removed"
            className="object-contain w-full h-full"
            style={{
              width: width ? `${width}px` : '100%',
              height: height ? `${height}px` : '100%',
              position: 'absolute',
              inset: 0
            }}
          />
        </div>
      </div>
      
      {showDownload && (
        <Button
          onClick={handleSaveProcessedImage}
          variant="default"
          className="w-full h-9 md:h-10 text-sm md:text-base flex items-center justify-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Save Image
        </Button>
      )}
    </div>
  )
} 