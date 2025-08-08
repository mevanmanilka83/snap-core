import SharedFiltersSection from "@/features/thumbnail/common/FiltersSection";

const FiltersSection = (props: any) => {
  const { imageFilters, setImageFilters, resetFilters, applyPresetFilter, handleCreateThumbnail, processedImageSrc, isCreatingThumbnail, backgroundRemoved } = props;

  return (
    <SharedFiltersSection
      title="Image Filters"
      ready={!!backgroundRemoved}
      blockedMessage="Please remove the background before applying filters."
      filters={imageFilters}
      setFilters={setImageFilters}
      resetFilters={resetFilters}
      applyPresetFilter={applyPresetFilter}
      onApply={handleCreateThumbnail}
      applyDisabled={!processedImageSrc || isCreatingThumbnail}
      applyLabel="Apply Filters"
      compactButtons
    />
  );
};

export default FiltersSection; 