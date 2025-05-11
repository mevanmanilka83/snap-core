import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Layers, Download, Trash2, ImageIcon, AlertCircle } from "lucide-react";

const SnapshotsSection = ({
  snapshots,
  selectedSnapshotIndex,
  handleSelectSnapshot,
  handleSaveSnapshot,
  handleDeleteSnapshot,
  handleSaveAllSnapshots,
  setSnapshots,
  setSelectedSnapshotIndex,
  setProcessedFrame,
  setProcessedImageSrc,
  toast
}: any) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base sm:text-lg">Snapshots</CardTitle>
      <CardDescription className="text-xs sm:text-sm">
        Select a snapshot to begin editing. Background removal is required before adding text.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {snapshots.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {snapshots.map((snapshot: string, index: number) => (
            <div
              key={index}
              className={`relative aspect-video cursor-pointer border-2 rounded-md overflow-hidden ${
                selectedSnapshotIndex === index ? "border-primary" : "border-transparent"
              }`}
              onClick={() => handleSelectSnapshot(index)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", snapshot);
                e.dataTransfer.effectAllowed = "copy";
              }}
            >
              <img 
                src={snapshot} 
                alt={`Snapshot ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error(`Error loading snapshot ${index}:`, e);
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/80 hover:bg-white text-sm h-8 sm:h-9 min-w-[36px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveSnapshot(index);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-white/80 hover:bg-red-500 text-sm h-8 sm:h-9 min-w-[36px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSnapshot(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs sm:text-sm px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 text-muted-foreground">
          <Layers className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-20" />
          <p className="text-xs sm:text-sm">No snapshots yet. Capture frames from the video first.</p>
        </div>
      )}
    </CardContent>
    <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <Button
        variant="outline"
        onClick={() => {
          setSnapshots([]);
          setSelectedSnapshotIndex(-1);
          setProcessedFrame(null);
          setProcessedImageSrc(null);
          toast.success("All snapshots cleared");
        }}
        disabled={snapshots.length === 0}
        className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
      >
        Clear All
      </Button>
      <Button
        onClick={handleSaveAllSnapshots}
        disabled={snapshots.length === 0}
        variant="default"
        className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
      >
        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        Save All Snapshots
      </Button>
    </CardFooter>
  </Card>
);

export default SnapshotsSection; 