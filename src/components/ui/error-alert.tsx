import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ErrorAlertProps {
  /**
   * Error message to display (can be string or Error object)
   */
  error: string | Error;

  /**
   * Optional retry callback
   */
  onRetry?: () => void;

  /**
   * Optional dismiss callback
   */
  onDismiss?: () => void;

  /**
   * Optional title (defaults to "Error")
   */
  title?: string;

  /**
   * Additional className for custom styling
   */
  className?: string;
}

/**
 * ErrorAlert component - displays error messages with optional retry/dismiss actions
 *
 * @example
 * ```tsx
 * <ErrorAlert
 *   error="Failed to load data"
 *   onRetry={() => refetchData()}
 *   onDismiss={() => setError(null)}
 * />
 * ```
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onRetry,
  onDismiss,
  title = 'Error',
  className
}) => {
  // Extract error message from Error object or use string directly
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Alert variant="destructive" className={cn('relative', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex flex-col gap-3">
          <p className="text-sm">{errorMessage}</p>

          {/* Action buttons */}
          {(onRetry || onDismiss) && (
            <div className="flex gap-2">
              {onRetry && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onRetry}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Retry
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDismiss}
                  className="border-red-300 hover:bg-red-50"
                >
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

ErrorAlert.displayName = 'ErrorAlert';
