"use client";

import { useState, useRef, useEffect } from "react";
import { VideoPlayer } from "@/app/ui/video-player";
import { BackgroundRemovalProcessor } from "@/app/ui/snapshot-controls";
import DropZone from "@/app/ui/drop-zone";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<string[]>([]);

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

    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCurrentFrame(canvas.toDataURL('image/png'));
      }
    }
  };

  const goToTime = (time: number) => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;

    video.currentTime = Math.min(videoInfo.duration, Math.max(0, time));
  };

  const handleProcessedImage = (imageSrc: string) => {
    setCurrentFrame(imageSrc);
  };

  const handleSnapshot = (imageData: string) => {
    setSnapshots(prev => [...prev, imageData]);
    toast.success("Snapshot taken");
  };

  const handleSaveSnapshot = (index: number) => {
    const snapshot = snapshots[index];
    if (!snapshot) return;

    const link = document.createElement('a');
    link.href = snapshot;
    link.download = `snapshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Snapshot saved");
  };

  const handleSaveAllSnapshots = () => {
    snapshots.forEach((snapshot, index) => {
      const link = document.createElement('a');
      link.href = snapshot;
      link.download = `snapshot-${index + 1}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    
    toast.success("All snapshots saved");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <VideoPlayer
            videoRef={videoRef}
            videoLoaded={videoLoaded}
            videoInfo={videoInfo}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onMetadataLoaded={handleMetadataLoaded}
            onTimeUpdate={handleTimeUpdate}
            onSnapshot={handleSnapshot}
          />
          {snapshots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Snapshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {snapshots.map((snapshot, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-video cursor-move"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', snapshot);
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                    >
                      <Image
                        src={snapshot}
                        alt={`Snapshot ${index + 1}`}
                        fill
                        className="object-contain rounded-md"
                        unoptimized={true}
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-2 right-2"
                        onClick={() => handleSaveSnapshot(index)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  {snapshots.length > 1 && (
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={handleSaveAllSnapshots}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Save All Snapshots
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setSnapshots([]);
                      toast.success("All snapshots cleared");
                    }}
                  >
                    Cancel All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="space-y-6">
          <DropZone />
        </div>
      </div>
    </div>
  );
}
