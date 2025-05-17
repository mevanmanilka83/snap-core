"use client";

import { Clock, Layers, Palette, Type, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import MainSection from "../../main-section";
import SnapshotsSection from "./SnapshotsSection";
import EditSection from "./EditSection";
import TextSection from "./TextSection";
import FinalPreviewSection from "./FinalPreviewSection";
import { AnimatedCursor } from "@/components/figma-cursor";
import { TabsProvider, TabsBtn, TabsContent } from "@/components/tab";
import SmoothScroll from "@/components/smooth-scroll";
import { useMediaQuery } from "@/components/useMediaQuery";
import { Badge } from "@/components/ui/badge";
import { WordPullUp } from "@/components/eldoraui/wordpullup";

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
  setProcessingProgress: (progress: number) => void;
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
  setProcessingProgress,
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

  // Use activeTab if provided, otherwise default to 'video'
  const defaultTab = activeTab || "video";

  return (
    <TabsProvider defaultValue={defaultTab} wobbly={!isMobile}>
      <div className="flex flex-col gap-4">
        <div id="transform-content" className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
            Create Thumbnails
          </Badge>
          <div className="min-h-[80px] flex items-center justify-center">
            <WordPullUp
              text="Transform Your Content into Eye-Catching Thumbnails"
              className="text-2xl sm:text-3xl md:text-4xl mb-4"
            />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Choose between video frame capture or direct image upload. Our
            powerful tools help you create professional thumbnails with ease.
          </p>
        </div>

        <div className="relative mb-4">
          <AnimatedCursor
            text="Create Video Thumbnail Here"
            className="absolute top-0 left-4 z-10"
            type="video"
          />
        </div>

        <SmoothScroll className="w-full">
          <div className="flex items-center justify-center gap-1 sm:gap-2 p-[3px] min-w-fit">
            <TabsBtn
              value="video"
              className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
            >
              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Video</span>
            </TabsBtn>
            <TabsBtn
              value="snapshots"
              className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
            >
              <Layers className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Snapshots ({snapshots.length})</span>
            </TabsBtn>
            <TabsBtn
              value="edit"
              className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
              disabled={selectedSnapshotIndex === -1}
            >
              <Palette className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Edit</span>
            </TabsBtn>
            <TabsBtn
              value="text"
              className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
              disabled={!canGoToTextAndPreview}
            >
              <Type className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Text</span>
            </TabsBtn>
            <TabsBtn
              value="preview"
              className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
              disabled={!canGoToTextAndPreview}
            >
              <ImageIcon className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Final Preview</span>
            </TabsBtn>
          </div>
        </SmoothScroll>

        <TabsContent value="video" className="space-y-4 sm:space-y-6 mt-4">
          <MainSection
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
        </TabsContent>

        <TabsContent value="snapshots" className="space-y-4 sm:space-y-6 mt-4">
          <SnapshotsSection
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
          <EditSection
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
            setProcessingProgress={setProcessingProgress}
            handleRemoveBackground={handleRemoveBackground}
            snapshots={snapshots}
            selectedSnapshotIndex={selectedSnapshotIndex}
            onNext={() => {
              setCanGoToTextAndPreview(true);
              handleTabChange("text");
            }}
            backgroundRemoved={backgroundRemoved}
            setCanGoToTextAndPreview={setCanGoToTextAndPreview}
          />
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <TextSection
            isCreatingThumbnail={isCreatingThumbnail}
            processedImageSrc={processedImageSrc}
            textElements={textElements}
            setTextElements={setTextElements}
            handleCreateThumbnail={handleCreateThumbnail}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4 sm:space-y-6 mt-4">
          <FinalPreviewSection
            finalThumbnail={finalThumbnail}
            videoInfo={videoInfo}
            handleSaveFinalThumbnail={handleSaveFinalThumbnail}
            processedImageSrc={processedImageSrc}
            textElements={textElements}
          />
        </TabsContent>
      </div>
    </TabsProvider>
  );
}
