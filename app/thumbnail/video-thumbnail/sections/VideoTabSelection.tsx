"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Layers, Palette, Type, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import MainSection from "../../main-section"
import SnapshotsSection from "./SnapshotsSection"
import EditSection from "./EditSection"
import TextSection from "./TextSection"
import FinalPreviewSection from "./FinalPreviewSection"

interface VideoTabSelectionProps {
  activeTab: string
  handleTabChange: (tab: string) => void
  snapshots: string[]
  selectedSnapshotIndex: number
  canGoToTextAndPreview: boolean
  videoRef: React.RefObject<HTMLVideoElement>
  videoLoaded: boolean
  videoInfo: {
    width: number
    height: number
    duration: number
    currentTime: number
  } | null
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  handleMetadataLoaded: () => void
  handleTimeUpdate: () => void
  handleSnapshot: (imageData: string) => void
  captureSnapshot: () => Promise<void>
  handleAutoCaptureKeyFrames: () => void
  autoSnapInterval: number | null
  setAutoSnapInterval: (interval: number | null) => void
  toggleAutoSnap: (enabled: boolean) => void
  handleSelectSnapshot: (index: number) => void
  handleSaveSnapshot: (index: number) => void
  handleDeleteSnapshot: (index: number) => void
  handleSaveAllSnapshots: () => void
  setSnapshots: (snapshots: string[]) => void
  setSelectedSnapshotIndex: (index: number) => void
  setProcessedFrame: (frame: string | null) => void
  setProcessedImageSrc: (src: string | null) => void
  processedFrame: string | null
  zoomLevel: number
  setZoomLevel: (level: number) => void
  imageFilters: {
    brightness: number
    contrast: number
    saturation: number
    blur: number
    hueRotate: number
    grayscale: number
    sepia: number
  }
  setImageFilters: (filters: any) => void
  handleUndo: () => void
  handleRedo: () => void
  undoStack: string[]
  redoStack: string[]
  handleCreateThumbnail: () => void
  handleApplyFilters: () => void
  resetFilters: () => void
  applyPresetFilter: (preset: string) => void
  isProcessing: boolean
  isCreatingThumbnail: boolean
  setIsProcessing: (isProcessing: boolean) => void
  setUndoStack: (stack: string[]) => void
  setRedoStack: (stack: string[]) => void
  setProcessingProgress: (progress: number) => void
  handleRemoveBackground: () => void
  backgroundRemoved: boolean
  setCanGoToTextAndPreview: (canGo: boolean) => void
  textElements: any[]
  setTextElements: (elements: any[]) => void
  finalThumbnail: string | null
  handleSaveFinalThumbnail: () => void
  processedImageSrc: string | null
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
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="bg-muted text-muted-foreground h-auto items-center justify-center rounded-lg p-[3px] grid min-w-fit w-full grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2 overflow-x-auto">
        <TabsTrigger 
          value="video" 
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
        >
          <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Video</span>
        </TabsTrigger>
        <TabsTrigger 
          value="snapshots"
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
        >
          <Layers className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Snapshots ({snapshots.length})</span>
        </TabsTrigger>
        <TabsTrigger
          value="edit"
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
          disabled={selectedSnapshotIndex === -1}
        >
          <Palette className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Edit</span>
        </TabsTrigger>
        <TabsTrigger 
          value="text" 
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
          disabled={!canGoToTextAndPreview}
        >
          <Type className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Text</span>
        </TabsTrigger>
        <TabsTrigger 
          value="preview" 
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
          disabled={!canGoToTextAndPreview}
        >
          <ImageIcon className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Final Preview</span>
        </TabsTrigger>
      </TabsList>

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
            if (!backgroundRemoved) {
              toast.error('Please remove the background before proceeding to text editing. Background removal is important for text placement.');
              return;
            }
            setCanGoToTextAndPreview(true);
            handleTabChange('text');
          }}
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
    </Tabs>
  )
} 