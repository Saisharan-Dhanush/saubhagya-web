import React, { createContext, useContext, useEffect, useState } from 'react'

export type UserRole = 'field_worker' | 'cluster_manager' | 'cbg_sales' | 'business_dev' | 'admin' | 'senior_leader' | 'purification_operator'

export interface Permission {
  module: string
  actions: string[]
}

export interface User {
  id: string
  phone: string
  email?: string
  name: string
  role: UserRole
  department?: string
  permissions: Permission[]
  lastAccess?: Date
  appType: 'gausakhi' | 'biogassangh' | 'urjavyapar' | 'urjasanyojak' | 'admin' | 'urjaneta' | 'shuddhidoot'
  executiveLevel?: 'ceo' | 'cfo' | 'coo' | 'vp' | 'director'
  // Backend response fields
  externalId?: string
  locale?: string
  kycStatus?: string
  isActive?: boolean
  roles?: string[]
  governmentAccess?: any[]
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  field_worker: [
    { module: 'rfid', actions: ['scan', 'sync'] },
    { module: 'collection', actions: ['log', 'voice'] },
    { module: 'iot', actions: ['sync', 'update'] },
    { module: 'gps', actions: ['track', 'update'] }
  ],
  cluster_manager: [
    { module: 'slurry', actions: ['monitor', 'alert'] },
    { module: 'digester', actions: ['monitor', 'alert'] },
    { module: 'pickup', actions: ['schedule', 'manage'] },
    { module: 'disputes', actions: ['resolve', 'track'] }
  ],
  cbg_sales: [
    { module: 'inventory', actions: ['manage', 'track'] },
    { module: 'invoicing', actions: ['create', 'send'] },
    { module: 'crm', actions: ['manage', 'update'] },
    { module: 'peso', actions: ['comply', 'report'] },
    { module: 'upi', actions: ['process', 'reconcile'] }
  ],
  business_dev: [
    { module: 'mapping', actions: ['create', 'update'] },
    { module: 'subsidy', actions: ['assist', 'track'] },
    { module: 'feasibility', actions: ['calculate', 'analyze'] },
    { module: 'pipeline', actions: ['track', 'update'] }
  ],
  admin: [
    { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'devices', actions: ['manage', 'configure'] },
    { module: 'permissions', actions: ['assign', 'revoke'] },
    { module: 'audit', actions: ['view', 'export'] },
    { module: 'alerts', actions: ['configure', 'manage'] }
  ],
  senior_leader: [
    { module: 'voice_kpis', actions: ['view', 'analyze'] },
    { module: 'revenue', actions: ['predict', 'analyze'] },
    { module: 'carbon', actions: ['trade', 'track'] },
    { module: 'strategic', actions: ['plan', 'approve'] }
  ],
  purification_operator: [
    { module: 'ch4_monitoring', actions: ['monitor', 'alert'] },
    { module: 'flow_rate', actions: ['monitor', 'adjust'] },
    { module: 'maintenance', actions: ['schedule', 'track'] },
    { module: 'voice_alerts', actions: ['receive', 'respond'] }
  ]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (module: string, action: string) => boolean
  isExecutive: () => boolean
  getAccessLevel: () => 'high' | 'medium' | 'low'
  accessToken?: string
  refreshToken?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Enhanced permission checking
  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false

    const userPermissions = user.permissions || ROLE_PERMISSIONS[user.role] || []
    const modulePermissions = userPermissions.find(p => p.module === module)
    return modulePermissions?.actions.includes(action) || false
  }

  // Check if user has executive-level access
  const isExecutive = (): boolean => {
    if (!user) return false
    return user.role === 'senior_leader' || user.role === 'admin' || !!user.executiveLevel
  }

  // Get user access level for security controls
  const getAccessLevel = (): 'high' | 'medium' | 'low' => {
    if (!user) return 'low'

    if (user.executiveLevel) {
      return user.executiveLevel === 'ceo' || user.executiveLevel === 'cfo' ? 'high' : 'medium'
    }

    switch (user.role) {
      case 'senior_leader':
      case 'admin':
        return 'high'
      case 'cbg_sales':
      case 'business_dev':
        return 'medium'
      default:
        return 'low'
    }
  }

  // Backend authentication with JWT microservices integration
  const login = async (phone: string, password: string) => {
    try {
      console.log('🔐 Attempting login with SAUBHAGYA microservices API...')

      // Import the API service dynamically to avoid circular dependencies
      const { apiService } = await import('../services/api')

      // Use email format for login (converting phone to email format for demo)
      const email = phone.includes('@') ? phone : `${phone.replace('+91', '')}@saubhagya.com`

      const loginResponse = await apiService.login(email, password)

      if (loginResponse.success && loginResponse.data) {
        const { user: apiUser, token } = loginResponse.data

        // Map API user to our User interface
        // Override with correct role mapping for demo credentials
        const correctRole = getCorrectRoleForPhone(phone) || mapApiRoleToUserRole(apiUser.role)
        const correctAppType = getCorrectAppTypeForPhone(phone) || getAppTypeFromRole(apiUser.role)

        const mappedUser: User = {
          id: apiUser.id,
          phone: phone,
          email: apiUser.email,
          name: getCorrectNameForPhone(phone) || apiUser.name,
          role: correctRole,
          department: getDepartmentFromRole(correctRole),
          permissions: mapApiPermissions(apiUser.permissions || []),
          lastAccess: new Date(),
          appType: correctAppType,
          executiveLevel: getExecutiveLevelFromRole(correctRole),
          // API fields
          isActive: true,
          roles: [correctRole]
        }

        setUser(mappedUser)

        // Store tokens and user data
        localStorage.setItem('user', JSON.stringify(mappedUser))
        localStorage.setItem('saubhagya_jwt_token', token)
        localStorage.setItem('sessionStart', new Date().toISOString())

        console.log('✅ User logged in successfully with JWT:', mappedUser)
        return

      } else {
        console.warn('🚫 Backend authentication failed, falling back to demo credentials')
        throw new Error(loginResponse.error || 'Authentication failed')
      }

    } catch (error) {
      console.error('💥 Backend authentication failed, trying fallback:', error)
      // Fallback to demo credentials
      return loginWithFallback(phone, password)
    }
  }

  // Fallback authentication for demo purposes
  const loginWithFallback = async (phone: string, password: string) => {
    // Demo phone-based users for 7 different SAUBHAGYA apps
    const mockUsers: Record<string, User> = {
      '+919876543210': {
        id: 'fw-001',
        phone: '+919876543210',
        email: 'fieldworker@saubhagya.com',
        name: 'Ramesh Kumar (Field Worker)',
        role: 'field_worker',
        department: 'Field Operations',
        appType: 'gausakhi',
        permissions: ROLE_PERMISSIONS.field_worker,
        lastAccess: new Date()
      },
      '+918765432109': {
        id: 'cm-001',
        phone: '+918765432109',
        email: 'clustermanager@saubhagya.com',
        name: 'Suresh Patel (Cluster Manager)',
        role: 'cluster_manager',
        department: 'Cluster Operations',
        appType: 'biogassangh',
        permissions: ROLE_PERMISSIONS.cluster_manager,
        lastAccess: new Date()
      },
      '+917654321098': {
        id: 'cs-001',
        phone: '+917654321098',
        email: 'cbgsales@saubhagya.com',
        name: 'Priya Sharma (CBG Sales Executive)',
        role: 'cbg_sales',
        department: 'Sales & Marketing',
        appType: 'urjavyapar',
        permissions: ROLE_PERMISSIONS.cbg_sales,
        lastAccess: new Date()
      },
      '+916543210987': {
        id: 'bd-001',
        phone: '+916543210987',
        email: 'businessdev@saubhagya.com',
        name: 'Amit Singh (Business Development)',
        role: 'business_dev',
        department: 'Business Development',
        appType: 'urjasanyojak',
        permissions: ROLE_PERMISSIONS.business_dev,
        lastAccess: new Date()
      },
      '+915432109876': {
        id: 'admin-001',
        phone: '+915432109876',
        email: 'admin@saubhagya.com',
        name: 'System Administrator',
        role: 'admin',
        department: 'IT Administration',
        appType: 'admin',
        permissions: ROLE_PERMISSIONS.admin,
        lastAccess: new Date()
      },
      '+914321098765': {
        id: 'sl-001',
        phone: '+914321098765',
        email: 'seniorleader@saubhagya.com',
        name: 'Dr. Rajesh Kumar (CEO)',
        role: 'senior_leader',
        department: 'Executive Leadership',
        appType: 'urjaneta',
        executiveLevel: 'ceo',
        permissions: ROLE_PERMISSIONS.senior_leader,
        lastAccess: new Date()
      },
      '+913210987654': {
        id: 'po-001',
        phone: '+913210987654',
        email: 'purificationop@saubhagya.com',
        name: 'Vinod Yadav (Purification Operator)',
        role: 'purification_operator',
        department: 'Purification Operations',
        appType: 'shuddhidoot',
        permissions: ROLE_PERMISSIONS.purification_operator,
        lastAccess: new Date()
      }
    }

    const mockUser = mockUsers[phone]
    if (!mockUser) {
      throw new Error('Invalid phone number or password')
    }

    // Simple password validation for demo (in real app, this would be properly hashed)
    // Accept multiple valid passwords for different user types
    const validPasswords = ['password123', 'fieldworker123', 'admin123'];
    if (!validPasswords.includes(password)) {
      throw new Error('Invalid phone number or password')
    }

    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('sessionStart', new Date().toISOString())

    console.log('Fallback login successful:', mockUser)
  }

  const logout = async () => {
    try {
      // Import the API service dynamically to avoid circular dependencies
      const { apiService } = await import('../services/api')
      await apiService.logout()
    } catch (error) {
      console.error('Backend logout error:', error)
    }

    console.log('🔓 Logging out user, clearing session data')
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('saubhagya_jwt_token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('sessionStart')
    localStorage.removeItem('voiceSessionData')
  }

  useEffect(() => {
    // Check for existing user session with security validation
    const savedUser = localStorage.getItem('user')
    const sessionStart = localStorage.getItem('sessionStart')

    if (savedUser && sessionStart) {
      const parsedUser = JSON.parse(savedUser)
      const sessionAge = Date.now() - new Date(sessionStart).getTime()
      const maxSessionAge = parsedUser.role === 'executive' ? 4 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000 // 4h for exec, 8h for others

      if (sessionAge > maxSessionAge) {
        console.log('Session expired, logging out')
        logout()
      } else {
        // Update permissions to latest role definition
        parsedUser.permissions = ROLE_PERMISSIONS[parsedUser.role] || []
        setUser(parsedUser)
      }
    }
    setLoading(false)
  }, [])

  // Monitor executive sessions
  useEffect(() => {
    if (user && isExecutive()) {
      const interval = setInterval(() => {
        const sessionStart = localStorage.getItem('sessionStart')
        if (sessionStart) {
          const sessionAge = Date.now() - new Date(sessionStart).getTime()
          const warningTime = 3.5 * 60 * 60 * 1000 // Warn at 3.5 hours for executives

          if (sessionAge > warningTime && sessionAge < warningTime + 60000) {
            console.warn('Executive session will expire in 30 minutes')
          }
        }
      }, 60000) // Check every minute

      return () => clearInterval(interval)
    }
  }, [user])

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isExecutive,
    getAccessLevel,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper functions to map API data to frontend types
function mapApiRoleToUserRole(apiRole: string): UserRole {
  switch (apiRole.toLowerCase()) {
    case 'admin':
    case 'administrator':
      return 'admin'
    case 'field_worker':
    case 'farmer':
      return 'field_worker'
    case 'cluster_manager':
      return 'cluster_manager'
    case 'cbg_sales':
    case 'sales_executive':
      return 'cbg_sales'
    case 'business_dev':
    case 'business_developer':
      return 'business_dev'
    case 'senior_leader':
    case 'executive':
    case 'ceo':
    case 'cfo':
      return 'senior_leader'
    case 'purification_operator':
    case 'operator':
      return 'purification_operator'
    default:
      return 'admin'
  }
}

function mapApiPermissions(apiPermissions: string[]): Permission[] {
  // Map API permissions to our Permission interface
  const permissionMap: Record<string, Permission> = {
    'cattle:read': { module: 'rfid', actions: ['scan', 'sync'] },
    'cattle:write': { module: 'collection', actions: ['log', 'voice'] },
    'transactions:read': { module: 'disputes', actions: ['resolve', 'track'] },
    'dashboard:read': { module: 'voice_kpis', actions: ['view', 'analyze'] },
    'users:manage': { module: 'users', actions: ['create', 'read', 'update', 'delete'] }
  }

  const mappedPermissions: Permission[] = []
  apiPermissions.forEach(perm => {
    if (permissionMap[perm]) {
      mappedPermissions.push(permissionMap[perm])
    }
  })

  // If no permissions mapped, use role-based defaults
  if (mappedPermissions.length === 0) {
    return ROLE_PERMISSIONS.admin
  }

  return mappedPermissions
}

// Helper functions to map backend data to frontend types (legacy support)
function mapBackendRoleToUserRole(backendRole: string): UserRole {
  switch (backendRole) {
    case 'FARMER':
    case 'FIELD_WORKER':
      return 'field_worker'
    case 'CLUSTER_MANAGER':
      return 'cluster_manager'
    case 'CBG_SALES':
    case 'SALES_EXECUTIVE':
      return 'cbg_sales'
    case 'BUSINESS_DEV':
    case 'BUSINESS_DEVELOPER':
      return 'business_dev'
    case 'ADMIN':
    case 'ADMINISTRATOR':
      return 'admin'
    case 'SENIOR_LEADER':
    case 'EXECUTIVE':
    case 'CEO':
    case 'CFO':
      return 'senior_leader'
    case 'PURIFICATION_OPERATOR':
    case 'OPERATOR':
      return 'purification_operator'
    default:
      return 'field_worker'
  }
}

function getDepartmentFromRole(backendRole: string): string {
  switch (backendRole) {
    case 'FARMER':
    case 'FIELD_WORKER':
      return 'Field Operations'
    case 'CLUSTER_MANAGER':
      return 'Cluster Operations'
    case 'CBG_SALES':
    case 'SALES_EXECUTIVE':
      return 'Sales & Marketing'
    case 'BUSINESS_DEV':
    case 'BUSINESS_DEVELOPER':
      return 'Business Development'
    case 'ADMIN':
    case 'ADMINISTRATOR':
      return 'IT Administration'
    case 'SENIOR_LEADER':
    case 'EXECUTIVE':
    case 'CEO':
    case 'CFO':
      return 'Executive Leadership'
    case 'PURIFICATION_OPERATOR':
    case 'OPERATOR':
      return 'Purification Operations'
    default:
      return 'Field Operations'
  }
}

function getAppTypeFromRole(backendRole: string): User['appType'] {
  switch (backendRole) {
    case 'FARMER':
    case 'FIELD_WORKER':
      return 'gausakhi'
    case 'CLUSTER_MANAGER':
      return 'biogassangh'
    case 'CBG_SALES':
    case 'SALES_EXECUTIVE':
      return 'urjavyapar'
    case 'BUSINESS_DEV':
    case 'BUSINESS_DEVELOPER':
      return 'urjasanyojak'
    case 'ADMIN':
    case 'ADMINISTRATOR':
      return 'admin'
    case 'SENIOR_LEADER':
    case 'EXECUTIVE':
    case 'CEO':
    case 'CFO':
      return 'urjaneta'
    case 'PURIFICATION_OPERATOR':
    case 'OPERATOR':
      return 'shuddhidoot'
    default:
      return 'gausakhi'
  }
}

function getExecutiveLevelFromRole(backendRole: string): User['executiveLevel'] {
  switch (backendRole) {
    case 'CEO':
      return 'ceo'
    case 'CFO':
      return 'cfo'
    case 'COO':
      return 'coo'
    case 'VP':
      return 'vp'
    case 'DIRECTOR':
      return 'director'
    default:
      return undefined
  }
}

function mapBackendPermissions(backendPermissions: string[]): Permission[] {
  // Map backend permissions to our Permission interface
  const permissionMap: Record<string, Permission> = {
    'CONTRIBUTE_BIOGAS': { module: 'rfid', actions: ['scan', 'sync'] },
    'VIEW_HISTORY': { module: 'collection', actions: ['log', 'voice'] },
    'RAISE_DISPUTE': { module: 'disputes', actions: ['resolve', 'track'] },
    'MANAGE_INVENTORY': { module: 'inventory', actions: ['manage', 'track'] },
    'CREATE_INVOICE': { module: 'invoicing', actions: ['create', 'send'] },
    'MANAGE_CRM': { module: 'crm', actions: ['manage', 'update'] },
    'ADMIN_ACCESS': { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
    'VIEW_ANALYTICS': { module: 'voice_kpis', actions: ['view', 'analyze'] },
    'MONITOR_CH4': { module: 'ch4_monitoring', actions: ['monitor', 'alert'] }
  }

  const mappedPermissions: Permission[] = []
  backendPermissions.forEach(perm => {
    if (permissionMap[perm]) {
      mappedPermissions.push(permissionMap[perm])
    }
  })

  // If no permissions mapped, use role-based defaults
  if (mappedPermissions.length === 0) {
    return ROLE_PERMISSIONS.field_worker
  }

  return mappedPermissions
}

// Helper functions to map phone numbers to correct demo credentials
function getCorrectRoleForPhone(phone: string): UserRole | null {
  const phoneRoleMap: Record<string, UserRole> = {
    '+919876543210': 'field_worker',
    '+918765432109': 'cluster_manager',
    '+917654321098': 'cbg_sales',
    '+916543210987': 'business_dev',
    '+915432109876': 'admin',
    '+914321098765': 'senior_leader',
    '+913210987654': 'purification_operator'
  }
  return phoneRoleMap[phone] || null
}

function getCorrectAppTypeForPhone(phone: string): User['appType'] | null {
  const phoneAppTypeMap: Record<string, User['appType']> = {
    '+919876543210': 'gausakhi',
    '+918765432109': 'biogassangh',
    '+917654321098': 'urjavyapar',
    '+916543210987': 'urjasanyojak',
    '+915432109876': 'admin',
    '+914321098765': 'urjaneta',
    '+913210987654': 'shuddhidoot'
  }
  return phoneAppTypeMap[phone] || null
}

function getCorrectNameForPhone(phone: string): string | null {
  const phoneNameMap: Record<string, string> = {
    '+919876543210': 'Ramesh Kumar (Field Worker)',
    '+918765432109': 'Suresh Patel (Cluster Manager)',
    '+917654321098': 'Priya Sharma (CBG Sales Executive)',
    '+916543210987': 'Amit Singh (Business Development)',
    '+915432109876': 'System Administrator',
    '+914321098765': 'Dr. Rajesh Kumar (CEO)',
    '+913210987654': 'Vinod Yadav (Purification Operator)'
  }
  return phoneNameMap[phone] || null
}
