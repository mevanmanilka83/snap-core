"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
}: VideoPlayerProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.src) {
      URL.revokeObjectURL(video.src);
    }

    video.src = URL.createObjectURL(file);
    video.load();
  };

  const handleURLLoad = (url: string) => {
    const video = videoRef.current;
    if (!video) return;

    video.src = url;
    video.load();
  };

  const handleMetadataLoaded = () => {
    const video = videoRef.current;
    if (!video) return;

    onMetadataLoaded({
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
      currentTime: 0,
    });
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

  const takeSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      if (onSnapshot) {
        onSnapshot(imageData);
      }
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

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    onMetadataLoaded({
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
      currentTime: 0,
    });
  };

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (!video) return;

    onTimeUpdate(video.duration);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    const newTime = Math.min(videoInfo.duration, Math.max(0, value[0]));
    goToTime(newTime);
  };

  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      if (onSnapshot) {
        onSnapshot(imageData);
      }
    }
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

      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Video Player</CardTitle>
              <CardDescription className="text-sm">Preview and capture frames from your video</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousFrame}
                disabled={!videoRef.current || isPlaying}
                className="h-8 w-8 md:h-10 md:w-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextFrame}
                disabled={!videoRef.current || isPlaying}
                className="h-8 w-8 md:h-10 md:w-10 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                disabled={!videoRef.current}
                className="h-8 w-8 md:h-10 md:w-10 p-0"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnd}
            />
            {!videoRef.current?.src && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No video selected</p>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs md:text-sm text-muted-foreground">Current Time:</span>
                <span className="text-xs md:text-sm font-mono">{formatTime(videoInfo?.currentTime || 0)}</span>
              </div>
              <Slider
                value={[videoInfo?.currentTime || 0]}
                min={0}
                max={videoInfo?.duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs md:text-sm text-muted-foreground">{formatTime(0)}</span>
                <span className="text-xs md:text-sm text-muted-foreground">{formatTime(videoInfo?.duration || 0)}</span>
              </div>
            </div>
            <Button
              onClick={handleCaptureFrame}
              disabled={!videoRef.current || isPlaying}
              className="w-full md:w-auto"
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture Frame
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
