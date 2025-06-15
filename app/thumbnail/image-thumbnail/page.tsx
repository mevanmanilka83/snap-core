"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  UploadIcon,
 
  Download,
  Type,
  RotateCw,
  
  Layers,
  Palette,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
} from "lucide-react"
import * as backgroundRemoval from "@imgly/background-removal"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import TextEditor from "@/app/shared/text-editor"


interface ImageInfo {
  width: number
  height: number
  type: string
  size: number
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
  layerOrder?: "back" | "front"
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

export default function ImageUploader() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageSrc, setImageSrc] = useState<string>("")
  const [processedImageSrc, setProcessedImageSrc] = useState<string>("")
  const [thumbnailSrc, setThumbnailSrc] = useState<string>("")
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCreatingThumbnail, setIsCreatingThumbnail] = useState(false)
  const [activeTab, setActiveTab] = useState("file")
  const [activeEditorTab, setActiveEditorTab] = useState("text")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [imageFilters, setImageFilters] = useState<ImageFilter>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
  })
  const [showUpdateToast, setShowUpdateToast] = useState(false)

  const hiddenImageRef = useRef<HTMLImageElement>(null)
  const previewUrl = useRef<string | null>(null)
  const processedUrl = useRef<string | null>(null)
  const thumbnailUrl = useRef<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pendingThumbnailUpdate = useRef<NodeJS.Timeout | null>(null)

  // Default text element
  const defaultTextElement: TextElement = {
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
    layerOrder: "back",
  }

  // Text editing states
  const [textElements, setTextElements] = useState<TextElement[]>([{ ...defaultTextElement }])

  useEffect(() => {
    return () => {
      // Clean up blob URLs on unmount
      if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl.current)
      }
      if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(processedUrl.current)
      }
      if (thumbnailUrl.current && thumbnailUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailUrl.current)
      }

      // Clear any pending thumbnail updates
      if (pendingThumbnailUpdate.current) {
        clearTimeout(pendingThumbnailUpdate.current)
      }
    }
  }, [])

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")
    setHasAttemptedLoad(true)
    setIsLoading(true)

    if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.current)
    }

    previewUrl.current = URL.createObjectURL(file)

    setImageSrc(previewUrl.current)
    setProcessedImageSrc("") // Clear processed image
    setThumbnailSrc("") // Clear thumbnail
    resetFilters() // Reset filters for new image

    const img = hiddenImageRef.current
    if (img) {
      img.src = previewUrl.current
    }

    setImageLoaded(false)

    setImageInfo({
      width: 0,
      height: 0,
      type: file.type,
      size: file.size,
    })

    // Clear undo/redo stacks for new image
    setUndoStack([])
    setRedoStack([])
  }

  const handleURLLoad = () => {
    const urlInput = document.getElementById("imageUrl") as HTMLInputElement
    const url = urlInput.value.trim()

    if (!url) {
      setError("Please enter an image URL")
      toast.error("Please enter an image URL")
      return
    }

    setError("")
    setIsLoading(true)
    setHasAttemptedLoad(true)

    if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.current)
      previewUrl.current = null
    }

    previewUrl.current = url
    setImageSrc(url)
    setProcessedImageSrc("") // Clear processed image
    setThumbnailSrc("") // Clear thumbnail
    resetFilters() // Reset filters for new image

    const img = hiddenImageRef.current
    if (img) {
      img.src = url
    }

    setImageLoaded(false)

    // Clear undo/redo stacks for new image
    setUndoStack([])
    setRedoStack([])
  }

  const handleImageLoaded = () => {
    const img = hiddenImageRef.current
    if (!img) return

    setImageInfo({
      width: img.naturalWidth,
      height: img.naturalHeight,
      type: img.src.split(".").pop()?.toUpperCase() || "UNKNOWN",
      size: 0,
    })

    setImageLoaded(true)
    setIsLoading(false)

    // Draw the image to canvas after loading
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const handleImageError = () => {
    if (hasAttemptedLoad) {
      setError("Failed to load image. Please check the URL or file and try again.")
    }
    setImageLoaded(false)
    setIsLoading(false)
    setImageSrc("")
    setProcessedImageSrc("")
    setThumbnailSrc("")
  }

  const handleCancel = () => {
    if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.current)
    }
    if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(processedUrl.current)
    }
    if (thumbnailUrl.current && thumbnailUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailUrl.current)
    }

    previewUrl.current = null
    processedUrl.current = null
    thumbnailUrl.current = null
    setImageInfo(null)
    setImageLoaded(false)
    setError("")
    setHasAttemptedLoad(false)
    setImageSrc("")
    setProcessedImageSrc("")
    setThumbnailSrc("")
    resetFilters()

    const img = hiddenImageRef.current
    if (img) {
      img.src = ""
    }

    const urlInput = document.getElementById("imageUrl") as HTMLInputElement
    if (urlInput) {
      urlInput.value = ""
    }

    // Clear canvas
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    // Clear undo/redo stacks
    setUndoStack([])
    setRedoStack([])
  }

  const handleTabChange = (newTab: string) => {
    // For edit tab, require an image to be loaded
    if (newTab === "edit") {
      if (!imageLoaded) {
        toast.error("Please upload an image first");
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

  const handleRemoveBackground = async () => {
    if (!imageLoaded || !previewUrl.current) {
      setError("Please select an image first")
      toast.error("Please select an image first")
      return
    }

    try {
      setIsProcessing(true)
      setThumbnailSrc("") // Clear any existing thumbnail

      // Save current state to undo stack
      if (processedImageSrc) {
        setUndoStack((prev) => [...prev, processedImageSrc])
        setRedoStack([]) // Clear redo stack on new action
      }

      // Use the current image source as input
      const image_src = previewUrl.current

      // Process the image with imgly background removal
      const blob = await backgroundRemoval.removeBackground(image_src, {
        progress: () => {
          // Update progress state
        },
      })
      
      // Create a URL from the resulting blob
      const processedImageUrl = URL.createObjectURL(blob)
      
      // Clean up old URL if it exists
      if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(processedUrl.current)
      }
      
      // Save the transparent background image URL
      processedUrl.current = processedImageUrl
      setProcessedImageSrc(processedImageUrl)
      
      // Automatically switch to text tab after successful background removal
      setActiveEditorTab("text")
      
      // Create thumbnail immediately after background removal
      handleCreateThumbnail()
      
      toast.success("Background removed successfully", {
        id: "background-removed-success"
      })
    } catch (err) {
      console.error("Error removing background:", err)
      toast.error("Failed to remove background", {
        id: "background-removed-error"
      })
      setError("Failed to remove background. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUndo = () => {
    if (undoStack.length === 0) {
      toast.info("Nothing to undo")
      return
    }

    // Save current state to redo stack
    setRedoStack((prev) => [...prev, processedImageSrc])

    // Get the last state from undo stack
    const lastState = undoStack[undoStack.length - 1]
    setProcessedImageSrc(lastState)

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
    setUndoStack((prev) => [...prev, processedImageSrc])

    // Get the last state from redo stack
    const lastState = redoStack[redoStack.length - 1]
    setProcessedImageSrc(lastState)

    // Remove the last state from redo stack
    setRedoStack((prev) => prev.slice(0, -1))

    toast.info("Redo successful")
  }

  const handleCreateThumbnail = () => {
    if (!processedImageSrc) {
      toast.error("Please remove background first to see the preview", {
        id: "no-background-error"
      });
      return;
    }

    setIsCreatingThumbnail(true);
    createThumbnail(processedImageSrc);
    toast.success("Thumbnail updated", {
      id: "thumbnail-updated-success"
    });
  };

  const handleSaveBackgroundRemoved = () => {
    if (!processedImageSrc) return

    const link = document.createElement("a")
    link.href = processedImageSrc
    link.download = `background-removed-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Image saved successfully")
  }

  const handleSaveThumbnail = () => {
    if (!thumbnailSrc) {
      toast.error("No thumbnail to save")
      return
    }

    const link = document.createElement("a")
    link.href = thumbnailSrc
    link.download = `thumbnail-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Thumbnail saved successfully")
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
      // center is the default, already calculated
    }

    return { x, y }
  }

  // Separate function to create thumbnail with background and text
  const createThumbnail = (transparentImageUrl: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsCreatingThumbnail(true)

    // Create a new image for the background (use original image)
    const bgImg = new window.Image()
    bgImg.crossOrigin = "anonymous"

    // Create the foreground image with transparent background
    const fgImg = new window.Image()
    fgImg.crossOrigin = "anonymous"

    // Set up error handling for both images
    const handleImageError = () => {
      setIsCreatingThumbnail(false)
      toast.error("Failed to load image for thumbnail")
    }

    bgImg.onerror = handleImageError
    fgImg.onerror = handleImageError

    bgImg.onload = () => {
      // Set canvas dimensions based on the original image size
      canvas.width = bgImg.width
      canvas.height = bgImg.height

      // Draw background image with filters
      applyFilters(ctx)
      ctx.drawImage(bgImg, 0, 0)
      ctx.filter = "none" // Reset filters for text

      // Draw text elements that should be behind the image
      textElements
        .filter((element) => element.visible && element.layerOrder === "back")
        .forEach((element) => {
          ctx.save()
          const position = calculatePosition(element, canvas.width, canvas.height)
          ctx.translate(position.x, position.y)
          if (element.rotation !== 0) {
            ctx.rotate((element.rotation * Math.PI) / 180)
          }
          const scaleFactor = Math.min(canvas.width, canvas.height) / 1000
          const scaledFontSize = element.fontSize * scaleFactor * 2

          // Set font style
          let fontStyle = ""
          if (element.bold) fontStyle += "bold "
          if (element.italic) fontStyle += "italic "
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
            const baseline = ctx.textBaseline as CanvasTextBaseline
            if (baseline === "middle") rectY = -textHeight / 2
            if (baseline === "bottom") rectY = -textHeight
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

          ctx.restore()
        })

      // Draw foreground image
      fgImg.onload = () => {
        // Clear canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background image with filters
        applyFilters(ctx)
        ctx.drawImage(bgImg, 0, 0)
        ctx.filter = "none" // Reset filters for text

        // Draw text elements that should be behind the image
        textElements
          .filter((element) => element.visible && element.layerOrder === "back")
          .forEach((element) => {
            ctx.save()
            const position = calculatePosition(element, canvas.width, canvas.height)
            ctx.translate(position.x, position.y)
            if (element.rotation !== 0) {
              ctx.rotate((element.rotation * Math.PI) / 180)
            }
            const scaleFactor = Math.min(canvas.width, canvas.height) / 1000
            const scaledFontSize = element.fontSize * scaleFactor * 2

            // Set font style
            let fontStyle = ""
            if (element.bold) fontStyle += "bold "
            if (element.italic) fontStyle += "italic "
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
              const baseline = ctx.textBaseline as CanvasTextBaseline
              if (baseline === "middle") rectY = -textHeight / 2
              if (baseline === "bottom") rectY = -textHeight
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

            ctx.restore()
          })

        // Draw foreground image
        ctx.drawImage(fgImg, 0, 0)

        // Draw text elements that should be in front of the image
        textElements
          .filter((element) => element.visible && element.layerOrder === "front")
          .forEach((element) => {
            ctx.save()
            const position = calculatePosition(element, canvas.width, canvas.height)
            ctx.translate(position.x, position.y)
            if (element.rotation !== 0) {
              ctx.rotate((element.rotation * Math.PI) / 180)
            }
            const scaleFactor = Math.min(canvas.width, canvas.height) / 1000
            const scaledFontSize = element.fontSize * scaleFactor * 2

            // Set font style
            let fontStyle = ""
            if (element.bold) fontStyle += "bold "
            if (element.italic) fontStyle += "italic "
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
              const baseline = ctx.textBaseline as CanvasTextBaseline
              if (baseline === "middle") rectY = -textHeight / 2
              if (baseline === "bottom") rectY = -textHeight
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

            ctx.restore()
          })

        // Convert canvas to data URL and update thumbnail
        const finalImageUrl = canvas.toDataURL("image/png")

        // Revoke old thumbnail URL if it exists
        if (thumbnailUrl.current && thumbnailUrl.current.startsWith("blob:")) {
          URL.revokeObjectURL(thumbnailUrl.current)
        }

        // Update the thumbnail
        thumbnailUrl.current = finalImageUrl
        setThumbnailSrc(finalImageUrl)
        setIsCreatingThumbnail(false)

        if (showUpdateToast) {
          toast.success("Thumbnail updated")
          setShowUpdateToast(false)
        }
      }

      // Load the transparent image
      fgImg.src = transparentImageUrl
    }

    // Load the original image as background
    bgImg.src = imageSrc
  }

  return (
    <div className="space-y-6 w-full">
      <canvas ref={canvasRef} className="hidden" />
      <img
        ref={hiddenImageRef}
        src="/placeholder.svg"
        alt="Hidden for metadata"
        onLoad={handleImageLoaded}
        onError={handleImageError}
        className="hidden"
        crossOrigin="anonymous"
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-muted text-muted-foreground h-auto items-center justify-center rounded-lg p-[3px] grid min-w-fit w-full grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 overflow-x-auto">
          <TabsTrigger 
            value="upload" 
            className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
          >
            <UploadIcon className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger 
            value="edit" 
            className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"
            disabled={!imageLoaded}
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
            <Layers className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
            <span>Final Thumbnail</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-sm md:text-base">Upload Image File</CardTitle>
              <CardDescription className="text-xs md:text-sm">Select an image file from your device or drag and drop</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <label htmlFor="file-upload">
                <div
                  className="flex flex-col items-center justify-center space-y-3 py-6 px-4 md:py-8 md:px-6 border-2 border-gray-300 border-dashed rounded-md transition-colors hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent cursor-pointer"
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.currentTarget.classList.add("border-primary")
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.currentTarget.classList.remove("border-primary")
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.currentTarget.classList.remove("border-primary")
                    
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0]
                      if (file.type.startsWith("image/")) {
                        // Create a synthetic change event
                        const fileInput = document.getElementById("file-upload") as HTMLInputElement
                        if (fileInput) {
                          // Create a DataTransfer object to set files
                          const dataTransfer = new DataTransfer()
                          dataTransfer.items.add(file)
                          fileInput.files = dataTransfer.files
                          
                          // Trigger the change handler
                          const event = new Event("change", { bubbles: true })
                          fileInput.dispatchEvent(event)
                        }
                      } else {
                        toast.error("Please drop an image file")
                      }
                    } else if (e.dataTransfer.getData("text/plain")) {
                      const data = e.dataTransfer.getData("text/plain")
                      if (data.startsWith("data:image")) {
                        setError("")
                        setHasAttemptedLoad(true)
                        setIsLoading(true)

                        if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
                          URL.revokeObjectURL(previewUrl.current)
                        }

                        previewUrl.current = data
                        setImageSrc(data)
                        setProcessedImageSrc("") // Clear processed image
                        setThumbnailSrc("") // Clear thumbnail

                        const img = hiddenImageRef.current
                        if (img) {
                          img.src = data
                        }

                        setImageLoaded(false)
                      }
                    }
                  }}
                >
                  <UploadIcon className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                  <div className="font-medium text-xs md:text-sm text-gray-900 dark:text-gray-50">Drop image here or click to browse</div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </div>
              </label>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-sm md:text-base">Upload from URL</CardTitle>
              <CardDescription className="text-xs md:text-sm">Enter the URL of an image you want to upload</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <Input type="url" placeholder="https://example.com/image.jpg" className="col-span-3 text-xs md:text-sm" id="imageUrl" />
                <Button onClick={handleURLLoad} disabled={isLoading} className="flex-1 text-xs md:text-sm h-8 md:h-9">
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-3 w-3 md:h-4 md:w-4 border-2 border-b-transparent border-white rounded-full"></span>
                      Loading
                    </span>
                  ) : (
                    "Load"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="w-full flex flex-col">
          <CardHeader className="p-4 md:p-6 pb-2">
            <CardTitle className="text-base">Image Preview</CardTitle>
            {error && hasAttemptedLoad && <p className="text-xs md:text-sm text-red-500 mt-1">{error}</p>}
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {imageInfo && imageLoaded && imageInfo.size > 0 && (
              <p className="text-xs md:text-sm text-muted-foreground">File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>
            )}

            <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
              {imageSrc && imageLoaded ? (
                <div className="relative w-full h-full">
                  <img
                    src={imageSrc || "/placeholder.svg"}
                    alt="Preview"
                    className="object-contain w-full h-full"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                      position: "absolute",
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
                      `,
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <>
                  {!isLoading && !error && (
                    <div className="text-center p-4">
                      <UploadIcon className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">No image selected</p>
                    </div>
                  )}
                  {isLoading && (
                    <div className="flex justify-center py-8 md:py-12">
                      <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary"></div>
                    </div>
                  )}
                </>
              )}
            </div>

            {imageLoaded && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                    disabled={zoomLevel <= 50}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs md:text-sm">{zoomLevel}%</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                    disabled={zoomLevel >= 200}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setZoomLevel(100)}
                    disabled={zoomLevel === 100}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setZoomLevel(50)}
                    disabled={zoomLevel === 50}
                  >
                    <Minimize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="items-center [.border-t]:pt-10 flex flex-wrap gap-2 p-4 pt-12 md:p-6">
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleRemoveBackground}
              disabled={!imageLoaded || isProcessing}
              className="flex-1 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                  Processing...
                </span>
              ) : (
                "Remove Background"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full flex flex-col">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base">Background Removal</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Remove the background to proceed with text editing in the image section
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {imageInfo && imageLoaded && imageInfo.size > 0 && (
              <p className="text-xs md:text-sm text-muted-foreground mb-4">File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>
            )}
            <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
              <div className="relative w-full h-full">
                {processedImageSrc ? (
                  <img
                    src={processedImageSrc || "/placeholder.svg"}
                    alt="Background Removed"
                    className="object-contain w-full h-full"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      inset: 0,
                      transform: `scale(${zoomLevel / 100})`,
                    }}
                    crossOrigin="anonymous"
                  />
                ) : isProcessing ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary mb-2 md:mb-4"></div>
                    <p className="text-xs md:text-sm text-gray-500">Removing background...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {imageLoaded ? "Ready to process image" : "Please upload an image"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {processedImageSrc && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleUndo} disabled={undoStack.length === 0} className="h-8 w-8">
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleRedo} disabled={redoStack.length === 0} className="h-8 w-8">
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="items-center [.border-t]:pt-10 flex flex-wrap gap-2 p-4 pt-12 md:p-6 border-t">
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSaveBackgroundRemoved}
              disabled={!processedImageSrc}
              variant="default"
              className="flex-1 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
            >
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs value={activeEditorTab} onValueChange={setActiveEditorTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Type className="h-3 w-3 md:h-4 md:w-4" />
            <span>Text Editor</span>
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Palette className="h-3 w-3 md:h-4 md:w-4" />
            <span>Image Filters</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Layers className="h-3 w-3 md:h-4 md:w-4" />
            <span>Final Thumbnail</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <TextEditor
            onApply={() => {
              setShowUpdateToast(true)
              handleCreateThumbnail()
            }}
            isCreatingThumbnail={isCreatingThumbnail}
            processedImageSrc={processedImageSrc}
            textElements={textElements}
            onTextElementsChange={(elements: TextElement[]) => {
              setTextElements(elements)
            }}
          />
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card className="w-full">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-sm md:text-base">Image Filters</CardTitle>
              <CardDescription className="text-xs md:text-sm">Adjust image appearance with filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4 md:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="brightness" className="text-xs md:text-sm">Brightness ({imageFilters.brightness}%)</Label>
                    <Button 
                      variant="ghost"
                      size="sm" 
                      onClick={() => setImageFilters({ ...imageFilters, brightness: 100 })}
                      disabled={imageFilters.brightness === 100}
                      className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
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
                    <Label htmlFor="contrast" className="text-xs md:text-sm">Contrast ({imageFilters.contrast}%)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImageFilters({ ...imageFilters, contrast: 100 })}
                      disabled={imageFilters.contrast === 100}
                      className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
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
                    <Label htmlFor="saturation" className="text-xs md:text-sm">Saturation ({imageFilters.saturation}%)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImageFilters({ ...imageFilters, saturation: 100 })}
                      disabled={imageFilters.saturation === 100}
                      className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
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
                    <Label htmlFor="blur" className="text-xs md:text-sm">Blur ({imageFilters.blur}px)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImageFilters({ ...imageFilters, blur: 0 })}
                      disabled={imageFilters.blur === 0}
                      className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
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
                    <Label htmlFor="hueRotate" className="text-xs md:text-sm">Hue Rotate ({imageFilters.hueRotate}°)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImageFilters({ ...imageFilters, hueRotate: 0 })}
                      disabled={imageFilters.hueRotate === 0}
                      className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
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
                    <Label htmlFor="grayscale" className="text-xs md:text-sm">Grayscale ({imageFilters.grayscale}%)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImageFilters({ ...imageFilters, grayscale: 0 })}
                      disabled={imageFilters.grayscale === 0}
                      className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
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
                    <Label htmlFor="sepia" className="text-xs md:text-sm">Sepia ({imageFilters.sepia}%)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImageFilters({ ...imageFilters, sepia: 0 })}
                      disabled={imageFilters.sepia === 0}
                      className="h-7 w-7 md:h-8 md:w-8 text-xs md:text-sm"
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
                <Label className="text-xs md:text-sm">Filter Presets</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => applyPresetFilter("grayscale")}
                    className="flex-1 text-xs md:text-sm h-8 md:h-9"
                  >
                    Grayscale
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyPresetFilter("sepia")}
                    className="flex-1 text-xs md:text-sm h-8 md:h-9"
                  >
                    Sepia
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyPresetFilter("vivid")}
                    className="flex-1 text-xs md:text-sm h-8 md:h-9"
                  >
                    Vivid
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyPresetFilter("cool")}
                    className="flex-1 text-xs md:text-sm h-8 md:h-9"
                  >
                    Cool
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyPresetFilter("warm")}
                    className="flex-1 text-xs md:text-sm h-8 md:h-9"
                  >
                    Warm
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetFilters} 
                    className="flex-1 text-xs md:text-sm h-8 md:h-9"
                  >
                    <RotateCw className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    Reset All
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-4 md:p-6">
              <Button
                onClick={handleCreateThumbnail}
                disabled={!processedImageSrc || isCreatingThumbnail}
                className="flex-1 text-xs md:text-sm h-8 md:h-9"
              >
                Apply Filters
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="w-full">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-sm md:text-base">Final Thumbnail</CardTitle>
              <CardDescription className="text-xs md:text-sm">Preview your thumbnail with text and effects</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="relative aspect-video bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                <div className="relative w-full h-full">
                  {thumbnailSrc ? (
                    <img
                      src={thumbnailSrc || "/placeholder.svg"}
                      alt="Thumbnail"
                      className="object-contain w-full h-full"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        inset: 0,
                        filter: `
                          brightness(${imageFilters.brightness}%) 
                          contrast(${imageFilters.contrast}%) 
                          saturate(${imageFilters.saturation}%) 
                          blur(${imageFilters.blur}px) 
                          hue-rotate(${imageFilters.hueRotate}deg)
                          grayscale(${imageFilters.grayscale}%)
                          sepia(${imageFilters.sepia}%)
                        `,
                      }}
                      crossOrigin="anonymous"
                    />
                  ) : isCreatingThumbnail ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary mb-2 md:mb-4"></div>
                      <p className="text-xs md:text-sm text-gray-500">Creating thumbnail...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {processedImageSrc
                          ? "Click 'Apply' in the text editor to generate preview"
                          : "Process image first"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-4 md:p-6">
              <Button
                onClick={handleSaveThumbnail}
                disabled={!thumbnailSrc}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs md:text-sm h-8 md:h-9"
              >
                <Download className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Download Thumbnail
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
