"use client"

import { Image } from "lucide-react";
import { TabsProvider, TabsBtn, TabsContent } from "@/app/components/tab";
import SmoothScroll from "@/app/components/smooth-scroll";
import { useMediaQuery } from "@/app/components/useMediaQuery";

const ImageTabSelection = ({ ImageSection }: { ImageSection: React.ComponentType }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <TabsProvider defaultValue="image" wobbly={!isMobile}>
      <div className="w-full">
        <SmoothScroll className="w-full">
          <div className="flex items-center justify-center gap-1 sm:gap-2 p-[3px] min-w-fit">
            <TabsBtn 
              value="image" 
              className="bg-muted h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
            >
              <Image className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Image</span>
            </TabsBtn>
          </div>
        </SmoothScroll>
        <TabsContent value="image" className="mt-4">
          <ImageSection />
        </TabsContent>
      </div>
    </TabsProvider>
  );
};

export default ImageTabSelection; 