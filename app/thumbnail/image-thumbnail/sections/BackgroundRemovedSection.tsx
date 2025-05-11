import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const BackgroundRemovedSection = (props: any) => {
  const { imageInfo, imageLoaded, processedImageSrc, zoomLevel, isProcessing } = props;

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base">Background Removed</CardTitle>
      </CardHeader>
      <CardContent>
        {imageInfo && imageLoaded && (
          <div className="bg-muted p-2 text-xs md:text-sm rounded flex items-center space-x-2 mb-4">
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
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary mb-2 md:mb-4"></div>
                <p className="text-xs md:text-sm text-gray-500">Removing background...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  {imageLoaded ? "Ready to process image" : "Please upload an image"}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundRemovedSection; 