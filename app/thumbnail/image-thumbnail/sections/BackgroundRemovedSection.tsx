import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info, CheckCircle2 } from "lucide-react";
import ThumbnailImageStage from "@/features/thumbnail/common/ThumbnailImageStage";
import { useEffect, useState, useCallback } from "react";

const BackgroundRemovedSection = (props: any) => {
  const { imageInfo, imageLoaded, processedImageSrc, zoomLevel, isProcessing, onSave } = props;
  const [localProcessedImage, setLocalProcessedImage] = useState<string | null>(null);
  const [isImageProcessed, setIsImageProcessed] = useState(false);

  // Maintain local state of processed image
  useEffect(() => {
    if (processedImageSrc) {
      setLocalProcessedImage(processedImageSrc);
      setIsImageProcessed(true);
    }
  }, [processedImageSrc]);

  // Handle save
  const handleSave = useCallback(() => {
    if (localProcessedImage && onSave) {
      onSave(localProcessedImage);
    }
  }, [localProcessedImage, onSave]);

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base">Background Removal</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Remove the background to proceed with text editing in the image section
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isImageProcessed ? (
          <div className="flex flex-col items-center justify-center py-8 text-green-600">
            <CheckCircle2 className="h-10 w-10 mb-2" />
            <div className="text-sm font-medium">Background removed! You can now proceed to text editing.</div>
          </div>
        ) : (
          <>
            {imageInfo && imageLoaded && (
              <div className="bg-muted p-2 text-xs md:text-sm rounded flex items-center space-x-2 mb-4">
                <Info className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <div>
                  {imageInfo.size > 0 && <p>File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>}
                </div>
              </div>
            )}
            <ThumbnailImageStage
              src={localProcessedImage || undefined}
              alt="Background Removed"
              zoom={zoomLevel}
              emptyState={
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {imageLoaded ? "Ready to process image" : "Please upload an image"}
                  </p>
                </div>
              }
              loading={isProcessing}
            />
            {localProcessedImage && (
              <div data-slot="card-footer" className="items-center [.border-t]:pt-6 flex flex-wrap gap-4 p-6 md:p-8">
                <button 
                  data-slot="button" 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 flex-1"
                >
                  Cancel
                </button>
                <button 
                  data-slot="button" 
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 flex-1 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download h-4 w-4 mr-2" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  Save
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BackgroundRemovedSection; 