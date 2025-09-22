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

// Sensor Card matching SAUBHAGYA theme exactly
const SensorCard: React.FC<{
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  status?: 'normal' | 'warning' | 'critical';
  isUpdating?: boolean;
}> = ({ title, value, unit = '', icon, trend, color, status = 'normal', isUpdating = false }) => {
  const getCardStyles = () => {
    switch (status) {
      case 'warning': return 'hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-orange-50';
      case 'critical': return 'hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-pink-50';
      default: return 'hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50';
    }
  };

  return (
    <Card className={`
      ${getCardStyles()}
      ${isUpdating ? 'ring-2 ring-blue-400/50' : ''}
    `}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="relative">
          <div className={`
            h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center
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

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
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
          <div className="w-full bg-muted rounded-full h-1 mt-2">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{width: '100%'}} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Connection Status Component
const ConnectionStatus: React.FC<{
  isConnected: boolean;
  lastUpdate: Date;
  isRealTimeActive: boolean;
  onToggleRealTime: () => void;
}> = ({ isConnected, lastUpdate, isRealTimeActive, onToggleRealTime }) => {
  return (
    <Card>
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
            <span className="text-sm text-muted-foreground">
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

// Chart Component
const ChartCard: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
  isLive?: boolean;
}> = ({ title, subtitle, children, isLive = false }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              {title}
              {isLive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-600 uppercase tracking-wide">LIVE</span>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              {subtitle}
            </CardDescription>
          </div>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Monitor className="h-4 w-4 text-muted-foreground" />
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
const ModernDigesterMonitoring: React.FC = () => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between -mt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Digester Monitoring</h1>
          <p className="text-muted-foreground">
            Live sensor data, advanced analytics, continuous monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Select Digester:</label>
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
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Digester Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">
                {selectedDigester.name}
              </CardTitle>
              <CardDescription>
                Last Updated: {new Date(selectedDigester.lastUpdated).toLocaleString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`${
                selectedDigester.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              } border font-semibold capitalize flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {selectedDigester.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Connection Status */}
      <ConnectionStatus
        isConnected={isConnected}
        lastUpdate={lastUpdateTime}
        isRealTimeActive={isRealTimeActive}
        onToggleRealTime={toggleRealTime}
      />

      {/* Primary Sensors */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <Cpu className="h-4 w-4 text-blue-600" />
          Primary Sensors
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SensorCard
            title="Temperature"
            value={selectedDigester.temperature}
            unit="°C"
            icon={<Thermometer className="h-4 w-4 text-orange-600" />}
            trend={selectedDigester.trends?.temperature}
            color="orange"
            status={selectedDigester.temperature > 40 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <SensorCard
            title="Pressure"
            value={selectedDigester.pressure}
            unit=" kPa"
            icon={<Gauge className="h-4 w-4 text-blue-600" />}
            trend={selectedDigester.trends?.pressure}
            color="blue"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <SensorCard
            title="Methane Level"
            value={selectedDigester.methaneLevel}
            unit="%"
            icon={<Zap className="h-4 w-4 text-yellow-600" />}
            trend={selectedDigester.trends?.methane}
            color="yellow"
            status={selectedDigester.methaneLevel < 60 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <SensorCard
            title="Efficiency"
            value={selectedDigester.efficiency}
            unit="%"
            icon={<Activity className="h-4 w-4 text-green-600" />}
            trend={selectedDigester.trends?.production}
            color="green"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
        </div>
      </div>

      {/* Secondary Sensors */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <Radio className="h-4 w-4 text-purple-600" />
          Secondary Sensors
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SensorCard
            title="pH Level"
            value={selectedDigester.detailedSensors?.ph}
            icon={<Beaker className="h-4 w-4 text-purple-600" />}
            color="purple"
            status={selectedDigester.detailedSensors?.ph! < 6.5 || selectedDigester.detailedSensors?.ph! > 8 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <SensorCard
            title="Humidity"
            value={selectedDigester.detailedSensors?.humidity}
            unit="%"
            icon={<Droplets className="h-4 w-4 text-cyan-600" />}
            color="cyan"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <SensorCard
            title="CO₂ Level"
            value={selectedDigester.detailedSensors?.co2Level}
            unit="%"
            icon={<Wind className="h-4 w-4 text-gray-600" />}
            color="gray"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <SensorCard
            title="H₂S Level"
            value={selectedDigester.detailedSensors?.h2sLevel}
            unit=" ppm"
            icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
            color="red"
            status={selectedDigester.detailedSensors?.h2sLevel! > 0.2 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
        </div>
      </div>

      {/* Operational Metrics */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <Settings className="h-4 w-4 text-indigo-600" />
          Operational Metrics
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SensorCard
            title="Gas Flow Rate"
            value={selectedDigester.detailedSensors?.gasFlow}
            unit=" L/min"
            icon={<Wind className="h-4 w-4 text-blue-600" />}
            color="blue"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <SensorCard
            title="Liquid Level"
            value={selectedDigester.detailedSensors?.liquidLevel}
            unit="%"
            icon={<Gauge className="h-4 w-4 text-teal-600" />}
            color="teal"
            status={selectedDigester.detailedSensors?.liquidLevel! < 70 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <SensorCard
            title="Stirring Speed"
            value={selectedDigester.detailedSensors?.stirringSpeed}
            unit=" RPM"
            icon={<Settings className="h-4 w-4 text-indigo-600" />}
            color="indigo"
            status={selectedDigester.status === 'maintenance' && selectedDigester.detailedSensors?.stirringSpeed === 0 ? 'warning' : 'normal'}
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
          <SensorCard
            title="Power Consumption"
            value={selectedDigester.detailedSensors?.powerConsumption}
            unit=" kW"
            icon={<Zap className="h-4 w-4 text-yellow-600" />}
            color="yellow"
            isUpdating={isUpdating && isConnected && isRealTimeActive}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Live Efficiency Analytics"
          subtitle="Real-time efficiency and gas flow correlation"
          isLive={isConnected && isRealTimeActive}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#10b981"
                strokeWidth={2}
                name="Efficiency (%)"
              />
              <Line
                type="monotone"
                dataKey="gasFlow"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Gas Flow (L/min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Environmental Conditions"
          subtitle="Temperature, pressure, and pH monitoring"
          isLive={isConnected && isRealTimeActive}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Temperature (°C)"
              />
              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Pressure (kPa)"
              />
              <Line
                type="monotone"
                dataKey="ph"
                stroke="#ec4899"
                strokeWidth={2}
                name="pH Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Live Methane Production Stream */}
      <ChartCard
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
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
      </ChartCard>
    </div>
  );
};

export default ModernDigesterMonitoring;