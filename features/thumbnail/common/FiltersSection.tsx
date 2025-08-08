"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageFiltersPanel from "@/features/thumbnail/common/ImageFiltersPanel";

interface SharedFiltersSectionProps {
  title?: string;
  ready?: boolean; // when false, show blocked message
  blockedMessage?: string;
  filters: any;
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  applyPresetFilter: (preset: string) => void;
  onApply: () => void;
  applyDisabled?: boolean;
  applyLabel?: string;
  compactButtons?: boolean;
}

export default function FiltersSection({
  title = "Image Filters",
  ready = true,
  blockedMessage = "Please complete the previous step before applying filters.",
  filters,
  setFilters,
  resetFilters,
  applyPresetFilter,
  onApply,
  applyDisabled,
  applyLabel = "Apply Filters",
  compactButtons,
}: SharedFiltersSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 md:p-6">
        {!ready ? (
          <div className="text-center text-muted-foreground">{blockedMessage}</div>
        ) : (
          <ImageFiltersPanel
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            applyPresetFilter={applyPresetFilter}
            onApply={onApply}
            applyDisabled={applyDisabled}
            applyLabel={applyLabel}
            compactButtons={compactButtons}
          />
        )}
      </CardContent>
    </Card>
  );
}
