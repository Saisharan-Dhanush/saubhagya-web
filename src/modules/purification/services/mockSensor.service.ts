/**
 * Mock Sensor Service for Real-time Data Simulation
 * SAUB-FE-003: Realistic sensor data with fluctuations
 */

import { PurificationMetrics, SystemAlert, PurificationUnit } from '../Purification.types';
import { SENSOR_MOCK_RANGES, DEFAULT_QUALITY_THRESHOLDS } from '../Purification.config';

export class MockSensorService {
  private baseMetrics: Record<string, PurificationMetrics> = {};
  private alertHistory: SystemAlert[] = [];
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.initializeBaseMetrics();
  }

  private initializeBaseMetrics() {
    // Initialize 3 purification units with different base values
    this.baseMetrics = {
      'unit-1': {
        ch4Percentage: 94.5,
        pressure: 2.1,
        temperature: 37.5,
        flowRate: 125,
        h2sLevel: 12,
        co2Level: 2.5,
        moisture: 0.5,
        timestamp: new Date(),
        unitId: 'unit-1',
        status: 'operational'
      },
      'unit-2': {
        ch4Percentage: 92.8,
        pressure: 2.0,
        temperature: 38.2,
        flowRate: 118,
        h2sLevel: 15,
        co2Level: 3.1,
        moisture: 0.7,
        timestamp: new Date(),
        unitId: 'unit-2',
        status: 'operational'
      },
      'unit-3': {
        ch4Percentage: 96.1,
        pressure: 2.3,
        temperature: 36.8,
        flowRate: 135,
        h2sLevel: 8,
        co2Level: 1.9,
        moisture: 0.4,
        timestamp: new Date(),
        unitId: 'unit-3',
        status: 'operational'
      }
    };
  }

  /**
   * Start real-time data generation
   */
  startRealtimeUpdates(callback: (metrics: PurificationMetrics[], alerts: SystemAlert[]) => void): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      const updatedMetrics = this.generateRealtimeMetrics();
      const newAlerts = this.checkForAlerts(updatedMetrics);
      callback(updatedMetrics, newAlerts);
    }, 2000); // Update every 2 seconds
  }

  /**
   * Stop real-time data generation
   */
  stopRealtimeUpdates(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isRunning = false;
  }

  /**
   * Generate realistic fluctuating sensor data
   */
  private generateRealtimeMetrics(): PurificationMetrics[] {
    const metrics: PurificationMetrics[] = [];

    Object.keys(this.baseMetrics).forEach(unitId => {
      const base = this.baseMetrics[unitId];
      const updated: PurificationMetrics = {
        ...base,
        ch4Percentage: this.fluctuate(base.ch4Percentage, 1.5, SENSOR_MOCK_RANGES.ch4Percentage),
        pressure: this.fluctuate(base.pressure, 0.15, SENSOR_MOCK_RANGES.pressure),
        temperature: this.fluctuate(base.temperature, 1.0, SENSOR_MOCK_RANGES.temperature),
        flowRate: this.fluctuate(base.flowRate, 8, SENSOR_MOCK_RANGES.flowRate),
        h2sLevel: this.fluctuate(base.h2sLevel, 2, SENSOR_MOCK_RANGES.h2sLevel),
        co2Level: this.fluctuate(base.co2Level, 0.3, SENSOR_MOCK_RANGES.co2Level),
        moisture: this.fluctuate(base.moisture, 0.1, SENSOR_MOCK_RANGES.moisture),
        timestamp: new Date(),
        unitId,
        status: this.determineUnitStatus(base)
      };

      // Update base metrics for next iteration
      this.baseMetrics[unitId] = updated;
      metrics.push(updated);
    });

    return metrics;
  }

  /**
   * Generate fluctuations within realistic ranges
   */
  private fluctuate(base: number, range: number, limits: { min: number; max: number }): number {
    const fluctuation = (Math.random() - 0.5) * range;
    const newValue = base + fluctuation;
    return Math.max(limits.min, Math.min(limits.max, newValue));
  }

  /**
   * Determine unit status based on current metrics
   */
  private determineUnitStatus(metrics: PurificationMetrics): 'operational' | 'maintenance' | 'offline' | 'alert' {
    const thresholds = DEFAULT_QUALITY_THRESHOLDS;

    // Check for critical conditions
    if (metrics.ch4Percentage < thresholds.ch4Min ||
        metrics.pressure > thresholds.pressureMax ||
        metrics.temperature > thresholds.temperatureMax) {
      return 'alert';
    }

    // Random maintenance simulation (5% chance)
    if (Math.random() < 0.05) {
      return 'maintenance';
    }

    return 'operational';
  }

  /**
   * Check for alert conditions and generate alerts
   */
  private checkForAlerts(metrics: PurificationMetrics[]): SystemAlert[] {
    const newAlerts: SystemAlert[] = [];
    const thresholds = DEFAULT_QUALITY_THRESHOLDS;

    metrics.forEach(metric => {
      // CH4 Percentage alerts
      if (metric.ch4Percentage < thresholds.ch4Min) {
        newAlerts.push(this.createAlert(
          'critical',
          metric.unitId,
          `CH₄ purity dropped to ${metric.ch4Percentage.toFixed(1)}% (Min: ${thresholds.ch4Min}%)`,
          ['Adjust purification parameters', 'Check filter status', 'Review feed quality']
        ));
      }

      // Pressure alerts
      if (metric.pressure > thresholds.pressureMax) {
        newAlerts.push(this.createAlert(
          'warning',
          metric.unitId,
          `High pressure detected: ${metric.pressure.toFixed(1)} bar (Max: ${thresholds.pressureMax} bar)`,
          ['Check pressure relief valves', 'Monitor flow rates', 'Inspect compressor']
        ));
      }

      // Temperature alerts
      if (metric.temperature > thresholds.temperatureMax) {
        newAlerts.push(this.createAlert(
          'warning',
          metric.unitId,
          `Temperature elevated: ${metric.temperature.toFixed(1)}°C (Max: ${thresholds.temperatureMax}°C)`,
          ['Check cooling system', 'Verify ambient conditions', 'Monitor process load']
        ));
      }

      // H2S alerts
      if (metric.h2sLevel > thresholds.h2sMax) {
        newAlerts.push(this.createAlert(
          'error',
          metric.unitId,
          `H₂S levels high: ${metric.h2sLevel.toFixed(1)} ppm (Max: ${thresholds.h2sMax} ppm)`,
          ['Check desulfurization unit', 'Replace activated carbon', 'Review feed composition']
        ));
      }
    });

    // Add random operational alerts (10% chance)
    if (Math.random() < 0.1) {
      newAlerts.push(this.createAlert(
        'info',
        'system',
        'Automated maintenance cycle completed successfully',
        ['Review maintenance report', 'Update maintenance logs']
      ));
    }

    // Store in alert history
    this.alertHistory.push(...newAlerts);

    // Keep only last 50 alerts
    if (this.alertHistory.length > 50) {
      this.alertHistory = this.alertHistory.slice(-50);
    }

    return newAlerts;
  }

  /**
   * Create a standardized alert object
   */
  private createAlert(
    type: 'warning' | 'error' | 'info' | 'critical',
    source: string,
    message: string,
    actions: string[]
  ): SystemAlert {
    const priority = type === 'critical' ? 'critical' :
                    type === 'error' ? 'high' :
                    type === 'warning' ? 'medium' : 'low';

    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      source,
      message,
      timestamp: new Date(),
      acknowledged: false,
      priority,
      actions
    };
  }

  /**
   * Get current metrics snapshot
   */
  getCurrentMetrics(): PurificationMetrics[] {
    return Object.values(this.baseMetrics);
  }

  /**
   * Get alert history
   */
  getAlertHistory(): SystemAlert[] {
    return [...this.alertHistory].reverse(); // Most recent first
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string, userId: string): boolean {
    const alert = this.alertHistory.find(a => a.id === alertId);
    if (alert && !alert.acknowledged) {
      alert.acknowledged = true;
      alert.acknowledgedBy = userId;
      return true;
    }
    return false;
  }

  /**
   * Simulate unit shutdown for maintenance
   */
  simulateUnitMaintenance(unitId: string, durationMinutes: number = 30): void {
    if (this.baseMetrics[unitId]) {
      this.baseMetrics[unitId].status = 'maintenance';

      // Automatically restore after duration
      setTimeout(() => {
        if (this.baseMetrics[unitId]) {
          this.baseMetrics[unitId].status = 'operational';
        }
      }, durationMinutes * 60 * 1000);
    }
  }

  /**
   * Get units with current status
   */
  getUnitsStatus(): PurificationUnit[] {
    return Object.values(this.baseMetrics).map(metric => ({
      id: metric.unitId,
      name: `Purification Unit ${metric.unitId.split('-')[1]}`,
      type: metric.unitId === 'unit-1' ? 'primary' : metric.unitId === 'unit-2' ? 'secondary' : 'polishing',
      capacity: metric.unitId === 'unit-1' ? 150 : metric.unitId === 'unit-2' ? 120 : 100,
      currentLoad: metric.flowRate,
      efficiency: (metric.ch4Percentage / 100) * 100,
      status: metric.status,
      lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      nextMaintenance: new Date(Date.now() + Math.random() * 15 * 24 * 60 * 60 * 1000),
      sensors: [metric],
      alerts: this.alertHistory.filter(alert => alert.source === metric.unitId),
      location: `Section ${metric.unitId.split('-')[1]}`,
      installationDate: new Date('2023-01-15'),
      manufacturer: 'ShuddhiTech Industries',
      model: `ST-${metric.unitId.toUpperCase()}-2024`
    }));
  }
}