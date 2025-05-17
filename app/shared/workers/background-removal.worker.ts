import * as backgroundRemoval from "@imgly/background-removal"

// Handle messages from the main thread
self.onmessage = async (e) => {
  try {
    const { imageSrc } = e.data

    // Validate image source
    if (!imageSrc) {
      throw new Error("No image source provided")
    }

    // Configure background removal with optimized parameters
    const options = {
      model: "isnet" as const,
      progress: (key: string, current: number, total: number) => {
        // Only send progress updates every 5%
        const progress = Math.round((current / total) * 100)
        if (progress % 5 === 0) {
          self.postMessage({ type: 'progress', data: progress })
        }
      },
      // Optimize parameters for better performance
      alphaMatting: true,
      alphaMattingForegroundThreshold: 240,
      alphaMattingBackgroundThreshold: 10,
      alphaMattingErodeSize: 10,
      debug: false,
      proxyToWorker: true,
      // Optimize segmentation parameters
      segmentation: {
        threshold: 0.5,
        minSize: 100,
        maxSize: 10000,
      }
    }

    // Fetch the image data
    const response = await fetch(imageSrc)
    if (!response.ok) {
      throw new Error("Failed to fetch image")
    }

    // Get the image as a blob
    const blob = await response.blob()
    if (!blob || blob.size === 0) {
      throw new Error("Invalid image data received")
    }

    // Create a blob URL for the image
    const blobUrl = URL.createObjectURL(blob)

    try {
      // Process the image with imgly background removal
      const processedBlob = await backgroundRemoval.removeBackground(blobUrl, options)

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl)

      // Send the processed image back to the main thread
      self.postMessage({ type: 'complete', data: processedBlob })
    } catch (error) {
      // Clean up the blob URL in case of error
      URL.revokeObjectURL(blobUrl)
      throw error
    }
  } catch (error) {
    console.error("Worker error:", error)
    self.postMessage({ 
      type: 'error', 
      data: error instanceof Error ? error.message : "Failed to remove background" 
    })
  }
}

// Export an empty object to satisfy TypeScript
export {} 