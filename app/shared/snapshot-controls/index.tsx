"use client";

import { useState } from "react";
import { BackgroundRemovalProps, ImageFilters } from "./types";
import { ImageFilters as ImageFiltersComponent } from "./components/ImageFilters";
import { ProcessedImagePreview } from "./components/ProcessedImagePreview";
import { useBackgroundRemoval } from "./hooks/useBackgroundRemoval";
import { Button } from "@/components/ui/button";

export function BackgroundRemovalProcessor({
  inputImageSrc,
  onProcessed,
  width,
  height,
  showDownload = true,
  showProgressBar = true,
  className = "",
}: BackgroundRemovalProps) {
  const [filters, setFilters] = useState<ImageFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
  });

  const {
    isProcessing,
    error,
    processedImageSrc,
    progress,
    handleRemoveBackground,
  } = useBackgroundRemoval(inputImageSrc);

  const handleResetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <ImageFiltersComponent
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Processing Button */}
      <div className="w-full flex flex-col gap-2">
        <Button
          onClick={handleRemoveBackground}
          disabled={!inputImageSrc || isProcessing}
          variant="secondary"
          className="w-full h-9 md:h-10 text-sm md:text-base flex items-center justify-center"
        >
          {isProcessing ? "Processing..." : "Remove Background"}
        </Button>

        {/* Progress Indicator */}
        {isProcessing && showProgressBar && (
          <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5 dark:bg-gray-700">
            <div 
              className="bg-primary h-2 md:h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
            <p className="text-xs text-center mt-1 text-muted-foreground">
              {progress}% complete
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2 rounded-md text-xs md:text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Processed Image Display */}
        {processedImageSrc && (
          <ProcessedImagePreview
            processedImageSrc={processedImageSrc}
            width={width}
            height={height}
            showDownload={showDownload}
          />
        )}
      </div>
    </div>
  );
}