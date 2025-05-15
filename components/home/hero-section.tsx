"use client";

import { useRef, useCallback, memo } from "react";
import { ChevronsRight } from "lucide-react";
import { WordPullUp } from "@/components/eldoraui/wordpullup";
import { cn } from "@/lib/utils";
import { Lights } from "@/components/BackgroundLights";

const HeroSection = memo(function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  const scrollToHowItWorks = useCallback(() => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToMainSection = useCallback(() => {
    const elements = document.getElementsByClassName("text-xs sm:text-sm");
    const targetElement = Array.from(elements).find((el) =>
      el.textContent?.includes("Create Thumbnails")
    ) as HTMLElement;

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      window.scrollTo({
        top: absoluteTop,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className={cn(
        "min-h-[80vh] py-16 max-w-5xl mx-auto",
        "flex flex-col justify-center items-center text-center",
        "relative overflow-hidden rounded-3xl mb-24",
        "border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-black"
      )}
    >
      <Lights className="absolute inset-0 z-0" />

      <div className="min-h-[120px] flex items-center justify-center relative z-10">
        <WordPullUp
          text="Create Perfect Thumbnails from Videos or Images"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 max-w-2xl"
        />
      </div>

      <p className="text-muted-foreground mb-8 max-w-xl text-base sm:text-lg md:text-xl relative z-10">
        Upload images directly or capture frames from videos. Remove
        backgrounds, add text, and create stunning thumbnails - all processed
        locally in your browser for maximum privacy and speed.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <button
          onClick={scrollToMainSection}
          className={cn(
            "group relative flex h-12 w-[170px] items-center justify-between",
            "border-2 dark:border-[#656fe2] border-[#394481] rounded-full",
            "bg-gradient-to-r dark:from-[#1a1f4b] dark:to-[#2d3a8c] from-[#f7f8ff] to-[#ffffff]",
            "font-medium dark:text-white text-black",
            "transition-all duration-200 hover:scale-105"
          )}
        >
          <span className="pl-4">Start Creating</span>
          <div className="relative h-9 w-9 overflow-hidden dark:bg-[#656fe2] bg-black rounded-full mr-1">
            <div className="absolute top-[0.7em] left-[-0.1em] grid place-content-center transition-all w-full h-full duration-200 group-hover:-translate-y-5 group-hover:translate-x-4">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 dark:fill-white fill-white"
              >
                <path
                  d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mb-1 -translate-x-4 dark:fill-white fill-white"
              >
                <path
                  d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </button>
        <button
          onClick={scrollToHowItWorks}
          className={cn(
            "flex gap-2 cursor-pointer px-4 py-3",
            "dark:hover:bg-black bg-black hover:bg-white hover:text-black text-white",
            "border-black dark:hover:text-white transition-all border-2",
            "dark:border-white dark:bg-white dark:text-black rounded-full font-semibold",
            "hover:scale-105"
          )}
        >
          Learn More
          <ChevronsRight />
        </button>
      </div>
    </section>
  );
});

export default HeroSection;
