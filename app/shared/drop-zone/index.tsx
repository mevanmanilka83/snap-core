"use client"

import React from "react"
import { useRef, useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  UploadIcon,
  Info,
  Download,
  Type,
  RotateCw,
  ImageIcon,
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

interface ImageUploaderProps {
  maxFileSize?: number // in bytes
  allowedFileTypes?: string[]
  initialFilters?: Partial<ImageFilter>
}

// Add error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Something went wrong</h2>
          <p className="text-sm text-red-600 dark:text-red-300 mt-2">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default function ImageUploader({
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  initialFilters,
}: ImageUploaderProps) {
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
  const [processingProgress, setProcessingProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("file")
  const [activeEditorTab, setActiveEditorTab] = useState("text")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [imageFilters, setImageFilters] = useState<ImageFilter>({
    brightness: initialFilters?.brightness ?? 100,
    contrast: initialFilters?.contrast ?? 100,
    saturation: initialFilters?.saturation ?? 100,
    blur: initialFilters?.blur ?? 0,
    hueRotate: initialFilters?.hueRotate ?? 0,
    grayscale: initialFilters?.grayscale ?? 0,
    sepia: initialFilters?.sepia ?? 0,
  })
  const [showUpdateToast, setShowUpdateToast] = useState(false)
  const [isLoadingBackground, setIsLoadingBackground] = useState(false)
  const [isLoadingForeground, setIsLoadingForeground] = useState(false)

  const hiddenImageRef = useRef<HTMLImageElement>(null)
  const previewUrl = useRef<string | null>(null)
  const processedUrl = useRef<string | null>(null)
  const thumbnailUrl = useRef<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pendingThumbnailUpdate = useRef<NodeJS.Timeout | null>(null)

  // Remove unused defaultTextElement since it's only used once in the initial state
  const [textElements, setTextElements] = useState<TextElement[]>([{
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
  }])

  useEffect(() => {
    // Clean up blob URLs
    const cleanup = () => {
      [previewUrl, processedUrl, thumbnailUrl].forEach(url => {
        if (url.current?.startsWith("blob:")) {
          URL.revokeObjectURL(url.current)
        }
      })
      
      // Clear pending updates
      if (pendingThumbnailUpdate.current) {
        clearTimeout(pendingThumbnailUpdate.current)
      }
    }

    // Add event listener for beforeunload
    window.addEventListener("beforeunload", cleanup)

    // Add event listener for visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        cleanup()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Add event listener for error handling
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error)
      toast.error("An unexpected error occurred")
    }
    window.addEventListener("error", handleError)

    return () => {
      cleanup()
      window.removeEventListener("beforeunload", cleanup)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("error", handleError)
    }
  }, [])

  // Apply filters to the image
  const applyFilters = (ctx: CanvasRenderingContext2D) => {
    try {
      const filters = Object.entries(imageFilters)
        .filter(([_, value]) => value !== 0 && value !== 100)
        .map(([key, value]) => {
          switch (key) {
            case "brightness":
            case "contrast":
            case "saturation":
            case "grayscale":
            case "sepia":
              return `${key}(${value}%)`
            case "blur":
              return `${key}(${value}px)`
            case "hueRotate":
              return `${key}(${value}deg)`
            default:
              return ""
          }
        })
        .filter(Boolean)

      ctx.filter = filters.length > 0 ? filters.join(" ") : "none"
    } catch (error) {
      console.error("Error applying filters:", error)
      toast.error("Failed to apply filters")
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
    const presets = {
      grayscale: { grayscale: 100, saturation: 0 },
      sepia: { sepia: 80, saturation: 110, contrast: 110 },
      vivid: { saturation: 150, contrast: 120, brightness: 105 },
      cool: { hueRotate: 180, saturation: 90 },
      warm: { hueRotate: 30, saturation: 120, brightness: 105 },
    }

    if (preset in presets) {
      setImageFilters(prev => ({ ...prev, ...presets[preset as keyof typeof presets] }))
      toast.success(`Applied ${preset} filter`)
    } else {
      resetFilters()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(`Please upload a valid image file (${allowedFileTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')})`)
        return
      }

      // Validate file size
      if (file.size > maxFileSize) {
        toast.error(`File size too large. Maximum size is ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB`)
        return
      }

      setError("")
      setHasAttemptedLoad(true)
      setIsLoading(true)

      // Clean up old URL
      if (previewUrl.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl.current)
      }

      // Create new URL and update state
      previewUrl.current = URL.createObjectURL(file)
      setImageSrc(previewUrl.current)
      setProcessedImageSrc("")
      setThumbnailSrc("")
      setProcessingProgress(0)
      resetFilters()

      // Update image reference
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

      // Clear history
      setUndoStack([])
      setRedoStack([])
    } catch (error) {
      console.error("Error handling file change:", error)
      toast.error("Failed to process the file. Please try again.")
      handleCancel()
    }
  }

  const handleURLLoad = () => {
    try {
      const urlInput = document.getElementById("imageUrl") as HTMLInputElement
      const url = urlInput.value.trim()

      if (!url) {
        toast.error("Please enter an image URL")
        return
      }

      // Validate URL format
      let parsedUrl: URL
      try {
        parsedUrl = new URL(url)
      } catch {
        toast.error("Please enter a valid URL")
        return
      }

      // Silently reject CloudFront URLs
      if (parsedUrl.hostname.includes('cloudfront.net')) {
        setError("Failed to load image. Please try a different URL.")
        toast.error("Failed to load image. Please try a different URL.")
        return
      }

      // Validate URL protocol
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        toast.error("URL must start with http:// or https://")
        return
      }

      // Check for common image URL patterns
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff']
      const hasValidExtension = validExtensions.some(ext => 
        parsedUrl.pathname.toLowerCase().endsWith(ext)
      )

      // Check for common image URL patterns in query parameters
      const hasImageQueryParam = parsedUrl.searchParams.toString().toLowerCase().includes('image') ||
                               parsedUrl.searchParams.toString().toLowerCase().includes('img') ||
                               parsedUrl.searchParams.toString().toLowerCase().includes('photo')

      // Check for common image hosting domains
      const commonImageHosts = [
        'imgur.com', 'images.unsplash.com', 'picsum.photos',
        'amazonaws.com', 'googleusercontent.com', 'fbcdn.net', 'instagram.com',
        'twimg.com', 'cdn.discordapp.com', 'media.giphy.com'
      ]
      const isCommonImageHost = commonImageHosts.some(host => parsedUrl.hostname.includes(host))

      if (!hasValidExtension && !hasImageQueryParam && !isCommonImageHost) {
        toast.error("URL must point to a valid image file or image hosting service")
        return
      }

      setError("")
      setIsLoading(true)
      setHasAttemptedLoad(true)

      // Clean up old URL
      if (previewUrl.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl.current)
        previewUrl.current = null
      }

      // Create a new image to test loading
      const testImg = new window.Image()
      testImg.crossOrigin = "anonymous"
      
      // Set a timeout for the image loading
      const timeoutId = setTimeout(() => {
        testImg.src = "" // Cancel the image loading
        setIsLoading(false)
        setError("Failed to load image. The URL may be invalid or the server may be too slow.")
        toast.error("Failed to load image. Please try a different URL.")
      }, 15000) // 15 second timeout
      
      testImg.onload = () => {
        clearTimeout(timeoutId) // Clear the timeout since image loaded successfully
        
        // Check if the image is actually loaded and not broken
        if (!testImg.complete || testImg.naturalWidth === 0) {
          setIsLoading(false)
          setError("Failed to load image. The image may be inaccessible or the URL may be invalid.")
          toast.error("Failed to load image. Please check the URL and try again.")
          return
        }

        // Validate image dimensions
        const maxDimension = 8192 // Maximum dimension in pixels
        if (testImg.naturalWidth > maxDimension || testImg.naturalHeight > maxDimension) {
          setIsLoading(false)
          setError(`Image dimensions too large. Maximum dimension is ${maxDimension}px`)
          toast.error(`Image dimensions too large. Maximum dimension is ${maxDimension}px`)
          return
        }

        // Update state only after successful load
        previewUrl.current = url
        setImageSrc(url)
        setProcessedImageSrc("")
        setThumbnailSrc("")
        setProcessingProgress(0)
        resetFilters()

        // Update image reference
        const img = hiddenImageRef.current
        if (img) {
          img.src = url
        }

        setImageLoaded(false)
        setUndoStack([])
        setRedoStack([])
      }

      testImg.onerror = () => {
        clearTimeout(timeoutId) // Clear the timeout since we got an error
        setIsLoading(false)
        setError("Failed to load image. The image may be inaccessible or the URL may be invalid.")
        toast.error("Failed to load image. Please try a different URL.")
      }

      // Start loading the test image
      testImg.src = url
    } catch (error) {
      console.error("Error handling URL load:", error)
      toast.error("Failed to load the image. Please try again.")
      handleCancel()
    }
  }

  const handleImageLoaded = () => {
    const img = hiddenImageRef.current
    if (!img) return

    try {
      // Check if the image is actually loaded and not broken
      if (!img.complete || img.naturalWidth === 0) {
        setError("Image failed to load properly")
        toast.error("Image failed to load properly")
        handleCancel()
        return
      }

      // Check for CORS errors
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          ctx.drawImage(img, 0, 0)
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'SecurityError') {
          setError("Cannot load image due to CORS restrictions. Please ensure the image server allows cross-origin requests.")
          toast.error("CORS error: Cannot load image from this source")
          handleCancel()
          return
        }
        throw error
      }

      // Validate image dimensions
      const maxDimension = 4096 // Maximum dimension in pixels
      if (img.naturalWidth > maxDimension || img.naturalHeight > maxDimension) {
        setError(`Image dimensions too large. Maximum dimension is ${maxDimension}px`)
        toast.error(`Image dimensions too large. Maximum dimension is ${maxDimension}px`)
        handleCancel()
        return
      }

      // Validate minimum dimensions
      const minDimension = 100 // Minimum dimension in pixels
      if (img.naturalWidth < minDimension || img.naturalHeight < minDimension) {
        setError(`Image dimensions too small. Minimum dimension is ${minDimension}px`)
        toast.error(`Image dimensions too small. Minimum dimension is ${minDimension}px`)
        handleCancel()
        return
      }

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
          try {
            ctx.drawImage(img, 0, 0)
          } catch (error) {
            console.error("Error drawing image to canvas:", error)
            setError("Failed to process image")
            handleCancel()
          }
        }
      }
    } catch (error) {
      console.error("Error in image loading:", error)
      setError("Failed to process image. Please try again.")
      handleCancel()
    }
  }

  const handleImageError = () => {
    // Only show error if we've actually attempted to load an image
    if (hasAttemptedLoad && imageSrc) {
      setError("Failed to load image. Please check the URL or file and try again.")
      toast.error("Failed to load image. Please try again.")
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
    setProcessingProgress(0)
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

  const handleRemoveBackground = async () => {
    if (!imageSrc) {
      toast.error("No image selected")
      return
    }

    setIsProcessing(true)
    setThumbnailSrc("") // Clear thumbnail

    try {
      // Validate image source before processing
      const img = new Image()
      img.crossOrigin = "anonymous"
      
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Image loading timed out"))
        }, 15000) // 15 second timeout

        img.onload = () => {
          clearTimeout(timeoutId)
          // Verify the image loaded successfully
          if (!img.complete || img.naturalWidth === 0) {
            reject(new Error("Image failed to load properly"))
            return
          }
          resolve(true)
        }
        img.onerror = () => {
          clearTimeout(timeoutId)
          reject(new Error("Failed to load image. Please try again."))
        }
        img.src = imageSrc
      })

      // Show toast once at the start
      toast.info("Removing background...", {
        duration: 2000,
        position: "bottom-right",
      });

      // Save current processed image to undo stack if it exists
      if (processedImageSrc) {
        setUndoStack((prev) => [...prev, processedImageSrc])
        setRedoStack([]) // Clear redo stack
      }

      // Create a new worker with proper error handling
      let worker: Worker | null = null;
      try {
        worker = new Worker(new URL('../workers/background-removal.worker.ts', import.meta.url), {
          type: 'module'
        });
      } catch (error) {
        console.error("Failed to create worker:", error);
        throw new Error("Failed to initialize background removal process");
      }

      // Set up worker message handling with debounced progress updates
      let lastProgressUpdate = 0;
      worker.onmessage = (event) => {
        const { type, data } = event.data

        switch (type) {
          case 'progress':
            // Debounce progress updates to reduce re-renders
            const now = Date.now();
            if (now - lastProgressUpdate > 100) { // Only update every 100ms
            setProcessingProgress(data)
              lastProgressUpdate = now;
            }
            break
          case 'complete':
            if (data) {
              // Validate the blob before creating URL
              if (!(data instanceof Blob)) {
                throw new Error("Invalid image data received from worker")
              }
              
              // Verify the blob is not empty
              if (data.size === 0) {
                throw new Error("Received empty image data from worker")
              }

              // Verify the blob is a valid image
              if (!data.type.startsWith('image/')) {
                throw new Error("Invalid image format received from worker")
              }
              
              const url = URL.createObjectURL(data)
              // Revoke old blob URL if it exists
              if (processedUrl.current && processedUrl.current.startsWith("blob:")) {
                URL.revokeObjectURL(processedUrl.current)
              }
              processedUrl.current = url
              setProcessedImageSrc(url)
              toast.success("Background removed successfully", {
                duration: 2000,
                position: "bottom-right",
              })
            }
            worker?.terminate()
            setIsProcessing(false)
            break
          case 'error':
            console.error("Worker error:", data)
            toast.error(data || "Failed to remove background", {
              duration: 2000,
              position: "bottom-right",
            })
            worker?.terminate()
            setIsProcessing(false)
            break
        }
      }

      // Handle worker errors
      worker.onerror = (error) => {
        console.error("Worker error:", error)
        toast.error("Failed to remove background. Please try again.", {
          duration: 2000,
          position: "bottom-right",
        })
        worker?.terminate()
        setIsProcessing(false)
      }

      // Start the background removal process
      worker.postMessage({ imageSrc })
    } catch (error) {
      console.error("Error removing background:", error)
      toast.error(error instanceof Error ? error.message : "Failed to remove background", {
        duration: 2000,
        position: "bottom-right",
      })
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

  const handleCreateThumbnail = async () => {
    if (!processedImageSrc) {
      toast.error("Please process the image first")
      return
    }

    // Prevent multiple simultaneous thumbnail creation attempts
    if (isCreatingThumbnail) {
      return
    }

    setIsCreatingThumbnail(true)
    
    try {
      // Create a new image for the background
      const bgImg = new window.Image()
      bgImg.crossOrigin = "anonymous"
      
      // Create the foreground image with transparent background
      const fgImg = new window.Image()
      fgImg.crossOrigin = "anonymous"

      // Load background image (original image)
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Background image loading timed out"))
        }, 15000) // 15 second timeout

        bgImg.onload = () => {
          clearTimeout(timeoutId)
          // Verify the image loaded successfully
          if (!bgImg.complete || bgImg.naturalWidth === 0) {
            reject(new Error("Background image failed to load properly"))
            return
          }
          resolve(true)
        }
        bgImg.onerror = () => {
          clearTimeout(timeoutId)
          reject(new Error("Failed to load background image. Please try again."))
        }
        bgImg.src = imageSrc // Use original image as background
      })

      // Load foreground image (processed image with removed background)
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Foreground image loading timed out"))
        }, 15000) // 15 second timeout

        // Log the processed image source for debugging
        console.log("Processing foreground image:", {
          sourceType: processedImageSrc.substring(0, 50) + "...",
          length: processedImageSrc.length
        })

        fgImg.onload = () => {
          clearTimeout(timeoutId)
          // Verify the image loaded successfully
          if (!fgImg.complete || fgImg.naturalWidth === 0) {
            reject(new Error("Foreground image failed to load properly"))
            return
          }

          // Log successful image load
          console.log("Foreground image loaded successfully:", {
            width: fgImg.naturalWidth,
            height: fgImg.naturalHeight,
            complete: fgImg.complete
          })

          resolve(true)
        }

        fgImg.onerror = () => {
          clearTimeout(timeoutId)
          
          // Check if the processed image source is valid
          if (!processedImageSrc || processedImageSrc === '') {
            reject(new Error("No processed image available. Please remove background first."))
            return
          }

          // Check if the image source is corrupted
          if (processedImageSrc.startsWith('data:image/') && !processedImageSrc.includes('base64,')) {
            reject(new Error("Invalid image data. Please try removing the background again."))
            return
          }

          // Check if the image source is a valid URL
          try {
            new URL(processedImageSrc)
          } catch {
            reject(new Error("Invalid image URL. Please try removing the background again."))
            return
          }

          // If we get here, it's a general loading error
          reject(new Error("Failed to load foreground image. Please try removing the background again."))
        }

        // Ensure the processed image source is valid before loading
        if (!processedImageSrc || processedImageSrc === '') {
          reject(new Error("No processed image available. Please remove background first."))
          return
        }

        // Add error handling for the image source
        try {
          // Check if the image source is a blob URL
          if (processedImageSrc.startsWith('blob:')) {
            // Verify the blob URL is still valid
            fetch(processedImageSrc)
              .then(response => {
                if (!response.ok) {
                  reject(new Error("Image data is no longer available. Please try removing the background again."))
                  return
                }
                fgImg.src = processedImageSrc
              })
              .catch(() => {
                reject(new Error("Failed to access image data. Please try removing the background again."))
              })
          } else {
            fgImg.src = processedImageSrc
          }
        } catch (error) {
          console.error("Error setting image source:", error)
          reject(new Error("Failed to process image. Please try again."))
        }
      })

      const canvas = canvasRef.current
      if (!canvas) {
        throw new Error("Canvas not found")
      }
      
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      // Set canvas dimensions based on the original image size
      canvas.width = bgImg.width
      canvas.height = bgImg.height

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background image with filters
      applyFilters(ctx)
      ctx.drawImage(bgImg, 0, 0)
      ctx.filter = "none" // Reset filters for text

      // Draw text elements that should be behind the image
      const backElements = textElements.filter((element) => element.visible && element.layerOrder === "back")
      const frontElements = textElements.filter((element) => element.visible && element.layerOrder === "front")
      const scaleFactor = Math.min(canvas.width, canvas.height) / 1000

      // Draw back elements
      backElements.forEach((element) => {
        renderTextOnCanvas(ctx, element, canvas.width, canvas.height, scaleFactor)
      })

      // Draw foreground image with transparency
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(fgImg, 0, 0)

      // Draw front elements
      frontElements.forEach((element) => {
        renderTextOnCanvas(ctx, element, canvas.width, canvas.height, scaleFactor)
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
      toast.success("Thumbnail created successfully")

      // Clean up images
      bgImg.src = ""
      fgImg.src = ""
    } catch (error) {
      console.error("Error creating thumbnail:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create thumbnail")
      
      // Reset state on error
      setThumbnailSrc("")
      if (thumbnailUrl.current && thumbnailUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailUrl.current)
        thumbnailUrl.current = null
      }
    } finally {
      setIsCreatingThumbnail(false)
    }
  }

  // Calculate position based on the position property
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
    }
    
    return { x, y }
  }

  // Function to render text on canvas
  const renderTextOnCanvas = (
    ctx: CanvasRenderingContext2D,
    element: TextElement,
    canvasWidth: number,
    canvasHeight: number,
    scaleFactor: number
  ) => {
    try {
      ctx.save()
      const position = calculatePosition(element, canvasWidth, canvasHeight)
      ctx.translate(position.x, position.y)
      if (element.rotation !== 0) {
        ctx.rotate((element.rotation * Math.PI) / 180)
      }
      const scaledFontSize = element.fontSize * (canvasWidth / 1280)

      let fontStyle = ""
      if (element.bold) fontStyle += "bold "
      if (element.italic) fontStyle += "italic "
      fontStyle += `${scaledFontSize}px ${element.fontFamily}`
      ctx.font = fontStyle

      ctx.textAlign = (element.textAlign as CanvasTextAlign) || "center"
      ctx.textBaseline = "middle"
      ctx.globalAlpha = (element.opacity || 100) / 100

      if (element.backgroundEnabled && element.backgroundColor) {
        const metrics = ctx.measureText(element.text)
        const textHeight = scaledFontSize * 1.2
        const rectWidth = Math.min(metrics.width, ((element.maxWidth ?? 80) / 100) * canvasWidth)
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

      ctx.fillStyle = element.color

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
        const maxWidth = ((element.maxWidth ?? 80) / 100) * canvasWidth
        ctx.fillText(element.text, 0, 0, maxWidth)

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
    } catch (error) {
      console.error("Error rendering text on canvas:", error)
      toast.error("Failed to render text on canvas")
      ctx.restore()
    }
  }

  const handleSaveBackgroundRemoved = () => {
    try {
      if (!processedImageSrc) return
      
      const link = document.createElement("a")
      link.href = processedImageSrc
      link.download = `background-removed-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Image saved successfully")
    } catch (error) {
      console.error("Error saving background removed image:", error)
      toast.error("Failed to save image")
    }
  }

  const handleSaveThumbnail = () => {
    try {
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
    } catch (error) {
      console.error("Error saving thumbnail:", error)
      toast.error("Failed to save thumbnail")
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove("border-primary")
    
    try {
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
        } else {
          toast.error("Please drop an image file or URL")
        }
      } else {
        toast.error("Please drop an image file or URL")
      }
    } catch (error) {
      console.error("Error handling drop:", error)
      toast.error("Failed to process dropped file")
      handleCancel()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.add("border-primary")
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove("border-primary")
  }

  // Add cleanup for drag and drop events
  useEffect(() => {
    const handleDragEnd = () => {
      const dropZone = document.querySelector(".drop-zone")
      if (dropZone) {
        dropZone.classList.remove("border-primary")
      }
    }

    document.addEventListener("dragend", handleDragEnd)
    return () => {
      document.removeEventListener("dragend", handleDragEnd)
    }
  }, [])

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

  // Add useEffect to handle text editor state preservation
  useEffect(() => {
    if (activeTab === "text" && processedImageSrc) {
      // Force a re-render of the text editor when switching to text tab
      const textEditorElement = document.querySelector('[data-text-editor]');
      if (textEditorElement) {
        textEditorElement.dispatchEvent(new Event('resize'));
      }
    }
  }, [activeTab, processedImageSrc]);

  // Add this after the hiddenImageRef declaration
  useEffect(() => {
    if (hiddenImageRef.current) {
      hiddenImageRef.current.crossOrigin = "anonymous"
    }
  }, [])

  // Wrap the main component with error boundary
  return (
    <ErrorBoundary>
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
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger value="file" className="flex items-center gap-1 text-xs sm:text-sm py-2 px-1 sm:px-2">
              <UploadIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Image from File</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-1 text-xs sm:text-sm py-2 px-1 sm:px-2">
              <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Image from URL</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base">Upload Image File</CardTitle>
                <CardDescription className="text-sm">Select an image file from your device or drag and drop</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <label htmlFor="file-upload">
                  <div
                    className="flex flex-col items-center justify-center space-y-4 py-6 px-4 border-2 border-gray-300 border-dashed rounded-md transition-colors hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent cursor-pointer drop-zone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <UploadIcon className="h-8 w-8 text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-50">Drop image here or click to browse</div>
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
                <CardTitle className="text-base">Upload from URL</CardTitle>
                <CardDescription className="text-sm">Enter the URL of an image you want to upload</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Input type="url" placeholder="https://example.com/image.jpg" className="col-span-3" id="imageUrl" />
                  <Button onClick={handleURLLoad} disabled={isLoading} size="default">
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Image Preview</CardTitle>
              {error && hasAttemptedLoad && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </CardHeader>
            <CardContent className="space-y-4">
              {imageInfo && imageLoaded && (
                <div className="bg-muted p-2 text-xs rounded flex items-center space-x-2">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p>Image size: {imageInfo.width}x{imageInfo.height} pixels</p>
                    {imageInfo.size > 0 && <p>File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>}
                  </div>
                </div>
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
                        <UploadIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No image selected</p>
                      </div>
                    )}
                    {isLoading && (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                      className="h-8 w-8 md:h-10 md:w-10"
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                      disabled={zoomLevel <= 50}
                    >
                      <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <span className="text-xs md:text-sm">{zoomLevel}%</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                      onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                      disabled={zoomLevel >= 200}
                    >
                      <ZoomIn className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                      onClick={() => setZoomLevel(100)}
                      disabled={zoomLevel === 100}
                    >
                      <Maximize className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                      onClick={() => setZoomLevel(50)}
                      disabled={zoomLevel === 50}
                    >
                      <Minimize className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button onClick={handleCancel} variant="outline" size="default" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleRemoveBackground}
                disabled={!imageLoaded || isProcessing}
                size="default"
                className="flex-1"
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

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base">Background Removed</CardTitle>
            </CardHeader>
            <CardContent>
              {imageInfo && imageLoaded && (
                <div className="bg-muted p-2 text-xs rounded flex items-center space-x-2 mb-4">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p>Image size: {imageInfo.width}x{imageInfo.height} pixels</p>
                    {imageInfo.size > 0 && <p>File size: {(imageInfo.size / 1024).toFixed(2)} KB</p>}
                  </div>
                </div>
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
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                      <p className="text-sm text-gray-500">Removing background...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {processedImageSrc
                          ? "Click 'Apply' in the text editor to generate preview"
                          : ""}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {processedImageSrc && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleUndo} disabled={undoStack.length === 0}>
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleRedo} disabled={redoStack.length === 0}>
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 p-4 md:p-6">
              <Button onClick={handleCancel} variant="outline" size="default" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSaveBackgroundRemoved}
                disabled={!processedImageSrc}
                variant="default"
                size="default"
                className="flex-1 bg-black hover:bg-black/90 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs value={activeEditorTab} onValueChange={setActiveEditorTab} className="w-full">
          <TabsList className="bg-muted text-muted-foreground h-9 items-center justify-center rounded-lg p-[3px] grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Type className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Text Editor</span>
              <span className="xs:hidden">Text</span>
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Palette className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Image Filters</span>
              <span className="xs:hidden">Filters</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <ImageIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Final Preview</span>
              <span className="xs:hidden">Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <Card className="w-full">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base">Customize Text</CardTitle>
                <CardDescription className="text-sm">Add and customize text for your thumbnail</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <TextEditor
                  onApply={() => {
                    handleCreateThumbnail()
                  }}
                  isCreatingThumbnail={isCreatingThumbnail}
                  processedImageSrc={processedImageSrc}
                  textElements={textElements}
                  onTextElementsChange={(elements) => {
                    setTextElements(elements)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            <Card className="w-full">
              <CardHeader className="p-4 md:p-6">
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
                    <Button
                      variant="outline"
                      onClick={() => applyPresetFilter("grayscale")}
                      className="flex-1 text-sm md:text-base"
                    >
                      Grayscale
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => applyPresetFilter("sepia")}
                      className="flex-1 text-sm md:text-base"
                    >
                      Sepia
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => applyPresetFilter("vivid")}
                      className="flex-1 text-sm md:text-base"
                    >
                      Vivid
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => applyPresetFilter("cool")}
                      className="flex-1 text-sm md:text-base"
                    >
                      Cool
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => applyPresetFilter("warm")}
                      className="flex-1 text-sm md:text-base"
                    >
                      Warm
                    </Button>
                    <Button variant="outline" onClick={resetFilters} className="flex-1 text-sm md:text-base">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Reset All
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleCreateThumbnail}
                  disabled={!processedImageSrc || isCreatingThumbnail}
                  className="flex-1 text-sm md:text-base"
                >
                  Apply Filters
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card className="w-full">
              <CardHeader className="p-4 md:p-6">
                <CardTitle>Final Preview</CardTitle>
                <CardDescription>Preview your thumbnail with text and effects</CardDescription>
              </CardHeader>
              <CardContent>
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-sm text-gray-500">Creating thumbnail...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {processedImageSrc
                            ? "Click 'Apply' in the text editor to generate preview"
                            : ""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSaveThumbnail}
                  disabled={!thumbnailSrc}
                  size="default"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Thumbnail
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}

