'use client';

import { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScroll({ children, className = '' }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add a global method for instant scrolling
    window.instantScrollTo = (position: number) => {
      window.scrollTo({
        top: position,
        behavior: 'auto'
      });
    };

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scrolling if content is wider than container
      if (container.scrollWidth > container.clientWidth) {
        // Check if we're at the edges of horizontal scroll
        const isAtLeftEdge = container.scrollLeft <= 0;
        const isAtRightEdge = container.scrollLeft + container.clientWidth >= container.scrollWidth;
        
        // Only prevent default if we're not at the edges and trying to scroll horizontally
        if (!isAtLeftEdge && !isAtRightEdge) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      delete window.instantScrollTo;
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-x-auto ${className}`}>
      {children}
    </div>
  );
}

// Add TypeScript declaration for the global method
declare global {
  interface Window {
    instantScrollTo: (position: number) => void;
  }
} 