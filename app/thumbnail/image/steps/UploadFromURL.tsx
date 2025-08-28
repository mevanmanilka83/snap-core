import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface UploadFromURLProps {
  onLoadUrl: (url: string) => void;
  isLoading?: boolean;
}
export default function UploadFromURL({ onLoadUrl, isLoading }: UploadFromURLProps) {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">Upload from URL</CardTitle>
        <CardDescription className="text-xs md:text-sm">Enter the URL of an image you want to upload</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <Input type="url" placeholder="https://example.com/image.jpg" className="col-span-3 text-xs md:text-sm" id="imageUrl" />
          <Button onClick={() => {
            const el = document.getElementById("imageUrl") as HTMLInputElement;
            onLoadUrl(el?.value?.trim() || "");
          }} disabled={!!isLoading} className="flex-1 text-xs md:text-sm h-8 md:h-9">
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
  );
}
