"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
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
import { UploadIcon, Info, Download, Type, Move, RotateCw } from "lucide-react";
import * as backgroundRemoval from "@imgly/background-removal";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ImageInfo {
  width: number;
  height: number;
  type: string;
  size: number;
}

interface TextElement {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  rotation: number;
  fontFamily: string;
  position: "center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  maxWidth?: number;
  curve?: boolean;
  backgroundColor?: string;
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
  const [processingProgress, setProcessingProgress] = useState(0);
  const hiddenImageRef = useRef<HTMLImageElement>(null);
  const previewUrl = useRef<string | null>(null);
  const processedUrl = useRef<string | null>(null);
  const thumbnailUrl = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Text editing states
  const [textElements, setTextElements] = useState<TextElement[]>([
    { 
      text: "TTV", 
      x: 50, 
      y: 50, 
      fontSize: 72, 
      color: "#ffffff", 
      rotation: 0, 
      fontFamily: "Arial",
      position: "center",
      maxWidth: 80,
      curve: false,
      backgroundColor: ""
    }
  ]);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0);
  const [showTextEditor, setShowTextEditor] = useState<boolean>(false);
  const [pendingThumbnailUpdate, setPendingThumbnailUpdate] = useState<NodeJS.Timeout | null>(null);


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
      
      // Clear any pending thumbnail updates
      if (pendingThumbnailUpdate) {
        clearTimeout(pendingThumbnailUpdate);
      }
    };
  }, [pendingThumbnailUpdate]);

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
    setThumbnailSrc(""); // Clear thumbnail
    setProcessingProgress(0);

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
    setThumbnailSrc(""); // Clear thumbnail
    setProcessingProgress(0);

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
    setThumbnailSrc("");
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
    setThumbnailSrc("");
    setProcessingProgress(0);

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
      setProcessingProgress(0);

      // Use the current image source as input
      const image_src = previewUrl.current;

      // Process the image with imgly background removal
      const blob = await backgroundRemoval.removeBackground(image_src, {
        progress: (message: string, progress: number) => {
          setProcessingProgress(Math.round(progress * 100));
        }
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

  const handleSaveThumbnail = () => {
    if (!thumbnailSrc) {
      toast.error("No thumbnail to save");
      return;
    }
    
    const link = document.createElement('a');
    link.href = thumbnailSrc;
    link.download = `thumbnail-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Thumbnail saved successfully");
  };

  // Update text element properties
  const updateTextElement = (index: number, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map((element, i) => 
        i === index ? { ...element, ...updates } : element
      )
    );
  };

  // Add new text element
  const addTextElement = () => {
    const newElement: TextElement = {
      text: "New Text",
      x: 50,
      y: 50,
      fontSize: 72,
      color: "#ffffff",
      rotation: 0,
      fontFamily: "Arial",
      position: "center",
      maxWidth: 80,
      curve: false,
      backgroundColor: ""
    };
    
    setTextElements(prev => [...prev, newElement]);
    setSelectedTextIndex(textElements.length);
  };

  // Clear text properties to default values
  const clearTextProperties = () => {
    const defaultElement: TextElement = {
      text: "TTV",
      x: 50,
      y: 50,
      fontSize: 72,
      color: "#ffffff",
      rotation: 0,
      fontFamily: "Arial",
      position: "center",
      maxWidth: 80,
      curve: false,
      backgroundColor: ""
    };
    
    updateTextElement(selectedTextIndex, defaultElement);
    toast.success("Text properties reset to default");
  };

  // Remove text element
  const removeTextElement = (index: number) => {
    if (textElements.length <= 1) {
      toast.error("Cannot remove the last text element");
      return;
    }
    
    setTextElements(prev => prev.filter((_, i) => i !== index));
    setSelectedTextIndex(0);
  };

  // Calculate position based on the position property
  const calculatePosition = (element: TextElement, canvasWidth: number, canvasHeight: number) => {
    let x = canvasWidth * (element.x / 100);
    let y = canvasHeight * (element.y / 100);
    
    // Adjust position based on the position property
    switch (element.position) {
      case "left":
        x = 20;
        break;
      case "right":
        x = canvasWidth - 20;
        break;
      case "top":
        y = 20;
        break;
      case "bottom":
        y = canvasHeight - 20;
        break;
      case "top-left":
        x = 20;
        y = 20;
        break;
      case "top-right":
        x = canvasWidth - 20;
        y = 20;
        break;
      case "bottom-left":
        x = 20;
        y = canvasHeight - 20;
        break;
      case "bottom-right":
        x = canvasWidth - 20;
        y = canvasHeight - 20;
        break;
      // center is the default, already calculated
    }
    
    return { x, y };
  };

  // Separate function to create thumbnail with background and text
  const createThumbnail = (transparentImageUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsCreatingThumbnail(true);
    
    // Create a new image for the background (use original image)
    const bgImg = new window.Image();
    bgImg.crossOrigin = "anonymous";
    
    // Create the foreground image with transparent background
    const fgImg = new window.Image();
    fgImg.crossOrigin = "anonymous";
    
    // Set up error handling for both images
    const handleImageError = () => {
      setIsCreatingThumbnail(false);
      toast.error("Failed to load image for thumbnail");
    };
    
    bgImg.onerror = handleImageError;
    fgImg.onerror = handleImageError;
    
    bgImg.onload = () => {
      // Set canvas dimensions based on the original image size
      const img = hiddenImageRef.current;
      if (!img) {
        setIsCreatingThumbnail(false);
        return;
      }
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Draw the original image as background
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      
      // Load the transparent image
      fgImg.onload = () => {
        // Clear any previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background first
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        
        // Draw all text elements
        textElements.forEach(element => {
          ctx.save();
          const position = calculatePosition(element, canvas.width, canvas.height);
          ctx.translate(position.x, position.y);
          if (element.rotation !== 0) {
            ctx.rotate((element.rotation * Math.PI) / 180);
          }
          const scaleFactor = Math.min(canvas.width, canvas.height) / 1000;
          const scaledFontSize = element.fontSize * scaleFactor * 2;
          ctx.font = `bold ${scaledFontSize}px ${element.fontFamily}`;
          if (element.position.includes("left")) {
            ctx.textAlign = "left";
          } else if (element.position.includes("right")) {
            ctx.textAlign = "right";
          } else {
            ctx.textAlign = "center";
          }
          if (element.position.includes("top")) {
            ctx.textBaseline = "top";
          } else if (element.position.includes("bottom")) {
            ctx.textBaseline = "bottom";
          } else {
            ctx.textBaseline = "middle";
          }
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          const maxWidth = (element.maxWidth ?? 80) / 100 * canvas.width;
          // Draw background rectangle if backgroundColor is set
          if (element.backgroundColor && element.backgroundColor !== '#00000000') {
            const metrics = ctx.measureText(element.text);
            const textHeight = scaledFontSize * 1.2;
            let rectWidth = Math.min(metrics.width, maxWidth);
            let rectX = 0;
            if (ctx.textAlign === 'center') rectX = -rectWidth / 2;
            if (ctx.textAlign === 'right') rectX = -rectWidth;
            let rectY = 0;
            if (ctx.textBaseline === 'middle') rectY = -textHeight / 2;
            if (ctx.textBaseline === 'bottom') rectY = -textHeight;
            ctx.save();
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = element.backgroundColor;
            ctx.fillRect(rectX, rectY, rectWidth, textHeight);
            ctx.restore();
          }
          // Draw curved text if enabled
          if (element.curve) {
            const text = element.text;
            const radius = Math.max(80, scaledFontSize * 2);
            const angleStep = Math.PI / (text.length + 1);
            let startAngle = -Math.PI / 2 - (angleStep * (text.length - 1)) / 2;
            for (let i = 0; i < text.length; i++) {
              const char = text[i];
              ctx.save();
              ctx.rotate(startAngle + i * angleStep);
              ctx.translate(0, -radius);
              ctx.fillStyle = element.color;
              ctx.fillText(char, 0, 0);
              ctx.restore();
            }
          } else {
            ctx.fillStyle = element.color;
            ctx.fillText(element.text, 0, 0, maxWidth);
          }
          ctx.restore();
        });
        
        // Finally draw the transparent image on top
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
        setIsCreatingThumbnail(false);
      };
      
      // Load the transparent image
      fgImg.src = transparentImageUrl;
    };
    
    // Load the original image as background
    bgImg.src = imageSrc;
  };

  return (
    <div className="space-y-6 w-full">
      <canvas ref={canvasRef} className="hidden" />
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
                    
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      if (file.type.startsWith('image/')) {
                        // Create a synthetic change event
                        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                        if (fileInput) {
                          // Create a DataTransfer object to set files
                          const dataTransfer = new DataTransfer();
                          dataTransfer.items.add(file);
                          fileInput.files = dataTransfer.files;
                          
                          // Trigger the change handler
                          const event = new Event('change', { bubbles: true });
                          fileInput.dispatchEvent(event);
                        }
                      } else {
                        toast.error("Please drop an image file");
                      }
                    } else if (e.dataTransfer.getData('text/plain')) {
                      const data = e.dataTransfer.getData('text/plain');
                      if (data.startsWith('data:image')) {
                        setError("");
                        setHasAttemptedLoad(true);
                        setIsLoading(true);

                        if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
                          URL.revokeObjectURL(previewUrl.current);
                        }

                        previewUrl.current = data;
                        setImageSrc(data);
                        setProcessedImageSrc(""); // Clear processed image
                        setThumbnailSrc(""); // Clear thumbnail
                        setProcessingProgress(0);

                        const img = hiddenImageRef.current;
                        if (img) {
                          img.src = data;
                        }

                        setImageLoaded(false);
                      }
                    }
                  }}
                >
                  <UploadIcon className="h-12 w-12 text-gray-400" />
                  <div className="font-medium text-gray-900 dark:text-gray-50">
                    Click or drop image here
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
                <img
                  src={imageSrc || "/placeholder.svg"}
                  alt="Preview"
                  className="object-contain w-full h-full"
                  style={{ objectFit: 'contain', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                  crossOrigin="anonymous"
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
          
          <div className="mt-4">
            <CardTitle className="mb-2">Background Removed</CardTitle>
            <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
              <div className="relative w-full h-full">
                {processedImageSrc ? (
                  <img
                    src={processedImageSrc}
                    alt="Background Removed"
                    className="object-contain w-full h-full"
                    style={{ objectFit: 'contain', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                    crossOrigin="anonymous"
                  />
                ) : isProcessing ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-sm text-gray-500">
                      Removing background... {processingProgress}%
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">
                      {imageLoaded
                        ? "Ready to process image"
                        : "Please upload an image"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <CardTitle className="mb-2">Thumbnail Preview</CardTitle>
            <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
              <div className="relative w-full h-full">
                {thumbnailSrc ? (
                  <img
                    src={thumbnailSrc}
                    alt="Thumbnail"
                    className="object-contain w-full h-full"
                    style={{ objectFit: 'contain', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                    crossOrigin="anonymous"
                  />
                ) : isCreatingThumbnail ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-sm text-gray-500">
                      Creating thumbnail...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">
                      {processedImageSrc
                        ? "Ready to generate thumbnail"
                        : "Process image first"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleRemoveBackground}
            disabled={!imageLoaded || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                Processing...
              </span>
            ) : (
              "Process Image"
            )}
          </Button>
          
          <Button
            onClick={handleCreateThumbnail}
            disabled={!processedImageSrc || isCreatingThumbnail}
            className="flex-1"
          >
            {isCreatingThumbnail ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                Creating...
              </span>
            ) : (
              "Create Thumbnail"
            )}
          </Button>
          
          <Button
            onClick={handleSaveBackgroundRemoved}
            disabled={!processedImageSrc}
            variant="secondary"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Save Processed Image
          </Button>

          <Button
            onClick={handleSaveThumbnail}
            disabled={!thumbnailSrc}
            variant="default"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Thumbnail
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Text Editor</CardTitle>
          <CardDescription>
            Customize text for your thumbnail
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Select 
                value={selectedTextIndex.toString()} 
                onValueChange={(value) => setSelectedTextIndex(parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select text" />
                </SelectTrigger>
                <SelectContent>
                  {textElements.map((element, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {element.text.substring(0, 15)}{element.text.length > 15 ? '...' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={addTextElement}>
                Add Text
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeTextElement(selectedTextIndex)}
                disabled={textElements.length <= 1}
              >
                Remove
              </Button>
            </div>
          </div>

          <div className="space-y-3 border p-3 rounded-md">
            <div className="space-y-1">
              <Label htmlFor="text-content">Text Content</Label>
              <textarea
                id="text-content"
                value={textElements[selectedTextIndex]?.text || ''}
                onChange={(e) => updateTextElement(selectedTextIndex, { text: e.target.value })}
                className="font-bold w-full min-h-[60px] p-2 rounded border border-input bg-background"
                rows={3}
              />
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={!!textElements[selectedTextIndex]?.curve}
                    onChange={e => updateTextElement(selectedTextIndex, { curve: e.target.checked })}
                  />
                  Curve Text
                </label>
                <label className="flex items-center gap-1 text-sm">
                  Text Background
                  <input
                    type="color"
                    value={textElements[selectedTextIndex]?.backgroundColor || '#00000000'}
                    onChange={e => updateTextElement(selectedTextIndex, { backgroundColor: e.target.value })}
                    className="w-8 h-6 p-0 border-none bg-transparent"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Position</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'left' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'left' })}>Left</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'center' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'center' })}>Center</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'right' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'right' })}>Right</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'top' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'top' })}>Top</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'bottom' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'bottom' })}>Bottom</Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <Label htmlFor="x-position">X Position (%)</Label>
                  <Input
                    id="x-position"
                    type="number"
                    min={0}
                    max={100}
                    value={textElements[selectedTextIndex]?.x ?? 50}
                    onChange={(e) => updateTextElement(selectedTextIndex, { x: Number(e.target.value) })}
                    className="w-24"
                  />
                </div>
                <div>
                  <Label htmlFor="y-position">Y Position (%)</Label>
                  <Input
                    id="y-position"
                    type="number"
                    min={0}
                    max={100}
                    value={textElements[selectedTextIndex]?.y ?? 50}
                    onChange={(e) => updateTextElement(selectedTextIndex, { y: Number(e.target.value) })}
                    className="w-24"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="max-width">Text Width (%)</Label>
                <Input
                  id="max-width"
                  type="number"
                  min={10}
                  max={100}
                  value={textElements[selectedTextIndex]?.maxWidth ?? 80}
                  onChange={(e) => updateTextElement(selectedTextIndex, { maxWidth: Number(e.target.value) })}
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Font Size</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={12}
                  max={200}
                  value={textElements[selectedTextIndex]?.fontSize || 36}
                  onChange={(e) => updateTextElement(selectedTextIndex, { fontSize: Number(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">px</span>
                <Button type="button" size="sm" variant="outline" onClick={() => updateTextElement(selectedTextIndex, { fontSize: 36 })}>sm</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => updateTextElement(selectedTextIndex, { fontSize: 72 })}>lg</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => updateTextElement(selectedTextIndex, { fontSize: 120 })}>xl</Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Rotation</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[textElements[selectedTextIndex]?.rotation || 0]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={(value) => updateTextElement(selectedTextIndex, { rotation: value[0] })}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={-180}
                  max={180}
                  value={textElements[selectedTextIndex]?.rotation || 0}
                  onChange={(e) => updateTextElement(selectedTextIndex, { rotation: Number(e.target.value) })}
                  className="w-20"
                />
                <div className="flex gap-1 ml-2">
                  {[-45, -15, 0, 15, 45].map((deg) => (
                    <Button
                      key={deg}
                      type="button"
                      size="sm"
                      variant={textElements[selectedTextIndex]?.rotation === deg ? 'default' : 'outline'}
                      onClick={() => updateTextElement(selectedTextIndex, { rotation: deg })}
                    >
                      {deg}&deg;
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={textElements[selectedTextIndex]?.color || '#ffffff'}
                  onChange={(e) => updateTextElement(selectedTextIndex, { color: e.target.value })}
                  className="w-12 h-8 p-1"
                />
                <span className="text-sm text-muted-foreground">
                  {textElements[selectedTextIndex]?.color}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Font Family</Label>
              <Select
                value={textElements[selectedTextIndex]?.fontFamily || 'Arial'}
                onValueChange={(value) => updateTextElement(selectedTextIndex, { fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={clearTextProperties}
                className="flex items-center gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Reset to Default
              </Button>
              <Button
                type="button"
                className="ml-2"
                onClick={handleCreateThumbnail}
                disabled={!processedImageSrc || isCreatingThumbnail}
              >
                {isCreatingThumbnail ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                    Applying...
                  </span>
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}