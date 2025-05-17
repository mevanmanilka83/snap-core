import * as backgroundRemoval from "@imgly/background-removal"

// Handle messages from the main thread
self.onmessage = async (e) => {
  try {
    const { imageSrc } = e.data

    // Configure background removal with more precise parameters
    const options = {
      // Remove publicPath as it's causing issues with URL construction
      model: "isnet" as const,
      progress: (key: string, current: number, total: number) => {
        const progress = Math.round((current / total) * 100)
        self.postMessage({ type: 'progress', data: progress })
      },
      // Add more precise parameters
      alphaMatting: true,
      alphaMattingForegroundThreshold: 240,
      alphaMattingBackgroundThreshold: 10,
      alphaMattingErodeSize: 10,
      debug: false,
      proxyToWorker: true,
      // Add more precise segmentation parameters
      segmentation: {
        threshold: 0.5,
        minSize: 100,
        maxSize: 10000,
      }
    }

    // Validate image source
    if (!imageSrc) {
      throw new Error("No image source provided")
    }

    // Process the image
    const blob = await backgroundRemoval.removeBackground(imageSrc, options)
    
    // Send the result back
    self.postMessage({ type: 'complete', data: blob })
  } catch (error) {
    console.error("Background removal error:", error)
    self.postMessage({ 
      type: 'error', 
      data: error instanceof Error ? error.message : "Failed to remove background" 
    })
  }
}

// Export an empty object to satisfy TypeScript
export {} 