'use client';
import { cn } from "@/lib/utils";
interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}
export function Loading({ className, size = 'md', fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div 
      className={cn(
        "flex items-center justify-center",
        fullScreen && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
        className
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
export function LoadingPage() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loading size="lg" />
    </div>
  );
}
export function LoadingSection() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <Loading size="md" />
    </div>
  );
} 