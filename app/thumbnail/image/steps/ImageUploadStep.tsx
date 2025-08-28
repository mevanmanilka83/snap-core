import ImageDropZone from "@/features/thumbnail/common/ImageDropZone";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
const ImageSection = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg">Image Upload</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Upload or drag and drop an image</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <ImageDropZone />
      </CardContent>
    </Card>
  );
};
export default ImageSection; 