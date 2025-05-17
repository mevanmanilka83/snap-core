export interface TextElement {
  id: string
  text: string
  fontFamily: string
  fontSize: number
  color: string
  bold: boolean
  italic: boolean
  backgroundEnabled: boolean
  backgroundColor: string
  x: number
  y: number
  rotation: number
  maxWidth: number
  opacity: number
  letterSpacing: number
  lineHeight: number
  shadow: boolean
  shadowBlur: number
  shadowColor: string
  curve: boolean
  layerOrder: "front" | "back"
  visible: boolean
  position?: "center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "center-left" | "center-right" | "bottom-center"
  textAlign?: "left" | "center" | "right" | "justify"
  underline?: boolean
} 