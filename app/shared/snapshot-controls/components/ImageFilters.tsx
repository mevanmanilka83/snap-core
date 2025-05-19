import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"
import { ImageFilters as ImageFiltersType } from "../types"

interface ImageFiltersProps {
  filters: ImageFiltersType
  onFilterChange: (filters: ImageFiltersType) => void
  onReset: () => void
}

export const ImageFilters: React.FC<ImageFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleBrightnessChange = (value: number[]) => {
    onFilterChange({ ...filters, brightness: value[0] })
  }

  const handleContrastChange = (value: number[]) => {
    onFilterChange({ ...filters, contrast: value[0] })
  }

  const handleSaturationChange = (value: number[]) => {
    onFilterChange({ ...filters, saturation: value[0] })
  }

  const handleBlurChange = (value: number[]) => {
    onFilterChange({ ...filters, blur: value[0] })
  }

  const handleGrayscaleChange = (value: number[]) => {
    onFilterChange({ ...filters, grayscale: value[0] })
  }

  const handleSepiaChange = (value: number[]) => {
    onFilterChange({ ...filters, sepia: value[0] })
  }

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base md:text-lg lg:text-xl">Snapshot Controls</CardTitle>
            <CardDescription className="text-xs md:text-sm">Adjust snapshot settings and filters</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-xs md:text-sm h-8 md:h-9"
            >
              <RotateCw className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Reset Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs md:text-sm">Brightness</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[filters.brightness]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={handleBrightnessChange}
                  className="flex-1"
                />
                <span className="text-xs md:text-sm w-12 text-right">{filters.brightness}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs md:text-sm">Contrast</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[filters.contrast]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={handleContrastChange}
                  className="flex-1"
                />
                <span className="text-xs md:text-sm w-12 text-right">{filters.contrast}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs md:text-sm">Saturation</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[filters.saturation]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={handleSaturationChange}
                  className="flex-1"
                />
                <span className="text-xs md:text-sm w-12 text-right">{filters.saturation}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs md:text-sm">Blur</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[filters.blur]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={handleBlurChange}
                  className="flex-1"
                />
                <span className="text-xs md:text-sm w-12 text-right">{filters.blur}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs md:text-sm">Grayscale</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[filters.grayscale]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleGrayscaleChange}
                  className="flex-1"
                />
                <span className="text-xs md:text-sm w-12 text-right">{filters.grayscale}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs md:text-sm">Sepia</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[filters.sepia]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleSepiaChange}
                  className="flex-1"
                />
                <span className="text-xs md:text-sm w-12 text-right">{filters.sepia}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 