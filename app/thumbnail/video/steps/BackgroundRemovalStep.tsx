import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SharedBackgroundRemovalSection from "@/features/thumbnail/common/BackgroundRemovalSection";
const BackgroundRemovedSection = ({
  processedImageSrc,
  zoomLevel,
  isProcessing,
  imageSrc,
  handleRemoveBackground
}: any) => {
  return (
    <SharedBackgroundRemovalSection
      title="Background Removal"
      description="Remove the background to proceed with text editing"
      stageSrc={processedImageSrc || imageSrc}
      zoomLevel={zoomLevel}
      loading={isProcessing}
      emptyState={
        !imageSrc ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <p className="text-sm">Please select a snapshot first</p>
          </div>
        ) : undefined
      }
      footer={
        <Button
          onClick={handleRemoveBackground}
          disabled={!imageSrc || isProcessing}
          className="w-full h-9 sm:h-10"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Removing Background...
            </>
          ) : (
            "Remove Background"
          )}
        </Button>
      }
    />
  );
};
export default BackgroundRemovedSection; 