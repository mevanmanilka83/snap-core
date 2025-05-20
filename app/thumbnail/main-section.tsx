import VideoSection from "./video-thumbnail/sections/VideoSection";
import SimpleVideoTabSelection from "./video-thumbnail/sections/SimpleVideoTabSelection";

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
  toggleAutoSnap,
}: any) => {
  return (
    <div id="main-section" className="space-y-4 sm:space-y-6">
      <div className="relative">
        <SimpleVideoTabSelection
          VideoSection={VideoSection}
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
      </div>
    </div>
  );
};

export default MainSection;
