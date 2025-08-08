"use client";

import React from "react";

interface SimpleVideoTabSelectionProps {
  VideoSection: React.ComponentType<any>;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoLoaded: boolean;
  videoInfo: {
    width: number;
    height: number;
    duration: number;
    currentTime: number;
  } | null;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  handleMetadataLoaded: () => void;
  handleTimeUpdate: () => void;
  handleSnapshot: (imageData: string) => void;
  captureSnapshot: () => Promise<void>;
  handleAutoCaptureKeyFrames: () => void;
  autoSnapInterval: number | null;
  setAutoSnapInterval: (interval: number | null) => void;
  toggleAutoSnap: (enabled: boolean) => void;
}

export default function SimpleVideoTabSelection({
  VideoSection,
  videoRef,
  videoLoaded,
  videoInfo,
  isPlaying,
  setIsPlaying,
  handleMetadataLoaded,
  handleTimeUpdate,
  handleSnapshot,
  captureSnapshot,
  handleAutoCaptureKeyFrames,
  autoSnapInterval,
  setAutoSnapInterval,
  toggleAutoSnap,
}: SimpleVideoTabSelectionProps) {
  return (
    <VideoSection
      videoRef={videoRef}
      videoLoaded={videoLoaded}
      videoInfo={videoInfo}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      handleMetadataLoaded={handleMetadataLoaded}
      handleTimeUpdate={handleTimeUpdate}
      handleSnapshot={handleSnapshot}
      captureSnapshot={captureSnapshot}
      handleAutoCaptureKeyFrames={handleAutoCaptureKeyFrames}
      autoSnapInterval={autoSnapInterval}
      setAutoSnapInterval={setAutoSnapInterval}
      toggleAutoSnap={toggleAutoSnap}
    />
  );
}
