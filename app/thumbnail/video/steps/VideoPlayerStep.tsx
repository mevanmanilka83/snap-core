import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VideoPlayer as ThumbnailVideoPlayer } from "@/features/thumbnail/video/ThumbnailVideoPlayer";

interface VideoSectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoLoaded: boolean;
  videoInfo: {
    width: number;
    height: number;
    duration: number;
    currentTime: number;
  } | null;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  handleMetadataLoaded: () => void;
  handleTimeUpdate: () => void;
  captureSnapshot: () => Promise<void>;
  handleAutoCaptureKeyFrames: () => void;
  autoSnapInterval: number | null;
  setAutoSnapInterval: (interval: number | null) => void;
  toggleAutoSnap: (enabled: boolean) => void;
}

const VideoSection = ({
  videoRef,
  videoLoaded,
  videoInfo,
  isPlaying,
  setIsPlaying,
  handleMetadataLoaded,
  handleTimeUpdate,
  captureSnapshot,
  handleAutoCaptureKeyFrames,
  autoSnapInterval,
  setAutoSnapInterval,
  toggleAutoSnap,
}: VideoSectionProps) => (
  <div className="space-y-4 sm:space-y-6">
    <ThumbnailVideoPlayer
      videoRef={videoRef}
      videoLoaded={videoLoaded}
      videoInfo={videoInfo}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      onMetadataLoaded={handleMetadataLoaded}
      onTimeUpdate={handleTimeUpdate}
    />
    <Card className="overflow-hidden mb-6">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg">
          Snapshot Controls
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Capture frames from the video
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
          <Button
            onClick={captureSnapshot}
            disabled={!videoLoaded}
            className="w-full h-auto min-h-[44px] text-sm sm:text-base"
            size="default"
          >
            Capture Current Frame
          </Button>
          <Button
            variant="outline"
            onClick={handleAutoCaptureKeyFrames}
            disabled={!videoLoaded}
            className="w-full h-auto min-h-[44px] text-sm sm:text-base"
            size="default"
          >
            Auto Capture Key Frames
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Switch
              id="auto-snap"
              checked={!!autoSnapInterval}
              onCheckedChange={toggleAutoSnap}
              disabled={!videoLoaded}
              className="h-5 w-9"
            />
            <Label htmlFor="auto-snap" className="text-sm sm:text-base">
              Auto Snapshot
            </Label>
          </div>
          {autoSnapInterval && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Label htmlFor="interval" className="text-sm sm:text-base">
                Every
              </Label>
              <Select
                value={autoSnapInterval.toString()}
                onValueChange={(value: string) =>
                  setAutoSnapInterval(Number(value))
                }
              >
                <SelectTrigger className="w-24 sm:w-28 h-9 sm:h-10 text-sm sm:text-base">
                  <SelectValue placeholder="Interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1s</SelectItem>
                  <SelectItem value="2">2s</SelectItem>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                  <SelectItem value="30">30s</SelectItem>
                  <SelectItem value="60">1m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default VideoSection;
