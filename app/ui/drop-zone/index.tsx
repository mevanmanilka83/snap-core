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
import { UploadIcon, Info } from "lucide-react";

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
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const hiddenImageRef = useRef<HTMLImageElement>(null);
  const previewUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setHasAttemptedLoad(true);

    if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.current);
    }

    previewUrl.current = URL.createObjectURL(file);

    setImageSrc(previewUrl.current);

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
    toast.success("Image loaded successfully");
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
  };

  const handleCancel = () => {
    if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.current);
    }

    previewUrl.current = null;
    setImageInfo(null);
    setImageLoaded(false);
    setError("");
    setHasAttemptedLoad(false);

    const img = hiddenImageRef.current;
    if (img) {
      img.src = "";
    }

    const urlInput = document.getElementById("imageUrl") as HTMLInputElement;
    if (urlInput) {
      urlInput.value = "";
    }

    toast.info("Upload canceled");
  };

  const handleUpload = () => {
    if (!imageLoaded || !previewUrl.current) {
      setError("Please select or load an image first");
      toast.error("Please select or load an image first");
      return;
    }

    toast.success("Image uploaded successfully", {
      description: `${imageInfo?.width}x${imageInfo?.height} ${imageInfo?.type}`,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <img
        ref={hiddenImageRef}
        src="/placeholder.svg"
        alt="Hidden for metadata"
        onLoad={handleImageLoaded}
        onError={handleImageError}
        className="hidden"
        crossOrigin="anonymous"
      />

      <Tabs defaultValue="file">
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
                <div className="flex flex-col items-center justify-center space-y-4 py-12 px-6 border-2 border-gray-300 border-dashed rounded-md transition-colors hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent cursor-pointer">
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

      <Card>
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
            <Button onClick={handleUpload} disabled={!imageLoaded || isLoading}>
              Upload
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
