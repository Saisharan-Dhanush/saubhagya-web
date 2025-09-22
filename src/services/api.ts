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
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Step 1: Get OAuth2 token
      const tokenResponse = await fetch('http://localhost:8081/auth/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa('saubhagya-web:web-app-secret-2024'),
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'iot-service commerce-service government-service reporting-service profile'
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('OAuth2 authentication failed');
      }

      const tokenData = await tokenResponse.json();
      const jwtToken = tokenData.access_token;

      // Step 2: Validate user credentials (mock for now - would use proper user endpoint)
      const user: User = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
        permissions: ['cattle:read', 'cattle:write', 'transactions:read', 'dashboard:read']
      };

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