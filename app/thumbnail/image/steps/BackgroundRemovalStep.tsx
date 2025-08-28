import { Info, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import SharedBackgroundRemovalSection from "@/features/thumbnail/common/BackgroundRemovalSection";
const BackgroundRemovedSection = (props: any) => {
  const {
    imageInfo,
    imageLoaded,
    processedImageSrc,
    zoomLevel,
    isProcessing,
    onSave,
    onRemoveBackground,
    onCancel,
  } = props;
  const [localProcessedImage, setLocalProcessedImage] = useState<string | null>(null);
  const [isImageProcessed, setIsImageProcessed] = useState(false);
  useEffect(() => {
    if (processedImageSrc) {
      setLocalProcessedImage(processedImageSrc);
      setIsImageProcessed(true);
    }
  }, [processedImageSrc]);
  const handleSave = useCallback(() => {
    if (localProcessedImage && onSave) {
      onSave(localProcessedImage);
    }
  }, [localProcessedImage, onSave]);
  const footer = (
    <div className="w-full flex gap-4">
      <button
        onClick={onCancel}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 flex-1"
      >
        Cancel
      </button>
      {localProcessedImage ? (
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 flex-1 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
        >
          Save
        </button>
      ) : (
        <button
          onClick={onRemoveBackground}
          disabled={!imageLoaded || isProcessing}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 flex-1 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
        >
          Remove Background
        </button>
      )}
    </div>
  );
  return (
    <SharedBackgroundRemovalSection
      title="Background Removal"
      description="Remove the background to proceed with text editing in the image section"
      stageSrc={localProcessedImage}
      zoomLevel={zoomLevel}
      loading={isProcessing}
      emptyState={
        isImageProcessed ? (
          <div className="flex flex-col items-center justify-center py-8 text-green-600">
            <CheckCircle2 className="h-10 w-10 mb-2" />
            <div className="text-sm font-medium">Background removed! You can now proceed to text editing.</div>
          </div>
        ) : imageInfo && imageLoaded ? (
          <div className="bg-muted p-2 text-xs md:text-sm rounded flex items-center space-x-2 mb-4">
            <Info className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <div>{imageInfo.size > 0 && <p>File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              {imageLoaded ? "Ready to process image" : "Please upload an image"}
            </p>
          </div>
        )
      }
      footer={footer}
    />
  );
};
export default BackgroundRemovedSection; 