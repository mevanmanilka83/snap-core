import * as backgroundRemoval from "@imgly/background-removal"
self.onmessage = async (e) => {
  try {
    const { imageSrc } = e.data
    if (!imageSrc) {
      throw new Error("No image source provided")
    }

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

      
      if (imageSrc.startsWith('blob:')) {
        try {
          response = await fetch(imageSrc)
          if (!response.ok) {
            throw new Error(`Failed to fetch blob image: ${response.status} ${response.statusText}`)
          }
        } catch (blobError) {

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

      }

    } catch (blobError) {

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

            
            resolve(URL.createObjectURL(blob));
          }
        };
        img.onerror = () => {

          
          resolve(URL.createObjectURL(blob));
        };
        img.src = URL.createObjectURL(blob);
      });
    } catch (resizeError) {

      
      blobUrl = URL.createObjectURL(blob);
    }
    try {

      
      if (!backgroundRemoval || typeof backgroundRemoval.removeBackground !== 'function') {
        throw new Error("Background removal library not properly loaded")
      }

      
      const processedBlob = await backgroundRemoval.removeBackground(blobUrl, options)

      
      URL.revokeObjectURL(blobUrl)
      
      self.postMessage({ type: 'complete', data: processedBlob })
    } catch (error) {
      
      URL.revokeObjectURL(blobUrl)

      
      if (error instanceof Error && error.message.includes('Failed to access image data')) {

        try {
          
          const processedBlob = await backgroundRemoval.removeBackground(blob, options)

          self.postMessage({ type: 'complete', data: processedBlob })
          return
        } catch (altError) {

        }
      }
      throw error
    }
  } catch (error) {

    self.postMessage({ 
      type: 'error', 
      error: error instanceof Error ? error.message : "Failed to remove background" 
    })
  }
}
export {} 