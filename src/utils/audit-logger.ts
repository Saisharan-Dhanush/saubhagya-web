import React from 'react'

// Enterprise-grade audit logging system

export interface AuditEvent {
  id: string
  timestamp: Date
  userId: string
  userEmail?: string
  userRole?: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  organizationId?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'user_action'
  outcome: 'success' | 'failure' | 'partial'
  location?: {
    country?: string
    region?: string
    city?: string
  }
  metadata?: Record<string, any>
}

export interface AuditLogFilter {
  userId?: string
  userRole?: string
  action?: string
  resource?: string
  category?: AuditEvent['category']
  severity?: AuditEvent['severity']
  outcome?: AuditEvent['outcome']
  dateFrom?: Date
  dateTo?: Date
  searchQuery?: string
}

class AuditLogger {
  private static instance: AuditLogger
  private events: AuditEvent[] = []
  private maxEvents = 10000 // Keep last 10k events in memory
  private isEnabled = true

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  private constructor() {
    // Load existing events from localStorage
    this.loadFromStorage()
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getCurrentUser(): { id: string; email?: string; role?: string } {
    // Get current user from your auth context/localStorage
    const userId = localStorage.getItem('userId') || 'anonymous'
    const userEmail = localStorage.getItem('userEmail') || undefined
    const userRole = localStorage.getItem('userRole') || undefined

    return { id: userId, email: userEmail, role: userRole }
  }

  private getSessionInfo(): { ipAddress?: string; userAgent: string; sessionId?: string } {
    return {
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('sessionId') || undefined
    }
  }

  private async getLocationInfo(): Promise<AuditEvent['location']> {
    try {
      // In production, you would use a proper geolocation service
      // For now, return undefined to avoid external API calls
      return undefined
    } catch (error) {
      return undefined
    }
  }

  private saveToStorage(): void {
    try {
      // Save only recent events to localStorage (last 1000)
      const recentEvents = this.events.slice(-1000)
      localStorage.setItem('auditLogs', JSON.stringify(recentEvents))
    } catch (error) {
      console.warn('Failed to save audit logs to localStorage:', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('auditLogs')
      if (stored) {
        const events = JSON.parse(stored)
        this.events = events.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }))
      }
    } catch (error) {
      console.warn('Failed to load audit logs from localStorage:', error)
    }
  }

  private async sendToServer(event: AuditEvent): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch('/api/audit-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(event)
        })
      } catch (error) {
        console.error('Failed to send audit log to server:', error)
      }
    }
  }

  async log(
    action: string,
    resource: string,
    details: Record<string, any> = {},
    options: {
      resourceId?: string
      severity?: AuditEvent['severity']
      category?: AuditEvent['category']
      outcome?: AuditEvent['outcome']
      metadata?: Record<string, any>
    } = {}
  ): Promise<string> {
    if (!this.isEnabled) return ''

    const user = this.getCurrentUser()
    const sessionInfo = this.getSessionInfo()
    const location = await this.getLocationInfo()

    const event: AuditEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action,
      resource,
      resourceId: options.resourceId,
      details,
      ...sessionInfo,
      organizationId: localStorage.getItem('organizationId') || undefined,
      severity: options.severity || 'low',
      category: options.category || 'user_action',
      outcome: options.outcome || 'success',
      location,
      metadata: options.metadata
    }

    // Add to memory
    this.events.push(event)

    // Trim if too many events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Save to localStorage
    this.saveToStorage()

    // Send to server
    await this.sendToServer(event)

    // Log critical events to console
    if (event.severity === 'critical') {
      console.warn('CRITICAL AUDIT EVENT:', event)
    }

    return event.id
  }

  // Predefined audit actions
  async logAuthentication(action: 'login' | 'logout' | 'login_failed' | 'password_reset', details: Record<string, any> = {}): Promise<string> {
    return this.log(action, 'authentication', details, {
      category: 'authentication',
      severity: action === 'login_failed' ? 'high' : 'medium',
      outcome: action === 'login_failed' ? 'failure' : 'success'
    })
  }

  async logDataAccess(resource: string, resourceId?: string, details: Record<string, any> = {}): Promise<string> {
    return this.log('data_access', resource, details, {
      resourceId,
      category: 'data_access',
      severity: 'low'
    })
  }

  async logDataModification(action: 'create' | 'update' | 'delete', resource: string, resourceId?: string, details: Record<string, any> = {}): Promise<string> {
    return this.log(action, resource, details, {
      resourceId,
      category: 'data_modification',
      severity: action === 'delete' ? 'high' : 'medium'
    })
  }

  async logSystemEvent(event: string, details: Record<string, any> = {}): Promise<string> {
    return this.log(event, 'system', details, {
      category: 'system',
      severity: 'medium'
    })
  }

  async logSecurityEvent(event: string, details: Record<string, any> = {}): Promise<string> {
    return this.log(event, 'security', details, {
      category: 'authorization',
      severity: 'high'
    })
  }

  // Query methods
  getEvents(filter?: AuditLogFilter): AuditEvent[] {
    let filteredEvents = [...this.events]

    if (filter) {
      if (filter.userId) {
        filteredEvents = filteredEvents.filter(e => e.userId === filter.userId)
      }
      if (filter.userRole) {
        filteredEvents = filteredEvents.filter(e => e.userRole === filter.userRole)
      }
      if (filter.action) {
        filteredEvents = filteredEvents.filter(e => e.action.includes(filter.action!))
      }
      if (filter.resource) {
        filteredEvents = filteredEvents.filter(e => e.resource.includes(filter.resource!))
      }
      if (filter.category) {
        filteredEvents = filteredEvents.filter(e => e.category === filter.category)
      }
      if (filter.severity) {
        filteredEvents = filteredEvents.filter(e => e.severity === filter.severity)
      }
      if (filter.outcome) {
        filteredEvents = filteredEvents.filter(e => e.outcome === filter.outcome)
      }
      if (filter.dateFrom) {
        filteredEvents = filteredEvents.filter(e => e.timestamp >= filter.dateFrom!)
      }
      if (filter.dateTo) {
        filteredEvents = filteredEvents.filter(e => e.timestamp <= filter.dateTo!)
      }
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase()
        filteredEvents = filteredEvents.filter(e =>
          e.action.toLowerCase().includes(query) ||
          e.resource.toLowerCase().includes(query) ||
          JSON.stringify(e.details).toLowerCase().includes(query)
        )
      }
    }

    return filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  getEventById(id: string): AuditEvent | undefined {
    return this.events.find(e => e.id === id)
  }

  getEventsByUser(userId: string): AuditEvent[] {
    return this.getEvents({ userId })
  }

  getEventsByResource(resource: string, resourceId?: string): AuditEvent[] {
    return this.getEvents({ resource }).filter(e =>
      !resourceId || e.resourceId === resourceId
    )
  }

  getSecurityEvents(): AuditEvent[] {
    return this.getEvents({
      category: 'authorization'
    }).concat(this.getEvents({
      severity: 'high'
    })).concat(this.getEvents({
      severity: 'critical'
    }))
  }

  // Analytics
  getEventSummary(filter?: AuditLogFilter): {
    total: number
    byCategory: Record<string, number>
    bySeverity: Record<string, number>
    byOutcome: Record<string, number>
    topUsers: Array<{ userId: string; count: number }>
    topActions: Array<{ action: string; count: number }>
  } {
    const events = this.getEvents(filter)

    const byCategory: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}
    const byOutcome: Record<string, number> = {}
    const userCounts: Record<string, number> = {}
    const actionCounts: Record<string, number> = {}

    events.forEach(event => {
      byCategory[event.category] = (byCategory[event.category] || 0) + 1
      bySeverity[event.severity] = (bySeverity[event.severity] || 0) + 1
      byOutcome[event.outcome] = (byOutcome[event.outcome] || 0) + 1
      userCounts[event.userId] = (userCounts[event.userId] || 0) + 1
      actionCounts[event.action] = (actionCounts[event.action] || 0) + 1
    })

    const topUsers = Object.entries(userCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      total: events.length,
      byCategory,
      bySeverity,
      byOutcome,
      topUsers,
      topActions
    }
  }

  // Export methods
  async exportEvents(filter?: AuditLogFilter, format: 'json' | 'csv' = 'json'): Promise<string> {
    const events = this.getEvents(filter)

    if (format === 'json') {
      return JSON.stringify(events, null, 2)
    } else {
      // CSV export
      const headers = [
        'ID', 'Timestamp', 'User ID', 'User Email', 'User Role',
        'Action', 'Resource', 'Resource ID', 'Category', 'Severity',
        'Outcome', 'Details', 'IP Address', 'User Agent'
      ]

      const rows = events.map(event => [
        event.id,
        event.timestamp.toISOString(),
        event.userId,
        event.userEmail || '',
        event.userRole || '',
        event.action,
        event.resource,
        event.resourceId || '',
        event.category,
        event.severity,
        event.outcome,
        JSON.stringify(event.details),
        event.ipAddress || '',
        event.userAgent || ''
      ])

      return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    }
  }

  // Configuration
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  isLoggingEnabled(): boolean {
    return this.isEnabled
  }

  clearEvents(): void {
    this.events = []
    localStorage.removeItem('auditLogs')
  }
}

// React hooks for audit logging
export const useAuditLogger = () => {
  const logger = React.useMemo(() => AuditLogger.getInstance(), [])

  const logAction = React.useCallback(async (
    action: string,
    resource: string,
    details?: Record<string, any>,
    options?: Parameters<typeof logger.log>[3]
  ) => {
    return logger.log(action, resource, details, options)
  }, [logger])

  const logAuthentication = React.useCallback(async (
    action: Parameters<typeof logger.logAuthentication>[0],
    details?: Record<string, any>
  ) => {
    return logger.logAuthentication(action, details)
  }, [logger])

  const logDataAccess = React.useCallback(async (
    resource: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
    return logger.logDataAccess(resource, resourceId, details)
  }, [logger])

  const logDataModification = React.useCallback(async (
    action: Parameters<typeof logger.logDataModification>[0],
    resource: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
    return logger.logDataModification(action, resource, resourceId, details)
  }, [logger])

  const logSecurityEvent = React.useCallback(async (
    event: string,
    details?: Record<string, any>
  ) => {
    return logger.logSecurityEvent(event, details)
  }, [logger])

  return {
    logAction,
    logAuthentication,
    logDataAccess,
    logDataModification,
    logSecurityEvent,
    getEvents: logger.getEvents.bind(logger),
    getEventSummary: logger.getEventSummary.bind(logger),
    exportEvents: logger.exportEvents.bind(logger)
  }
}

// HOC for automatic action logging
export const withAuditLogging = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    resource: string
    action?: string
    logMount?: boolean
    logUnmount?: boolean
  }
) => {
  const WrappedComponent = (props: P) => {
    const { logAction } = useAuditLogger()

    React.useEffect(() => {
      if (options.logMount) {
        logAction(options.action || 'component_mount', options.resource, {
          componentName: Component.displayName || Component.name,
          props: process.env.NODE_ENV === 'development' ? props : undefined
        })
      }

      return () => {
        if (options.logUnmount) {
          logAction(options.action || 'component_unmount', options.resource, {
            componentName: Component.displayName || Component.name
          })
        }
      }
    }, [logAction, props])

    return React.createElement(Component, props)
  }

  WrappedComponent.displayName = `withAuditLogging(${Component.displayName || Component.name})`
  return WrappedComponent
}

export default AuditLogger