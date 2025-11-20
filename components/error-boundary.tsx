"use client";

import { Component, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/primary-button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * Catches React component errors and displays a fallback UI
 * Prevents the entire app from crashing when a component throws an error
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging/monitoring
    console.error("Error boundary caught:", error, errorInfo);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI matching the design system
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="flex max-w-md flex-col gap-6 p-8 text-center">
            <div className="flex flex-col gap-4 items-center">
              <div className="size-16 bg-red-50 rounded-full flex items-center justify-center">
                <span className="text-2xl" aria-hidden="true">
                  ⚠️
                </span>
              </div>
              <h2 className="text-base font-normal text-[#0f172b] leading-6">
                Something went wrong
              </h2>
              <p className="text-sm font-normal text-[#45556c] leading-5">
                We encountered an unexpected error. Please try refreshing the
                page or contact support if the issue persists.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="w-full mt-2 text-left">
                  <summary className="text-xs text-[#45556c] cursor-pointer hover:text-[#0f172b]">
                    Error details (development only)
                  </summary>
                  <pre className="mt-2 p-2 bg-slate-50 rounded text-xs text-red-600 overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.error.stack && (
                      <>
                        {"\n\n"}
                        {this.state.error.stack}
                      </>
                    )}
                  </pre>
                </details>
              )}
              <div className="w-full mt-2">
                <PrimaryButton text="Try Again" onClick={this.handleReset} />
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

