import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Snap Core",
  description: "Terms of service for Snap Core - a browser-based thumbnail generator that processes everything locally in your browser.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function Terms() {
  return (
    <article className="max-w-7xl mx-auto py-8 px-4 bg-background">
      <header>
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <Separator className="mb-6" />
        
        <p className="mb-6 text-base">
          By using Snap Core's browser-based thumbnail generator, you agree to these terms. Please read them carefully.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Thumbnail Generation</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Local Processing</h3>
              <p className="text-base">Snap Core processes all videos, images, and text overlays entirely in your browser. Your content is never uploaded to our servers or shared with third parties. You maintain complete control over your thumbnails and their components at all times.</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Content & Rights</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Content Ownership</h3>
              <p className="text-base">You retain all rights to your original videos, images, and text overlays. You are solely responsible for ensuring you have the necessary rights to use and modify any content you process with Snap Core.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Copyright Compliance</h3>
              <p className="text-base">Do not use copyrighted videos, images, or text unless you have explicit permission to do so. You are responsible for any copyright violations or legal issues arising from your use of Snap Core's thumbnail generation features.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Features & Results</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Video Frame Extraction</h3>
              <p className="text-base">Our video frame extraction feature processes videos locally in your browser. The quality of extracted frames may vary depending on the video quality and your device's capabilities.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Text Editor</h3>
              <p className="text-base">Text customization and overlay features are processed entirely in your browser. You are responsible for the content, styling, and placement of any text you add to your thumbnails.</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Data & Privacy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">No Data Storage</h3>
              <p className="text-base">Snap Core does not store your videos, images, or generated thumbnails. All processing, including frame extraction and text overlay, is temporary and occurs only in your browser. Closing or refreshing the page will clear all local data.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Analytics</h3>
              <p className="text-base">We collect only anonymous usage statistics to improve our thumbnail generation service. No personal data or content is collected or analyzed.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Limitations & Liability</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Service Quality</h3>
              <p className="text-base">Snap Core is provided as is without any warranties. We do not guarantee perfect results for every video frame extraction, text overlay, or thumbnail generation.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">No Liability</h3>
              <p className="text-base">Snap Core and its creators are not liable for any damages, losses, or legal issues resulting from your use of this service or the thumbnails you create.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
          <p className="mb-4 text-base">
            We may update these terms at any time. Significant changes will be posted on this page. Continued use of Snap Core means you accept any updates.
          </p>
        </section>
      </div>

      <footer className="mt-8 text-sm text-center">
        <p>Last updated May 15, 2024</p>
      </footer>
    </article>
  );
}
