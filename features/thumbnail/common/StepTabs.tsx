"use client";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";
export interface StepTab {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}
interface StepTabsProps {
  steps: StepTab[];
  listClassName?: string;
}
export default function StepTabs({ steps, listClassName }: StepTabsProps) {
  return (
    <TabsList className={listClassName || "bg-muted text-muted-foreground h-auto items-center justify-center rounded-lg p-[3px] grid min-w-fit w-full gap-1 sm:gap-2"}>
      {steps.map((step) => (
        <TabsTrigger
          key={step.value}
          value={step.value}
          disabled={step.disabled}
          className={step.className || "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-auto min-h-[40px] flex-1 justify-center rounded-md border border-transparent font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 flex items-center gap-1 md:gap-2 text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap"}
        >
          {step.icon}
          <span>{step.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
