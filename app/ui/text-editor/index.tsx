"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  Underline,
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
  "Poppins",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Impact",
  "Comic Sans MS",
  "Trebuchet MS",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Lato",
  "Playfair Display",
  "Source Sans Pro",
  "Raleway",
  "Ubuntu",
  "Nunito",
  "Inter",
  "Quicksand",
  "Oswald",
  "Merriweather",
  "PT Sans",
  "Noto Sans",
  "Work Sans",
  "Rubik",
  "Mukta",
  "Fira Sans",
  "IBM Plex Sans",
]

const PRESET_COLORS = [
  "#ffffff", // White
  "#000000", // Black
  "#ff0000", // Red
  "#00ff00", // Green
  "#0000ff", // Blue
  "#ffff00", // Yellow
  "#ff00ff", // Magenta
  "#00ffff", // Cyan
  "#ff8000", // Orange
  "#8000ff", // Purple
  "#ff0080", // Pink
  "#00ff80", // Mint
]

export default function TextEditor({
  onApply,
  isCreatingThumbnail,
  processedImageSrc,
  textElements: initialTextElements,
  onTextElementsChange,
}: TextEditorProps) {
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
      layerOrder: "front",
    },
  ])
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>("text")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)

  // Initialize with provided text elements if available
  useEffect(() => {
    if (initialTextElements && initialTextElements.length > 0) {
      setTextElements(initialTextElements)
    }
  }, [initialTextElements])

  // Update text element properties
  const updateTextElement = (index: number, updates: Partial<TextElement>) => {
    setTextElements((prev) => {
      const updated = prev.map((element, i) => (i === index ? { ...element, ...updates } : element))
      // Notify parent component if callback is provided
      if (onTextElementsChange) {
        onTextElementsChange(updated)
      }
      return updated
    })
  }

  // Generate unique ID for new text elements
  const generateUniqueId = () => {
    return `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }

  // Add new text element
  const addTextElement = () => {
    const newElement: TextElement = {
      id: generateUniqueId(),
      text: "New Text",
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

    setTextElements((prev) => {
      const updated = [...prev, newElement]
      // Notify parent component if callback is provided
      if (onTextElementsChange) {
        onTextElementsChange(updated)
      }
      return updated
    })

    setSelectedTextIndex(textElements.length)
    toast.success("New text element added")
  }

  // Duplicate text element
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
      // Notify parent component if callback is provided
      if (onTextElementsChange) {
        onTextElementsChange(updated)
      }
      return updated
    })

    setSelectedTextIndex(textElements.length)
    toast.success("Text element duplicated")
  }

  // Clear text properties to default values
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

    updateTextElement(selectedTextIndex, defaultElement)
    toast.success("Text properties reset to default")
  }

  // Remove text element
  const removeTextElement = (index: number) => {
    if (textElements.length <= 1) {
      toast.error("Cannot remove the last text element")
      return
    }

    setTextElements((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      // Notify parent component if callback is provided
      if (onTextElementsChange) {
        onTextElementsChange(updated)
      }
      return updated
    })

    setSelectedTextIndex((prev) => (prev >= index ? Math.max(0, prev - 1) : prev))
    toast.success("Text element removed")
  }

  // Move text element up in the layer order
  const moveTextElementUp = (index: number) => {
    if (index === textElements.length - 1) {
      toast.info("Element is already at the top")
      return
    }

    setTextElements((prev) => {
      const newElements = [...prev]
      ;[newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]]

      // Notify parent component if callback is provided
      if (onTextElementsChange) {
        onTextElementsChange(newElements)
      }
      return newElements
    })

    setSelectedTextIndex(index + 1)
  }

  // Move text element down in the layer order
  const moveTextElementDown = (index: number) => {
    if (index === 0) {
      toast.info("Element is already at the bottom")
      return
    }

    setTextElements((prev) => {
      const newElements = [...prev]
      ;[newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]]

      // Notify parent component if callback is provided
      if (onTextElementsChange) {
        onTextElementsChange(newElements)
      }
      return newElements
    })

    setSelectedTextIndex(index - 1)
  }

  // Toggle text element visibility
  const toggleTextElementVisibility = (index: number) => {
    updateTextElement(index, { visible: !textElements[index].visible })
  }

  // Draw preview on canvas
  useEffect(() => {
    if (!canvasRef.current || !processedImageSrc) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 320
    canvas.height = 180

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background image if available
    if (previewImageRef.current && previewImageRef.current.complete) {
      ctx.drawImage(previewImageRef.current, 0, 0, canvas.width, canvas.height)
    }

    // Draw text elements
    textElements.forEach((element) => {
      if (!element.visible) return

      // Save context state
      ctx.save()

      // Set font properties
      let fontStyle = ""
      if (element.bold) fontStyle += "bold "
      if (element.italic) fontStyle += "italic "
      fontStyle += `${(element.fontSize * canvas.width) / 1280}px ${element.fontFamily}`
      ctx.font = fontStyle

      // Set text alignment
      ctx.textAlign = (element.textAlign as CanvasTextAlign) || "center"
      ctx.textBaseline = "middle"

      // Calculate position
      const x = (element.x * canvas.width) / 100
      const y = (element.y * canvas.height) / 100

      // Apply rotation
      ctx.translate(x, y)
      ctx.rotate((element.rotation * Math.PI) / 180)

      // Set text color and opacity
      ctx.fillStyle = element.color
      ctx.globalAlpha = (element.opacity || 100) / 100

      // Draw text background if enabled
      if (element.backgroundEnabled && element.backgroundColor) {
        const textMetrics = ctx.measureText(element.text)
        const padding = element.fontSize * 0.2
        ctx.fillStyle = element.backgroundColor
        ctx.fillRect(
          -textMetrics.width / 2 - padding,
          -element.fontSize / 2 - padding,
          textMetrics.width + padding * 2,
          element.fontSize + padding * 2,
        )
        ctx.fillStyle = element.color
      }

      // Draw text shadow if enabled
      if (element.shadow && element.shadowBlur && element.shadowColor) {
        ctx.shadowColor = element.shadowColor
        ctx.shadowBlur = (element.shadowBlur * canvas.width) / 1280
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
      }

      // Draw text
      if (element.curve) {
        // Simple curved text implementation
        const characters = element.text.split("")
        const radius = element.fontSize * 2
        const angleStep = 0.2
        let currentAngle = (-angleStep * (characters.length - 1)) / 2

        characters.forEach((char) => {
          ctx.save()
          ctx.rotate(currentAngle)
          ctx.fillText(char, 0, -radius)
          ctx.restore()
          currentAngle += angleStep
        })
      } else {
        // Regular text
        ctx.fillText(element.text, 0, 0)

        // Draw underline if enabled
        if (element.underline) {
          const textMetrics = ctx.measureText(element.text)
          const underlineY = element.fontSize * 0.15
          ctx.lineWidth = element.fontSize * 0.05
          ctx.beginPath()
          ctx.moveTo(-textMetrics.width / 2, underlineY)
          ctx.lineTo(textMetrics.width / 2, underlineY)
          ctx.stroke()
        }
      }

      // Restore context state
      ctx.restore()
    })
  }, [textElements, processedImageSrc])

  // Export canvas as image
  const exportCanvasAsImage = () => {
    if (!canvasRef.current) return

    try {
      const dataUrl = canvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = "thumbnail-preview.png"
      link.click()
      toast.success("Preview image downloaded")
    } catch (error) {
      toast.error("Failed to download preview")
      console.error("Export error:", error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl">Text Editor</CardTitle>
          </div>
          {processedImageSrc && (
            <div className="relative border rounded-md overflow-hidden w-full md:w-auto">
              <canvas ref={canvasRef} className="w-full md:w-[160px] h-[90px]" />
              <img
                ref={previewImageRef}
                src={processedImageSrc || "/placeholder.svg"}
                alt="Background"
                className="hidden"
                onLoad={() => {
                  setTextElements((prev) => [...prev])
                }}
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Select
              value={selectedTextIndex.toString()}
              onValueChange={(value) => setSelectedTextIndex(Number.parseInt(value))}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select text" />
              </SelectTrigger>
              <SelectContent>
                {textElements.map((element, index) => (
                  <SelectItem key={element.id} value={index.toString()}>
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
              <Button variant="outline" size="sm" onClick={addTextElement} className="text-xs md:text-sm">
                <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => duplicateTextElement(selectedTextIndex)}
                className="text-xs md:text-sm"
              >
                <Copy className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeTextElement(selectedTextIndex)}
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
              onClick={() => moveTextElementDown(selectedTextIndex)}
              disabled={selectedTextIndex === 0}
              title="Move down in layer order"
              className="h-8 w-8 md:h-10 md:w-10"
            >
              ↓
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveTextElementUp(selectedTextIndex)}
              disabled={selectedTextIndex === textElements.length - 1}
              title="Move up in layer order"
              className="h-8 w-8 md:h-10 md:w-10"
            >
              ↑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleTextElementVisibility(selectedTextIndex)}
              title={textElements[selectedTextIndex]?.visible ? "Hide element" : "Show element"}
              className="h-8 w-8 md:h-10 md:w-10"
            >
              <Eye
                className={`h-3 w-3 md:h-4 md:w-4 ${!textElements[selectedTextIndex]?.visible ? "text-muted-foreground" : ""}`}
              />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-2">
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
                <Label htmlFor="text-content">Text Content</Label>
                <textarea
                  id="text-content"
                  value={textElements[selectedTextIndex]?.text || ""}
                  onChange={(e) => updateTextElement(selectedTextIndex, { text: e.target.value })}
                  className="font-bold w-full min-h-[80px] p-2 rounded border border-input bg-background"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={textElements[selectedTextIndex]?.fontFamily || "Arial"}
                  onValueChange={(value) => updateTextElement(selectedTextIndex, { fontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_FONTS.map((font) => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[textElements[selectedTextIndex]?.fontSize || 72]}
                    min={12}
                    max={200}
                    step={1}
                    onValueChange={(value) => updateTextElement(selectedTextIndex, { fontSize: value[0] })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={12}
                    max={200}
                    value={textElements[selectedTextIndex]?.fontSize || 72}
                    onChange={(e) => updateTextElement(selectedTextIndex, { fontSize: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
                <div className="flex gap-1 mt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateTextElement(selectedTextIndex, { fontSize: 36 })}
                  >
                    36px
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateTextElement(selectedTextIndex, { fontSize: 72 })}
                  >
                    72px
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateTextElement(selectedTextIndex, { fontSize: 120 })}
                  >
                    120px
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={textElements[selectedTextIndex]?.bold ? "default" : "outline"}
                    onClick={() =>
                      updateTextElement(selectedTextIndex, { bold: !textElements[selectedTextIndex]?.bold })
                    }
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={textElements[selectedTextIndex]?.italic ? "default" : "outline"}
                    onClick={() =>
                      updateTextElement(selectedTextIndex, { italic: !textElements[selectedTextIndex]?.italic })
                    }
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={textElements[selectedTextIndex]?.underline ? "default" : "outline"}
                    onClick={() =>
                      updateTextElement(selectedTextIndex, { underline: !textElements[selectedTextIndex]?.underline })
                    }
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
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
                    value={textElements[selectedTextIndex]?.color || "#ffffff"}
                    onChange={(e) => updateTextElement(selectedTextIndex, { color: e.target.value })}
                    className="w-12 h-8 p-1"
                  />
                  <span className="text-sm text-muted-foreground">{textElements[selectedTextIndex]?.color}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded-full border ${textElements[selectedTextIndex]?.color === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateTextElement(selectedTextIndex, { color })}
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
                    checked={!!textElements[selectedTextIndex]?.backgroundEnabled}
                    onCheckedChange={(checked) => updateTextElement(selectedTextIndex, { backgroundEnabled: checked })}
                  />
                </div>
                {textElements[selectedTextIndex]?.backgroundEnabled && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type="color"
                      value={textElements[selectedTextIndex]?.backgroundColor || "#000000"}
                      onChange={(e) => updateTextElement(selectedTextIndex, { backgroundColor: e.target.value })}
                      className="w-12 h-8 p-1"
                    />
                    <span className="text-sm text-muted-foreground">
                      {textElements[selectedTextIndex]?.backgroundColor}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Opacity</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[textElements[selectedTextIndex]?.opacity || 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => updateTextElement(selectedTextIndex, { opacity: value[0] })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={textElements[selectedTextIndex]?.opacity || 100}
                    onChange={(e) => updateTextElement(selectedTextIndex, { opacity: Number(e.target.value) })}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Letter Spacing</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[textElements[selectedTextIndex]?.letterSpacing || 0]}
                    min={-5}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => updateTextElement(selectedTextIndex, { letterSpacing: value[0] })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={-5}
                    max={10}
                    step={0.1}
                    value={textElements[selectedTextIndex]?.letterSpacing || 0}
                    onChange={(e) => updateTextElement(selectedTextIndex, { letterSpacing: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Line Height</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[textElements[selectedTextIndex]?.lineHeight || 1.2]}
                    min={0.5}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => updateTextElement(selectedTextIndex, { lineHeight: value[0] })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={0.5}
                    max={3}
                    step={0.1}
                    value={textElements[selectedTextIndex]?.lineHeight || 1.2}
                    onChange={(e) => updateTextElement(selectedTextIndex, { lineHeight: Number(e.target.value) })}
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
                    variant={textElements[selectedTextIndex]?.layerOrder === "front" ? "default" : "outline"}
                    onClick={() => updateTextElement(selectedTextIndex, { layerOrder: "front" })}
                  >
                    Front
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={textElements[selectedTextIndex]?.layerOrder === "back" ? "default" : "outline"}
                    onClick={() => updateTextElement(selectedTextIndex, { layerOrder: "back" })}
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
                      value={[textElements[selectedTextIndex]?.x ?? 50]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateTextElement(selectedTextIndex, { x: value[0] })}
                      className="flex-1"
                    />
                    <Input
                      id="x-position"
                      type="number"
                      min={0}
                      max={100}
                      value={textElements[selectedTextIndex]?.x ?? 50}
                      onChange={(e) => updateTextElement(selectedTextIndex, { x: Number(e.target.value) })}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="y-position">Y Position (%)</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[textElements[selectedTextIndex]?.y ?? 50]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateTextElement(selectedTextIndex, { y: value[0] })}
                      className="flex-1"
                    />
                    <Input
                      id="y-position"
                      type="number"
                      min={0}
                      max={100}
                      value={textElements[selectedTextIndex]?.y ?? 50}
                      onChange={(e) => updateTextElement(selectedTextIndex, { y: Number(e.target.value) })}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rotation</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[textElements[selectedTextIndex]?.rotation || 0]}
                    min={-180}
                    max={180}
                    step={1}
                    onValueChange={(value) => updateTextElement(selectedTextIndex, { rotation: value[0] })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={-180}
                    max={180}
                    value={textElements[selectedTextIndex]?.rotation || 0}
                    onChange={(e) => updateTextElement(selectedTextIndex, { rotation: Number(e.target.value) })}
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
                      variant={textElements[selectedTextIndex]?.rotation === deg ? "default" : "outline"}
                      onClick={() => updateTextElement(selectedTextIndex, { rotation: deg })}
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
                    value={[textElements[selectedTextIndex]?.maxWidth ?? 80]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={(value) => updateTextElement(selectedTextIndex, { maxWidth: value[0] })}
                    className="flex-1"
                  />
                  <Input
                    id="max-width"
                    type="number"
                    min={10}
                    max={100}
                    value={textElements[selectedTextIndex]?.maxWidth ?? 80}
                    onChange={(e) => updateTextElement(selectedTextIndex, { maxWidth: Number(e.target.value) })}
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
                    checked={!!textElements[selectedTextIndex]?.shadow}
                    onCheckedChange={(checked) => updateTextElement(selectedTextIndex, { shadow: checked })}
                  />
                </div>
                {textElements[selectedTextIndex]?.shadow && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Label className="min-w-[80px]">Shadow Size</Label>
                      <Slider
                        value={[textElements[selectedTextIndex]?.shadowBlur ?? 10]}
                        min={0}
                        max={50}
                        step={1}
                        onValueChange={(value) => updateTextElement(selectedTextIndex, { shadowBlur: value[0] })}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={50}
                        value={textElements[selectedTextIndex]?.shadowBlur ?? 10}
                        onChange={(e) => updateTextElement(selectedTextIndex, { shadowBlur: Number(e.target.value) })}
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="min-w-[80px]">Shadow Color</Label>
                      <Input
                        type="color"
                        value={textElements[selectedTextIndex]?.shadowColor || "#000000"}
                        onChange={(e) => updateTextElement(selectedTextIndex, { shadowColor: e.target.value })}
                        className="w-12 h-8 p-1"
                      />
                      <span className="text-sm text-muted-foreground">
                        {textElements[selectedTextIndex]?.shadowColor}
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
                    checked={!!textElements[selectedTextIndex]?.curve}
                    onCheckedChange={(checked) => updateTextElement(selectedTextIndex, { curve: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Text Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateTextElement(selectedTextIndex, {
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
                      updateTextElement(selectedTextIndex, {
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
                      updateTextElement(selectedTextIndex, {
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
                      updateTextElement(selectedTextIndex, {
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
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row justify-between gap-4">
        <Button variant="outline" onClick={clearTextProperties} className="flex items-center gap-2 text-sm">
          <RotateCw className="h-3 w-3 md:h-4 md:w-4" />
          Reset to Default
        </Button>
        <Button
          type="button"
          onClick={onApply}
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
      </CardFooter>
    </Card>
  )
}
