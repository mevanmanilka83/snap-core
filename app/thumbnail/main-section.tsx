import VideoSection from "./video-thumbnail/sections/VideoSection";
import ImageSection from "./image-thumbnail/sections/ImageSection";

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
      <ImageSection />
    </div>
  );
};

export default MainSection; 