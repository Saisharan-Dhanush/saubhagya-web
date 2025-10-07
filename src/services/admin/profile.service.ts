/**
 * Profile Service - Real Auth Service Integration
 *
 * This service connects to the Auth Service (localhost:8081) for user profile management.
 * ZERO mock data - only real API calls.
 */

import { microservicesClient } from '@/services/microservices';
import { logger } from '@/utils/logger';

/**
 * User Profile Interface - matches Auth Service response
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

/**
 * Update Profile Request - only name and locale can be updated
 */
export interface UpdateProfileRequest {
  name: string;
  locale: string;
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * ProfileService Class - Handles all profile-related API calls
 */
class ProfileService {
  private readonly SERVICE_NAME = 'auth-service';

  /**
   * Get current user profile from Auth Service
   * Endpoint: GET /auth/api/auth/profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/auth/api/auth/profile',
        {
          method: 'GET'
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch profile: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.error('ProfileService.getProfile error:', error);
      throw new Error(
        error instanceof Error
          ? `Unable to fetch profile: ${error.message}`
          : 'Unable to fetch profile. Please check your connection.'
      );
    }
  }

  /**
   * Update user profile (name and locale only)
   * Endpoint: PUT /auth/api/auth/profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/auth/api/auth/profile',
        {
          method: 'PUT',
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
      }

      const updatedProfile = await response.json();
      return updatedProfile;
    } catch (error) {
      logger.error('ProfileService.updateProfile error:', error);
      throw new Error(
        error instanceof Error
          ? `Unable to update profile: ${error.message}`
          : 'Unable to update profile. Please try again.'
      );
    }
  }

  /**
   * Logout user - invalidate session
   * Endpoint: POST /auth/api/auth/logout
   */
  async logout(): Promise<void> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/auth/api/auth/logout',
        {
          method: 'POST'
        }
      );

      // Even if the server logout fails, we should still clear local tokens
      if (!response.ok) {
        logger.warn('Server logout returned non-OK status:', response.status);
      }

      // Clear all authentication tokens from localStorage
      localStorage.removeItem('saubhagya_jwt_token');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionStart');

    } catch (error) {
      logger.error('ProfileService.logout error:', error);
      // Still clear local storage even if server request fails
      localStorage.removeItem('saubhagya_jwt_token');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionStart');

      throw new Error(
        error instanceof Error
          ? `Logout completed locally, but server error: ${error.message}`
          : 'Logout completed locally.'
      );
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService();
export default profileService;
