import { useState, useCallback, useRef, useEffect } from "react"
import { TextElement } from "../types"
import { toast } from "sonner"

export const useTextElements = (
  initialTextElements?: TextElement[],
  onTextElementsChange?: (elements: TextElement[]) => void
) => {
  const [textElements, setTextElements] = useState<TextElement[]>(initialTextElements || [])
  const [activeTextElementId, setActiveTextElementId] = useState<string>("")
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Initialize text elements when initialTextElements changes
  useEffect(() => {
    if (initialTextElements && initialTextElements.length > 0) {
      setTextElements(initialTextElements)
      if (!activeTextElementId || !initialTextElements.find(e => e.id === activeTextElementId)) {
        setActiveTextElementId(initialTextElements[0].id)
      }
    }
  }, [initialTextElements, activeTextElementId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  const handleTextElementChange = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => {
      const newElements = prev.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
      
      // Debounce the parent notification
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

  const handleAddTextElement = useCallback(() => {
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
  }, [])

  const handleRemoveTextElement = useCallback((id: string) => {
    setTextElements(prev => prev.filter(element => element.id !== id))
    if (activeTextElementId === id) {
      setActiveTextElementId(textElements[0]?.id || "")
    }
  }, [activeTextElementId, textElements])

  const duplicateTextElement = useCallback((index: number) => {
    const elementToDuplicate = textElements[index]
    if (!elementToDuplicate) return

    const duplicatedElement: TextElement = {
      ...elementToDuplicate,
      id: `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
  }, [textElements, onTextElementsChange])

  const moveTextElementUp = useCallback((index: number) => {
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
  }, [textElements, onTextElementsChange])

  const moveTextElementDown = useCallback((index: number) => {
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
  }, [textElements, onTextElementsChange])

  const toggleTextElementVisibility = useCallback((index: number) => {
    handleTextElementChange(textElements[index].id, { visible: !textElements[index].visible })
  }, [textElements, handleTextElementChange])

  const clearTextProperties = useCallback(() => {
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
  }, [activeTextElementId, handleTextElementChange])

  return {
    textElements,
    activeTextElementId,
    setActiveTextElementId,
    handleTextElementChange,
    handleAddTextElement,
    handleRemoveTextElement,
    duplicateTextElement,
    moveTextElementUp,
    moveTextElementDown,
    toggleTextElementVisibility,
    clearTextProperties,
  }
} 