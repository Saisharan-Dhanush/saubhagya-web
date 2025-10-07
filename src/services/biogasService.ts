/**
 * Biogas Service API Client
 * Connects to biogas-service backend (port 8082)
 * All APIs require JWT authentication
 */

const BIOGAS_SERVICE_URL = 'http://localhost:8082/biogas-service/api/v1';

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
  transactionId: string;
  clusterId: string;
  disputeType: string;
  priority: string;
  description: string;
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

// ==================== DUNG COLLECTION / TRANSACTION HISTORY TYPES ====================

export interface DungCollectionResponse {
  id: string;
  transactionRef: string;
  clusterId: string;
  gaushalaId: number;
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
  gaushalaId: number;
  collectionDate: string; // ISO datetime string
  weightKg: number;
  qualityGrade: 'A' | 'B' | 'C' | 'D';
  qualityNotes?: string;
  ratePerKg: number;
  paymentMethod: 'UPI' | 'CASH' | 'BANK_TRANSFER';
  paymentRef?: string;
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
   */
  async listDungCollections(
    clusterId?: string,
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
  }
};

export default biogasService;
