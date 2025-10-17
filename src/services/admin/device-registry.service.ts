import { microservicesClient } from '../microservices';

/**
 * Device Registry Service - IoT Device Management
 * Connects to IoT Service Device endpoints
 */

export type DeviceType = 'WEIGHING_SCALE' | 'FLOW_METER' | 'CH4_SENSOR' | 'H2S_SENSOR' | 'RFID_READER' | 'GPS_TRACKER';
export type DeviceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'OFFLINE';

export interface Device {
  id: number;
  deviceId: string;
  deviceType: DeviceType;
  serialNumber: string;
  status: DeviceStatus;
  firmwareVersion: string;
  trustScore: number;
  lastCalibration: string;
  nextCalibration: string;
  clusterId: number;
  location: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceHealthSummary {
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  maintenanceDevices: number;
  faultyDevices: number;
  offlineDevices: number;
  averageTrustScore: number;
  lowTrustDevices: number;
  devicesNeedingCalibration: number;
  healthPercentage: number;
  recentReadings24h: number;
}

export interface DeviceReading {
  id: number;
  deviceId: string;
  timestamp: string;
  value: number;
  unit: string;
  quality: string;
}

export interface DeviceAlert {
  id: number;
  deviceId: string;
  alertType: string;
  severity: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface DeviceCalibration {
  id: number;
  deviceId: string;
  calibrationDate: string;
  calibratedBy: string;
  calibrationResult: string;
  nextCalibrationDue: string;
}

export interface PaginatedDevicesResponse {
  content: Device[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

class DeviceRegistryService {
  private readonly SERVICE_NAME = 'iot-service';

  /**
   * Get all devices with pagination and filters
   * GET /api/v1/devices
   */
  async getDevices(
    page: number = 0,
    size: number = 20,
    clusterId?: number,
    deviceType?: DeviceType,
    status?: DeviceStatus
  ): Promise<PaginatedDevicesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (clusterId) params.append('clusterId', clusterId.toString());
      if (deviceType) params.append('deviceType', deviceType);
      if (status) params.append('status', status);

      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/v1/devices?${params.toString()}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch devices');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch devices'
      );
    }
  }

  /**
   * Get device health summary
   * GET /api/v1/devices/health/summary
   */
  async getDeviceHealthSummary(): Promise<DeviceHealthSummary> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/api/v1/devices/health/summary',
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch device health summary');
      }

      const data = await response.json();

      // Transform snake_case backend response to camelCase frontend
      return {
        totalDevices: data.total_devices || 0,
        activeDevices: data.active_devices || 0,
        inactiveDevices: data.inactive_devices || 0,
        maintenanceDevices: data.maintenance_devices || 0,
        faultyDevices: data.faulty_devices || 0,
        offlineDevices: (data.inactive_devices || 0) + (data.faulty_devices || 0), // Calculate offline
        averageTrustScore: data.average_trust_score || 0,
        lowTrustDevices: data.low_trust_devices || 0,
        devicesNeedingCalibration: data.low_trust_devices || 0, // Use low_trust as proxy
        healthPercentage: data.health_percentage || 0,
        recentReadings24h: data.recent_readings_24h || 0
      };
    } catch (error) {
      console.error('Failed to fetch device health summary:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch device health summary'
      );
    }
  }

  /**
   * Get offline devices
   * GET /api/v1/devices/health/offline
   */
  async getOfflineDevices(): Promise<Device[]> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/api/v1/devices/health/offline',
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch offline devices');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch offline devices:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch offline devices'
      );
    }
  }

  /**
   * Get device by ID
   * GET /api/v1/devices/{id}
   */
  async getDeviceById(id: number): Promise<Device> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/v1/devices/${id}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch device');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch device:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch device'
      );
    }
  }

  /**
   * Update device status
   * PUT /api/v1/devices/{id}/status
   */
  async updateDeviceStatus(id: number, status: DeviceStatus): Promise<Device> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/v1/devices/${id}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update device status');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update device status:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update device status'
      );
    }
  }

  /**
   * Get device calibration history
   * GET /api/v1/devices/{id}/calibrations
   */
  async getDeviceCalibrations(id: number): Promise<DeviceCalibration[]> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/v1/devices/${id}/calibrations`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch calibrations');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch calibrations:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch calibrations'
      );
    }
  }

  /**
   * Get device alerts
   * GET /api/v1/devices/{id}/alerts
   */
  async getDeviceAlerts(id: number): Promise<DeviceAlert[]> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/v1/devices/${id}/alerts`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch alerts');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch alerts'
      );
    }
  }

  /**
   * Get latest device readings
   * GET /api/v1/devices/{id}/readings/latest
   */
  async getLatestReading(id: number): Promise<DeviceReading> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/v1/devices/${id}/readings/latest`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch latest reading');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch latest reading:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch latest reading'
      );
    }
  }

  /**
   * Create a new device
   * POST /api/v1/devices
   */
  async createDevice(deviceData: Partial<Device>): Promise<Device> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        '/api/v1/devices',
        {
          method: 'POST',
          body: JSON.stringify(deviceData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create device');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create device:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create device'
      );
    }
  }

  /**
   * Update an existing device
   * PUT /api/v1/devices/{id}
   */
  async updateDevice(id: number, deviceData: Partial<Device>): Promise<Device> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/v1/devices/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(deviceData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update device');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update device:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update device'
      );
    }
  }

  /**
   * Delete a device
   * DELETE /api/v1/devices/{id}
   */
  async deleteDevice(id: number): Promise<void> {
    try {
      const response = await microservicesClient.callService(
        this.SERVICE_NAME,
        `/api/v1/devices/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete device');
      }
    } catch (error) {
      console.error('Failed to delete device:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to delete device'
      );
    }
  }
}

export const deviceRegistryService = new DeviceRegistryService();
