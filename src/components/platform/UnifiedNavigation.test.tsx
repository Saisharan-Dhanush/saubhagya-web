import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { UnifiedNavigation } from './UnifiedNavigation'
import { AuthProvider } from '../../contexts/AuthContext'
import { PlatformProvider } from '../../contexts/PlatformContext'
import { BrowserRouter } from 'react-router-dom'

// Mock AuthContext
const mockUser = {
  id: 'test-user',
  email: 'test@example.com',
  name: 'Test User',
  role: 'executive' as const,
  permissions: ['dashboard:read', 'analytics:read'],
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

// Mock PlatformContext
const mockPlatformContext = {
  modules: [
    {
      id: 'urjasanyojak',
      name: 'UrjaSanyojak',
      displayName: 'Biogas Cluster Management',
      description: 'Manage biogas production clusters',
      url: '/urjasanyojak',
      icon: 'Factory',
      category: 'operational' as const,
      requiredRoles: ['executive', 'operator'],
      status: 'active' as const,
      lastUpdated: new Date()
    },
    {
      id: 'urja-neta',
      name: 'UrjaNeta',
      displayName: 'Executive Analytics',
      description: 'Executive dashboard and analytics',
      url: '/urjaneta',
      icon: 'Brain',
      category: 'executive' as const,
      requiredRoles: ['executive'],
      status: 'active' as const,
      lastUpdated: new Date()
    }
  ],
  navigationState: {
    currentModule: 'urjasanyojak',
    previousModule: null,
    navigationHistory: ['urjasanyojak'],
    breadcrumbs: [
      { label: 'Home', url: '/', module: 'urjasanyojak' }
    ]
  },
  platformSettings: {
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Kolkata',
    autoSave: true,
    sessionTimeout: 240,
    notifications: {
      email: true,
      browser: true,
      categories: ['urgent', 'security']
    }
  },
  sessionMetrics: {
    sessionStartTime: new Date(),
    totalSessions: 1,
    activeModules: ['urjasanyojak'],
    averageSessionDuration: 0,
    moduleUsageStats: { 'urjasanyojak': 1 },
    lastActivity: new Date()
  },
  navigateToModule: vi.fn(),
  updateBreadcrumbs: vi.fn(),
  goBack: vi.fn(),
  getAccessibleModules: vi.fn().mockReturnValue([
    {
      id: 'urjasanyojak',
      name: 'UrjaSanyojak',
      displayName: 'Biogas Cluster Management',
      category: 'operational',
      status: 'active'
    },
    {
      id: 'urja-neta',
      name: 'UrjaNeta',
      displayName: 'Executive Analytics',
      category: 'executive',
      status: 'active'
    }
  ]),
  isModuleAccessible: vi.fn().mockReturnValue(true),
  updatePlatformSettings: vi.fn(),
  trackModuleUsage: vi.fn(),
  getSessionSummary: vi.fn().mockReturnValue({
    totalSessions: 1,
    activeModules: ['urjasanyojak'],
    averageSessionDuration: 0,
    moduleUsageStats: { 'urjasanyojak': 1 }
  })
}

// Mock context modules
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('../../contexts/PlatformContext', () => ({
  usePlatform: () => mockPlatformContext,
  PlatformProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  }
})

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock UI components
vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  )
}))

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span className={`badge ${variant}`}>{children}</span>
  )
}))

vi.mock('../../components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div className="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div className="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div className="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div className="dropdown-item" onClick={onClick}>{children}</div>
  ),
  DropdownMenuSeparator: () => <div className="dropdown-separator" />
}))

vi.mock('../../components/ui/input', () => ({
  Input: ({ placeholder, onChange, value, className, ...props }: any) => (
    <input
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={className}
      {...props}
    />
  )
}))

// Mock Lucide icons
const MockIcon = ({ className }: { className?: string }) => (
  <span className={`icon ${className}`}>Icon</span>
)

vi.mock('lucide-react', () => ({
  Menu: MockIcon,
  Search: MockIcon,
  Bell: MockIcon,
  Settings: MockIcon,
  LogOut: MockIcon,
  User: MockIcon,
  Globe: MockIcon,
  Factory: MockIcon,
  Filter: MockIcon,
  TrendingUp: MockIcon,
  Brain: MockIcon,
  Crown: MockIcon,
  Shield: MockIcon,
  Home: MockIcon,
  ChevronDown: MockIcon,
  AlertTriangle: MockIcon,
  CheckCircle: MockIcon
}))

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <PlatformProvider>
        {children}
      </PlatformProvider>
    </AuthProvider>
  </BrowserRouter>
)

describe('UnifiedNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Component Rendering', () => {
    it('renders navigation without errors', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      expect(screen.getByText('SAUBHAGYA')).toBeInTheDocument()
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('displays current module information', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      expect(screen.getByText('Biogas Cluster Management')).toBeInTheDocument()
    })

    it('shows executive badge for executive users', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      expect(screen.getByText('EXECUTIVE')).toBeInTheDocument()
    })

    it('displays session timer', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // Should show session timer
      expect(screen.getByText(/4h 0m/)).toBeInTheDocument()
    })
  })

  describe('Module Navigation', () => {
    it('displays module dropdown when clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const moduleButton = screen.getByText('Biogas Cluster Management')
      await user.click(moduleButton)

      expect(screen.getByText('UrjaSanyojak')).toBeInTheDocument()
      expect(screen.getByText('UrjaNeta')).toBeInTheDocument()
    })

    it('navigates to selected module', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const moduleButton = screen.getByText('Biogas Cluster Management')
      await user.click(moduleButton)

      const urjaNeta = screen.getByText('UrjaNeta')
      await user.click(urjaNeta)

      expect(mockPlatformContext.navigateToModule).toHaveBeenCalledWith('urja-neta')
    })

    it('filters modules based on user access', () => {
      mockPlatformContext.getAccessibleModules.mockReturnValue([
        {
          id: 'urjasanyojak',
          name: 'UrjaSanyojak',
          displayName: 'Biogas Cluster Management',
          category: 'operational',
          status: 'active'
        }
      ])

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // Should only show accessible modules
      expect(mockPlatformContext.getAccessibleModules).toHaveBeenCalled()
    })
  })

  describe('Search Functionality', () => {
    it('shows search input when search button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      expect(screen.getByPlaceholderText('Search modules, features...')).toBeInTheDocument()
    })

    it('filters modules based on search input', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      const searchInput = screen.getByPlaceholderText('Search modules, features...')
      await user.type(searchInput, 'analytics')

      expect(searchInput).toHaveValue('analytics')
    })

    it('closes search when clicking outside', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      const searchInput = screen.getByPlaceholderText('Search modules, features...')
      expect(searchInput).toBeInTheDocument()

      // Click outside
      await user.click(document.body)

      expect(screen.queryByPlaceholderText('Search modules, features...')).not.toBeInTheDocument()
    })
  })

  describe('Notifications', () => {
    it('displays notification bell', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const notificationButton = screen.getByRole('button', { name: /notifications/i })
      expect(notificationButton).toBeInTheDocument()
    })

    it('shows notification dropdown when clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const notificationButton = screen.getByRole('button', { name: /notifications/i })
      await user.click(notificationButton)

      expect(screen.getByText('Notifications')).toBeInTheDocument()
    })

    it('displays notification count badge', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // Should show notification count if there are notifications
      const notificationBadge = screen.queryByText(/\d+/)
      expect(notificationBadge).toBeInTheDocument()
    })
  })

  describe('User Menu', () => {
    it('displays user menu dropdown when user info is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const userButton = screen.getByText('Test User')
      await user.click(userButton)

      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Sign Out')).toBeInTheDocument()
    })

    it('calls logout when sign out is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const userButton = screen.getByText('Test User')
      await user.click(userButton)

      const signOutButton = screen.getByText('Sign Out')
      await user.click(signOutButton)

      expect(mockAuthContext.logout).toHaveBeenCalled()
    })

    it('displays user role and access level', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      expect(screen.getByText('EXECUTIVE')).toBeInTheDocument()
    })
  })

  describe('Language Toggle', () => {
    it('displays language toggle button', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const languageButton = screen.getByRole('button', { name: /language/i })
      expect(languageButton).toBeInTheDocument()
    })

    it('changes language when toggle is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const languageButton = screen.getByRole('button', { name: /language/i })
      await user.click(languageButton)

      expect(mockPlatformContext.updatePlatformSettings).toHaveBeenCalledWith({
        language: 'hi'
      })
    })

    it('displays current language', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      expect(screen.getByText('EN')).toBeInTheDocument()
    })
  })

  describe('Session Management', () => {
    it('displays session timeout countdown', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // Should show remaining session time
      expect(screen.getByText(/4h 0m/)).toBeInTheDocument()
    })

    it('warns when session is about to expire', () => {
      // Mock low session time
      const lowTimeSettings = {
        ...mockPlatformContext.platformSettings,
        sessionTimeout: 5 // 5 minutes
      }

      const mockPlatformWithLowTime = {
        ...mockPlatformContext,
        platformSettings: lowTimeSettings
      }

      vi.mocked(require('../../contexts/PlatformContext').usePlatform).mockReturnValue(mockPlatformWithLowTime)

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // Should show warning for low session time
      expect(screen.getByText(/0h 5m/)).toBeInTheDocument()
    })
  })

  describe('System Status Indicators', () => {
    it('displays system health indicator', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // Should show system status
      const healthIndicator = screen.getByText('System Healthy')
      expect(healthIndicator).toBeInTheDocument()
    })

    it('shows connectivity status', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // Should show online status
      expect(screen.getByText('Online')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('shows mobile menu button on small screens', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      })

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const mobileMenuButton = screen.getByRole('button', { name: /menu/i })
      expect(mobileMenuButton).toBeInTheDocument()
    })

    it('toggles mobile menu visibility', async () => {
      const user = userEvent.setup()

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      })

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const mobileMenuButton = screen.getByRole('button', { name: /menu/i })
      await user.click(mobileMenuButton)

      // Mobile menu should be visible
      expect(screen.getByText('SAUBHAGYA')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // Tab through navigation elements
      await user.tab()
      expect(screen.getByText('Biogas Cluster Management')).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: /search/i })).toHaveFocus()
    })

    it('provides screen reader friendly text', () => {
      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      expect(screen.getByLabelText(/current module/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/user menu/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing user gracefully', () => {
      const mockAuthWithoutUser = {
        ...mockAuthContext,
        user: null
      }

      vi.mocked(require('../../contexts/AuthContext').useAuth).mockReturnValue(mockAuthWithoutUser)

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      expect(screen.getByText('Guest')).toBeInTheDocument()
    })

    it('handles navigation errors gracefully', async () => {
      const user = userEvent.setup()
      mockPlatformContext.navigateToModule.mockImplementation(() => {
        throw new Error('Navigation failed')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      const moduleButton = screen.getByText('Biogas Cluster Management')
      await user.click(moduleButton)

      // Should handle navigation error gracefully
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Performance Optimization', () => {
    it('memoizes expensive operations', () => {
      const { rerender } = render(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // Rerender with same props
      rerender(
        <TestWrapper>
          <UnifiedNavigation />
        </TestWrapper>
      )

      // getAccessibleModules should not be called excessively
      expect(mockPlatformContext.getAccessibleModules).toHaveBeenCalledTimes(1)
    })
  })
})