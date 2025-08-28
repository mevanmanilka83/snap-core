"use client"
import { useState, useRef, useEffect } from "react"
import type { TextElement } from "@/types/text-element"
import type { VideoInfo, ImageFilter } from "@/app/thumbnail/video/types"
import { toast } from "sonner"
import VideoWorkflowTabs from "../tabs"
import { removeBackgroundViaWorker } from "@/features/thumbnail/common"
export default function VideoThumbnailGenerator() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const finalCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState<string | null>(null)
  const [processedFrame, setProcessedFrame] = useState<string | null>(null)
  const [snapshots, setSnapshots] = useState<string[]>([])
  const [selectedSnapshotIndex, setSelectedSnapshotIndex] = useState<number>(-1)
  const [activeTab, setActiveTab] = useState("create-image-thumbnail")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [finalThumbnail, setFinalThumbnail] = useState<string | null>(null)
  const [autoSnapInterval, setAutoSnapInterval] = useState<number | null>(null)
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(null)
  const autoSnapIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [imageFilters, setImageFilters] = useState<ImageFilter>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
  })
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: "default-text",
      text: "TTV",
      x: 50,
      y: 50,
      fontSize: 72,
      color: "#ffffff",
      rotation: 0,
      fontFamily: "Arial",
      position: "center",
      maxWidth: 80,
      curve: false,
      backgroundColor: "#000000",
      backgroundEnabled: false,
      shadow: true,
      shadowBlur: 10,
      shadowColor: "#000000",
      textAlign: "center",
      bold: false,
      italic: false,
      underline: false,
      letterSpacing: 0,
      lineHeight: 1.2,
      opacity: 100,
      visible: true,
      layerOrder: "front"
    },
  ])
  const [canGoToTextAndPreview, setCanGoToTextAndPreview] = useState(false);
  const [backgroundRemoved] = useState(false);
  
  useEffect(() => {
    return () => {
      if (autoSnapIntervalRef.current) {
        clearInterval(autoSnapIntervalRef.current)
      }
    }
  }, [])
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.setAttribute('crossOrigin', 'anonymous');
    }
  }, []);
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleTimeUpdate = () => {
      setVideoInfo((prev) => ({
        ...prev!,
        currentTime: video.currentTime,
      }))
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [])
  
  useEffect(() => {
    if (autoSnapIntervalRef.current) {
      clearInterval(autoSnapIntervalRef.current)
      autoSnapIntervalRef.current = null
    }
    if (autoSnapInterval && videoLoaded && videoInfo) {
      autoSnapIntervalRef.current = setInterval(() => {
        if (videoRef.current && !videoRef.current.paused) {
          captureSnapshot()
        }
      }, autoSnapInterval * 1000)
    }
    return () => {
      if (autoSnapIntervalRef.current) {
        clearInterval(autoSnapIntervalRef.current)
      }
    }
  }, [autoSnapInterval, videoLoaded, videoInfo])
  
  useEffect(() => {
    if (processedFrame && finalCanvasRef.current) {
      updateFinalPreview()
    }
  }, [textElements, processedFrame])
  
  useEffect(() => {
    if (processedFrame) {
      updateFinalPreview();
    }
  }, [processedFrame, textElements, imageFilters]);
  const handleMetadataLoaded = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    setVideoInfo({
      duration: video.duration,
      currentTime: video.currentTime,
      width: video.videoWidth,
      height: video.videoHeight,
    });
    setVideoLoaded(true);
    toast.success("Video loaded", {
      description: `${video.videoWidth}x${video.videoHeight}, ${formatDuration(video.duration)}`,
    });
  }
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }
  const handleTimeUpdate = () => {
    if (!videoRef.current || !isPlaying) return;
    try {
      const video = videoRef.current;
      
      if (video.readyState < 2) return;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0);
      try {
        const imageData = canvas.toDataURL('image/png', 1.0);
        if (imageData && imageData !== 'data:,') {
          setCurrentFrame(imageData);
        }
      } catch (error) {
        
        console.debug("Frame update skipped");
      }
    } catch (error) {
      console.debug("Time update skipped");
    }
  };
  const handleSnapshot = () => {
    if (!videoRef.current) {
      toast.error("No video loaded");
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      
      if (video.readyState < 2) {
        toast.error("Video is not ready yet");
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        toast.error("Failed to create canvas context");
        return;
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        const imageUrl = canvas.toDataURL("image/png");
        
        if (!imageUrl || imageUrl === 'data:,') {
          throw new Error("Invalid image data generated");
        }
        setSnapshots((prev) => [...prev, imageUrl]);
        setSelectedSnapshotIndex(snapshots?.length || 0);
        setProcessedFrame(imageUrl);
        setProcessedImageSrc(imageUrl);
        setActiveTab("edit");
        toast.success("Snapshot captured successfully", {
          id: "snapshot-success",
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('tainted')) {
          toast.error("Cannot capture frame due to CORS restrictions. Please ensure the video source allows cross-origin access.");
        } else {
          toast.error("Failed to capture frame. Please try again.");
        }
        console.error("Error capturing frame:", error);
      }
    } catch (error) {
      console.error("Error in handleSnapshot:", error);
      toast.error("Failed to capture frame. Please try again.");
    }
  };
  const captureSnapshot = async () => {
    handleSnapshot();
    return Promise.resolve();
  };
  const handleAutoCaptureKeyFrames = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const duration = video.duration;
    const interval = 5; 
    const newSnapshots: string[] = [];
    for (let time = 0; time < duration; time += interval) {
      video.currentTime = time;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      newSnapshots.push(canvas.toDataURL("image/png"));
    }
    setSnapshots((prev) => [...prev, ...newSnapshots]);
    setSelectedSnapshotIndex(snapshots?.length || 0);
    setProcessedFrame(newSnapshots[0]);
    setProcessedImageSrc(newSnapshots[0]);
    setActiveTab("edit");
    toast.success("Snapshots captured successfully", {
      id: "auto-snapshot-success", 
    });
  };
  const handleSaveSnapshot = (index: number) => {
    const snapshot = snapshots[index]
    if (!snapshot) return
    const link = document.createElement("a")
    link.href = snapshot
    link.download = `snapshot-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Snapshot saved")
  }
  const handleSaveAllSnapshots = () => {
    snapshots.forEach((snapshot, index) => {
      const link = document.createElement("a")
      link.href = snapshot
      link.download = `snapshot-${index + 1}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
    toast.success("All snapshots saved")
  }
  const handleDeleteSnapshot = (index: number) => {
    setSnapshots((prev) => prev.filter((_, i) => i !== index))
    if (selectedSnapshotIndex === index) {
      setSelectedSnapshotIndex(-1)
      setProcessedFrame(null)
    } else if (selectedSnapshotIndex > index) {
      setSelectedSnapshotIndex(selectedSnapshotIndex - 1)
    }
    toast.success("Snapshot deleted")
  }
  const handleSelectSnapshot = (index: number) => {
    if (index < 0 || index >= (snapshots?.length || 0)) {
      toast.error("Invalid snapshot index");
      return;
    }
    const selectedSnapshot = snapshots[index];
    if (!selectedSnapshot) {
      toast.error("Selected snapshot is invalid");
      return;
    }
    
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const verifiedImageData = canvas.toDataURL('image/png');
          setSelectedSnapshotIndex(index);
          setProcessedFrame(verifiedImageData);
          setCurrentFrame(verifiedImageData);
          setProcessedImageSrc(verifiedImageData);
          setActiveTab("edit");
        } catch (error) {
          console.error("Error verifying snapshot:", error);
          toast.error("Failed to load snapshot. The image data may be invalid.");
        }
      }
    };
    img.onerror = () => {
      console.error("Error loading snapshot image");
      toast.error("Failed to load snapshot image");
    };
    img.src = selectedSnapshot;
  };
  
  useEffect(() => {
    if (snapshots?.length > 0) {
      
              const lastSnapshot = snapshots[snapshots?.length - 1];
      if (!lastSnapshot || lastSnapshot === 'data:,') {
        
        setSnapshots((prev) => prev.slice(0, -1));
        toast.error("Invalid snapshot removed");
      }
    }
  }, [snapshots]);
  
  useEffect(() => {
    if (currentFrame && currentFrame !== 'data:,') {
      setProcessedFrame(currentFrame);
    }
  }, [currentFrame]);
  
  useEffect(() => {
    if (processedFrame && processedFrame !== 'data:,') {
      
      updateFinalPreview();
    }
  }, [processedFrame]);
  const handleUndo = () => {
    if (undoStack.length === 0) {
      toast.info("Nothing to undo")
      return
    }
    
    if (processedFrame) {
      setRedoStack((prev) => [...prev, processedFrame])
    }
    
    const lastState = undoStack[undoStack.length - 1]
    setProcessedFrame(lastState)
    
    setUndoStack((prev) => prev.slice(0, -1))
    toast.info("Undo successful")
  }
  const handleRedo = () => {
    if (redoStack.length === 0) {
      toast.info("Nothing to redo")
      return
    }
    
    if (processedFrame) {
      setUndoStack((prev) => [...prev, processedFrame])
    }
    
    const lastState = redoStack[redoStack.length - 1]
    setProcessedFrame(lastState)
    
    setRedoStack((prev) => prev.slice(0, -1))
    toast.info("Redo successful")
  }
  const handleRemoveBackground = async () => {
    if (!processedFrame) {
      toast.error("No frame selected");
      return;
    }
    try {
      setIsProcessing(true);
      const blob = await removeBackgroundViaWorker(processedFrame, {
        onProgress: (p) => console.debug("Background removal:", p, "%"),
      });
      const processedImageUrl = URL.createObjectURL(blob);
      if (processedImageSrc && processedImageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(processedImageSrc);
      }
      setProcessedFrame(processedImageUrl);
      setProcessedImageSrc(processedImageUrl);
      updateFinalPreview();
      toast.success("Background removed successfully");
    } catch (error) {
      console.error("Error removing background:", error);
      toast.error("Failed to remove background. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const applyFilters = (ctx: CanvasRenderingContext2D) => {
    const filters = []
    if (imageFilters.brightness !== 100) filters.push(`brightness(${imageFilters.brightness}%)`)
    if (imageFilters.contrast !== 100) filters.push(`contrast(${imageFilters.contrast}%)`)
    if (imageFilters.saturation !== 100) filters.push(`saturate(${imageFilters.saturation}%)`)
    if (imageFilters.blur > 0) filters.push(`blur(${imageFilters.blur}px)`)
    if (imageFilters.hueRotate !== 0) filters.push(`hue-rotate(${imageFilters.hueRotate}deg)`)
    if (imageFilters.grayscale > 0) filters.push(`grayscale(${imageFilters.grayscale}%)`)
    if (imageFilters.sepia > 0) filters.push(`sepia(${imageFilters.sepia}%)`)
    if (filters.length > 0) {
      ctx.filter = filters.join(" ")
    } else {
      ctx.filter = "none"
    }
  }
  
  const resetFilters = () => {
    setImageFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hueRotate: 0,
      grayscale: 0,
      sepia: 0,
    })
    toast.success("Image filters reset to default")
  }
  
  const applyPresetFilter = (preset: string) => {
    switch (preset) {
      case "grayscale":
        setImageFilters({
          ...imageFilters,
          grayscale: 100,
          saturation: 0,
        })
        break
      case "sepia":
        setImageFilters({
          ...imageFilters,
          sepia: 80,
          saturation: 110,
          contrast: 110,
        })
        break
      case "vivid":
        setImageFilters({
          ...imageFilters,
          saturation: 150,
          contrast: 120,
          brightness: 105,
        })
        break
      case "cool":
        setImageFilters({
          ...imageFilters,
          hueRotate: 180,
          saturation: 90,
        })
        break
      case "warm":
        setImageFilters({
          ...imageFilters,
          hueRotate: 30,
          saturation: 120,
          brightness: 105,
        })
        break
      default:
        resetFilters()
    }
    toast.success(`Applied ${preset} filter`)
  }
  const handleApplyFilters = () => {
    if (!processedFrame) {
      toast.error("No frame selected");
      return;
    }
    
    setUndoStack((prev) => [...prev, processedFrame]);
    setRedoStack([]); 
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        applyFilters(ctx);
        ctx.drawImage(img, 0, 0);
        const filteredImageUrl = canvas.toDataURL("image/png", 1.0);
        setProcessedFrame(filteredImageUrl);
        setProcessedImageSrc(filteredImageUrl);
        
        updateFinalPreview();
        toast.success("Filters applied");
      }
    };
    img.src = processedFrame;
  };
  const handleCreateThumbnail = () => {
    if (!processedFrame) {
      toast.error("No frame selected");
      return;
    }
    setActiveTab("text");
    updateFinalPreview();
    toast.success("Thumbnail updated");
  };
  
  const calculatePosition = (element: TextElement, canvasWidth: number, canvasHeight: number) => {
    let x = canvasWidth * (element.x / 100)
    let y = canvasHeight * (element.y / 100)
    
    switch (element.position) {
      case "left":
        x = 20
        break
      case "right":
        x = canvasWidth - 20
        break
      case "top":
        y = 20
        break
      case "bottom":
        y = canvasHeight - 20
        break
      case "top-left":
        x = 20
        y = 20
        break
      case "top-right":
        x = canvasWidth - 20
        y = 20
        break
      case "bottom-left":
        x = 20
        y = canvasHeight - 20
        break
      case "bottom-right":
        x = canvasWidth - 20
        y = canvasHeight - 20
        break
      case "top-center":
        x = canvasWidth / 2
        y = 20
        break
      case "center-left":
        x = 20
        y = canvasHeight / 2
        break
      case "center-right":
        x = canvasWidth - 20
        y = canvasHeight / 2
        break
      case "bottom-center":
        x = canvasWidth / 2
        y = canvasHeight - 20
        break
      
    }
    return { x, y }
  }
  
  const updateFinalPreview = () => {
    if (!processedFrame || !snapshots[selectedSnapshotIndex]) {
      console.debug("No processed frame or snapshot available for preview");
      return;
    }
    
    const previewCanvas = document.createElement('canvas');
    const processedImg = new window.Image();
    const originalImg = new window.Image();
    processedImg.crossOrigin = "anonymous";
    originalImg.crossOrigin = "anonymous";
    let loadedImages = 0;
    const totalImages = 2;
    const tryCreatePreview = () => {
      if (loadedImages < totalImages) return;
      try {
        
        previewCanvas.width = originalImg.width;
        previewCanvas.height = originalImg.height;
        const ctx = previewCanvas.getContext("2d");
        if (!ctx) {
          console.error("Failed to get canvas context");
          toast.error("Failed to create thumbnail");
          return;
        }
        
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        
        ctx.filter = `
          brightness(${imageFilters.brightness}%) 
          contrast(${imageFilters.contrast}%) 
          saturate(${imageFilters.saturation}%) 
          blur(${imageFilters.blur}px) 
          hue-rotate(${imageFilters.hueRotate}deg)
          grayscale(${imageFilters.grayscale}%)
          sepia(${imageFilters.sepia}%)
        `;
        ctx.drawImage(originalImg, 0, 0);
        ctx.filter = "none"; 
        
        textElements
          .filter(element => element.visible !== false && element.layerOrder === "back")
          .forEach(element => {
            drawTextElement(ctx, element, previewCanvas.width, previewCanvas.height);
          });
        
        ctx.drawImage(processedImg, 0, 0);
        
        textElements
          .filter(element => element.visible !== false && element.layerOrder === "front")
          .forEach(element => {
            drawTextElement(ctx, element, previewCanvas.width, previewCanvas.height);
          });
        
        previewCanvas.toBlob((blob) => {
          if (!blob) {
            console.error("Failed to create blob from canvas");
            toast.error("Failed to create thumbnail");
            return;
          }
          const finalImageUrl = URL.createObjectURL(blob);
          setFinalThumbnail(finalImageUrl);
          console.debug("Thumbnail updated");
        }, 'image/png', 1.0);
      } catch (error) {
        console.error("Error creating thumbnail:", error);
        toast.error("Failed to create thumbnail");
      }
    };
    originalImg.onload = () => {
      loadedImages++;
      tryCreatePreview();
    };
    processedImg.onload = () => {
      loadedImages++;
      tryCreatePreview();
    };
    originalImg.onerror = () => {
      console.error("Error loading original image");
      toast.error("Failed to load original image");
    };
    processedImg.onerror = () => {
      console.error("Error loading processed image");
      toast.error("Failed to load processed image");
    };
    
    originalImg.src = snapshots[selectedSnapshotIndex];
    processedImg.src = processedFrame;
  };
  
  const drawTextElement = (
    ctx: CanvasRenderingContext2D,
    element: TextElement,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();
    
    const position = calculatePosition(element, canvasWidth, canvasHeight);
    ctx.translate(position.x, position.y);
    
    if (element.rotation !== 0) {
      ctx.rotate((element.rotation * Math.PI) / 180);
    }
    
    let fontStyle = "";
    if (element.bold) fontStyle += "bold ";
    if (element.italic) fontStyle += "italic ";
    
    const scaleFactor = Math.min(canvasWidth, canvasHeight) / 250;
    
    const scaledFontSize = Math.max(element.fontSize * scaleFactor * 4.0, element.fontSize * 1.2);
    fontStyle += `${scaledFontSize}px ${element.fontFamily}`;
    ctx.font = fontStyle;
    
    ctx.textAlign = (element.textAlign as CanvasTextAlign) || "center";
    ctx.textBaseline = "middle";
    
    ctx.globalAlpha = (element.opacity || 100) / 100;
    
    const lines = element.text.split('\n');
    const lineHeight = scaledFontSize * (element.lineHeight || 1.2);
    const totalHeight = lineHeight * lines.length;
    const startY = -(totalHeight / 2) + (lineHeight / 2);
    
    if (element.backgroundEnabled && element.backgroundColor) {
      const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
      const padding = scaledFontSize * 0.2;
      ctx.fillStyle = element.backgroundColor;
      ctx.fillRect(
        -maxWidth / 2 - padding,
        -totalHeight / 2 - padding,
        maxWidth + padding * 2,
        totalHeight + padding * 2
      );
    }
    
    if (element.shadow) {
      ctx.shadowColor = element.shadowColor || "rgba(0,0,0,0.5)";
      ctx.shadowBlur = (element.shadowBlur || 10) * scaleFactor;
      ctx.shadowOffsetX = 2 * scaleFactor;
      ctx.shadowOffsetY = 2 * scaleFactor;
    }
    
    ctx.fillStyle = element.color;
    
    const maxWidth = ((element.maxWidth || 80) / 100) * canvasWidth;
    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      ctx.fillText(line, 0, y, maxWidth);
    });
    ctx.restore();
  };
  const handleSaveFinalThumbnail = () => {
    if (!finalThumbnail) {
      toast.error("No thumbnail to save");
      return;
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const link = document.createElement("a");
    link.href = finalThumbnail;
    link.download = `thumbnail-${timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Thumbnail updated");
  };
  const toggleAutoSnap = (enabled: boolean) => {
    if (enabled) {
      setAutoSnapInterval(5) 
    } else {
      setAutoSnapInterval(null)
      if (autoSnapIntervalRef.current) {
        clearInterval(autoSnapIntervalRef.current)
      }
    }
  }
  const handleTabChange = (newTab: string) => {
    
    if (newTab === "video" || newTab === "snapshots") {
      setActiveTab(newTab);
      return;
    }
    
    if (newTab === "edit") {
      if (selectedSnapshotIndex === -1) {
        toast.error("Please select a snapshot first");
        return;
      }
      setActiveTab(newTab);
      return;
    }
    
    if (newTab === "text" || newTab === "preview") {
      if (!processedImageSrc || !canGoToTextAndPreview) {
        return;
      }
      setActiveTab(newTab);
      return;
    }
    setActiveTab(newTab);
  };
  return (
    <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
      <VideoWorkflowTabs
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        snapshots={snapshots}
        selectedSnapshotIndex={selectedSnapshotIndex}
        canGoToTextAndPreview={canGoToTextAndPreview}
        videoRef={videoRef as React.RefObject<HTMLVideoElement>}
        videoInfo={videoInfo}
        videoLoaded={videoLoaded}
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
        handleSaveSnapshot={handleSaveSnapshot}
        handleDeleteSnapshot={handleDeleteSnapshot}
        handleSaveAllSnapshots={handleSaveAllSnapshots}
        setSnapshots={setSnapshots}
        setSelectedSnapshotIndex={setSelectedSnapshotIndex}
        setProcessedFrame={setProcessedFrame}
        setProcessedImageSrc={setProcessedImageSrc}
        processedFrame={processedFrame}
        processedImageSrc={processedImageSrc}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        imageFilters={imageFilters}
        setImageFilters={setImageFilters}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        undoStack={undoStack}
        redoStack={redoStack}
        handleCreateThumbnail={handleCreateThumbnail}
        handleApplyFilters={handleApplyFilters}
        resetFilters={resetFilters}
        applyPresetFilter={applyPresetFilter}
        isProcessing={isProcessing}
        isCreatingThumbnail={false}
        setIsProcessing={setIsProcessing}
        setUndoStack={setUndoStack}
        setRedoStack={setRedoStack}
        handleRemoveBackground={handleRemoveBackground}
        backgroundRemoved={backgroundRemoved}
        setCanGoToTextAndPreview={setCanGoToTextAndPreview}
        textElements={textElements}
        setTextElements={setTextElements}
        finalThumbnail={finalThumbnail}
        handleSaveFinalThumbnail={handleSaveFinalThumbnail}
        handleSelectSnapshot={handleSelectSnapshot}
      />
    </div>
  )
}
