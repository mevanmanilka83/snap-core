"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RotateCw } from "lucide-react"

export interface ImageFilters {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  hueRotate: number
  grayscale: number
  sepia: number
}

interface FiltersPanelProps {
  filters: ImageFilters
  setFilters: (filters: ImageFilters) => void
  resetFilters: () => void
  applyPresetFilter: (preset: string) => void
  onApply?: () => void
  applyDisabled?: boolean
  applyLabel?: string
  compactButtons?: boolean
}

export default function FiltersPanel({
  filters,
  setFilters,
  resetFilters,
  applyPresetFilter,
  onApply,
  applyDisabled,
  applyLabel = "Apply Filters",
  compactButtons = false,
}: FiltersPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="brightness" className="text-xs md:text-sm">Brightness ({filters.brightness}%)</Label>
            <Button 
              variant="ghost"
              size={compactButtons ? "sm" : "default"}
              onClick={() => setFilters({ ...filters, brightness: 100 })}
              disabled={filters.brightness === 100}
              className={compactButtons ? "h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm" : undefined}
            >
              Reset
            </Button>
          </div>
          <Slider
            id="brightness"
            min={0}
            max={200}
            step={1}
            value={[filters.brightness]}
            onValueChange={(value) => setFilters({ ...filters, brightness: value[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="contrast" className="text-xs md:text-sm">Contrast ({filters.contrast}%)</Label>
            <Button
              variant="ghost"
              size={compactButtons ? "sm" : "default"}
              onClick={() => setFilters({ ...filters, contrast: 100 })}
              disabled={filters.contrast === 100}
              className={compactButtons ? "h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm" : undefined}
            >
              Reset
            </Button>
          </div>
          <Slider
            id="contrast"
            min={0}
            max={200}
            step={1}
            value={[filters.contrast]}
            onValueChange={(value) => setFilters({ ...filters, contrast: value[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="saturation" className="text-xs md:text-sm">Saturation ({filters.saturation}%)</Label>
            <Button
              variant="ghost"
              size={compactButtons ? "sm" : "default"}
              onClick={() => setFilters({ ...filters, saturation: 100 })}
              disabled={filters.saturation === 100}
              className={compactButtons ? "h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm" : undefined}
            >
              Reset
            </Button>
          </div>
          <Slider
            id="saturation"
            min={0}
            max={200}
            step={1}
            value={[filters.saturation]}
            onValueChange={(value) => setFilters({ ...filters, saturation: value[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="blur" className="text-xs md:text-sm">Blur ({filters.blur}px)</Label>
            <Button
              variant="ghost"
              size={compactButtons ? "sm" : "default"}
              onClick={() => setFilters({ ...filters, blur: 0 })}
              disabled={filters.blur === 0}
              className={compactButtons ? "h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm" : undefined}
            >
              Reset
            </Button>
          </div>
          <Slider
            id="blur"
            min={0}
            max={10}
            step={0.1}
            value={[filters.blur]}
            onValueChange={(value) => setFilters({ ...filters, blur: value[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="hueRotate" className="text-xs md:text-sm">Hue Rotate ({filters.hueRotate}°)</Label>
            <Button
              variant="ghost"
              size={compactButtons ? "sm" : "default"}
              onClick={() => setFilters({ ...filters, hueRotate: 0 })}
              disabled={filters.hueRotate === 0}
              className={compactButtons ? "h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm" : undefined}
            >
              Reset
            </Button>
          </div>
          <Slider
            id="hueRotate"
            min={0}
            max={360}
            step={1}
            value={[filters.hueRotate]}
            onValueChange={(value) => setFilters({ ...filters, hueRotate: value[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="grayscale" className="text-xs md:text-sm">Grayscale ({filters.grayscale}%)</Label>
            <Button
              variant="ghost"
              size={compactButtons ? "sm" : "default"}
              onClick={() => setFilters({ ...filters, grayscale: 0 })}
              disabled={filters.grayscale === 0}
              className={compactButtons ? "h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm" : undefined}
            >
              Reset
            </Button>
          </div>
          <Slider
            id="grayscale"
            min={0}
            max={100}
            step={1}
            value={[filters.grayscale]}
            onValueChange={(value) => setFilters({ ...filters, grayscale: value[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sepia" className="text-xs md:text-sm">Sepia ({filters.sepia}%)</Label>
            <Button
              variant="ghost"
              size={compactButtons ? "sm" : "default"}
              onClick={() => setFilters({ ...filters, sepia: 0 })}
              disabled={filters.sepia === 0}
              className={compactButtons ? "h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm" : undefined}
            >
              Reset
            </Button>
          </div>
          <Slider
            id="sepia"
            min={0}
            max={100}
            step={1}
            value={[filters.sepia]}
            onValueChange={(value) => setFilters({ ...filters, sepia: value[0] })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs md:text-sm">Filter Presets</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => applyPresetFilter("grayscale")} className={compactButtons ? "flex-1 text-xs md:text-sm h-8 md:h-9" : "flex-1"}>
            Grayscale
          </Button>
          <Button variant="outline" onClick={() => applyPresetFilter("sepia")} className={compactButtons ? "flex-1 text-xs md:text-sm h-8 md:h-9" : "flex-1"}>
            Sepia
          </Button>
          <Button variant="outline" onClick={() => applyPresetFilter("vivid")} className={compactButtons ? "flex-1 text-xs md:text-sm h-8 md:h-9" : "flex-1"}>
            Vivid
          </Button>
          <Button variant="outline" onClick={() => applyPresetFilter("cool")} className={compactButtons ? "flex-1 text-xs md:text-sm h-8 md:h-9" : "flex-1"}>
            Cool
          </Button>
          <Button variant="outline" onClick={() => applyPresetFilter("warm")} className={compactButtons ? "flex-1 text-xs md:text-sm h-8 md:h-9" : "flex-1"}>
            Warm
          </Button>
          <Button variant="outline" onClick={resetFilters} className={compactButtons ? "flex-1 text-xs md:text-sm h-8 md:h-9" : "flex-1"}>
            <RotateCw className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {onApply && (
        <div className="flex justify-end">
          <Button onClick={onApply} disabled={applyDisabled} className={compactButtons ? "flex-1 text-xs md:text-sm h-8 md:h-9" : undefined}>
            {applyLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
