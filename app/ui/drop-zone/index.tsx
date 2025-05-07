"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadIcon, Info, Download } from "lucide-react";
import * as backgroundRemoval from "@imgly/background-removal";

interface ImageInfo {
  width: number;
  height: number;
  type: string;
  size: number;
}

export default function ImageUploader() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageSrc, setImageSrc] = useState<string>("");
  const [processedImageSrc, setProcessedImageSrc] = useState<string>("");
  const [thumbnailSrc, setThumbnailSrc] = useState<string>("");
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingThumbnail, setIsCreatingThumbnail] = useState(false);
  const hiddenImageRef = useRef<HTMLImageElement>(null);
  const previewUrl = useRef<string | null>(null);
  const processedUrl = useRef<string | null>(null);
  const thumbnailUrl = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    return () => {
      // Clean up blob URLs on unmount
      if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl.current);
      }
      if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(processedUrl.current);
      }
      if (thumbnailUrl.current && thumbnailUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailUrl.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setHasAttemptedLoad(true);
    setIsLoading(true);

    if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.current);
    }

    previewUrl.current = URL.createObjectURL(file);

    setImageSrc(previewUrl.current);
    setProcessedImageSrc(""); // Clear processed image

    const img = hiddenImageRef.current;
    if (img) {
      img.src = previewUrl.current;
    }

    setImageLoaded(false);

    setImageInfo({
      width: 0,
      height: 0,
      type: file.type,
      size: file.size,
    });
  };

  const handleURLLoad = () => {
    const urlInput = document.getElementById("imageUrl") as HTMLInputElement;
    const url = urlInput.value.trim();

    if (!url) {
      setError("Please enter an image URL");
      toast.error("Please enter an image URL");
      return;
    }

    setError("");
    setIsLoading(true);
    setHasAttemptedLoad(true);

    if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = null;
    }

    previewUrl.current = url;
    setImageSrc(url);
    setProcessedImageSrc(""); // Clear processed image

    const img = hiddenImageRef.current;
    if (img) {
      img.src = url;
    }

    setImageLoaded(false);
  };

  const handleImageLoaded = () => {
    const img = hiddenImageRef.current;
    if (!img) return;

    setImageInfo({
      width: img.naturalWidth,
      height: img.naturalHeight,
      type: img.src.split(".").pop()?.toUpperCase() || "UNKNOWN",
      size: 0,
    });

    setImageLoaded(true);
    setIsLoading(false);
    
    // Draw the image to canvas after loading
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleImageError = () => {
    if (hasAttemptedLoad) {
      setError(
        "Failed to load image. Please check the URL or file and try again."
      );
    }
    setImageLoaded(false);
    setIsLoading(false);
    setImageSrc("");
    setProcessedImageSrc("");
  };

  const handleCancel = () => {
    if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.current);
    }
    if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(processedUrl.current);
    }
    if (thumbnailUrl.current && thumbnailUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailUrl.current);
    }

    previewUrl.current = null;
    processedUrl.current = null;
    thumbnailUrl.current = null;
    setImageInfo(null);
    setImageLoaded(false);
    setError("");
    setHasAttemptedLoad(false);
    setImageSrc("");
    setProcessedImageSrc("");

    const img = hiddenImageRef.current;
    if (img) {
      img.src = "";
    }

    const urlInput = document.getElementById("imageUrl") as HTMLInputElement;
    if (urlInput) {
      urlInput.value = "";
    }
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleUpload = () => {
    if (!imageLoaded || !previewUrl.current) {
      setError("Please select an image first");
      toast.error("Please select an image first");
      return;
    }

    toast.success("Image uploaded successfully", {
      description: `${imageInfo?.width}x${imageInfo?.height} ${imageInfo?.type}`,
    });
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

  const handleRemoveBackground = async () => {
    if (!imageLoaded || !previewUrl.current) {
      setError("Please select an image first");
      toast.error("Please select an image first");
      return;
    }

    try {
      setIsProcessing(true);
      setThumbnailSrc(""); // Clear any existing thumbnail

      // Use the current image source as input
      const image_src = previewUrl.current;

      // Process the image with imgly background removal
      const blob = await backgroundRemoval.removeBackground(image_src);
      
      // Create a URL from the resulting blob
      const processedImageUrl = URL.createObjectURL(blob);
      
      // Revoke the old processed URL if it was a blob
      if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(processedUrl.current);
      }
      
      // Save the transparent background image URL
      processedUrl.current = processedImageUrl;
      setProcessedImageSrc(processedImageUrl);
      
      toast.success("Background removed successfully");
      
    } catch (err) {
      console.error("Error removing background:", err);
      toast.error("Failed to remove background");
      setError("Failed to remove background. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateThumbnail = () => {
    if (!processedImageSrc) {
      toast.error("Please remove background first");
      return;
    }
    setIsCreatingThumbnail(true);
    createThumbnail(processedImageSrc);
  };

  const handleSaveBackgroundRemoved = () => {
    if (!processedImageSrc) return;
    
    const link = document.createElement('a');
    link.href = processedImageSrc;
    link.download = `background-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Image saved successfully");
  };

  // Separate function to create thumbnail with background and text
  const createThumbnail = (transparentImageUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create a new image for the background
    const bgImg = new window.Image();
    bgImg.crossOrigin = "anonymous";
    
    bgImg.onload = () => {
      // Set canvas dimensions based on the original image size
      const img = hiddenImageRef.current;
      if (!img) return;
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Step 1: Draw the background image (tiled or stretched)
      ctx.fillStyle = "#f0f0f0"; // Fallback background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw background image (stretched to fit)
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      
      // Step 2: Draw text in the center
      const fontSize = Math.min(canvas.width, canvas.height) * 0.2; // Adjust size based on canvas
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Add shadow to text for better visibility
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw text
      ctx.fillStyle = "#ffffff";
      ctx.fillText("TTV", canvas.width / 2, canvas.height / 2);
      
      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Step 3: Draw the processed image with transparent background on top
      const fgImg = new window.Image();
      fgImg.crossOrigin = "anonymous";
      
      fgImg.onload = () => {
        // Draw the transparent background image on top
        ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL and update thumbnail
        const finalImageUrl = canvas.toDataURL('image/png');
        
        // Revoke old thumbnail URL if it exists
        if (thumbnailUrl.current && thumbnailUrl.current.startsWith("blob:")) {
          URL.revokeObjectURL(thumbnailUrl.current);
        }
        
        // Update the thumbnail
        thumbnailUrl.current = finalImageUrl;
        setThumbnailSrc(finalImageUrl);
      };
      
      // Load the transparent image
      fgImg.src = transparentImageUrl;
    };
    
    // Load the background image
    bgImg.src = "/placeholder.svg"; // Replace with your actual background image path
    
    // Handle background image loading error
    bgImg.onerror = () => {
      // If background image fails to load, create a gradient background instead
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#3498db");
      gradient.addColorStop(1, "#8e44ad");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Continue with text and foreground image
      const fontSize = Math.min(canvas.width, canvas.height) * 0.2;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("TTV", canvas.width / 2, canvas.height / 2);
      
      // Load the transparent foreground image
      const fgImg = new window.Image();
      fgImg.crossOrigin = "anonymous";
      fgImg.onload = () => {
        ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
        const finalImageUrl = canvas.toDataURL('image/png');
        
        // Revoke old thumbnail URL if it exists
        if (thumbnailUrl.current && thumbnailUrl.current.startsWith("blob:")) {
          URL.revokeObjectURL(thumbnailUrl.current);
        }
        
        // Update the thumbnail
        thumbnailUrl.current = finalImageUrl;
        setThumbnailSrc(finalImageUrl);
      };
      fgImg.src = transparentImageUrl;
    };
  };

  return (
    <div className="space-y-6 w-full">
      <img
        ref={hiddenImageRef}
        src="/placeholder.svg"
        alt="Hidden for metadata"
        onLoad={handleImageLoaded}
        onError={handleImageError}
        className="hidden"
        crossOrigin="anonymous"
      />

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">Image from File</TabsTrigger>
          <TabsTrigger value="url">Image from URL</TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image File</CardTitle>
              <CardDescription>
                Select an image file from your device
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <label htmlFor="file-upload">
                <div className="flex flex-col items-center justify-center space-y-4 py-12 px-6 border-2 border-gray-300 border-dashed rounded-md transition-colors hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent cursor-pointer"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.add('border-primary');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove('border-primary');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove('border-primary');
                    
                    const data = e.dataTransfer.getData('text/plain');
                    if (data && data.startsWith('data:image')) {
                      setError("");
                      setHasAttemptedLoad(true);
                      setIsLoading(true);

                      if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
                        URL.revokeObjectURL(previewUrl.current);
                      }

                      previewUrl.current = data;
                      setImageSrc(data);
                      setProcessedImageSrc(""); // Clear processed image

                      const img = hiddenImageRef.current;
                      if (img) {
                        img.src = data;
                      }

                      setImageLoaded(false);
                    }
                  }}
                >
                  <UploadIcon className="h-12 w-12 text-gray-400" />
                  <div className="font-medium text-gray-900 dark:text-gray-50">
                    Click to select an image
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Image files only (jpg, png, gif, etc.)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </div>
              </label>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload from URL</CardTitle>
              <CardDescription>
                Enter the URL of an image you want to upload
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="col-span-3"
                  id="imageUrl"
                />
                <Button onClick={handleURLLoad} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                      Loading
                    </span>
                  ) : (
                    "Load"
                  )}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Enter a direct URL to an image file (jpg, png, gif, etc.)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Image Preview</CardTitle>
          {error && hasAttemptedLoad && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {imageInfo && imageLoaded && (
            <div className="bg-muted p-2 text-sm rounded flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <div>
                <p>
                  Image size: {imageInfo.width}x{imageInfo.height} pixels
                </p>
                {imageInfo.size > 0 && (
                  <p>File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>
                )}
              </div>
            </div>
          )}

          <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            {imageSrc && imageLoaded ? (
              <div className="relative w-full h-full">
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-contain"
                  unoptimized={imageSrc.startsWith("blob:")}
                />
              </div>
            ) : (
              <>
                {!isLoading && !error && (
                  <div className="text-center p-4">
                    <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No image selected
                    </p>
                  </div>
                )}
                {isLoading && (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {imageLoaded && processedImageSrc && (
            <div className="mt-4">
              <CardTitle className="mb-2">Background Removed</CardTitle>
              <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                <div className="relative w-full h-full">
                  <Image
                    src={processedImageSrc}
                    alt="Background Removed"
                    fill
                    className="object-contain"
                    unoptimized={true}
                  />
                </div>
              </div>
              <div className="mt-2">
                <Button
                  onClick={handleSaveBackgroundRemoved}
                  variant="default"
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Save Image
                </Button>
              </div>
            </div>
          )}

          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle>Create Thumbnail</CardTitle>
              <CardDescription>
                Add background and text to create a thumbnail
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!processedImageSrc ? (
                <div className="text-center py-8 text-muted-foreground">
                  Remove background first to create a thumbnail
                </div>
              ) : (
                <div className="space-y-4">
                  {thumbnailSrc ? (
                    <>
                      <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="relative w-full h-full">
                          <Image
                            src={thumbnailSrc}
                            alt="Thumbnail Preview"
                            fill
                            className="object-contain"
                            unoptimized={true}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveProcessedImage}
                          variant="default"
                          className="w-full sm:w-auto"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Save Thumbnail
                        </Button>
                        <Button
                          onClick={handleCreateThumbnail}
                          variant="secondary"
                          className="w-full sm:w-auto"
                        >
                          Recreate Thumbnail
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Button
                        onClick={handleCreateThumbnail}
                        variant="default"
                        disabled={isCreatingThumbnail}
                        className="w-full sm:w-auto"
                      >
                        {isCreatingThumbnail ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-primary rounded-full"></span>
                            Creating...
                          </span>
                        ) : (
                          "Create Thumbnail"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={!imageLoaded && !previewUrl.current}
            >
              Cancel
            </Button>
            <Button 
              variant="secondary"
              onClick={handleRemoveBackground} 
              disabled={!imageLoaded || isLoading || isProcessing || isCreatingThumbnail}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-primary rounded-full"></span>
                  Processing
                </span>
              ) : (
                "Remove Background"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
