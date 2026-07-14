import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional custom fallback renderer. */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Application-level Error Boundary.
 *
 * React only lets class components act as error boundaries. This is the last
 * line of defense against a render-time exception (e.g. a malformed slide, a
 * WebGL failure, or corrupted persisted state) taking down the whole app with
 * a blank white screen. Instead we surface a recoverable UI and log the error.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Intentionally log (not swallow) so failures remain diagnosable.
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }
      return (
        <div
          role="alert"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-slate-50 dark:bg-slate-950 text-center p-6"
        >
          <div className="text-4xl" aria-hidden="true">⚠️</div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            The application hit an unexpected error. Your saved work in this
            browser has not been deleted.
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.reset}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
