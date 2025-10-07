import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Optional message to display below the spinner
   */
  message?: string;

  /**
   * Additional className for custom styling
   */
  className?: string;
}

/**
 * LoadingSpinner component - displays an animated loading indicator
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="md" message="Loading data..." />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2
        className={cn(
          'animate-spin text-primary',
          sizeClasses[size]
        )}
      />
      {message && (
        <p className={cn(
          'text-muted-foreground font-medium',
          textSizeClasses[size]
        )}>
          {message}
        </p>
      )}
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';
