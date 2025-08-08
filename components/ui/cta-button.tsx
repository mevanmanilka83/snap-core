"use client"

import React, { memo, ReactElement, cloneElement } from "react"
import { cn } from "@/lib/utils"

export interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: ReactElement<{ className?: string }>
}

function enhanceIcon<T extends { className?: string }>(icon: ReactElement<T>, extraClassName: string) {
  const existing = icon.props.className || ""
  return cloneElement(icon, {
    className: cn(existing, extraClassName),
  } as Partial<T>)
}

const CTAButton = memo(function CTAButton({ label, icon, className, ...buttonProps }: CTAButtonProps) {
  return (
    <button
      {...buttonProps}
      className={cn(
        "group relative flex h-12 w-full sm:w-[170px] items-center justify-center",
        "border-2 border-black rounded-full bg-white font-medium text-black",
        "transition-all duration-300 hover:scale-105 hover:shadow-xl",
        className
      )}
    >
      <span>{label}</span>
      <div className="relative h-9 w-9 overflow-hidden bg-black/10 rounded-full ml-2 backdrop-blur-sm">
        <div className="absolute top-[0.7em] left-[-0.1em] grid place-content-center transition-all w-full h-full duration-200 group-hover:-translate-y-5 group-hover:translate-x-4">
          {enhanceIcon(icon, "h-5 w-5 text-black fill-black")}
          {enhanceIcon(icon, "h-5 w-5 mb-1 -translate-x-4 text-black fill-black")}
        </div>
      </div>
    </button>
  )
})

export default CTAButton
