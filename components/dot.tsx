"use client";

import { useTheme } from "next-themes";

interface DotProps {
    /**
     * Color of the dot
     */
    color?: string;
  
    /**
     * Size of the dot in pixels
     */
    size?: number;
  
    /**
     * Spacing between dots
     */
    spacing?: number;
  
    /**
     * Content of the component
     */
    children?: React.ReactNode;
  
    /**
     * Class name
     */
    className?: string;
  
    style?: React.CSSProperties;
  }
  
  function Placeholder() {
    return (
      <div className="flex h-full min-h-64 w-full min-w-72 items-center justify-center">
        <div className="rounded bg-background px-4 py-2 text-foreground">This has dot background</div>
      </div>
    );
  }
  
  export default function Dot({
    color,
    size = 1.5,
    spacing = 18,
    children,
    className,
    style = {},
  }: DotProps) {
    const { theme } = useTheme();
    
    const dotColor = color ?? (theme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)");
    const backgroundColor = theme === "dark" ? "hsl(var(--background))" : "hsl(var(--background))";

    return (
      <div
        style={{
          ...style,
          backgroundColor,
          backgroundImage: `radial-gradient(${dotColor} ${size}px, transparent ${size}px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
          backgroundPosition: "0 0",
        }}
        className={`w-full h-full ${className ?? ""}`}
      >
        {children ?? <Placeholder />}
      </div>
    );
  }