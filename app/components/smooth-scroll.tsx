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

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div ref={containerRef} className={`overflow-x-auto ${className}`}>
      {children}
    </div>
  );
} 