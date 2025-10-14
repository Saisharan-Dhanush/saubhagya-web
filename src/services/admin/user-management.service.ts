import { microservicesClient } from '../microservices';

/**
 * User Management Service - Admin CRUD operations
 * Connects to Auth Service User Management endpoints
 */

export interface UserProfile {
  id: string;
  externalId: string;
  phone: string;
  name: string;
  email?: string;
  locale: string;
  kycStatus: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  roles: string[];
  permissions: string[];
  governmentAccess: string[];
}

export interface PaginatedUsersResponse {
  users: UserProfile[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateUserRequest {
  phone: string;
  name: string;
  password: string;
  locale?: string;
  userType: string;
}

export interface UpdateUserRequest {
  name: string;
  locale: string;
}

export interface UpdatePermissionsRequest {
  roles: string[];
  permissions: string[];
}

class UserManagementService {
  private readonly SERVICE_NAME = 'auth-service';

  /**
   * Get all users with pagination and search
   * GET /api/auth/users
   */
  async getUsers(
    page: number = 0,
    size: number = 20,
    search?: string,
    sortBy: string = 'createdAt',
    sortDir: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedUsersResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir,
      });

      if (search) {
        params.append('search', search);
      }

      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/auth/users?${params.toString()}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch users'
      );
    }
  }

  /**
   * Get user by ID
   * GET /api/auth/users/{id}
   */
  async getUserById(id: string): Promise<UserProfile> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/auth/users/${id}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch user'
      );
    }
  }

  /**
   * Create new user
   * POST /api/auth/users
   */
  async createUser(data: CreateUserRequest): Promise<UserProfile> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/api/auth/users',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create user'
      );
    }
  }

  /**
   * Update user
   * PUT /api/auth/users/{id}
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<UserProfile> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/auth/users/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update user'
      );
    }
  }

  /**
   * Delete user (soft delete)
   * DELETE /api/auth/users/{id}
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/auth/users/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to delete user'
      );
    }
  }

  /**
   * Toggle user active status
   * PUT /api/auth/users/{id}/toggle-status
   */
  async toggleUserStatus(id: string): Promise<{ isActive: boolean }> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/auth/users/${id}/toggle-status`,
        { method: 'PUT' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle user status');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to toggle user status'
      );
    }
  }

  /**
   * Update user roles and permissions
   * PUT /api/auth/users/{id}/permissions
   */
  async updateUserPermissions(
    id: string,
    data: UpdatePermissionsRequest
  ): Promise<UserProfile> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/auth/users/${id}/permissions`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update permissions');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update permissions:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update permissions'
      );
    }
  }
}

export const userManagementService = new UserManagementService();
