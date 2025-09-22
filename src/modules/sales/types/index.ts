// Sales Module Types
export interface Customer {
  id: string;
  name: string;
  type: 'commercial' | 'residential' | 'industrial';
  contactPerson: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: { lat: number; lng: number };
  };
  creditLimit: number;
  creditUsed: number;
  paymentTerms: number; // days
  gstNumber?: string;
  panNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: Date;
  lastOrderDate?: Date;
  totalOrders: number;
  totalRevenue: number;
  riskCategory: 'low' | 'medium' | 'high';
}

export interface Contract {
  id: string;
  customerId: string;
  contractNumber: string;
  type: 'supply' | 'bulk' | 'subscription';
  status: 'draft' | 'active' | 'expired' | 'terminated';
  startDate: Date;
  endDate: Date;
  gasType: 'biogas' | 'compressed' | 'liquefied';
  quantity: number; // cubic meters per month
  pricePerUnit: number;
  totalValue: number;
  paymentTerms: {
    advancePercentage: number;
    creditDays: number;
    penaltyRate: number;
  };
  deliveryTerms: {
    location: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    transportMode: 'pipeline' | 'cylinder' | 'tanker';
  };
  version: number;
  parentContractId?: string;
  signedDate?: Date;
  signedBy?: {
    customer: { name: string; designation: string; signature: string };
    company: { name: string; designation: string; signature: string };
  };
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: Date;
  }[];
}

export interface InventoryItem {
  id: string;
  gasType: 'biogas' | 'compressed' | 'liquefied';
  batchNumber: string;
  productionDate: Date;
  expiryDate?: Date;
  quantity: number;
  availableQuantity: number;
  unit: 'cubic_meters' | 'kg' | 'liters';
  quality: {
    methaneContent: number;
    purity: number;
    pressure?: number;
    temperature?: number;
  };
  location: {
    plantId: string;
    tankId?: string;
    coordinates: { lat: number; lng: number };
  };
  pesoCompliance: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    status: 'valid' | 'expired' | 'pending';
    inspector: string;
  };
  pricePerUnit: number;
  reservedQuantity: number;
  status: 'available' | 'reserved' | 'sold' | 'expired';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  contractId?: string;
  orderDate: Date;
  requestedDeliveryDate: Date;
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'dispatched' | 'delivered' | 'cancelled';
  items: {
    inventoryId: string;
    gasType: string;
    quantity: number;
    pricePerUnit: number;
    totalAmount: number;
    batchNumber: string;
  }[];
  totalQuantity: number;
  totalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: { lat: number; lng: number };
  };
  deliveryInstructions?: string;
  invoiceGenerated: boolean;
  invoiceNumber?: string;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  createdBy: string;
  lastModifiedBy: string;
  lastModifiedDate: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  invoiceDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: {
    description: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalAmount: number;
    taxRate: number;
    taxAmount: number;
  }[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentTerms: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  notes?: string;
  generatedBy: 'manual' | 'voice' | 'auto';
  voiceData?: {
    audioFileUrl: string;
    transcription: string;
    language: 'hindi' | 'english';
    confidence: number;
  };
}

export interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  paymentDate: Date;
  amount: number;
  method: 'cash' | 'cheque' | 'bank_transfer' | 'upi' | 'card';
  reference: string;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  reconciliationStatus: 'pending' | 'matched' | 'discrepancy';
  bankStatementEntry?: {
    date: Date;
    amount: number;
    reference: string;
    narration: string;
  };
  processedBy: string;
  notes?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'failed' | 'rescheduled';
  transporterId: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  route: {
    startLocation: { lat: number; lng: number; address: string };
    endLocation: { lat: number; lng: number; address: string };
    estimatedDistance: number;
    estimatedTime: number;
    actualDistance?: number;
    actualTime?: number;
  };
  trackingUpdates: {
    timestamp: Date;
    location: { lat: number; lng: number };
    status: string;
    notes?: string;
  }[];
  deliveryProof?: {
    receivedBy: string;
    receivedAt: Date;
    signature?: string;
    photos?: string[];
    otp?: string;
  };
  fuelCost: number;
  tollCharges: number;
  driverPayment: number;
  totalCost: number;
}

export interface PriceData {
  id: string;
  gasType: 'biogas' | 'compressed' | 'liquefied';
  region: string;
  date: Date;
  marketPrice: number;
  ourPrice: number;
  competitorPrices: {
    competitor: string;
    price: number;
    source: string;
  }[];
  priceFactors: {
    rawMaterialCost: number;
    productionCost: number;
    transportCost: number;
    margin: number;
    taxes: number;
  };
  demandIndicators: {
    seasonalFactor: number;
    localDemand: 'low' | 'medium' | 'high';
    inventoryLevel: number;
  };
}

export interface ComplianceRecord {
  id: string;
  type: 'peso' | 'gst' | 'environmental' | 'safety';
  certificateNumber: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'pending_renewal' | 'suspended';
  issuingAuthority: string;
  scope: string;
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: Date;
  }[];
  inspectionHistory: {
    date: Date;
    inspector: string;
    result: 'passed' | 'failed' | 'conditional';
    remarks: string;
    nextInspectionDate?: Date;
  }[];
  renewalReminders: {
    daysBeforeExpiry: number;
    reminderSent: boolean;
    sentDate?: Date;
  }[];
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  activeContracts: number;
  inventoryValue: number;
  pendingPayments: number;
  deliverySuccess: number;
  customerSatisfaction: number;
  periodComparison: {
    revenue: { current: number; previous: number; change: number };
    orders: { current: number; previous: number; change: number };
    customers: { current: number; previous: number; change: number };
  };
}

export interface VoiceInvoiceData {
  id: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  language: 'hindi' | 'english';
  audioFileUrl?: string;
  transcription: string;
  confidence: number;
  extractedData: {
    customerName?: string;
    customerId?: string;
    items: {
      description: string;
      quantity: number;
      unit: string;
      pricePerUnit?: number;
    }[];
    totalAmount?: number;
    discountPercentage?: number;
    paymentTerms?: string;
    deliveryDate?: Date;
    notes?: string;
  };
  status: 'recording' | 'processing' | 'completed' | 'error';
  validationErrors: string[];
  createdInvoiceId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and Search Types
export interface CustomerFilters {
  type?: string[];
  status?: string[];
  riskCategory?: string[];
  creditRange?: { min: number; max: number };
  city?: string[];
  registrationDateRange?: { start: Date; end: Date };
}

export interface OrderFilters {
  status?: string[];
  dateRange?: { start: Date; end: Date };
  amountRange?: { min: number; max: number };
  customerId?: string;
  gasType?: string[];
}

export interface InventoryFilters {
  gasType?: string[];
  location?: string[];
  status?: string[];
  batchNumber?: string;
  expiryDateRange?: { start: Date; end: Date };
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'map';
  size: 'small' | 'medium' | 'large';
  data: any;
  refreshInterval?: number;
  lastUpdated: Date;
}