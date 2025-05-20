import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Layers, Download, Trash2, ImageIcon, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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
}: any) => {
  const [loadedSnapshots, setLoadedSnapshots] = useState<Set<number>>(new Set());
  const [failedSnapshots, setFailedSnapshots] = useState<Set<number>>(new Set());
  const [retryCount, setRetryCount] = useState<Record<number, number>>({});
  const [loadingSnapshots, setLoadingSnapshots] = useState<Set<number>>(new Set());

  // Reset states when snapshots change
  useEffect(() => {
    setLoadedSnapshots(new Set());
    setFailedSnapshots(new Set());
    setRetryCount({});
    setLoadingSnapshots(new Set());
  }, [snapshots]);

  const verifyImage = useCallback(async (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Create a canvas to verify the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) {
          resolve(false);
          return;
        }

        try {
          ctx.drawImage(img, 0, 0);
          ctx.getImageData(0, 0, 1, 1);
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      };

      img.onerror = () => {
        resolve(false);
      };

      img.src = src;
    });
  }, []);

  const handleImageLoad = async (index: number, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const isValid = await verifyImage(img.src);
    
    if (isValid) {
      setLoadedSnapshots(prev => new Set([...prev, index]));
      setFailedSnapshots(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      setLoadingSnapshots(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    } else {
      handleImageError(index, e);
    }
  };

  const handleImageError = async (index: number, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Error loading snapshot ${index}:`, e);
    
    // Increment retry count for this snapshot
    const currentRetries = retryCount[index] || 0;
    setRetryCount(prev => ({ ...prev, [index]: currentRetries + 1 }));

    // If we haven't retried too many times, try reloading
    if (currentRetries < 3) {
      const img = e.currentTarget;
      const src = img.src;
      
      setLoadingSnapshots(prev => new Set([...prev, index]));
      
      // Clear the src and set it again to trigger a reload
      img.src = '';
      setTimeout(async () => {
        try {
          const isValid = await verifyImage(src);
          if (isValid) {
            img.src = src;
            toast.success(`Successfully reloaded snapshot ${index + 1}`);
          } else {
            throw new Error('Image verification failed');
          }
        } catch (error) {
          handleImageError(index, e);
        }
      }, 1000 * (currentRetries + 1)); // Exponential backoff
      
      toast.error(`Retrying to load snapshot ${index + 1}...`);
    } else {
      setFailedSnapshots(prev => new Set([...prev, index]));
      setLoadingSnapshots(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      e.currentTarget.src = "/placeholder.svg";
      toast.error(`Failed to load snapshot ${index + 1} after multiple attempts`);
    }
  };

  const handleRetryLoad = async (index: number) => {
    setRetryCount(prev => ({ ...prev, [index]: 0 }));
    setFailedSnapshots(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    setLoadingSnapshots(prev => new Set([...prev, index]));
    
    const snapshot = snapshots[index];
    if (snapshot) {
      const isValid = await verifyImage(snapshot);
      if (isValid) {
        const img = document.querySelector(`img[alt="Snapshot ${index + 1}"]`) as HTMLImageElement;
        if (img) {
          img.src = snapshot;
        }
      } else {
        setFailedSnapshots(prev => new Set([...prev, index]));
        toast.error(`Failed to verify snapshot ${index + 1}`);
      }
    }
  };

  return (
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
                  onLoad={(e) => handleImageLoad(index, e)}
                  onError={(e) => handleImageError(index, e)}
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
                {loadingSnapshots.has(index) && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
                {failedSnapshots.has(index) && !loadingSnapshots.has(index) && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/80 hover:bg-white text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetryLoad(index);
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                )}
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
};

export default SnapshotsSection; 