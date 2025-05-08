"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as backgroundRemoval from "@imgly/background-removal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RotateCw } from "lucide-react";

interface BackgroundRemovalProps {
  inputImageSrc: string;
  onProcessed?: (processedImageUrl: string) => void;
  width?: number;
  height?: number;
  showDownload?: boolean;
  showProgressBar?: boolean;
  className?: string;
}

export function BackgroundRemovalProcessor({
  inputImageSrc,
  onProcessed,
  width,
  height,
  showDownload = true,
  showProgressBar = true,
  className = "",
}: BackgroundRemovalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const processedUrl = useRef<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(processedUrl.current);
      }
    };
  }, []);

  // Validate input image
  useEffect(() => {
    if (inputImageSrc) {
      const img = new window.Image();
      img.onload = () => {
        if (img.width === 0 || img.height === 0) {
          setError("Invalid image dimensions");
        } else {
          setError(null);
        }
      };
      img.onerror = () => {
        setError("Failed to load image");
      };
      img.src = inputImageSrc;
    }
  }, [inputImageSrc]);

  const handleResetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setGrayscale(0);
    setSepia(0);
  };

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value[0]);
  };

  const handleContrastChange = (value: number[]) => {
    setContrast(value[0]);
  };

  const handleSaturationChange = (value: number[]) => {
    setSaturation(value[0]);
  };

  const handleBlurChange = (value: number[]) => {
    setBlur(value[0]);
  };

  const handleGrayscaleChange = (value: number[]) => {
    setGrayscale(value[0]);
  };

  const handleSepiaChange = (value: number[]) => {
    setSepia(value[0]);
  };

  const handleRemoveBackground = async () => {
    if (!inputImageSrc) {
      toast.error("No image to process");
      return;
    }

    try {
      setError(null);
      setIsProcessing(true);
      setProgress(0);

      // Process the image with imgly background removal
      const blob = await backgroundRemoval.removeBackground(inputImageSrc, {
        progress: (message: string, progress: number) => {
          setProgress(Math.round(progress * 100));
        },
      });
      
      // Create a URL from the resulting blob
      const processedImageUrl = URL.createObjectURL(blob);
      
      // Revoke the old processed URL if it was a blob
      if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(processedUrl.current);
      }
      
      // Save the transparent background image URL
      processedUrl.current = processedImageUrl;
      setProcessedImageSrc(processedImageUrl);
      
      // Notify parent component if callback provided
      if (onProcessed) {
        onProcessed(processedImageUrl);
      }
      
      toast.success("Background removed successfully");
    } catch (err) {
      console.error("Error removing background:", err);
      toast.error("Failed to remove background");
      setError("Failed to remove background. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveProcessedImage = () => {
    if (!processedImageSrc) {
      toast.error("No processed image to save");
      return;
    }

    // Create a download link
    const link = document.createElement('a');
    link.href = processedImageSrc;
    link.download = `processed-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Image saved successfully");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="w-full">
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base md:text-lg lg:text-xl">Snapshot Controls</CardTitle>
              <CardDescription className="text-xs md:text-sm">Adjust snapshot settings and filters</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs md:text-sm h-8 md:h-9"
              >
                <RotateCw className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Brightness</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[brightness]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={handleBrightnessChange}
                    className="flex-1"
                  />
                  <span className="text-xs md:text-sm w-12 text-right">{brightness}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Contrast</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[contrast]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={handleContrastChange}
                    className="flex-1"
                  />
                  <span className="text-xs md:text-sm w-12 text-right">{contrast}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Saturation</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[saturation]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={handleSaturationChange}
                    className="flex-1"
                  />
                  <span className="text-xs md:text-sm w-12 text-right">{saturation}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Blur</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[blur]}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={handleBlurChange}
                    className="flex-1"
                  />
                  <span className="text-xs md:text-sm w-12 text-right">{blur}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Grayscale</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[grayscale]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleGrayscaleChange}
                    className="flex-1"
                  />
                  <span className="text-xs md:text-sm w-12 text-right">{grayscale}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Sepia</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[sepia]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleSepiaChange}
                    className="flex-1"
                  />
                  <span className="text-xs md:text-sm w-12 text-right">{sepia}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <div className="space-y-2">
            <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
              <div className="relative w-full h-full">
                <img
                  src={processedImageSrc}
                  alt="Background Removed"
                  className="object-contain w-full h-full"
                  style={{
                    width: width ? `${width}px` : '100%',
                    height: height ? `${height}px` : '100%',
                    position: 'absolute',
                    inset: 0
                  }}
                />
              </div>
            </div>
            
            {/* Download Button */}
            {showDownload && (
              <Button
                onClick={handleSaveProcessedImage}
                variant="default"
                className="w-full h-9 md:h-10 text-sm md:text-base flex items-center justify-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Save Image
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}