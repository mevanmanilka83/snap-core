import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, ImageIcon, Eraser, Type } from "lucide-react";

const ImageTabSelection = ({ ImageSection }: { ImageSection: React.ComponentType }) => {
  return (
    <Tabs defaultValue="image" className="w-full">
      <TabsList 
        className="bg-muted text-muted-foreground h-auto items-center justify-center rounded-lg p-[3px] grid min-w-fit w-full grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2 overflow-x-auto"
      >
        <TabsTrigger 
          value="image" 
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
        >
          <Image className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Image</span>
        </TabsTrigger>
        <TabsTrigger 
          value="preview" 
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
        >
          <ImageIcon className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Preview</span>
        </TabsTrigger>
        <TabsTrigger 
          value="background" 
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
        >
          <Eraser className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Remove BG</span>
        </TabsTrigger>
        <TabsTrigger 
          value="text" 
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
        >
          <Type className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Text</span>
        </TabsTrigger>
        <TabsTrigger 
          value="final-preview" 
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
        >
          <Image className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
          <span>Final Preview</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="image" className="mt-4">
        <ImageSection />
      </TabsContent>
      <TabsContent value="preview" className="mt-4">
        {/* Preview content will go here */}
      </TabsContent>
      <TabsContent value="background" className="mt-4">
        {/* Background removal content will go here */}
      </TabsContent>
      <TabsContent value="text" className="mt-4">
        {/* Text editor content will go here */}
      </TabsContent>
      <TabsContent value="final-preview" className="mt-4">
        {/* Final preview content will go here */}
      </TabsContent>
    </Tabs>
  );
};

export default ImageTabSelection; 