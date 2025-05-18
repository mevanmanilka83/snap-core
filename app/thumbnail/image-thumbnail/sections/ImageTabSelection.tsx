"use client";

import React from "react";
import { Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SmoothScroll from "@/components/smooth-scroll";
import { useMediaQuery } from "@/components/useMediaQuery";

const ImageTabSelection = ({
  ImageSection,
}: {
  ImageSection: React.ComponentType;
}) => {
  // Mobile check prefixed with underscore to indicate it's declared but not used
  const _isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Tabs defaultValue="image" className="w-full">
      <div className="flex flex-col gap-4">
        <div className="relative mb-4">
        </div>
        <SmoothScroll className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="image" className="flex items-center gap-1.5">
              <Image className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Image</span>
            </TabsTrigger>
          </TabsList>
        </SmoothScroll>

        <TabsContent value="image">
          <ImageSection />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ImageTabSelection;
