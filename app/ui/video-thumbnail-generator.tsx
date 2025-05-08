"use client"

import { useState, useRef, useEffect } from "react"
import { VideoPlayer } from "@/app/ui/video-player"
import DropZone from "@/app/ui/drop-zone"
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
import TextEditor from "./text-editor"

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

  const handleMetadataLoaded = (info: VideoInfo) => {
    setVideoInfo(info)
    setVideoLoaded(true)
    toast.success("Video loaded", {
      description: `${info.width}x${info.height}, ${formatDuration(info.duration)}`,
    })
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleTimeUpdate = (currentTime: number) => {
    setVideoInfo((prev) => ({
      ...prev!,
      currentTime,
    }))

    if (videoRef.current) {
      const video = videoRef.current
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        setCurrentFrame(canvas.toDataURL("image/png"))
      }
    }
  }

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

  const captureSnapshot = () => {
    if (!currentFrame) return

    setSnapshots((prev) => [...prev, currentFrame])
    toast.success("Snapshot taken")
  }

  const handleSnapshot = (imageData: string) => {
    setSnapshots((prev) => [...prev, imageData])
    toast.success("Snapshot taken")
  }

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
    setSelectedSnapshotIndex(index)
    setProcessedFrame(snapshots[index])
    setActiveTab("edit")
  }

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
      toast.error("No frame selected")
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      // This would be handled by your BackgroundRemovalProcessor component
      // For now, we'll just simulate the process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setProcessingProgress(i)
      }

      // Simulate background removal by adding a placeholder
      // In a real implementation, you would use the actual processed image
      const img = new Image()
      img.src = processedFrame
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (ctx) {
          // Save current state to undo stack
          setUndoStack((prev) => [...prev, processedFrame!])
          setRedoStack([]) // Clear redo stack on new action

          // Apply the current filters to the image
          applyFilters(ctx)
          ctx.drawImage(img, 0, 0)

          // In a real implementation, this would be the result of background removal
          const processedImageUrl = canvas.toDataURL("image/png")
          setProcessedFrame(processedImageUrl)
          toast.success("Background removed")
        }
      }
    } catch (error) {
      console.error("Error removing background:", error)
      toast.error("Failed to remove background")
    } finally {
      setIsProcessing(false)
    }
  }

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
      toast.error("No frame selected")
      return
    }

    // Save current state to undo stack
    setUndoStack((prev) => [...prev, processedFrame])
    setRedoStack([]) // Clear redo stack on new action

    const img = new Image()
    img.src = processedFrame
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (ctx) {
        applyFilters(ctx)
        ctx.drawImage(img, 0, 0)
        const filteredImageUrl = canvas.toDataURL("image/png")
        setProcessedFrame(filteredImageUrl)
        toast.success("Filters applied")
      }
    }
  }

  const handleCreateThumbnail = () => {
    if (!processedFrame) {
      toast.error("No frame selected")
      return
    }

    setShowTextEditor(true)
    setActiveTab("text")
    updateFinalPreview()
    toast.success("Ready to add text")
  }

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
    if (!processedFrame || !finalCanvasRef.current) return

    const canvas = finalCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Load the processed image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = processedFrame
    img.onload = () => {
      // Set canvas dimensions based on the image
      canvas.width = img.width
      canvas.height = img.height

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the processed image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw all text elements
      textElements.forEach((element) => {
        if (!element.visible) return

        // Save context state
        ctx.save()

        // Calculate position
        const position = calculatePosition(element, canvas.width, canvas.height)
        ctx.translate(position.x, position.y)

        // Apply rotation
        if (element.rotation !== 0) {
          ctx.rotate((element.rotation * Math.PI) / 180)
        }

        // Set font properties
        let fontStyle = ""
        if (element.bold) fontStyle += "bold "
        if (element.italic) fontStyle += "italic "
        const scaleFactor = Math.min(canvas.width, canvas.height) / 1000
        const scaledFontSize = element.fontSize * scaleFactor * 2
        fontStyle += `${scaledFontSize}px ${element.fontFamily}`
        ctx.font = fontStyle

        // Set text alignment
        ctx.textAlign = (element.textAlign as CanvasTextAlign) || "center"
        ctx.textBaseline = "middle"

        // Set opacity
        ctx.globalAlpha = (element.opacity || 100) / 100

        // Draw background rectangle if enabled
        if (element.backgroundEnabled && element.backgroundColor) {
          const metrics = ctx.measureText(element.text)
          const textHeight = scaledFontSize * 1.2
          const rectWidth = Math.min(metrics.width, ((element.maxWidth ?? 80) / 100) * canvas.width)
          let rectX = 0
          if (ctx.textAlign === "center") rectX = -rectWidth / 2
          if (ctx.textAlign === "right") rectX = -rectWidth
          let rectY = 0
          if (ctx.textBaseline === "middle") rectY = -textHeight / 2
          if (ctx.textBaseline === "bottom") rectY = -textHeight
          ctx.save()
          ctx.shadowColor = "transparent"
          ctx.fillStyle = element.backgroundColor
          ctx.fillRect(rectX, rectY, rectWidth, textHeight)
          ctx.restore()
        }

        // Set shadow if enabled
        if (element.shadow) {
          ctx.shadowColor = element.shadowColor || "rgba(0,0,0,0.5)"
          ctx.shadowBlur = (element.shadowBlur ?? 10) * scaleFactor
          ctx.shadowOffsetX = 2 * scaleFactor
          ctx.shadowOffsetY = 2 * scaleFactor
        } else {
          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
        }

        // Set text color
        ctx.fillStyle = element.color

        // Draw curved text if enabled
        if (element.curve) {
          const text = element.text
          const radius = Math.max(80, scaledFontSize * 2)
          const angleStep = Math.PI / (text.length + 1)
          const startAngle = -Math.PI / 2 - (angleStep * (text.length - 1)) / 2
          for (let i = 0; i < text.length; i++) {
            const char = text[i]
            ctx.save()
            ctx.rotate(startAngle + i * angleStep)
            ctx.translate(0, -radius)
            ctx.fillText(char, 0, 0)
            ctx.restore()
          }
        } else {
          // Draw regular text
          const maxWidth = ((element.maxWidth ?? 80) / 100) * canvas.width
          ctx.fillText(element.text, 0, 0, maxWidth)

          // Draw underline if enabled
          if (element.underline) {
            const textMetrics = ctx.measureText(element.text)
            const underlineY = element.fontSize * 0.15 * scaleFactor
            ctx.lineWidth = element.fontSize * 0.05 * scaleFactor
            ctx.beginPath()
            ctx.moveTo(-textMetrics.width / 2, underlineY)
            ctx.lineTo(textMetrics.width / 2, underlineY)
            ctx.stroke()
          }
        }

        // Restore context state
        ctx.restore()
      })

      // Update the final thumbnail
      const finalImageUrl = canvas.toDataURL("image/png")
      setFinalThumbnail(finalImageUrl)
    }
  }

  const handleSaveFinalThumbnail = () => {
    if (!finalThumbnail) {
      toast.error("No thumbnail to save")
      return
    }

    const link = document.createElement("a")
    link.href = finalThumbnail
    link.download = `thumbnail-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Thumbnail saved")
  }

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

  return (
    <div className="container mx-auto py-6 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Video</span>
          </TabsTrigger>
          <TabsTrigger value="snapshots" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Snapshots ({snapshots.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="flex items-center gap-2"
            disabled={selectedSnapshotIndex === -1 && !currentFrame}
          >
            <Palette className="h-4 w-4" />
            <span>Edit</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2" disabled={!processedFrame}>
            <Type className="h-4 w-4" />
            <span>Text</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <VideoPlayer
            videoRef={videoRef}
            videoLoaded={videoLoaded}
            videoInfo={videoInfo}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onMetadataLoaded={handleMetadataLoaded}
            onTimeUpdate={handleTimeUpdate}
            onSnapshot={handleSnapshot}
          />

              <Card>
                <CardHeader>
                  <CardTitle>Snapshot Controls</CardTitle>
                  <CardDescription>Capture frames from the video</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button onClick={captureSnapshot} disabled={!currentFrame}>
                        Capture Current Frame
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (videoRef.current) {
                            const video = videoRef.current
                            // Take snapshots at 0%, 25%, 50%, 75%, and 100% of the video
                            const duration = video.duration
                            const times = [0, 0.25, 0.5, 0.75, 1].map((percent) => percent * duration)

                            // Pause the video
                            const wasPlaying = !video.paused
                            video.pause()

                            // Take snapshots at each time
                            let timeIndex = 0
                            const takeSnapshots = () => {
                              if (timeIndex < times.length) {
                                video.currentTime = times[timeIndex]
                                setTimeout(() => {
                                  captureSnapshot()
                                  timeIndex++
                                  takeSnapshots()
                                }, 500) // Wait for the frame to load
                              } else if (wasPlaying) {
                                // Resume playback if it was playing
                                video.play()
                              }
                            }

                            takeSnapshots()
                            toast.success("Taking snapshots at key points")
                          }
                        }}
                        disabled={!videoLoaded}
                      >
                        Auto Capture Key Frames
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-snap"
                        checked={!!autoSnapInterval}
                        onCheckedChange={toggleAutoSnap}
                        disabled={!videoLoaded}
                      />
                      <Label htmlFor="auto-snap">Auto Snapshot</Label>
                    </div>

                    {autoSnapInterval && (
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="interval">Every</Label>
                        <Select
                          value={autoSnapInterval.toString()}
                          onValueChange={(value) => setAutoSnapInterval(Number(value))}
                        >
                          <SelectTrigger className="w-24">
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

            <div className="space-y-6">
              <DropZone />

              {currentFrame && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Frame</CardTitle>
                    <CardDescription>
                      {videoInfo
                        ? `Time: ${formatDuration(videoInfo.currentTime)} / ${formatDuration(videoInfo.duration)}`
                        : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video">
                      <img
                        src={currentFrame || "/placeholder.svg"}
                        alt="Current frame"
                        className="object-contain rounded-md w-full h-full"
                        style={{
                          position: 'absolute',
                          inset: 0
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={captureSnapshot}>
                      Add to Snapshots
                    </Button>
                    <Button
                      onClick={() => {
                        if (currentFrame) {
                          setProcessedFrame(currentFrame)
                          setSelectedSnapshotIndex(-1) // Not from snapshots
                          setActiveTab("edit")
                        }
                      }}
                    >
                      Edit This Frame
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="snapshots" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Snapshots</CardTitle>
                <CardDescription>Select a snapshot to edit</CardDescription>
              </CardHeader>
              <CardContent>
              {snapshots.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {snapshots.map((snapshot, index) => (
                    <div 
                      key={index} 
                      className={`relative aspect-video cursor-pointer border-2 rounded-md overflow-hidden ${
                        selectedSnapshotIndex === index ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => handleSelectSnapshot(index)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", snapshot)
                        e.dataTransfer.effectAllowed = "copy"
                      }}
                    >
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                            className="bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSaveSnapshot(index)
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="bg-white/80 hover:bg-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSnapshot(index)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                      </Button>
                        </div>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No snapshots yet. Capture frames from the video first.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setSnapshots([])
                  setSelectedSnapshotIndex(-1)
                  setProcessedFrame(null)
                  toast.success("All snapshots cleared")
                }}
                disabled={snapshots.length === 0}
              >
                Clear All
              </Button>
                    <Button
                onClick={handleSaveAllSnapshots}
                disabled={snapshots.length === 0}
                      variant="default"
                className="flex items-center gap-2"
                    >
                <Download className="h-4 w-4" />
                      Save All Snapshots
                    </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Edit Frame</CardTitle>
                <CardDescription>
                  {selectedSnapshotIndex >= 0
                    ? `Editing snapshot #${selectedSnapshotIndex + 1}`
                    : "Editing current frame"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                  {processedFrame ? (
                    <div className="relative w-full h-full">
                      <img
                        src={processedFrame || "/placeholder.svg"}
                        alt="Processed frame"
                        className="object-contain w-full h-full"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          transform: `scale(${zoomLevel / 100})`,
                          filter: `
                            brightness(${imageFilters.brightness}%) 
                            contrast(${imageFilters.contrast}%) 
                            saturate(${imageFilters.saturation}%) 
                            blur(${imageFilters.blur}px) 
                            hue-rotate(${imageFilters.hueRotate}deg)
                            grayscale(${imageFilters.grayscale}%)
                            sepia(${imageFilters.sepia}%)
                          `
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">No frame selected</p>
                    </div>
                  )}
                </div>

                {processedFrame && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                        disabled={zoomLevel <= 50}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{zoomLevel}%</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                        disabled={zoomLevel >= 200}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setZoomLevel(100)}
                        disabled={zoomLevel === 100}
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                  <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setZoomLevel(50)}
                        disabled={zoomLevel === 50}
                      >
                        <Minimize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleUndo} disabled={undoStack.length === 0}>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleRedo} disabled={redoStack.length === 0}>
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleCreateThumbnail} disabled={!processedFrame}>
                  Continue to Text Editor
                </Button>
              </CardFooter>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Image Filters</CardTitle>
                <CardDescription>Adjust image appearance with filters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="brightness">Brightness ({imageFilters.brightness}%)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFilters({ ...imageFilters, brightness: 100 })}
                        disabled={imageFilters.brightness === 100}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="brightness"
                      min={0}
                      max={200}
                      step={1}
                      value={[imageFilters.brightness]}
                      onValueChange={(value) => setImageFilters({ ...imageFilters, brightness: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contrast">Contrast ({imageFilters.contrast}%)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFilters({ ...imageFilters, contrast: 100 })}
                        disabled={imageFilters.contrast === 100}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="contrast"
                      min={0}
                      max={200}
                      step={1}
                      value={[imageFilters.contrast]}
                      onValueChange={(value) => setImageFilters({ ...imageFilters, contrast: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="saturation">Saturation ({imageFilters.saturation}%)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFilters({ ...imageFilters, saturation: 100 })}
                        disabled={imageFilters.saturation === 100}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="saturation"
                      min={0}
                      max={200}
                      step={1}
                      value={[imageFilters.saturation]}
                      onValueChange={(value) => setImageFilters({ ...imageFilters, saturation: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="blur">Blur ({imageFilters.blur}px)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFilters({ ...imageFilters, blur: 0 })}
                        disabled={imageFilters.blur === 0}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="blur"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[imageFilters.blur]}
                      onValueChange={(value) => setImageFilters({ ...imageFilters, blur: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hueRotate">Hue Rotate ({imageFilters.hueRotate}°)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFilters({ ...imageFilters, hueRotate: 0 })}
                        disabled={imageFilters.hueRotate === 0}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="hueRotate"
                      min={0}
                      max={360}
                      step={1}
                      value={[imageFilters.hueRotate]}
                      onValueChange={(value) => setImageFilters({ ...imageFilters, hueRotate: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="grayscale">Grayscale ({imageFilters.grayscale}%)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFilters({ ...imageFilters, grayscale: 0 })}
                        disabled={imageFilters.grayscale === 0}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="grayscale"
                      min={0}
                      max={100}
                      step={1}
                      value={[imageFilters.grayscale]}
                      onValueChange={(value) => setImageFilters({ ...imageFilters, grayscale: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sepia">Sepia ({imageFilters.sepia}%)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFilters({ ...imageFilters, sepia: 0 })}
                        disabled={imageFilters.sepia === 0}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="sepia"
                      min={0}
                      max={100}
                      step={1}
                      value={[imageFilters.sepia]}
                      onValueChange={(value) => setImageFilters({ ...imageFilters, sepia: value[0] })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Filter Presets</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => applyPresetFilter("grayscale")}>
                      Grayscale
                    </Button>
                    <Button variant="outline" onClick={() => applyPresetFilter("sepia")}>
                      Sepia
                    </Button>
                    <Button variant="outline" onClick={() => applyPresetFilter("vivid")}>
                      Vivid
                    </Button>
                    <Button variant="outline" onClick={() => applyPresetFilter("cool")}>
                      Cool
                    </Button>
                    <Button variant="outline" onClick={() => applyPresetFilter("warm")}>
                      Warm
                    </Button>
                    <Button variant="outline" onClick={resetFilters}>
                      <RotateCw className="h-4 w-4 mr-2" />
                      Reset All
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleApplyFilters} disabled={!processedFrame}>
                  Apply Filters
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Background Removal</CardTitle>
              <CardDescription>Remove the background from your image</CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${processingProgress}%` }}></div>
                  </div>
                  <p className="text-sm text-muted-foreground">Processing... {processingProgress}%</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center mb-4">
                    Remove the background from your image to create a professional thumbnail.
                  </p>
                  <Button onClick={handleRemoveBackground} disabled={!processedFrame}>
                    Remove Background
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <TextEditor
            onApply={handleApplyText}
            isCreatingThumbnail={false}
            processedImageSrc={processedFrame}
            textElements={textElements}
            onTextElementsChange={handleUpdateTextElements}
          />

          <Card>
            <CardHeader>
              <CardTitle>Final Preview</CardTitle>
              <CardDescription>Your thumbnail with text overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                {processedFrame ? (
                  <>
                    <canvas ref={finalCanvasRef} className="hidden" />
                    <img
                      src={finalThumbnail || processedFrame}
                      alt="Final thumbnail"
                      className="object-contain rounded-md"
                      style={{
                        position: 'absolute',
                        inset: 0
                      }}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No frame selected</p>
                  </div>
          )}
        </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveFinalThumbnail} disabled={!finalThumbnail} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Thumbnail
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
