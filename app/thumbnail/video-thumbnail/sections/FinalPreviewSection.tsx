import FinalPreviewCard from "@/app/shared/final-preview-card";

const FinalPreviewSection = ({
  finalThumbnail,
  videoInfo,
  handleSaveFinalThumbnail,
  processedImageSrc,
}: any) => {
  return (
    <FinalPreviewCard
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

export default FinalPreviewSection; 