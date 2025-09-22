/**
 * TypeScript interfaces for Purification Module
 * SAUB-FE-003: Complete type definitions for all purification operations
 */

export interface PurificationMetrics {
  ch4Percentage: number;
  pressure: number;
  temperature: number;
  flowRate: number;
  h2sLevel: number;
  co2Level: number;
  moisture: number;
  timestamp: Date;
  unitId: string;
  status: 'operational' | 'maintenance' | 'offline' | 'alert';
}

export interface PurificationCycle {
  id: string;
  batchId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  status: 'preparing' | 'running' | 'completed' | 'failed' | 'paused';
  preCH4Reading: number;
  postCH4Reading?: number;
  targetCH4: number;
  sourceUnits: string[];
  outputVolume?: number;
  efficiency?: number;
  operatorId: string;
  qualityGrade: 'A' | 'B' | 'C' | 'FAILED';
  pesoCompliant: boolean;
  notes?: string;
}

export interface QualityTest {
  id: string;
  batchId: string;
  cycleId: string;
  testDate: Date;
  testType: 'pre_treatment' | 'post_treatment' | 'final_quality';
  parameters: {
    ch4: number;
    co2: number;
    h2s: number;
    moisture: number;
    calificValue: number;
    density: number;
  };
  complianceStatus: 'pass' | 'fail' | 'pending';
  pesoRating: string;
  technician: string;
  certificationNumber?: string;
  labResults?: string;
}

export interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: 'routine' | 'predictive' | 'emergency' | 'overhaul';
  scheduledDate: Date;
  completedDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  technician?: string;
  estimatedDuration: number; // hours
  actualDuration?: number;
  parts: MaintenancePart[];
  workDescription: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  cost?: number;
  notes?: string;
}

export interface MaintenancePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  supplier: string;
  inStock: number;
  minStock: number;
  lastOrdered?: Date;
}

export interface InventoryTransfer {
  id: string;
  transferType: 'incoming' | 'outgoing' | 'internal';
  fromLocation: string;
  toLocation: string;
  batchIds: string[];
  totalVolume: number;
  transferDate: Date;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'in_transit' | 'completed' | 'rejected';
  vehicleInfo?: {
    vehicleNumber: string;
    driverName: string;
    driverContact: string;
  };
  qualityCertificates: string[];
  pesoDocuments: string[];
}

export interface SlurryOutput {
  id: string;
  cycleId: string;
  outputDate: Date;
  volume: number; // liters
  qualityGrade: 'high' | 'medium' | 'low';
  destination: 'fertilizer' | 'disposal' | 'treatment' | 'sale';
  collectionScheduled: Date;
  collected: boolean;
  collectedBy?: string;
  revenue?: number;
  environmentalCertification?: string;
  analysisReport?: string;
  moistureContent: number;
  npkContent: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

export interface PurificationUnit {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'polishing';
  capacity: number; // m³/hour
  currentLoad: number;
  efficiency: number;
  status: 'operational' | 'maintenance' | 'offline';
  lastMaintenance: Date;
  nextMaintenance: Date;
  sensors: PurificationMetrics[];
  alerts: SystemAlert[];
  location: string;
  installationDate: Date;
  manufacturer: string;
  model: string;
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'critical';
  source: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actions: string[];
}

export interface BatchTracking {
  id: string;
  batchNumber: string;
  sourceLocation: string;
  arrivalDate: Date;
  volume: number;
  initialQuality: QualityTest;
  currentStatus: 'queued' | 'processing' | 'completed' | 'quarantined';
  assignedCycle?: string;
  expectedCompletion?: Date;
  traceabilityCode: string;
  sourceType: 'biogas_sangh' | 'direct_producer' | 'external';
  documentation: string[];
}

export interface DashboardData {
  liveMetrics: PurificationMetrics[];
  activeCycles: PurificationCycle[];
  recentAlerts: SystemAlert[];
  qualityTrends: {
    date: Date;
    avgCH4: number;
    complianceRate: number;
  }[];
  batchQueue: BatchTracking[];
  inventoryStatus: {
    totalVolume: number;
    gradeCounts: Record<string, number>;
    availableForTransfer: number;
  };
  efficiency: {
    overall: number;
    byUnit: Record<string, number>;
    trend: number;
  };
}

export interface CycleFormData {
  sourceBatches: string[];
  targetCH4: number;
  estimatedDuration: number;
  assignedUnits: string[];
  operatorNotes?: string;
  priority: 'normal' | 'high' | 'urgent';
}

export interface QualityThresholds {
  ch4Min: number;
  ch4Max: number;
  pressureMax: number;
  temperatureMax: number;
  h2sMax: number;
  co2Max: number;
  moistureMax: number;
}

export interface PurificationConfig {
  units: PurificationUnit[];
  qualityThresholds: QualityThresholds;
  alertSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    autoShutdownOnCritical: boolean;
  };
  operationalHours: {
    start: string;
    end: string;
    timezone: string;
  };
  complianceSettings: {
    pesoRequired: boolean;
    qualityCertificateRequired: boolean;
    auditTrailEnabled: boolean;
  };
}