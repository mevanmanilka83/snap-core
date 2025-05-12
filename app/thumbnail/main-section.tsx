import VideoSection from "./video-thumbnail/sections/VideoSection";
import ImageTabSelection from "./image-thumbnail/sections/ImageTabSelection";
import ImageSection from "./image-thumbnail/sections/ImageSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, ImageIcon, Eraser, Type } from "lucide-react";

const MainSection = ({
  videoRef,
  videoLoaded,
  videoInfo,
  isPlaying,
  setIsPlaying,
  handleMetadataLoaded,
  handleTimeUpdate,
  handleSnapshot,
  captureSnapshot,
  handleAutoCaptureKeyFrames,
  autoSnapInterval,
  setAutoSnapInterval,
  toggleAutoSnap
}: any) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <VideoSection
        videoRef={videoRef}
        videoLoaded={videoLoaded}
        videoInfo={videoInfo}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        handleMetadataLoaded={handleMetadataLoaded}
        handleTimeUpdate={handleTimeUpdate}
        handleSnapshot={handleSnapshot}
        captureSnapshot={captureSnapshot}
        handleAutoCaptureKeyFrames={handleAutoCaptureKeyFrames}
        autoSnapInterval={autoSnapInterval}
        setAutoSnapInterval={setAutoSnapInterval}
        toggleAutoSnap={toggleAutoSnap}
      />
      <ImageTabSelection ImageSection={ImageSection} />
    </div>
  );
};

export default MainSection; 