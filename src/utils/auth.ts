/**
 * Authentication Utilities
 * Handles JWT token parsing and user context extraction
 */

// JWT token storage key
const TOKEN_STORAGE_KEY = 'saubhagya_jwt_token';

/**
 * JWT Token Payload interface based on backend token structure
 * Reference: Services/auth-service JWT implementation
 */
interface JwtPayload {
  user_id: string;
  phone: string;
  name: string;
  roles: string[];
  permissions: string[];
  locale: string;
  kyc_status: string;
  government_access: string[];
  gaushalaId?: number;  // Optional: User's assigned gaushala
  sub: string;  // Subject (phone number)
  jti: string;  // JWT ID
  iat: number;  // Issued at
  exp: number;  // Expiration time
}

/**
 * User context extracted from JWT token
 */
export interface UserContext {
  userId: string;
  phone: string;
  name: string;
  roles: string[];
  permissions: string[];
  locale: string;
  kycStatus: string;
  gaushalaId: number | null;
  isAuthenticated: boolean;
}

/**
 * Parse JWT token and extract payload
 * @param token - JWT token string
 * @returns Decoded JWT payload or null if invalid
 */
export function parseJwtToken(token: string): JwtPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode base64 payload (middle part)
    const payload = parts[1];
    const decodedPayload = atob(payload);
    const parsedPayload: JwtPayload = JSON.parse(decodedPayload);

    // Validate token expiration
    const now = Math.floor(Date.now() / 1000);
    if (parsedPayload.exp && parsedPayload.exp < now) {
      console.warn('JWT token has expired');
      return null;
    }

    return parsedPayload;
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
}

/**
 * Get JWT token from localStorage
 * @returns JWT token string or null if not found
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to retrieve token from localStorage:', error);
    return null;
  }
}

/**
 * Get current user context from stored JWT token
 * @returns UserContext with user details or default unauthenticated context
 */
export function getCurrentUserContext(): UserContext {
  const token = getStoredToken();

  if (!token) {
    return {
      userId: '',
      phone: '',
      name: '',
      roles: [],
      permissions: [],
      locale: 'en',
      kycStatus: 'PENDING',
      gaushalaId: null,
      isAuthenticated: false,
    };
  }

  const payload = parseJwtToken(token);

  if (!payload) {
    return {
      userId: '',
      phone: '',
      name: '',
      roles: [],
      permissions: [],
      locale: 'en',
      kycStatus: 'PENDING',
      gaushalaId: null,
      isAuthenticated: false,
    };
  }

  return {
    userId: payload.user_id,
    phone: payload.phone,
    name: payload.name,
    roles: payload.roles || [],
    permissions: payload.permissions || [],
    locale: payload.locale || 'en',
    kycStatus: payload.kyc_status || 'PENDING',
    gaushalaId: payload.gaushalaId || null,
    isAuthenticated: true,
  };
}

/**
 * Get logged-in user's gaushalaId
 * @returns Gaushala ID or null if not assigned
 */
export function getLoggedInUserGaushalaId(): number | null {
  const userContext = getCurrentUserContext();
  return userContext.gaushalaId;
}

/**
 * Check if user has specific permission
 * @param permission - Permission string (e.g., 'iot:read', 'transaction:write')
 * @returns True if user has the permission
 */
export function hasPermission(permission: string): boolean {
  const userContext = getCurrentUserContext();
  return userContext.permissions.includes(permission);
}

/**
 * Check if user has specific role
 * @param role - Role string (e.g., 'FARMER', 'ADMIN', 'OPERATOR')
 * @returns True if user has the role
 */
export function hasRole(role: string): boolean {
  const userContext = getCurrentUserContext();
  return userContext.roles.includes(role);
}

/**
 * Check if JWT token is expired
 * @returns True if token is expired or invalid
 */
export function isTokenExpired(): boolean {
  const token = getStoredToken();
  if (!token) return true;

  const payload = parseJwtToken(token);
  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Clear stored authentication token (logout)
 */
export function clearAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth token:', error);
  }
}

/**
 * Store JWT token in localStorage
 * @param token - JWT token string
 */
export function storeAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
}
