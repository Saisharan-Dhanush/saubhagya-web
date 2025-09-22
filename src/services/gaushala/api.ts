/**
 * GauShala API Service - Fixed version with proper microservices integration
 * Handles all API calls for cattle management, transactions, and dashboard data
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Cattle Management APIs
export interface Cattle {
  id: string;
  rfidTag: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  health: 'healthy' | 'sick' | 'recovering' | 'vaccination_due';
  owner: string;
  ownerId: string;
  location: {
    latitude: number;
    longitude: number;
    timestamp: number;
    address?: string;
  };
  totalDungCollected: number;
  lastDungCollection?: number;
  isActive: boolean;
  photoUrl?: string;
  medicalHistory: MedicalRecord[];
  createdAt: number;
  updatedAt: number;
}

export interface MedicalRecord {
  id: string;
  date: number;
  type: 'checkup' | 'vaccination' | 'treatment' | 'surgery';
  description: string;
  veterinarian: string;
  medication?: string;
  nextCheckup?: number;
}

export interface Transaction {
  id: string;
  cattleId: string;
  cattleName: string;
  digestorId: string;
  dungWeight: number;
  dungQuality: number;
  worker: string;
  timestamp: number;
  biogasGenerated: number;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'digital' | 'credit';
  notes?: string;
}

export interface DashboardStats {
  totalCattle: number;
  activeCattle: number;
  sickCattle: number;
  totalDungCollected: number;
  todayDungCollection: number;
  totalBiogasGenerated: number;
  todayBiogasGenerated: number;
  totalRevenue: number;
  pendingTransactions: number;
  averageHealthScore: number;
}

export interface RecentCollection {
  id: string;
  cattleName: string;
  weight: number;
  quality: number;
  worker: string;
  timestamp: number;
  digestorId: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface TopPerformer {
  name: string;
  collections: number;
  totalWeight: number;
  avgQuality: number;
}

// API Helper function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('saubhagya_jwt_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Dashboard API
export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiCall<DashboardStats>('/api/dashboard/stats');
  },

  async getRecentCollections(limit: number = 10): Promise<ApiResponse<RecentCollection[]>> {
    return apiCall<RecentCollection[]>(`/api/dashboard/recent-collections?limit=${limit}`);
  },

  async getTopPerformers(limit: number = 5): Promise<ApiResponse<TopPerformer[]>> {
    return apiCall<TopPerformer[]>(`/api/dashboard/top-performers?limit=${limit}`);
  },
};

// Cattle Management API - Using proper microservices architecture
export const cattleApi = {
  async getAllCattle(): Promise<ApiResponse<Cattle[]>> {
    // Use IoT Service via proper microservices routing (Auth gateway)
    try {
      // Import microservices client dynamically to avoid circular dependencies
      const { IoTServiceClient } = await import('../microservices');
      const result = await IoTServiceClient.getCattleList();

      return {
        success: result.success,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Get all cattle failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async getCattleById(id: string): Promise<ApiResponse<Cattle>> {
    const allCattleResponse = await this.getAllCattle();
    if (!allCattleResponse.success || !allCattleResponse.data) {
      return {
        success: false,
        error: allCattleResponse.error || 'Failed to fetch cattle data'
      };
    }

    const cattle = allCattleResponse.data.find(c => c.id === id);
    if (!cattle) {
      return {
        success: false,
        error: 'Cattle not found',
      };
    }

    return {
      success: true,
      data: cattle,
    };
  },

  async getCattleByRfid(rfidTag: string): Promise<ApiResponse<Cattle>> {
    return apiCall<Cattle>(`/api/v1/cattle/rfid/${encodeURIComponent(rfidTag)}`);
  },

  async createCattle(cattle: Omit<Cattle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Cattle>> {
    try {
      const { IoTServiceClient } = await import('../microservices');
      const result = await IoTServiceClient.addCattle({
        tagId: cattle.rfidTag,
        name: cattle.name,
        breed: cattle.breed,
        age: cattle.age,
        weight: cattle.weight,
      });

      return {
        success: result.success,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async updateCattle(id: string, updates: Partial<Cattle>): Promise<ApiResponse<Cattle>> {
    try {
      const { IoTServiceClient } = await import('../microservices');

      // Prepare complete data structure for backend
      const updateData: any = {
        id: id,
        name: updates.name,
        breed: updates.breed,
        age: updates.age,
        weight: updates.weight,
      };

      // Add optional fields if provided
      if (updates.rfidTag) {
        updateData.rfidTag = updates.rfidTag;
      }
      if (updates.health) {
        updateData.health = updates.health;
      }
      if (updates.owner) {
        updateData.ownerName = updates.owner;
      }
      if (updates.ownerId) {
        updateData.ownerId = updates.ownerId;
      }
      if (updates.location) {
        updateData.location = updates.location;
      }

      const result = await IoTServiceClient.updateCattle(id, updateData);

      return {
        success: result.success,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async deleteCattle(id: string): Promise<ApiResponse<void>> {
    try {
      const { IoTServiceClient } = await import('../microservices');
      const result = await IoTServiceClient.deleteCattle(id);

      return {
        success: result.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async scanRfid(): Promise<ApiResponse<{ rfidTag: string; cattleInfo?: Cattle }>> {
    // Simulate RFID scanning
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            rfidTag: `RFID-${Date.now()}`,
          },
        });
      }, 2000);
    });
  },

  async updateHealth(cattleId: string, health: Cattle['health'], notes?: string): Promise<ApiResponse<Cattle>> {
    const updateData: Partial<Cattle> = { health };
    if (notes) {
      // Notes can be used for logging or future implementation
      console.log(`Health update notes for ${cattleId}: ${notes}`);
    }
    return this.updateCattle(cattleId, updateData);
  },

  async addMedicalRecord(cattleId: string, record: Omit<MedicalRecord, 'id'>): Promise<ApiResponse<MedicalRecord>> {
    return apiCall<MedicalRecord>(`/api/v1/cattle/${cattleId}/medical-records`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  },

  async uploadPhoto(cattleId: string, photoFile: File): Promise<ApiResponse<{ photoUrl: string }>> {
    const formData = new FormData();
    formData.append('photo', photoFile);

    try {
      const token = localStorage.getItem('saubhagya_jwt_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/cattle/${cattleId}/photo`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
};

// Transaction API
export const transactionApi = {
  async getAllTransactions(): Promise<ApiResponse<Transaction[]>> {
    return apiCall<Transaction[]>('/api/v1/transactions');
  },

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    return apiCall<Transaction>(`/api/v1/transactions/${id}`);
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<ApiResponse<Transaction>> {
    try {
      // Use BiogasServiceClient for proper microservices routing
      const { BiogasServiceClient } = await import('../microservices');
      const result = await BiogasServiceClient.recordContribution({
        cattleId: transaction.cattleId,
        dungWeight: transaction.dungWeight,
        dungQuality: transaction.dungQuality,
        workerId: transaction.worker,
        notes: transaction.notes,
        digestorId: transaction.digestorId,
      });

      return {
        success: result.success || true,
        data: result.data || result,
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    return apiCall<Transaction>(`/api/v1/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async processPayment(transactionId: string, paymentMethod: Transaction['paymentMethod']): Promise<ApiResponse<Transaction>> {
    return apiCall<Transaction>(`/api/v1/transactions/${transactionId}/payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod }),
    });
  },

  async getTransactionsByDigestor(digestorId: string): Promise<ApiResponse<Transaction[]>> {
    return apiCall<Transaction[]>(`/api/v1/transactions/digestor/${digestorId}`);
  },

  async getTransactionsByWorker(workerId: string): Promise<ApiResponse<Transaction[]>> {
    return apiCall<Transaction[]>(`/api/v1/transactions/worker/${workerId}`);
  },

  async getTransactionsByCattle(cattleId: string): Promise<ApiResponse<Transaction[]>> {
    return apiCall<Transaction[]>(`/api/v1/transactions/cattle/${cattleId}`);
  },
};

// Combined API export
export const api = {
  dashboard: dashboardApi,
  cattle: cattleApi,
  transactions: transactionApi,
};

// Legacy export for backward compatibility - maintain nested structure
export const gauShalaApi = {
  cattle: cattleApi,
  dashboard: dashboardApi,
  transactions: transactionApi,
};

export default api;