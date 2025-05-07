"use client";

import { useState, useRef, useEffect } from "react";
import { VideoPlayer } from "@/app/ui/video-player";
import { SnapshotControls } from "@/app/ui/snapshot-controls";
import DropZone from "@/app/ui/drop-zone";
import { toast } from "sonner";

export default function VideoThumbnailGenerator() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoInfo, setVideoInfo] = useState<{
    width: number;
    height: number;
    duration: number;
    currentTime: number;
  } | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setVideoInfo((prev) => ({
        ...prev!,
        currentTime: video.currentTime,
      }));
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const handleMetadataLoaded = (info: {
    width: number;
    height: number;
    duration: number;
    currentTime: number;
  }) => {
    setVideoInfo(info);
    setVideoLoaded(true);
    toast.success("Video loaded", {
      description: `${info.width}x${info.height}, ${formatDuration(
        info.duration
      )}`,
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = (currentTime: number) => {
    setVideoInfo((prev) => ({
      ...prev!,
      currentTime,
    }));
  };

  const goToTime = (time: number) => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    video.currentTime = Math.min(videoInfo.duration, Math.max(0, time));
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VideoPlayer
          videoRef={videoRef}
          videoLoaded={videoLoaded}
          videoInfo={videoInfo}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onMetadataLoaded={handleMetadataLoaded}
          onTimeUpdate={handleTimeUpdate}
        />

        <div className="space-y-6">
          <SnapshotControls
            videoRef={videoRef}
            videoLoaded={videoLoaded}
            videoInfo={videoInfo}
            goToTime={goToTime}
          />
          <DropZone />
        </div>
      </div>
    </div>
  );
}
