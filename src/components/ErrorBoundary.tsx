import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-slate-600 mb-4">
              An unexpected error occurred in the application. Please try refreshing the page.
            </p>
            <div className="bg-slate-100 p-4 rounded-lg text-sm font-mono text-slate-700 overflow-auto max-h-40">
              {this.state.error?.message}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
