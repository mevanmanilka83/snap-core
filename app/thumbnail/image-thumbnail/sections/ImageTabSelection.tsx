"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ImageTabSelection = ({
  handleTabChange,
}: {
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
