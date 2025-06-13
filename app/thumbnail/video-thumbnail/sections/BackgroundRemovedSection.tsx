import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Info, Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackgroundRemovedSection = ({
  imageInfo,
  imageLoaded,
  processedImageSrc,
  zoomLevel,
  isProcessing,
  processedFrame,
  handleRemoveBackground
}: any) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Background Removal</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Remove the background to proceed with text editing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!processedFrame ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <p className="text-sm">Please select a snapshot first</p>
          </div>
        ) : !processedImageSrc ? (
          <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <div className="relative w-full h-full">
              <img
                src={processedFrame}
                alt="Selected frame"
                className="object-contain w-full h-full"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                }}
                crossOrigin="anonymous"
              />
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <div className="relative w-full h-full">
              <img
                src={processedImageSrc}
                alt="Processed frame"
                className="object-contain w-full h-full"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                }}
                crossOrigin="anonymous"
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleRemoveBackground}
          disabled={!processedFrame || isProcessing}
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
      </CardFooter>
    </Card>
  );
};

export default BackgroundRemovedSection; 