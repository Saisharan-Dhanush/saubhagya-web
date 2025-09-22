import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export interface PlatformModule {
  id: string
  name: string
  displayName: string
  description: string
  url: string
  icon: string
  category: 'operational' | 'analytics' | 'executive'
  requiredRoles: string[]
  status: 'active' | 'maintenance' | 'disabled'
  lastUpdated: Date
}

export interface NavigationState {
  currentModule: string
  previousModule?: string
  navigationHistory: string[]
  breadcrumbs: BreadcrumbItem[]
}

export interface BreadcrumbItem {
  label: string
  url: string
  module: string
}

export interface PlatformSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'en' | 'hi'
  timezone: string
  autoSave: boolean
  sessionTimeout: number
  notifications: {
    enabled: boolean
    desktop: boolean
    email: boolean
    categories: string[]
  }
}

export interface SessionMetrics {
  totalSessions: number
  activeModules: string[]
  averageSessionDuration: number
  lastActivity: Date
  moduleUsageStats: Record<string, number>
}

interface PlatformContextType {
  modules: PlatformModule[]
  navigationState: NavigationState
  platformSettings: PlatformSettings
  sessionMetrics: SessionMetrics

  // Navigation functions
  navigateToModule: (moduleId: string, preserveState?: boolean) => void
  updateBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  goBack: () => void

  // Settings management
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void

  // Module management
  getAccessibleModules: () => PlatformModule[]
  isModuleAccessible: (moduleId: string) => boolean

  // Session management
  trackModuleUsage: (moduleId: string) => void
  getSessionSummary: () => SessionMetrics
}

// Platform modules configuration
export const PLATFORM_MODULES: PlatformModule[] = [
  {
    id: 'urjasanyojak',
    name: 'UrjaSanyojak',
    displayName: 'Biogas Cluster Management',
    description: 'Comprehensive biogas production cluster oversight and management',
    url: '/',
    icon: 'factory',
    category: 'operational',
    requiredRoles: ['executive', 'manager', 'operator', 'admin'],
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'shuddhi-doot',
    name: 'ShuddhiDoot',
    displayName: 'Purification & Quality Control',
    description: 'Advanced biogas purification monitoring and quality assurance',
    url: '/purification',
    icon: 'filter',
    category: 'operational',
    requiredRoles: ['executive', 'manager', 'operator', 'analyst', 'admin'],
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'urja-vyapar',
    name: 'UrjaVyapar',
    displayName: 'Sales & Distribution Management',
    description: 'Comprehensive biogas sales, distribution, and customer management',
    url: '/sales',
    icon: 'trending-up',
    category: 'operational',
    requiredRoles: ['executive', 'manager', 'admin'],
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'urja-neta',
    name: 'UrjaNeta',
    displayName: 'Executive Analytics Dashboard',
    description: 'Advanced voice-enabled business intelligence for senior leadership',
    url: '/urjaneta',
    icon: 'brain',
    category: 'executive',
    requiredRoles: ['executive', 'admin'],
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'admin-console',
    name: 'AdminConsole',
    displayName: 'System Administration',
    description: 'Platform administration and system management',
    url: '/admin',
    icon: 'settings',
    category: 'analytics',
    requiredRoles: ['admin'],
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'gaushala',
    name: 'GauShala',
    displayName: 'GauShala Management',
    description: 'Comprehensive cattle and dung collection management',
    url: '/gaushala',
    icon: 'home',
    category: 'operational',
    requiredRoles: ['admin', 'field_worker', 'supervisor', 'manager'],
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'executive-command',
    name: 'ExecutiveCommand',
    displayName: 'Executive Command Center',
    description: 'Unified cross-module analytics and strategic insights',
    url: '/executive',
    icon: 'crown',
    category: 'executive',
    requiredRoles: ['executive', 'admin'],
    status: 'active',
    lastUpdated: new Date()
  }
]

const PlatformContext = createContext<PlatformContextType | undefined>(undefined)

export function usePlatform() {
  const context = useContext(PlatformContext)
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider')
  }
  return context
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const { user, hasPermission, isExecutive } = useAuth()

  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentModule: 'urjasanyojak',
    navigationHistory: ['urjasanyojak'],
    breadcrumbs: [
      { label: 'Dashboard', url: '/', module: 'urjasanyojak' }
    ]
  })

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Kolkata',
    autoSave: true,
    sessionTimeout: isExecutive() ? 240 : 480, // 4h for exec, 8h for others
    notifications: {
      enabled: true,
      desktop: true,
      email: isExecutive(),
      categories: ['alerts', 'reports', 'updates']
    }
  })

  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    totalSessions: 1,
    activeModules: ['urjasanyojak'],
    averageSessionDuration: 0,
    lastActivity: new Date(),
    moduleUsageStats: {
      'urjasanyojak': 1,
      'shuddhi-doot': 0,
      'urja-vyapar': 0,
      'urja-neta': 0
    }
  })

  const [modules] = useState<PlatformModule[]>(PLATFORM_MODULES)

  // Navigation functions
  const navigateToModule = (moduleId: string, preserveState = true) => {
    const module = modules.find(m => m.id === moduleId)
    if (!module || !isModuleAccessible(moduleId)) {
      console.warn(`Module ${moduleId} not accessible`)
      return
    }

    setNavigationState(prev => ({
      currentModule: moduleId,
      previousModule: preserveState ? prev.currentModule : undefined,
      navigationHistory: [...prev.navigationHistory.slice(-10), moduleId],
      breadcrumbs: [
        { label: module.displayName, url: module.url, module: moduleId }
      ]
    }))

    trackModuleUsage(moduleId)

    // Navigate using window.history if needed
    if (window.location.pathname !== module.url) {
      window.history.pushState(null, '', module.url)
    }

    console.log(`Navigated to ${module.displayName} (${moduleId})`)
  }

  const updateBreadcrumbs = (breadcrumbs: BreadcrumbItem[]) => {
    setNavigationState(prev => ({
      ...prev,
      breadcrumbs
    }))
  }

  const goBack = () => {
    if (navigationState.previousModule) {
      navigateToModule(navigationState.previousModule, false)
    }
  }

  // Settings management
  const updatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => {
      const updated = { ...prev, ...newSettings }

      // Persist to localStorage
      localStorage.setItem('platformSettings', JSON.stringify(updated))

      console.log('Platform settings updated:', newSettings)
      return updated
    })
  }

  // Module management
  const getAccessibleModules = (): PlatformModule[] => {
    if (!user) return []

    return modules.filter(module =>
      module.status === 'active' &&
      module.requiredRoles.includes(user.role) &&
      hasPermission(module.id, 'view')
    )
  }

  const isModuleAccessible = (moduleId: string): boolean => {
    if (!user) return false

    const module = modules.find(m => m.id === moduleId)
    if (!module || module.status !== 'active') return false

    return module.requiredRoles.includes(user.role) &&
           hasPermission(module.id, 'view')
  }

  // Session management
  const trackModuleUsage = (moduleId: string) => {
    setSessionMetrics(prev => ({
      ...prev,
      lastActivity: new Date(),
      activeModules: Array.from(new Set([...prev.activeModules, moduleId])),
      moduleUsageStats: {
        ...prev.moduleUsageStats,
        [moduleId]: (prev.moduleUsageStats[moduleId] || 0) + 1
      }
    }))
  }

  const getSessionSummary = (): SessionMetrics => {
    return {
      ...sessionMetrics,
      averageSessionDuration: Date.now() - sessionMetrics.lastActivity.getTime()
    }
  }

  // Load persisted settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('platformSettings')
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved)
        setPlatformSettings(prev => ({ ...prev, ...parsedSettings }))
      } catch (error) {
        console.error('Error loading platform settings:', error)
      }
    }
  }, [])

  // Update current module based on URL
  useEffect(() => {
    const currentPath = window.location.pathname
    const currentModule = modules.find(m => m.url === currentPath)

    if (currentModule && isModuleAccessible(currentModule.id)) {
      setNavigationState(prev => ({
        ...prev,
        currentModule: currentModule.id
      }))
    }
  }, [modules, user])

  // Executive-specific settings
  useEffect(() => {
    if (user && isExecutive()) {
      updatePlatformSettings({
        sessionTimeout: 240, // 4 hours for executives
        notifications: {
          ...platformSettings.notifications,
          email: true,
          categories: ['alerts', 'reports', 'updates', 'urgent']
        }
      })
    }
  }, [user, isExecutive])

  const value = {
    modules,
    navigationState,
    platformSettings,
    sessionMetrics,
    navigateToModule,
    updateBreadcrumbs,
    goBack,
    updatePlatformSettings,
    getAccessibleModules,
    isModuleAccessible,
    trackModuleUsage,
    getSessionSummary
  }

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  )
}