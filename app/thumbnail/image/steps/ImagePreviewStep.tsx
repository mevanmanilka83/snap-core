import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ImagePreviewSection = (props: any) => {
  const { imageInfo, imageLoaded, imageSrc, zoomLevel, isLoading, error, hasAttemptedLoad, processedImageSrc } = props;
  const [localImageSrc, setLocalImageSrc] = useState<string | null>(null);

  // Maintain local state of image
  useEffect(() => {
    if (imageSrc) {
      setLocalImageSrc(imageSrc);
    }
  }, [imageSrc]);

  // Update local state when processed image is available
  useEffect(() => {
    if (processedImageSrc) {
      setLocalImageSrc(processedImageSrc);
    }
  }, [processedImageSrc]);

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6 pb-2">
        <CardTitle className="text-base">Image Preview</CardTitle>
        {error && hasAttemptedLoad && <p className="text-xs md:text-sm text-red-500 mt-1">{error}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {imageInfo && imageLoaded && (
          <div className="bg-muted p-2 text-xs md:text-sm rounded flex items-center space-x-2">
            <Info className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <div>
              {imageInfo.size > 0 && <p>File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>}
            </div>
          </div>
        )}

        <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          {localImageSrc && imageLoaded ? (
            <div className="relative w-full h-full">
              <img
                src={localImageSrc}
                alt="Preview"
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
          ) : (
            <>
              {!isLoading && !error && (
                <div className="text-center p-4">
                  <UploadIcon className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">No image selected</p>
                </div>
              )}
              {isLoading && (
                <div className="flex justify-center py-8 md:py-12">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary"></div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreviewSection; 