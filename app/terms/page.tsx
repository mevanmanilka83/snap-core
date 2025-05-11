import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function Terms() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 bg-background">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <hr className="mb-6" />
      
      <p className="mb-6">
        By using this browser-based thumbnail generator, you agree to these terms. Please read them carefully.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Browser-Based Processing</h2>
          <div className="space-y-4">
            <div>
              <strong className="block mb-2 text-base font-semibold">Local Processing</strong>
              <p className="text-base">Snap Core processes all images and videos entirely in your browser. Your files are never uploaded to our servers or shared with third parties. You maintain complete control over your content at all times.</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">User Content & Rights</h2>
          <div className="space-y-4">
            <div>
              <strong className="block mb-2 text-base font-semibold">Content Ownership</strong>
              <p className="text-base">You retain all rights to your original content. You are solely responsible for ensuring you have the necessary rights to use and modify any images, videos, or text you process with Snap Core.</p>
            </div>
            <div>
              <strong className="block mb-2 text-base font-semibold">Copyright Compliance</strong>
              <p className="text-base">Do not use copyrighted, illegal, or offensive material unless you have explicit permission to do so. You are responsible for any copyright violations or legal issues arising from your use of Snap Core.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Features & Results</h2>
          <div className="space-y-4">
            <div>
              <strong className="block mb-2 text-base font-semibold">Background Removal</strong>
              <p className="text-base">Our background removal feature processes images locally in your browser. The quality of results may vary depending on the input image and your device's capabilities.</p>
            </div>
            <div>
              <strong className="block mb-2 text-base font-semibold">Text Overlay</strong>
              <p className="text-base">Text customization and overlay features are processed entirely in your browser. You are responsible for the content and placement of any text you add to your thumbnails.</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Data & Privacy</h2>
          <div className="space-y-4">
            <div>
              <strong className="block mb-2 text-base font-semibold">No Data Storage</strong>
              <p className="text-base">Snap Core does not store your images, videos, or generated thumbnails. All processing is temporary and occurs only in your browser. Closing or refreshing the page will clear all local data.</p>
            </div>
            <div>
              <strong className="block mb-2 text-base font-semibold">Analytics</strong>
              <p className="text-base">We collect only anonymous usage statistics to improve our service. No personal data or content is collected or analyzed.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Limitations & Liability</h2>
          <div className="space-y-4">
            <div>
              <strong className="block mb-2 text-base font-semibold">Service Quality</strong>
              <p className="text-base">Snap Core is provided as is without any warranties. We do not guarantee perfect results for every image or video.</p>
            </div>
            <div>
              <strong className="block mb-2 text-base font-semibold">No Liability</strong>
              <p className="text-base">Snap Core and its creators are not liable for any damages, losses, or legal issues resulting from your use of this service or the content you create.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
          <p className="mb-4 text-base">
            We may update these terms at any time. Significant changes will be posted on this page. Continued use of Snap Core means you accept any updates.
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm text-center">
        Last updated May 11, 2025
      </p>
    </div>
  );
}
