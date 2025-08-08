import FinalPreviewCard from "@/features/thumbnail/common/FinalPreviewCard";

const FinalPreviewSection = ({
  finalThumbnail,
  imageInfo,
  handleSaveFinalThumbnail,
  backgroundRemoved
}: any) => {
  return (
    <FinalPreviewCard
      title="Final Preview"
      descriptionWhenReady="Preview your thumbnail with all effects applied"
      descriptionWhenBlocked="Background removal required"
      ready={!!backgroundRemoved}
      imageSrc={finalThumbnail}
      resolutionLabel={imageInfo ? `${imageInfo.width}x${imageInfo.height}` : undefined}
      onDownload={handleSaveFinalThumbnail}
      downloadDisabled={!backgroundRemoved || !finalThumbnail}
    />
  );
};

export default FinalPreviewSection; 