import * as backgroundRemoval from "@imgly/background-removal"

// Handle messages from the main thread
self.onmessage = async (e) => {
  try {
    const { imageSrc } = e.data

    // Validate image source
    if (!imageSrc) {
      throw new Error("No image source provided")
    }

    console.log("Worker: Starting background removal for image:", imageSrc)
    console.log("Worker: backgroundRemoval library loaded:", !!backgroundRemoval)
    console.log("Worker: backgroundRemoval.removeBackground available:", typeof backgroundRemoval.removeBackground)
    
    // Test if the library is properly imported
    if (!backgroundRemoval) {
      throw new Error("Background removal library not loaded")
    }
    
    if (typeof backgroundRemoval.removeBackground !== 'function') {
      throw new Error("Background removal function not available")
    }

    // Configure background removal with optimized parameters for speed
    const options = {
      model: "isnet" as const,
      progress: (_: string, current: number, total: number) => {
        // Only send progress updates every 10% to reduce overhead
        const progress = Math.round((current / total) * 100)
        if (progress % 10 === 0) {
          self.postMessage({ type: "progress", progress })
        }
      },
      // Optimize parameters for speed over quality
      alphaMatting: false, // Disable alpha matting for speed
      debug: false,
      proxyToWorker: true,
      // Optimize segmentation parameters for speed
      segmentation: {
        threshold: 0.7, // Higher threshold for faster processing
        minSize: 50, // Smaller minimum size
        maxSize: 5000, // Smaller maximum size
      },
      // Add performance optimizations
      outputFormat: "image/png",
      outputQuality: 0.8, // Slightly lower quality for speed
    }

    console.log("Worker: Options configured:", options)

    // Fetch the image data with CORS support
    console.log("Worker: Fetching image from:", imageSrc)
    let response;
    try {
      response = await fetch(imageSrc, {
        mode: 'cors',
        credentials: 'omit'
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      }
    } catch (fetchError) {
      console.error("Worker: Fetch error:", fetchError)
      // Try alternative fetch method for blob URLs
      if (imageSrc.startsWith('blob:')) {
        try {
          response = await fetch(imageSrc)
          if (!response.ok) {
            throw new Error(`Failed to fetch blob image: ${response.status} ${response.statusText}`)
          }
        } catch (blobError) {
          console.error("Worker: Blob fetch error:", blobError)
          throw new Error(`Failed to access image data: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`)
        }
      } else {
        throw new Error(`Failed to fetch image: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`)
      }
    }

    // Get the image as a blob
    let blob;
    try {
      blob = await response.blob()
      if (!blob || blob.size === 0) {
        throw new Error("Invalid image data received")
      }
      
      // Validate image format
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(blob.type)) {
        console.warn("Worker: Unsupported image type:", blob.type, "Attempting to process anyway...")
      }
      
      console.log("Worker: Image blob size:", blob.size, "type:", blob.type)
    } catch (blobError) {
      console.error("Worker: Blob error:", blobError)
      throw new Error(`Failed to create blob: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`)
    }

    // Resize image for faster processing if it's too large
    const maxDimension = 1024; // Maximum width/height for processing
    let blobUrl;
    try {
      blobUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const { width, height } = img;
            
            // Calculate new dimensions while maintaining aspect ratio
            let newWidth = width;
            let newHeight = height;
            
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                newWidth = maxDimension;
                newHeight = (height * maxDimension) / width;
              } else {
                newHeight = maxDimension;
                newWidth = (width * maxDimension) / height;
              }
              console.log(`Worker: Resizing image from ${width}x${height} to ${newWidth}x${newHeight} for faster processing`);
            }
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            // Draw resized image
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            // Convert to blob
            canvas.toBlob((resizedBlob) => {
              if (resizedBlob) {
                const resizedBlobUrl = URL.createObjectURL(resizedBlob);
                resolve(resizedBlobUrl);
              } else {
                // Fallback to original
                resolve(URL.createObjectURL(blob));
              }
            }, 'image/png', 0.9);
          } catch (error) {
            console.error("Worker: Image processing error:", error);
            // Fallback to original
            resolve(URL.createObjectURL(blob));
          }
        };
        
        img.onerror = () => {
          console.error("Worker: Failed to load image for resizing");
          // Fallback to original
          resolve(URL.createObjectURL(blob));
        };
        img.src = URL.createObjectURL(blob);
      });
    } catch (resizeError) {
      console.error("Worker: Resize error:", resizeError);
      // Fallback to original blob
      blobUrl = URL.createObjectURL(blob);
    }

    try {
      console.log("Worker: Starting background removal processing")
      
      // Test if the library is working by trying a simple operation first
      if (!backgroundRemoval || typeof backgroundRemoval.removeBackground !== 'function') {
        throw new Error("Background removal library not properly loaded")
      }
      
      console.log("Worker: Calling background removal with options:", options)
      
      // Process the image with imgly background removal
      const processedBlob = await backgroundRemoval.removeBackground(blobUrl, options)
      console.log("Worker: Background removal completed, blob size:", processedBlob.size)

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl)
    
      // Send the processed image back to the main thread
      self.postMessage({ type: 'complete', data: processedBlob })
    } catch (error) {
      // Clean up the blob URL in case of error
      URL.revokeObjectURL(blobUrl)
      console.error("Worker: Background removal error:", error)
      console.error("Worker: Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      })
      
      // Try alternative approach for data URL or blob URL issues
      if (error instanceof Error && error.message.includes('Failed to access image data')) {
        console.log("Worker: Trying alternative approach with direct blob...")
        try {
          // Try processing the blob directly instead of the URL
          const processedBlob = await backgroundRemoval.removeBackground(blob, options)
          console.log("Worker: Alternative approach successful, blob size:", processedBlob.size)
          self.postMessage({ type: 'complete', data: processedBlob })
          return
        } catch (altError) {
          console.error("Worker: Alternative approach also failed:", altError)
        }
      }
      
      throw error
    }
  } catch (error) {
    console.error("Worker error:", error)
    self.postMessage({ 
      type: 'error', 
      error: error instanceof Error ? error.message : "Failed to remove background" 
    })
  }
}

// Export an empty object to satisfy TypeScript
export {} 