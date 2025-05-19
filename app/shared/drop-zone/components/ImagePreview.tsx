import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, UploadIcon, ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react"
import { ImageInfo, ImageFilter } from "../types"

interface ImagePreviewProps {
  imageInfo: ImageInfo | null
  imageLoaded: boolean
  imageSrc: string
  zoomLevel: number
  setZoomLevel: (level: number) => void
  imageFilters: ImageFilter
  isLoading: boolean
  error: string
  hasAttemptedLoad: boolean
  onCancel: () => void
  onRemoveBackground: () => void
  isProcessing: boolean
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageInfo,
  imageLoaded,
  imageSrc,
  zoomLevel,
  setZoomLevel,
  imageFilters,
  isLoading,
  error,
  hasAttemptedLoad,
  onCancel,
  onRemoveBackground,
  isProcessing,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Image Preview</CardTitle>
        {error && hasAttemptedLoad && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {imageInfo && imageLoaded && (
          <div className="bg-muted p-2 text-xs rounded flex items-center space-x-2">
            <Info className="h-4 w-4 flex-shrink-0" />
            <div>
              <p>Image size: {imageInfo.width}x{imageInfo.height} pixels</p>
              {imageInfo.size > 0 && <p>File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>}
            </div>
          </div>
        )}

        <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          {imageSrc && imageLoaded ? (
            <div className="relative w-full h-full">
              <img
                src={imageSrc || "/placeholder.svg"}
                alt="Preview"
                className="object-contain w-full h-full"
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  inset: 0,
                  transform: `scale(${zoomLevel / 100})`,
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
            </div>
          ) : (
            <>
              {!isLoading && !error && (
                <div className="text-center p-4">
                  <UploadIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No image selected</p>
                </div>
              )}
              {isLoading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
            </>
          )}
        </div>

        {imageLoaded && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                disabled={zoomLevel <= 50}
              >
                <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <span className="text-xs md:text-sm">{zoomLevel}%</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                disabled={zoomLevel >= 200}
              >
                <ZoomIn className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10"
                onClick={() => setZoomLevel(100)}
                disabled={zoomLevel === 100}
              >
                <Maximize className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10"
                onClick={() => setZoomLevel(50)}
                disabled={zoomLevel === 50}
              >
                <Minimize className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button onClick={onCancel} variant="outline" size="default" className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={onRemoveBackground}
          disabled={!imageLoaded || isProcessing}
          size="default"
          className="flex-1"
        >
          {isProcessing ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
              Processing...
            </span>
          ) : (
            "Remove Background"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 