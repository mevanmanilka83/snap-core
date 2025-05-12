'use client';

import ClientWrapper from "./client-wrapper"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Sparkles, ImageIcon, Layers, Download, RefreshCw, Shield } from "lucide-react"
import { WordPullUp } from "@/components/eldoraui/wordpullup"
import ImageGrid from "@/components/home/ImageGrid"

export default function Home() {
  return (
    <div className="w-full">
      {/* Generator Section */}
      <section className="max-w-5xl mx-auto mb-24 px-4">
        <div className="text-center mb-12">
          <WordPullUp text="Try the Thumbnail Generator" className="text-3xl" />
        </div>

        <ImageGrid />

        <div className="flex justify-center">
          <ClientWrapper />
        </div>
      </section>
    </div>
  )
}
