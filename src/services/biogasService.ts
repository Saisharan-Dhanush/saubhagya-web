/**
 * Biogas Service API Client
 * Connects to biogas-service backend (port 8082)
 * All APIs require JWT authentication
 */

const BIOGAS_SERVICE_URL = import.meta.env.VITE_BIOGAS_SERVICE_URL
  ? `${import.meta.env.VITE_BIOGAS_SERVICE_URL}/api/v1`
  : 'http://localhost:8082/biogas-service/api/v1';

// Helper function to get JWT token
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('saubhagya_jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// API Response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | null;
}

// Dashboard Stats Types
export interface DashboardStatsResponse {
  totalProduction: number;
  totalCollections: number;
  totalWeight: number | null;
  totalPayments: number;
  pendingPayments: number;
  totalBatches: number | null;
  activeBatches: number | null;
}

export interface ClusterDashboardResponse {
  clusterId: string;
  clusterName: string;
  totalDigesters: number;
  activeDigesters: number;
  totalProduction: number;
  averageEfficiency: number;
  criticalAlerts: number;
  // Add more fields as needed
}

export interface ProductionTrendsResponse {
  trends: Array<{
    date: string;
    production: number;
    efficiency: number;
  }>;
}

export interface FarmerPerformanceResponse {
  farmers: Array<{
    farmerId: string;
    farmerName: string;
    totalContribution: number;
    rank: number;
  }>;
}

export interface QualityTrendsResponse {
  trends: Array<{
    date: string;
    gradeA: number;
    gradeB: number;
    gradeC: number;
  }>;
}

export interface PaymentSummaryResponse {
  totalPayments: number;
  pendingPayments: number;
  completedPayments: number;
  totalAmount: number;
  statusBreakdown: {
    pending: number;
    completed: number;
    failed: number;
  };
}

// Batch Management Types
export interface ProductionBatch {
  id: number;
  externalId: string;
  batchNumber: string;
  clusterId: string;
  sourceContributions: string[];
  totalInputWeightKg: number;
  productionStartDate: string;
  productionEndDate?: string;
  biogasProducedCubicMeters?: number;
  methaneContentPercent?: number;
  h2sContentPpm?: number;
  productionEfficiencyPercent?: number;
  qualityGrade?: 'PREMIUM' | 'STANDARD' | 'BASIC';
  batchStatus: 'SCHEDULED' | 'IN_PRODUCTION' | 'COMPLETED' | 'QUALITY_TESTED' | 'READY_FOR_SALE';
  operatorUserId?: string;
  notes?: string;
  carbonCreditGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchRequest {
  clusterId: string;
  sourceContributions: string[];
  totalInputWeightKg: number;
  productionStartDate: string;
  operatorUserId?: string;
  notes?: string;
}

export interface CompleteBatchRequest {
  biogasProducedCubicMeters: number;
  methaneContentPercent: number;
  h2sContentPpm: number;
  productionEfficiencyPercent: number;
  qualityGrade: 'PREMIUM' | 'STANDARD' | 'BASIC';
  notes?: string;
}

export interface BatchPageResponse {
  content: ProductionBatch[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Dispute Resolution Types
export interface DisputeResponse {
  disputeId: string;
  disputeRef: string;
  transactionId: string;
  clusterId: string;
  disputeType: string;
  priority: string;
  status: string;
  description: string;
  resolutionType?: string;
  resolutionNotes?: string;
  slaDeadline: string;
  createdAt: string;
  resolvedAt?: string;
  slaBreached: boolean;
}

export interface CreateDisputeRequest {
  transactionId: number;
  clusterId: string;
  disputeType: string;
  priority: string;
  description: string;
  disputeReason: string;
  externalId?: string;
}

export interface DisputeResolutionRequest {
  resolutionType: string;
  resolutionNotes: string;
}

export interface DisputeResponseRequest {
  responseText: string;
  attachments?: string[];
}

export interface DisputePageResponse {
  content: DisputeResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ==========================================
// Payment Reconciliation Types (Story 11.1 - AC-45 to AC-52)
// ==========================================

export interface ReconciliationResponse {
  entryId: string;
  dungTransactionId: string;
  matchedTransactionId?: string;
  matchStatus: string;
  amount: number;
  matchNotes?: string;
  transactionDate: string;
  reference: string;
  matched: boolean;
}

export interface ReconciliationPageResponse {
  content: ReconciliationResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ReconciliationReportResponse {
  totalEntries: number;
  totalTransactions: number;
  matchedCount: number;
  unmatchedCount: number;
  totalAmount: number;
  matchedAmount: number;
  reconciledAmount: number;
  unreconciledAmount: number;
  reconciliationPercentage: number;
  matchedEntries: number;
  unmatchedEntries: number;
}

export interface ManualMatchRequest {
  matchedTransactionId: string;
  matchNotes?: string;
}

export interface BankStatementUploadResponse {
  uploadedEntries: number;
  autoMatchedCount: number;
  pendingCount: number;
  message: string;
}

// ==================== CLUSTER TYPES ====================

export interface ClusterResponse {
  id: number;
  clusterId: number;
  clusterCode: string;
  clusterName: string;
  name: string;
  locationAddress?: string;
  district?: string;
  state?: string;
  pincode?: string;
  capacity?: number;
  status?: string;
}

// ==================== DUNG COLLECTION / TRANSACTION HISTORY TYPES ====================

export interface DungCollectionResponse {
  id: string;
  transactionRef: string;
  clusterId: string;
  gaushalaId: number; // Long type from backend
  collectionDate: string;
  weightKg: number;
  qualityGrade: 'A' | 'B' | 'C' | 'D';
  qualityNotes?: string;
  ratePerKg: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'CASH' | 'BANK_TRANSFER';
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'QUEUED';
  paymentTimestamp?: string;
  paymentRef?: string;
  transactionStatus: 'ACTIVE' | 'REVERSED' | 'DISPUTED';
  assignedToBatch: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DungCollectionPageResponse {
  content: DungCollectionResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface DungCollectionRequest {
  clusterId: string;
  gaushalaId: number; // Long type from backend
  collectionDate: string; // ISO datetime string
  weightKg: number;
  qualityGrade: 'A' | 'B' | 'C' | 'D';
  qualityNotes?: string;
  ratePerKg: number;
  paymentMethod: 'UPI' | 'CASH' | 'BANK_TRANSFER';
  paymentRef?: string;
}

// ==========================================
// Alert & Notification Management Types (Story 11.1 - AC-61 to AC-68)
// ==========================================

export interface AlertConfigurationRequest {
  clusterId: string | number; // Backend expects Long, but we'll convert
  alertType: string;
  severity: string;
  thresholdValue?: number;
  description?: string;
  enabled?: boolean;
}

export interface AlertConfigurationResponse {
  id: string;
  clusterId: string;
  alertType: string;
  severity: string;
  thresholdValue?: number;
  enabled: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertResponse {
  id?: string;
  alertId?: string; // Backend uses alertId instead of id
  alertConfigId?: string;
  clusterId: string;
  alertType: string;
  severity: string;
  message: string;
  triggeredAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  escalated?: boolean;
}

export interface AlertActionRequest {
  actionTaken: string;
  resolutionNotes?: string;
}

export interface AlertPageResponse {
  content: AlertResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  pageable?: any;
  last?: boolean;
  first?: boolean;
  empty?: boolean;
}

/**
 * Dashboard Service
 */
export const biogasService = {
  /**
   * AC-70: Get dashboard stats
   * GET /api/v1/dashboard/stats
   */
  async getDashboardStats(clusterId?: string): Promise<ApiResponse<DashboardStatsResponse>> {
    try {
      const url = clusterId
        ? `${BIOGAS_SERVICE_URL}/dashboard/stats?clusterId=${clusterId}`
        : `${BIOGAS_SERVICE_URL}/dashboard/stats`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
      };
    }
  },

  /**
   * AC-69: Get cluster dashboard
   * GET /api/v1/dashboard/cluster/{clusterId}
   */
  async getClusterDashboard(clusterId: string): Promise<ApiResponse<ClusterDashboardResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/dashboard/cluster/${clusterId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch cluster dashboard:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cluster dashboard'
      };
    }
  },

  /**
   * AC-71: Get production trends
   * GET /api/v1/dashboard/analytics/production-trends
   */
  async getProductionTrends(
    clusterId: string,
    startDate?: string,
    endDate?: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<ApiResponse<ProductionTrendsResponse>> {
    try {
      const params = new URLSearchParams({ clusterId, granularity });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(
        `${BIOGAS_SERVICE_URL}/dashboard/analytics/production-trends?${params}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch production trends:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch production trends'
      };
    }
  },

  /**
   * AC-72: Get farmer performance
   * GET /api/v1/dashboard/analytics/farmer-performance
   */
  async getFarmerPerformance(
    clusterId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<FarmerPerformanceResponse>> {
    try {
      const params = new URLSearchParams({ clusterId });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(
        `${BIOGAS_SERVICE_URL}/dashboard/analytics/farmer-performance?${params}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch farmer performance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch farmer performance'
      };
    }
  },

  /**
   * AC-73: Get quality trends
   * GET /api/v1/dashboard/analytics/quality-trends
   */
  async getQualityTrends(
    clusterId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<QualityTrendsResponse>> {
    try {
      const params = new URLSearchParams({ clusterId });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(
        `${BIOGAS_SERVICE_URL}/dashboard/analytics/quality-trends?${params}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch quality trends:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch quality trends'
      };
    }
  },

  /**
   * AC-74: Get payment summary
   * GET /api/v1/dashboard/analytics/payment-summary
   */
  async getPaymentSummary(
    clusterId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<PaymentSummaryResponse>> {
    try {
      const params = new URLSearchParams({ clusterId });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(
        `${BIOGAS_SERVICE_URL}/dashboard/analytics/payment-summary?${params}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch payment summary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payment summary'
      };
    }
  },

  /**
   * Batch Management APIs
   */

  /**
   * Get production batches with filtering and pagination
   * GET /api/v1/production/batches
   */
  async getBatches(
    clusterId?: string,
    status?: 'SCHEDULED' | 'IN_PRODUCTION' | 'COMPLETED' | 'QUALITY_TESTED' | 'READY_FOR_SALE',
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<BatchPageResponse>> {
    try {
      const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
      if (clusterId) params.append('clusterId', clusterId);
      if (status) params.append('status', status);

      const response = await fetch(
        `${BIOGAS_SERVICE_URL}/production/batches?${params}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const pageData = await response.json();

      // Spring Data returns Page object directly, wrap it in ApiResponse
      return {
        success: true,
        data: pageData
      };
    } catch (error) {
      console.error('Failed to fetch production batches:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch production batches'
      };
    }
  },

  /**
   * Get batch by ID
   * GET /api/v1/production/batches/{id}
   */
  async getBatchById(id: number): Promise<ApiResponse<ProductionBatch>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/production/batches/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch batch:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch batch'
      };
    }
  },

  /**
   * Create new production batch
   * POST /api/v1/production/batches
   */
  async createBatch(request: CreateBatchRequest): Promise<ApiResponse<ProductionBatch>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/production/batches`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create batch:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create batch'
      };
    }
  },

  /**
   * Start batch production
   * POST /api/v1/production/batches/{id}/start
   */
  async startBatch(id: number): Promise<ApiResponse<ProductionBatch>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/production/batches/${id}/start`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to start batch:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start batch'
      };
    }
  },

  /**
   * Complete batch with quality measurements
   * POST /api/v1/production/batches/{id}/complete
   */
  async completeBatch(id: number, request: CompleteBatchRequest): Promise<ApiResponse<ProductionBatch>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/production/batches/${id}/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to complete batch:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete batch'
      };
    }
  },

  /**
   * Dispute Resolution APIs
   */

  /**
   * List disputes with filtering and pagination
   * GET /api/v1/disputes
   */
  async getDisputes(
    status?: string,
    disputeType?: string,
    clusterId?: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<DisputePageResponse>> {
    try {
      const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
      if (status) params.append('status', status);
      if (disputeType) params.append('disputeType', disputeType);
      if (clusterId) params.append('clusterId', clusterId);

      const response = await fetch(
        `${BIOGAS_SERVICE_URL}/disputes?${params}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Backend returns ApiResponse wrapping Page object
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch disputes'
      };
    }
  },

  /**
   * Get dispute by ID
   * GET /api/v1/disputes/{id}
   */
  async getDisputeById(id: string): Promise<ApiResponse<DisputeResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/disputes/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to fetch dispute:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dispute'
      };
    }
  },

  /**
   * Create new dispute
   * POST /api/v1/disputes
   */
  async createDispute(request: CreateDisputeRequest): Promise<ApiResponse<DisputeResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/disputes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to create dispute:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create dispute'
      };
    }
  },

  /**
   * Add response to dispute
   * POST /api/v1/disputes/{id}/respond
   */
  async respondToDispute(id: string, request: DisputeResponseRequest): Promise<ApiResponse<DisputeResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/disputes/${id}/respond`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to respond to dispute:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to respond to dispute'
      };
    }
  },

  /**
   * Resolve dispute
   * PUT /api/v1/disputes/{id}/resolve
   */
  async resolveDispute(id: string, request: DisputeResolutionRequest): Promise<ApiResponse<DisputeResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/disputes/${id}/resolve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resolve dispute'
      };
    }
  },

  // ==========================================
  // Payment Reconciliation APIs (Story 11.1 - AC-45 to AC-52)
  // ==========================================

  /**
   * Get pending reconciliations (AC-46)
   */
  async getPendingReconciliations(clusterId?: string, page = 0, size = 20): Promise<ApiResponse<ReconciliationPageResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });

      if (clusterId) {
        params.append('clusterId', clusterId);
      }

      const response = await fetch(`${BIOGAS_SERVICE_URL}/reconciliation/pending?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to fetch pending reconciliations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch pending reconciliations'
      };
    }
  },

  /**
   * Get reconciliation report (AC-49)
   */
  async getReconciliationReport(clusterId: string, startDate?: string, endDate?: string): Promise<ApiResponse<ReconciliationReportResponse>> {
    try {
      const params = new URLSearchParams({
        clusterId
      });

      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }

      const response = await fetch(`${BIOGAS_SERVICE_URL}/reconciliation/report?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to fetch reconciliation report:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch reconciliation report'
      };
    }
  },

  /**
   * Auto-match transactions (AC-47)
   */
  async performAutoMatching(clusterId: string): Promise<ApiResponse<string>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/reconciliation/auto-match?clusterId=${clusterId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to perform auto-matching:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to perform auto-matching'
      };
    }
  },

  /**
   * Manually match transaction (AC-48)
   */
  async manualMatch(id: string, request: ManualMatchRequest): Promise<ApiResponse<ReconciliationResponse>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/reconciliation/${id}/manual-match`, request);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to manually match transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to manually match transaction'
      };
    }
  },

  /**
   * Upload bank statement (AC-45)
   */
  async uploadBankStatement(file: File, clusterId: string): Promise<ApiResponse<BankStatementUploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clusterId', clusterId);

      const response = await axios.post(`${API_BASE_URL}/reconciliation/upload-statement`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to upload bank statement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload bank statement'
      };
    }
  },

  // ==================== DUNG COLLECTION / TRANSACTION HISTORY ====================

  /**
   * List dung collections (AC-12) - Transaction History
   * GET /api/v1/dung-collections
   * Role-based filtering: Gaushala Managers see only their own transactions
   */
  async listDungCollections(
    clusterId?: string,
    gaushalaId?: number,
    paymentStatus?: string,
    startDate?: string,
    endDate?: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<DungCollectionPageResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });

      if (clusterId) {
        params.append('clusterId', clusterId);
      }
      if (gaushalaId !== undefined) {
        params.append('gaushalaId', gaushalaId.toString());
      }
      if (paymentStatus) {
        params.append('paymentStatus', paymentStatus);
      }
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }

      const response = await fetch(`${BIOGAS_SERVICE_URL}/dung-collections?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to fetch dung collections:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dung collections'
      };
    }
  },

  /**
   * Get dung collections for the authenticated user's gaushala
   * GET /api/v1/dung-collections/my-gaushala
   * Automatically filters by the logged-in user's gaushala (extracted from JWT)
   */
  async getMyGaushalaCollections(
    page = 0,
    size = 20
  ): Promise<ApiResponse<DungCollectionPageResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });

      const response = await fetch(`${BIOGAS_SERVICE_URL}/dung-collections/my-gaushala?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to fetch my gaushala collections:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch my gaushala collections'
      };
    }
  },

  /**
   * Get single dung collection details (AC-13)
   * GET /api/v1/dung-collections/{id}
   */
  async getDungCollectionById(id: string): Promise<ApiResponse<DungCollectionResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/dung-collections/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Failed to fetch dung collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dung collection'
      };
    }
  },

  /**
   * Create dung collection transaction (AC-11)
   * POST /api/v1/dung-collections
   */
  async createDungCollection(request: DungCollectionRequest): Promise<ApiResponse<DungCollectionResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/dung-collections`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Collection created successfully'
      };
    } catch (error) {
      console.error('Failed to create dung collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create dung collection'
      };
    }
  },

  /**
   * Update an existing dung collection transaction (AC-14)
   * PUT /api/v1/dung-collections/{id}
   */
  async updateDungCollection(id: number, request: DungCollectionRequest): Promise<ApiResponse<DungCollectionResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/dung-collections/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Collection updated successfully'
      };
    } catch (error) {
      console.error('Failed to update dung collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update dung collection'
      };
    }
  },

  // ==========================================
  // Alert & Notification Management APIs (Story 11.1 - AC-61 to AC-68)
  // ==========================================

  /**
   * Get alert configurations for a cluster (AC-68)
   * GET /api/v1/alerts/configurations
   */
  async getAlertConfigurations(clusterId: string): Promise<ApiResponse<AlertConfigurationResponse[]>> {
    try {
      const url = `${BIOGAS_SERVICE_URL}/alerts/configurations?clusterId=${clusterId}`;
      console.log('📡 Calling getAlertConfigurations with URL:', url);
      console.log('📍 ClusterId parameter:', clusterId, 'Type:', typeof clusterId);

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Raw response from backend (getAlertConfigurations):', data);
      console.log('📦 Extracted data.data:', data.data);
      console.log('📦 Is data.data an array?', Array.isArray(data.data));

      const result = {
        success: data.success || true,
        data: data.data || data,
        message: data.message
      };

      console.log('📤 Returning result from getAlertConfigurations:', result);
      return result;
    } catch (error) {
      console.error('Failed to fetch alert configurations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch alert configurations'
      };
    }
  },

  /**
   * Create alert configuration (AC-61)
   * POST /api/v1/alerts/configurations
   */
  async createAlertConfiguration(request: AlertConfigurationRequest): Promise<ApiResponse<AlertConfigurationResponse>> {
    try {
      console.log('📝 Creating alert configuration with request:', request);

      // Convert clusterId to number for backend (backend expects Long)
      const payload = {
        ...request,
        clusterId: typeof request.clusterId === 'string' ? parseInt(request.clusterId, 10) : request.clusterId
      };

      console.log('📦 Payload after conversion:', payload);
      console.log('🔢 ClusterId value:', payload.clusterId, 'Type:', typeof payload.clusterId);

      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/configurations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('Failed to create alert configuration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create alert configuration'
      };
    }
  },

  /**
   * Get active alerts for a cluster (AC-62)
   * GET /api/v1/alerts/active
   */
  async getActiveAlerts(
    clusterId: string,
    severity?: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<AlertPageResponse>> {
    try {
      const params = new URLSearchParams({
        clusterId,
        page: page.toString(),
        size: size.toString()
      });
      if (severity) params.append('severity', severity);

      const url = `${BIOGAS_SERVICE_URL}/alerts/active?${params.toString()}`;
      console.log('📡 Calling getActiveAlerts with URL:', url);
      console.log('📍 ClusterId parameter:', clusterId, 'Type:', typeof clusterId);

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('Failed to fetch active alerts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch active alerts'
      };
    }
  },


  /**
   * Get alert history (AC-67)
   * GET /api/v1/alerts/history
   */
  async getAlertHistory(
    clusterId: string,
    startDate?: string,
    endDate?: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<AlertPageResponse>> {
    try {
      const params = new URLSearchParams({
        clusterId,
        page: page.toString(),
        size: size.toString()
      });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/history?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('Failed to fetch alert history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch alert history'
      };
    }
  },

  /**
   * Trigger alert (create active alert directly)
   * POST /api/v1/alerts/trigger
   */
  async triggerAlert(request: {
    clusterId: string;
    alertType: string;
    severity: string;
    message: string;
  }): Promise<ApiResponse<AlertResponse>> {
    try {
      console.log('📝 Triggering new alert:', request);

      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/trigger`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      console.log('📥 Trigger alert response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Trigger alert failed:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Alert triggered successfully:', data);

      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Alert triggered successfully'
      };
    } catch (error) {
      console.error('Failed to trigger alert:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to trigger alert'
      };
    }
  },

  /**
   * Update alert message
   * PUT /api/v1/alerts/{id}
   */
  async updateAlert(id: number, request: {
    clusterId: string;
    alertType: string;
    severity: string;
    message: string;
  }): Promise<ApiResponse<AlertResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Alert updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update alert'
      };
    }
  },

  /**
   * Delete alert message
   * DELETE /api/v1/alerts/{id}
   */
  async deleteAlert(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      return {
        success: true,
        message: 'Alert deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete alert'
      };
    }
  },

  /**
   * Acknowledge alert
   * PUT /api/v1/alerts/{id}/acknowledge
   */
  async acknowledgeAlert(id: number): Promise<ApiResponse<AlertResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/${id}/acknowledge`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Alert acknowledged successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to acknowledge alert'
      };
    }
  },

  /**
   * Resolve alert with action details
   * PUT /api/v1/alerts/{id}/resolve
   */
  async resolveAlert(id: number, request: AlertActionRequest): Promise<ApiResponse<AlertResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/${id}/resolve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Alert resolved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resolve alert'
      };
    }
  },

  /**
   * Update alert configuration
   * PUT /api/v1/alerts/configurations/{id}
   */
  async updateAlertConfiguration(id: number, request: AlertConfigurationRequest): Promise<ApiResponse<AlertConfigurationResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/configurations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Alert configuration updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update alert configuration'
      };
    }
  },

  /**
   * Delete alert configuration
   * DELETE /api/v1/alerts/configurations/{id}
   */
  async deleteAlertConfiguration(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/configurations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      return {
        success: true,
        message: 'Alert configuration deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete alert configuration'
      };
    }
  },

  // Toggle alert configuration enabled/disabled status
  async toggleAlertConfiguration(id: number): Promise<ApiResponse<AlertConfigurationResponse>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/alerts/configurations/${id}/toggle`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Alert configuration status updated'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle alert configuration'
      };
    }
  },

  // ==========================================
  // User-Cluster Access Management APIs
  // ==========================================

  /**
   * Get all user-cluster access records
   * GET /api/v1/admin/cluster-access/all
   */
  async getAllUserClusterAccess(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/admin/cluster-access/all`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('Failed to fetch user-cluster access records:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch access records'
      };
    }
  },

  /**
   * Grant user access to cluster
   * POST /api/v1/admin/cluster-access/grant
   */
  async grantClusterAccess(userId: number, clusterId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/admin/cluster-access/grant`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, clusterId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Access granted successfully'
      };
    } catch (error) {
      console.error('Failed to grant cluster access:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to grant access'
      };
    }
  },

  /**
   * Revoke user access to cluster
   * DELETE /api/v1/admin/cluster-access/revoke
   */
  async revokeClusterAccess(userId: number, clusterId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(
        `${BIOGAS_SERVICE_URL}/admin/cluster-access/revoke?userId=${userId}&clusterId=${clusterId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Access revoked successfully'
      };
    } catch (error) {
      console.error('Failed to revoke cluster access:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to revoke access'
      };
    }
  },

  /**
   * Check if user has access to cluster
   * GET /api/v1/admin/cluster-access/check
   */
  async checkClusterAccess(userId: number, clusterId: number): Promise<ApiResponse<{ hasAccess: boolean }>> {
    try {
      const response = await fetch(
        `${BIOGAS_SERVICE_URL}/admin/cluster-access/check?userId=${userId}&clusterId=${clusterId}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: data.hasAccess ? 'User has access' : 'User does not have access'
      };
    } catch (error) {
      console.error('Failed to check cluster access:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check access'
      };
    }
  },

  /**
   * Get user details from auth-service
   * GET /api/auth/users/{id}
   */
  async getUserById(userId: number): Promise<ApiResponse<any>> {
    try {
      const AUTH_API_BASE = `${import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081/auth-service'}/api/auth`;
      const response = await fetch(`${AUTH_API_BASE}/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      };
    }
  },

  /**
   * Get cluster details by ID
   * GET /api/v1/admin/cluster-access/cluster/{id}
   */
  async getClusterById(clusterId: string | number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/admin/cluster-access/cluster/${clusterId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Cluster retrieved successfully'
      };
    } catch (error) {
      console.error(`Failed to fetch cluster ${clusterId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cluster'
      };
    }
  },

  /**
   * Get gaushala details by ID
   * GET /api/v1/gaushalas/{id}
   */
  async getGaushalaById(gaushalaId: string | number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/gaushalas/${gaushalaId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error(`Failed to fetch gaushala ${gaushalaId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch gaushala'
      };
    }
  },

  // ==========================================
  // Admin Cluster Management APIs
  // ==========================================

  /**
   * Get all biogas clusters (Admin)
   * GET /api/v1/admin/cluster-access/clusters
   */
  async getAllClusters(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/admin/cluster-access/clusters`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data || [],
        message: 'Clusters retrieved successfully'
      };
    } catch (error) {
      console.error('Failed to fetch clusters:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch clusters',
        data: []
      };
    }
  },

  // ==========================================
  // User Cluster Access APIs
  // ==========================================

  /**
   * Get clusters accessible by current user
   * GET /api/v1/user/clusters
   *
   * Returns all clusters the authenticated user has been granted access to.
   * Used for populating cluster selection dropdowns.
   */
  async getMyAccessibleClusters(): Promise<ApiResponse<ClusterResponse[]>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/user/clusters`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Backend returns { userId, totalClusters, clusters: [...] }
      return {
        success: true,
        data: data.clusters || [],
        message: data.message
      };
    } catch (error) {
      console.error('Failed to fetch accessible clusters:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch accessible clusters'
      };
    }
  },

  /**
   * Check if current user has access to a specific cluster
   * GET /api/v1/user/clusters/{clusterId}/check-access
   */
  async checkMyClusterAccess(clusterId: number): Promise<ApiResponse<{ hasAccess: boolean }>> {
    try {
      const response = await fetch(`${BIOGAS_SERVICE_URL}/user/clusters/${clusterId}/check-access`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: { hasAccess: data.hasAccess }
      };
    } catch (error) {
      console.error('Failed to check cluster access:', error);
      return {
        success: false,
        data: { hasAccess: false },
        error: error instanceof Error ? error.message : 'Failed to check cluster access'
      };
    }
  },

  /**
   * Update dung collection payment status
   * PUT /api/v1/dung-collections/{id}
   */
  async updateDungCollectionPaymentStatus(
    id: string,
    paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'QUEUED',
    paymentMethod?: 'UPI' | 'CASH' | 'BANK_TRANSFER',
    paymentRef?: string
  ): Promise<ApiResponse<DungCollectionResponse>> {
    try {
      // Fetch current collection data first
      const currentData = await this.getDungCollectionById(id);
      if (!currentData.success || !currentData.data) {
        throw new Error('Failed to fetch current collection data');
      }

      const updateRequest: DungCollectionRequest = {
        clusterId: currentData.data.clusterId,
        gaushalaId: currentData.data.gaushalaId,
        collectionDate: currentData.data.collectionDate,
        weightKg: currentData.data.weightKg,
        qualityGrade: currentData.data.qualityGrade,
        qualityNotes: currentData.data.qualityNotes,
        ratePerKg: currentData.data.ratePerKg,
        paymentMethod: (paymentMethod || currentData.data.paymentMethod) as 'UPI' | 'CASH' | 'BANK_TRANSFER',
        paymentRef: paymentRef || currentData.data.paymentRef,
        paymentStatus: paymentStatus
      };

      console.log('Sending update request with payment status:', updateRequest);

      const response = await fetch(`${BIOGAS_SERVICE_URL}/dung-collections/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateRequest)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Payment status updated successfully'
      };
    } catch (error) {
      console.error('Failed to update payment status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update payment status'
      };
    }
  }
};

export default biogasService;
