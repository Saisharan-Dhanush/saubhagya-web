/**
 * Authentication Service
 * Manages user authentication state and role-based access control
 */

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: 'BIOGAS_OPERATOR' | 'GAUSHALA_MANAGER' | 'FARMER' | 'ADMIN' | 'SUPER_ADMIN' | 'CLUSTER_OPERATOR' | 'CLUSTER_MANAGER' | 'BIOGAS_SANGH' | 'field_worker';
  gaushalaId?: number; // Only for GAUSHALA_MANAGER/FARMER
  clusterId?: number; // Only for BIOGAS_OPERATOR
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

class AuthService {
  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'token';

  /**
   * Get current logged-in user
   */
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Get JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Save user and token after login
   */
  setUser(user: User, token: string): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  }

  /**
   * Clear user data (logout)
   */
  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser() as any;
    // Check both role field and roles array
    return user?.role === role || user?.roles?.includes(role);
  }

  /**
   * Check if user has any of the given roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser() as any;
    // Check both role field and roles array
    return roles.some(role => user?.role === role || user?.roles?.includes(role));
  }

  /**
   * Check if user is BIOGAS_OPERATOR
   */
  isBiogasOperator(): boolean {
    return this.hasAnyRole(['BIOGAS_OPERATOR', 'CLUSTER_OPERATOR', 'CLUSTER_MANAGER', 'BIOGAS_SANGH', 'SUPER_ADMIN', 'ADMIN']);
  }

  /**
   * Check if user is GAUSHALA_MANAGER or FARMER
   */
  isGaushalaManager(): boolean {
    return this.hasAnyRole(['GAUSHALA_MANAGER', 'FARMER']);
  }

  /**
   * Check if user is ADMIN
   */
  isAdmin(): boolean {
    return this.hasAnyRole(['ADMIN', 'SUPER_ADMIN']);
  }

  /**
   * Decode JWT token payload
   * Returns the decoded payload or null if invalid
   */
  private decodeJWT(token: string): any {
    try {
      // JWT has 3 parts: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT format: expected 3 parts, got', parts.length);
        return null;
      }

      // Decode the payload (base64url)
      const payload = parts[1];

      // Base64url decode: replace chars and add padding
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

      // Decode and parse JSON
      const decodedPayload = atob(paddedBase64);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }

  /**
   * Get decoded JWT token payload
   */
  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) {
      console.warn('No token found in localStorage');
      return null;
    }

    console.log('🔑 Raw JWT Token (first 50 chars):', token?.substring(0, 50) + '...');
    const decoded = this.decodeJWT(token);
    console.log('🔓 Decoded JWT Token Payload:', JSON.stringify(decoded, null, 2));
    return decoded;
  }

  /**
   * Get user's gaushala ID (only for gaushala managers/farmers)
   * Tries multiple approaches:
   * 1. From user object in localStorage
   * 2. From JWT token payload
   */
  getUserGaushalaId(): number | undefined {
    console.log('=== getUserGaushalaId() DEBUGGING ===');

    // APPROACH 1: Try user object first
    const user = this.getCurrentUser();
    console.log('Approach 1 - User object:', user);

    if (user?.gaushalaId) {
      console.log('✅ Found gaushalaId in user object:', user.gaushalaId);
      return user.gaushalaId;
    }

    // APPROACH 2: Try JWT token payload
    console.log('Approach 2 - Checking JWT token...');
    const tokenPayload = this.getDecodedToken();
    console.log('JWT token payload:', tokenPayload);

    if (!tokenPayload) {
      console.error('❌ No JWT token payload found');
      return undefined;
    }

    // Try various possible field names in JWT token
    const possibleFields = [
      'gaushalaId',
      'gId',
      'facilityId',
      'organizationId',
      'entityId',
      'assignedGaushalaId',
      'gaushala_id',
      'gaushala',
      'facility_id'
    ];

    console.log('Checking JWT token for gaushalaId in fields:', possibleFields);

    for (const field of possibleFields) {
      if (tokenPayload[field] !== undefined && tokenPayload[field] !== null) {
        console.log(`✅ Found gaushalaId in JWT token.${field}:`, tokenPayload[field]);

        // Handle different data types
        if (typeof tokenPayload[field] === 'number') {
          return tokenPayload[field];
        } else if (typeof tokenPayload[field] === 'string') {
          const parsed = parseInt(tokenPayload[field], 10);
          if (!isNaN(parsed)) {
            return parsed;
          }
        } else if (typeof tokenPayload[field] === 'object' && tokenPayload[field]?.id) {
          // Handle nested object like { id: 123 }
          return tokenPayload[field].id;
        }
      }
    }

    console.error('❌ No gaushalaId found in user object or JWT token');
    console.log('Available JWT token fields:', Object.keys(tokenPayload));
    return undefined;
  }

  /**
   * Get user's cluster ID (only for biogas operators)
   * Tries multiple approaches:
   * 1. From user object in localStorage
   * 2. From JWT token payload
   */
  getUserClusterId(): number | undefined {
    console.log('=== getUserClusterId() DEBUGGING ===');

    // APPROACH 1: Try user object first
    const user = this.getCurrentUser();
    console.log('Approach 1 - User object:', user);

    if (user?.clusterId) {
      console.log('✅ Found clusterId in user object:', user.clusterId);
      return user.clusterId;
    }

    // APPROACH 2: Try JWT token payload
    console.log('Approach 2 - Checking JWT token...');
    const tokenPayload = this.getDecodedToken();
    console.log('JWT token payload:', tokenPayload);

    if (!tokenPayload) {
      console.error('❌ No JWT token payload found');
      return undefined;
    }

    // Try various possible field names in JWT token
    const possibleFields = [
      'clusterId',
      'cId',
      'clusterEntityId',
      'cluster_id',
      'cluster',
      'biogas_cluster_id',
      'biogasClusterId'
    ];

    console.log('Checking JWT token for clusterId in fields:', possibleFields);

    for (const field of possibleFields) {
      if (tokenPayload[field] !== undefined && tokenPayload[field] !== null) {
        console.log(`✅ Found clusterId in JWT token.${field}:`, tokenPayload[field]);

        // Handle different data types
        if (typeof tokenPayload[field] === 'number') {
          return tokenPayload[field];
        } else if (typeof tokenPayload[field] === 'string') {
          const parsed = parseInt(tokenPayload[field], 10);
          if (!isNaN(parsed)) {
            return parsed;
          }
        } else if (typeof tokenPayload[field] === 'object' && tokenPayload[field]?.id) {
          // Handle nested object like { id: 123 }
          return tokenPayload[field].id;
        }
      }
    }

    console.error('❌ No clusterId found in user object or JWT token');
    console.log('Available JWT token fields:', Object.keys(tokenPayload));
    return undefined;
  }

  /**
   * Get user's display name
   */
  getUserName(): string {
    const user = this.getCurrentUser();
    return user?.name || 'Unknown User';
  }

  /**
   * Get user's role display name
   */
  getRoleDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return 'Unknown';

    const roleNames: Record<string, string> = {
      'BIOGAS_OPERATOR': 'Biogas Operator',
      'GAUSHALA_MANAGER': 'Gaushala Manager',
      'FARMER': 'Farmer',
      'ADMIN': 'Administrator',
      'SUPER_ADMIN': 'Super Administrator',
      'CLUSTER_OPERATOR': 'Cluster Operator',
      'CLUSTER_MANAGER': 'Cluster Manager',
      'BIOGAS_SANGH': 'Biogas Sangh',
      'field_worker': 'Field Worker'
    };

    return roleNames[user.role] || user.role;
  }

  /**
   * Check if user can create transactions
   */
  canCreateTransactions(): boolean {
    return this.isBiogasOperator();
  }

  /**
   * Check if user can edit transactions
   */
  canEditTransactions(): boolean {
    return this.isBiogasOperator();
  }

  /**
   * Check if user can delete transactions
   */
  canDeleteTransactions(): boolean {
    return this.isBiogasOperator();
  }

  /**
   * Check if user can only view their own transactions
   */
  canViewOnlyOwnTransactions(): boolean {
    return this.isGaushalaManager();
  }

  /**
   * Check if user can view all transactions
   */
  canViewAllTransactions(): boolean {
    return this.isBiogasOperator() || this.isAdmin();
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export default
export default authService;
