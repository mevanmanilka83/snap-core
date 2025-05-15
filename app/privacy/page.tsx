import { Separator } from "@/components/ui/separator"
import Link from "next/link"
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
          At Snap Core, your privacy is our priority. This Privacy Policy explains how we handle your information when you use our browser-based thumbnail generator.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Information Collection & Processing</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">In-Browser Processing</h3>
              <p className="text-base">All image and video processing, including background removal and text overlay, happens entirely in your browser. Your files are never uploaded to our servers or shared with third parties.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Usage Analytics</h3>
              <p className="text-base">We collect minimal, anonymous usage statistics such as feature usage and performance metrics to improve Snap Core. We do not collect or analyze the content of your images, videos, or text.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Cookies</h3>
              <p className="text-base">Snap Core uses only essential cookies to maintain your session and preferences. No tracking or advertising cookies are used.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Service Improvement</h3>
              <p className="text-base">Anonymous usage data helps us enhance Snap Core's features and performance. No personal or file content data is collected.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Support</h3>
              <p className="text-base">If you contact us for help, we may use the information you provide to assist you, but we never access your files.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Third Parties</h2>
          <p className="mb-4 text-base">
            We do not share your files or personal data with any third parties. Any analytics services we use cannot access your images, videos, or text.
          </p>

          <h2 className="text-xl font-semibold mb-4">Your Rights & Control</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">File Control</h3>
              <p className="text-base">Your files remain on your device and are never stored by Snap Core. Closing or refreshing the page deletes all local data.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Cookie Management</h3>
              <p className="text-base">You can manage cookies through your browser settings.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <p className="mb-6 text-base">
            We use standard security practices to protect any anonymous usage data. For your safety, always use Snap Core on trusted devices and networks.
          </p>

          <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
          <p className="mb-4 text-base">
            We may update this Privacy Policy from time to time. Significant changes will be posted on this page. Continued use of Snap Core means you accept any updates.
          </p>
        </section>
      </div>

      <footer className="mt-8 text-sm text-center">
        <p>Last updated May 11, 2025</p>
      </footer>
    </article>
  )
}
