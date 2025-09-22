/**
 * Real-time Monitoring Page - SAUB-FE-003
 * Live sensor monitoring with alerts and system controls
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  Gauge,
  Thermometer,
  Wind,
  Droplets,
  FlaskConical,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Square,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3
} from 'lucide-react';
import { PurificationMetrics, SystemAlert, PurificationUnit } from '../../Purification.types';
import { MockSensorService } from '../../services/mockSensor.service';
import { DEFAULT_QUALITY_THRESHOLDS, REFRESH_INTERVALS } from '../../Purification.config';

interface SensorDisplay {
  id: string;
  name: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  min: number;
  max: number;
  optimal: number;
  critical?: {
    min?: number;
    max?: number;
  };
}

export const RealTimeMonitoring: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<PurificationMetrics[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<SystemAlert[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('unit-1');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [historicalData, setHistoricalData] = useState<{[key: string]: PurificationMetrics[]}>({});

  const mockSensorService = useRef(new MockSensorService());

  const sensorDisplays: SensorDisplay[] = [
    {
      id: 'ch4Percentage',
      name: 'CH₄ Purity',
      unit: '%',
      icon: <Gauge className="w-6 h-6" />,
      color: 'text-green-600',
      min: 85,
      max: 98,
      optimal: 95,
      critical: { min: 90 }
    },
    {
      id: 'pressure',
      name: 'Pressure',
      unit: 'bar',
      icon: <Wind className="w-6 h-6" />,
      color: 'text-blue-600',
      min: 1.5,
      max: 3.0,
      optimal: 2.1,
      critical: { max: 2.5 }
    },
    {
      id: 'temperature',
      name: 'Temperature',
      unit: '°C',
      icon: <Thermometer className="w-6 h-6" />,
      color: 'text-orange-600',
      min: 25,
      max: 50,
      optimal: 37,
      critical: { max: 45 }
    },
    {
      id: 'flowRate',
      name: 'Flow Rate',
      unit: 'm³/h',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-purple-600',
      min: 50,
      max: 200,
      optimal: 125
    },
    {
      id: 'h2sLevel',
      name: 'H₂S Level',
      unit: 'ppm',
      icon: <FlaskConical className="w-6 h-6" />,
      color: 'text-red-600',
      min: 0,
      max: 30,
      optimal: 10,
      critical: { max: 20 }
    },
    {
      id: 'co2Level',
      name: 'CO₂ Level',
      unit: '%',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-yellow-600',
      min: 0,
      max: 8,
      optimal: 2.5,
      critical: { max: 5 }
    },
    {
      id: 'moisture',
      name: 'Moisture',
      unit: '%',
      icon: <Droplets className="w-6 h-6" />,
      color: 'text-cyan-600',
      min: 0,
      max: 2,
      optimal: 0.5,
      critical: { max: 1 }
    }
  ];

  useEffect(() => {
    if (isMonitoring && autoRefresh) {
      mockSensorService.current.startRealtimeUpdates((metrics, alerts) => {
        setCurrentMetrics(metrics);

        if (alertsEnabled) {
          setActiveAlerts(prev => [...prev, ...alerts].slice(-10)); // Keep last 10 alerts
        }

        // Store historical data
        setHistoricalData(prev => {
          const updated = { ...prev };
          metrics.forEach(metric => {
            if (!updated[metric.unitId]) {
              updated[metric.unitId] = [];
            }
            updated[metric.unitId].push(metric);
            // Keep last 50 data points per unit
            if (updated[metric.unitId].length > 50) {
              updated[metric.unitId] = updated[metric.unitId].slice(-50);
            }
          });
          return updated;
        });
      });
    } else {
      mockSensorService.current.stopRealtimeUpdates();
    }

    return () => {
      mockSensorService.current.stopRealtimeUpdates();
    };
  }, [isMonitoring, autoRefresh, alertsEnabled]);

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    // Initialize with current metrics
    const initialMetrics = mockSensorService.current.getCurrentMetrics();
    setCurrentMetrics(initialMetrics);
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    mockSensorService.current.stopRealtimeUpdates();
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    mockSensorService.current.acknowledgeAlert(alertId, 'CURRENT_USER');
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getSelectedUnitMetrics = (): PurificationMetrics | null => {
    return currentMetrics.find(m => m.unitId === selectedUnit) || null;
  };

  const getSensorValue = (metrics: PurificationMetrics | null, sensorId: string): number => {
    if (!metrics) return 0;
    return (metrics as any)[sensorId] || 0;
  };

  const getSensorStatus = (value: number, sensor: SensorDisplay): 'normal' | 'warning' | 'critical' => {
    if (sensor.critical) {
      if ((sensor.critical.min && value < sensor.critical.min) ||
          (sensor.critical.max && value > sensor.critical.max)) {
        return 'critical';
      }
    }

    const tolerance = (sensor.max - sensor.min) * 0.1; // 10% tolerance
    if (value < sensor.min + tolerance || value > sensor.max - tolerance) {
      return 'warning';
    }

    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrend = (unitId: string, sensorId: string): 'up' | 'down' | 'stable' => {
    const history = historicalData[unitId];
    if (!history || history.length < 2) return 'stable';

    const recent = history.slice(-2);
    const current = (recent[1] as any)[sensorId];
    const previous = (recent[0] as any)[sensorId];

    const diff = current - previous;
    if (Math.abs(diff) < 0.1) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const selectedMetrics = getSelectedUnitMetrics();
  const unitsStatus = mockSensorService.current.getUnitsStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-time Monitoring</h1>
          <p className="text-gray-600 mt-1">Live sensor data and system monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={alertsEnabled ? 'text-green-600' : 'text-gray-600'}
          >
            <Bell className="w-4 h-4 mr-2" />
            {alertsEnabled ? 'Alerts On' : 'Alerts Off'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'text-blue-600' : 'text-gray-600'}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {autoRefresh ? 'Auto Refresh' : 'Manual'}
          </Button>
          {!isMonitoring ? (
            <Button onClick={handleStartMonitoring} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Monitoring
            </Button>
          ) : (
            <Button onClick={handleStopMonitoring} variant="outline" className="text-red-600">
              <Square className="w-4 h-4 mr-2" />
              Stop Monitoring
            </Button>
          )}
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {unitsStatus.map((unit) => {
          const metrics = currentMetrics.find(m => m.unitId === unit.id);
          const isSelected = selectedUnit === unit.id;

          return (
            <Card
              key={unit.id}
              className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
              onClick={() => setSelectedUnit(unit.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{unit.name}</h3>
                  <Badge className={getStatusColor(unit.status)}>
                    {unit.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">CH₄:</span>
                    <span className="font-medium">{metrics?.ch4Percentage?.toFixed(1) || '--'}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Load:</span>
                    <span className="font-medium">{unit.currentLoad}/{unit.capacity} m³/h</span>
                  </div>
                  <Progress value={(unit.currentLoad / unit.capacity) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between">
              <span>
                <strong>{activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}</strong>
                {activeAlerts.length > 0 && ` - Latest: ${activeAlerts[activeAlerts.length - 1].message}`}
              </span>
              <Button size="sm" variant="outline" className="text-yellow-800 border-yellow-300">
                View All
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="sensors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sensors">Live Sensors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="controls">System Controls</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-6">
          {/* Monitoring Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${isMonitoring ? 'text-green-600' : 'text-gray-600'}`}>
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="font-medium">
                  {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
                </span>
              </div>
              {isMonitoring && (
                <span className="text-sm text-gray-600">
                  Last update: {new Date().toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
            </div>
          </div>

          {/* Selected Unit Details */}
          {selectedMetrics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Unit {selectedUnit.split('-')[1]} - Live Sensor Data</span>
                  <Badge className={getStatusColor(selectedMetrics.status)}>
                    {selectedMetrics.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time readings from all sensors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                  {sensorDisplays.map((sensor) => {
                    const value = getSensorValue(selectedMetrics, sensor.id);
                    const status = getSensorStatus(value, sensor);
                    const trend = getTrend(selectedUnit, sensor.id);
                    const percentage = ((value - sensor.min) / (sensor.max - sensor.min)) * 100;

                    return (
                      <Card key={sensor.id} className={viewMode === 'list' ? 'p-2' : ''}>
                        <CardContent className={`${viewMode === 'list' ? 'p-4' : 'p-6'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className={sensor.color}>
                                {sensor.icon}
                              </div>
                              <span className="font-medium text-sm">{sensor.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getTrendIcon(trend)}
                              <Badge className={`text-xs ${getStatusColor(status)}`}>
                                {status}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">{value.toFixed(1)}</span>
                              <span className="text-sm text-gray-600">{sensor.unit}</span>
                            </div>

                            <Progress
                              value={Math.max(0, Math.min(100, percentage))}
                              className="h-2"
                            />

                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{sensor.min}</span>
                              <span className="font-medium">Target: {sensor.optimal}</span>
                              <span>{sensor.max}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Units Summary */}
          {!selectedMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Select a Unit to View Detailed Sensor Data</CardTitle>
                <CardDescription>
                  Click on any unit above to see real-time sensor readings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Choose a purification unit to monitor its sensors</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>System Alerts</span>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
              <CardDescription>
                Active and recent system alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active alerts - system running normally</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.slice().reverse().map((alert) => (
                    <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="font-medium">{alert.type.toUpperCase()}</span>
                          <Badge variant="outline">
                            {alert.source}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      {alert.actions.length > 0 && (
                        <div className="text-xs">
                          <strong>Recommended actions:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {alert.actions.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Monitoring Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoRefresh">Auto Refresh</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={autoRefresh ? 'bg-green-100' : ''}
                  >
                    {autoRefresh ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="alertsEnabled">Alert Notifications</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAlertsEnabled(!alertsEnabled)}
                    className={alertsEnabled ? 'bg-green-100' : ''}
                  >
                    {alertsEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Refresh Interval</Label>
                  <span className="text-sm font-medium">2 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Data Retention</Label>
                  <span className="text-sm font-medium">50 readings per unit</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  System Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset All Sensors
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Calibrate Sensors
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Stop
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Unit Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Unit-Specific Controls</CardTitle>
              <CardDescription>
                Control individual purification units
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {unitsStatus.map((unit) => (
                  <div key={unit.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{unit.name}</h4>
                      <Badge className={getStatusColor(unit.status)}>
                        {unit.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        Start Maintenance
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Reset Alarms
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        View Logs
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Historical Trends
              </CardTitle>
              <CardDescription>
                Sensor data trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(historicalData).length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Start monitoring to see historical trends</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(historicalData).map(([unitId, data]) => {
                    if (data.length < 2) return null;

                    const latest = data[data.length - 1];
                    const previous = data[data.length - 2];

                    return (
                      <div key={unitId} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">Unit {unitId.split('-')[1]} Trends</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {sensorDisplays.slice(0, 4).map((sensor) => {
                            const currentVal = (latest as any)[sensor.id];
                            const prevVal = (previous as any)[sensor.id];
                            const change = currentVal - prevVal;
                            const changePercent = (change / prevVal) * 100;

                            return (
                              <div key={sensor.id} className="text-center">
                                <div className="flex items-center justify-center space-x-1 mb-1">
                                  <span className="text-sm font-medium">{sensor.name}</span>
                                  {Math.abs(changePercent) > 1 && getTrendIcon(change > 0 ? 'up' : 'down')}
                                </div>
                                <div className="text-lg font-bold">{currentVal.toFixed(1)}</div>
                                <div className={`text-xs ${Math.abs(changePercent) > 1 ? (change > 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-500'}`}>
                                  {change > 0 ? '+' : ''}{change.toFixed(1)} ({changePercent.toFixed(1)}%)
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};