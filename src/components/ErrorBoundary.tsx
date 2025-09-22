import React from 'react'
import { AlertTriangle, RefreshCcw, Home, Bug, Mail, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorInfo {
  componentStack: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  retryCount: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{
    error: Error
    resetError: () => void
    errorId: string
  }>
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void
  level?: 'page' | 'component' | 'critical'
  maxRetries?: number
  autoRetry?: boolean
  isolate?: boolean
}

// Error logging service
class ErrorLogger {
  static logError(error: Error, errorInfo: ErrorInfo, errorId: string, level: string) {
    const errorData = {
      errorId,
      level,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: localStorage.getItem('userId') || 'anonymous',
      sessionId: sessionStorage.getItem('sessionId') || 'unknown'
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary - ${level.toUpperCase()}`)
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Error ID:', errorId)
      console.error('Full Error Data:', errorData)
      console.groupEnd()
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorData)
    }

    // Store in local storage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]')
      existingErrors.push(errorData)
      // Keep only last 10 errors to prevent storage bloat
      localStorage.setItem('errorLogs', JSON.stringify(existingErrors.slice(-10)))
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e)
    }
  }

  static async sendToErrorService(errorData: any) {
    try {
      // Replace with your actual error reporting service
      // Example: Sentry, Bugsnag, LogRocket, etc.
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      })
    } catch (e) {
      console.warn('Failed to send error to reporting service:', e)
    }
  }

  static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Default error fallback components
const PageLevelError: React.FC<{
  error: Error
  resetError: () => void
  errorId: string
}> = ({ error, resetError, errorId }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
      <div className="mb-6">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-4">
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>
      </div>

      <Alert className="mb-6 text-left">
        <Bug className="h-4 w-4" />
        <AlertDescription>
          <strong>Error ID:</strong> {errorId}
          <br />
          <strong>Time:</strong> {new Date().toLocaleString()}
          {process.env.NODE_ENV === 'development' && (
            <>
              <br />
              <strong>Error:</strong> {error.message}
            </>
          )}
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={resetError} className="flex items-center">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="flex items-center"
        >
          <Home className="h-4 w-4 mr-2" />
          Go Home
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = 'mailto:support@saubhagya.com?subject=Error%20Report&body=Error%20ID:%20' + errorId}
          className="flex items-center"
        >
          <Mail className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
      </div>
    </div>
  </div>
)

const ComponentLevelError: React.FC<{
  error: Error
  resetError: () => void
  errorId: string
}> = ({ error, resetError, errorId }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-start">
      <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Component Error
        </h3>
        <p className="text-red-700 mb-4">
          This component encountered an error and couldn't render properly.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-100 rounded p-3 mb-4">
            <code className="text-sm text-red-800 break-all">
              {error.message}
            </code>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={resetError} variant="outline">
            <RefreshCcw className="h-3 w-3 mr-1" />
            Retry
          </Button>
          <span className="text-xs text-red-600 self-center">
            Error ID: {errorId}
          </span>
        </div>
      </div>
    </div>
  </div>
)

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: ErrorLogger.generateErrorId()
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { errorId } = this.state
    const { onError, level = 'component', maxRetries = 3, autoRetry = false } = this.props

    this.setState({ errorInfo })

    // Log the error
    ErrorLogger.logError(error, errorInfo, errorId, level)

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo, errorId)
    }

    // Auto-retry logic for component-level errors
    if (autoRetry && level === 'component' && this.state.retryCount < maxRetries) {
      this.resetTimeoutId = window.setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          error: null,
          errorInfo: null,
          errorId: '',
          retryCount: prevState.retryCount + 1
        }))
      }, 3000 * (this.state.retryCount + 1)) // Exponential backoff
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  resetError = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
      this.resetTimeoutId = null
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback: Fallback, level = 'component', isolate = false } = this.props
      const { error, errorId } = this.state

      if (Fallback) {
        return (
          <Fallback
            error={error}
            resetError={this.resetError}
            errorId={errorId}
          />
        )
      }

      // If isolate is true, wrap in error container to prevent layout breaking
      const errorComponent = (() => {
        switch (level) {
          case 'page':
          case 'critical':
            return (
              <PageLevelError
                error={error}
                resetError={this.resetError}
                errorId={errorId}
              />
            )
          case 'component':
          default:
            return (
              <ComponentLevelError
                error={error}
                resetError={this.resetError}
                errorId={errorId}
              />
            )
        }
      })()

      return isolate ? (
        <div className="error-boundary-container">
          {errorComponent}
        </div>
      ) : errorComponent
    }

    return this.props.children
  }
}

// Hook for manual error reporting
export const useErrorReporting = () => {
  const reportError = React.useCallback((
    error: Error,
    context?: string,
    level: 'info' | 'warning' | 'error' | 'critical' = 'error'
  ) => {
    const errorId = ErrorLogger.generateErrorId()
    const errorInfo: ErrorInfo = {
      componentStack: `Manual report${context ? ` - ${context}` : ''}`
    }

    ErrorLogger.logError(error, errorInfo, errorId, level)
    return errorId
  }, [])

  return { reportError }
}

// Hook version for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}

// Higher-order component for easy wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Calculation-specific error boundary component
export const CalculationErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleError = (error: Error, errorInfo: ErrorInfo, errorId: string) => {
    // Log calculation errors specifically
    console.error('Calculation Error:', {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }

  const FallbackComponent = ({ error, resetError, errorId }: {
    error: Error
    resetError: () => void
    errorId: string
  }) => (
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
            <p className="text-xs mt-1 text-gray-500">
              Error ID: {errorId}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetError}
            className="self-start"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset Calculator
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )

  return (
    <ErrorBoundary
      fallback={FallbackComponent}
      onError={handleError}
      level="component"
      maxRetries={2}
      autoRetry={true}
      isolate={true}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary