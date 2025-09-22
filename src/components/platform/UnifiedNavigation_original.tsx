import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Factory,
  Filter,
  TrendingUp,
  Brain,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Home,
  Bell,
  Search,
  Menu,
  Globe,
  Clock,
  Shield,
  Zap,
  Crown,
  Users,
  Receipt,
  Beef
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { usePlatform } from '../../contexts/PlatformContext'
import { useLocation, useNavigate } from 'react-router-dom'

const moduleIcons = {
  'urjasanyojak': Factory,
  'shuddhi-doot': Filter,
  'urja-vyapar': TrendingUp,
  'urja-neta': Brain,
  'admin-console': Settings,
  'executive-command': Crown
}

interface UnifiedNavigationProps {
  className?: string
  showBreadcrumbs?: boolean
  compact?: boolean
}

export const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({
  className = '',
  showBreadcrumbs = true,
  compact = false
}) => {
  const { user, logout, isExecutive } = useAuth()
  const {
    navigationState,
    platformSettings,
    sessionMetrics,
    navigateToModule,
    getAccessibleModules,
    updatePlatformSettings
  } = usePlatform()

  const [showSearch, setShowSearch] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'notifications' | 'user' | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Welcome to Unified Platform',
      message: 'All dashboards now integrated with SSO',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Session Timeout',
      message: `Session expires in ${Math.floor(platformSettings.sessionTimeout / 60)} minutes`,
      timestamp: new Date(),
      read: false
    }
  ])

  const accessibleModules = getAccessibleModules()
  const unreadNotifications = notifications.filter(n => !n.read).length

  const handleModuleNavigation = (moduleId: string) => {
    navigateToModule(moduleId)
  }

  const handleLogout = async () => {
    console.log('Unified SSO logout initiated')
    await logout()
  }

  const toggleLanguage = () => {
    const newLang = platformSettings.language === 'en' ? 'hi' : 'en'
    updatePlatformSettings({ language: newLang })
    setOpenDropdown(null) // Close any open dropdowns
  }

  const formatSessionDuration = (duration: number): string => {
    const minutes = Math.floor(duration / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`
  }

  // GauShala navigation logic
  const isInGauShala = location.pathname.startsWith('/gaushala')
  const getCurrentGauShalaTab = () => {
    const path = location.pathname
    if (path.includes('/cattle')) return 'cattle'
    if (path.includes('/transactions')) return 'transactions'
    return 'dashboard'
  }

  const gauShalaNavigate = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        navigate('/gaushala')
        break
      case 'cattle':
        navigate('/gaushala/cattle')
        break
      case 'transactions':
        navigate('/gaushala/transactions')
        break
    }
  }

  const gauShalaTabs = [
    { id: 'dashboard', label: platformSettings.language === 'hi' ? 'डैशबोर्ड' : 'Dashboard', icon: Home },
    { id: 'cattle', label: platformSettings.language === 'hi' ? 'पशु प्रबंधन' : 'Cattle Management', icon: Beef },
    { id: 'transactions', label: platformSettings.language === 'hi' ? 'लेन-देन का इतिहास' : 'Transaction History', icon: Receipt }
  ]

  if (compact) {
    return (
      <div className={`flex items-center justify-between p-4 bg-white border-b ${className}`}>
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-blue-600">SAUBHAGYA</h1>
          <Badge variant="outline" className="text-xs">
            {accessibleModules.find(m => m.id === navigationState.currentModule)?.displayName}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            <Globe className="h-4 w-4 mr-1" />
            {platformSettings.language === 'en' ? 'हिं' : 'EN'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div ref={navRef} className={`bg-white border-b shadow-sm ${className}`}>
      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Logo and Module Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SAUBHAGYA</h1>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              Unified Platform
            </Badge>
          </div>

          {/* Module Navigation */}
          <nav className="flex items-center space-x-1">
            {accessibleModules.map((module) => {
              const IconComponent = moduleIcons[module.id] || Home
              const isActive = module.id === navigationState.currentModule

              return (
                <Button
                  key={module.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleModuleNavigation(module.id)}
                  className={`flex items-center space-x-2 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden md:inline">{module.displayName}</span>
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center space-x-2">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowSearch(!showSearch)
              setOpenDropdown(null) // Close any open dropdowns
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center space-x-1"
          >
            <Globe className="h-4 w-4" />
            <span>{platformSettings.language === 'en' ? 'हिंदी' : 'English'}</span>
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-600 hover:text-gray-900"
              onClick={() => setOpenDropdown(openDropdown === 'notifications' ? null : 'notifications')}
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            {openDropdown === 'notifications' && (
              <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-b">Notifications</div>
                  {notifications.map((notification) => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-medium text-sm text-gray-900">{notification.title}</span>
                        <Badge variant={notification.type === 'warning' ? 'destructive' : 'secondary'} className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600 block">{notification.message}</span>
                      <span className="text-xs text-gray-400 block mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
            {openDropdown === 'user' && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium text-gray-900">{user?.name}</span>
                      <span className="text-sm text-gray-500">{user?.email}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {user?.role?.toUpperCase()}
                        </Badge>
                        {isExecutive() && (
                          <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                            EXECUTIVE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </div>

                  <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Security & Privacy
                  </div>

                  <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <div className="flex flex-col">
                        <span className="text-sm">Session Activity</span>
                        <span className="text-xs text-gray-500">
                          Active: {formatSessionDuration(Date.now() - sessionMetrics.lastActivity.getTime())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100"></div>

                  <div
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout (SSO)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {showBreadcrumbs && navigationState.breadcrumbs.length > 0 && (
        <div className="px-6 py-2 bg-gray-50 border-t">
          <div className="flex items-center space-x-2 text-sm">
            <Home className="h-4 w-4 text-gray-400" />
            {navigationState.breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.url}>
                {index > 0 && <span className="text-gray-400">/</span>}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToModule(breadcrumb.module)}
                  className="p-1 h-auto text-gray-600 hover:text-blue-600"
                >
                  {breadcrumb.label}
                </Button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}


      {/* Search Bar (Expandable) */}
      {showSearch && (
        <div className="px-6 py-3 bg-blue-50 border-t">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search across all dashboards..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default UnifiedNavigation