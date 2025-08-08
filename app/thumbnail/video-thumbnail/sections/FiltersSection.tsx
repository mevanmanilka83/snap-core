import SharedFiltersSection from "@/features/thumbnail/common/FiltersSection";

const FiltersSection = (props: any) => {
  const { imageFilters, setImageFilters, resetFilters, applyPresetFilter, handleCreateThumbnail, processedFrame, isCreatingThumbnail } = props;

  return (
    <SharedFiltersSection
      title="Image Filters"
      ready={true}
      filters={imageFilters}
      setFilters={setImageFilters}
      resetFilters={resetFilters}
      applyPresetFilter={applyPresetFilter}
      onApply={handleCreateThumbnail}
      applyDisabled={!processedFrame || isCreatingThumbnail}
      applyLabel="Apply Filters"
      compactButtons
    />
  );
};

export default FiltersSection; 