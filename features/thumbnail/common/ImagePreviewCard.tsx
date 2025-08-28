"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, ZoomIn, ZoomOut } from "lucide-react";
import { ReactNode } from "react";
interface ImagePreviewCardProps {
  title?: string;
  description?: string;
  imageSrc?: string | null;
  zoom: number;
  onZoomChange: (value: number) => void;
  filtersCss?: string;
  isLoading?: boolean;
  emptyContent?: ReactNode;
  footer?: ReactNode;
}
export default function ImagePreviewCard({
  title = "Image Preview",
  description,
  imageSrc,
  zoom,
  onZoomChange,
  filtersCss,
  isLoading,
  emptyContent,
  footer,
}: ImagePreviewCardProps) {
  const handleZoomOut = () => onZoomChange(Math.max(50, zoom - 10));
  const handleZoomIn = () => onZoomChange(Math.min(200, zoom + 10));
  const handleZoomReset = () => onZoomChange(100);
  const handleZoomMin = () => onZoomChange(50);
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          {imageSrc ? (
            <div className="relative w-full h-full">
              <img
                src={imageSrc}
                alt="Preview"
                className="object-contain w-full h-full"
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `scale(${zoom / 100})`,
                  filter: filtersCss,
                }}
                crossOrigin="anonymous"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              {isLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              ) : (
                emptyContent
              )}
            </div>
          )}
        </div>
        {imageSrc && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm sm:text-base">{zoom}%</span>
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]" onClick={handleZoomReset} disabled={zoom === 100}>
                <Maximize className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px]" onClick={handleZoomMin} disabled={zoom === 50}>
                <Minimize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
