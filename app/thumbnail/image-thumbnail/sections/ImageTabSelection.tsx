"use client";

import React from "react";
import { Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SmoothScroll from "@/components/smooth-scroll";
import { useMediaQuery } from "@/components/useMediaQuery";

const ImageTabSelection = ({
  activeTab,
  handleTabChange,
}: {
  activeTab: string;
  handleTabChange: (tab: string) => void;
}) => {
  return (
    <Tabs defaultValue="image" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="image" onClick={() => handleTabChange("image")}>
          Image
        </TabsTrigger>
        <TabsTrigger value="text" onClick={() => handleTabChange("text")}>
          Text
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ImageTabSelection;
