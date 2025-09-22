import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useAlerts } from '../../contexts/AlertContext';
import {
  Gauge,
  ThermometerSun,
  Wind,
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface ProcessData {
  methaneContent: number;
  co2Content: number;
  h2sContent: number;
  moistureContent: number;
  inletPressure: number;
  outletPressure: number;
  scrubberTemperature: number;
  ambientTemperature: number;
  flowRate: number;
  scrubberEfficiency: number;
  energyConsumption: number;
  timestamp: string;
}

interface AlarmData {
  type: 'warning' | 'critical';
  message: string;
  system: string;
  timestamp: string;
}

const ProcessMonitoringPage: React.FC = () => {
  const [processData, setProcessData] = useState<ProcessData | null>(null);
  const [alarms, setAlarms] = useState<AlarmData[]>([]);
  const [systemStatus, setSystemStatus] = useState<'normal' | 'warning' | 'critical'>('normal');
  const [historicalData, setHistoricalData] = useState<ProcessData[]>([]);
  const { wsData, isConnected } = useWebSocket('/purification/process');
  const { addAlert } = useAlerts();

  // Mock data for demonstration when WebSocket is not connected
  const generateMockData = (): ProcessData => ({
    methaneContent: 92 + Math.random() * 4,
    co2Content: 6 + Math.random() * 2,
    h2sContent: 5 + Math.random() * 8,
    moistureContent: 0.05 + Math.random() * 0.1,
    inletPressure: 1.8 + Math.random() * 0.6,
    outletPressure: 1.2 + Math.random() * 0.3,
    scrubberTemperature: 35 + Math.random() * 20,
    ambientTemperature: 25 + Math.random() * 10,
    flowRate: 800 + Math.random() * 200,
    scrubberEfficiency: 85 + Math.random() * 10,
    energyConsumption: 150 + Math.random() * 50,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    if (wsData) {
      setProcessData(wsData);
      checkAlarmConditions(wsData);
    } else if (!isConnected) {
      // Use mock data when not connected for demo purposes
      const mockData = generateMockData();
      setProcessData(mockData);
      checkAlarmConditions(mockData);
    }
  }, [wsData, isConnected]);

  // Generate mock data every 5 seconds when not connected
  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(() => {
        const mockData = generateMockData();
        setProcessData(mockData);
        checkAlarmConditions(mockData);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  useEffect(() => {
    if (processData) {
      setHistoricalData(prev => [...prev.slice(-23), processData]);
    }
  }, [processData]);

  const checkAlarmConditions = (data: ProcessData) => {
    const newAlarms: AlarmData[] = [];

    // Gas composition checks
    if (data.methaneContent < 90) {
      newAlarms.push({
        type: 'warning',
        message: `Low methane content: ${data.methaneContent.toFixed(1)}% (Target: >90%)`,
        system: 'scrubber',
        timestamp: new Date().toISOString()
      });
    }

    if (data.h2sContent > 10) {
      newAlarms.push({
        type: 'critical',
        message: `High H₂S content: ${data.h2sContent.toFixed(1)} ppm (Limit: <10 ppm)`,
        system: 'desulfurization',
        timestamp: new Date().toISOString()
      });
    }

    // Pressure checks
    if (data.inletPressure > 2.5) {
      newAlarms.push({
        type: 'critical',
        message: `High inlet pressure: ${data.inletPressure.toFixed(1)} bar (Limit: 2.5 bar)`,
        system: 'compression',
        timestamp: new Date().toISOString()
      });
    }

    // Temperature checks
    if (data.scrubberTemperature > 60) {
      newAlarms.push({
        type: 'warning',
        message: `High scrubber temperature: ${data.scrubberTemperature.toFixed(1)}°C`,
        system: 'cooling',
        timestamp: new Date().toISOString()
      });
    }

    // Efficiency checks
    if (data.scrubberEfficiency < 80) {
      newAlarms.push({
        type: 'warning',
        message: `Low scrubber efficiency: ${data.scrubberEfficiency.toFixed(1)}% (Target: >80%)`,
        system: 'scrubber',
        timestamp: new Date().toISOString()
      });
    }

    setAlarms(newAlarms);

    // Update system status
    const hasCritical = newAlarms.some(alarm => alarm.type === 'critical');
    const hasWarning = newAlarms.some(alarm => alarm.type === 'warning');

    if (hasCritical) {
      setSystemStatus('critical');
      addAlert('Critical alarm detected - immediate attention required', 'critical');
    } else if (hasWarning) {
      setSystemStatus('warning');
    } else {
      setSystemStatus('normal');
    }
  };

  const ProcessGauges: React.FC = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Wind className="h-4 w-4 mr-2" />
            CH₄ Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {processData?.methaneContent.toFixed(1)}%
            </div>
            <Badge variant={processData && processData.methaneContent > 90 ? "default" : "destructive"}>
              {processData && processData.methaneContent > 90 ? "Normal" : "Low"}
            </Badge>
            <div className="text-xs text-gray-500 mt-1">Target: {'>'}90%</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            H₂S Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {processData?.h2sContent.toFixed(1)} ppm
            </div>
            <Badge variant={processData && processData.h2sContent < 10 ? "default" : "destructive"}>
              {processData && processData.h2sContent < 10 ? "Normal" : "High"}
            </Badge>
            <div className="text-xs text-gray-500 mt-1">Limit: &lt;10 ppm</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            Pressure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {processData?.inletPressure.toFixed(1)} bar
            </div>
            <Badge variant={processData && processData.inletPressure < 2.5 ? "default" : "destructive"}>
              {processData && processData.inletPressure < 2.5 ? "Normal" : "High"}
            </Badge>
            <div className="text-xs text-gray-500 mt-1">Limit: &lt;2.5 bar</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Flow Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {processData?.flowRate.toFixed(0)} m³/h
            </div>
            <Badge variant="default">Active</Badge>
            <div className="text-xs text-gray-500 mt-1">Inlet flow</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ProcessTrends: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Process Trends (Last 24 Data Points)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historicalData.map(data => ({
            time: new Date(data.timestamp).toLocaleTimeString(),
            methane: data.methaneContent,
            h2s: data.h2sContent,
            pressure: data.inletPressure,
            temperature: data.scrubberTemperature,
            efficiency: data.scrubberEfficiency
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="methane"
              stroke="#4CAF50"
              name="CH₄ (%)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="h2s"
              stroke="#FF5722"
              name="H₂S (ppm)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pressure"
              stroke="#2196F3"
              name="Pressure (bar)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temperature"
              stroke="#FF9800"
              name="Temperature (°C)"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="efficiency"
              stroke="#9C27B0"
              name="Efficiency (%)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const GasComposition: React.FC = () => {
    if (!processData) return null;

    const compositionData = [
      { name: 'Methane (CH₄)', value: processData.methaneContent, color: '#4CAF50' },
      { name: 'Carbon Dioxide (CO₂)', value: processData.co2Content, color: '#2196F3' },
      { name: 'Others', value: 100 - processData.methaneContent - processData.co2Content, color: '#FF9800' }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wind className="h-5 w-5 mr-2" />
            Gas Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={compositionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              >
                {compositionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${(value as number).toFixed(1)}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const ActiveAlarms: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Active Alarms
          </span>
          <Badge variant={systemStatus === 'critical' ? "destructive" :
            systemStatus === 'warning' ? "secondary" : "default"}>
            System Status: {systemStatus.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alarms.length === 0 ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">No active alarms - System operating normally</span>
            </div>
          ) : (
            alarms.map((alarm, index) => (
              <Alert key={index} variant={alarm.type === 'critical' ? 'destructive' : 'default'}>
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="uppercase">{alarm.system}:</strong> {alarm.message}
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(alarm.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <Badge variant={alarm.type === 'critical' ? "destructive" : "secondary"}>
                      {alarm.type}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  const SystemPerformance: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Scrubber Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {processData?.scrubberEfficiency.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Target: {'>'}80%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <ThermometerSun className="h-4 w-4 mr-2" />
            Temperature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {processData?.scrubberTemperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-gray-500">Scrubber operating temp</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Droplets className="h-4 w-4 mr-2" />
            Moisture Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {(processData?.moistureContent || 0).toFixed(3)}%
          </div>
          <div className="text-xs text-gray-500">Target: &lt;0.1%</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Process Monitoring</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Live Data" : "Demo Mode"}
          </Badge>
          {!isConnected && (
            <Badge variant="secondary">Mock Data</Badge>
          )}
        </div>
      </div>

      <ProcessGauges />
      <SystemPerformance />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GasComposition />
        <ActiveAlarms />
      </div>

      <ProcessTrends />
    </div>
  );
};

export default ProcessMonitoringPage;