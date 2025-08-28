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

    if (container.scrollWidth > container.clientWidth) {

      const isAtLeftEdge = container.scrollLeft <= 0;
      const isAtRightEdge = container.scrollLeft + container.clientWidth >= container.scrollWidth;

      if (!isAtLeftEdge && !isAtRightEdge) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }
  }, []);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const instantScrollTo = (position: number) => {
      window.scrollTo({
        top: position,
        behavior: 'auto'
      });
    };

    const smoothScroll = (e: WheelEvent) => {
      requestAnimationFrame(() => handleWheel(e));
    };
    container.addEventListener('wheel', smoothScroll, { passive: false });
    window.instantScrollTo = instantScrollTo;
    return () => {
      container.removeEventListener('wheel', smoothScroll);

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
declare global {
  interface Window {
    instantScrollTo?: (position: number) => void;
  }
} 