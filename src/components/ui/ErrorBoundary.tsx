import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { Card } from './card';
import { toast } from 'sonner';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Show user-friendly error message
    toast.error('Something went wrong. Please refresh the page.');
    
    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error monitoring service (e.g., Sentry)
      // sendErrorToMonitoring(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="min-h-screen flex items-center justify-center p-4"
          role="alert"
          aria-live="assertive"
        >
          <Card className="max-w-md p-6 text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-semibold text-foreground">
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground">
              We encountered an unexpected error. Please refresh the page to try again.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
                aria-label="Refresh the page"
              >
                Refresh Page
              </Button>
              <Button
                onClick={() => this.setState({ hasError: false })}
                variant="outline"
                className="flex-1"
                aria-label="Try again without refreshing"
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}