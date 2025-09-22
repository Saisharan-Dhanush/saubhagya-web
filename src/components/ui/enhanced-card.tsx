import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { cn } from "../../lib/utils"

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'info' | 'error'
  children?: React.ReactNode
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300',
      success: 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300',
      warning: 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300',
      info: 'bg-gradient-to-br from-cyan-50 to-blue-100 border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-300',
      error: 'bg-gradient-to-br from-red-50 to-pink-100 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300'
    }

    return (
      <Card
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </Card>
    )
  }
)

EnhancedCard.displayName = "EnhancedCard"

interface EnhancedHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error'
  children?: React.ReactNode
}

const EnhancedHeader = React.forwardRef<HTMLDivElement, EnhancedHeaderProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white',
      primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
      success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
      warning: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
      info: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
      error: 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
    }

    return (
      <CardHeader
        ref={ref}
        className={cn(
          variants[variant],
          'rounded-t-lg -mx-px -mt-px mb-4 shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </CardHeader>
    )
  }
)

EnhancedHeader.displayName = "EnhancedHeader"

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg',
      success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg',
      warning: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg',
      info: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg',
      error: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg',
      outline: 'border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700'
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg font-semibold'
    }

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed transform-none hover:shadow-lg' : 'hover:shadow-xl hover:-translate-y-1'

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-lg font-medium transition-all duration-300 border-0',
          variants[variant],
          sizes[size],
          disabledStyles,
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

EnhancedButton.displayName = "EnhancedButton"

export { EnhancedCard, EnhancedHeader, EnhancedButton, CardContent, CardDescription, CardTitle }