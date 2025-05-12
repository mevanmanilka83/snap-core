import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Layers, Download, RefreshCw } from "lucide-react"
import { WordPullUp } from "@/components/eldoraui/wordpullup"

const features = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI-Powered",
    description: "Leverage advanced AI to create professional thumbnails in seconds.",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Customizable",
    description: "Adjust styles, colors, and elements to match your brand.",
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Unlimited Generations",
    description: "Create as many variations as you need until you find the perfect one.",
  },
  {
    icon: <Download className="h-5 w-5" />,
    title: "Easy Export",
    description: "Download in multiple formats optimized for different platforms.",
  },
]

export default function FeatureSection() {
  return (
    <section className="max-w-5xl mx-auto mb-24 px-4">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
    Features
  </Badge>
  <WordPullUp text="Everything You Need for Perfect Thumbnails" className="text-3xl md:text-4xl mb-4" />
  <p className="text-muted-foreground max-w-2xl mx-auto">
    Our AI-powered thumbnail generator provides all the tools you need to create stunning visuals that capture
    attention.
  </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {features.map((feature, index) => (
    <Card key={index} className="border bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          {feature.icon}
        </div>
        <CardTitle className="text-xl">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  ))}
</div>
    </section>
  )
}
