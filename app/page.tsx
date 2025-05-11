import ClientWrapper from "@/app/thumbnail/client-wrapper"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Sparkles, ImageIcon, Layers, Download, RefreshCw, Shield } from "lucide-react"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-3xl -z-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            Create Thumbnails Instantly—Right in Your Browser
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Snap Core is a privacy-first, AI-powered tool for generating stunning thumbnails from images or videos. All processing happens in your browser—your files never leave your device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors">
              Get Started
            </button>
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium text-lg hover:bg-secondary/90 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto mb-24 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            Powerful Features
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-4xl mx-auto mb-20 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">How Snap Core Works</h2>
        <ol className="list-decimal list-inside space-y-3 text-base max-w-2xl mx-auto">
          <li><strong>Upload:</strong> Choose an image or video. If you upload a video, select the frame you want to use.</li>
          <li><strong>Remove Background:</strong> Instantly erase backgrounds with AI—no uploads, no waiting.</li>
          <li><strong>Add Text:</strong> Overlay and style text, adjust font, color, and position. Place text in front of or behind your subject.</li>
          <li><strong>Apply Filters:</strong> Fine-tune your thumbnail with brightness, contrast, and color adjustments.</li>
          <li><strong>Preview & Download:</strong> See exactly what you'll get, then download your thumbnail in one click.</li>
        </ol>
      </section>

      {/* Generator Section */}
      <section className="max-w-5xl mx-auto mb-24 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            Try the Thumbnail Generator
          </span>
        </h2>
        <div className="flex justify-center">
          <ClientWrapper />
        </div>
      </section>

      {/* FAQ and Guidelines Section */}
      <section className="max-w-5xl mx-auto mb-24 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            Help & Resources
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card id="faq" className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
              </div>
              <div className="w-16 h-1 bg-primary/50 mx-auto mt-3 rounded-full"></div>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    What is Snap Core and who is it for?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Snap Core is a web app for creators, marketers, and educators who need to quickly generate
                    professional thumbnails from images or videos. It offers background removal, text overlay, and
                    instant preview and download, all in your browser.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    How do I remove the background from an image or video frame?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Upload an image or video, select a frame if using video, then click the Remove Background button.
                    The app uses AI to process your file locally. Your files are never uploaded to external servers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2b" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    Why do I need to remove the background before adding text?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    When you remove the background first, your text pops and is easy to read. It keeps things simple and
                    makes sure your message doesn't get lost. For the best look, just clear the background before adding
                    your text.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    Can I use Snap Core for commercial projects?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, you can use Snap Core to create thumbnails for personal, educational, or commercial projects.
                    However, ensure you have the rights to any images or videos you upload.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    How do I add and customize text on my thumbnail?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Go to the Text Editor tab to add new text, move it, and adjust font, color, size, position, and
                    layer order. Always preview your changes before downloading.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q5" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    What image filters are available and how should I use them?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    You can adjust brightness, contrast, saturation, blur, hue, grayscale, and sepia. Use filters to
                    enhance clarity and focus, but avoid over-processing for accessibility and authenticity.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q6" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    Will the downloaded thumbnail look exactly like the preview?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, what you see in the final preview is exactly what you'll get when you download your thumbnail.
                    Always check the preview before downloading to make sure everything looks right.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q7" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    Can I undo or redo changes if I make a mistake?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, you can undo and redo background removal and text edits using the provided buttons. This helps
                    you experiment safely without losing your work.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q8" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    How do I start over or upload a new image or video?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Select the Cancel button to reset the workflow and upload a new file at any time. This clears your
                    current progress, so make sure to download your work first if needed.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q9" className="border-b border-border/50">
                  <AccordionTrigger className="hover:text-primary transition-colors">
                    Is my data private? Does Snap Core upload my files?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Your files are processed entirely in your browser and are never uploaded to any server. For your
                    privacy and security, always use trusted devices and avoid sharing sensitive content.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card
            id="guideline"
            className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl font-bold">User Guideline</CardTitle>
              </div>
              <div className="w-16 h-1 bg-primary/50 mx-auto mt-3 rounded-full"></div>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="space-y-4 text-base">
                {guidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Badge
                      variant="outline"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-primary"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <strong className="block text-base mb-1">{guideline.title}</strong>
                      <span className="text-muted-foreground">{guideline.description}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto text-center mb-16 px-4">
        <div className="bg-muted/50 p-8 rounded-2xl shadow-sm">
          <h2 className="text-3xl font-bold mb-4">Ready to create stunning thumbnails?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start using Snap Core today and transform your images and videos into eye-catching thumbnails in seconds.
          </p>
          <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors">
            Get Started Now
          </button>
          <p className="mt-6 text-xs text-muted-foreground">
            All processing is done in your browser. See our <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a> and <a href="/terms" className="underline hover:text-primary">Terms of Service</a>.
          </p>
        </div>
      </section>
    </>
  )
}

const features = [
  {
    title: "AI Background Removal",
    description: "Instantly remove backgrounds from images and video frames with our advanced AI technology.",
    icon: <ImageIcon className="h-6 w-6 text-primary" />,
  },
  {
    title: "Text Customization",
    description:
      "Add and customize text with different fonts, colors, sizes, and positions to make your message stand out.",
    icon: <Layers className="h-6 w-6 text-primary" />,
  },
  {
    title: "Image Filters",
    description: "Enhance your thumbnails with adjustable filters for brightness, contrast, saturation, and more.",
    icon: <Sparkles className="h-6 w-6 text-primary" />,
  },
  {
    title: "Instant Download",
    description: "Download your finished thumbnails with a single click in high quality for immediate use.",
    icon: <Download className="h-6 w-6 text-primary" />,
  },
  {
    title: "Undo & Redo",
    description:
      "Experiment safely with undo and redo functionality that lets you try different options without losing your work.",
    icon: <RefreshCw className="h-6 w-6 text-primary" />,
  },
  {
    title: "Privacy First",
    description: "All processing happens in your browser. Your files are never uploaded to external servers.",
    icon: <Shield className="h-6 w-6 text-primary" />,
  },
]

const guidelines = [
  {
    title: "Start by uploading:",
    description:
      "Click on the upload area and choose an image or video from your device. If you use a video, you'll be able to pick a frame to use as your thumbnail.",
  },
  {
    title: "Remove the background:",
    description:
      "After your image or video frame loads, press the Remove Background button. This will make your main subject stand out and get rid of any unwanted background.",
  },
  {
    title: "Add your text:",
    description:
      "Go to the Text Editor tab. Click to add text, then drag it where you want. You can change the font, color, size, and whether the text appears in front of or behind your subject.",
  },
  {
    title: "Make it pop with filters:",
    description:
      "Switch to the Filters tab. Here you can adjust things like brightness, contrast, and color to make your thumbnail look just right.",
  },
  {
    title: "See your final result:",
    description:
      "Go to the Final Preview tab. This shows exactly what your finished thumbnail will look like when you download it.",
  },
  {
    title: "Download your thumbnail:",
    description:
      "If you're happy with how it looks, click the download button to save your new thumbnail to your device.",
  },
  {
    title: "Want to try again?",
    description: "Click the Cancel button to start over and upload a new image or video.",
  },
]
