"use client";

import { Clock, Layers, Palette, Type, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import VideoMainSection from "./video/steps/VideoMainSection";
import SnapshotsStep from "./video/steps/SnapshotsStep";
import EditStep from "./video/steps/EditStep";
import TextEditorStep from "./video/steps/TextEditorStep";
import FinalPreviewStep from "./video/steps/FinalPreviewStep";
import { TabsProvider, TabsBtn, TabsContent } from "@/components/tab";
import SmoothScroll from "@/components/smooth-scroll";
import { useMediaQuery } from "@/components/useMediaQuery";
import { Badge } from "@/components/ui/badge";

import ImageUploadStep from "./image/steps/ImageUploadStep";

interface VideoTabSelectionProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  snapshots: string[];
  selectedSnapshotIndex: number;
  canGoToTextAndPreview: boolean;
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
  handleSelectSnapshot: (index: number) => void;
  handleSaveSnapshot: (index: number) => void;
  handleDeleteSnapshot: (index: number) => void;
  handleSaveAllSnapshots: () => void;
  setSnapshots: (snapshots: string[]) => void;
  setSelectedSnapshotIndex: (index: number) => void;
  setProcessedFrame: (frame: string | null) => void;
  setProcessedImageSrc: (src: string | null) => void;
  processedFrame: string | null;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  imageFilters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    hueRotate: number;
    grayscale: number;
    sepia: number;
  };
  setImageFilters: (filters: any) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  undoStack: string[];
  redoStack: string[];
  handleCreateThumbnail: () => void;
  handleApplyFilters: () => void;
  resetFilters: () => void;
  applyPresetFilter: (preset: string) => void;
  isProcessing: boolean;
  isCreatingThumbnail: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  setUndoStack: (stack: string[]) => void;
  setRedoStack: (stack: string[]) => void;
  handleRemoveBackground: () => void;
  backgroundRemoved: boolean;
  setCanGoToTextAndPreview: (canGo: boolean) => void;
  textElements: any[];
  setTextElements: (elements: any[]) => void;
  finalThumbnail: string | null;
  handleSaveFinalThumbnail: () => void;
  processedImageSrc: string | null;
}

export default function VideoTabSelection({
  activeTab,
  handleTabChange,
  snapshots,
  selectedSnapshotIndex,
  canGoToTextAndPreview,
  videoInfo,
  // Unused props omitted in tabs container
  videoRef: _videoRef,
  videoLoaded,
  isPlaying: _isPlaying,
  setIsPlaying: _setIsPlaying,
  handleMetadataLoaded: _handleMetadataLoaded,
  handleTimeUpdate: _handleTimeUpdate,
  handleSnapshot: _handleSnapshot,
  captureSnapshot: _captureSnapshot,
  handleAutoCaptureKeyFrames: _handleAutoCaptureKeyFrames,
  autoSnapInterval: _autoSnapInterval,
  setAutoSnapInterval: _setAutoSnapInterval,
  toggleAutoSnap: _toggleAutoSnap,
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
}: VideoTabSelectionProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <TabsProvider defaultValue={activeTab} wobbly={!isMobile}>
      <div className="flex flex-col gap-4">
        <div id="transform-content" className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
            Create Thumbnails
          </Badge>
          <div className="min-h-[120px] flex items-center justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4">
              Transform Your Content to Eye Catching Thumbnails
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Choose between video frame capture or direct image upload. Our
            powerful tools help you create professional thumbnails with ease.
          </p>
        </div>

        <div className="relative mb-4">
        </div>

        <SmoothScroll className="w-full">
          <div className="flex items-center justify-center gap-1 sm:gap-2 p-[3px] min-w-fit">
            <TabsBtn
              value="create-image-thumbnail"
              className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap data-[state=active]:bg-background"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
              <span className="truncate">Create Image Thumbnail</span>
            </TabsBtn>
            <TabsBtn
              value="video"
              className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
            >
              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Create Video Thumbnail</span>
            </TabsBtn>
          </div>
        </SmoothScroll>

        <TabsContent value="video" className="space-y-4 sm:space-y-6 mt-4">
          <div className="space-y-6">
            <VideoMainSection
              videoRef={_videoRef}
              videoLoaded={videoLoaded}
              videoInfo={videoInfo}
              isPlaying={_isPlaying}
              setIsPlaying={_setIsPlaying}
              handleMetadataLoaded={_handleMetadataLoaded}
              handleTimeUpdate={_handleTimeUpdate}
              handleSnapshot={_handleSnapshot}
              captureSnapshot={_captureSnapshot}
              handleAutoCaptureKeyFrames={_handleAutoCaptureKeyFrames}
              autoSnapInterval={_autoSnapInterval}
              setAutoSnapInterval={_setAutoSnapInterval}
              toggleAutoSnap={_toggleAutoSnap}
            />
            
            <div className="border-t pt-6">
              <TabsProvider defaultValue="snapshots" wobbly={!isMobile}>
                <div className="flex items-center justify-center gap-1 sm:gap-2 p-[3px] min-w-fit mb-4">
                  <TabsBtn
                    value="snapshots"
                    className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
                  >
                    <Layers className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">Video Frames ({snapshots?.length || 0})</span>
                  </TabsBtn>
                  <TabsBtn
                    value="edit"
                    className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
                    disabled={selectedSnapshotIndex === -1 || selectedSnapshotIndex === undefined}
                  >
                    <Palette className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">Remove Background</span>
                  </TabsBtn>
                  <TabsBtn
                    value="text"
                    className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
                    disabled={!canGoToTextAndPreview || canGoToTextAndPreview === undefined}
                  >
                    <Type className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">Add Text & Style</span>
                  </TabsBtn>
                  <TabsBtn
                    value="preview"
                    className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
                    disabled={!canGoToTextAndPreview || canGoToTextAndPreview === undefined}
                  >
                    <ImageIcon className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">Final Thumbnail</span>
                  </TabsBtn>
                </div>

                <TabsContent value="snapshots" className="space-y-4 sm:space-y-6 mt-4">
                  <SnapshotsStep
                    snapshots={snapshots}
                    selectedSnapshotIndex={selectedSnapshotIndex}
                    handleSelectSnapshot={handleSelectSnapshot}
                    handleSaveSnapshot={handleSaveSnapshot}
                    handleDeleteSnapshot={handleDeleteSnapshot}
                    handleSaveAllSnapshots={handleSaveAllSnapshots}
                    setSnapshots={setSnapshots}
                    setSelectedSnapshotIndex={setSelectedSnapshotIndex}
                    setProcessedFrame={setProcessedFrame}
                    setProcessedImageSrc={setProcessedImageSrc}
                    toast={toast}
                  />
                </TabsContent>

                <TabsContent value="edit" className="space-y-4 sm:space-y-6 mt-4">
                  <EditStep
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
                    imageInfo={videoInfo}
                    imageLoaded={videoLoaded}
                    processedImageSrc={processedImageSrc}
                    isProcessing={isProcessing}
                    isCreatingThumbnail={isCreatingThumbnail}
                    setProcessedImageSrc={setProcessedImageSrc}
                    setIsProcessing={setIsProcessing}
                    setUndoStack={setUndoStack}
                    setRedoStack={setRedoStack}
                    handleRemoveBackground={handleRemoveBackground}
                    snapshots={snapshots}
                    selectedSnapshotIndex={selectedSnapshotIndex}
                    onNext={() => {
                      handleTabChange("text");
                    }}
                    backgroundRemoved={backgroundRemoved}
                    setCanGoToTextAndPreview={setCanGoToTextAndPreview}
                  />
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <TextEditorStep
                    isCreatingThumbnail={isCreatingThumbnail}
                    processedImageSrc={processedImageSrc}
                    textElements={textElements}
                    setTextElements={setTextElements}
                    handleCreateThumbnail={handleCreateThumbnail}
                  />
                </TabsContent>

                <TabsContent value="preview" className="space-y-4 sm:space-y-6 mt-4">
                  <FinalPreviewStep
                    finalThumbnail={finalThumbnail}
                    videoInfo={videoInfo}
                    handleSaveFinalThumbnail={handleSaveFinalThumbnail}
                    processedImageSrc={processedImageSrc}
                    textElements={textElements}
                  />
                </TabsContent>
              </TabsProvider>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create-image-thumbnail" className="space-y-4 sm:space-y-6 mt-4">
            <ImageUploadStep />
        </TabsContent>
      </div>
    </TabsProvider>
  );
}
