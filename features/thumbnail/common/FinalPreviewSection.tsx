"use client"
import ThumbnailPreviewCard from "@/features/thumbnail/common/ThumbnailPreviewCard";
interface SharedFinalPreviewSectionProps {
  title?: string;
  descriptionWhenReady?: string;
  descriptionWhenBlocked?: string;
  ready: boolean;
  imageSrc: string | null;
  resolutionLabel?: string;
  onDownload: () => void;
  downloadDisabled?: boolean;
}
export default function FinalPreviewSection({
  title = "Final Preview",
  descriptionWhenReady = "Preview your thumbnail with all effects applied",
  descriptionWhenBlocked = "Background removal required",
  ready,
  imageSrc,
  resolutionLabel,
  onDownload,
  downloadDisabled,
}: SharedFinalPreviewSectionProps) {
  return (
    <ThumbnailPreviewCard
      title={title}
      descriptionWhenReady={descriptionWhenReady}
      descriptionWhenBlocked={descriptionWhenBlocked}
      ready={ready}
      imageSrc={imageSrc}
      resolutionLabel={resolutionLabel}
      onDownload={onDownload}
      downloadDisabled={downloadDisabled}
    />
  );
}
