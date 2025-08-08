import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadIcon, ImageIcon } from "lucide-react";

const FileUploadSection = (props: any) => {
  const { 
    activeTab, 
    setActiveTab, 
    handleFileChange, 
    handleURLLoad, 
    isLoading,
    setError,
    setHasAttemptedLoad,
    setIsLoading,
    previewUrl,
    setImageSrc,
    setProcessedImageSrc,
    setThumbnailSrc,
    hiddenImageRef,
    setProcessingProgress,
    setImageLoaded
  } = props;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <UploadIcon className="h-3 w-3 md:h-4 md:w-4" />
          <span>Image from File</span>
        </TabsTrigger>
        <TabsTrigger value="url" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <ImageIcon className="h-3 w-3 md:h-4 md:w-4" />
          <span>Image from URL</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="file" className="space-y-4">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-sm md:text-base">Upload Image File</CardTitle>
            <CardDescription className="text-xs md:text-sm">Select an image file from your device or drag and drop</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <label htmlFor="file-upload">
              <div
                className="flex flex-col items-center justify-center space-y-3 py-6 px-4 md:py-8 md:px-6 border-2 border-gray-300 border-dashed rounded-md transition-colors hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add("border-primary");
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove("border-primary");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove("border-primary");
                  
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith("image/")) {
                      // Create a synthetic change event
                      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
                      if (fileInput) {
                        // Create a DataTransfer object to set files
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        fileInput.files = dataTransfer.files;
                        
                        // Trigger the change handler
                        const event = new Event("change", { bubbles: true });
                        fileInput.dispatchEvent(event);
                      }
                    } else {
                      toast.error("Please drop an image file");
                    }
                  } else if (e.dataTransfer.getData("text/plain")) {
                    const data = e.dataTransfer.getData("text/plain");
                    if (data.startsWith("data:image")) {
                      setError("");
                      setHasAttemptedLoad(true);
                      setIsLoading(true);

                      if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
                        URL.revokeObjectURL(previewUrl.current);
                      }

                      previewUrl.current = data;
                      setImageSrc(data);
                      setProcessedImageSrc(""); // Clear processed image
                      setThumbnailSrc(""); // Clear thumbnail
                      setProcessingProgress(0);

                      const img = hiddenImageRef.current;
                      if (img) {
                        img.src = data;
                      }

                      setImageLoaded(false);
                    }
                  }
                }}
              >
                <UploadIcon className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                <div className="font-medium text-xs md:text-sm text-gray-900 dark:text-gray-50">Drop image here or click to browse</div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
            </label>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="url" className="space-y-4">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-sm md:text-base">Upload from URL</CardTitle>
            <CardDescription className="text-xs md:text-sm">Enter the URL of an image you want to upload</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Input type="url" placeholder="https://example.com/image.jpg" className="col-span-3 text-xs md:text-sm" id="imageUrl" />
              <Button onClick={handleURLLoad} disabled={isLoading} className="flex-1 text-xs md:text-sm h-8 md:h-9">
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-3 w-3 md:h-4 md:w-4 border-2 border-b-transparent border-white rounded-full"></span>
                    Loading
                  </span>
                ) : (
                  "Load"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FileUploadSection; 