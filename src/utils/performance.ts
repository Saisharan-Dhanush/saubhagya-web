import React from 'react'

// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  renderTime: number
  componentName: string
  timestamp: number
  props?: Record<string, any>
}

class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = []
  private static isEnabled = process.env.NODE_ENV === 'development'

  static recordMetric(metric: PerformanceMetrics) {
    if (!this.isEnabled) return

    this.metrics.push(metric)

    // Keep only last 100 metrics to prevent memory leak
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    // Log slow renders (> 16ms for 60fps)
    if (metric.renderTime > 16) {
      console.warn(`Slow render detected: ${metric.componentName} took ${metric.renderTime.toFixed(2)}ms`)
    }
  }

  static getMetrics(componentName?: string): PerformanceMetrics[] {
    if (componentName) {
      return this.metrics.filter(m => m.componentName === componentName)
    }
    return [...this.metrics]
  }

  static getAverageRenderTime(componentName: string): number {
    const componentMetrics = this.getMetrics(componentName)
    if (componentMetrics.length === 0) return 0

    const total = componentMetrics.reduce((sum, metric) => sum + metric.renderTime, 0)
    return total / componentMetrics.length
  }

  static getSlowestComponents(limit = 10): Array<{ name: string; avgTime: number }> {
    const componentMap = new Map<string, number[]>()

    this.metrics.forEach(metric => {
      if (!componentMap.has(metric.componentName)) {
        componentMap.set(metric.componentName, [])
      }
      componentMap.get(metric.componentName)!.push(metric.renderTime)
    })

    const results = Array.from(componentMap.entries())
      .map(([name, times]) => ({
        name,
        avgTime: times.reduce((sum, time) => sum + time, 0) / times.length
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, limit)

    return results
  }
}

// HOC for performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = React.memo((props: P) => {
    const name = componentName || Component.displayName || Component.name
    const renderStartTime = React.useRef<number>()

    // Start timing
    renderStartTime.current = performance.now()

    React.useLayoutEffect(() => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current
        PerformanceMonitor.recordMetric({
          renderTime,
          componentName: name,
          timestamp: Date.now(),
          props: process.env.NODE_ENV === 'development' ? props : undefined
        })
      }
    })

    return React.createElement(Component, props)
  })

  WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Hook for performance monitoring
export const usePerformanceMonitoring = (componentName: string) => {
  const renderCount = React.useRef(0)
  const renderStartTime = React.useRef<number>()

  React.useLayoutEffect(() => {
    renderCount.current += 1
    renderStartTime.current = performance.now()

    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current
        PerformanceMonitor.recordMetric({
          renderTime,
          componentName,
          timestamp: Date.now()
        })
      }
    }
  })

  return {
    renderCount: renderCount.current,
    getMetrics: () => PerformanceMonitor.getMetrics(componentName),
    getAverageRenderTime: () => PerformanceMonitor.getAverageRenderTime(componentName)
  }
}

// Memory management utilities
export const useMemoryOptimization = () => {
  const cleanup = React.useCallback(() => {
    // Clear any cached data or unused references
    if (typeof window !== 'undefined') {
      // Clear performance observer entries
      if ('performance' in window && performance.clearResourceTimings) {
        performance.clearResourceTimings()
      }
    }
  }, [])

  React.useEffect(() => {
    const interval = setInterval(cleanup, 60000) // Cleanup every minute
    return () => clearInterval(interval)
  }, [cleanup])

  return { cleanup }
}

// Debounced value hook for performance optimization
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttled function hook
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = React.useRef<number>(0)
  const lastCallTimer = React.useRef<NodeJS.Timeout>()

  return React.useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastCall.current >= delay) {
        lastCall.current = now
        return callback(...args)
      } else {
        clearTimeout(lastCallTimer.current)
        lastCallTimer.current = setTimeout(() => {
          lastCall.current = Date.now()
          callback(...args)
        }, delay - (now - lastCall.current))
      }
    }) as T,
    [callback, delay]
  )
}

// Virtual scrolling utility for large lists
export const useVirtualScrolling = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0)

  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  )

  const visibleItems = React.useMemo(() => {
    const items = []
    for (let i = startIndex; i <= endIndex; i++) {
      items.push(i)
    }
    return items
  }, [startIndex, endIndex])

  const totalHeight = itemCount * itemHeight
  const offsetY = startIndex * itemHeight

  return {
    scrollTop,
    setScrollTop,
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex
  }
}

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options?: IntersectionObserverInit
) => {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(null)
  const elementRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry)
    }, options)

    observer.observe(element)

    return () => observer.disconnect()
  }, [options])

  return [elementRef, entry] as const
}

// Image lazy loading hook
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '')
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  })

  React.useEffect(() => {
    if (entry?.isIntersecting && !isLoaded && !isError) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        setIsError(true)
      }
      img.src = src
    }
  }, [entry?.isIntersecting, src, isLoaded, isError])

  return {
    ref,
    imageSrc,
    isLoaded,
    isError
  }
}

// Component size tracking
export const useComponentSize = () => {
  const ref = React.useRef<HTMLElement>(null)
  const [size, setSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect
        setSize({ width, height })
      }
    })

    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  return [ref, size] as const
}

// Export performance monitor for debugging
export { PerformanceMonitor }