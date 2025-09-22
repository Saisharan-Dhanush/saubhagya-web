import React from 'react'
import { render, renderHook, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  PerformanceProvider,
  usePerformance,
  SystemMetrics,
  SecurityEvent,
  PerformanceAlert
} from './PerformanceContext'
import { AuthProvider } from './AuthContext'

// Mock AuthContext
const mockUser = {
  id: 'test-user',
  email: 'test@example.com',
  name: 'Test User',
  role: 'executive' as const,
  permissions: [],
  executiveLevel: 'ceo' as const
}

const mockAuthContext = {
  user: mockUser,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  hasPermission: vi.fn().mockReturnValue(true),
  isExecutive: vi.fn().mockReturnValue(true),
  getAccessLevel: vi.fn().mockReturnValue('high' as const)
}

// Mock AuthContext module
vi.mock('./AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock Performance API
const mockPerformanceObserver = {
  observe: vi.fn(),
  disconnect: vi.fn()
}

global.PerformanceObserver = vi.fn(() => mockPerformanceObserver) as any

// Mock Navigator API
Object.defineProperty(navigator, 'connection', {
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 100
  },
  writable: true
})

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock fetch for API calls
global.fetch = vi.fn()

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <PerformanceProvider>
      {children}
    </PerformanceProvider>
  </AuthProvider>
)

describe('PerformanceContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'healthy' })
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Provider Setup', () => {
    it('provides performance context without errors', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      expect(result.current).toBeDefined()
      expect(result.current.systemMetrics).toBeDefined()
      expect(result.current.securityEvents).toEqual([])
      expect(result.current.performanceAlerts).toEqual([])
    })

    it('throws error when used outside provider', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => usePerformance())
      }).toThrow('usePerformance must be used within a PerformanceProvider')

      spy.mockRestore()
    })
  })

  describe('System Metrics Collection', () => {
    it('initializes with default system metrics', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      expect(result.current.systemMetrics).toMatchObject({
        cpu: expect.any(Number),
        memory: expect.any(Number),
        network: expect.any(Number),
        responseTime: expect.any(Number),
        throughput: expect.any(Number),
        errorRate: expect.any(Number),
        uptime: expect.any(Number),
        securityScore: expect.any(Number),
        threatLevel: expect.any(String),
        lastUpdated: expect.any(Date)
      })
    })

    it('collects real-time performance metrics', async () => {
      vi.useFakeTimers()

      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const initialMetrics = result.current.systemMetrics

      // Fast-forward timer to trigger metrics collection
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      await waitFor(() => {
        expect(result.current.systemMetrics.lastUpdated.getTime()).toBeGreaterThan(
          initialMetrics.lastUpdated.getTime()
        )
      })

      vi.useRealTimers()
    })

    it('tracks page load performance', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const performanceData = {
        name: 'test-page',
        duration: 1250,
        type: 'navigation' as const
      }

      act(() => {
        result.current.trackPageLoad(performanceData)
      })

      expect(result.current.systemMetrics.responseTime).toBeLessThanOrEqual(1250)
    })

    it('tracks API response times', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const apiMetrics = {
        endpoint: '/api/dashboard',
        method: 'GET',
        responseTime: 850,
        status: 200
      }

      act(() => {
        result.current.trackApiCall(apiMetrics)
      })

      // Should update response time metrics
      expect(result.current.systemMetrics.responseTime).toBeDefined()
      expect(result.current.systemMetrics.errorRate).toBeLessThanOrEqual(100)
    })

    it('calculates performance scores correctly', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const score = result.current.getPerformanceScore()

      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
      expect(typeof score).toBe('number')
    })
  })

  describe('Security Event Tracking', () => {
    it('records security events', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const securityEvent = {
        type: 'authentication_failed' as const,
        severity: 'medium' as const,
        description: 'Failed login attempt from suspicious IP',
        source: 'auth-service',
        metadata: { ip: '192.168.1.100', userAgent: 'test-agent' }
      }

      act(() => {
        result.current.recordSecurityEvent(securityEvent)
      })

      expect(result.current.securityEvents).toHaveLength(1)
      expect(result.current.securityEvents[0].type).toBe('authentication_failed')
      expect(result.current.securityEvents[0].severity).toBe('medium')
    })

    it('calculates security score based on events', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Record multiple security events
      act(() => {
        result.current.recordSecurityEvent({
          type: 'authentication_failed',
          severity: 'high',
          description: 'Critical security event',
          source: 'auth-service',
          metadata: {}
        })
      })

      act(() => {
        result.current.recordSecurityEvent({
          type: 'unauthorized_access',
          severity: 'medium',
          description: 'Unauthorized access attempt',
          source: 'api-gateway',
          metadata: {}
        })
      })

      const securityScore = result.current.getSecurityScore()
      expect(securityScore).toBeGreaterThanOrEqual(0)
      expect(securityScore).toBeLessThanOrEqual(100)

      // More events should lower the security score
      expect(securityScore).toBeLessThan(95)
    })

    it('determines threat level correctly', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Start with low threat
      expect(result.current.systemMetrics.threatLevel).toBe('low')

      // Add critical security event
      act(() => {
        result.current.recordSecurityEvent({
          type: 'system_breach',
          severity: 'critical',
          description: 'System breach detected',
          source: 'security-monitor',
          metadata: {}
        })
      })

      expect(result.current.systemMetrics.threatLevel).toBe('critical')
    })

    it('limits security events to prevent memory issues', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Add many security events
      for (let i = 0; i < 150; i++) {
        act(() => {
          result.current.recordSecurityEvent({
            type: 'authentication_failed',
            severity: 'low',
            description: `Event ${i}`,
            source: 'test',
            metadata: {}
          })
        })
      }

      // Should be limited to 100 events
      expect(result.current.securityEvents).toHaveLength(100)
    })
  })

  describe('Performance Alerts', () => {
    it('creates performance alerts for issues', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const alert = {
        type: 'high_response_time' as const,
        severity: 'warning' as const,
        message: 'API response time exceeds threshold',
        metric: 'responseTime',
        value: 2500,
        threshold: 2000
      }

      act(() => {
        result.current.addPerformanceAlert(alert)
      })

      expect(result.current.performanceAlerts).toHaveLength(1)
      expect(result.current.performanceAlerts[0].type).toBe('high_response_time')
    })

    it('auto-generates alerts for performance thresholds', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Simulate high response time
      act(() => {
        result.current.trackApiCall({
          endpoint: '/api/slow-endpoint',
          method: 'GET',
          responseTime: 5000, // 5 seconds - should trigger alert
          status: 200
        })
      })

      // Should generate high response time alert
      expect(result.current.performanceAlerts.some(
        alert => alert.type === 'high_response_time'
      )).toBe(true)
    })

    it('dismisses performance alerts', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Add an alert
      act(() => {
        result.current.addPerformanceAlert({
          type: 'high_cpu',
          severity: 'warning',
          message: 'High CPU usage detected',
          metric: 'cpu',
          value: 90,
          threshold: 80
        })
      })

      const alertId = result.current.performanceAlerts[0].id

      act(() => {
        result.current.dismissAlert(alertId)
      })

      expect(result.current.performanceAlerts).toHaveLength(0)
    })

    it('categorizes alerts by severity', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Add alerts of different severities
      act(() => {
        result.current.addPerformanceAlert({
          type: 'high_memory',
          severity: 'critical',
          message: 'Critical memory usage',
          metric: 'memory',
          value: 95,
          threshold: 90
        })
      })

      act(() => {
        result.current.addPerformanceAlert({
          type: 'network_latency',
          severity: 'warning',
          message: 'Network latency warning',
          metric: 'network',
          value: 200,
          threshold: 150
        })
      })

      const criticalAlerts = result.current.getAlertsBySeverity('critical')
      const warningAlerts = result.current.getAlertsBySeverity('warning')

      expect(criticalAlerts).toHaveLength(1)
      expect(warningAlerts).toHaveLength(1)
    })
  })

  describe('Health Monitoring', () => {
    it('performs system health checks', async () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      await act(async () => {
        await result.current.performHealthCheck()
      })

      expect(global.fetch).toHaveBeenCalledWith('/api/health')
      expect(result.current.systemMetrics.uptime).toBeGreaterThan(0)
    })

    it('handles health check failures', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Health check failed'))

      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await act(async () => {
        await result.current.performHealthCheck()
      })

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('tracks system uptime correctly', () => {
      vi.useFakeTimers()

      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const initialUptime = result.current.systemMetrics.uptime

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(60000) // 1 minute
      })

      expect(result.current.systemMetrics.uptime).toBeGreaterThan(initialUptime)

      vi.useRealTimers()
    })
  })

  describe('Network Performance Monitoring', () => {
    it('monitors network connection quality', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const networkInfo = result.current.getNetworkInfo()

      expect(networkInfo).toMatchObject({
        effectiveType: '4g',
        downlink: 10,
        rtt: 100
      })
    })

    it('tracks bandwidth usage', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.trackBandwidthUsage(1024 * 1024) // 1 MB
      })

      expect(result.current.systemMetrics.throughput).toBeGreaterThan(0)
    })

    it('detects network quality changes', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Simulate network change to slow connection
      act(() => {
        Object.defineProperty(navigator, 'connection', {
          value: {
            effectiveType: '2g',
            downlink: 0.5,
            rtt: 2000
          },
          writable: true
        })
      })

      // Should detect network degradation
      const networkInfo = result.current.getNetworkInfo()
      expect(networkInfo.effectiveType).toBe('2g')
    })
  })

  describe('Error Rate Tracking', () => {
    it('tracks API error rates', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Track successful calls
      act(() => {
        result.current.trackApiCall({
          endpoint: '/api/test',
          method: 'GET',
          responseTime: 100,
          status: 200
        })
      })

      // Track failed calls
      act(() => {
        result.current.trackApiCall({
          endpoint: '/api/test',
          method: 'GET',
          responseTime: 100,
          status: 500
        })
      })

      expect(result.current.systemMetrics.errorRate).toBeGreaterThan(0)
      expect(result.current.systemMetrics.errorRate).toBeLessThanOrEqual(100)
    })

    it('calculates error rate percentage correctly', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Track 8 successful and 2 failed calls (20% error rate)
      for (let i = 0; i < 8; i++) {
        act(() => {
          result.current.trackApiCall({
            endpoint: '/api/test',
            method: 'GET',
            responseTime: 100,
            status: 200
          })
        })
      }

      for (let i = 0; i < 2; i++) {
        act(() => {
          result.current.trackApiCall({
            endpoint: '/api/test',
            method: 'GET',
            responseTime: 100,
            status: 500
          })
        })
      }

      expect(result.current.systemMetrics.errorRate).toBeCloseTo(20, 1)
    })
  })

  describe('Data Persistence and Recovery', () => {
    it('persists performance data to localStorage', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.recordSecurityEvent({
          type: 'authentication_failed',
          severity: 'low',
          description: 'Test event',
          source: 'test',
          metadata: {}
        })
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'performanceData',
        expect.stringContaining('authentication_failed')
      )
    })

    it('loads persisted performance data on initialization', () => {
      const persistedData = {
        securityEvents: [{
          id: 'event-1',
          type: 'authentication_failed',
          severity: 'low',
          description: 'Persisted event',
          source: 'test',
          timestamp: new Date().toISOString(),
          metadata: {}
        }],
        performanceAlerts: []
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(persistedData))

      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      expect(result.current.securityEvents).toHaveLength(1)
      expect(result.current.securityEvents[0].description).toBe('Persisted event')
    })

    it('handles corrupt localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      expect(result.current.securityEvents).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Performance Optimization', () => {
    it('provides performance optimization suggestions', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Simulate poor performance conditions
      act(() => {
        result.current.trackApiCall({
          endpoint: '/api/slow',
          method: 'GET',
          responseTime: 5000,
          status: 200
        })
      })

      const suggestions = result.current.getOptimizationSuggestions()

      expect(suggestions).toContain('API response times are high - consider caching')
      expect(suggestions.length).toBeGreaterThan(0)
    })

    it('tracks performance improvements over time', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      const historicalData = result.current.getPerformanceHistory()

      expect(historicalData).toBeDefined()
      expect(Array.isArray(historicalData)).toBe(true)
    })
  })

  describe('Cleanup and Resource Management', () => {
    it('cleans up performance observers on unmount', () => {
      const { unmount } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      unmount()

      expect(mockPerformanceObserver.disconnect).toHaveBeenCalled()
    })

    it('clears performance data when requested', () => {
      const { result } = renderHook(() => usePerformance(), {
        wrapper: TestWrapper
      })

      // Add some data
      act(() => {
        result.current.recordSecurityEvent({
          type: 'authentication_failed',
          severity: 'low',
          description: 'Test',
          source: 'test',
          metadata: {}
        })
      })

      act(() => {
        result.current.clearPerformanceData()
      })

      expect(result.current.securityEvents).toEqual([])
      expect(result.current.performanceAlerts).toEqual([])
    })
  })
})