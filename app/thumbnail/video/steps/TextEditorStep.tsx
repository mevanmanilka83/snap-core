import SharedTextEditorSection from "@/features/thumbnail/common/ThumbnailTextEditorSection";
import { useEffect } from "react";
const TextSection = ({
  isCreatingThumbnail,
  processedImageSrc,
  textElements,
  setTextElements,
  handleCreateThumbnail
}: any) => {
  useEffect(() => {
    if (textElements && textElements.some((el: any) => !el.layerOrder)) {
      setTextElements(
        textElements.map((el: any) => ({
          ...el,
          layerOrder: el.layerOrder || "front"
        }))
      );
    }
  }, [textElements]);
  const handleTextElementsChange = (updatedElements: any[]) => {
    setTextElements(
      updatedElements.map(el => ({
        ...el,
        layerOrder: el.layerOrder || "front"
      }))
    );
  };
  return (
    <SharedTextEditorSection
      title="Text Editor"
      ready={!!processedImageSrc}
      blockedTitle="Please remove the background first to add text"
      blockedHint="Go to the Edit tab and use the Remove Background button"
      onApply={handleCreateThumbnail}
      isCreatingThumbnail={isCreatingThumbnail}
      processedImageSrc={processedImageSrc}
      textElements={textElements}
      onTextElementsChange={handleTextElementsChange}
    />
  );
};
export default TextSection; 