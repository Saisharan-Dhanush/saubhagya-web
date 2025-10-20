/**
 * Unified API Service for SAUBHAGYA Web Admin
 * Connects to all 6 microservices with JWT authentication
 */

import { microservicesClient } from './microservices';

// API Configuration
const API_CONFIG = {
  timeout: 15000,
  retries: 3,
  retryDelay: 1000,
};

// Authentication Management
class AuthManager {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('saubhagya_jwt_token', token);
    } else {
      localStorage.removeItem('saubhagya_jwt_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('saubhagya_jwt_token');
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clear() {
    this.token = null;
    localStorage.removeItem('saubhagya_jwt_token');
  }
}

export const authManager = new AuthManager();

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Data Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

export interface Cattle {
  id: string;
  rfidTag: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  health: 'healthy' | 'sick' | 'recovering' | 'vaccination_due';
  ownerId: string;
  ownerName: string;
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
  createdAt: number;
  updatedAt: number;
}

export interface Transaction {
  id: string;
  type: 'dung_collection' | 'biogas_sale' | 'payment';
  cattleId?: string;
  amount: number;
  weight?: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'cancelled';
  description: string;
}

export interface DashboardStats {
  totalCattle: number;
  activeCattle: number;
  totalTransactions: number;
  totalRevenue: number;
  biogasProduced: number;
  dungCollected: number;
}

// Core API Service
class ApiService {
  // Authentication APIs (Auth Service - Port 8081)
  async login(phone: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Get auth service URL from environment variables
      const authServiceUrl = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081/auth-service';

      // Direct login to auth service - send phone as-is
      const loginResponse = await fetch(`${authServiceUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          password
        }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const responseData = await loginResponse.json();

      // Extract user and token from response
      // Response structure: { accessToken, refreshToken, userProfile: { id, phone, name, email, roles, permissions } }
      const userProfile = responseData.userProfile || responseData.data || {};
      const user: User = {
        id: userProfile.id || userProfile.externalId || '1',
        email: userProfile.email || `${phone}@saubhagya.com`,
        name: userProfile.name || 'User',
        role: userProfile.roles?.[0] || 'user',
        permissions: userProfile.permissions || []
      };

      const jwtToken = responseData.accessToken || responseData.data?.token || responseData.token;

      // Store token
      authManager.setToken(jwtToken);

      return {
        success: true,
        data: { user, token: jwtToken },
        message: 'Login successful'
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    authManager.clear();
    return { success: true, data: null, message: 'Logged out successfully' };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (!authManager.isAuthenticated()) {
      return { success: false, error: 'Not authenticated' };
    }

    // Mock user data - in real implementation, decode JWT or call user endpoint
    return {
      success: true,
      data: {
        id: '1',
        email: 'admin@saubhagya.com',
        name: 'Admin User',
        role: 'admin',
        permissions: ['cattle:read', 'cattle:write', 'transactions:read', 'dashboard:read']
      }
    };
  }

  // Cattle Management APIs (via Auth Service Gateway)
  async getCattle(): Promise<ApiResponse<Cattle[]>> {
    try {
      const response = await microservicesClient.callService('auth-service', '/auth/api/v1/cattle/list');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cattle');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cattle'
      };
    }
  }

  async addCattle(cattle: Omit<Cattle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Cattle>> {
    try {
      const response = await microservicesClient.callService('auth-service', '/auth/api/v1/cattle/store', {
        method: 'POST',
        body: JSON.stringify(cattle)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add cattle');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add cattle'
      };
    }
  }

  // IoT Device Management APIs (IoT Service - Port 8080)
  async getDevices(): Promise<ApiResponse<any[]>> {
    try {
      const response = await microservicesClient.callService('iot-service', '/iot/api/v1/devices');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch devices');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch devices'
      };
    }
  }

  async getRFIDTags(): Promise<ApiResponse<any[]>> {
    try {
      const response = await microservicesClient.callService('iot-service', '/iot/api/v1/rfid-tags');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch RFID tags');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch RFID tags'
      };
    }
  }

  // Transaction APIs (Transaction Service - Port 8082)
  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    try {
      const response = await microservicesClient.callService('transaction-service', '/api/v1/transactions');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch transactions');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch transactions'
      };
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<ApiResponse<Transaction>> {
    try {
      const response = await microservicesClient.callService('transaction-service', '/api/v1/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add transaction');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add transaction'
      };
    }
  }

  // Sales & Commerce APIs (Sales Service - Port 8083)
  async getSales(): Promise<ApiResponse<any[]>> {
    try {
      const response = await microservicesClient.callService('sales-service', '/api/commerce/sales');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sales');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sales'
      };
    }
  }

  async getOrders(): Promise<ApiResponse<any[]>> {
    try {
      const response = await microservicesClient.callService('sales-service', '/api/commerce/orders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders'
      };
    }
  }

  // Analytics & Reporting APIs (Reporting Service - Port 8084)
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await microservicesClient.callService('reporting-service', '/api/v1/dashboard');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
      };
    }
  }

  async getAnalytics(type: string): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('reporting-service', `/api/v1/analytics/${type}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch analytics');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics'
      };
    }
  }

  // Government APIs (Government Service - Port 8085)
  async getGovernmentDashboard(): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('government-service', '/government/api/v1/dashboard');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch government dashboard');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch government dashboard'
      };
    }
  }

  async getSchemes(): Promise<ApiResponse<any[]>> {
    try {
      const response = await microservicesClient.callService('government-service', '/government/api/v1/schemes');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch schemes');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch schemes'
      };
    }
  }

  // Purification Service APIs (Port 8087)
  // Metrics APIs
  async getPurificationRealtimeMetrics(): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/metrics/realtime');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch realtime metrics');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch realtime metrics'
      };
    }
  }

  async getPurificationUnitMetrics(unitId: string): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', `/purification-service/api/v1/metrics/unit/${unitId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch unit metrics');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch unit metrics'
      };
    }
  }

  // Cycle Management APIs
  async getPurificationCycles(params?: { page?: number; size?: number; status?: string }): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.status) queryParams.append('status', params.status);

      const url = `/purification-service/api/v1/cycles${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await microservicesClient.callService('purification-service', url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cycles');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cycles'
      };
    }
  }

  async createPurificationCycle(cycleData: any): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/cycles', {
        method: 'POST',
        body: JSON.stringify(cycleData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create cycle');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create cycle'
      };
    }
  }

  async getPurificationCycleById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', `/purification-service/api/v1/cycles/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cycle');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cycle'
      };
    }
  }

  async completePurificationCycle(id: string, completionData: any): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', `/purification-service/api/v1/cycles/${id}/complete`, {
        method: 'POST',
        body: JSON.stringify(completionData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete cycle');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete cycle'
      };
    }
  }

  // Purification Units APIs
  async getPurificationUnits(params?: { page?: number; size?: number; status?: string }): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.status) queryParams.append('status', params.status);

      const url = `/purification-service/api/v1/metrics/units${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await microservicesClient.callService('purification-service', url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch purification units');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch purification units'
      };
    }
  }

  // Quality Control APIs
  async submitQualityTest(testData: any): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/quality/tests', {
        method: 'POST',
        body: JSON.stringify(testData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit quality test');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit quality test'
      };
    }
  }

  async getQualityTests(params?: { page?: number; size?: number }): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());

      const url = `/purification-service/api/v1/quality/tests${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await microservicesClient.callService('purification-service', url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch quality tests');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch quality tests'
      };
    }
  }

  async getComplianceStatus(): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/quality/compliance');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch compliance status');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch compliance status'
      };
    }
  }

  // Inventory APIs
  async getPurificationInventory(): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/inventory');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch inventory');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch inventory'
      };
    }
  }

  async createInventoryTransfer(transferData: any): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/inventory/transfer', {
        method: 'POST',
        body: JSON.stringify(transferData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create inventory transfer');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create inventory transfer'
      };
    }
  }

  async getBatchTracking(batchId: string): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', `/purification-service/api/v1/inventory/batch/${batchId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch batch tracking');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch batch tracking'
      };
    }
  }

  // Slurry Management APIs
  async getSlurryOutputs(): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/slurry/outputs');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch slurry outputs');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch slurry outputs'
      };
    }
  }

  async createSlurryOutput(slurryData: any): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/slurry/outputs', {
        method: 'POST',
        body: JSON.stringify(slurryData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create slurry output');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create slurry output'
      };
    }
  }

  async gradeSlurry(gradingData: any): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/slurry/grading', {
        method: 'POST',
        body: JSON.stringify(gradingData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to grade slurry');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to grade slurry'
      };
    }
  }

  // Maintenance APIs
  async createMaintenanceSchedule(scheduleData: any): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/maintenance/schedule', {
        method: 'POST',
        body: JSON.stringify(scheduleData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create maintenance schedule');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create maintenance schedule'
      };
    }
  }

  async getMaintenanceSchedules(unitId?: string): Promise<ApiResponse<any>> {
    try {
      const url = unitId
        ? `/purification-service/api/v1/maintenance/unit/${unitId}/schedules`
        : '/purification-service/api/v1/maintenance/schedules';
      const response = await microservicesClient.callService('purification-service', url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch maintenance schedules');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch maintenance schedules'
      };
    }
  }

  async createWorkOrder(workOrderData: any): Promise<ApiResponse<any>> {
    try {
      const response = await microservicesClient.callService('purification-service', '/purification-service/api/v1/maintenance/work-orders', {
        method: 'POST',
        body: JSON.stringify(workOrderData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create work order');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create work order'
      };
    }
  }

  async getMaintenanceHistory(unitId: string, params?: { days?: number }): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.days) queryParams.append('days', params.days.toString());

      const url = `/purification-service/api/v1/maintenance/unit/${unitId}/history${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await microservicesClient.callService('purification-service', url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch maintenance history');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch maintenance history'
      };
    }
  }

  // Health Check for all services
  async healthCheck(): Promise<ApiResponse<Record<string, boolean>>> {
    try {
      const healthResults = await microservicesClient.healthCheck();
      return {
        success: true,
        data: healthResults,
        message: 'Health check completed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed'
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;