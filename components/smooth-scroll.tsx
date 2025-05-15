'use client';

import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScroll({ children, className }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    const container = containerRef.current;
    if (!container) return;

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
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add a global method for instant scrolling
    const instantScrollTo = (position: number) => {
      window.scrollTo({
        top: position,
        behavior: 'auto'
      });
    };

    // Use requestAnimationFrame for smoother scrolling
    const smoothScroll = (e: WheelEvent) => {
      requestAnimationFrame(() => handleWheel(e));
    };

    container.addEventListener('wheel', smoothScroll, { passive: false });
    window.instantScrollTo = instantScrollTo;

    return () => {
      container.removeEventListener('wheel', smoothScroll);
      // Type assertion to make TypeScript happy with the delete operator
      (window as any).instantScrollTo = undefined;
    };
  }, [handleWheel]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "overflow-x-auto scrollbar-hide",
        className
      )}
    >
      {children}
    </div>
  );
}

// Add TypeScript declaration for the global method
declare global {
  interface Window {
    instantScrollTo?: (position: number) => void;
  }
} 