import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FiltersPanel from "@/features/thumbnail/common/FiltersPanel";

const FiltersSection = (props: any) => {
  const { imageFilters, setImageFilters, resetFilters, applyPresetFilter, handleCreateThumbnail, processedImageSrc, isCreatingThumbnail, backgroundRemoved } = props;

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">Image Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 md:p-6">
        {!backgroundRemoved ? (
          <div className="text-center text-muted-foreground">
            Please remove the background before applying filters.
          </div>
        ) : (
          <FiltersPanel
            filters={imageFilters}
            setFilters={setImageFilters}
            resetFilters={resetFilters}
            applyPresetFilter={applyPresetFilter}
            onApply={handleCreateThumbnail}
            applyDisabled={!processedImageSrc || isCreatingThumbnail}
            applyLabel="Apply Filters"
            compactButtons
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FiltersSection; 