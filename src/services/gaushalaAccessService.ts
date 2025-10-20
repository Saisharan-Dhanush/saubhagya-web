/**
 * Gaushala Access Service API Client
 * Connects to gaushala-service backend (port 8086)
 * All APIs require JWT authentication
 */

const GAUSHALA_SERVICE_URL = `${import.meta.env.VITE_GAUSHALA_SERVICE_URL || 'http://localhost:8086/gaushala-service'}/api/v1`;

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

/**
 * Gaushala Access Management Service
 */
export const gaushalaAccessService = {
  /**
   * Get all user-gaushala access records
   * GET /api/v1/admin/gaushala-access/all
   */
  async getAllUserGaushalaAccess(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/admin/gaushala-access/all`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('Failed to fetch user-gaushala access records:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch access records'
      };
    }
  },

  /**
   * Grant user access to gaushala
   * POST /api/v1/admin/gaushala-access/grant
   */
  async grantGaushalaAccess(userId: number, gaushalaId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/admin/gaushala-access/grant`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, gaushalaId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: data.message || 'Access granted successfully'
      };
    } catch (error) {
      console.error('Failed to grant gaushala access:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to grant access'
      };
    }
  },

  /**
   * Revoke user access to gaushala
   * DELETE /api/v1/admin/gaushala-access/revoke
   */
  async revokeGaushalaAccess(userId: number, gaushalaId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(
        `${GAUSHALA_SERVICE_URL}/admin/gaushala-access/revoke?userId=${userId}&gaushalaId=${gaushalaId}`,
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
        success: true,
        data: data,
        message: data.message || 'Access revoked successfully'
      };
    } catch (error) {
      console.error('Failed to revoke gaushala access:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to revoke access'
      };
    }
  },

  /**
   * Check if user has access to gaushala
   * GET /api/v1/admin/gaushala-access/check
   */
  async checkGaushalaAccess(userId: number, gaushalaId: number): Promise<ApiResponse<{ hasAccess: boolean }>> {
    try {
      const response = await fetch(
        `${GAUSHALA_SERVICE_URL}/admin/gaushala-access/check?userId=${userId}&gaushalaId=${gaushalaId}`,
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
      console.error('Failed to check gaushala access:', error);
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
   * Get gaushala details by ID
   * GET /api/v1/gaushalas/{id} (from gaushala service)
   */
  async getGaushalaById(gaushalaId: string | number): Promise<ApiResponse<any>> {
    try {
      // Note: Using the gaushala endpoint, not the admin endpoint
      const response = await fetch(`${GAUSHALA_SERVICE_URL}/gaushalas/${gaushalaId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
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
  }
};

export default gaushalaAccessService;
