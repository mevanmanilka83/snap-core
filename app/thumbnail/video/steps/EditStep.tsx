// no-op import removed

import { ImageIcon } from "lucide-react";
import FiltersSection from "./FiltersStep";
import BackgroundRemovedSection from "./BackgroundRemovalStep";
import { ImagePreviewCard } from "@/features/thumbnail/common";


const EditStep = ({
  zoomLevel,
  setZoomLevel,
  imageFilters,
  setImageFilters,
  handleCreateThumbnail,
  resetFilters,
  applyPresetFilter,
  imageInfo,
  imageLoaded,
  processedImageSrc,
  isProcessing,
  isCreatingThumbnail,
  handleRemoveBackground: originalHandleRemoveBackground,
  snapshots,
  selectedSnapshotIndex,
  onNext,
  setCanGoToTextAndPreview
}: any) => {
  // Wrap the original handleRemoveBackground to add automatic tab switching
  const handleRemoveBackground = async () => {
    await originalHandleRemoveBackground();
    // After successful background removal, automatically switch to text tab
    if (processedImageSrc) {
      setCanGoToTextAndPreview(true);
      onNext();
    }
  };

  // Get the selected snapshot
  const selectedSnapshot = selectedSnapshotIndex >= 0 && snapshots[selectedSnapshotIndex] ? snapshots[selectedSnapshotIndex] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <ImagePreviewCard
        title="Image Preview"
        description="Preview and edit your selected image before removing the background"
        imageSrc={selectedSnapshot || null}
        zoom={zoomLevel}
        onZoomChange={setZoomLevel}
        filtersCss={`
          brightness(${imageFilters.brightness}%) 
          contrast(${imageFilters.contrast}%) 
          saturate(${imageFilters.saturation}%) 
          blur(${imageFilters.blur}px) 
          hue-rotate(${imageFilters.hueRotate}deg)
          grayscale(${imageFilters.grayscale}%)
          sepia(${imageFilters.sepia}%)
        `}
        emptyContent={
          <div className="flex flex-col items-center justify-center h-full">
            <ImageIcon className="h-12 w-12 sm:h-14 sm:w-14 text-gray-400 mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No snapshot selected</p>
          </div>
        }
      />
      <div className="space-y-4 sm:space-y-6 flex flex-col h-full">
        <FiltersSection
          imageFilters={imageFilters}
          setImageFilters={setImageFilters}
          resetFilters={resetFilters}
          applyPresetFilter={applyPresetFilter}
          handleCreateThumbnail={handleCreateThumbnail}
          imageSrc={selectedSnapshot}
          isCreatingThumbnail={isCreatingThumbnail}
        />
        <BackgroundRemovedSection
          imageInfo={imageInfo}
          imageLoaded={imageLoaded}
          processedImageSrc={processedImageSrc}
          zoomLevel={zoomLevel}
          isProcessing={isProcessing}
          imageSrc={selectedSnapshot}
          handleRemoveBackground={handleRemoveBackground}
        />
      </div>
    </div>
  );
};

export default EditStep; 