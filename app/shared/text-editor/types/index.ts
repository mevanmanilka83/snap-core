export interface TextElement {
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

export interface TextEditorProps {
  onApply: () => void
  isCreatingThumbnail: boolean
  processedImageSrc: string | null
  textElements?: TextElement[]
  onTextElementsChange?: (elements: TextElement[]) => void
}

export const POPULAR_FONTS = [
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

export const PRESET_COLORS = [
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