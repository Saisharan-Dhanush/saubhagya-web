import {
  Customer,
  Contract,
  InventoryItem,
  Order,
  Invoice,
  Payment,
  Delivery,
  PriceData,
  ComplianceRecord,
  SalesMetrics,
  VoiceInvoiceData,
  ApiResponse,
  PaginatedResponse,
  CustomerFilters,
  OrderFilters,
  InventoryFilters
} from '../types';

// Mock data generators
const generateMockCustomers = (): Customer[] => [
  {
    id: 'cust_001',
    name: 'Green Energy Industries',
    type: 'industrial',
    contactPerson: 'Rajesh Kumar',
    phone: '+91-9876543210',
    email: 'rajesh@greenenergy.com',
    address: {
      street: '123 Industrial Area, Phase 2',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      coordinates: { lat: 28.5355, lng: 77.3910 }
    },
    creditLimit: 5000000,
    creditUsed: 1250000,
    paymentTerms: 30,
    gstNumber: '09ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    status: 'active',
    registrationDate: new Date('2023-01-15'),
    lastOrderDate: new Date('2024-09-15'),
    totalOrders: 45,
    totalRevenue: 12500000,
    riskCategory: 'low'
  },
  {
    id: 'cust_002',
    name: 'Sunrise Hotel Chain',
    type: 'commercial',
    contactPerson: 'Priya Sharma',
    phone: '+91-9876543211',
    email: 'priya@sunrisehotels.com',
    address: {
      street: '45 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    creditLimit: 1000000,
    creditUsed: 150000,
    paymentTerms: 15,
    gstNumber: '29FGHIJ5678K2L6',
    panNumber: 'FGHIJ5678K',
    status: 'active',
    registrationDate: new Date('2023-03-20'),
    lastOrderDate: new Date('2024-09-20'),
    totalOrders: 32,
    totalRevenue: 2800000,
    riskCategory: 'low'
  },
  {
    id: 'cust_003',
    name: 'Residential Society - Emerald Heights',
    type: 'residential',
    contactPerson: 'Amit Verma',
    phone: '+91-9876543212',
    email: 'amit@emeraldheights.com',
    address: {
      street: 'Emerald Heights, Sector 65',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122018',
      coordinates: { lat: 28.4089, lng: 77.0507 }
    },
    creditLimit: 500000,
    creditUsed: 75000,
    paymentTerms: 7,
    status: 'active',
    registrationDate: new Date('2023-06-10'),
    lastOrderDate: new Date('2024-09-18'),
    totalOrders: 28,
    totalRevenue: 850000,
    riskCategory: 'medium'
  }
];

const generateMockContracts = (): Contract[] => [
  {
    id: 'cont_001',
    customerId: 'cust_001',
    contractNumber: 'SB-2024-001',
    type: 'supply',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    gasType: 'biogas',
    quantity: 10000,
    pricePerUnit: 45,
    totalValue: 5400000,
    paymentTerms: {
      advancePercentage: 20,
      creditDays: 30,
      penaltyRate: 2
    },
    deliveryTerms: {
      location: 'Customer Site',
      frequency: 'monthly',
      transportMode: 'pipeline'
    },
    version: 1,
    signedDate: new Date('2023-12-15'),
    signedBy: {
      customer: { name: 'Rajesh Kumar', designation: 'CEO', signature: 'digital_signature_1' },
      company: { name: 'Saubhagya Representative', designation: 'Sales Manager', signature: 'digital_signature_2' }
    },
    documents: [
      {
        id: 'doc_001',
        name: 'Supply Agreement.pdf',
        type: 'contract',
        url: '/documents/supply_agreement_001.pdf',
        uploadDate: new Date('2023-12-15')
      }
    ]
  }
];

const generateMockInventory = (): InventoryItem[] => [
  {
    id: 'inv_001',
    gasType: 'biogas',
    batchNumber: 'BG-2024-001',
    productionDate: new Date('2024-09-15'),
    quantity: 5000,
    availableQuantity: 3500,
    unit: 'cubic_meters',
    quality: {
      methaneContent: 65,
      purity: 98.5,
      pressure: 15,
      temperature: 25
    },
    location: {
      plantId: 'plant_001',
      tankId: 'tank_A1',
      coordinates: { lat: 28.7041, lng: 77.1025 }
    },
    pesoCompliance: {
      certificateNumber: 'PESO-2024-001',
      issueDate: new Date('2024-01-15'),
      expiryDate: new Date('2025-01-15'),
      status: 'valid',
      inspector: 'Dr. Rajesh Gupta'
    },
    pricePerUnit: 45,
    reservedQuantity: 1500,
    status: 'available'
  },
  {
    id: 'inv_002',
    gasType: 'compressed',
    batchNumber: 'CG-2024-005',
    productionDate: new Date('2024-09-20'),
    quantity: 2000,
    availableQuantity: 1800,
    unit: 'kg',
    quality: {
      methaneContent: 95,
      purity: 99.2,
      pressure: 200,
      temperature: 20
    },
    location: {
      plantId: 'plant_002',
      tankId: 'tank_B2',
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    pesoCompliance: {
      certificateNumber: 'PESO-2024-002',
      issueDate: new Date('2024-02-01'),
      expiryDate: new Date('2025-02-01'),
      status: 'valid',
      inspector: 'Mr. Suresh Yadav'
    },
    pricePerUnit: 65,
    reservedQuantity: 200,
    status: 'available'
  }
];

const generateMockOrders = (): Order[] => [
  {
    id: 'ord_001',
    orderNumber: 'ORD-2024-001',
    customerId: 'cust_001',
    contractId: 'cont_001',
    orderDate: new Date('2024-09-15'),
    requestedDeliveryDate: new Date('2024-09-25'),
    status: 'confirmed',
    items: [
      {
        inventoryId: 'inv_001',
        gasType: 'biogas',
        quantity: 1000,
        pricePerUnit: 45,
        totalAmount: 45000,
        batchNumber: 'BG-2024-001'
      }
    ],
    totalQuantity: 1000,
    totalAmount: 45000,
    discountPercentage: 5,
    discountAmount: 2250,
    taxAmount: 7695,
    finalAmount: 50445,
    deliveryAddress: {
      street: '123 Industrial Area, Phase 2',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      coordinates: { lat: 28.5355, lng: 77.3910 }
    },
    deliveryInstructions: 'Delivery during business hours only',
    invoiceGenerated: true,
    invoiceNumber: 'INV-2024-001',
    paymentStatus: 'pending',
    createdBy: 'sales_user_001',
    lastModifiedBy: 'sales_user_001',
    lastModifiedDate: new Date('2024-09-15')
  }
];

const generateMockInvoices = (): Invoice[] => [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2024-001',
    orderId: 'ord_001',
    customerId: 'cust_001',
    invoiceDate: new Date('2024-09-15'),
    dueDate: new Date('2024-10-15'),
    status: 'sent',
    items: [
      {
        description: 'Biogas Supply - BG-2024-001',
        quantity: 1000,
        unit: 'cubic meters',
        pricePerUnit: 45,
        totalAmount: 45000,
        taxRate: 18,
        taxAmount: 8100
      }
    ],
    subtotal: 45000,
    discountAmount: 2250,
    taxAmount: 7695,
    totalAmount: 50445,
    paidAmount: 0,
    balanceAmount: 50445,
    paymentTerms: 'Net 30 days',
    bankDetails: {
      accountName: 'Saubhagya Energy Solutions',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India'
    },
    notes: 'Payment due within 30 days of invoice date',
    generatedBy: 'manual'
  }
];

// Service functions
export const salesService = {
  // Customer Management
  async getCustomers(filters?: CustomerFilters): Promise<PaginatedResponse<Customer>> {
    const customers = generateMockCustomers();
    return {
      success: true,
      data: customers,
      pagination: {
        page: 1,
        limit: 10,
        total: customers.length,
        totalPages: 1
      }
    };
  },

  async getCustomerById(id: string): Promise<ApiResponse<Customer>> {
    const customers = generateMockCustomers();
    const customer = customers.find(c => c.id === id);
    return {
      success: !!customer,
      data: customer!,
      message: customer ? 'Customer found' : 'Customer not found'
    };
  },

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<ApiResponse<Customer>> {
    const newCustomer: Customer = {
      ...customer,
      id: `cust_${Date.now()}`
    };
    return {
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    };
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const customers = generateMockCustomers();
    const customer = customers.find(c => c.id === id);
    if (!customer) {
      return { success: false, data: null as any, message: 'Customer not found' };
    }
    const updatedCustomer = { ...customer, ...updates };
    return {
      success: true,
      data: updatedCustomer,
      message: 'Customer updated successfully'
    };
  },

  // Contract Management
  async getContracts(): Promise<PaginatedResponse<Contract>> {
    const contracts = generateMockContracts();
    return {
      success: true,
      data: contracts,
      pagination: {
        page: 1,
        limit: 10,
        total: contracts.length,
        totalPages: 1
      }
    };
  },

  async getContractById(id: string): Promise<ApiResponse<Contract>> {
    const contracts = generateMockContracts();
    const contract = contracts.find(c => c.id === id);
    return {
      success: !!contract,
      data: contract!,
      message: contract ? 'Contract found' : 'Contract not found'
    };
  },

  async createContract(contract: Omit<Contract, 'id'>): Promise<ApiResponse<Contract>> {
    const newContract: Contract = {
      ...contract,
      id: `cont_${Date.now()}`
    };
    return {
      success: true,
      data: newContract,
      message: 'Contract created successfully'
    };
  },

  // Inventory Management
  async getInventory(filters?: InventoryFilters): Promise<PaginatedResponse<InventoryItem>> {
    const inventory = generateMockInventory();
    return {
      success: true,
      data: inventory,
      pagination: {
        page: 1,
        limit: 10,
        total: inventory.length,
        totalPages: 1
      }
    };
  },

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> {
    const inventory = generateMockInventory();
    const item = inventory.find(i => i.id === id);
    if (!item) {
      return { success: false, data: null as any, message: 'Inventory item not found' };
    }
    const updatedItem = { ...item, ...updates };
    return {
      success: true,
      data: updatedItem,
      message: 'Inventory item updated successfully'
    };
  },

  // Order Management
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const orders = generateMockOrders();
    return {
      success: true,
      data: orders,
      pagination: {
        page: 1,
        limit: 10,
        total: orders.length,
        totalPages: 1
      }
    };
  },

  async createOrder(order: Omit<Order, 'id' | 'orderNumber'>): Promise<ApiResponse<Order>> {
    const newOrder: Order = {
      ...order,
      id: `ord_${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
    };
    return {
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    };
  },

  // Invoice Management
  async getInvoices(): Promise<PaginatedResponse<Invoice>> {
    const invoices = generateMockInvoices();
    return {
      success: true,
      data: invoices,
      pagination: {
        page: 1,
        limit: 10,
        total: invoices.length,
        totalPages: 1
      }
    };
  },

  async generateInvoice(orderId: string): Promise<ApiResponse<Invoice>> {
    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      orderId,
      customerId: 'cust_001',
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'draft',
      items: [],
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      paidAmount: 0,
      balanceAmount: 0,
      paymentTerms: 'Net 30 days',
      bankDetails: {
        accountName: 'Saubhagya Energy Solutions',
        accountNumber: '1234567890',
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India'
      },
      generatedBy: 'manual'
    };
    return {
      success: true,
      data: invoice,
      message: 'Invoice generated successfully'
    };
  },

  // Voice Invoicing
  async startVoiceSession(language: 'hindi' | 'english'): Promise<ApiResponse<VoiceInvoiceData>> {
    const session: VoiceInvoiceData = {
      id: `voice_${Date.now()}`,
      sessionId: `session_${Date.now()}`,
      startTime: new Date(),
      language,
      transcription: '',
      confidence: 0,
      extractedData: { items: [] },
      status: 'recording',
      validationErrors: []
    };
    return {
      success: true,
      data: session,
      message: 'Voice session started'
    };
  },

  async processVoiceData(sessionId: string, audioData: string): Promise<ApiResponse<VoiceInvoiceData>> {
    // Mock processing
    const processedData: VoiceInvoiceData = {
      id: sessionId,
      sessionId,
      startTime: new Date(Date.now() - 60000),
      endTime: new Date(),
      language: 'hindi',
      transcription: 'ग्रीन एनर्जी इंडस्ट्रीज के लिए एक हजार क्यूबिक मीटर बायो गैस, पैंतालीस रुपए प्रति यूनिट',
      confidence: 0.85,
      extractedData: {
        customerName: 'Green Energy Industries',
        customerId: 'cust_001',
        items: [
          {
            description: 'Biogas',
            quantity: 1000,
            unit: 'cubic meters',
            pricePerUnit: 45
          }
        ],
        totalAmount: 45000
      },
      status: 'completed',
      validationErrors: []
    };
    return {
      success: true,
      data: processedData,
      message: 'Voice data processed successfully'
    };
  },

  // Payment Management
  async getPayments(): Promise<PaginatedResponse<Payment>> {
    const payments: Payment[] = [];
    return {
      success: true,
      data: payments,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    };
  },

  // Delivery Management
  async getDeliveries(): Promise<PaginatedResponse<Delivery>> {
    const deliveries: Delivery[] = [];
    return {
      success: true,
      data: deliveries,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    };
  },

  // Price Management
  async getPriceData(): Promise<ApiResponse<PriceData[]>> {
    const priceData: PriceData[] = [];
    return {
      success: true,
      data: priceData,
      message: 'Price data retrieved successfully'
    };
  },

  // Compliance
  async getComplianceRecords(): Promise<PaginatedResponse<ComplianceRecord>> {
    const records: ComplianceRecord[] = [];
    return {
      success: true,
      data: records,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    };
  },

  // Dashboard Metrics
  async getSalesMetrics(): Promise<ApiResponse<SalesMetrics>> {
    const metrics: SalesMetrics = {
      totalRevenue: 15000000,
      totalOrders: 105,
      averageOrderValue: 142857,
      totalCustomers: 25,
      activeContracts: 8,
      inventoryValue: 2500000,
      pendingPayments: 750000,
      deliverySuccess: 98.5,
      customerSatisfaction: 4.6,
      periodComparison: {
        revenue: { current: 15000000, previous: 12000000, change: 25 },
        orders: { current: 105, previous: 85, change: 23.5 },
        customers: { current: 25, previous: 20, change: 25 }
      }
    };
    return {
      success: true,
      data: metrics,
      message: 'Metrics retrieved successfully'
    };
  }
};

export default salesService;