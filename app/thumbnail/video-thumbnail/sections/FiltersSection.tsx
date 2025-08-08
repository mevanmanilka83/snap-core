import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageFiltersPanel from "@/features/thumbnail/common/ImageFiltersPanel";

const FiltersSection = (props: any) => {
  const { imageFilters, setImageFilters, resetFilters, applyPresetFilter, handleCreateThumbnail, processedFrame, isCreatingThumbnail } = props;

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">Image Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 md:p-6">
        <ImageFiltersPanel
          filters={imageFilters}
          setFilters={setImageFilters}
          resetFilters={resetFilters}
          applyPresetFilter={applyPresetFilter}
          onApply={handleCreateThumbnail}
          applyDisabled={!processedFrame || isCreatingThumbnail}
          applyLabel="Apply Filters"
          compactButtons
        />
      </CardContent>
    </Card>
  );
};

export default FiltersSection; 