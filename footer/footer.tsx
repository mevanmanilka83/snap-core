import Link from "next/link"
import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background/80 border-t py-4 mt-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3 w-full md:w-auto">
          <p className="text-center text-xs leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Snap Core. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto justify-center md:justify-end">
          <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
            <Link href="/terms" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded">
              Privacy
            </Link>
          </nav>
          <Link
            href="https://github.com/mevanmanilka83"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full"
            aria-label="Developer's GitHub Profile"
          >
            <Github className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  )
} 