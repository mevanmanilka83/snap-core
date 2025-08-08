"use client";

import React from "react";

interface SimpleVideoTabsProps {
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
  snapshots?: string[];
  selectedSnapshotIndex?: number;
  canGoToTextAndPreview?: boolean;
  handleSelectSnapshot?: (index: number) => void;
  handleSaveSnapshot?: (index: number) => void;
  handleDeleteSnapshot?: (index: number) => void;
  handleSaveAllSnapshots?: () => void;
  setSnapshots?: (snapshots: string[]) => void;
  setSelectedSnapshotIndex?: (index: number) => void;
  setProcessedFrame?: (frame: string | null) => void;
  setProcessedImageSrc?: (src: string | null) => void;
  processedFrame?: string | null;
  zoomLevel?: number;
  setZoomLevel?: (level: number) => void;
  imageFilters?: any;
  setImageFilters?: (filters: any) => void;
  handleUndo?: () => void;
  handleRedo?: () => void;
  undoStack?: string[];
  redoStack?: string[];
  handleCreateThumbnail?: () => void;
  handleApplyFilters?: () => void;
  resetFilters?: () => void;
  applyPresetFilter?: (preset: string) => void;
  isProcessing?: boolean;
  isCreatingThumbnail?: boolean;
  setIsProcessing?: (isProcessing: boolean) => void;
  setUndoStack?: (stack: string[]) => void;
  setRedoStack?: (stack: string[]) => void;
  handleRemoveBackground?: () => void;
  backgroundRemoved?: boolean;
  setCanGoToTextAndPreview?: (canGo: boolean) => void;
  textElements?: any[];
  setTextElements?: (elements: any[]) => void;
  finalThumbnail?: string | null;
  handleSaveFinalThumbnail?: () => void;
  processedImageSrc?: string | null;
}

export default function SimpleVideoTabs({
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
  snapshots,
  selectedSnapshotIndex,
  canGoToTextAndPreview,
  handleSelectSnapshot,
  handleSaveSnapshot,
  handleDeleteSnapshot,
  handleSaveAllSnapshots,
  setSnapshots,
  setSelectedSnapshotIndex,
  setProcessedFrame,
  setProcessedImageSrc,
  processedFrame,
  zoomLevel,
  setZoomLevel,
  imageFilters,
  setImageFilters,
  handleUndo,
  handleRedo,
  undoStack,
  redoStack,
  handleCreateThumbnail,
  handleApplyFilters,
  resetFilters,
  applyPresetFilter,
  isProcessing,
  isCreatingThumbnail,
  setIsProcessing,
  setUndoStack,
  setRedoStack,
  handleRemoveBackground,
  backgroundRemoved,
  setCanGoToTextAndPreview,
  textElements,
  setTextElements,
  finalThumbnail,
  handleSaveFinalThumbnail,
  processedImageSrc,
}: SimpleVideoTabsProps) {
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
      snapshots={snapshots}
      selectedSnapshotIndex={selectedSnapshotIndex}
      canGoToTextAndPreview={canGoToTextAndPreview}
      handleSelectSnapshot={handleSelectSnapshot}
      handleSaveSnapshot={handleSaveSnapshot}
      handleDeleteSnapshot={handleDeleteSnapshot}
      handleSaveAllSnapshots={handleSaveAllSnapshots}
      setSnapshots={setSnapshots}
      setSelectedSnapshotIndex={setSelectedSnapshotIndex}
      setProcessedFrame={setProcessedFrame}
      setProcessedImageSrc={setProcessedImageSrc}
      processedFrame={processedFrame}
      zoomLevel={zoomLevel}
      setZoomLevel={setZoomLevel}
      imageFilters={imageFilters}
      setImageFilters={setImageFilters}
      handleUndo={handleUndo}
      handleRedo={handleRedo}
      undoStack={undoStack}
      redoStack={redoStack}
      handleCreateThumbnail={handleCreateThumbnail}
      handleApplyFilters={handleApplyFilters}
      resetFilters={resetFilters}
      applyPresetFilter={applyPresetFilter}
      isProcessing={isProcessing}
      isCreatingThumbnail={isCreatingThumbnail}
      setIsProcessing={setIsProcessing}
      setUndoStack={setUndoStack}
      setRedoStack={setRedoStack}
      handleRemoveBackground={handleRemoveBackground}
      backgroundRemoved={backgroundRemoved}
      setCanGoToTextAndPreview={setCanGoToTextAndPreview}
      textElements={textElements}
      setTextElements={setTextElements}
      finalThumbnail={finalThumbnail}
      handleSaveFinalThumbnail={handleSaveFinalThumbnail}
      processedImageSrc={processedImageSrc}
    />
  );
}
