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
        <div className="rounded bg-white px-4 py-2 dark:bg-gray-800">This has dot background</div>
      </div>
    );
  }
  
  export default function Dot({
    color,
    size = 1,
    spacing = 10,
    children,
    className,
    style = {},
  }: DotProps) {
    const { theme } = useTheme();
    
    const dotColor = color ?? (theme === "dark" ? "#374151" : "#cacaca");
    const backgroundColor = theme === "dark" ? "#0A0A0A" : "white";

    return (
      <div
        style={{
          ...style,
          backgroundColor,
          backgroundImage: `radial-gradient(${dotColor} ${size}px, transparent ${size}px)`,
          backgroundSize: `calc(${spacing} * ${size}px) calc(${spacing} * ${size}px)`,
        }}
        className={className}
      >
        {children ?? <Placeholder />}
      </div>
    );
  }
  