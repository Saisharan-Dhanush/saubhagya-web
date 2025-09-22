/**
 * Configuration for Purification Module
 * SAUB-FE-003: Comprehensive configuration settings
 */

import { PurificationConfig, QualityThresholds } from './Purification.types';

export const DEFAULT_QUALITY_THRESHOLDS: QualityThresholds = {
  ch4Min: 90.0,
  ch4Max: 98.0,
  pressureMax: 2.5,
  temperatureMax: 45.0,
  h2sMax: 20.0,
  co2Max: 5.0,
  moistureMax: 1.0,
};

export const CYCLE_DURATIONS = {
  standard: 60, // minutes
  extended: 90,
  rapid: 45,
  deep_clean: 120,
};

export const ALERT_PRIORITIES = {
  low: { color: 'blue', timeout: 300000 }, // 5 minutes
  medium: { color: 'yellow', timeout: 180000 }, // 3 minutes
  high: { color: 'orange', timeout: 60000 }, // 1 minute
  critical: { color: 'red', timeout: 0 }, // No auto-dismiss
};

export const PURIFICATION_STAGES = [
  { id: 'desulfurization', name: 'Desulfurization', duration: 15 },
  { id: 'dehydration', name: 'Dehydration', duration: 20 },
  { id: 'co2_removal', name: 'CO₂ Removal', duration: 20 },
  { id: 'polishing', name: 'Final Polishing', duration: 5 },
];

export const QUALITY_GRADES = {
  A: { minCH4: 95, color: 'green', label: 'Premium Grade' },
  B: { minCH4: 92, color: 'blue', label: 'Standard Grade' },
  C: { minCH4: 90, color: 'yellow', label: 'Basic Grade' },
  FAILED: { minCH4: 0, color: 'red', label: 'Failed Quality' },
};

export const EQUIPMENT_TYPES = {
  primary_scrubber: { name: 'Primary Scrubber', maintenance_interval: 168 }, // hours
  secondary_filter: { name: 'Secondary Filter', maintenance_interval: 336 },
  compressor: { name: 'Compressor Unit', maintenance_interval: 720 },
  valve_system: { name: 'Valve System', maintenance_interval: 2160 },
  sensor_array: { name: 'Sensor Array', maintenance_interval: 720 },
  control_panel: { name: 'Control Panel', maintenance_interval: 4320 },
};

export const SLURRY_DESTINATIONS = [
  { id: 'fertilizer', name: 'Organic Fertilizer', price_per_liter: 2.5 },
  { id: 'treatment', name: 'Further Treatment', price_per_liter: 0 },
  { id: 'disposal', name: 'Safe Disposal', price_per_liter: -1.0 },
  { id: 'sale', name: 'Direct Sale', price_per_liter: 3.0 },
];

export const REFRESH_INTERVALS = {
  dashboard: 5000, // 5 seconds
  monitoring: 2000, // 2 seconds
  quality: 10000, // 10 seconds
  maintenance: 30000, // 30 seconds
  inventory: 15000, // 15 seconds
};

export const NAVIGATION_CONFIG = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/purification',
    icon: 'BarChart3',
    description: 'Real-time overview and metrics'
  },
  {
    id: 'cycles',
    label: 'Cycle Management',
    path: '/purification/cycles',
    icon: 'RotateCcw',
    description: 'Manage purification cycles'
  },
  {
    id: 'quality',
    label: 'Quality Control',
    path: '/purification/quality',
    icon: 'CheckCircle',
    description: 'Quality testing and compliance'
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    path: '/purification/maintenance',
    icon: 'Wrench',
    description: 'Equipment maintenance scheduling'
  },
  {
    id: 'inventory',
    label: 'Inventory Transfer',
    path: '/purification/inventory',
    icon: 'Package',
    description: 'Batch tracking and transfers'
  },
  {
    id: 'slurry',
    label: 'Slurry Management',
    path: '/purification/slurry',
    icon: 'Droplets',
    description: 'Slurry output and disposal'
  },
  {
    id: 'monitoring',
    label: 'Real-time Monitoring',
    path: '/purification/monitoring',
    icon: 'Activity',
    description: 'Live sensor monitoring'
  },
];

export const MOCK_DATA_CONFIG = {
  units_count: 3,
  historical_cycles: 20,
  maintenance_schedules: 15,
  transfer_requests: 10,
  sensor_fluctuation: 0.05, // ±5%
  alert_frequency: 0.1, // 10% chance per update
  slurry_output_range: [100, 200], // liters per cycle
};

export const PESO_COMPLIANCE_LEVELS = [
  { level: 'A+', minCH4: 96, requirements: ['Lab certification', 'Quality seal', 'Traceability'] },
  { level: 'A', minCH4: 94, requirements: ['Lab certification', 'Quality seal'] },
  { level: 'B+', minCH4: 92, requirements: ['Lab certification'] },
  { level: 'B', minCH4: 90, requirements: ['Basic testing'] },
];

export const SENSOR_MOCK_RANGES = {
  ch4Percentage: { min: 88, max: 97, optimal: 94 },
  pressure: { min: 1.8, max: 2.6, optimal: 2.1 },
  temperature: { min: 32, max: 42, optimal: 37 },
  flowRate: { min: 80, max: 150, optimal: 125 },
  h2sLevel: { min: 5, max: 25, optimal: 12 },
  co2Level: { min: 1, max: 6, optimal: 2.5 },
  moisture: { min: 0.2, max: 1.2, optimal: 0.5 },
};

export const DEFAULT_CONFIG: PurificationConfig = {
  units: [], // Will be populated by mock service
  qualityThresholds: DEFAULT_QUALITY_THRESHOLDS,
  alertSettings: {
    emailNotifications: true,
    smsNotifications: true,
    autoShutdownOnCritical: true,
  },
  operationalHours: {
    start: '06:00',
    end: '22:00',
    timezone: 'Asia/Kolkata',
  },
  complianceSettings: {
    pesoRequired: true,
    qualityCertificateRequired: true,
    auditTrailEnabled: true,
  },
};