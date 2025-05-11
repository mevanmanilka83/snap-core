import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TextEditor from "@/app/shared/text-editor";

const TextSection = ({
  isCreatingThumbnail,
  processedImageSrc,
  textElements,
  setTextElements,
  handleCreateThumbnail
}: any) => (
  <Card className="w-full">
    <CardHeader className="p-4 md:p-6">
      <CardTitle className="text-base">Text Editor</CardTitle>
    </CardHeader>
    <CardContent className="p-4 md:p-6">
      <TextEditor
        onApply={handleCreateThumbnail}
        isCreatingThumbnail={isCreatingThumbnail}
        processedImageSrc={processedImageSrc}
        textElements={textElements}
        onTextElementsChange={setTextElements}
      />
    </CardContent>
  </Card>
);

export default TextSection; 