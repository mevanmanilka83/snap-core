import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackgroundRemovedSection = (props: any) => {
  const { imageInfo, imageLoaded, processedImageSrc, zoomLevel, isProcessing } = props;

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6 pb-2">
        <CardTitle className="text-base">Background Removed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageInfo && imageLoaded && (
          <div className="bg-muted p-2 text-xs md:text-sm rounded flex items-center space-x-2">
            <Info className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <div>
              <p>
                Image size: {imageInfo.width}x{imageInfo.height} pixels
              </p>
              {imageInfo.size > 0 && <p>File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>}
            </div>
          </div>
        )}

        <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          {processedImageSrc ? (
            <div className="relative w-full h-full">
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
            </div>
          ) : isProcessing ? (
            <div className="flex justify-center py-8 md:py-12">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {imageLoaded ? "Ready to process image" : "Please upload an image"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 p-4 md:p-6">
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button
          className="flex-1 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
        >
          <Download className="h-4 w-4 mr-2" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BackgroundRemovedSection; 