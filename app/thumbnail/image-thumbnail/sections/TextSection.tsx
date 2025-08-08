import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TextEditor from "@/features/thumbnail/common/TextEditor";
import { AlertCircle } from "lucide-react";

const TextSection = ({
  isCreatingThumbnail,
  processedImageSrc,
  textElements,
  setTextElements,
  handleCreateThumbnail
}: any) => {
  const handleTextElementsChange = (updatedElements: any[]) => {
    // Ensure each text element has a layerOrder property
    const elementsWithLayerOrder = updatedElements.map(element => ({
      ...element,
      layerOrder: element.layerOrder || "front" // Default to front if not specified
    }));
    setTextElements(elementsWithLayerOrder);
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base">Text Editor</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {!processedImageSrc ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <p className="text-sm">Please remove the background first to add text</p>
            <p className="text-xs mt-2">Go to the Edit tab and use the Remove Background button</p>
          </div>
        ) : (
          <TextEditor
            onApply={handleCreateThumbnail}
            isCreatingThumbnail={isCreatingThumbnail}
            processedImageSrc={processedImageSrc}
            textElements={textElements}
            onTextElementsChange={handleTextElementsChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TextSection; 