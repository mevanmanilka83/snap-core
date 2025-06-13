'use client';

import ClientWrapper from "./client-wrapper"
import HeroSection from "@/components/home/hero-section"
import FAQSection from "@/components/home/faq"
import HowItWorks from "@/components/home/how-it-works"
import TextMarqueeSection from "@/components/home/text-marquee-section"

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />

      <HowItWorks />

      {/* Generator Section */}
      <section className="max-w-5xl mx-auto mb-24 px-4">
        <div className="flex justify-center">
          <ClientWrapper />
        </div>
      </section>

      <FAQSection />
      <TextMarqueeSection />
    </div>
  )
}
