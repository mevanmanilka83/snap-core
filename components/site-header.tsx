import { MainNav } from "@/components/main-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 sm:h-14 md:h-16 items-center mx-auto px-3 sm:px-4">
        <MainNav />
      </div>
    </header>
  );
}
