import { microservicesClient } from '../microservices';

/**
 * Audit Service - Audit logs management
 * Connects to Reporting Service Audit endpoints
 */

export interface AuditLog {
  id: number;
  timestamp: string;
  module: string;
  action: string;
  username: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details: string;
  ipAddress: string;
  userAgent: string;
}

export interface AuditLogStatistics {
  total: number;
  byStatus: {
    [key: string]: number;
  };
  byModule: {
    [key: string]: number;
  };
}

export interface PaginatedAuditLogsResponse {
  logs: AuditLog[];
  statistics: AuditLogStatistics;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  timestamp: string;
}

export interface ExportAuditLogsRequest {
  module?: string;
  action?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

class AuditService {
  private readonly SERVICE_NAME = 'reporting-service';

  /**
   * Get audit logs with pagination and filtering
   * GET /audit/logs
   */
  async getAuditLogs(
    page: number = 0,
    size: number = 50,
    module?: string,
    action?: string,
    status?: string,
    search?: string,
    startDate?: string,
    endDate?: string,
    sortBy: string = 'timestamp',
    sortDir: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedAuditLogsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir,
      });

      if (module) params.append('module', module);
      if (action) params.append('action', action);
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/audit/logs?${params.toString()}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch audit logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch audit logs'
      );
    }
  }

  /**
   * Export audit logs to CSV
   * POST /audit/export
   */
  async exportAuditLogs(filters?: ExportAuditLogsRequest): Promise<{
    message: string;
    filename: string;
    size: number;
    timestamp: string;
  }> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/audit/export',
        {
          method: 'POST',
          body: filters ? JSON.stringify(filters) : undefined,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to export audit logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to export audit logs'
      );
    }
  }

  /**
   * Get audit log statistics by module
   * GET /audit/stats/by-module
   */
  async getStatsByModule(): Promise<{ [key: string]: number }> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/audit/stats/by-module',
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch module statistics');
      }

      const data = await response.json();
      return data.statistics;
    } catch (error) {
      console.error('Failed to fetch module statistics:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch module statistics'
      );
    }
  }

  /**
   * Get audit log statistics by action
   * GET /audit/stats/by-action
   */
  async getStatsByAction(): Promise<{ [key: string]: number }> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/audit/stats/by-action',
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch action statistics');
      }

      const data = await response.json();
      return data.statistics;
    } catch (error) {
      console.error('Failed to fetch action statistics:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch action statistics'
      );
    }
  }
}

export const auditService = new AuditService();
