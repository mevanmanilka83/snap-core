import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { WordPullUp } from "@/components/eldoraui/wordpullup"

const faqs = [
    {
      question: "How does the AI thumbnail generator work?",
      answer:
        "Our AI thumbnail generator uses advanced machine learning algorithms to create professional-looking thumbnails based on your input. Simply enter a description or upload an image, and our AI will generate a custom thumbnail for you.",
    },
    {
      question: "Can I customize the generated thumbnails?",
      answer:
        "Yes! After generating a thumbnail, you can customize various elements including text, colors, layout, and more to match your brand and style preferences.",
    },
    {
      question: "What file formats can I export my thumbnails in?",
      answer:
        "You can export your thumbnails in PNG, JPG, and WebP formats. Each format is optimized for different platforms and use cases.",
    },
    {
      question: "Is there a limit to how many thumbnails I can generate?",
      answer:
        "No, there's no limit to the number of thumbnails you can generate. Feel free to create as many variations as you need until you find the perfect one.",
    },
  ]

export default function FAQSection() {
  return (
    <section className="max-w-3xl mx-auto mb-24 px-4">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          FAQ
        </Badge>
        <WordPullUp text="Frequently Asked Questions" className="text-3xl md:text-4xl mb-4" />
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}