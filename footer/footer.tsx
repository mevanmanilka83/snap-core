import Link from "next/link"
import { Github } from "lucide-react"
export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-background/80 border-t py-4 mt-4" role="contentinfo">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3 w-full md:w-auto">
          <p className="text-center text-xs leading-loose text-muted-foreground md:text-left">
            © {currentYear} Snap Core. All rights reserved.
          </p>
        </div>
        <nav 
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto justify-center md:justify-end"
          aria-label="Footer navigation"
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
            <Link 
              href="/terms" 
              className="text-xs font-medium text-muted-foreground"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="text-xs font-medium text-muted-foreground"
            >
              Privacy
            </Link>
          </div>
          <Link
            href="https://github.com/mevanmanilka83"
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted-foreground"
            aria-label="Developer's GitHub Profile"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </footer>
  )
} 