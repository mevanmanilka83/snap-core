import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Snap Core",
  description: "Privacy policy for Snap Core - a browser-based thumbnail generator that processes everything locally in your browser.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicy() {
  return (
    <article className="max-w-7xl mx-auto py-8 px-4 bg-background">
      <header>
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <Separator className="mb-6" />
        <p className="mb-6 text-base">
          At Snap Core, we prioritize your privacy. This Privacy Policy explains how we handle your information when you use our browser-based thumbnail generator for creating and customizing video and image thumbnails.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Information Collection & Processing</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Local Processing</h3>
              <p className="text-base">All thumbnail generation, including video frame extraction, image processing, text overlay, and background removal, happens entirely in your browser. Your videos, images, and text content are never uploaded to our servers.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Usage Analytics</h3>
              <p className="text-base">We collect anonymous usage statistics such as feature preferences, thumbnail generation frequency, and performance metrics to improve Snap Core. We do not collect or analyze your video content, images, or text overlays.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Cookies</h3>
              <p className="text-base">Snap Core uses only essential cookies to maintain your session and save your text editor preferences. No tracking or advertising cookies are used.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Feature Enhancement</h3>
              <p className="text-base">Anonymous usage data helps us improve Snap Core's thumbnail generation features, text editor capabilities, and overall performance. No personal or content data is collected.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Technical Support</h3>
              <p className="text-base">If you contact us for help with thumbnail generation or text editing issues, we may use the information you provide to assist you, but we never access your videos, images, or text content.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Third Parties</h2>
          <p className="mb-4 text-base">
            We do not share your videos, images, or text content with any third parties. Any analytics services we use cannot access your thumbnail content or text overlays.
          </p>

          <h2 className="text-xl font-semibold mb-4">Your Rights & Control</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Content Control</h3>
              <p className="text-base">Your videos, images, and generated thumbnails remain on your device and are never stored by Snap Core. Closing or refreshing the page deletes all local data, including extracted frames and text overlays.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Text Editor Preferences</h3>
              <p className="text-base">Your text editor settings and preferences are stored locally and can be cleared through your browser settings.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <p className="mb-6 text-base">
            We use standard security practices to protect any anonymous usage data. For your safety, always use Snap Core on trusted devices and networks, especially when working with sensitive video content or text overlays.
          </p>

          <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
          <p className="mb-4 text-base">
            We may update this Privacy Policy from time to time. Significant changes will be posted on this page. Continued use of Snap Core means you accept any updates.
          </p>
        </section>
      </div>

      <footer className="mt-8 text-sm text-center">
        <p>Last updated May 15, 2024</p>
      </footer>
    </article>
  )
}
