import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RotateCw } from "lucide-react";

const FiltersSection = (props: any) => {
  const { imageFilters, setImageFilters, resetFilters, applyPresetFilter, handleCreateThumbnail, processedImageSrc, isCreatingThumbnail } = props;

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">Image Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 md:p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightness" className="text-xs md:text-sm">Brightness ({imageFilters.brightness}%)</Label>
              <Button 
                variant="ghost"
                size="sm" 
                onClick={() => setImageFilters({ ...imageFilters, brightness: 100 })}
                disabled={imageFilters.brightness === 100}
                className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
              >
                Reset
              </Button>
            </div>
            <Slider
              id="brightness"
              min={0}
              max={200}
              step={1}
              value={[imageFilters.brightness]}
              onValueChange={(value) => setImageFilters({ ...imageFilters, brightness: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast" className="text-xs md:text-sm">Contrast ({imageFilters.contrast}%)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, contrast: 100 })}
                disabled={imageFilters.contrast === 100}
                className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
              >
                Reset
              </Button>
            </div>
            <Slider
              id="contrast"
              min={0}
              max={200}
              step={1}
              value={[imageFilters.contrast]}
              onValueChange={(value) => setImageFilters({ ...imageFilters, contrast: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="saturation" className="text-xs md:text-sm">Saturation ({imageFilters.saturation}%)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, saturation: 100 })}
                disabled={imageFilters.saturation === 100}
                className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
              >
                Reset
              </Button>
            </div>
            <Slider
              id="saturation"
              min={0}
              max={200}
              step={1}
              value={[imageFilters.saturation]}
              onValueChange={(value) => setImageFilters({ ...imageFilters, saturation: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="blur" className="text-xs md:text-sm">Blur ({imageFilters.blur}px)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, blur: 0 })}
                disabled={imageFilters.blur === 0}
                className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
              >
                Reset
              </Button>
            </div>
            <Slider
              id="blur"
              min={0}
              max={10}
              step={0.1}
              value={[imageFilters.blur]}
              onValueChange={(value) => setImageFilters({ ...imageFilters, blur: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="hueRotate" className="text-xs md:text-sm">Hue Rotate ({imageFilters.hueRotate}°)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, hueRotate: 0 })}
                disabled={imageFilters.hueRotate === 0}
                className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
              >
                Reset
              </Button>
            </div>
            <Slider
              id="hueRotate"
              min={0}
              max={360}
              step={1}
              value={[imageFilters.hueRotate]}
              onValueChange={(value) => setImageFilters({ ...imageFilters, hueRotate: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="grayscale" className="text-xs md:text-sm">Grayscale ({imageFilters.grayscale}%)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, grayscale: 0 })}
                disabled={imageFilters.grayscale === 0}
                className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
              >
                Reset
              </Button>
            </div>
            <Slider
              id="grayscale"
              min={0}
              max={100}
              step={1}
              value={[imageFilters.grayscale]}
              onValueChange={(value) => setImageFilters({ ...imageFilters, grayscale: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sepia" className="text-xs md:text-sm">Sepia ({imageFilters.sepia}%)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, sepia: 0 })}
                disabled={imageFilters.sepia === 0}
                className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
              >
                Reset
              </Button>
            </div>
            <Slider
              id="sepia"
              min={0}
              max={100}
              step={1}
              value={[imageFilters.sepia]}
              onValueChange={(value) => setImageFilters({ ...imageFilters, sepia: value[0] })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs md:text-sm">Filter Presets</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("grayscale")}
              className="flex-1 text-xs md:text-sm h-8 md:h-9"
            >
              Grayscale
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("sepia")}
              className="flex-1 text-xs md:text-sm h-8 md:h-9"
            >
              Sepia
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("vivid")}
              className="flex-1 text-xs md:text-sm h-8 md:h-9"
            >
              Vivid
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("cool")}
              className="flex-1 text-xs md:text-sm h-8 md:h-9"
            >
              Cool
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("warm")}
              className="flex-1 text-xs md:text-sm h-8 md:h-9"
            >
              Warm
            </Button>
            <Button 
              variant="outline" 
              onClick={resetFilters} 
              className="flex-1 text-xs md:text-sm h-8 md:h-9"
            >
              <RotateCw className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4 md:p-6">
        <Button
          onClick={handleCreateThumbnail}
          disabled={!processedImageSrc || isCreatingThumbnail}
          className="flex-1 text-xs md:text-sm h-8 md:h-9"
        >
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FiltersSection; 