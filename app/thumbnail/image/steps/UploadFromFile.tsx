import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";

interface UploadFromFileProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPickDataUrl: (dataUrl: string) => void;
}

export default function UploadFromFile({ onFileChange, onPickDataUrl }: UploadFromFileProps) {
  return (
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
                  const fileInput = document.getElementById("file-upload") as HTMLInputElement;
                  if (fileInput) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;
                    const event = new Event("change", { bubbles: true });
                    fileInput.dispatchEvent(event);
                  }
                }
              } else if (e.dataTransfer.getData("text/plain")) {
                const data = e.dataTransfer.getData("text/plain");
                if (data.startsWith("data:image")) {
                  onPickDataUrl(data);
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
              onChange={onFileChange}
            />
          </div>
        </label>
      </CardContent>
    </Card>
  );
}
