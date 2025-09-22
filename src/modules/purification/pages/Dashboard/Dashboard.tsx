/**
 * Enhanced Purification Dashboard
 * SAUB-FE-003: Real-time metrics, gauge charts, active cycles
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  Gauge,
  Thermometer,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  Users,
  Package
} from 'lucide-react';

// Simplified Dashboard Component
const Dashboard: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for real-time metrics
  const [metrics, setMetrics] = useState({
    ch4Percentage: 94.5,
    pressure: 2.1,
    temperature: 37.5,
    flowRate: 125,
    h2sLevel: 12,
    co2Level: 2.5,
    moisture: 0.5,
    systemStatus: 'operational' as const
  });

  // Update metrics every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        ch4Percentage: prev.ch4Percentage + (Math.random() - 0.5) * 2,
        pressure: Math.max(1.8, Math.min(2.4, prev.pressure + (Math.random() - 0.5) * 0.2)),
        temperature: Math.max(35, Math.min(40, prev.temperature + (Math.random() - 0.5) * 1)),
        flowRate: Math.max(100, Math.min(150, prev.flowRate + (Math.random() - 0.5) * 10)),
        h2sLevel: Math.max(8, Math.min(16, prev.h2sLevel + (Math.random() - 0.5) * 2)),
        co2Level: Math.max(1.5, Math.min(3.5, prev.co2Level + (Math.random() - 0.5) * 0.5)),
        moisture: Math.max(0.3, Math.min(0.7, prev.moisture + (Math.random() - 0.5) * 0.1))
      }));
      setLastUpdated(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  // Simple gauge component
  const SimpleGauge: React.FC<{
    value: number;
    min: number;
    max: number;
    label: string;
    unit: string;
    color: string;
  }> = ({ value, min, max, label, unit, color }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const normalizedValue = Math.max(min, Math.min(max, value));

    return (
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-2">
          <div className={`w-20 h-20 rounded-full border-8 border-gray-200`}>
            <div
              className={`absolute inset-0 rounded-full border-8 border-transparent border-t-${color}-500`}
              style={{
                transform: `rotate(${(percentage / 100) * 180}deg)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            ></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-lg font-bold text-${color}-600`}>
                {normalizedValue.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">{unit}</div>
            </div>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
      </div>
    );
  };

  // Mock active cycles
  const activeCycles = [
    {
      id: 'cycle-001',
      batchId: 'BATCH-20241122-001',
      progress: 65,
      targetCH4: 95.0,
      status: 'running',
      remainingTime: 23
    },
    {
      id: 'cycle-002',
      batchId: 'BATCH-20241122-002',
      progress: 45,
      targetCH4: 96.5,
      status: 'running',
      remainingTime: 42
    },
    {
      id: 'cycle-003',
      batchId: 'BATCH-20241122-003',
      progress: 85,
      targetCH4: 94.0,
      status: 'running',
      remainingTime: 8
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purification Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring and control center</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right text-sm">
            <div className="text-gray-500">Last updated</div>
            <div className="font-medium">{lastUpdated.toLocaleTimeString()}</div>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Alert */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          System operating normally. Unit 2 scheduled for maintenance in 2 hours.
        </AlertDescription>
      </Alert>

      {/* Live Metrics Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>Live Metrics Overview</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              3 Units Active
            </Badge>
          </CardTitle>
          <CardDescription>Real-time sensor data from all purification units</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <SimpleGauge
              value={metrics.ch4Percentage}
              min={85}
              max={100}
              label="CH₄ Purity"
              unit="%"
              color="green"
            />
            <SimpleGauge
              value={metrics.pressure}
              min={1.5}
              max={3.0}
              label="Pressure"
              unit="bar"
              color="blue"
            />
            <SimpleGauge
              value={metrics.temperature}
              min={30}
              max={50}
              label="Temperature"
              unit="°C"
              color="orange"
            />
            <SimpleGauge
              value={metrics.flowRate}
              min={50}
              max={200}
              label="Flow Rate"
              unit="m³/h"
              color="purple"
            />
            <SimpleGauge
              value={metrics.moisture}
              min={0}
              max={2}
              label="Moisture"
              unit="%"
              color="cyan"
            />
          </div>
        </CardContent>
      </Card>

      {/* Secondary widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Enhanced Active Cycles Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Active Cycles</span>
              <Badge variant="secondary">{activeCycles.length} Running</Badge>
            </CardTitle>
            <CardDescription>Real-time cycle monitoring with performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCycles.map((cycle, index) => {
              const efficiency = 94 + (Math.random() * 6); // 94-100% efficiency
              const currentCH4 = cycle.targetCH4 - (100 - cycle.progress) * 0.1; // Gradual increase

              return (
                <div key={cycle.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{cycle.batchId}</h4>
                      <p className="text-sm text-gray-600">
                        Target: {cycle.targetCH4}% CH₄ • Current: {currentCH4.toFixed(1)}%
                      </p>
                      <p className="text-xs text-blue-600">
                        Unit {index + 1} • Efficiency: {efficiency.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="mb-1">
                        {cycle.status}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {cycle.remainingTime} min left
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cycle Progress</span>
                      <span>{cycle.progress}% complete</span>
                    </div>
                    <Progress value={cycle.progress} className="h-2" />

                    {/* Cycle Performance Indicators */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-700">CH₄ Rise</div>
                        <div className="text-green-600">+{(currentCH4 - 88).toFixed(1)}%</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium text-blue-700">Flow Rate</div>
                        <div className="text-blue-600">{(120 + index * 15).toFixed(0)} m³/h</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-medium text-purple-700">Efficiency</div>
                        <div className="text-purple-600">{efficiency.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Cycle Summary */}
            <div className="border-t pt-3 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Throughput:</span>
                  <span className="font-medium ml-2">405 m³/h</span>
                </div>
                <div>
                  <span className="text-gray-600">Avg Efficiency:</span>
                  <span className="font-medium ml-2">96.8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Queue Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <span>Batch Queue</span>
              <Badge variant="secondary">2 Pending</Badge>
            </CardTitle>
            <CardDescription>Incoming batches from BiogasSangh units</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">BATCH-20241122-004</h4>
                <Badge variant="outline">queued</Badge>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Source: BiogasSangh Unit A</p>
                <p>Volume: 2,500 L</p>
                <p className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  2 docs verified
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">BATCH-20241122-005</h4>
                <Badge variant="outline">queued</Badge>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Source: Direct Producer Farm 12</p>
                <p>Volume: 1,800 L</p>
                <p className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  1 doc verified
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span>System Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Efficiency</span>
              <span className="text-xl font-bold text-green-600">94.2%</span>
            </div>
            <Progress value={94.2} className="h-2" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Daily Output</p>
                <p className="font-semibold">12,450 m³</p>
              </div>
              <div>
                <p className="text-gray-600">Quality Pass Rate</p>
                <p className="font-semibold">98.7%</p>
              </div>
              <div>
                <p className="text-gray-600">Active Units</p>
                <p className="font-semibold">3/3</p>
              </div>
              <div>
                <p className="text-gray-600">Uptime</p>
                <p className="font-semibold">99.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;