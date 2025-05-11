"use client"

import { useState, useRef, useEffect } from "react"
import { VideoPlayer } from "@/app/shared/video-player"
import DropZone from "@/app/shared/drop-zone"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Download,
  Trash2,
  Clock,
  Layers,
  ImageIcon,
  Type,
  Palette,
  Scissors,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Undo,
  Redo,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import TextEditor from "@/app/shared/text-editor"
import * as backgroundRemoval from "@imgly/background-removal"
import VideoSection from "./sections/VideoSection"
import SnapshotsSection from "./sections/SnapshotsSection"
import EditSection from "./sections/EditSection"
import TextSection from "./sections/TextSection"
import FinalPreviewSection from "./sections/FinalPreviewSection"

interface VideoInfo {
  width: number
  height: number
  duration: number
  currentTime: number
}

interface ImageFilter {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  hueRotate: number
  grayscale: number
  sepia: number
}

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  rotation: number
  fontFamily: string
  position:
    | "center"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "center-left"
    | "center-right"
    | "bottom-center"
  maxWidth?: number
  curve?: boolean
  backgroundColor?: string
  backgroundEnabled?: boolean
  shadow?: boolean
  shadowBlur?: number
  shadowColor?: string
  textAlign?: "left" | "center" | "right" | "justify"
  bold?: boolean
  italic?: boolean
  underline?: boolean
  letterSpacing?: number
  lineHeight?: number
  opacity?: number
  visible?: boolean
  layerOrder?: "front" | "back"
}

export default function VideoThumbnailGenerator() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const finalCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState<string | null>(null)
  const [processedFrame, setProcessedFrame] = useState<string | null>(null)
  const [snapshots, setSnapshots] = useState<string[]>([])
  const [selectedSnapshotIndex, setSelectedSnapshotIndex] = useState<number>(-1)
  const [activeTab, setActiveTab] = useState("video")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [finalThumbnail, setFinalThumbnail] = useState<string | null>(null)
  const [autoSnapInterval, setAutoSnapInterval] = useState<number | null>(null)
  const [isCreatingThumbnail, setIsCreatingThumbnail] = useState(false)
  const [showUpdateToast, setShowUpdateToast] = useState(false)
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

  // Text elements state
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoSnapIntervalRef.current) {
        clearInterval(autoSnapIntervalRef.current)
      }
    }
  }, [])

  // Set up video element with CORS attributes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.setAttribute('crossOrigin', 'anonymous');
    }
  }, []);

  // Set up video event listeners
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

  // Auto snapshot functionality
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

  // Update final preview when text elements change
  useEffect(() => {
    if (processedFrame && finalCanvasRef.current) {
      updateFinalPreview()
    }
  }, [textElements, processedFrame])

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
      
      // Check if video is ready
      if (video.readyState < 2) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw the current video frame
      ctx.drawImage(video, 0, 0);
      
      try {
        const imageData = canvas.toDataURL('image/png', 1.0);
        if (imageData && imageData !== 'data:,') {
          setCurrentFrame(imageData);
        }
      } catch (error) {
        // Silently handle errors during time update
        console.debug("Frame update skipped");
      }
    } catch (error) {
      console.debug("Time update skipped");
    }
  };

  const goToTime = (time: number) => {
    const video = videoRef.current
    if (!video || !videoInfo) return

    video.currentTime = Math.min(videoInfo.duration, Math.max(0, time))
  }

  const handleProcessedImage = (imageSrc: string) => {
    // Save current state to undo stack if we have a processed frame
    if (processedFrame) {
      setUndoStack((prev) => [...prev, processedFrame])
      setRedoStack([]) // Clear redo stack on new action
    }

    setProcessedFrame(imageSrc)
  }

  const handleSnapshot = (imageData: string) => {
    if (!imageData) {
      toast.error("No image data received");
      return;
    }

    try {
      // Add the snapshot directly to the collection
      setSnapshots((prev) => [...prev, imageData]);
      setProcessedFrame(imageData);
      setCurrentFrame(imageData);
      setSelectedSnapshotIndex(snapshots.length);
      setProcessedImageSrc(imageData);
      
      // Save to undo stack if needed
      if (processedFrame) {
        setUndoStack((prev) => [...prev, processedFrame]);
        setRedoStack([]);
      }

      // Update final preview
      updateFinalPreview();

      toast.success("Snapshot captured successfully", {
        description: `View in Snapshots tab (${snapshots.length + 1} total)`
      });
    } catch (error) {
      console.error("Error handling snapshot:", error);
      toast.error("Failed to capture snapshot");
    }
  };

  // Add this helper function at the top level
  const createVideoSnapshot = async (video: HTMLVideoElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Create canvas matching video dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame
        ctx.drawImage(video, 0, 0);

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        if (!dataUrl || dataUrl === 'data:,') {
          reject(new Error('Failed to capture frame'));
          return;
        }

        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    });
  };

  // Replace the existing captureSnapshot function
  const captureSnapshot = async () => {
    const video = videoRef.current;
    
    if (!video) {
      toast.error("No video loaded");
      return;
    }

    // Verify video is ready
    if (!video.videoWidth || !video.videoHeight) {
      toast.error("Video dimensions not available. Please wait for video to load.");
      return;
    }

    // Store playing state
    const wasPlaying = !video.paused;
    
    try {
      // Pause video temporarily
      video.pause();

      // Wait a frame to ensure video is actually paused
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Capture the frame
      const snapshotUrl = await createVideoSnapshot(video);

      // Verify the captured image
      await new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to verify captured image'));
        img.src = snapshotUrl;
      });

      // Update all states
      setSnapshots(prev => [...prev, snapshotUrl]);
      setProcessedFrame(snapshotUrl);
      setCurrentFrame(snapshotUrl);
      setSelectedSnapshotIndex(snapshots.length);
      setProcessedImageSrc(snapshotUrl);

      // Handle undo stack
      if (processedFrame) {
        setUndoStack(prev => [...prev, processedFrame]);
        setRedoStack([]);
      }

      // Update preview
      updateFinalPreview();

      toast.success("Snapshot captured successfully", {
        description: `View in Snapshots tab (${snapshots.length + 1} total)`
      });

    } catch (error) {
      console.error('Snapshot error:', error);
      toast.error("Failed to capture snapshot", {
        description: "Please ensure the video is fully loaded and try again"
      });
    } finally {
      // Restore video state
      if (wasPlaying) {
        try {
          await video.play();
        } catch (e) {
          console.error('Failed to resume video:', e);
        }
      }
    }
  };

  const handleAutoCaptureKeyFrames = () => {
    if (!videoRef.current || !videoInfo) {
      toast.error("No video loaded");
      return;
    }

    const video = videoRef.current;
    const duration = video.duration;
    const times = [0, 0.25, 0.5, 0.75, 1].map((percent) => percent * duration);
    const wasPlaying = !video.paused;
    
    // Pause the video
    video.pause();
    
    let timeIndex = 0;
    const takeSnapshots = () => {
      if (timeIndex < times.length) {
        video.currentTime = times[timeIndex];
        setTimeout(() => {
          captureSnapshot();
          timeIndex++;
          takeSnapshots();
        }, 500);
      } else if (wasPlaying) {
        video.play();
      }
    };
    
    takeSnapshots();
    toast.success("Taking snapshots at key points");
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
    if (index < 0 || index >= snapshots.length) {
      toast.error("Invalid snapshot index");
      return;
    }
    
    const selectedSnapshot = snapshots[index];
    if (!selectedSnapshot) {
      toast.error("Selected snapshot is invalid");
      return;
    }

    // Create a new Image to verify the snapshot data
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Create a canvas to ensure we have valid image data
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

  // Add useEffect to handle snapshot updates
  useEffect(() => {
    if (snapshots.length > 0) {
      // Ensure the last snapshot is valid
      const lastSnapshot = snapshots[snapshots.length - 1];
      if (!lastSnapshot || lastSnapshot === 'data:,') {
        // Remove invalid snapshot
        setSnapshots((prev) => prev.slice(0, -1));
        toast.error("Invalid snapshot removed");
      }
    }
  }, [snapshots]);

  // Add useEffect to handle current frame updates
  useEffect(() => {
    if (currentFrame && currentFrame !== 'data:,') {
      setProcessedFrame(currentFrame);
    }
  }, [currentFrame]);

  // Add useEffect to handle processed frame updates
  useEffect(() => {
    if (processedFrame && processedFrame !== 'data:,') {
      // Update the final preview if we have a valid processed frame
      updateFinalPreview();
    }
  }, [processedFrame]);

  const handleUndo = () => {
    if (undoStack.length === 0) {
      toast.info("Nothing to undo")
      return
    }

    // Save current state to redo stack
    if (processedFrame) {
      setRedoStack((prev) => [...prev, processedFrame])
    }

    // Get the last state from undo stack
    const lastState = undoStack[undoStack.length - 1]
    setProcessedFrame(lastState)

    // Remove the last state from undo stack
    setUndoStack((prev) => prev.slice(0, -1))

    toast.info("Undo successful")
  }

  const handleRedo = () => {
    if (redoStack.length === 0) {
      toast.info("Nothing to redo")
      return
    }

    // Save current state to undo stack
    if (processedFrame) {
      setUndoStack((prev) => [...prev, processedFrame])
    }

    // Get the last state from redo stack
    const lastState = redoStack[redoStack.length - 1]
    setProcessedFrame(lastState)

    // Remove the last state from redo stack
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
      setProcessingProgress(0);

      // Create a new image to process
      const img = new window.Image();
      img.crossOrigin = 'anonymous';

      img.onload = async () => {
        try {
          // Process the image with imgly background removal
          const response = await backgroundRemoval.removeBackground(img.src, {
            progress: (_message: string, progress: number) => {
              setProcessingProgress(Math.round(progress * 100));
            },
          });

          // Convert blob to URL
          const processedImageUrl = URL.createObjectURL(response);

          // Save current state to undo stack
          if (processedFrame) {
            setUndoStack((prev) => [...prev, processedFrame]);
            setRedoStack([]); // Clear redo stack on new action
          }

          // Update states
          setProcessedFrame(processedImageUrl);
          setProcessedImageSrc(processedImageUrl);

          // Update final preview
          updateFinalPreview();

          toast.success("Background removed successfully");
        } catch (error) {
          console.error("Error removing background:", error);
          toast.error("Failed to remove background. Please try again.");
        } finally {
          setIsProcessing(false);
          setProcessingProgress(0);
        }
      };

      img.onerror = () => {
        setIsProcessing(false);
        setProcessingProgress(0);
        console.error("Error loading image for background removal");
        toast.error("Failed to load image for background removal");
      };

      img.src = processedFrame;
    } catch (error) {
      setIsProcessing(false);
      setProcessingProgress(0);
      console.error("Error in background removal:", error);
      toast.error("Failed to remove background");
    }
  };

  // Apply filters to the image
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

  // Reset filters to default values
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

  // Apply a preset filter
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

    // Save current state to undo stack
    setUndoStack((prev) => [...prev, processedFrame]);
    setRedoStack([]); // Clear redo stack on new action

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
        
        // Update final preview after applying filters
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

    setShowTextEditor(true);
    setActiveTab("text");
    updateFinalPreview();
    toast.success("Thumbnail updated. Ready to add text.");
  };

  // Calculate position based on the position property
  const calculatePosition = (element: TextElement, canvasWidth: number, canvasHeight: number) => {
    let x = canvasWidth * (element.x / 100)
    let y = canvasHeight * (element.y / 100)

    // Adjust position based on the position property
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
      // center is the default, already calculated
    }

    return { x, y }
  }

  // Update the final preview with text elements
  const updateFinalPreview = () => {
    if (!processedFrame) {
      console.debug("No processed frame available for preview");
      return;
    }

    // Create a new canvas for the final preview
    const previewCanvas = document.createElement('canvas');
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Set canvas dimensions based on the image
      previewCanvas.width = img.width;
      previewCanvas.height = img.height;
      const ctx = previewCanvas.getContext("2d");
      
      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

      // Draw the processed image with filters
      ctx.filter = `
        brightness(${imageFilters.brightness}%) 
        contrast(${imageFilters.contrast}%) 
        saturate(${imageFilters.saturation}%) 
        blur(${imageFilters.blur}px) 
        hue-rotate(${imageFilters.hueRotate}deg)
        grayscale(${imageFilters.grayscale}%)
        sepia(${imageFilters.sepia}%)
      `;
      ctx.drawImage(img, 0, 0);
      ctx.filter = "none"; // Reset filters for text

      // Sort text elements by layer order
      const sortedElements = [...textElements].sort((a, b) => {
        const aOrder = a.layerOrder === "back" ? 0 : 1;
        const bOrder = b.layerOrder === "back" ? 0 : 1;
        return aOrder - bOrder;
      });

      // Draw text elements in order
      sortedElements.forEach((element) => {
        if (!element.visible) return;
        drawTextElement(ctx, element, previewCanvas.width, previewCanvas.height);
      });

      // Update the final thumbnail
      try {
        const finalImageUrl = previewCanvas.toDataURL("image/png", 1.0);
        setFinalThumbnail(finalImageUrl);
        console.debug("Final preview updated");
      } catch (error) {
        console.error("Error creating final thumbnail:", error);
        toast.error("Failed to create final preview");
      }
    };

    img.onerror = () => {
      console.error("Error loading image for final preview");
      toast.error("Failed to create final preview");
    };

    img.src = processedFrame;
  };

  // Add useEffect to handle preview updates
  useEffect(() => {
    if (processedFrame) {
      console.debug("Updating final preview due to state change");
      updateFinalPreview();
    }
  }, [processedFrame, textElements, imageFilters, processedImageSrc]);

  // Add helper function for drawing text elements
  const drawTextElement = (
    ctx: CanvasRenderingContext2D,
    element: TextElement,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();

    // Calculate position
    const position = calculatePosition(element, canvasWidth, canvasHeight);
    ctx.translate(position.x, position.y);

    // Apply rotation
    if (element.rotation !== 0) {
      ctx.rotate((element.rotation * Math.PI) / 180);
    }

    // Set font properties
    let fontStyle = "";
    if (element.bold) fontStyle += "bold ";
    if (element.italic) fontStyle += "italic ";
    const scaleFactor = Math.min(canvasWidth, canvasHeight) / 1000;
    const scaledFontSize = element.fontSize * scaleFactor * 2;
    fontStyle += `${scaledFontSize}px ${element.fontFamily}`;
    ctx.font = fontStyle;

    // Set text alignment
    ctx.textAlign = (element.textAlign as CanvasTextAlign) || "center";
    ctx.textBaseline = "middle";

    // Set opacity
    ctx.globalAlpha = (element.opacity || 100) / 100;

    // Draw background if enabled
    if (element.backgroundEnabled && element.backgroundColor) {
      const metrics = ctx.measureText(element.text);
      const padding = scaledFontSize * 0.2;
      ctx.fillStyle = element.backgroundColor;
      ctx.fillRect(
        -metrics.width / 2 - padding,
        -scaledFontSize / 2 - padding,
        metrics.width + padding * 2,
        scaledFontSize + padding * 2
      );
    }

    // Set shadow if enabled
    if (element.shadow) {
      ctx.shadowColor = element.shadowColor || "rgba(0,0,0,0.5)";
      ctx.shadowBlur = (element.shadowBlur || 10) * scaleFactor;
      ctx.shadowOffsetX = 2 * scaleFactor;
      ctx.shadowOffsetY = 2 * scaleFactor;
    }

    // Set text color
    ctx.fillStyle = element.color;

    // Draw text
    const maxWidth = ((element.maxWidth || 80) / 100) * canvasWidth;
    ctx.fillText(element.text, 0, 0, maxWidth);

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

    toast.success("Thumbnail saved successfully");
  };

  const handleApplyText = () => {
    updateFinalPreview()
    toast.success("Text applied to thumbnail")
  }

  const handleUpdateTextElements = (updatedElements: TextElement[]) => {
    setTextElements(updatedElements)
    // The useEffect will trigger updateFinalPreview
  }

  const toggleAutoSnap = (enabled: boolean) => {
    if (enabled) {
      if (!autoSnapInterval) {
        setAutoSnapInterval(5) // Default to 5 seconds
      }
      toast.success(`Auto snapshot enabled (every ${autoSnapInterval} seconds)`)
    } else {
      setAutoSnapInterval(null)
      if (autoSnapIntervalRef.current) {
        clearInterval(autoSnapIntervalRef.current)
        autoSnapIntervalRef.current = null
      }
      toast.info("Auto snapshot disabled")
    }
  }

  const handleSaveBackgroundRemoved = () => {
    if (!processedFrame) {
      toast.error("No frame selected")
      return
    }

    const link = document.createElement("a")
    link.href = processedFrame
    link.download = `background-removed-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Image saved successfully")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const video = videoRef.current;
    if (!video) return;

    // Clean up old URL if exists
    if (video.src && video.src.startsWith('blob:')) {
      URL.revokeObjectURL(video.src);
    }

    // For local files, we can use blob URLs
    const blobUrl = URL.createObjectURL(file);
    video.src = blobUrl;
    video.setAttribute('crossOrigin', 'anonymous');
    video.load();
  };

  const handleURLLoad = () => {
    const urlInput = document.getElementById("imageUrl") as HTMLInputElement;
    const url = urlInput.value.trim();

    if (!url) {
      toast.error("Please enter a video URL");
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Clean up old URL if exists
    if (video.src && video.src.startsWith('blob:')) {
      URL.revokeObjectURL(video.src);
    }

    // For remote URLs, ensure CORS is set
    video.setAttribute('crossOrigin', 'anonymous');
    video.src = url;
    video.load();
  };

  const handleTabChange = (newTab: string) => {
    // Allow access to video and snapshots tabs without restrictions
    if (newTab === "video" || newTab === "snapshots") {
      setActiveTab(newTab);
      return;
    }

    // For edit tab, require a selected snapshot
    if (newTab === "edit") {
      if (selectedSnapshotIndex === -1) {
        toast.error("Please select a snapshot first");
        return;
      }
      setActiveTab(newTab);
      return;
    }

    // Strictly prevent moving to text tab without background removal
    if (newTab === "text") {
      // Check if we're coming from edit tab
      if (activeTab === "edit") {
        if (!processedImageSrc) {
          toast.error("You must remove the background before proceeding to text editing");
          return;
        }
        // Double check that the background was actually removed
        if (!processedImageSrc.includes('data:image/png;base64')) {
          toast.error("Background removal is required before proceeding to text editing");
          return;
        }
      } else {
        // For other tabs, still require background removal
        if (!processedImageSrc) {
          toast.error("Please remove background before adding text");
          return;
        }
      }
      setActiveTab(newTab);
      return;
    }

    // For preview tab, require background removal
    if (newTab === "preview") {
      if (!processedImageSrc) {
        toast.error("Please remove background first to see the preview");
        return;
      }
      setActiveTab(newTab);
      return;
    }

    setActiveTab(newTab);
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-muted text-muted-foreground h-auto items-center justify-center rounded-lg p-[3px] grid min-w-fit w-full grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2 overflow-x-auto">
          <TabsTrigger 
            value="video" 
            className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
          >
            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
            <span>Video</span>
          </TabsTrigger>
          <TabsTrigger 
            value="snapshots"
            className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
          >
            <Layers className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
            <span>Snapshots ({snapshots.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
            disabled={selectedSnapshotIndex === -1}
          >
            <Palette className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
            <span>Edit</span>
          </TabsTrigger>
          <TabsTrigger 
            value="text" 
            className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
            disabled={!processedImageSrc}
          >
            <Type className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger 
            value="preview" 
            className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
            disabled={!processedImageSrc}
          >
            <ImageIcon className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
            <span>Final Preview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4 sm:space-y-6 mt-4">
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
        </TabsContent>

        <TabsContent value="snapshots" className="space-y-4 sm:space-y-6 mt-4">
          <SnapshotsSection
            snapshots={snapshots}
            selectedSnapshotIndex={selectedSnapshotIndex}
            handleSelectSnapshot={handleSelectSnapshot}
            handleSaveSnapshot={handleSaveSnapshot}
            handleDeleteSnapshot={handleDeleteSnapshot}
            handleSaveAllSnapshots={handleSaveAllSnapshots}
            setSnapshots={setSnapshots}
            setSelectedSnapshotIndex={setSelectedSnapshotIndex}
            setProcessedFrame={setProcessedFrame}
            setProcessedImageSrc={setProcessedImageSrc}
            toast={toast}
          />
        </TabsContent>

        <TabsContent value="edit" className="space-y-4 sm:space-y-6 mt-4">
          <EditSection
            processedFrame={processedFrame}
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
            imageInfo={videoInfo}
            imageLoaded={videoLoaded}
            processedImageSrc={processedImageSrc}
            isProcessing={isProcessing}
            isCreatingThumbnail={isCreatingThumbnail}
            setProcessedImageSrc={setProcessedImageSrc}
            setIsProcessing={setIsProcessing}
            setUndoStack={setUndoStack}
            setRedoStack={setRedoStack}
            setProcessingProgress={setProcessingProgress}
            handleRemoveBackground={handleRemoveBackground}
            snapshots={snapshots}
            selectedSnapshotIndex={selectedSnapshotIndex}
          />
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <TextSection
            isCreatingThumbnail={isCreatingThumbnail}
            processedImageSrc={processedImageSrc}
            textElements={textElements}
            setTextElements={setTextElements}
            handleCreateThumbnail={handleCreateThumbnail}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4 sm:space-y-6 mt-4">
          <FinalPreviewSection
            finalThumbnail={finalThumbnail}
            videoInfo={videoInfo}
            handleSaveFinalThumbnail={handleSaveFinalThumbnail}
            processedImageSrc={processedImageSrc}
            textElements={textElements}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
