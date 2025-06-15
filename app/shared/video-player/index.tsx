"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Play,
  Pause,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface VideoPlayerProps {
  url: string;
  onMetadataLoaded: (metadata: { width: number; height: number; duration: number; currentTime: number }) => void;
  onTimeUpdate: (currentTime: number) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoLoaded: boolean;
  videoInfo: { width: number; height: number; duration: number; currentTime: number } | null;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export function VideoPlayer({
  url,
  onMetadataLoaded,
  onTimeUpdate,
  videoRef,
  videoLoaded,
  videoInfo,
  isPlaying,
  setIsPlaying,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const metadataLoadedRef = useRef(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const handleMetadataLoaded = () => {
    const video = videoRef.current;
    if (!video || metadataLoadedRef.current) return;

    try {
      metadataLoadedRef.current = true;
      onMetadataLoaded({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        currentTime: video.currentTime,
      });
    } catch (err) {
      console.error("Error loading video metadata:", err);
      setError("Failed to load video metadata");
      toast.error("Failed to load video metadata");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const video = videoRef.current;
    if (!video) return;

    try {
      setIsLoading(true);
      setError(null);
      metadataLoadedRef.current = false;

      // Clean up old URL if exists
      if (video.src) {
        URL.revokeObjectURL(video.src);
      }

      const blobUrl = URL.createObjectURL(file);
      video.src = blobUrl;
      video.load();

      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        const handleCanPlay = () => {
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
          resolve(void 0);
        };

        const handleError = () => {
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
          reject(new Error("Failed to load video"));
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);
      });

    } catch (err) {
      console.error("Error loading video file:", err);
      setError("Failed to load video file");
      toast.error("Failed to load video file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleURLLoad = async (url: string) => {
    const video = videoRef.current;
    if (!video) return;

    try {
      setIsLoading(true);
      setError(null);
      metadataLoadedRef.current = false;

      // Clean up old URL if exists
      if (video.src) {
        URL.revokeObjectURL(video.src);
      }

      video.src = url;
      video.load();

      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        const handleCanPlay = () => {
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
          resolve(void 0);
        };

        const handleError = () => {
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
          reject(new Error("Failed to load video"));
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);
      });

    } catch (err) {
      console.error("Error loading video URL:", err);
      setError("Failed to load video URL");
      toast.error("Failed to load video URL");
    } finally {
      setIsLoading(false);
    }
  };

  const goToTime = async (time: number) => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    try {
      const newTime = Math.min(videoInfo.duration, Math.max(0, time));
      video.currentTime = newTime;
      onTimeUpdate(newTime);
    } catch (err) {
      console.error("Error seeking video:", err);
      toast.error("Failed to seek video");
    }
  };

  const togglePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Error toggling play/pause:", err);
      toast.error("Failed to play/pause video");
    }
  };

  const handleRewind = async () => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    try {
      const newTime = Math.max(0, videoInfo.currentTime - 5); // Rewind 5 seconds
      await goToTime(newTime);
    } catch (err) {
      console.error("Error rewinding video:", err);
      toast.error("Failed to rewind video");
    }
  };

  const handleFastForward = async () => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    try {
      const newTime = Math.min(videoInfo.duration, videoInfo.currentTime + 5); // Forward 5 seconds
      await goToTime(newTime);
    } catch (err) {
      console.error("Error fast forwarding video:", err);
      toast.error("Failed to fast forward video");
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
    setIsPlaying(false);
  };

  const handleSeek = async (value: number[]) => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    try {
      const newTime = Math.min(videoInfo.duration, Math.max(0, value[0]));
      await goToTime(newTime);
    } catch (err) {
      console.error("Error seeking video:", err);
      toast.error("Failed to seek video");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume || 1;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = async () => {
    if (!playerRef.current) return;

    try {
      if (!isFullscreen) {
        await playerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
      toast.error("Failed to toggle fullscreen");
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoLoaded) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlayPause();
          break;
        case "arrowleft":
          e.preventDefault();
          handleRewind();
          break;
        case "arrowright":
          e.preventDefault();
          handleFastForward();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "arrowup":
          e.preventDefault();
          handleVolumeChange([Math.min(1, volume + 0.1)]);
          break;
        case "arrowdown":
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume - 0.1)]);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [videoLoaded, volume]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
                disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load"}
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

      <Card ref={playerRef}>
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
              controls
              crossOrigin="anonymous"
              onLoadedMetadata={handleMetadataLoaded}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
            />
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Loading video..." : "No video loaded"}
                </p>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRewind}
                  disabled={!videoLoaded || isLoading}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <Rewind className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlayPause}
                  disabled={!videoLoaded || isLoading}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFastForward}
                  disabled={!videoLoaded || isLoading}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <FastForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 w-24">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMute}
                    disabled={!videoLoaded || isLoading}
                    className="h-8 w-8 sm:h-9 sm:w-9"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                    disabled={!videoLoaded || isLoading}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!videoLoaded || isLoading}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                      <DropdownMenuItem
                        key={rate}
                        onClick={() => handlePlaybackRateChange(rate)}
                        className={playbackRate === rate ? "bg-accent" : ""}
                      >
                        {rate}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFullscreen}
                  disabled={!videoLoaded || isLoading}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
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
                  disabled={!videoLoaded || isLoading}
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




