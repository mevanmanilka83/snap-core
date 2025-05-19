import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RotateCw } from "lucide-react"
import { ImageFilter } from "../types"

interface ImageFiltersProps {
  imageFilters: ImageFilter
  setImageFilters: (filters: ImageFilter) => void
  resetFilters: () => void
  applyPresetFilter: (preset: string) => void
  onApply: () => void
  isCreatingThumbnail: boolean
  processedImageSrc: string | null
}

export const ImageFilters: React.FC<ImageFiltersProps> = ({
  imageFilters,
  setImageFilters,
  resetFilters,
  applyPresetFilter,
  onApply,
  isCreatingThumbnail,
  processedImageSrc,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle>Image Filters</CardTitle>
        <CardDescription>Adjust image appearance with filters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightness">Brightness ({imageFilters.brightness}%)</Label>
              <Button 
                variant="ghost"
                size="sm" 
                onClick={() => setImageFilters({ ...imageFilters, brightness: 100 })}
                disabled={imageFilters.brightness === 100}
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
              <Label htmlFor="contrast">Contrast ({imageFilters.contrast}%)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, contrast: 100 })}
                disabled={imageFilters.contrast === 100}
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
              <Label htmlFor="saturation">Saturation ({imageFilters.saturation}%)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, saturation: 100 })}
                disabled={imageFilters.saturation === 100}
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
              <Label htmlFor="blur">Blur ({imageFilters.blur}px)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, blur: 0 })}
                disabled={imageFilters.blur === 0}
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
              <Label htmlFor="hueRotate">Hue Rotate ({imageFilters.hueRotate}°)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, hueRotate: 0 })}
                disabled={imageFilters.hueRotate === 0}
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
              <Label htmlFor="grayscale">Grayscale ({imageFilters.grayscale}%)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, grayscale: 0 })}
                disabled={imageFilters.grayscale === 0}
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
              <Label htmlFor="sepia">Sepia ({imageFilters.sepia}%)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageFilters({ ...imageFilters, sepia: 0 })}
                disabled={imageFilters.sepia === 0}
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
          <Label>Filter Presets</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("grayscale")}
              className="flex-1 text-sm md:text-base"
            >
              Grayscale
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("sepia")}
              className="flex-1 text-sm md:text-base"
            >
              Sepia
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("vivid")}
              className="flex-1 text-sm md:text-base"
            >
              Vivid
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("cool")}
              className="flex-1 text-sm md:text-base"
            >
              Cool
            </Button>
            <Button
              variant="outline"
              onClick={() => applyPresetFilter("warm")}
              className="flex-1 text-sm md:text-base"
            >
              Warm
            </Button>
            <Button variant="outline" onClick={resetFilters} className="flex-1 text-sm md:text-base">
              <RotateCw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={onApply}
          disabled={!processedImageSrc || isCreatingThumbnail}
          className="flex-1 text-sm md:text-base"
        >
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  )
} 