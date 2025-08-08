import SharedTextEditorSection from "@/features/thumbnail/common/TextEditorSection";
import { useEffect } from "react";

const TextSection = ({
  isCreatingThumbnail,
  processedImageSrc,
  textElements,
  setTextElements,
  handleCreateThumbnail
}: any) => {
  // Normalize text elements to always have layerOrder (fix legacy data)
  useEffect(() => {
    if (textElements && textElements.some((el: any) => !el.layerOrder)) {
      setTextElements(
        textElements.map((el: any) => ({
          ...el,
          layerOrder: el.layerOrder || "front"
        }))
      );
    }
    // Only run when textElements changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
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