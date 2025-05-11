import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <Separator className="mb-6" />
        </div>

        <div className="space-y-6">
          <p className="text-base leading-relaxed">
            At Snap Core, your privacy is our priority. This Privacy Policy explains how we handle your information when
            you use our browser-based thumbnail generator.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information Collection & Processing</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>In-Browser Processing:</strong> All image and video processing, including AI background
                  removal and text overlay, happens entirely in your browser. Your files are{" "}
                  <strong>never uploaded</strong> to our servers or shared with third parties.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>Usage Analytics:</strong> We collect minimal, anonymous usage statistics (such as feature
                  usage and performance metrics) to improve Snap Core. We do <strong>not</strong> collect or analyze the
                  content of your images, videos, or text.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-4">
                  <strong>Cookies:</strong> Snap Core uses only essential cookies to maintain your session and
                  preferences. No tracking or advertising cookies are used.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>Service Improvement:</strong> Anonymous usage data helps us enhance Snap Core's features and
                  performance. No personal or file content data is collected.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>Support:</strong> If you contact us for help, we may use the information you provide to assist
                  you, but we never access your files.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Third Parties</h2>
            <p className="mb-4">
              We do not share your files or personal data with any third parties. Any analytics services we use cannot
              access your images, videos, or text.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights & Control</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-3">
                  <strong>File Control:</strong> Your files remain on your device and are never stored by Snap Core.
                  Closing or refreshing the page deletes all local data.
                </p>
              </div>

              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                <p className="mb-4">
                  <strong>Cookie Management:</strong> You can manage cookies through your browser settings.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
            <p className="mb-4">
              We use standard security practices to protect any anonymous usage data. For your safety, always use Snap
              Core on trusted devices and networks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. Significant changes will be posted on this page.
              Continued use of Snap Core means you accept any updates.
            </p>
          </section>

          <Separator className="my-8" />

          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">Last updated: May 11, 2025</p>
            <Link href="/terms" className="text-sm underline hover:text-slate-900 dark:hover:text-slate-100">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
