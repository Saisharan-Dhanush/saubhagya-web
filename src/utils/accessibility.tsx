import React from 'react'

// Accessibility utilities and hooks

// Focus management
export const useFocusManagement = () => {
  const previousActiveElement = React.useRef<HTMLElement | null>(null)

  const saveFocus = React.useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = React.useCallback(() => {
    if (previousActiveElement.current) {
      previousActiveElement.current.focus()
      previousActiveElement.current = null
    }
  }, [])

  const trapFocus = React.useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  return { saveFocus, restoreFocus, trapFocus }
}

// Keyboard navigation hook
export const useKeyboardNavigation = (
  items: Array<{ id: string; element?: HTMLElement }>,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both'
    loop?: boolean
    initialFocus?: string
  } = {}
) => {
  const { orientation = 'vertical', loop = true, initialFocus } = options
  const [activeId, setActiveId] = React.useState<string>(initialFocus || items[0]?.id || '')

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = items.findIndex(item => item.id === activeId)
      let nextIndex = currentIndex

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault()
            nextIndex = currentIndex + 1
            if (nextIndex >= items.length) {
              nextIndex = loop ? 0 : currentIndex
            }
          }
          break
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault()
            nextIndex = currentIndex - 1
            if (nextIndex < 0) {
              nextIndex = loop ? items.length - 1 : currentIndex
            }
          }
          break
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault()
            nextIndex = currentIndex + 1
            if (nextIndex >= items.length) {
              nextIndex = loop ? 0 : currentIndex
            }
          }
          break
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault()
            nextIndex = currentIndex - 1
            if (nextIndex < 0) {
              nextIndex = loop ? items.length - 1 : currentIndex
            }
          }
          break
        case 'Home':
          e.preventDefault()
          nextIndex = 0
          break
        case 'End':
          e.preventDefault()
          nextIndex = items.length - 1
          break
      }

      if (nextIndex !== currentIndex) {
        const nextItem = items[nextIndex]
        if (nextItem) {
          setActiveId(nextItem.id)
          nextItem.element?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeId, items, orientation, loop])

  return { activeId, setActiveId }
}

// Screen reader announcements
export const useScreenReader = () => {
  const announceRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Create announcement region if it doesn't exist
    if (!announceRef.current) {
      const announceDiv = document.createElement('div')
      announceDiv.setAttribute('aria-live', 'polite')
      announceDiv.setAttribute('aria-atomic', 'true')
      announceDiv.style.position = 'absolute'
      announceDiv.style.left = '-10000px'
      announceDiv.style.width = '1px'
      announceDiv.style.height = '1px'
      announceDiv.style.overflow = 'hidden'
      document.body.appendChild(announceDiv)
      announceRef.current = announceDiv
    }
  }, [])

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority)
      announceRef.current.textContent = message
    }
  }, [])

  return { announce }
}

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// High contrast mode detection
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setPrefersHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersHighContrast
}

// Skip link utility
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
    >
      {children}
    </a>
  )
}

// ARIA attributes helper
export const getAriaAttributes = (
  options: {
    label?: string
    labelledBy?: string
    describedBy?: string
    expanded?: boolean
    selected?: boolean
    disabled?: boolean
    current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time'
    live?: 'off' | 'polite' | 'assertive'
    atomic?: boolean
    busy?: boolean
    hidden?: boolean
    level?: number
    setSize?: number
    posInSet?: number
  } = {}
) => {
  const aria: Record<string, any> = {}

  if (options.label) aria['aria-label'] = options.label
  if (options.labelledBy) aria['aria-labelledby'] = options.labelledBy
  if (options.describedBy) aria['aria-describedby'] = options.describedBy
  if (options.expanded !== undefined) aria['aria-expanded'] = options.expanded
  if (options.selected !== undefined) aria['aria-selected'] = options.selected
  if (options.disabled !== undefined) aria['aria-disabled'] = options.disabled
  if (options.current !== undefined) aria['aria-current'] = options.current
  if (options.live) aria['aria-live'] = options.live
  if (options.atomic !== undefined) aria['aria-atomic'] = options.atomic
  if (options.busy !== undefined) aria['aria-busy'] = options.busy
  if (options.hidden !== undefined) aria['aria-hidden'] = options.hidden
  if (options.level) aria['aria-level'] = options.level
  if (options.setSize) aria['aria-setsize'] = options.setSize
  if (options.posInSet) aria['aria-posinset'] = options.posInSet

  return aria
}

// Landmark utilities
export const useLandmark = (role: string, label?: string) => {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute('role', role)
      if (label) {
        ref.current.setAttribute('aria-label', label)
      }
    }
  }, [role, label])

  return ref
}

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    // Calculate relative luminance
    const sRGB = [r, g, b].map(value =>
      value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
    )

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

export const meetsWCAGAA = (foreground: string, background: string, isLargeText = false): boolean => {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

export const meetsWCAGAAA = (foreground: string, background: string, isLargeText = false): boolean => {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 4.5 : ratio >= 7
}

// Focus visible utilities
export const useFocusVisible = () => {
  const [isFocusVisible, setIsFocusVisible] = React.useState(false)
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    let hadKeyboardEvent = false

    const onKeyDown = () => {
      hadKeyboardEvent = true
    }

    const onMouseDown = () => {
      hadKeyboardEvent = false
    }

    const onFocus = () => {
      setIsFocusVisible(hadKeyboardEvent)
    }

    const onBlur = () => {
      setIsFocusVisible(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onMouseDown)
    element.addEventListener('focus', onFocus)
    element.addEventListener('blur', onBlur)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onMouseDown)
      element.removeEventListener('focus', onFocus)
      element.removeEventListener('blur', onBlur)
    }
  }, [])

  return [ref, isFocusVisible] as const
}

// Accessible button component
export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const [ref, isFocusVisible] = useFocusVisible()

  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500'
  }
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const focusVisibleClasses = isFocusVisible ? 'ring-2 ring-offset-2' : ''

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${focusVisibleClasses} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'flex items-center'}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  )
}

export default {
  useFocusManagement,
  useKeyboardNavigation,
  useScreenReader,
  useReducedMotion,
  useHighContrast,
  SkipLink,
  getAriaAttributes,
  useLandmark,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  useFocusVisible,
  AccessibleButton
}