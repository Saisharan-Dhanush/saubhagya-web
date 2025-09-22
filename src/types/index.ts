/**
 * SAUBHAGYA Platform - Comprehensive Type Definitions
 * Enterprise-grade TypeScript interfaces for all modules
 * @version 1.0.0
 */

// ============================================
// COMMON TYPES
// ============================================

export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'warning' | 'critical';
export type UserRole = 'FARMER' | 'CLUSTER_MANAGER' | 'PURIFICATION_OPERATOR' | 'SALES_TEAM' | 'ADMIN' | 'TRANSPORTER';
export type Language = 'en' | 'hi' | 'gu' | 'mr' | 'pa';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================
// BIOGAS SANGH (CLUSTER MANAGER) TYPES
// ============================================

export interface Digester extends BaseEntity {
  name: string;
  code: string;
  location: string;
  capacity: number; // in m³
  status: 'operational' | 'maintenance' | 'offline' | 'warning' | 'critical';
  metrics: DigesterMetrics;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  clusterId: string;
  operatorId?: string;
  alerts: Alert[];
}

export interface DigesterMetrics {
  ch4Percentage: number; // 0-100%
  temperature: number; // °C
  pressure: number; // bar
  volume: number; // m³
  flowRate: number; // m³/hr
  h2sLevel: number; // ppm
  co2Level: number; // %
  phLevel: number; // 0-14
  timestamp: Date;
}

export interface ProductionBatch extends BaseEntity {
  batchId: string;
  digesterIds: string[];
  startDate: Date;
  endDate?: Date;
  status: 'collecting' | 'digesting' | 'ready' | 'transferred' | 'closed';
  inputs: BatchInput[];
  totalInputWeight: number; // kg
  expectedOutput: number; // m³
  actualOutput?: number; // m³
  ch4Content?: number; // %
  qualityGrade?: 'A' | 'B' | 'C';
  transferredTo?: string; // purification unit ID
}

export interface BatchInput {
  farmerId: string;
  farmerName: string;
  weight: number; // kg
  timestamp: Date;
  verifiedBy: string;
  iotWeight?: number;
  photoProof?: string;
  transactionId: string;
}

export interface Dispute extends BaseEntity {
  farmerId: string;
  farmerName: string;
  transactionId: string;
  disputeType: 'weight' | 'quality' | 'payment' | 'other';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  claimedWeight?: number;
  iotWeight?: number;
  finalWeight?: number;
  description: string;
  resolution?: string;
  evidences: Evidence[];
  assignedTo?: string;
}

export interface Evidence {
  type: 'photo' | 'document' | 'iot_reading' | 'witness';
  url: string;
  description: string;
  uploadedBy: string;
  timestamp: Date;
}

export interface PickupSchedule extends BaseEntity {
  date: Date;
  route: string;
  stops: PickupStop[];
  assignedTo: string; // transporter ID
  vehicleId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  totalDistance: number; // km
  estimatedDuration: number; // minutes
  actualDuration?: number;
}

export interface PickupStop {
  farmerId: string;
  location: GeoLocation;
  estimatedTime: Date;
  actualTime?: Date;
  expectedWeight: number;
  actualWeight?: number;
  status: 'pending' | 'completed' | 'skipped';
}

// ============================================
// TRANSPORTER TYPES
// ============================================

export interface Transporter extends BaseEntity {
  name: string;
  phone: string;
  licenseNumber: string;
  vehicles: Vehicle[];
  currentLocation?: GeoLocation;
  status: 'available' | 'on_route' | 'offline';
  rating: number; // 0-5
  completedDeliveries: number;
  activeRoute?: Route;
}

export interface Vehicle extends BaseEntity {
  registrationNumber: string;
  type: 'truck' | 'tractor' | 'mini_truck' | 'trolley';
  capacity: number; // kg
  fuelType: 'diesel' | 'petrol' | 'cng' | 'electric';
  status: 'active' | 'maintenance' | 'inactive';
  currentLocation?: GeoLocation;
  mileage: number; // km
  lastService?: Date;
  nextService?: Date;
  insurance: InsuranceDetails;
}

export interface InsuranceDetails {
  provider: string;
  policyNumber: string;
  validTill: Date;
  coverageAmount: number;
}

export interface Route extends BaseEntity {
  routeId: string;
  date: Date;
  transporterId: string;
  vehicleId: string;
  stops: RouteStop[];
  totalDistance: number; // km
  estimatedDuration: number; // minutes
  actualDuration?: number;
  fuelCost: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  optimizationScore?: number; // 0-100
}

export interface RouteStop {
  stopId: string;
  type: 'pickup' | 'delivery';
  location: GeoLocation;
  address: string;
  contactPerson: string;
  contactPhone: string;
  estimatedArrival: Date;
  actualArrival?: Date;
  weight?: number;
  status: 'pending' | 'arrived' | 'completed' | 'skipped';
  proof?: DeliveryProof;
}

export interface DeliveryProof {
  photos: string[];
  signature?: string;
  timestamp: Date;
  location: GeoLocation;
  receiverName: string;
  notes?: string;
  weight?: number;
  qualityCheck?: QualityCheck;
}

export interface QualityCheck {
  ch4Level?: number;
  pressure?: number;
  temperature?: number;
  passed: boolean;
  remarks?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  address?: string;
}

// ============================================
// PURIFICATION (SHUDDHI DOOT) TYPES
// ============================================

export interface PurificationUnit extends BaseEntity {
  unitId: string;
  name: string;
  location: string;
  capacity: number; // m³/hr
  status: 'operational' | 'maintenance' | 'offline';
  currentCycle?: PurificationCycle;
  metrics: PurificationMetrics;
  maintenanceSchedule: MaintenanceItem[];
}

export interface PurificationCycle extends BaseEntity {
  cycleId: string;
  unitId: string;
  sourceBatchIds: string[];
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  preCH4: number; // %
  postCH4?: number; // %
  status: 'preparing' | 'running' | 'completed' | 'failed' | 'quarantined';
  volumeProcessed: number; // m³
  operatorId: string;
  qualityCertificate?: string;
  slurryOutput?: SlurryOutput;
}

export interface PurificationMetrics {
  ch4Purity: number; // %
  pressure: number; // bar
  temperature: number; // °C
  flowRate: number; // m³/hr
  filterStatus: 'good' | 'warning' | 'replace';
  compressorStatus: 'running' | 'idle' | 'maintenance';
  scrubberEfficiency: number; // %
}

export interface SlurryOutput {
  volume: number; // liters
  quality: 'high' | 'medium' | 'low';
  destination: 'fertilizer' | 'disposal' | 'treatment';
  handledBy: string;
  timestamp: Date;
}

export interface MaintenanceItem {
  id: string;
  equipment: string;
  type: 'preventive' | 'corrective' | 'emergency';
  scheduledDate: Date;
  completedDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  technician?: string;
  cost?: number;
  notes?: string;
  parts?: ReplacementPart[];
}

export interface ReplacementPart {
  name: string;
  partNumber: string;
  quantity: number;
  cost: number;
  supplier: string;
}

// ============================================
// SALES (URJA VYAPAR) TYPES
// ============================================

export interface Customer extends BaseEntity {
  customerId: string;
  companyName: string;
  type: 'retail' | 'commercial' | 'industrial' | 'government';
  gstin?: string;
  pan?: string;
  contacts: Contact[];
  addresses: Address[];
  creditLimit: number;
  creditUsed: number;
  paymentTerms: number; // days
  status: 'active' | 'inactive' | 'blocked';
  contracts: Contract[];
  totalBusiness: number;
  lastOrderDate?: Date;
  rating?: number;
}

export interface Contact {
  name: string;
  designation: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface Address {
  type: 'billing' | 'shipping' | 'both';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isPrimary: boolean;
}

export interface Contract extends BaseEntity {
  contractId: string;
  customerId: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  type: 'spot' | 'term' | 'annual';
  terms: ContractTerms;
  documents: Document[];
  signedDate?: Date;
  signedBy?: string[];
  version: number;
}

export interface ContractTerms {
  minimumQuantity: number; // m³
  maximumQuantity?: number;
  pricePerUnit: number;
  currency: 'INR' | 'USD';
  deliveryTerms: string;
  paymentTerms: string;
  penalties?: string;
  incentives?: string;
}

export interface SalesOrder extends BaseEntity {
  orderId: string;
  customerId: string;
  contractId?: string;
  products: OrderProduct[];
  totalAmount: number;
  tax: number;
  discount: number;
  netAmount: number;
  orderDate: Date;
  deliveryDate?: Date;
  status: 'draft' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'completed' | 'overdue';
  invoices: Invoice[];
  deliveryAddress: Address;
  notes?: string;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  batchIds: string[];
  quantity: number;
  unit: 'kg' | 'm³' | 'cylinders';
  unitPrice: number;
  subtotal: number;
  pesoCompliance: boolean;
  qualityCertificate?: string;
}

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  pdfUrl?: string;
  signedUrl?: string;
  payments: Payment[];
}

export interface Payment {
  paymentId: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  method: 'cash' | 'cheque' | 'bank_transfer' | 'upi' | 'credit';
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  receiptUrl?: string;
}

// ============================================
// ALERT & NOTIFICATION TYPES
// ============================================

export interface Alert extends BaseEntity {
  type: 'system' | 'sensor' | 'business' | 'safety';
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  title: string;
  message: string;
  actionRequired: boolean;
  actionUrl?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// ============================================
// DOCUMENT TYPES
// ============================================

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface KPIMetric {
  name: string;
  value: number;
  unit?: string;
  change: number; // percentage
  trend: 'up' | 'down' | 'stable';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  target?: number;
  achievement?: number; // percentage
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
  options?: ChartOptions;
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: any;
  scales?: any;
}

// ============================================
// CONFIGURATION TYPES
// ============================================

export interface ModuleConfig {
  enabled: boolean;
  features: Record<string, boolean>;
  settings: Record<string, any>;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
  conditions?: Record<string, any>;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'comfortable';
  animations: boolean;
}

// ============================================
// FORM TYPES
// ============================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'multiselect' | 'date' | 'datetime' | 'checkbox' | 'radio' | 'textarea' | 'file';
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: Option[];
  validation?: ValidationRule[];
  dependsOn?: string;
  visible?: boolean;
  disabled?: boolean;
  helpText?: string;
}

export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// ============================================
// EXPORT ALL TYPES
// ============================================

