import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function Terms() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <Separator className="mb-6" />
        </div>

        <div className="space-y-6">
          <p className="text-base leading-relaxed">
            Welcome to Snap Core! By using this browser-based thumbnail generator, you agree to these terms. Please read
            them carefully.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Browser-Based Processing</h2>
            <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
              <p className="mb-3">
                <strong>Local Processing:</strong> Snap Core processes all images and videos entirely in your browser.
                Your files are <strong>never uploaded</strong> to our servers or shared with third parties. You maintain
                complete control over your content at all times.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">User Content & Rights</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>Content Ownership:</strong> You retain all rights to your original content. You are solely
                  responsible for ensuring you have the necessary rights to use and modify any images, videos, or text
                  you process with Snap Core.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>Copyright Compliance:</strong> Do not use copyrighted, illegal, or offensive material unless
                  you have explicit permission to do so. You are responsible for any copyright violations or legal
                  issues arising from your use of Snap Core.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">AI Features & Results</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>Background Removal:</strong> Our AI-powered background removal feature processes images
                  locally in your browser. The quality of results may vary depending on the input image and your
                  device's capabilities.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>Text Overlay:</strong> Text customization and overlay features are processed entirely in your
                  browser. You are responsible for the content and placement of any text you add to your thumbnails.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Data & Privacy</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>No Data Storage:</strong> Snap Core does not store your images, videos, or generated
                  thumbnails. All processing is temporary and occurs only in your browser. Closing or refreshing the
                  page will clear all local data.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>Analytics:</strong> We collect only anonymous usage statistics to improve our service. No
                  personal data or content is collected or analyzed.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations & Liability</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>Service Quality:</strong> Snap Core is provided "as is" without any warranties. We do not
                  guarantee perfect results for every image or video.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>No Liability:</strong> Snap Core and its creators are not liable for any damages, losses, or
                  legal issues resulting from your use of this service or the content you create.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
            <p className="mb-4">
              We may update these terms at any time. Significant changes will be posted on this page. Continued use of
              Snap Core means you accept any updates.
            </p>
          </section>

          <Separator className="my-8" />

          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">Last updated: May 11, 2025</p>
            <Link href="/privacy" className="text-sm underline hover:text-slate-900 dark:hover:text-slate-100">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
