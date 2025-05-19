import { TextElement } from "../types"
import { toast } from "sonner"

export const calculatePosition = (element: TextElement, canvasWidth: number, canvasHeight: number) => {
  const x = canvasWidth * (element.x / 100)
  const y = canvasHeight * (element.y / 100)
  return { x, y }
}

export const renderTextOnCanvas = (
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