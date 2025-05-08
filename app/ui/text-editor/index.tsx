"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RotateCw, Download } from "lucide-react";
import { toast } from "sonner";

interface TextElement {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  rotation: number;
  fontFamily: string;
  position: "center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "center-left" | "center-right" | "bottom-center";
  maxWidth?: number;
  curve?: boolean;
  backgroundColor?: string;
  backgroundEnabled?: boolean;
  shadow?: boolean;
  shadowBlur?: number;
  shadowColor?: string;
}

interface TextEditorProps {
  onApply: () => void;
  isCreatingThumbnail: boolean;
  processedImageSrc: string | null;
}

export default function TextEditor({ onApply, isCreatingThumbnail, processedImageSrc }: TextEditorProps) {
  const [textElements, setTextElements] = useState<TextElement[]>([
    { 
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
      backgroundColor: "",
      backgroundEnabled: false,
      shadow: true,
      shadowBlur: 10,
      shadowColor: "#000000"
    }
  ]);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0);

  // Update text element properties
  const updateTextElement = (index: number, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map((element, i) => 
        i === index ? { ...element, ...updates } : element
      )
    );
  };

  // Add new text element
  const addTextElement = () => {
    const newElement: TextElement = {
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
      backgroundColor: "",
      backgroundEnabled: false,
      shadow: true,
      shadowBlur: 10,
      shadowColor: "#000000"
    };
    
    setTextElements(prev => [...prev, newElement]);
    setSelectedTextIndex(textElements.length);
  };

  // Clear text properties to default values
  const clearTextProperties = () => {
    const defaultElement: TextElement = {
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
      backgroundColor: "",
      backgroundEnabled: false,
      shadow: true,
      shadowBlur: 10,
      shadowColor: "#000000"
    };
    
    updateTextElement(selectedTextIndex, defaultElement);
    toast.success("Text properties reset to default");
  };

  // Remove text element
  const removeTextElement = (index: number) => {
    if (textElements.length <= 1) {
      toast.error("Cannot remove the last text element");
      return;
    }
    
    setTextElements(prev => prev.filter((_, i) => i !== index));
    setSelectedTextIndex(0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Text Editor</CardTitle>
        <CardDescription>
          Customize text for your thumbnail
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Select 
              value={selectedTextIndex.toString()} 
              onValueChange={(value) => setSelectedTextIndex(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select text" />
              </SelectTrigger>
              <SelectContent>
                {textElements.map((element, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {element.text.substring(0, 15)}{element.text.length > 15 ? '...' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={addTextElement}>
              Add Text
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => removeTextElement(selectedTextIndex)}
              disabled={textElements.length <= 1}
            >
              Remove
            </Button>
          </div>
        </div>

        <div className="space-y-3 border p-3 rounded-md">
          <div className="space-y-1">
            <Label htmlFor="text-content">Text Content</Label>
            <textarea
              id="text-content"
              value={textElements[selectedTextIndex]?.text || ''}
              onChange={(e) => updateTextElement(selectedTextIndex, { text: e.target.value })}
              className="font-bold w-full min-h-[60px] p-2 rounded border border-input bg-background"
              rows={3}
            />
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={!!textElements[selectedTextIndex]?.curve}
                  onChange={e => updateTextElement(selectedTextIndex, { curve: e.target.checked })}
                />
                Curve Text
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={!!textElements[selectedTextIndex]?.backgroundEnabled}
                  onChange={e => updateTextElement(selectedTextIndex, { backgroundEnabled: e.target.checked })}
                />
                Text Background
              </label>
              <input
                type="color"
                value={textElements[selectedTextIndex]?.backgroundColor || '#00000000'}
                onChange={e => updateTextElement(selectedTextIndex, { backgroundColor: e.target.value })}
                className="w-8 h-6 p-0 border-none bg-transparent"
                disabled={!textElements[selectedTextIndex]?.backgroundEnabled}
              />
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={!!textElements[selectedTextIndex]?.shadow}
                  onChange={e => updateTextElement(selectedTextIndex, { shadow: e.target.checked })}
                />
                Text Shadow
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Position</Label>
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex gap-1">
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'top-left' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'top-left' })}>Top Left</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'top-center' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'top-center' })}>Top Center</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'top-right' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'top-right' })}>Top Right</Button>
              </div>
              <div className="flex gap-1">
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'center-left' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'center-left' })}>Center Left</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'center' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'center' })}>Center</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'center-right' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'center-right' })}>Center Right</Button>
              </div>
              <div className="flex gap-1">
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'bottom-left' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'bottom-left' })}>Bottom Left</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'bottom-center' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'bottom-center' })}>Bottom Center</Button>
                <Button type="button" size="sm" variant={textElements[selectedTextIndex]?.position === 'bottom-right' ? 'default' : 'outline'} onClick={() => updateTextElement(selectedTextIndex, { position: 'bottom-right' })}>Bottom Right</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <Label htmlFor="x-position">X Position (%)</Label>
                <Input
                  id="x-position"
                  type="number"
                  min={0}
                  max={100}
                  value={textElements[selectedTextIndex]?.x ?? 50}
                  onChange={(e) => updateTextElement(selectedTextIndex, { x: Number(e.target.value) })}
                  className="w-24"
                />
              </div>
              <div>
                <Label htmlFor="y-position">Y Position (%)</Label>
                <Input
                  id="y-position"
                  type="number"
                  min={0}
                  max={100}
                  value={textElements[selectedTextIndex]?.y ?? 50}
                  onChange={(e) => updateTextElement(selectedTextIndex, { y: Number(e.target.value) })}
                  className="w-24"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="max-width">Text Width (%)</Label>
              <Input
                id="max-width"
                type="number"
                min={10}
                max={100}
                value={textElements[selectedTextIndex]?.maxWidth ?? 80}
                onChange={(e) => updateTextElement(selectedTextIndex, { maxWidth: Number(e.target.value) })}
                className="w-24"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Font Size</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={12}
                max={200}
                value={textElements[selectedTextIndex]?.fontSize || 36}
                onChange={(e) => updateTextElement(selectedTextIndex, { fontSize: Number(e.target.value) })}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">px</span>
              <Button type="button" size="sm" variant="outline" onClick={() => updateTextElement(selectedTextIndex, { fontSize: 36 })}>sm</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => updateTextElement(selectedTextIndex, { fontSize: 72 })}>lg</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => updateTextElement(selectedTextIndex, { fontSize: 120 })}>xl</Button>
            </div>
          </div>

          <div className="space-y-1">
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
              <div className="flex gap-1 ml-2">
                {[-45, -15, 0, 15, 45].map((deg) => (
                  <Button
                    key={deg}
                    type="button"
                    size="sm"
                    variant={textElements[selectedTextIndex]?.rotation === deg ? 'default' : 'outline'}
                    onClick={() => updateTextElement(selectedTextIndex, { rotation: deg })}
                  >
                    {deg}&deg;
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={textElements[selectedTextIndex]?.color || '#ffffff'}
                onChange={(e) => updateTextElement(selectedTextIndex, { color: e.target.value })}
                className="w-12 h-8 p-1"
              />
              <span className="text-sm text-muted-foreground">
                {textElements[selectedTextIndex]?.color}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Font Family</Label>
            <Select
              value={textElements[selectedTextIndex]?.fontFamily || 'Arial'}
              onValueChange={(value) => updateTextElement(selectedTextIndex, { fontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <label className="flex items-center gap-1 text-sm">
              Shadow Size
              <Input
                type="number"
                min={0}
                max={50}
                value={textElements[selectedTextIndex]?.shadowBlur ?? 10}
                onChange={e => updateTextElement(selectedTextIndex, { shadowBlur: Number(e.target.value) })}
                className="w-16"
              />
            </label>
            <label className="flex items-center gap-1 text-sm">
              Shadow Color
              <input
                type="color"
                value={textElements[selectedTextIndex]?.shadowColor || '#000000'}
                onChange={e => updateTextElement(selectedTextIndex, { shadowColor: e.target.value })}
                className="w-8 h-6 p-0 border-none bg-transparent"
              />
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={clearTextProperties}
              className="flex items-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Reset to Default
            </Button>
            <Button
              type="button"
              className="ml-2"
              onClick={onApply}
              disabled={!processedImageSrc || isCreatingThumbnail}
            >
              {isCreatingThumbnail ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                  Applying...
                </span>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 