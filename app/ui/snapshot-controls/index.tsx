"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as backgroundRemoval from "@imgly/background-removal";

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

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(processedUrl.current);
      }
    };
  }, []);

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
      {/* Processing Button */}
      <Button
        onClick={handleRemoveBackground}
        disabled={!inputImageSrc || isProcessing}
        variant="secondary"
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Remove Background"}
      </Button>

      {/* Progress Indicator */}
      {isProcessing && showProgressBar && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-xs text-center mt-1 text-muted-foreground">
            {progress}% complete
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2 rounded-md text-sm text-red-600 dark:text-red-400">
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
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Save Image
            </Button>
          )}
        </div>
      )}
    </div>
  );
}