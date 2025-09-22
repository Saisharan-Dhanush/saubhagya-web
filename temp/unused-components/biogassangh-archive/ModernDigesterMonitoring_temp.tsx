import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import {
  Activity,
  Thermometer,
  Gauge,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Droplets,
  Wind,
  Beaker,
  Settings,
  Wifi,
  WifiOff,
  Radio,
  Cpu,
  Monitor,
  Play,
  Pause
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip
} from 'recharts';

// Type definitions
interface DigesterData {
  id: string;
  name: string;
  status: string;
  temperature: number;
  pressure: number;
  methaneLevel: number;
  dailyProduction: number;
  efficiency: number;
  lastUpdated: string;
  detailedSensors: {
    ph: number;
    humidity: number;
    co2Level: number;
    h2sLevel: number;
    gasFlow: number;
    liquidLevel: number;
    stirringSpeed: number;
    powerConsumption: number;
  };
  trends: {
    methane: number;
    production: number;
    temperature: number;
    pressure: number;
  };
}

// Base digester configurations
const baseDigesters: DigesterData[] = [
  {
    id: 'D001',
    name: 'Digester Alpha-1',
    status: 'active',
    temperature: 35.5,
    pressure: 1.2,
    methaneLevel: 65,
    dailyProduction: 150.5,
    efficiency: 85,
    lastUpdated: new Date().toISOString(),
    detailedSensors: {
      ph: 7.2,
      humidity: 82,
      co2Level: 28,
      h2sLevel: 0.15,
      gasFlow: 45.2,
      liquidLevel: 78,
      stirringSpeed: 120,
      powerConsumption: 2.4
    },
    trends: { methane: 2, production: 5, temperature: 1, pressure: 0.5 }
  },
  {
    id: 'D002',
    name: 'Digester Alpha-2',
    status: 'active',
    temperature: 37.2,
    pressure: 1.5,
    methaneLevel: 68,
    dailyProduction: 175.0,
    efficiency: 88,
    lastUpdated: new Date().toISOString(),
    detailedSensors: {
      ph: 7.5,
      humidity: 85,
      co2Level: 25,
      h2sLevel: 0.12,
      gasFlow: 52.8,
      liquidLevel: 82,
      stirringSpeed: 115,
      powerConsumption: 2.6
    },
    trends: { methane: 1, production: 3, temperature: 0.5, pressure: 0.2 }
  },
  {
    id: 'D003',
    name: 'Digester Alpha-3',
    status: 'maintenance',
    temperature: 32.1,
    pressure: 0.8,
    methaneLevel: 58,
    dailyProduction: 120.0,
    efficiency: 78,
    lastUpdated: new Date().toISOString(),
    detailedSensors: {
      ph: 6.8,
      humidity: 75,
      co2Level: 35,
      h2sLevel: 0.22,
      gasFlow: 32.1,
      liquidLevel: 65,
      stirringSpeed: 0,
      powerConsumption: 0.8
    },
    trends: { methane: -1, production: -2, temperature: -0.5, pressure: -0.1 }
  }
];

// Real-time data simulation hook
const useRealTimeDigesterData = () => {
  const [digesters, setDigesters] = useState<DigesterData[]>(baseDigesters);
  const [isConnected, setIsConnected] = useState(true);
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const generateSensorVariation = useCallback((baseValue: number, variation: number, min?: number, max?: number) => {
    const change = (Math.random() - 0.5) * variation;
    const newValue = baseValue + change;
    if (min !== undefined && max !== undefined) {
      return Math.max(min, Math.min(max, newValue));
    }
    return newValue;
  }, []);

  const updateDigesterData = useCallback(() => {
    if (!isRealTimeActive) return;

    setDigesters(prevDigesters =>
      prevDigesters.map(digester => {
        if (digester.status === 'maintenance') {
          return { ...digester, lastUpdated: new Date().toISOString() };
        }

        const updatedDigester: DigesterData = {
          ...digester,
          temperature: Math.round(generateSensorVariation(digester.temperature, 0.5, 30, 42) * 10) / 10,
          pressure: Math.round(generateSensorVariation(digester.pressure, 0.1, 0.5, 2.0) * 10) / 10,
          methaneLevel: Math.round(generateSensorVariation(digester.methaneLevel, 2, 50, 80)),
          efficiency: Math.round(generateSensorVariation(digester.efficiency, 1, 70, 95)),
          detailedSensors: {
            ph: Math.round(generateSensorVariation(digester.detailedSensors.ph, 0.1, 6.0, 8.5) * 10) / 10,
            humidity: Math.round(generateSensorVariation(digester.detailedSensors.humidity, 2, 70, 95)),
            co2Level: Math.round(generateSensorVariation(digester.detailedSensors.co2Level, 1, 20, 40)),
            h2sLevel: Math.round(generateSensorVariation(digester.detailedSensors.h2sLevel, 0.02, 0.05, 0.3) * 100) / 100,
            gasFlow: Math.round(generateSensorVariation(digester.detailedSensors.gasFlow, 2, 30, 70) * 10) / 10,
            liquidLevel: Math.round(generateSensorVariation(digester.detailedSensors.liquidLevel, 1, 60, 90)),
            stirringSpeed: digester.status === 'active' ? Math.round(generateSensorVariation(digester.detailedSensors.stirringSpeed, 5, 100, 140)) : 0,
            powerConsumption: Math.round(generateSensorVariation(digester.detailedSensors.powerConsumption, 0.1, 1.5, 3.5) * 10) / 10
          },
          lastUpdated: new Date().toISOString()
        };
        return updatedDigester;
      })
    );
    setLastUpdateTime(new Date());
  }, [generateSensorVariation, isRealTimeActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 2000);
        return;
      }
      updateDigesterData();
    }, 3000);

    return () => clearInterval(interval);
  }, [updateDigesterData]);

  const toggleRealTime = () => setIsRealTimeActive(!isRealTimeActive);
  const refreshData = useCallback(() => updateDigesterData(), [updateDigesterData]);

  return {
    digesters,
    refreshData,
    isLoading: false,
    isConnected,
    isRealTimeActive,
    toggleRealTime,
    lastUpdateTime
  };
};

// Clean Sensor Card matching SAUBHAGYA theme
const CleanSensorCard: React.FC<{
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  status?: 'normal' | 'warning' | 'critical';
  isUpdating?: boolean;
}> = ({ title, value, unit = '', icon, trend, color, status = 'normal', isUpdating = false }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getIconBgColor = () => {
    const colorMap: { [key: string]: string } = {
      orange: 'bg-orange-100 text-orange-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      cyan: 'bg-cyan-100 text-cyan-600',
      gray: 'bg-gray-100 text-gray-600',
      red: 'bg-red-100 text-red-600',
      teal: 'bg-teal-100 text-teal-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <Card className={`
      border transition-all duration-200 hover:shadow-md
      ${getStatusStyles()}
      ${isUpdating ? 'ring-2 ring-blue-200 shadow-sm' : ''}
    `}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="relative">
          <div className={`
            h-10 w-10 rounded-lg flex items-center justify-center
            ${getIconBgColor()}
            ${isUpdating ? 'animate-pulse' : ''}
          `}>
            {icon}
          </div>
          {isUpdating && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            {value}{unit}
          </div>
          {trend !== undefined && (
            <div className={`
              flex items-center justify-center w-6 h-6 rounded-full
              ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
            `}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </div>
          )}
        </div>

        {isUpdating && (
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{width: '100%'}} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Clean Connection Status matching SAUBHAGYA theme
const CleanConnectionStatus: React.FC<{
  isConnected: boolean;
  lastUpdate: Date;
  isRealTimeActive: boolean;
  onToggleRealTime: () => void;
}> = ({ isConnected, lastUpdate, isRealTimeActive, onToggleRealTime }) => {
  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="relative">
                  <Wifi className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="text-sm font-medium">CONNECTED</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">RECONNECTING</span>
              </div>
            )}
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-gray-600">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>

          <Button
            onClick={onToggleRealTime}
            variant={isRealTimeActive ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            {isRealTimeActive ? (
              <>
                <Pause className="w-4 h-4" />
                Pause Updates
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Resume Updates
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Clean Chart Component matching SAUBHAGYA theme
const CleanChart: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
  isLive?: boolean;
}> = ({ title, subtitle, children, isLive = false }) => {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              {title}
              {isLive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-600 uppercase tracking-wide">LIVE</span>
                </div>
              )}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {subtitle}
            </CardDescription>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

// Generate chart data
const getDetailedChartData = (digester: DigesterData) => {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
    const variation = Math.sin(i * 0.5) * 5;

    return {
      time: timeLabel,
      temperature: Math.round((digester.temperature + variation + Math.random() * 2) * 10) / 10,
      pressure: Math.round((digester.pressure + variation * 0.1 + Math.random() * 0.2) * 10) / 10,
      methane: Math.round(digester.methaneLevel + variation + Math.random() * 3),
      ph: Math.round((digester.detailedSensors.ph + variation * 0.1 + Math.random() * 0.2) * 10) / 10,
      gasFlow: Math.round(digester.detailedSensors.gasFlow + variation + Math.random() * 5),
      efficiency: Math.round(digester.efficiency + variation * 0.5 + Math.random() * 2)
    };
  });

  return hours;
};

// Main Component
const CleanDigesterMonitoring: React.FC = () => {
  const [selectedDigesterId, setSelectedDigesterId] = useState<string>('D001');

  const {
    digesters,
    refreshData,
    isLoading,
    isConnected,
    isRealTimeActive,
    toggleRealTime,
    lastUpdateTime
  } = useRealTimeDigesterData();

  const selectedDigester = digesters.find(d => d.id === selectedDigesterId) || digesters[0];
  const [isUpdating, setIsUpdating] = useState(false);
  const chartData = getDetailedChartData(selectedDigester);

  useEffect(() => {
    if (isConnected && isRealTimeActive) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedDigester.lastUpdated, isConnected, isRealTimeActive]);

  const statusIcon = selectedDigester.status === 'active' ? CheckCircle : AlertTriangle;
  const StatusIcon = statusIcon;

  return (
    <div className="min-h-screen bg-gray-50 space-y-6 p-6">
      {/* Clean Header */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Real-Time Digester Monitoring
              </CardTitle>
              <CardDescription className="text-gray-600">
                Live sensor data • Advanced analytics • Continuous monitoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Select Digester:</label>
                <Select value={selectedDigesterId} onValueChange={setSelectedDigesterId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Choose a digester" />
                  </SelectTrigger>
                  <SelectContent>
                    {digesters.map((digester) => (
                      <SelectItem key={digester.id} value={digester.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            digester.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          {digester.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={refreshData}
                disabled={isLoading}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Digester Header Card */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {selectedDigester.name}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Last Updated: {new Date(selectedDigester.lastUpdated).toLocaleString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant={selectedDigester.status === 'active' ? 'default' : 'secondary'}
                className={`px-3 py-1 ${
                  selectedDigester.status === 'active'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                <StatusIcon className="w-4 h-4 mr-2" />
                {selectedDigester.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Connection Status */}
      <CleanConnectionStatus
        isConnected={isConnected}
        lastUpdate={lastUpdateTime}
        isRealTimeActive={isRealTimeActive}
        onToggleRealTime={toggleRealTime}
      />

      {/* Primary Sensors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
          <Cpu className="w-5 h-5 text-blue-600" />
          Primary Sensors
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CleanSensorCard
            title="Temperature"
            value={selectedDigester.temperature}
            unit="°C"
            icon={<Thermometer className="w-5 h-5" />}
            trend={selectedDigester.trends?.temperature}
            color="orange"
            status={selectedDigester.temperature > 40 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <CleanSensorCard
            title="Pressure"
            value={selectedDigester.pressure}
            unit=" kPa"
            icon={<Gauge className="w-5 h-5" />}
            trend={selectedDigester.trends?.pressure}
            color="blue"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <CleanSensorCard
            title="Methane Level"
            value={selectedDigester.methaneLevel}
            unit="%"
            icon={<Zap className="w-5 h-5" />}
            trend={selectedDigester.trends?.methane}
            color="yellow"
            status={selectedDigester.methaneLevel < 60 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <CleanSensorCard
            title="Efficiency"
            value={selectedDigester.efficiency}
            unit="%"
            icon={<Activity className="w-5 h-5" />}
            trend={selectedDigester.trends?.production}
            color="green"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
        </div>
      </div>

      {/* Secondary Sensors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
          <Radio className="w-5 h-5 text-purple-600" />
          Secondary Sensors
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CleanSensorCard
            title="pH Level"
            value={selectedDigester.detailedSensors?.ph}
            icon={<Beaker className="w-5 h-5" />}
            color="purple"
            status={selectedDigester.detailedSensors?.ph! < 6.5 || selectedDigester.detailedSensors?.ph! > 8 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <CleanSensorCard
            title="Humidity"
            value={selectedDigester.detailedSensors?.humidity}
            unit="%"
            icon={<Droplets className="w-5 h-5" />}
            color="cyan"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <CleanSensorCard
            title="CO₂ Level"
            value={selectedDigester.detailedSensors?.co2Level}
            unit="%"
            icon={<Wind className="w-5 h-5" />}
            color="gray"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <CleanSensorCard
            title="H₂S Level"
            value={selectedDigester.detailedSensors?.h2sLevel}
            unit=" ppm"
            icon={<AlertTriangle className="w-5 h-5" />}
            color="red"
            status={selectedDigester.detailedSensors?.h2sLevel! > 0.2 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
        </div>
      </div>

      {/* Operational Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
          <Settings className="w-5 h-5 text-indigo-600" />
          Operational Metrics
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CleanSensorCard
            title="Gas Flow Rate"
            value={selectedDigester.detailedSensors?.gasFlow}
            unit=" L/min"
            icon={<Wind className="w-5 h-5" />}
            color="blue"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <CleanSensorCard
            title="Liquid Level"
            value={selectedDigester.detailedSensors?.liquidLevel}
            unit="%"
            icon={<Gauge className="w-5 h-5" />}
            color="teal"
            status={selectedDigester.detailedSensors?.liquidLevel! < 70 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <CleanSensorCard
            title="Stirring Speed"
            value={selectedDigester.detailedSensors?.stirringSpeed}
            unit=" RPM"
            icon={<Settings className="w-5 h-5" />}
            color="indigo"
            status={selectedDigester.status === 'maintenance' && selectedDigester.detailedSensors?.stirringSpeed === 0 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <CleanSensorCard
            title="Power Consumption"
            value={selectedDigester.detailedSensors?.powerConsumption}
            unit=" kW"
            icon={<Zap className="w-5 h-5" />}
            color="yellow"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
        </div>
      </div>

      {/* Clean Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CleanChart
          title="Live Efficiency Analytics"
          subtitle="Real-time efficiency and gas flow correlation"
          isLive={isConnected && isRealTimeActive}
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: '#64748b' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#10b981"
                strokeWidth={2}
                name="Efficiency (%)"
                dot={{ fill: '#10b981', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="gasFlow"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Gas Flow (L/min)"
                dot={{ fill: '#3b82f6', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CleanChart>

        <CleanChart
          title="Environmental Conditions"
          subtitle="Temperature, pressure, and pH monitoring"
          isLive={isConnected && isRealTimeActive}
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: '#64748b' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Temperature (°C)"
                dot={{ fill: '#f59e0b', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Pressure (kPa)"
                dot={{ fill: '#8b5cf6', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="ph"
                stroke="#ec4899"
                strokeWidth={2}
                name="pH Level"
                dot={{ fill: '#ec4899', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CleanChart>
      </div>

      {/* Live Methane Production Stream */}
      <CleanChart
        title="Live Methane Production Stream"
        subtitle="Real-time methane concentration monitoring"
        isLive={isConnected && isRealTimeActive}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="methaneGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: '#64748b' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="methane"
              stroke="#fbbf24"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#methaneGradient)"
              name="Methane Level (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CleanChart>
    </div>
  );
};

export default CleanDigesterMonitoring;