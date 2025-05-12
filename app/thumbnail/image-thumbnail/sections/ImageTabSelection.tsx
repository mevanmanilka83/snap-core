"use client"

import React from "react";
import { Image } from "lucide-react";
import { TabsProvider, TabsBtn, TabsContent } from "@/components/tab";
import SmoothScroll from "@/components/smooth-scroll";
import { useMediaQuery } from "@/components/useMediaQuery";

const ImageTabSelection = ({ ImageSection }: { ImageSection: React.ComponentType }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <TabsProvider defaultValue="image">
      <div className="flex flex-col gap-4">
        <SmoothScroll className="w-full">
          <div className="flex gap-2">
            <TabsBtn value="image" className="flex items-center gap-1.5">
              <Image className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Image</span>
            </TabsBtn>
            <TabsBtn value="edit" className="flex items-center gap-1.5">
              <Image className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Edit</span>
            </TabsBtn>
            <TabsBtn value="text" className="flex items-center gap-1.5">
              <Image className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Text</span>
            </TabsBtn>
            <TabsBtn value="preview" className="flex items-center gap-1.5">
              <Image className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Final Preview</span>
            </TabsBtn>
          </div>
        </SmoothScroll>

        <TabsContent value="image">
          <ImageSection />
        </TabsContent>
        <TabsContent value="edit">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Edit section coming soon...</p>
          </div>
        </TabsContent>
        <TabsContent value="text">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Text section coming soon...</p>
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Preview section coming soon...</p>
          </div>
        </TabsContent>
      </div>
    </TabsProvider>
  );
};

export default ImageTabSelection; 