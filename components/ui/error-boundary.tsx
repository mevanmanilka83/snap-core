'use client';
import React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}
interface State {
  hasError: boolean;
  error?: Error;
}
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }
  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {

  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className={cn(
          "min-h-[400px] flex flex-col items-center justify-center p-4 text-center",
          "bg-background/80 backdrop-blur-sm",
          this.props.className
        )}>
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            variant="outline"
            className="hover:bg-background"
          >
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
} 