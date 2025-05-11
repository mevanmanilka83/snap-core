import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Maximize, Minimize, ZoomIn, ZoomOut, Undo, Redo, RotateCw, Palette, ImageIcon, Sparkles } from "lucide-react";
import FiltersSection from "./FiltersSection";
import BackgroundRemovedSection from "./BackgroundRemovedSection";
import * as backgroundRemoval from "@imgly/background-removal";
import { toast } from "sonner";

const EditSection = ({
  processedFrame,
  zoomLevel,
  setZoomLevel,
  imageFilters,
  setImageFilters,
  handleUndo,
  handleRedo,
  undoStack,
  redoStack,
  handleCreateThumbnail,
  handleApplyFilters,
  resetFilters,
  applyPresetFilter,
  imageInfo,
  imageLoaded,
  processedImageSrc,
  isProcessing,
  isCreatingThumbnail,
  setProcessedImageSrc,
  setIsProcessing,
  setUndoStack,
  setRedoStack,
  setProcessingProgress
}: any) => {
  const handleRemoveBackground = async () => {
    if (!processedFrame) {
      toast.error("Please select a frame first");
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingProgress(0);

      // Save current state to undo stack
      if (processedImageSrc) {
        setUndoStack((prev: string[]) => [...prev, processedImageSrc]);
        setRedoStack([]); // Clear redo stack on new action
      }

      // Process the image with imgly background removal
      const blob = await backgroundRemoval.removeBackground(processedFrame, {
        progress: (message: string, progress: number) => {
          setProcessingProgress(progress);
        },
      });

      // Create a URL from the resulting blob
      const processedImageUrl = URL.createObjectURL(blob);
      setProcessedImageSrc(processedImageUrl);

      toast.success("Background removed successfully");
    } catch (err) {
      console.error("Error removing background:", err);
      toast.error("Failed to remove background");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-2 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Edit Frame</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {/* You may want to pass selectedSnapshotIndex and show which snapshot is being edited */}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            {processedFrame ? (
              <div className="relative w-full h-full">
                <img
                  src={processedFrame || "/placeholder.svg"}
                  alt="Processed frame"
                  className="object-contain w-full h-full"
                  style={{
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
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <ImageIcon className="h-12 w-12 sm:h-14 sm:w-14 text-gray-400 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No frame selected</p>
              </div>
            )}
          </div>
          {processedFrame && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]"
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  disabled={zoomLevel <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm sm:text-base">{zoomLevel}%</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]"
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                  disabled={zoomLevel >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]"
                  onClick={() => setZoomLevel(100)}
                  disabled={zoomLevel === 100}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]"
                  onClick={() => setZoomLevel(50)}
                  disabled={zoomLevel === 50}
                >
                  <Minimize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={handleRemoveBackground}
            disabled={!processedFrame || isProcessing}
            className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10 min-h-[36px] bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
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
      <div className="space-y-4 sm:space-y-6">
        <FiltersSection
          imageFilters={imageFilters}
          setImageFilters={setImageFilters}
          resetFilters={resetFilters}
          applyPresetFilter={applyPresetFilter}
          handleCreateThumbnail={handleCreateThumbnail}
          processedFrame={processedFrame}
          isCreatingThumbnail={isCreatingThumbnail}
        />
        <BackgroundRemovedSection
          imageInfo={imageInfo}
          imageLoaded={imageLoaded}
          processedImageSrc={processedImageSrc}
          zoomLevel={zoomLevel}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default EditSection; 