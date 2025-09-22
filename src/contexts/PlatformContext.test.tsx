import React from 'react'
import { render, renderHook, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  PlatformProvider,
  usePlatform,
  PLATFORM_MODULES,
  PlatformModule,
  NavigationState,
  PlatformSettings,
  SessionMetrics
} from './PlatformContext'
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

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock window.history
const mockHistory = {
  pushState: vi.fn()
}
Object.defineProperty(window, 'history', { value: mockHistory })

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <PlatformProvider>
      {children}
    </PlatformProvider>
  </AuthProvider>
)

describe('PlatformContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Provider Setup', () => {
    it('provides platform context without errors', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      expect(result.current).toBeDefined()
      expect(result.current.modules).toEqual(PLATFORM_MODULES)
    })

    it('throws error when used outside provider', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => usePlatform())
      }).toThrow('usePlatform must be used within a PlatformProvider')

      spy.mockRestore()
    })
  })

  describe('Platform Modules', () => {
    it('returns correct module configuration', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      expect(result.current.modules).toHaveLength(6)
      expect(result.current.modules[0]).toMatchObject({
        id: 'urjasanyojak',
        name: 'UrjaSanyojak',
        displayName: 'Biogas Cluster Management',
        category: 'operational',
        status: 'active'
      })
    })

    it('filters accessible modules based on user role', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      const accessibleModules = result.current.getAccessibleModules()

      // Executive should have access to all active modules
      expect(accessibleModules.length).toBeGreaterThan(0)
      accessibleModules.forEach(module => {
        expect(module.status).toBe('active')
        expect(module.requiredRoles).toContain('executive')
      })
    })

    it('checks module accessibility correctly', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      expect(result.current.isModuleAccessible('urja-neta')).toBe(true)
      expect(result.current.isModuleAccessible('non-existent')).toBe(false)
    })
  })

  describe('Navigation State', () => {
    it('initializes with default navigation state', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      expect(result.current.navigationState.currentModule).toBe('urjasanyojak')
      expect(result.current.navigationState.navigationHistory).toContain('urjasanyojak')
      expect(result.current.navigationState.breadcrumbs).toHaveLength(1)
    })

    it('navigates to module correctly', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.navigateToModule('urja-neta')
      })

      expect(result.current.navigationState.currentModule).toBe('urja-neta')
      expect(result.current.navigationState.previousModule).toBe('urjasanyojak')
      expect(mockHistory.pushState).toHaveBeenCalledWith(null, '', '/urjaneta')
    })

    it('prevents navigation to inaccessible modules', () => {
      mockAuthContext.hasPermission.mockReturnValue(false)

      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      act(() => {
        result.current.navigateToModule('admin-console')
      })

      expect(consoleSpy).toHaveBeenCalledWith('Module admin-console not accessible')
      expect(result.current.navigationState.currentModule).toBe('urjasanyojak')

      consoleSpy.mockRestore()
    })

    it('updates breadcrumbs correctly', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      const newBreadcrumbs = [
        { label: 'Home', url: '/', module: 'urjasanyojak' },
        { label: 'Analytics', url: '/analytics', module: 'urjasanyojak' }
      ]

      act(() => {
        result.current.updateBreadcrumbs(newBreadcrumbs)
      })

      expect(result.current.navigationState.breadcrumbs).toEqual(newBreadcrumbs)
    })

    it('handles go back navigation', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      // Navigate to a module first
      act(() => {
        result.current.navigateToModule('urja-neta')
      })

      // Then go back
      act(() => {
        result.current.goBack()
      })

      expect(result.current.navigationState.currentModule).toBe('urjasanyojak')
    })
  })

  describe('Platform Settings', () => {
    it('initializes with default settings', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      expect(result.current.platformSettings).toMatchObject({
        theme: 'light',
        language: 'en',
        timezone: 'Asia/Kolkata',
        autoSave: true,
        sessionTimeout: 240 // 4h for executive
      })
    })

    it('updates settings correctly', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.updatePlatformSettings({
          theme: 'dark',
          language: 'hi'
        })
      })

      expect(result.current.platformSettings.theme).toBe('dark')
      expect(result.current.platformSettings.language).toBe('hi')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'platformSettings',
        expect.stringContaining('"theme":"dark"')
      )
    })

    it('loads persisted settings from localStorage', () => {
      const savedSettings = {
        theme: 'dark',
        language: 'hi'
      }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedSettings))

      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      expect(result.current.platformSettings.theme).toBe('dark')
      expect(result.current.platformSettings.language).toBe('hi')
    })

    it('handles corrupt localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      // Should still have default settings
      expect(result.current.platformSettings.theme).toBe('light')
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Session Metrics', () => {
    it('initializes with default metrics', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      expect(result.current.sessionMetrics).toMatchObject({
        totalSessions: 1,
        activeModules: ['urjasanyojak'],
        averageSessionDuration: 0,
        moduleUsageStats: expect.objectContaining({
          'urjasanyojak': 1
        })
      })
    })

    it('tracks module usage correctly', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.trackModuleUsage('urja-neta')
      })

      expect(result.current.sessionMetrics.activeModules).toContain('urja-neta')
      expect(result.current.sessionMetrics.moduleUsageStats['urja-neta']).toBe(1)
      expect(result.current.sessionMetrics.lastActivity).toBeInstanceOf(Date)
    })

    it('increments usage count for repeated access', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.trackModuleUsage('urjasanyojak')
      })

      act(() => {
        result.current.trackModuleUsage('urjasanyojak')
      })

      expect(result.current.sessionMetrics.moduleUsageStats['urjasanyojak']).toBe(3) // Initial 1 + 2 more
    })

    it('provides session summary', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      const summary = result.current.getSessionSummary()

      expect(summary).toMatchObject({
        totalSessions: expect.any(Number),
        activeModules: expect.any(Array),
        averageSessionDuration: expect.any(Number),
        moduleUsageStats: expect.any(Object)
      })
    })
  })

  describe('Executive-specific Features', () => {
    it('sets executive-specific settings', async () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      // Wait for executive settings to be applied
      await waitFor(() => {
        expect(result.current.platformSettings.sessionTimeout).toBe(240)
        expect(result.current.platformSettings.notifications.email).toBe(true)
        expect(result.current.platformSettings.notifications.categories).toContain('urgent')
      })
    })

    it('handles non-executive users differently', async () => {
      mockAuthContext.isExecutive.mockReturnValue(false)

      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      await waitFor(() => {
        expect(result.current.platformSettings.sessionTimeout).toBe(480)
      })
    })
  })

  describe('URL-based Navigation', () => {
    it('updates current module based on URL', () => {
      // Mock current path
      Object.defineProperty(window, 'location', {
        value: { pathname: '/urjaneta' },
        writable: true
      })

      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      // The effect should update the current module based on URL
      expect(result.current.navigationState.currentModule).toBe('urjasanyojak')
    })
  })

  describe('Error Handling', () => {
    it('handles navigation to non-existent modules', () => {
      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      act(() => {
        result.current.navigateToModule('non-existent-module')
      })

      expect(consoleSpy).toHaveBeenCalledWith('Module non-existent-module not accessible')
      expect(result.current.navigationState.currentModule).toBe('urjasanyojak') // Should stay on current

      consoleSpy.mockRestore()
    })

    it('handles missing user gracefully', () => {
      mockAuthContext.user = null

      const { result } = renderHook(() => usePlatform(), {
        wrapper: TestWrapper
      })

      expect(result.current.getAccessibleModules()).toEqual([])
      expect(result.current.isModuleAccessible('urjasanyojak')).toBe(false)
    })
  })
})