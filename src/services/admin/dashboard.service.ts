import { microservicesClient } from '../microservices';

/**
 * Dashboard Service - System metrics and monitoring
 * Connects to Reporting Service System Metrics endpoints
 */

export interface SystemMetrics {
  memory: {
    heapUsed: number;
    heapMax: number;
    heapCommitted: number;
    heapUsagePercent: number;
    nonHeapUsed: number;
  };
  cpu: {
    availableProcessors: number;
    systemLoadAverage: number;
  };
  threads: {
    threadCount: number;
    peakThreadCount: number;
    daemonThreadCount: number;
  };
  jvm: {
    totalMemoryMB: number;
    freeMemoryMB: number;
    maxMemoryMB: number;
    usedMemoryMB: number;
  };
  uptime: {
    uptimeMs: number;
    uptimeSeconds: number;
    uptimeMinutes: number;
    uptimeHours: number;
  };
  timestamp: string;
}

export interface ServiceStatus {
  name: string;
  url: string;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  responseTime: number;
  error?: string;
}

export interface ServicesStatusResponse {
  services: ServiceStatus[];
  totalServices: number;
  upServices: number;
  downServices: number;
  timestamp: string;
}

export interface PerformanceData {
  memory: {
    heapUsagePercent: number;
    gcCount: number;
    gcTime: number;
  };
  threads: {
    activeThreads: number;
    peakThreads: number;
  };
  systemLoad: {
    loadAverage: number;
    availableProcessors: number;
  };
  timestamp: string;
}

class DashboardService {
  private readonly SERVICE_NAME = 'reporting-service';

  /**
   * Get system health metrics
   * GET /system/metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/system/metrics',
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch system metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch system metrics'
      );
    }
  }

  /**
   * Get microservices health status
   * GET /system/services
   */
  async getServicesStatus(): Promise<ServicesStatusResponse> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/system/services',
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch services status');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch services status:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch services status'
      );
    }
  }

  /**
   * Get performance data
   * GET /system/performance
   */
  async getPerformanceData(): Promise<PerformanceData> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/system/performance',
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch performance data');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch performance data'
      );
    }
  }
}

export const dashboardService = new DashboardService();
