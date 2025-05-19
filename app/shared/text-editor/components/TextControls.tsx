import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Bold, Italic } from "lucide-react"
import { TextElement, POPULAR_FONTS } from "../types"

interface TextControlsProps {
  textElements: TextElement[]
  activeTextElementId: string
  onTextElementSelect: (id: string) => void
  onTextElementChange: (id: string, updates: Partial<TextElement>) => void
  onAddTextElement: () => void
  onRemoveTextElement: (id: string) => void
}

export const TextControls: React.FC<TextControlsProps> = ({
  textElements,
  activeTextElementId,
  onTextElementSelect,
  onTextElementChange,
  onAddTextElement,
  onRemoveTextElement,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Text Content</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddTextElement}
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
              className={`flex gap-2 items-start p-2 rounded-md ${element.id === activeTextElementId ? 'bg-accent' : ''}`}
              onClick={() => onTextElementSelect(element.id)}
            >
              <div className="flex-1 space-y-2">
                <div className="flex gap-2 items-center">
                  <Input
                    value={element.text}
                    onChange={(e) => onTextElementChange(element.id, { text: e.target.value })}
                    className="flex-1"
                    placeholder="Enter text..."
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveTextElement(element.id)}
                    disabled={textElements.length <= 1}
                    className="h-10 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick style controls for each text element */}
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={element.fontFamily}
                    onValueChange={(value) => onTextElementChange(element.id, { fontFamily: value })}
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
                      onChange={(e) => onTextElementChange(element.id, { fontSize: Number(e.target.value) })}
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
                      onClick={() => onTextElementChange(element.id, { bold: !element.bold })}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={element.italic ? "default" : "outline"}
                      onClick={() => onTextElementChange(element.id, { italic: !element.italic })}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    type="color"
                    value={element.color}
                    onChange={(e) => onTextElementChange(element.id, { color: e.target.value })}
                    className="w-10 h-10 p-1"
                  />

                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={element.backgroundEnabled ? "default" : "outline"}
                      onClick={() => onTextElementChange(element.id, { backgroundEnabled: !element.backgroundEnabled })}
                    >
                      <div className="w-4 h-4 border-2 border-current" />
                    </Button>
                    {element.backgroundEnabled && (
                      <Input
                        type="color"
                        value={element.backgroundColor}
                        onChange={(e) => onTextElementChange(element.id, { backgroundColor: e.target.value })}
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
  )
} 