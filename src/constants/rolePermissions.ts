/**
 * Role-based permission definitions for SAUBHAGYA platform
 * Separated from AuthContext to enable Fast Refresh (HMR) compatibility
 */

export type UserRole = 'field_worker' | 'cluster_manager' | 'cbg_sales' | 'business_dev' | 'admin' | 'senior_leader' | 'purification_operator' | 'transporter'

export interface Permission {
  module: string
  actions: string[]
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
  ],
  transporter: [
    { module: 'vehicle_management', actions: ['manage', 'track'] },
    { module: 'route_optimization', actions: ['optimize', 'plan'] },
    { module: 'delivery_tracking', actions: ['track', 'update'] },
    { module: 'schedule_management', actions: ['schedule', 'modify'] },
    { module: 'logistics', actions: ['coordinate', 'monitor'] }
  ]
}
