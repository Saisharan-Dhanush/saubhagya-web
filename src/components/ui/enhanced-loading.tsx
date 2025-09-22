import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, Zap, Activity, BarChart3 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'accent' | 'minimal'
  className?: string
}

const sizeConfig = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

const variantConfig = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  accent: 'text-green-600',
  minimal: 'text-gray-400'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className
}) => {
  return (
    <Loader2
      className={cn(
        'animate-spin',
        sizeConfig[size],
        variantConfig[variant],
        className
      )}
    />
  )
}

interface EnhancedLoadingProps {
  type?: 'page' | 'component' | 'inline' | 'overlay'
  message?: string
  submessage?: string
  progress?: number
  icon?: 'spinner' | 'zap' | 'activity' | 'chart'
  showProgress?: boolean
  className?: string
}

const iconComponents = {
  spinner: Loader2,
  zap: Zap,
  activity: Activity,
  chart: BarChart3
}

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  type = 'component',
  message = 'Loading...',
  submessage,
  progress,
  icon = 'spinner',
  showProgress = false,
  className
}) => {
  const IconComponent = iconComponents[icon]

  const renderContent = () => (
    <div className="flex flex-col items-center space-y-4">
      {/* Icon with animation */}
      <div className="relative">
        <IconComponent
          className={cn(
            'animate-spin text-blue-600',
            type === 'page' ? 'h-12 w-12' : 'h-8 w-8'
          )}
        />
        {icon === 'zap' && (
          <div className="absolute inset-0 animate-pulse">
            <Zap className={cn(
              'text-blue-300',
              type === 'page' ? 'h-12 w-12' : 'h-8 w-8'
            )} />
          </div>
        )}
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <div className={cn(
          'font-medium text-gray-900',
          type === 'page' ? 'text-lg' : 'text-sm'
        )}>
          {message}
        </div>
        {submessage && (
          <div className={cn(
            'text-gray-500',
            type === 'page' ? 'text-sm' : 'text-xs'
          )}>
            {submessage}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {(showProgress || progress !== undefined) && (
        <div className="w-full max-w-xs space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
          {progress !== undefined && (
            <div className="text-xs text-gray-500 text-center">
              {Math.round(progress)}% complete
            </div>
          )}
        </div>
      )}

      {/* Animated dots */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )

  switch (type) {
    case 'page':
      return (
        <div className={cn(
          'flex items-center justify-center min-h-screen bg-gray-50',
          className
        )}>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            {renderContent()}
          </div>
        </div>
      )

    case 'overlay':
      return (
        <div className={cn(
          'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
          className
        )}>
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            {renderContent()}
          </div>
        </div>
      )

    case 'component':
      return (
        <div className={cn(
          'flex items-center justify-center py-12',
          className
        )}>
          {renderContent()}
        </div>
      )

    case 'inline':
      return (
        <div className={cn(
          'flex items-center space-x-2',
          className
        )}>
          <LoadingSpinner size="sm" />
          <span className="text-sm text-gray-600">{message}</span>
        </div>
      )

    default:
      return (
        <div className={cn(
          'flex items-center justify-center py-8',
          className
        )}>
          {renderContent()}
        </div>
      )
  }
}

interface SkeletonProps {
  className?: string
  animation?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  animation = true
}) => {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded',
        animation && 'animate-pulse',
        className
      )}
    />
  )
}

interface CardSkeletonProps {
  rows?: number
  showAvatar?: boolean
  className?: string
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  rows = 3,
  showAvatar = false,
  className
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow p-6 space-y-4', className)}>
      {/* Header with optional avatar */}
      <div className="flex items-center space-x-4">
        {showAvatar && (
          <Skeleton className="h-12 w-12 rounded-full" />
        )}
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>

      {/* Content rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'h-3',
              i === rows - 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  )
}

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow overflow-hidden', className)}>
      {/* Table header */}
      <div className="bg-gray-50 px-6 py-3 border-b">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>

      {/* Table rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={cn(
                    'h-4',
                    colIndex === 0 ? 'w-32' : 'w-24'
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ChartSkeletonProps {
  type?: 'bar' | 'line' | 'pie'
  className?: string
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  type = 'bar',
  className
}) => {
  const renderBarChart = () => (
    <div className="flex items-end space-x-2 h-32">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-8"
          style={{ height: `${30 + Math.random() * 70}%` }}
        />
      ))}
    </div>
  )

  const renderLineChart = () => (
    <div className="relative h-32">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-16 flex items-end space-x-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-1"
              style={{ height: `${20 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )

  const renderPieChart = () => (
    <div className="flex items-center justify-center h-32">
      <Skeleton className="h-24 w-24 rounded-full" />
    </div>
  )

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart()
      case 'line':
        return renderLineChart()
      case 'pie':
        return renderPieChart()
      default:
        return renderBarChart()
    }
  }

  return (
    <div className={cn('bg-white rounded-lg shadow p-6', className)}>
      {/* Chart title */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Chart content */}
      {renderChart()}

      {/* Chart legend */}
      <div className="mt-6 flex space-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default {
  LoadingSpinner,
  EnhancedLoading,
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  ChartSkeleton
}