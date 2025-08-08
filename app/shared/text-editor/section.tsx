"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TextEditor from "@/app/shared/text-editor"
import { AlertCircle } from "lucide-react"

interface SharedTextEditorSectionProps {
  title?: string
  ready: boolean
  blockedTitle?: string
  blockedHint?: string
  onApply: () => void
  isCreatingThumbnail: boolean
  processedImageSrc: string | null
  textElements: any[]
  onTextElementsChange: (elements: any[]) => void
}

export default function SharedTextEditorSection({
  title = "Text Editor",
  ready,
  blockedTitle = "Please complete the previous step before editing text",
  blockedHint,
  onApply,
  isCreatingThumbnail,
  processedImageSrc,
  textElements,
  onTextElementsChange,
}: SharedTextEditorSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {!ready ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-10 w-10 mx-auto mb-3 text-yellow-500" />
            <p className="text-sm">{blockedTitle}</p>
            {blockedHint && <p className="text-xs mt-2">{blockedHint}</p>}
          </div>
        ) : (
          <TextEditor
            onApply={onApply}
            isCreatingThumbnail={isCreatingThumbnail}
            processedImageSrc={processedImageSrc}
            textElements={textElements}
            onTextElementsChange={onTextElementsChange}
          />
        )}
      </CardContent>
    </Card>
  )
}
