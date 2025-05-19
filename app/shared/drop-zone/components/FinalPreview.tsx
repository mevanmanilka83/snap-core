import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Download } from "lucide-react"
import { ImageFilter } from "../types"

interface FinalPreviewProps {
  thumbnailSrc: string | null
  isCreatingThumbnail: boolean
  processedImageSrc: string | null
  imageFilters: ImageFilter
  onSave: () => void
}

export const FinalPreview: React.FC<FinalPreviewProps> = ({
  thumbnailSrc,
  isCreatingThumbnail,
  processedImageSrc,
  imageFilters,
  onSave,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle>Final Preview</CardTitle>
        <CardDescription>Preview your thumbnail with text and effects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          <div className="relative w-full h-full">
            {thumbnailSrc ? (
              <img
                src={thumbnailSrc || "/placeholder.svg"}
                alt="Thumbnail"
                className="object-contain w-full h-full"
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  inset: 0,
                  filter: `
                    brightness(${imageFilters.brightness}%) 
                    contrast(${imageFilters.contrast}%) 
                    saturate(${imageFilters.saturation}%) 
                    blur(${imageFilters.blur}px) 
                    hue-rotate(${imageFilters.hueRotate}deg)
                    grayscale(${imageFilters.grayscale}%)
                    sepia(${imageFilters.sepia}%)
                  `,
                }}
                crossOrigin="anonymous"
              />
            ) : isCreatingThumbnail ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-gray-500">Creating thumbnail...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  {processedImageSrc
                    ? "Click 'Apply' in the text editor to generate preview"
                    : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={!thumbnailSrc}
          size="default"
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Thumbnail
        </Button>
      </CardFooter>
    </Card>
  )
} 