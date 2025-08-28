"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ThumbnailImageStage from "@/features/thumbnail/common/ThumbnailImageStage";
import { ReactNode } from "react";
interface SharedBackgroundRemovalSectionProps {
  title?: string;
  description?: string;
  stageSrc?: string | null;
  zoomLevel: number;
  loading?: boolean;
  emptyState?: ReactNode;
  footer?: ReactNode;
}
export default function BackgroundRemovalSection({
  title = "Background Removal",
  description = "Remove the background to proceed with text editing",
  stageSrc,
  zoomLevel,
  loading,
  emptyState,
  footer,
}: SharedBackgroundRemovalSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ThumbnailImageStage
          src={stageSrc || undefined}
          alt={stageSrc ? "Processed frame" : "Selected frame"}
          zoom={zoomLevel}
          loading={loading}
          emptyState={emptyState}
        />
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
