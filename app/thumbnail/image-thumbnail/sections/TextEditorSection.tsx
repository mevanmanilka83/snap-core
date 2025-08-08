import SharedTextEditorSection from "@/features/thumbnail/common/ThumbnailTextEditorSection";

const TextEditorSection = (props: any) => {
  const { onApply, isCreatingThumbnail, processedImageSrc, textElements, onTextElementsChange, backgroundRemoved } = props;

  return (
    <SharedTextEditorSection
      title="Text Editor"
      ready={!!backgroundRemoved}
      blockedTitle="Please remove the background before editing text"
      blockedHint="Go to the Background Removal section and click Remove Background"
      onApply={onApply}
      isCreatingThumbnail={isCreatingThumbnail}
      processedImageSrc={processedImageSrc}
      textElements={textElements}
      onTextElementsChange={onTextElementsChange}
    />
  );
};

export default TextEditorSection; 