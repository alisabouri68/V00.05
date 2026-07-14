// --- components/ErrorBoundary.tsx ---
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Danger, Refresh2, InfoCircle } from "iconsax-react";
import { Button } from "flowbite-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state to trigger the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging or reporting services
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  // Method to reset the error state and try re-rendering
  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] w-full p-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl transition-all duration-300">
          <div className="max-w-md w-full text-center flex flex-col items-center">
            {/* Visual Indicator */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-red-50">
                <Danger size={48} className="text-red-500" variant="Bulk" color="currentColor" />
              </div>
            </div>

            {/* Error Content */}
            <h2 className="text-xl font-bold text-gray-800 mb-2 font-sans">
              Unexpected Component Error
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              We encountered a technical issue while rendering this section. Our
              team has been notified.
            </p>

            {/* Error Detail (Collapsible or subtle) */}
            <div className="w-full flex items-start gap-2 p-3 mb-8 bg-white border border-gray-100 rounded-xl text-left shadow-sm">
              <InfoCircle size={18} className="text-blue-500 shrink-0 mt-0.5" color="currentColor"/>
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                  Error Trace
                </p>
                <p className="text-xs font-mono text-gray-600 break-words line-clamp-2">
                  {this.state.error?.name}: {this.state.error?.message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                color="light"
                size="sm"
                className="!ring-0 border-gray-200 hover:bg-gray-100 text-gray-600 transition-all"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>

              <Button
                color="failure"
                size="sm"
                className="!ring-0 shadow-lg shadow-red-100 transition-all flex items-center"
                onClick={this.handleReset}
              >
                <Refresh2 size={16} className="mr-2" color="currentColor"/>
                Try Again
              </Button>
            </div>

            {/* Support Link */}
            <button className="mt-8 text-xs text-gray-400 hover:text-blue-500 underline underline-offset-4 transition-colors">
              Contact technical support
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
