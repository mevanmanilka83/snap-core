export interface BackgroundRemovalProps {
  inputImageSrc: string
  onProcessed?: (processedImageUrl: string) => void
  width?: number
  height?: number
  showDownload?: boolean
  showProgressBar?: boolean
  className?: string
}

export interface ImageFilters {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  grayscale: number
  sepia: number
} 