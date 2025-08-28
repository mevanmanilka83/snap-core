import UploadFromFile from "./UploadFromFile";
import UploadFromURL from "./UploadFromURL";
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
    setImageLoaded,
  } = props;
  const handlePickDataUrl = (dataUrl: string) => {
    setError("");
    setHasAttemptedLoad(true);
    setIsLoading(true);
    if (previewUrl.current && previewUrl.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.current);
    }
    previewUrl.current = dataUrl;
    setImageSrc(dataUrl);
    setProcessedImageSrc("");
    setThumbnailSrc("");
    setProcessingProgress(0);
    const img = hiddenImageRef.current;
    if (img) img.src = dataUrl;
    setImageLoaded(false);
  };
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
        <UploadFromFile onFileChange={handleFileChange} onPickDataUrl={handlePickDataUrl} />
      </TabsContent>
      <TabsContent value="url" className="space-y-4">
        <UploadFromURL onLoadUrl={() => handleURLLoad()} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};
export default FileUploadSection;