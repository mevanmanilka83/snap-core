import SharedFiltersSection from "@/features/thumbnail/common/FiltersSection";
const FiltersSection = (props: any) => {
  const { imageFilters, setImageFilters, resetFilters, applyPresetFilter, handleCreateThumbnail, imageSrc, isCreatingThumbnail } = props;
  return (
    <SharedFiltersSection
      title="Image Filters"
      ready={true}
      filters={imageFilters}
      setFilters={setImageFilters}
      resetFilters={resetFilters}
      applyPresetFilter={applyPresetFilter}
      onApply={handleCreateThumbnail}
      applyDisabled={!imageSrc || isCreatingThumbnail}
      applyLabel="Apply Filters"
      compactButtons
    />
  );
};
export default FiltersSection; 