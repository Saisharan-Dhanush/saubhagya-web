import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export interface PerformanceMetrics {
  pageLoadTime: number
  renderTime: number
  apiResponseTime: Record<string, number>
  memoryUsage: number
  networkRequests: number
  errorCount: number
  userInteractions: number
  sessionDuration: number
}

export interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'access_denied' | 'permission_escalation' | 'unusual_activity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId: string
  timestamp: Date
  details: string
  resolved: boolean
}

export interface SystemHealth {
  cpu: number
  memory: number
  storage: number
  network: number
  database: number
  services: Record<string, 'healthy' | 'warning' | 'critical'>
}

interface PerformanceContextType {
  // Performance monitoring
  metrics: PerformanceMetrics
  systemHealth: SystemHealth
  isLoading: boolean

  // Security monitoring
  securityEvents: SecurityEvent[]
  securityScore: number
  threatLevel: 'low' | 'medium' | 'high' | 'critical'

  // Actions
  trackPageLoad: (page: string, loadTime: number) => void
  trackApiCall: (endpoint: string, responseTime: number) => void
  trackUserInteraction: (action: string) => void
  reportSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void

  // Cache management
  clearCache: () => void
  optimizePerformance: () => void

  // Security actions
  enhanceSecurity: () => void
  resolveSecurityEvent: (eventId: string) => void
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export function usePerformance() {
  const context = useContext(PerformanceContext)
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider')
  }
  return context
}

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const { user, isExecutive } = useAuth()

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    renderTime: 0,
    apiResponseTime: {},
    memoryUsage: 0,
    networkRequests: 0,
    errorCount: 0,
    userInteractions: 0,
    sessionDuration: 0
  })

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    cpu: 45,
    memory: 67,
    storage: 23,
    network: 89,
    database: 78,
    services: {
      'authentication': 'healthy',
      'platform': 'healthy',
      'collaboration': 'healthy',
      'analytics': 'warning',
      'security': 'healthy'
    }
  })

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [securityScore, setSecurityScore] = useState(85)
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low')
  const [isLoading, setIsLoading] = useState(false)

  // Initialize performance monitoring
  useEffect(() => {
    const startTime = Date.now()
    const sessionStart = localStorage.getItem('sessionStart')

    if (sessionStart) {
      const duration = Date.now() - new Date(sessionStart).getTime()
      setMetrics(prev => ({ ...prev, sessionDuration: duration }))
    }

    // Mock initial performance data
    setMetrics(prev => ({
      ...prev,
      pageLoadTime: performance.now(),
      memoryUsage: (performance as any).memory?.usedJSHeapSize || Math.random() * 50000000,
      networkRequests: Math.floor(Math.random() * 20) + 5
    }))

    // Performance observer for real metrics
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            setMetrics(prev => ({
              ...prev,
              pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart
            }))
          }
        })
      })
      observer.observe({ entryTypes: ['navigation', 'resource'] })

      return () => observer.disconnect()
    }
  }, [])

  // Mock security events for demonstration
  useEffect(() => {
    const mockEvents: SecurityEvent[] = [
      {
        id: 'sec-1',
        type: 'login',
        severity: 'low',
        userId: user?.id || 'unknown',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        details: 'Successful login from new location',
        resolved: true
      },
      {
        id: 'sec-2',
        type: 'unusual_activity',
        severity: 'medium',
        userId: 'user-unknown',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        details: 'Multiple failed login attempts detected',
        resolved: false
      }
    ]

    if (isExecutive()) {
      mockEvents.push({
        id: 'sec-3',
        type: 'permission_escalation',
        severity: 'high',
        userId: user?.id || 'unknown',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        details: 'Executive privilege access granted',
        resolved: true
      })
    }

    setSecurityEvents(mockEvents)
  }, [user, isExecutive])

  // Real-time system health monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 8)),
        storage: Math.max(15, Math.min(85, prev.storage + (Math.random() - 0.5) * 2)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        database: Math.max(30, Math.min(95, prev.database + (Math.random() - 0.5) * 5)),
        services: {
          ...prev.services,
          analytics: Math.random() > 0.8 ? 'warning' : 'healthy'
        }
      }))

      // Update security score based on events
      const unresolvedEvents = securityEvents.filter(e => !e.resolved)
      const newScore = Math.max(60, 100 - unresolvedEvents.length * 5)
      setSecurityScore(newScore)

      // Update threat level
      if (unresolvedEvents.some(e => e.severity === 'critical')) {
        setThreatLevel('critical')
      } else if (unresolvedEvents.some(e => e.severity === 'high')) {
        setThreatLevel('high')
      } else if (unresolvedEvents.some(e => e.severity === 'medium')) {
        setThreatLevel('medium')
      } else {
        setThreatLevel('low')
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [securityEvents])

  const trackPageLoad = (page: string, loadTime: number) => {
    setMetrics(prev => ({
      ...prev,
      pageLoadTime: loadTime,
      apiResponseTime: {
        ...prev.apiResponseTime,
        [page]: loadTime
      }
    }))
  }

  const trackApiCall = (endpoint: string, responseTime: number) => {
    setMetrics(prev => ({
      ...prev,
      apiResponseTime: {
        ...prev.apiResponseTime,
        [endpoint]: responseTime
      },
      networkRequests: prev.networkRequests + 1
    }))
  }

  const trackUserInteraction = (action: string) => {
    setMetrics(prev => ({
      ...prev,
      userInteractions: prev.userInteractions + 1
    }))

    // Track security-relevant interactions
    if (action.includes('admin') || action.includes('executive')) {
      reportSecurityEvent({
        type: 'unusual_activity',
        severity: 'low',
        userId: user?.id || 'unknown',
        details: `Administrative action: ${action}`,
        resolved: false
      })
    }
  }

  const reportSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: `sec-${Date.now()}`,
      timestamp: new Date()
    }

    setSecurityEvents(prev => [newEvent, ...prev].slice(0, 50)) // Keep last 50 events
  }

  const clearCache = async () => {
    setIsLoading(true)

    try {
      // Clear localStorage cache data
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('cache_') || key.startsWith('temp_')) {
          localStorage.removeItem(key)
        }
      })

      // Simulate cache clearing
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update performance metrics
      setMetrics(prev => ({
        ...prev,
        memoryUsage: prev.memoryUsage * 0.7,
        networkRequests: 0
      }))

    } finally {
      setIsLoading(false)
    }
  }

  const optimizePerformance = async () => {
    setIsLoading(true)

    try {
      // Simulate performance optimization
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update system health
      setSystemHealth(prev => ({
        cpu: Math.max(prev.cpu - 20, 10),
        memory: Math.max(prev.memory - 15, 20),
        storage: prev.storage,
        network: Math.min(prev.network + 10, 100),
        database: Math.min(prev.database + 5, 95),
        services: {
          ...prev.services,
          analytics: 'healthy'
        }
      }))

      reportSecurityEvent({
        type: 'unusual_activity',
        severity: 'low',
        userId: user?.id || 'system',
        details: 'Performance optimization executed',
        resolved: true
      })

    } finally {
      setIsLoading(false)
    }
  }

  const enhanceSecurity = async () => {
    setIsLoading(true)

    try {
      // Simulate security enhancement
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mark all medium and low severity events as resolved
      setSecurityEvents(prev => prev.map(event => ({
        ...event,
        resolved: event.severity === 'high' || event.severity === 'critical'
          ? event.resolved
          : true
      })))

      setSecurityScore(Math.min(securityScore + 10, 100))

      reportSecurityEvent({
        type: 'unusual_activity',
        severity: 'low',
        userId: user?.id || 'system',
        details: 'Security enhancement applied',
        resolved: true
      })

    } finally {
      setIsLoading(false)
    }
  }

  const resolveSecurityEvent = (eventId: string) => {
    setSecurityEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, resolved: true } : event
    ))
  }

  const value = {
    metrics,
    systemHealth,
    isLoading,
    securityEvents,
    securityScore,
    threatLevel,
    trackPageLoad,
    trackApiCall,
    trackUserInteraction,
    reportSecurityEvent,
    clearCache,
    optimizePerformance,
    enhanceSecurity,
    resolveSecurityEvent
  }

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  )
}