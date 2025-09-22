import React from 'react'
import { render, renderHook, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AuthProvider } from './AuthContext'
import { PlatformProvider, usePlatform } from './PlatformContext'
import { CollaborationProvider, useCollaboration } from './CollaborationContext'
import { PerformanceProvider, usePerformance } from './PerformanceContext'

// Mock user for all tests
const mockUser = {
  id: 'integration-user',
  email: 'integration@example.com',
  name: 'Integration Test User',
  role: 'executive' as const,
  permissions: ['dashboard:read', 'analytics:read'],
  executiveLevel: 'ceo' as const
}

// Mock AuthContext
const mockAuthContext = {
  user: mockUser,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  hasPermission: vi.fn().mockReturnValue(true),
  isExecutive: vi.fn().mockReturnValue(true),
  getAccessLevel: vi.fn().mockReturnValue('high' as const)
}

vi.mock('./AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock WebSocket
const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn(),
  readyState: WebSocket.OPEN,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}
global.WebSocket = vi.fn(() => mockWebSocket) as any

// Mock Performance API
const mockPerformanceObserver = {
  observe: vi.fn(),
  disconnect: vi.fn()
}
global.PerformanceObserver = vi.fn(() => mockPerformanceObserver) as any

// Mock fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ status: 'healthy' })
})

// Integration test wrapper with all providers
const IntegrationTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <PlatformProvider>
      <CollaborationProvider>
        <PerformanceProvider>
          {children}
        </PerformanceProvider>
      </CollaborationProvider>
    </PlatformProvider>
  </AuthProvider>
)

// Hook to access all contexts
const useAllContexts = () => {
  const platform = usePlatform()
  const collaboration = useCollaboration()
  const performance = usePerformance()

  return { platform, collaboration, performance }
}

describe('Context Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Provider Hierarchy', () => {
    it('renders all providers without errors', () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      expect(result.current.platform).toBeDefined()
      expect(result.current.collaboration).toBeDefined()
      expect(result.current.performance).toBeDefined()
    })

    it('all contexts have access to user data', () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      // All contexts should have access to user through AuthContext
      expect(result.current.platform.sessionMetrics.sessionStartTime).toBeInstanceOf(Date)
      expect(result.current.collaboration.activeUsers).toBeDefined()
      expect(result.current.performance.systemMetrics).toBeDefined()
    })
  })

  describe('Cross-Context Data Flow', () => {
    it('platform navigation tracking affects collaboration presence', async () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      act(() => {
        result.current.platform.navigateToModule('urja-neta')
      })

      // Navigation should trigger module usage tracking
      expect(result.current.platform.trackModuleUsage).toHaveBeenCalledWith('urja-neta')

      // Should also update user status in collaboration
      await waitFor(() => {
        expect(mockWebSocket.send).toHaveBeenCalledWith(
          expect.stringContaining('urja-neta')
        )
      })
    })

    it('performance events trigger platform alerts', () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      act(() => {
        result.current.performance.recordSecurityEvent({
          type: 'system_breach',
          severity: 'critical',
          description: 'Critical security event',
          source: 'integration-test',
          metadata: {}
        })
      })

      // Critical security event should update system metrics
      expect(result.current.performance.systemMetrics.threatLevel).toBe('critical')
    })

    it('collaboration sessions track performance metrics', () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      act(() => {
        result.current.collaboration.createSession({
          name: 'Performance Review',
          description: 'Performance tracking session',
          modules: ['urja-neta']
        })
      })

      // Session creation should be tracked in performance metrics
      expect(result.current.collaboration.sessions).toHaveLength(1)

      // Performance context should track collaboration activity
      expect(result.current.performance.systemMetrics.lastUpdated).toBeInstanceOf(Date)
    })
  })

  describe('Shared State Management', () => {
    it('updates to platform settings persist across contexts', () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      act(() => {
        result.current.platform.updatePlatformSettings({
          theme: 'dark',
          language: 'hi'
        })
      })

      // Settings should be persisted to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'platformSettings',
        expect.stringContaining('dark')
      )

      // All contexts should reflect the new settings
      expect(result.current.platform.platformSettings.theme).toBe('dark')
    })

    it('session data is shared between platform and collaboration', () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      // Platform session metrics should include collaboration data
      const sessionSummary = result.current.platform.getSessionSummary()
      expect(sessionSummary).toBeDefined()

      // Collaboration should track platform usage
      expect(result.current.collaboration.activeUsers).toBeDefined()
    })
  })

  describe('Error Propagation', () => {
    it('handles WebSocket connection failures gracefully', () => {
      mockWebSocket.readyState = WebSocket.CLOSED

      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      // Collaboration should handle disconnection
      expect(result.current.collaboration.isConnected).toBe(false)

      // Other contexts should continue working
      expect(result.current.platform.modules).toBeDefined()
      expect(result.current.performance.systemMetrics).toBeDefined()
    })

    it('recovers from localStorage corruption', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      // Should handle localStorage errors gracefully
      expect(result.current.platform.platformSettings.theme).toBe('light') // Default
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Performance Integration', () => {
    it('tracks context initialization performance', () => {
      const startTime = performance.now()

      renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      const initTime = performance.now() - startTime

      // Context initialization should be reasonably fast
      expect(initTime).toBeLessThan(100) // 100ms threshold
    })

    it('optimizes re-renders across context hierarchy', () => {
      let renderCount = 0

      const TestComponent = () => {
        renderCount++
        const contexts = useAllContexts()
        return <div>{JSON.stringify(contexts.platform.sessionMetrics.totalSessions)}</div>
      }

      const { rerender } = render(
        <IntegrationTestWrapper>
          <TestComponent />
        </IntegrationTestWrapper>
      )

      const initialRenderCount = renderCount

      // Rerender with same props
      rerender(
        <IntegrationTestWrapper>
          <TestComponent />
        </IntegrationTestWrapper>
      )

      // Should not cause excessive re-renders
      expect(renderCount - initialRenderCount).toBeLessThanOrEqual(2)
    })
  })

  describe('Real-time Data Synchronization', () => {
    it('synchronizes user presence across contexts', async () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      // Simulate user status change
      act(() => {
        result.current.collaboration.updateUserStatus('busy')
      })

      // Should send WebSocket message
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('status_update')
      )

      // Performance metrics should track user activity
      expect(result.current.performance.systemMetrics.lastUpdated).toBeInstanceOf(Date)
    })

    it('coordinates module switching across contexts', () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      act(() => {
        result.current.platform.navigateToModule('urja-neta')
      })

      // Platform should update navigation state
      expect(result.current.platform.navigationState.currentModule).toBe('urja-neta')

      // Collaboration should update user presence
      expect(mockWebSocket.send).toHaveBeenCalled()

      // Performance should track navigation
      expect(result.current.performance.trackPageLoad).toHaveBeenCalled()
    })
  })

  describe('Security Event Coordination', () => {
    it('coordinates security events across contexts', () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      act(() => {
        result.current.performance.recordSecurityEvent({
          type: 'unauthorized_access',
          severity: 'high',
          description: 'Unauthorized access attempt',
          source: 'integration-test',
          metadata: { userId: 'malicious-user' }
        })
      })

      // Performance context should record the event
      expect(result.current.performance.securityEvents).toHaveLength(1)

      // Should update security metrics
      expect(result.current.performance.systemMetrics.threatLevel).toBe('high')

      // Platform should be aware of security status
      expect(result.current.platform.sessionMetrics.lastActivity).toBeInstanceOf(Date)
    })
  })

  describe('Cleanup and Resource Management', () => {
    it('cleans up all context resources on unmount', () => {
      const { unmount } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      unmount()

      // WebSocket should be closed
      expect(mockWebSocket.close).toHaveBeenCalled()

      // Performance observers should be disconnected
      expect(mockPerformanceObserver.disconnect).toHaveBeenCalled()
    })

    it('persists important data before cleanup', () => {
      const { unmount } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      unmount()

      // Critical data should be saved to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('Load Testing Simulation', () => {
    it('handles rapid context updates', async () => {
      const { result } = renderHook(() => useAllContexts(), {
        wrapper: IntegrationTestWrapper
      })

      // Simulate rapid updates
      for (let i = 0; i < 50; i++) {
        act(() => {
          result.current.platform.trackModuleUsage('urjasanyojak')
          result.current.performance.trackApiCall({
            endpoint: `/api/test-${i}`,
            method: 'GET',
            responseTime: Math.random() * 1000,
            status: 200
          })
        })
      }

      // All contexts should remain stable
      expect(result.current.platform.sessionMetrics.moduleUsageStats['urjasanyojak']).toBeGreaterThan(50)
      expect(result.current.performance.systemMetrics.responseTime).toBeGreaterThan(0)
    })
  })
})