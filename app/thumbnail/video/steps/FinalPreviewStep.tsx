import SharedFinalPreviewSection from "@/features/thumbnail/common/FinalPreviewSection";

const FinalPreviewStep = ({
  finalThumbnail,
  videoInfo,
  handleSaveFinalThumbnail,
  processedImageSrc,
}: any) => {
  return (
    <SharedFinalPreviewSection
      title="Final Preview"
      descriptionWhenReady="Preview your thumbnail with all effects applied"
      descriptionWhenBlocked="Background removal required"
      ready={!!processedImageSrc}
      imageSrc={finalThumbnail}
      resolutionLabel={videoInfo ? `${videoInfo.width}x${videoInfo.height}` : undefined}
      onDownload={handleSaveFinalThumbnail}
      downloadDisabled={!finalThumbnail}
    />
  );
};

export default FinalPreviewStep; 