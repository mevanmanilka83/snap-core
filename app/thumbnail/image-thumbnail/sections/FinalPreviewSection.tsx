import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Download, AlertCircle } from "lucide-react";

const FinalPreviewSection = ({
  finalThumbnail,
  imageInfo,
  handleSaveFinalThumbnail,
  processedImageSrc,
  textElements,
  backgroundRemoved
}: any) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Final Preview</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {processedImageSrc ? "Preview your thumbnail with all effects applied" : "Background removal required"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!backgroundRemoved ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <p className="text-sm">Please remove the background first to see the final preview</p>
            <p className="text-xs mt-2">Go to the Background Removal section and use the Remove Background button</p>
          </div>
        ) : !finalThumbnail ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm">No preview available</p>
            <p className="text-xs mt-2">Add text in the Text tab to see the final preview</p>
          </div>
        ) : (
          <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <div className="relative w-full h-full">
              <img
                src={finalThumbnail}
                alt="Final Thumbnail"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error("Error loading final thumbnail");
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {imageInfo ? `${imageInfo.width}x${imageInfo.height}` : 'Preview'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {finalThumbnail && (
            <span>Ready to download</span>
          )}
        </div>
        <Button
          onClick={handleSaveFinalThumbnail}
          disabled={!backgroundRemoved || !finalThumbnail}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Thumbnail
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinalPreviewSection; 