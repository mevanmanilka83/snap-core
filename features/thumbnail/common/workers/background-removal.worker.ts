import * as backgroundRemoval from "@imgly/background-removal"
self.onmessage = async (e) => {
  try {
    const { imageSrc } = e.data
    if (!imageSrc) {
      throw new Error("No image source provided")
    }
    console.log("Worker: Starting background removal for image:", imageSrc)
    console.log("Worker: backgroundRemoval library loaded:", !!backgroundRemoval)
    console.log("Worker: backgroundRemoval.removeBackground available:", typeof backgroundRemoval.removeBackground)
    if (!backgroundRemoval) {
      throw new Error("Background removal library not loaded")
    }
    if (typeof backgroundRemoval.removeBackground !== 'function') {
      throw new Error("Background removal function not available")
    }
    const options = {
      model: "isnet" as const,
      progress: (_: string, current: number, total: number) => {
        const progress = Math.round((current / total) * 100)
        if (progress % 10 === 0) {
          self.postMessage({ type: "progress", progress })
        }
      },
      alphaMatting: false,
      debug: false,
      proxyToWorker: true,
      segmentation: {
        threshold: 0.7,
        minSize: 50,
        maxSize: 5000,
      },
      outputFormat: "image/png",
      outputQuality: 0.8,
    }
    console.log("Worker: Options configured:", options)
    
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
    
    let blob;
    try {
      blob = await response.blob()
      if (!blob || blob.size === 0) {
        throw new Error("Invalid image data received")
      }
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(blob.type)) {
        console.warn("Worker: Unsupported image type:", blob.type, "Attempting to process anyway...")
      }
      console.log("Worker: Image blob size:", blob.size, "type:", blob.type)
    } catch (blobError) {
      console.error("Worker: Blob error:", blobError)
      throw new Error(`Failed to create blob: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`)
    }
    
    const maxDimension = 1024; 
    let blobUrl;
    try {
      blobUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const { width, height } = img;
            
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
            
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            canvas.toBlob((resizedBlob) => {
              if (resizedBlob) {
                const resizedBlobUrl = URL.createObjectURL(resizedBlob);
                resolve(resizedBlobUrl);
              } else {
                
                resolve(URL.createObjectURL(blob));
              }
            }, 'image/png', 0.9);
          } catch (error) {
            console.error("Worker: Image processing error:", error);
            
            resolve(URL.createObjectURL(blob));
          }
        };
        img.onerror = () => {
          console.error("Worker: Failed to load image for resizing");
          
          resolve(URL.createObjectURL(blob));
        };
        img.src = URL.createObjectURL(blob);
      });
    } catch (resizeError) {
      console.error("Worker: Resize error:", resizeError);
      
      blobUrl = URL.createObjectURL(blob);
    }
    try {
      console.log("Worker: Starting background removal processing")
      
      if (!backgroundRemoval || typeof backgroundRemoval.removeBackground !== 'function') {
        throw new Error("Background removal library not properly loaded")
      }
      console.log("Worker: Calling background removal with options:", options)
      
      const processedBlob = await backgroundRemoval.removeBackground(blobUrl, options)
      console.log("Worker: Background removal completed, blob size:", processedBlob.size)
      
      URL.revokeObjectURL(blobUrl)
      
      self.postMessage({ type: 'complete', data: processedBlob })
    } catch (error) {
      
      URL.revokeObjectURL(blobUrl)
      console.error("Worker: Background removal error:", error)
      console.error("Worker: Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      })
      
      if (error instanceof Error && error.message.includes('Failed to access image data')) {
        console.log("Worker: Trying alternative approach with direct blob...")
        try {
          
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
export {} 