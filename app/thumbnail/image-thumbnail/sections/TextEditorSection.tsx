import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextEditor from "@/app/shared/text-editor";

const TextEditorSection = (props: any) => {
  const { onApply, isCreatingThumbnail, processedImageSrc, textElements, onTextElementsChange, backgroundRemoved } = props;

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">Text Editor</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {!backgroundRemoved ? (
          <div className="text-center text-muted-foreground">
            Please remove the background before editing text.
          </div>
        ) : (
          <TextEditor
            onApply={onApply}
            isCreatingThumbnail={isCreatingThumbnail}
            processedImageSrc={processedImageSrc}
            textElements={textElements}
            onTextElementsChange={onTextElementsChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TextEditorSection; 