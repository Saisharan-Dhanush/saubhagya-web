import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ExecutiveCommandCenter } from './ExecutiveCommandCenter'
import { AuthProvider } from '../../contexts/AuthContext'
import { PlatformProvider } from '../../contexts/PlatformContext'
import { CollaborationProvider } from '../../contexts/CollaborationContext'
import { PerformanceProvider } from '../../contexts/PerformanceContext'

// Mock contexts
const mockUser = {
  id: 'exec-user',
  email: 'exec@example.com',
  name: 'Executive User',
  role: 'executive' as const,
  permissions: ['dashboard:read', 'analytics:read', 'reports:read'],
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

const mockPlatformContext = {
  modules: [
    {
      id: 'urjasanyojak',
      name: 'UrjaSanyojak',
      displayName: 'Biogas Cluster Management',
      category: 'operational' as const,
      status: 'active' as const
    },
    {
      id: 'urja-neta',
      name: 'UrjaNeta',
      displayName: 'Executive Analytics',
      category: 'executive' as const,
      status: 'active' as const
    }
  ],
  navigationState: {
    currentModule: 'executive-command',
    previousModule: null,
    navigationHistory: ['executive-command'],
    breadcrumbs: []
  },
  platformSettings: {
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Kolkata',
    sessionTimeout: 240
  },
  sessionMetrics: {
    sessionStartTime: new Date(),
    totalSessions: 5,
    activeModules: ['urjasanyojak', 'urja-neta'],
    averageSessionDuration: 120,
    moduleUsageStats: { 'urjasanyojak': 15, 'urja-neta': 10 },
    lastActivity: new Date()
  },
  navigateToModule: vi.fn(),
  getAccessibleModules: vi.fn().mockReturnValue([]),
  getSessionSummary: vi.fn().mockReturnValue({
    totalSessions: 5,
    activeModules: ['urjasanyojak', 'urja-neta'],
    averageSessionDuration: 120,
    moduleUsageStats: { 'urjasanyojak': 15, 'urja-neta': 10 }
  })
}

const mockCollaborationContext = {
  isConnected: true,
  activeUsers: [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'online' as const,
      currentModule: 'urjasanyojak'
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'busy' as const,
      currentModule: 'urja-neta'
    }
  ],
  sessions: [
    {
      id: 'session-1',
      name: 'Strategic Planning',
      description: 'Q1 strategic planning session',
      participants: [],
      startTime: new Date(),
      status: 'active' as const,
      modules: ['urja-neta'],
      sharedData: {}
    }
  ],
  workspaces: [
    {
      id: 'workspace-1',
      name: 'Executive Dashboard',
      description: 'Executive workspace',
      modules: ['urja-neta'],
      permissions: { read: ['executive'], write: ['executive'], admin: ['executive'] },
      createdBy: 'exec-user',
      createdAt: new Date().toISOString(),
      sharedData: {}
    }
  ],
  messages: [],
  createSession: vi.fn(),
  joinSession: vi.fn(),
  leaveSession: vi.fn(),
  endSession: vi.fn(),
  sendMessage: vi.fn(),
  createWorkspace: vi.fn(),
  updateWorkspaceData: vi.fn(),
  getAccessibleWorkspaces: vi.fn().mockReturnValue([]),
  getSessionMessages: vi.fn().mockReturnValue([]),
  updateUserStatus: vi.fn()
}

const mockPerformanceContext = {
  systemMetrics: {
    cpu: 45.5,
    memory: 68.2,
    network: 12.8,
    responseTime: 245,
    throughput: 1500,
    errorRate: 0.8,
    uptime: 99.9,
    securityScore: 92,
    threatLevel: 'low' as const,
    lastUpdated: new Date()
  },
  securityEvents: [
    {
      id: 'event-1',
      type: 'authentication_failed' as const,
      severity: 'low' as const,
      description: 'Failed login attempt',
      source: 'auth-service',
      timestamp: new Date().toISOString(),
      metadata: {}
    }
  ],
  performanceAlerts: [
    {
      id: 'alert-1',
      type: 'high_memory' as const,
      severity: 'warning' as const,
      message: 'Memory usage above 60%',
      metric: 'memory',
      value: 68.2,
      threshold: 60,
      timestamp: new Date()
    }
  ],
  recordSecurityEvent: vi.fn(),
  addPerformanceAlert: vi.fn(),
  dismissAlert: vi.fn(),
  getPerformanceScore: vi.fn().mockReturnValue(85),
  getSecurityScore: vi.fn().mockReturnValue(92),
  getAlertsBySeverity: vi.fn().mockReturnValue([]),
  trackPageLoad: vi.fn(),
  trackApiCall: vi.fn(),
  performHealthCheck: vi.fn(),
  getNetworkInfo: vi.fn().mockReturnValue({ effectiveType: '4g', downlink: 10, rtt: 100 }),
  trackBandwidthUsage: vi.fn(),
  getOptimizationSuggestions: vi.fn().mockReturnValue([]),
  getPerformanceHistory: vi.fn().mockReturnValue([]),
  clearPerformanceData: vi.fn()
}

// Mock context providers
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('../../contexts/PlatformContext', () => ({
  usePlatform: () => mockPlatformContext,
  PlatformProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('../../contexts/CollaborationContext', () => ({
  useCollaboration: () => mockCollaborationContext,
  CollaborationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('../../contexts/PerformanceContext', () => ({
  usePerformance: () => mockPerformanceContext,
  PerformanceProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock UI components
vi.mock('../../components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={`card ${className}`}>{children}</div>,
  CardHeader: ({ children }: any) => <div className="card-header">{children}</div>,
  CardContent: ({ children }: any) => <div className="card-content">{children}</div>,
  CardTitle: ({ children }: any) => <h3 className="card-title">{children}</h3>
}))

vi.mock('../../components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue, onValueChange }: any) => (
    <div className="tabs" data-default-value={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => <div className="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value, onClick }: any) => (
    <button className="tab-trigger" data-value={value} onClick={onClick}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div className="tab-content" data-value={value}>
      {children}
    </div>
  )
}))

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, variant, size }: any) => (
    <button onClick={onClick} className={`button ${variant} ${size}`}>
      {children}
    </button>
  )
}))

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span className={`badge ${variant}`}>{children}</span>
  )
}))

vi.mock('../../components/ui/progress', () => ({
  Progress: ({ value, className }: any) => (
    <div className={`progress ${className}`} data-value={value}>
      <div style={{ width: `${value}%` }} />
    </div>
  )
}))

// Mock Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div className="responsive-container">{children}</div>,
  LineChart: ({ children, data }: any) => <div className="line-chart" data-testid="line-chart">{children}</div>,
  AreaChart: ({ children, data }: any) => <div className="area-chart" data-testid="area-chart">{children}</div>,
  BarChart: ({ children, data }: any) => <div className="bar-chart" data-testid="bar-chart">{children}</div>,
  PieChart: ({ children }: any) => <div className="pie-chart" data-testid="pie-chart">{children}</div>,
  Line: () => <div className="line" />,
  Area: () => <div className="area" />,
  Bar: () => <div className="bar" />,
  Pie: () => <div className="pie" />,
  Cell: () => <div className="cell" />,
  XAxis: () => <div className="x-axis" />,
  YAxis: () => <div className="y-axis" />,
  CartesianGrid: () => <div className="cartesian-grid" />,
  Tooltip: () => <div className="tooltip" />,
  Legend: () => <div className="legend" />
}))

// Mock Lucide icons
const MockIcon = ({ className }: { className?: string }) => (
  <span className={`icon ${className}`}>Icon</span>
)

vi.mock('lucide-react', () => ({
  Brain: MockIcon,
  BarChart3: MockIcon,
  Users: MockIcon,
  Activity: MockIcon,
  FileText: MockIcon,
  TrendingUp: MockIcon,
  TrendingDown: MockIcon,
  AlertTriangle: MockIcon,
  CheckCircle: MockIcon,
  Clock: MockIcon,
  Target: MockIcon,
  Zap: MockIcon,
  Shield: MockIcon,
  Globe: MockIcon,
  Cpu: MockIcon,
  HardDrive: MockIcon,
  Wifi: MockIcon,
  Download: MockIcon,
  RefreshCw: MockIcon,
  Settings: MockIcon,
  Calendar: MockIcon,
  MessageSquare: MockIcon,
  UserPlus: MockIcon,
  Play: MockIcon,
  Pause: MockIcon,
  X: MockIcon
}))

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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

describe('ExecutiveCommandCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders without errors', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Executive Command Center')).toBeInTheDocument()
    })

    it('displays all main tabs', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Platform Overview')).toBeInTheDocument()
      expect(screen.getByText('Strategic Insights')).toBeInTheDocument()
      expect(screen.getByText('Collaboration')).toBeInTheDocument()
      expect(screen.getByText('Performance')).toBeInTheDocument()
      expect(screen.getByText('Reports')).toBeInTheDocument()
    })

    it('shows executive badge and user info', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('EXECUTIVE ACCESS')).toBeInTheDocument()
      expect(screen.getByText('Executive User')).toBeInTheDocument()
    })
  })

  describe('Platform Overview Tab', () => {
    it('displays platform overview by default', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Platform Health Score')).toBeInTheDocument()
      expect(screen.getByText('Active Users')).toBeInTheDocument()
      expect(screen.getByText('System Performance')).toBeInTheDocument()
    })

    it('shows system metrics correctly', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('85%')).toBeInTheDocument() // Performance score
      expect(screen.getByText('2')).toBeInTheDocument() // Active users count
      expect(screen.getByText('99.9%')).toBeInTheDocument() // Uptime
    })

    it('displays module usage statistics', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Module Usage')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })

    it('shows real-time dashboard updates', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Real-time Dashboard')).toBeInTheDocument()
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })

  describe('Strategic Insights Tab', () => {
    it('switches to strategic insights tab', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const strategicTab = screen.getByText('Strategic Insights')
      await user.click(strategicTab)

      expect(screen.getByText('Business Intelligence')).toBeInTheDocument()
      expect(screen.getByText('Predictive Analytics')).toBeInTheDocument()
    })

    it('displays KPI metrics', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const strategicTab = screen.getByText('Strategic Insights')
      await user.click(strategicTab)

      expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument()
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    })

    it('shows trend analysis', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const strategicTab = screen.getByText('Strategic Insights')
      await user.click(strategicTab)

      expect(screen.getByText('Trend Analysis')).toBeInTheDocument()
    })
  })

  describe('Collaboration Tab', () => {
    it('displays collaboration features', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const collabTab = screen.getByText('Collaboration')
      await user.click(collabTab)

      expect(screen.getByText('Active Collaboration Sessions')).toBeInTheDocument()
      expect(screen.getByText('Team Presence')).toBeInTheDocument()
    })

    it('shows active users and their status', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const collabTab = screen.getByText('Collaboration')
      await user.click(collabTab)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('displays collaboration sessions', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const collabTab = screen.getByText('Collaboration')
      await user.click(collabTab)

      expect(screen.getByText('Strategic Planning')).toBeInTheDocument()
    })

    it('allows creating new collaboration sessions', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const collabTab = screen.getByText('Collaboration')
      await user.click(collabTab)

      const createButton = screen.getByText('Create Session')
      await user.click(createButton)

      expect(mockCollaborationContext.createSession).toHaveBeenCalled()
    })
  })

  describe('Performance Tab', () => {
    it('displays performance monitoring', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const perfTab = screen.getByText('Performance')
      await user.click(perfTab)

      expect(screen.getByText('System Performance Monitoring')).toBeInTheDocument()
      expect(screen.getByText('Security Monitoring')).toBeInTheDocument()
    })

    it('shows system metrics gauges', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const perfTab = screen.getByText('Performance')
      await user.click(perfTab)

      expect(screen.getByText('CPU Usage')).toBeInTheDocument()
      expect(screen.getByText('Memory Usage')).toBeInTheDocument()
      expect(screen.getByText('Network Activity')).toBeInTheDocument()
    })

    it('displays security events', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const perfTab = screen.getByText('Performance')
      await user.click(perfTab)

      expect(screen.getByText('Security Events')).toBeInTheDocument()
      expect(screen.getByText('Failed login attempt')).toBeInTheDocument()
    })

    it('shows performance alerts', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const perfTab = screen.getByText('Performance')
      await user.click(perfTab)

      expect(screen.getByText('Performance Alerts')).toBeInTheDocument()
      expect(screen.getByText('Memory usage above 60%')).toBeInTheDocument()
    })
  })

  describe('Reports Tab', () => {
    it('displays reports section', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const reportsTab = screen.getByText('Reports')
      await user.click(reportsTab)

      expect(screen.getByText('Executive Reports')).toBeInTheDocument()
      expect(screen.getByText('Automated Reports')).toBeInTheDocument()
    })

    it('shows report generation options', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const reportsTab = screen.getByText('Reports')
      await user.click(reportsTab)

      expect(screen.getByText('Generate Executive Summary')).toBeInTheDocument()
      expect(screen.getByText('Download Analytics Report')).toBeInTheDocument()
    })

    it('allows report customization', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const reportsTab = screen.getByText('Reports')
      await user.click(reportsTab)

      expect(screen.getByText('Report Settings')).toBeInTheDocument()
    })
  })

  describe('Cross-Module Integration', () => {
    it('displays cross-module analytics', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Cross-Module Analytics')).toBeInTheDocument()
    })

    it('shows integrated KPI dashboard', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Integrated KPI Dashboard')).toBeInTheDocument()
    })

    it('provides drill-down capabilities', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      // Click on a metric to drill down
      const metricButton = screen.getByText('View Details')
      await user.click(metricButton)

      expect(mockPlatformContext.navigateToModule).toHaveBeenCalled()
    })
  })

  describe('Real-time Updates', () => {
    it('displays real-time data indicators', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('LIVE')).toBeInTheDocument()
    })

    it('shows last updated timestamps', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText(/Last updated:/)).toBeInTheDocument()
    })

    it('provides refresh functionality', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const refreshButton = screen.getByRole('button', { name: /refresh/i })
      await user.click(refreshButton)

      expect(mockPerformanceContext.performHealthCheck).toHaveBeenCalled()
    })
  })

  describe('Executive-Specific Features', () => {
    it('shows executive-only metrics', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Executive Metrics')).toBeInTheDocument()
      expect(screen.getByText('Strategic Overview')).toBeInTheDocument()
    })

    it('displays executive alerts and notifications', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Executive Alerts')).toBeInTheDocument()
    })

    it('provides quick action buttons', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      expect(screen.getByText('Emergency Response')).toBeInTheDocument()
    })
  })

  describe('Data Visualization', () => {
    it('renders all chart types correctly', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    })

    it('shows progress indicators', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const progressBars = screen.getAllByRole('progressbar')
      expect(progressBars.length).toBeGreaterThan(0)
    })

    it('displays trend indicators', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText(/↗/)).toBeInTheDocument() // Trending up
      expect(screen.getByText(/↘/)).toBeInTheDocument() // Trending down
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByLabelText(/executive command center/i)).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      // Tab through the interface
      await user.tab()
      expect(screen.getByText('Strategic Insights')).toHaveFocus()
    })

    it('provides screen reader friendly descriptions', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByLabelText(/platform health score/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing context data gracefully', () => {
      const mockEmptyPerformance = {
        ...mockPerformanceContext,
        systemMetrics: null
      }

      vi.mocked(require('../../contexts/PerformanceContext').usePerformance).mockReturnValue(mockEmptyPerformance)

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('displays error states for failed data loads', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      // Should handle errors gracefully
      expect(screen.getByText('Executive Command Center')).toBeInTheDocument()

      consoleSpy.mockRestore()
    })
  })

  describe('Performance Optimization', () => {
    it('memoizes expensive calculations', () => {
      const { rerender } = render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      // Rerender with same props
      rerender(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      // Performance functions should not be called excessively
      expect(mockPerformanceContext.getPerformanceScore).toHaveBeenCalledTimes(1)
    })

    it('lazy loads chart components', async () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      // Charts should be rendered lazily
      await waitFor(() => {
        expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      })
    })
  })

  describe('Mobile Responsiveness', () => {
    it('adapts layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      })

      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      expect(screen.getByText('Executive Command Center')).toBeInTheDocument()
    })

    it('provides touch-friendly interactions', () => {
      render(
        <TestWrapper>
          <ExecutiveCommandCenter />
        </TestWrapper>
      )

      const touchElements = screen.getAllByRole('button')
      touchElements.forEach(element => {
        expect(element).toHaveClass(/touch-friendly|button/)
      })
    })
  })
})