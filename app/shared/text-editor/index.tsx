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
    },
  ])

  const [activeTextElementId, setActiveTextElementId] = useState<string>("default-text")
  const [activeTab, setActiveTab] = useState<string>("text")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)

  // Initialize with provided text elements if available
  useEffect(() => {
    if (initialTextElements && initialTextElements.length > 0) {
      // Ensure all text elements have required properties
      const formattedElements = initialTextElements.map(element => ({
        ...element,
        text: element.text || "",
        fontSize: element.fontSize || 72,
        color: element.color || "#ffffff",
        fontFamily: element.fontFamily || "Arial",
        x: element.x || 50,
        y: element.y || 50,
        rotation: element.rotation || 0,
        opacity: element.opacity || 100,
        visible: element.visible ?? true,
        layerOrder: element.layerOrder || "front",
        backgroundEnabled: element.backgroundEnabled || false,
        backgroundColor: element.backgroundColor || "#000000",
        shadow: element.shadow || false,
        shadowBlur: element.shadowBlur || 10,
        shadowColor: element.shadowColor || "#000000",
        textAlign: element.textAlign || "center",
        bold: element.bold || false,
        italic: element.italic || false,
        maxWidth: element.maxWidth || 80,
      }))
      setTextElements(formattedElements)
      // Set the first text element as active if none is selected
      if (!activeTextElementId || !formattedElements.find(e => e.id === activeTextElementId)) {
        setActiveTextElementId(formattedElements[0].id)
      }
    }
  }, [initialTextElements])

  const handleAddTextElement = () => {
    const newId = `text-${Date.now()}`
    const newElement: TextElement = {
      id: newId,
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

  const handleTextElementChange = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev =>
      prev.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
    )
  }

  const activeTextElement = textElements.find(element => element.id === activeTextElementId)

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
    const elements = textElements.filter(element => element.visible)
    elements.forEach((element) => {
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
          element.fontSize + padding * 2
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
      ctx.fillText(element.text, 0, 0)

      // Restore context state
      ctx.restore()
    })
  }, [processedImageSrc, textElements])

  // Handle apply button click
  const handleApply = () => {
    // Ensure all text elements are properly formatted
    const formattedElements = textElements.map(element => ({
      ...element,
      text: element.text.trim(), // Remove extra whitespace
      lineHeight: element.lineHeight || 1.2, // Ensure line height is set
      opacity: element.opacity || 100, // Ensure opacity is set
      visible: element.visible ?? true, // Ensure visibility is set
      textAlign: element.textAlign || "center", // Ensure text alignment is set
      layerOrder: element.layerOrder || "front", // Ensure layer order is set
      fontSize: element.fontSize || 72, // Ensure font size is set
      color: element.color || "#ffffff", // Ensure color is set
      fontFamily: element.fontFamily || "Arial", // Ensure font family is set
      bold: element.bold || false, // Ensure bold is set
      italic: element.italic || false, // Ensure italic is set
      backgroundEnabled: element.backgroundEnabled || false, // Ensure background is set
      backgroundColor: element.backgroundColor || "#000000", // Ensure background color is set
      shadow: element.shadow || false, // Ensure shadow is set
      shadowBlur: element.shadowBlur || 10, // Ensure shadow blur is set
      shadowColor: element.shadowColor || "#000000", // Ensure shadow color is set
      x: element.x || 50, // Ensure x position is set
      y: element.y || 50, // Ensure y position is set
      rotation: element.rotation || 0, // Ensure rotation is set
      maxWidth: element.maxWidth || 80, // Ensure max width is set
    }))

    // Update the text elements with formatted values
    setTextElements(formattedElements)
    
    // Notify parent component of the final state
    if (onTextElementsChange) {
      onTextElementsChange(formattedElements)
    }

    // Call the onApply callback
    onApply()
  }

  // Generate unique ID for new text elements
  const generateUniqueId = () => {
    return `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`
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

    setActiveTextElementId(duplicatedElement.id)
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

    handleTextElementChange(activeTextElementId, defaultElement)
    toast.success("Text properties reset to default")
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

    setActiveTextElementId(textElements[index + 1].id)
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

    setActiveTextElementId(textElements[index - 1].id)
  }

  // Toggle text element visibility
  const toggleTextElementVisibility = (index: number) => {
    handleTextElementChange(textElements[index].id, { visible: !textElements[index].visible })
  }

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

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Force a re-render of the canvas when switching tabs
    if (canvasRef.current && previewImageRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(previewImageRef.current, 0, 0, canvas.width, canvas.height)
      }
    }
  }

  return (
    <div className="w-full space-y-4">
      {processedImageSrc && (
        <div className="relative border rounded-md overflow-hidden w-full md:w-auto">
          <canvas ref={canvasRef} className="w-full md:w-[160px] h-[90px]" />
          <img
            ref={previewImageRef}
            src={processedImageSrc || "/placeholder.svg"}
            alt="Background"
            className="hidden"
            onLoad={() => {
              if (canvasRef.current && previewImageRef.current) {
                const canvas = canvasRef.current
                const ctx = canvas.getContext("2d")
                if (ctx) {
                  ctx.drawImage(previewImageRef.current, 0, 0, canvas.width, canvas.height)
                }
              }
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

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select
            value={activeTextElementId}
            onValueChange={(value) => setActiveTextElementId(value)}
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
                  <div key={element.id} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
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
                          className="h-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Quick style controls for each text element */}
                      <div className="flex flex-wrap gap-2">
                        <Select
                          value={element.fontFamily}
                          onValueChange={(value) => handleTextElementChange(element.id, { fontFamily: value })}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Font" />
                          </SelectTrigger>
                          <SelectContent>
                            {POPULAR_FONTS.slice(0, 5).map((font) => (
                              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                {font}
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
