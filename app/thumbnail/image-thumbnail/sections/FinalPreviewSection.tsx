import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

const FinalPreviewSection = (props: any) => {
  const { thumbnailSrc, handleDownload, handleShare, isCreatingThumbnail } = props;

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">Final Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 md:p-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          {thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt="Final thumbnail preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Process image first
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleDownload}
            disabled={!thumbnailSrc || isCreatingThumbnail}
            className="flex-1 text-xs md:text-sm h-8 md:h-9"
          >
            <Download className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            disabled={!thumbnailSrc || isCreatingThumbnail}
            className="flex-1 text-xs md:text-sm h-8 md:h-9"
          >
            <Share2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalPreviewSection; 