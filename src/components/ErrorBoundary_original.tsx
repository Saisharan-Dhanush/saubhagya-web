import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Default error UI
      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex flex-col space-y-3">
              <div>
                <h4 className="font-semibold">Something went wrong</h4>
                <p className="text-sm mt-1">
                  {this.state.error?.message || 'An unexpected error occurred while processing your request.'}
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-red-700 hover:text-red-800">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 p-2 bg-red-50 rounded text-red-800 overflow-auto max-h-40">
                    {this.state.error?.stack}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={this.resetError}
                className="self-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook version for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Calculation-specific error boundary component
export const CalculationErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log calculation errors specifically
    console.error('Calculation Error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  };

  const FallbackComponent = ({ error, resetError }: { error: Error; resetError: () => void }) => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="flex flex-col space-y-3">
          <div>
            <h4 className="font-semibold">Calculation Error</h4>
            <p className="text-sm mt-1">
              There was an error processing the financial calculations. Please check your inputs and try again.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs mt-2 text-red-700">
                {error.message}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetError}
            className="self-start"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Calculator
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );

  return (
    <ErrorBoundary fallback={FallbackComponent} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};