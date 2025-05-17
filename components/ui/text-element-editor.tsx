"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Bold, Italic, Trash2, Copy, MoveUp, MoveDown } from "lucide-react"
import { TextElement } from "@/types/text-element"

interface TextElementEditorProps {
  element: TextElement
  onUpdate: (id: string, updates: Partial<TextElement>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

const POPULAR_FONTS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
]

export function TextElementEditor({
  element,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: TextElementEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <Label>Text Element</Label>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveUp(element.id)}
            title="Move up"
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveDown(element.id)}
            title="Move down"
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(element.id)}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(element.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Text Content</Label>
          <Input
            value={element.text}
            onChange={(e) => onUpdate(element.id, { text: e.target.value })}
            placeholder="Enter text..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Font</Label>
            <Select
              value={element.fontFamily}
              onValueChange={(value) => onUpdate(element.id, { fontFamily: value })}
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
                value={[element.fontSize]}
                min={12}
                max={200}
                step={1}
                onValueChange={(value) => onUpdate(element.id, { fontSize: value[0] })}
                className="flex-1"
              />
              <Input
                type="number"
                min={12}
                max={200}
                value={element.fontSize}
                onChange={(e) => onUpdate(element.id, { fontSize: Number(e.target.value) })}
                className="w-20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={element.bold ? "default" : "outline"}
              onClick={() => onUpdate(element.id, { bold: !element.bold })}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={element.italic ? "default" : "outline"}
              onClick={() => onUpdate(element.id, { italic: !element.italic })}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Label>Color</Label>
            <Input
              type="color"
              value={element.color}
              onChange={(e) => onUpdate(element.id, { color: e.target.value })}
              className="w-10 h-10 p-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Background</Label>
            <Switch
              checked={element.backgroundEnabled}
              onCheckedChange={(checked) => onUpdate(element.id, { backgroundEnabled: checked })}
            />
          </div>
          {element.backgroundEnabled && (
            <div className="flex items-center gap-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={element.backgroundColor}
                onChange={(e) => onUpdate(element.id, { backgroundColor: e.target.value })}
                className="w-10 h-10 p-1"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>X (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={element.x}
                onChange={(e) => onUpdate(element.id, { x: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Y (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={element.y}
                onChange={(e) => onUpdate(element.id, { y: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Rotation</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[element.rotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={(value) => onUpdate(element.id, { rotation: value[0] })}
              className="flex-1"
            />
            <Input
              type="number"
              min={-180}
              max={180}
              value={element.rotation}
              onChange={(e) => onUpdate(element.id, { rotation: Number(e.target.value) })}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 