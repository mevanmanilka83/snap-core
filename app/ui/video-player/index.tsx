"use client";

import type React from "react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  ChevronLeft,
  ChevronRight,
  Camera,
} from "lucide-react";

export interface VideoPlayerProps {
  onMetadataLoaded: (videoInfo: {
    width: number;
    height: number;
    duration: number;
    currentTime: number;
  }) => void;
  onTimeUpdate: (currentTime: number) => void;
  onSnapshot?: (imageData: string) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoLoaded: boolean;
  videoInfo: {
    width: number;
    height: number;
    duration: number;
    currentTime: number;
  } | null;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  crossOrigin?: "anonymous" | "use-credentials" | "";
}

export function VideoPlayer({
  onMetadataLoaded,
  onTimeUpdate,
  onSnapshot,
  videoRef,
  videoLoaded,
  videoInfo,
  isPlaying,
  setIsPlaying,
  crossOrigin = "anonymous",
}: VideoPlayerProps) {
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);

  const handleMetadataLoaded = () => {
    const video = videoRef.current;
    if (!video || isMetadataLoaded) return;

    setIsMetadataLoaded(true);
    onMetadataLoaded({
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
      currentTime: 0,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.src) {
      URL.revokeObjectURL(video.src);
    }

    setIsMetadataLoaded(false);
    video.src = URL.createObjectURL(file);
    video.load();
  };

  const handleURLLoad = (url: string) => {
    const video = videoRef.current;
    if (!video) return;

    setIsMetadataLoaded(false);
    video.src = url;
    video.load();
  };

  const goToTime = (time: number) => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    video.currentTime = Math.min(videoInfo.duration, Math.max(0, time));
    onTimeUpdate(video.currentTime);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handlePreviousFrame = () => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    const newTime = Math.max(0, videoInfo.currentTime - 1);
    goToTime(newTime);
  };

  const handleNextFrame = () => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    const newTime = Math.min(videoInfo.duration, videoInfo.currentTime + 1);
    goToTime(newTime);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = event.target as HTMLVideoElement;
    if (video) {
      onTimeUpdate(video.currentTime);
    }
  };

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (!video) return;

    onTimeUpdate(video.duration);
    setIsMetadataLoaded(false);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    const newTime = Math.min(videoInfo.duration, Math.max(0, value[0]));
    goToTime(newTime);
  };

  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video) {
      toast.error("No video loaded");
      return;
    }

    try {
      // Create canvas with video dimensions
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280; // Default width if not available
      canvas.height = video.videoHeight || 720; // Default height if not available
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        toast.error("Failed to create canvas context");
        return;
      }

      // Draw the current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get the image data
      const imageData = canvas.toDataURL('image/png');
      
      // Send the snapshot to parent component
      if (onSnapshot) {
        onSnapshot(imageData);
        toast.success("Frame captured");
      } else {
        toast.error("Snapshot handler not configured");
      }
    } catch (error) {
      console.error("Error capturing frame:", error);
      toast.error("Failed to capture frame. Please try again.");
    }
  };

  // Add video ready state check
  const handleCanPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    // Video is ready to play
    handleMetadataLoaded();
  };

  // Add loadeddata event handler
  const handleLoadedData = () => {
    const video = videoRef.current;
    if (!video) return;

    // Video data is loaded
    handleMetadataLoaded();
  };

  // Add play event handler
  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Add pause event handler
  const handlePause = () => {
    setIsPlaying(false);
  };

  // Add seeking event handler
  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;

    // Update time when seeking
    onTimeUpdate(video.currentTime);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <Tabs defaultValue="file">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">Video from File</TabsTrigger>
          <TabsTrigger value="url">Video from URL</TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-3 sm:space-y-4">
          <Card>
            <CardContent className="pt-3 sm:pt-4 md:pt-6">
              <Input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="text-xs sm:text-sm md:text-base"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-3 sm:space-y-4">
          <Card>
            <CardContent className="pt-3 sm:pt-4 md:pt-6 space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Input
                  type="text"
                  placeholder="https://"
                  className="w-full"
                  id="videoUrl"
                />
                <Button
                  className="w-full sm:w-24"
                  onClick={() => {
                    const url = (
                      document.getElementById("videoUrl") as HTMLInputElement
                    ).value;
                    if (!url) {
                      toast.error("Please enter a video URL");
                      return;
                    }
                    handleURLLoad(url);
                  }}
                >
                  Load
                </Button>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Currently, youtube/vimeo video URLs are not supported, only URLs
                pointing to a video resource.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Video Player</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {videoInfo ? `${videoInfo.width}x${videoInfo.height}` : "No video loaded"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleMetadataLoaded}
              onCanPlay={handleCanPlay}
              onLoadedData={handleLoadedData}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeeking={handleSeeking}
              onEnded={handleVideoEnd}
              controls={false}
              playsInline
              crossOrigin={crossOrigin}
            />
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <p className="text-sm text-muted-foreground">No video loaded</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousFrame}
                disabled={!videoLoaded}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePlayPause}
                disabled={!videoLoaded}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextFrame}
                disabled={!videoLoaded}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {videoInfo && (
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm">{formatTime(videoInfo.currentTime)}</span>
                <Slider
                  value={[videoInfo.currentTime]}
                  min={0}
                  max={videoInfo.duration}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="text-xs sm:text-sm">{formatTime(videoInfo.duration)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




