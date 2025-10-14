/**
 * Platform modules configuration for SAUBHAGYA
 * Separated from PlatformContext to enable Fast Refresh (HMR) compatibility
 */

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
