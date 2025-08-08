import ThumbnailPreviewCard from "@/features/thumbnail/common/ThumbnailPreviewCard";

const FinalPreviewSection = ({
  finalThumbnail,
  videoInfo,
  handleSaveFinalThumbnail,
  processedImageSrc,
}: any) => {
  return (
    <ThumbnailPreviewCard
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