"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  RotateCw,
  Download,
  Plus,
  Trash2,
  Copy,
  Type,
  Palette,
  Move,
  LayoutGrid,
  Bold,
  Italic,

  Eye,
} from "lucide-react"
import { toast } from "sonner"

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

interface TextEditorProps {
  onApply: () => void
  isCreatingThumbnail: boolean
  processedImageSrc: string | null
  textElements?: TextElement[]
  onTextElementsChange?: (elements: TextElement[]) => void
}

const POPULAR_FONTS = [
  "var(--font-poppins)",
  "var(--font-inter)",
  "var(--font-roboto)",
  "var(--font-open-sans)",
  "var(--font-montserrat)",
  "var(--font-lato)",
  "var(--font-geist-sans)",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Impact",
  "Comic Sans MS",
  "Trebuchet MS",
]

const PRESET_COLORS = [
  "#ffffff",
  "#000000",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff8000",
  "#8000ff",
  "#ff0080",
  "#00ff80",
]

export default function TextEditor({
  onApply,
  isCreatingThumbnail,
  processedImageSrc,
  textElements: initialTextElements,
  onTextElementsChange,
}: TextEditorProps) {
  const [textElements, setTextElements] = useState<TextElement[]>(initialTextElements || [])
  const [activeTab, setActiveTab] = useState("text")
  const [activeTextElementId, setActiveTextElementId] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)
  const isInitialMount = useRef(true)
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (initialTextElements && initialTextElements.length > 0) {
      setTextElements(initialTextElements)
      if (!activeTextElementId || !initialTextElements.find(e => e.id === activeTextElementId)) {
        setActiveTextElementId(initialTextElements[0].id)
      }
    } else if (textElements.length === 0) {
      handleAddTextElement()
    }
  }, [initialTextElements, activeTextElementId, textElements.length])

  const handleTextElementChange = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => {
      const newElements = prev.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        if (onTextElementsChange) {
          onTextElementsChange(newElements)
        }
      }, 300)
      
      return newElements
    })
  }, [onTextElementsChange])

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
  }, [])

  const handleAddTextElement = () => {
    const newId = `text-${Date.now()}`
    const newElement: TextElement = {
      id: newId,
      text: "New Text",
      x: 50,
      y: 50,
      fontSize: 120,
      color: "#ffffff",
      rotation: 0,
      fontFamily: "Arial",
      position: "center",
      maxWidth: 80,
      curve: false,
      backgroundColor: "#000000",
      backgroundEnabled: true,
      shadow: true,
      shadowBlur: 10,
      shadowColor: "#000000",
      textAlign: "center",
      bold: true,
      italic: false,
      underline: false,
      letterSpacing: 0,
      lineHeight: 1.2,
      opacity: 100,
      visible: true,
      layerOrder: "front"
    }
    setTextElements(prev => [...prev, newElement])
    setActiveTextElementId(newId)
  }

  const handleRemoveTextElement = (id: string) => {
    setTextElements(prev => prev.filter(element => element.id !== id))
    if (activeTextElementId === id) {
      setActiveTextElementId(textElements[0]?.id || "")
    }
  }

  const activeTextElement = textElements.find(element => element.id === activeTextElementId)

  const handleTextElementSelect = (id: string) => {
    setActiveTextElementId(id)
  }

  const calculatePosition = (element: TextElement, canvasWidth: number, canvasHeight: number) => {
    const x = canvasWidth * (element.x / 100)
    const y = canvasHeight * (element.y / 100)
    return { x, y }
  }

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
      const scaledFontSize = Math.max(element.fontSize * scaleFactor * 0.8, element.fontSize * 0.3)

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
      toast.error("Failed to render text on canvas")
      ctx.restore()
    }
  }

  useEffect(() => {
    if (!canvasRef.current || !processedImageSrc) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 480
    canvas.height = 270

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (previewImageRef.current) {
      if (previewImageRef.current.complete && previewImageRef.current.naturalWidth !== 0) {
        try {
          ctx.drawImage(previewImageRef.current, 0, 0, canvas.width, canvas.height)
        } catch (error) {
          ctx.fillStyle = "#f0f0f0"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = "#666"
          ctx.font = "14px Arial"
          ctx.textAlign = "center"
          ctx.fillText("Image failed to load", canvas.width / 2, canvas.height / 2)
        }
      } else {
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#666"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Loading image...", canvas.width / 2, canvas.height / 2)
      }
    }

    const elements = textElements.filter(element => element.visible)
    if (elements.length > 0) {
      elements.forEach((element) => {
        try {
          const scaleFactor = Math.min(canvas.width, canvas.height) / 250
          renderTextOnCanvas(ctx, element, canvas.width, canvas.height, scaleFactor)
        } catch (error) {
        }
      })
    } else {
      ctx.fillStyle = "#666"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("No text elements to display", canvas.width / 2, canvas.height / 2)
    }
  }, [processedImageSrc, textElements])

  const handlePreviewImageError = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.fillStyle = "#666"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Image failed to load", canvasRef.current.width / 2, canvasRef.current.height / 2)
      }
    }
  }

  const handleApply = () => {
    const formattedElements = textElements.map(element => ({
      ...element,
      text: element.text.trim(),
      lineHeight: element.lineHeight || 1.2,
      opacity: element.opacity || 100,
      visible: element.visible ?? true,
      textAlign: element.textAlign || "center",
      layerOrder: element.layerOrder || "front",
      fontSize: element.fontSize || 72,
      color: element.color || "#ffffff",
      fontFamily: element.fontFamily || "Arial",
      bold: element.bold || false,
      italic: element.italic || false,
      backgroundEnabled: element.backgroundEnabled || false,
      backgroundColor: element.backgroundColor || "#000000",
      shadow: element.shadow || false,
      shadowBlur: element.shadowBlur || 10,
      shadowColor: element.shadowColor || "#000000",
      x: element.x || 50,
      y: element.y || 50,
      rotation: element.rotation || 0,
      maxWidth: element.maxWidth || 80,
    }))

    setTextElements(formattedElements)
    
    if (onTextElementsChange) {
      onTextElementsChange(formattedElements)
    }

    setTimeout(() => {
      onApply()
    }, 0)
  }

  const generateUniqueId = () => {
    return `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }

  const duplicateTextElement = (index: number) => {
    const elementToDuplicate = textElements[index]
    if (!elementToDuplicate) return

    const duplicatedElement: TextElement = {
      ...elementToDuplicate,
      id: generateUniqueId(),
      text: `${elementToDuplicate.text} (Copy)`,
      x: elementToDuplicate.x + 5,
      y: elementToDuplicate.y + 5,
    }

    setTextElements((prev) => {
      const updated = [...prev, duplicatedElement]
      if (onTextElementsChange) {
        onTextElementsChange(updated)
      }
      return updated
    })

    setActiveTextElementId(duplicatedElement.id)
    toast.success("Text element duplicated")
  }

  const clearTextProperties = () => {
    const defaultElement: Partial<TextElement> = {
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
      layerOrder: "front",
    }

    handleTextElementChange(activeTextElementId, defaultElement)
    toast.success("Text properties reset to default")
  }

  const moveTextElementUp = (index: number) => {
    if (index === textElements.length - 1) {
      toast.info("Element is already at the top")
      return
    }

    setTextElements((prev) => {
      const newElements = [...prev]
      ;[newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]]

      if (onTextElementsChange) {
        onTextElementsChange(newElements)
      }
      return newElements
    })

    setActiveTextElementId(textElements[index + 1].id)
  }

  const moveTextElementDown = (index: number) => {
    if (index === 0) {
      toast.info("Element is already at the bottom")
      return
    }

    setTextElements((prev) => {
      const newElements = [...prev]
      ;[newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]]

      if (onTextElementsChange) {
        onTextElementsChange(newElements)
      }
      return newElements
    })

    setActiveTextElementId(textElements[index - 1].id)
  }

  const toggleTextElementVisibility = (index: number) => {
    handleTextElementChange(textElements[index].id, { visible: !textElements[index].visible })
  }

  const exportCanvasAsImage = () => {
    if (!canvasRef.current) return

    try {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = "thumbnail-preview.png"
          link.click()
          URL.revokeObjectURL(url)
          toast.success("Preview image downloaded")
        } else {
          throw new Error("Failed to create blob from canvas")
        }
      }, "image/png", 1.0)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'SecurityError') {
        toast.error("Cannot export image due to CORS restrictions. Please ensure all images are from trusted sources.")
      } else {
        toast.error("Failed to download preview")
      }
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && previewImageRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (ctx) {
          try {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            if (previewImageRef.current.complete && previewImageRef.current.naturalWidth !== 0) {
              ctx.drawImage(previewImageRef.current, 0, 0, canvas.width, canvas.height)
              
              textElements.forEach(element => {
                if (element.visible) {
                  const scaleFactor = Math.min(canvas.width, canvas.height) / 250
                  renderTextOnCanvas(ctx, element, canvas.width, canvas.height, scaleFactor)
                }
              })
            } else {
              ctx.fillStyle = "#f0f0f0"
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              ctx.fillStyle = "#666"
              ctx.font = "14px Arial"
              ctx.textAlign = "center"
              ctx.fillText("Loading image...", canvas.width / 2, canvas.height / 2)
            }
          } catch (error) {
            ctx.fillStyle = "#f0f0f0"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = "#666"
            ctx.font = "14px Arial"
            ctx.textAlign = "center"
            ctx.fillText("Failed to load image", canvas.width / 2, canvas.height / 2)
          }
        }
      }
    }

    window.addEventListener('resize', handleResize)
    
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [textElements])

  return (
    <div className="w-full space-y-4" data-text-editor>
      {processedImageSrc && (
        <div className="relative border rounded-md overflow-hidden w-full md:w-auto">
          <canvas ref={canvasRef} className="w-full md:w-[240px] h-[135px]" />
          <img
            ref={previewImageRef}
            src={processedImageSrc || "/placeholder.svg"}
            alt="Background"
            className="hidden"
            onLoad={() => {
              if (canvasRef.current && previewImageRef.current) {
                const canvas = canvasRef.current
                const ctx = canvas.getContext("2d")
                if (ctx && previewImageRef.current.complete && previewImageRef.current.naturalWidth !== 0) {
                  try {
                    canvas.width = previewImageRef.current.naturalWidth
                    canvas.height = previewImageRef.current.naturalHeight
                    ctx.drawImage(previewImageRef.current, 0, 0, canvas.width, canvas.height)
                  } catch (error) {
                    if (error instanceof DOMException && error.name === 'SecurityError') {
                      toast.error("Cannot load image due to CORS restrictions")
                    }
                    handlePreviewImageError()
                  }
                }
              }
            }}
            onError={(e) => {
              if (e instanceof ErrorEvent && e.error instanceof DOMException && e.error.name === 'SecurityError') {
                toast.error("Cannot load image due to CORS restrictions")
              }
              handlePreviewImageError()
            }}
            crossOrigin="anonymous"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70"
            onClick={exportCanvasAsImage}
          >
            <Download className="h-3 w-3 text-white" />
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select
            value={activeTextElementId}
            onValueChange={handleTextElementSelect}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select text" />
            </SelectTrigger>
            <SelectContent>
              {textElements.map((element) => (
                <SelectItem key={element.id} value={element.id}>
                  <div className="flex items-center gap-2">
                    {!element.visible && <Eye className="h-3 w-3 text-muted-foreground" />}
                    {element.text.substring(0, 15)}
                    {element.text.length > 15 ? "..." : ""}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddTextElement} className="text-xs md:text-sm">
              <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => duplicateTextElement(textElements.findIndex(e => e.id === activeTextElementId))}
              className="text-xs md:text-sm"
            >
              <Copy className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveTextElement(activeTextElementId)}
              disabled={textElements.length <= 1}
              className="text-xs md:text-sm"
            >
              <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveTextElementDown(textElements.findIndex(e => e.id === activeTextElementId))}
            disabled={activeTextElementId === textElements[0].id}
            title="Move down in layer order"
            className="h-8 w-8 md:h-10 md:w-10"
          >
            ↓
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveTextElementUp(textElements.findIndex(e => e.id === activeTextElementId))}
            disabled={activeTextElementId === textElements[textElements.length - 1].id}
            title="Move up in layer order"
            className="h-8 w-8 md:h-10 md:w-10"
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleTextElementVisibility(textElements.findIndex(e => e.id === activeTextElementId))}
            title={textElements.find(e => e.id === activeTextElementId)?.visible ? "Hide element" : "Show element"}
            className="h-8 w-8 md:h-10 md:w-10"
          >
            <Eye
              className={`h-3 w-3 md:h-4 md:w-4 ${!textElements.find(e => e.id === activeTextElementId)?.visible ? "text-muted-foreground" : ""}`}
            />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="md:hidden mb-2">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {activeTab === "text" && (
                  <div className="flex items-center gap-1">
                    <Type className="h-4 w-4" />
                    <span>Text</span>
                  </div>
                )}
                {activeTab === "style" && (
                  <div className="flex items-center gap-1">
                    <Palette className="h-4 w-4" />
                    <span>Style</span>
                  </div>
                )}
                {activeTab === "position" && (
                  <div className="flex items-center gap-1">
                    <Move className="h-4 w-4" />
                    <span>Position</span>
                  </div>
                )}
                {activeTab === "effects" && (
                  <div className="flex items-center gap-1">
                    <LayoutGrid className="h-4 w-4" />
                    <span>Effects</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">
                <div className="flex items-center gap-1">
                  <Type className="h-4 w-4" />
                  <span>Text</span>
                </div>
              </SelectItem>
              <SelectItem value="style">
                <div className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  <span>Style</span>
                </div>
              </SelectItem>
              <SelectItem value="position">
                <div className="flex items-center gap-1">
                  <Move className="h-4 w-4" />
                  <span>Position</span>
                </div>
              </SelectItem>
              <SelectItem value="effects">
                <div className="flex items-center gap-1">
                  <LayoutGrid className="h-4 w-4" />
                  <span>Effects</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TabsList className="hidden md:grid grid-cols-4 mb-2">
          <TabsTrigger value="text" className="flex items-center gap-1 text-xs md:text-sm">
            <Type className="h-3 w-3 md:h-4 md:w-4" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-1 text-xs md:text-sm">
            <Palette className="h-3 w-3 md:h-4 md:w-4" />
            <span>Style</span>
          </TabsTrigger>
          <TabsTrigger value="position" className="flex items-center gap-1 text-xs md:text-sm">
            <Move className="h-3 w-3 md:h-4 md:w-4" />
            <span>Position</span>
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-1 text-xs md:text-sm">
            <LayoutGrid className="h-3 w-3 md:h-4 md:w-4" />
            <span>Effects</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="border p-4 rounded-md">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Text Content</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTextElement}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Text Box
                </Button>
              </div>
              
              <div className="space-y-2">
                {textElements.map((element) => (
                  <div 
                    key={element.id} 
                    className="flex gap-2 items-start p-2 rounded-md"
                    onClick={() => handleTextElementSelect(element.id)}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2 items-center">
                        <Input
                          value={element.text}
                          onChange={(e) => handleTextElementChange(element.id, { text: e.target.value })}
                          className="flex-1"
                          placeholder="Enter text..."
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTextElement(element.id)}
                          disabled={textElements.length <= 1}
                          className="h-10 px-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Select
                          value={element.fontFamily}
                          onValueChange={(value) => handleTextElementChange(element.id, { fontFamily: value })}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Font" />
                          </SelectTrigger>
                          <SelectContent>
                            {POPULAR_FONTS.map((font) => (
                              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                {font.replace("var(--font-", "").replace(")", "").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={12}
                            max={500}
                            value={element.fontSize}
                            onChange={(e) => handleTextElementChange(element.id, { fontSize: Number(e.target.value) })}
                            className="w-20"
                            placeholder="Size"
                          />
                          <span className="text-sm text-muted-foreground">px</span>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant={element.bold ? "default" : "outline"}
                            onClick={() => handleTextElementChange(element.id, { bold: !element.bold })}
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={element.italic ? "default" : "outline"}
                            onClick={() => handleTextElementChange(element.id, { italic: !element.italic })}
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                        </div>

                        <Input
                          type="color"
                          value={element.color}
                          onChange={(e) => handleTextElementChange(element.id, { color: e.target.value })}
                          className="w-10 h-10 p-1"
                        />

                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant={element.backgroundEnabled ? "default" : "outline"}
                            onClick={() => handleTextElementChange(element.id, { backgroundEnabled: !element.backgroundEnabled })}
                          >
                            <div className="w-4 h-4 border-2 border-current" />
                          </Button>
                          {element.backgroundEnabled && (
                            <Input
                              type="color"
                              value={element.backgroundColor}
                              onChange={(e) => handleTextElementChange(element.id, { backgroundColor: e.target.value })}
                              className="w-10 h-10 p-1"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="style" className="border p-4 rounded-md">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={activeTextElement?.color || "#ffffff"}
                  onChange={(e) => handleTextElementChange(activeTextElementId, { color: e.target.value })}
                  className="w-12 h-8 p-1"
                />
                <span className="text-sm text-muted-foreground">{activeTextElement?.color}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full border ${activeTextElement?.color === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleTextElementChange(activeTextElementId, { color })}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-background">Text Background</Label>
                <Switch
                  id="text-background"
                  checked={!!activeTextElement?.backgroundEnabled}
                  onCheckedChange={(checked) => handleTextElementChange(activeTextElementId, { backgroundEnabled: checked })}
                />
              </div>
              {activeTextElement?.backgroundEnabled && (
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="color"
                    value={activeTextElement?.backgroundColor || "#000000"}
                    onChange={(e) => handleTextElementChange(activeTextElementId, { backgroundColor: e.target.value })}
                    className="w-12 h-8 p-1"
                  />
                  <span className="text-sm text-muted-foreground">
                    {activeTextElement?.backgroundColor}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Opacity</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[activeTextElement?.opacity || 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleTextElementChange(activeTextElementId, { opacity: value[0] })}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={activeTextElement?.opacity || 100}
                  onChange={(e) => handleTextElementChange(activeTextElementId, { opacity: Number(e.target.value) })}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Letter Spacing</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[activeTextElement?.letterSpacing || 0]}
                  min={-5}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => handleTextElementChange(activeTextElementId, { letterSpacing: value[0] })}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={-5}
                  max={10}
                  step={0.1}
                  value={activeTextElement?.letterSpacing || 0}
                  onChange={(e) => handleTextElementChange(activeTextElementId, { letterSpacing: Number(e.target.value) })}
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Line Height</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[activeTextElement?.lineHeight || 1.2]}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => handleTextElementChange(activeTextElementId, { lineHeight: value[0] })}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={activeTextElement?.lineHeight || 1.2}
                  onChange={(e) => handleTextElementChange(activeTextElementId, { lineHeight: Number(e.target.value) })}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="position" className="border p-4 rounded-md">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Layer Order</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={activeTextElement?.layerOrder === "front" ? "default" : "outline"}
                  onClick={() => handleTextElementChange(activeTextElementId, { layerOrder: "front" })}
                >
                  Front
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={activeTextElement?.layerOrder === "back" ? "default" : "outline"}
                  onClick={() => handleTextElementChange(activeTextElementId, { layerOrder: "back" })}
                >
                  Back
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="space-y-2">
                <Label htmlFor="x-position">X Position (%)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[activeTextElement?.x ?? 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleTextElementChange(activeTextElementId, { x: value[0] })}
                    className="flex-1"
                  />
                  <Input
                    id="x-position"
                    type="number"
                    min={0}
                    max={100}
                    value={activeTextElement?.x ?? 50}
                    onChange={(e) => handleTextElementChange(activeTextElementId, { x: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="y-position">Y Position (%)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[activeTextElement?.y ?? 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleTextElementChange(activeTextElementId, { y: value[0] })}
                    className="flex-1"
                  />
                  <Input
                    id="y-position"
                    type="number"
                    min={0}
                    max={100}
                    value={activeTextElement?.y ?? 50}
                    onChange={(e) => handleTextElementChange(activeTextElementId, { y: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rotation</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[activeTextElement?.rotation || 0]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={(value) => handleTextElementChange(activeTextElementId, { rotation: value[0] })}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={-180}
                  max={180}
                  value={activeTextElement?.rotation || 0}
                  onChange={(e) => handleTextElementChange(activeTextElementId, { rotation: Number(e.target.value) })}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">°</span>
              </div>
              <div className="flex gap-1 mt-1">
                {[-45, -15, 0, 15, 45].map((deg) => (
                  <Button
                    key={deg}
                    type="button"
                    size="sm"
                    variant={activeTextElement?.rotation === deg ? "default" : "outline"}
                    onClick={() => handleTextElementChange(activeTextElementId, { rotation: deg })}
                  >
                    {deg}°
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-width">Text Width (%)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[activeTextElement?.maxWidth ?? 80]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleTextElementChange(activeTextElementId, { maxWidth: value[0] })}
                  className="flex-1"
                />
                <Input
                  id="max-width"
                  type="number"
                  min={10}
                  max={100}
                  value={activeTextElement?.maxWidth ?? 80}
                  onChange={(e) => handleTextElementChange(activeTextElementId, { maxWidth: Number(e.target.value) })}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="effects" className="border p-4 rounded-md">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-shadow">Text Shadow</Label>
                <Switch
                  id="text-shadow"
                  checked={!!activeTextElement?.shadow}
                  onCheckedChange={(checked) => handleTextElementChange(activeTextElementId, { shadow: checked })}
                />
              </div>
              {activeTextElement?.shadow && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Label className="min-w-[80px]">Shadow Size</Label>
                    <Slider
                      value={[activeTextElement?.shadowBlur ?? 10]}
                      min={0}
                      max={50}
                      step={1}
                      onValueChange={(value) => handleTextElementChange(activeTextElementId, { shadowBlur: value[0] })}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      value={activeTextElement?.shadowBlur ?? 10}
                      onChange={(e) => handleTextElementChange(activeTextElementId, { shadowBlur: Number(e.target.value) })}
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="min-w-[80px]">Shadow Color</Label>
                    <Input
                      type="color"
                      value={activeTextElement?.shadowColor || "#000000"}
                      onChange={(e) => handleTextElementChange(activeTextElementId, { shadowColor: e.target.value })}
                      className="w-12 h-8 p-1"
                    />
                    <span className="text-sm text-muted-foreground">
                      {activeTextElement?.shadowColor}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-curve">Curved Text</Label>
                <Switch
                  id="text-curve"
                  checked={!!activeTextElement?.curve}
                  onCheckedChange={(checked) => handleTextElementChange(activeTextElementId, { curve: checked })}
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Label>Text Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleTextElementChange(activeTextElementId, {
                      color: "#ffffff",
                      shadow: true,
                      shadowBlur: 15,
                      shadowColor: "#000000",
                      bold: true,
                      fontSize: 72,
                    })
                  }
                >
                  White with Shadow
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleTextElementChange(activeTextElementId, {
                      color: "#ff0000",
                      shadow: true,
                      shadowBlur: 10,
                      shadowColor: "#000000",
                      bold: true,
                      fontSize: 72,
                    })
                  }
                >
                  Red with Shadow
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleTextElementChange(activeTextElementId, {
                      color: "#ffffff",
                      backgroundEnabled: true,
                      backgroundColor: "#000000",
                      shadow: false,
                      fontSize: 60,
                    })
                  }
                >
                  White on Black
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleTextElementChange(activeTextElementId, {
                      color: "#000000",
                      backgroundEnabled: true,
                      backgroundColor: "#ffff00",
                      shadow: false,
                      fontSize: 60,
                    })
                  }
                >
                  Black on Yellow
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col md:flex-row justify-between gap-4 pt-4 border-t">
        <Button variant="outline" onClick={clearTextProperties} className="flex items-center gap-2 text-sm">
          <RotateCw className="h-3 w-3 md:h-4 md:w-4" />
          Reset to Default
        </Button>
        <Button
          type="button"
          onClick={handleApply}
          disabled={!processedImageSrc || isCreatingThumbnail}
          className="text-sm"
        >
          {isCreatingThumbnail ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-3 w-3 md:h-4 md:w-4 border-2 border-b-transparent border-white rounded-full"></span>
              Applying...
            </span>
          ) : (
            "Apply"
          )}
        </Button>
      </div>
    </div>
  )
}
