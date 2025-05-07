"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

export interface VideoPlayerProps {
  onMetadataLoaded: (videoInfo: {
    width: number;
    height: number;
    duration: number;
    currentTime: number;
  }) => void;
  onTimeUpdate: (currentTime: number) => void;
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

      <Card>
        <CardHeader className="pb-0 sm:pb-2 px-3 sm:px-4 md:px-6">
          <CardTitle className="text-sm sm:text-base md:text-lg">
            Video Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6">
          {videoInfo && (
            <div className="bg-muted p-2 text-xs sm:text-sm">
              <p>
                Video size: {videoInfo.width}x{videoInfo.height}
              </p>
              <p>Video length: {Math.round(videoInfo.duration * 10) / 10}sec</p>
              <p>
                Playback position: {Math.round(videoInfo.currentTime * 10) / 10}
                sec
              </p>
            </div>
          )}

          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden rounded-md">
            <video
              ref={videoRef}
              className="max-w-full max-h-full"
              controls
              onLoadedMetadata={handleMetadataLoaded}
              crossOrigin="anonymous"
            />
          </div>

          {videoLoaded && (
            <div className="space-y-4">
              <Slider
                value={[videoInfo?.currentTime || 0]}
                max={videoInfo?.duration || 100}
                step={0.01}
                onValueChange={(value) => goToTime(value[0])}
              />

              <div className="flex flex-wrap justify-between gap-1">
                <Button size="sm" variant="outline" onClick={() => goToTime(0)}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => goToTime((videoInfo?.currentTime || 0) - 60)}
                >
                  <Rewind className="h-4 w-4" />
                  <span className="ml-1">1m</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => goToTime((videoInfo?.currentTime || 0) - 5)}
                >
                  <Rewind className="h-4 w-4" />
                  <span className="ml-1">5s</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => goToTime((videoInfo?.currentTime || 0) - 1)}
                >
                  <Rewind className="h-4 w-4" />
                  <span className="ml-1">1s</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    goToTime((videoInfo?.currentTime || 0) - 1 / 25)
                  }
                >
                  <Rewind className="h-4 w-4" />
                  <span className="ml-1">1fr</span>
                </Button>
                <Button size="sm" variant="outline" onClick={togglePlayPause}>
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    goToTime((videoInfo?.currentTime || 0) + 1 / 25)
                  }
                >
                  <FastForward className="h-4 w-4" />
                  <span className="ml-1">1fr</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => goToTime((videoInfo?.currentTime || 0) + 1)}
                >
                  <FastForward className="h-4 w-4" />
                  <span className="ml-1">1s</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => goToTime((videoInfo?.currentTime || 0) + 5)}
                >
                  <FastForward className="h-4 w-4" />
                  <span className="ml-1">5s</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => goToTime((videoInfo?.currentTime || 0) + 60)}
                >
                  <FastForward className="h-4 w-4" />
                  <span className="ml-1">1m</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => goToTime(videoInfo?.duration || 0)}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
