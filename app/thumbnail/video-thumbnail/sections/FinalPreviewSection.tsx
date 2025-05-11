import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Download } from "lucide-react";

const FinalPreviewSection = ({
  finalThumbnail,
  videoInfo,
  handleSaveFinalThumbnail
}: any) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base sm:text-lg">Final Preview</CardTitle>
      <CardDescription className="text-xs sm:text-sm">Preview your thumbnail with all effects applied</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        {finalThumbnail ? (
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
              {videoInfo ? `${videoInfo.width}x${videoInfo.height}` : 'Preview'}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No preview available</p>
            <p className="text-xs text-gray-400 mt-1">Apply filters and text to see the final preview</p>
          </div>
        )}
      </div>
    </CardContent>
    <CardFooter className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {finalThumbnail && (
          <span>Ready to download</span>
        )}
      </div>
      <Button
        onClick={handleSaveFinalThumbnail}
        disabled={!finalThumbnail}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Thumbnail
      </Button>
    </CardFooter>
  </Card>
);

export default FinalPreviewSection; 