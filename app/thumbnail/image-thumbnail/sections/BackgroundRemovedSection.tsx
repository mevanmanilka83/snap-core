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
        {processedImageSrc && (
          <div data-slot="card-footer" className="items-center [.border-t]:pt-6 flex flex-wrap gap-2 p-4 md:p-6">
            <button 
              data-slot="button" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 flex-1"
            >
              Cancel
            </button>
            <button 
              data-slot="button" 
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
      </CardContent>
    </Card>
  );
};

export default BackgroundRemovedSection; 