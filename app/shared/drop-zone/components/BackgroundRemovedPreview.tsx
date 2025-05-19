import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, ImageIcon, Download, Undo, Redo } from "lucide-react"
import { ImageInfo } from "../types"

interface BackgroundRemovedPreviewProps {
  imageInfo: ImageInfo | null
  imageLoaded: boolean
  processedImageSrc: string | null
  zoomLevel: number
  isProcessing: boolean
  undoStack: string[]
  redoStack: string[]
  onCancel: () => void
  onSave: () => void
  onUndo: () => void
  onRedo: () => void
}

export const BackgroundRemovedPreview: React.FC<BackgroundRemovedPreviewProps> = ({
  imageInfo,
  imageLoaded,
  processedImageSrc,
  zoomLevel,
  isProcessing,
  undoStack,
  redoStack,
  onCancel,
  onSave,
  onUndo,
  onRedo,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Background Removed</CardTitle>
      </CardHeader>
      <CardContent>
        {imageInfo && imageLoaded && (
          <div className="bg-muted p-2 text-xs rounded flex items-center space-x-2 mb-4">
            <Info className="h-4 w-4 flex-shrink-0" />
            <div>
              <p>Image size: {imageInfo.width}x{imageInfo.height} pixels</p>
              {imageInfo.size > 0 && <p>File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>}
            </div>
          </div>
        )}
        <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          <div className="relative w-full h-full">
            {processedImageSrc ? (
              <img
                src={processedImageSrc || "/placeholder.svg"}
                alt="Background Removed"
                className="object-contain w-full h-full"
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  inset: 0,
                  transform: `scale(${zoomLevel / 100})`,
                }}
                crossOrigin="anonymous"
              />
            ) : isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-gray-500">Removing background...</p>
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

        {processedImageSrc && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={onUndo} disabled={undoStack.length === 0}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onRedo} disabled={redoStack.length === 0}>
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 p-4 md:p-6">
        <Button onClick={onCancel} variant="outline" size="default" className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={!processedImageSrc}
          variant="default"
          size="default"
          className="flex-1 bg-black hover:bg-black/90 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Save
        </Button>
      </CardFooter>
    </Card>
  )
} 