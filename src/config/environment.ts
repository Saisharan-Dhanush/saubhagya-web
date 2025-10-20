/**
 * Environment Configuration for SAUBHAGYA Web Admin
 * Manages API endpoints and microservices connectivity
 */

// Environment Types
export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  name: Environment;
  apiBaseUrl: string;
  microservices: {
    auth: string;
    iot: string;
    transaction: string;
    sales: string;
    reporting: string;
    government: string;
  };
  features: {
    enableMockData: boolean;
    enableAnalytics: boolean;
    enableRealTimeUpdates: boolean;
  };
  oauth2: {
    clientId: string;
    clientSecret: string;
    scope: string;
  };
}

// Environment Configurations
const ENVIRONMENTS: Record<Environment, EnvironmentConfig> = {
  development: {
    name: 'development',
    apiBaseUrl: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081/auth-service', // Auth service as main gateway
    microservices: {
      auth: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081/auth-service',
      iot: import.meta.env.VITE_IOT_SERVICE_URL || 'http://localhost:8080/iot',
      transaction: import.meta.env.VITE_BIOGAS_SERVICE_URL || 'http://localhost:8082',
      sales: import.meta.env.VITE_COMMERCE_SERVICE_URL || 'http://localhost:8083',
      reporting: import.meta.env.VITE_REPORTING_SERVICE_URL || 'http://localhost:8084',
      government: import.meta.env.VITE_GOVERNMENT_SERVICE_URL || 'http://localhost:8085',
    },
    features: {
      enableMockData: false,
      enableAnalytics: true,
      enableRealTimeUpdates: true,
    },
    oauth2: {
      clientId: 'saubhagya-web',
      clientSecret: 'web-app-secret-2024',
      scope: 'iot-service commerce-service government-service reporting-service profile',
    },
  },
  staging: {
    name: 'staging',
    apiBaseUrl: 'https://staging-api.saubhagya.com',
    microservices: {
      auth: 'https://staging-auth.saubhagya.com',
      iot: 'https://staging-iot.saubhagya.com',
      transaction: 'https://staging-transaction.saubhagya.com',
      sales: 'https://staging-sales.saubhagya.com',
      reporting: 'https://staging-reporting.saubhagya.com',
      government: 'https://staging-government.saubhagya.com',
    },
    features: {
      enableMockData: false,
      enableAnalytics: true,
      enableRealTimeUpdates: true,
    },
    oauth2: {
      clientId: 'saubhagya-web-staging',
      clientSecret: import.meta.env.VITE_OAUTH2_CLIENT_SECRET || 'staging-secret',
      scope: 'iot-service commerce-service government-service reporting-service profile',
    },
  },
  production: {
    name: 'production',
    apiBaseUrl: 'https://api.saubhagya.com',
    microservices: {
      auth: 'https://auth.saubhagya.com',
      iot: 'https://iot.saubhagya.com',
      transaction: 'https://transaction.saubhagya.com',
      sales: 'https://sales.saubhagya.com',
      reporting: 'https://reporting.saubhagya.com',
      government: 'https://government.saubhagya.com',
    },
    features: {
      enableMockData: false,
      enableAnalytics: true,
      enableRealTimeUpdates: true,
    },
    oauth2: {
      clientId: 'saubhagya-web-prod',
      clientSecret: import.meta.env.VITE_OAUTH2_CLIENT_SECRET || '',
      scope: 'iot-service commerce-service government-service reporting-service profile',
    },
  },
};

// Get current environment
function getCurrentEnvironment(): Environment {
  const env = import.meta.env.VITE_ENVIRONMENT as Environment;
  return env || 'development';
}

// Get environment configuration
export function getEnvironmentConfig(): EnvironmentConfig {
  const currentEnv = getCurrentEnvironment();
  return ENVIRONMENTS[currentEnv];
}

// Environment variables with defaults
export const ENV = {
  ENVIRONMENT: getCurrentEnvironment(),
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || ENVIRONMENTS.development.apiBaseUrl,
  OAUTH2_CLIENT_ID: import.meta.env.VITE_OAUTH2_CLIENT_ID || ENVIRONMENTS.development.oauth2.clientId,
  OAUTH2_CLIENT_SECRET: import.meta.env.VITE_OAUTH2_CLIENT_SECRET || ENVIRONMENTS.development.oauth2.clientSecret,
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  ENABLE_REAL_TIME_UPDATES: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES !== 'false',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth Service Endpoints
  AUTH: {
    LOGIN: '/auth/api/v1/login',
    LOGOUT: '/auth/api/v1/logout',
    REGISTER: '/auth/api/v1/register',
    ME: '/auth/api/v1/me',
    REFRESH: '/auth/api/v1/refresh',
    OAUTH2_TOKEN: '/auth/oauth2/token',
    JWKS: '/auth/.well-known/jwks.json',
    CATTLE_LIST: '/auth/api/v1/cattle/list',
    CATTLE_STORE: '/auth/api/v1/cattle/store',
  },

  // IoT Service Endpoints
  IOT: {
    DEVICES: '/iot/api/v1/devices',
    RFID_TAGS: '/iot/api/v1/rfid-tags',
    SENSORS: '/iot/api/v1/sensors',
    DEVICE_STATUS: (deviceId: string) => `/iot/api/v1/devices/${deviceId}/status`,
  },

  // Transaction Service Endpoints
  TRANSACTION: {
    TRANSACTIONS: '/api/v1/transactions',
    CONTRIBUTIONS: '/api/v1/contributions',
    BIOGAS_PRODUCTION: '/api/v1/biogas-production',
    TRANSACTION_BY_ID: (id: string) => `/api/v1/transactions/${id}`,
  },

  // Sales Service Endpoints
  SALES: {
    SALES: '/api/commerce/sales',
    ORDERS: '/api/commerce/orders',
    CONTRIBUTIONS: '/api/commerce/contributions',
    ORDER_BY_ID: (id: string) => `/api/commerce/orders/${id}`,
  },

  // Reporting Service Endpoints
  REPORTING: {
    DASHBOARD: '/api/v1/dashboard',
    ANALYTICS: '/api/v1/analytics',
    REPORTS: '/api/v1/reports',
    ANALYTICS_BY_TYPE: (type: string) => `/api/v1/analytics/${type}`,
  },

  // Government Service Endpoints
  GOVERNMENT: {
    DASHBOARD: '/government/api/v1/dashboard',
    SCHEMES: '/government/api/v1/schemes',
    COMPLIANCE: '/government/api/v1/compliance',
    SCHEME_BY_ID: (id: string) => `/government/api/v1/schemes/${id}`,
  },

  // Health Check Endpoints
  HEALTH: {
    AUTH: '/auth/actuator/health',
    IOT: '/iot/actuator/health',
    TRANSACTION: '/actuator/health',
    SALES: '/actuator/health',
    REPORTING: '/actuator/health',
    GOVERNMENT: '/government/actuator/health',
  },
};

// Service URLs for direct access
export const SERVICE_URLS = {
  AUTH: getEnvironmentConfig().microservices.auth,
  IOT: getEnvironmentConfig().microservices.iot,
  TRANSACTION: getEnvironmentConfig().microservices.transaction,
  SALES: getEnvironmentConfig().microservices.sales,
  REPORTING: getEnvironmentConfig().microservices.reporting,
  GOVERNMENT: getEnvironmentConfig().microservices.government,
};

// Export current config
export const CONFIG = getEnvironmentConfig();

export default CONFIG;