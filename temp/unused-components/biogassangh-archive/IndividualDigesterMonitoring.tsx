import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Progress } from '../../components/ui/progress';
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
  Calendar,
  Clock,
  Settings
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
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
  detailedSensors?: {
    ph: number;
    humidity: number;
    co2Level: number;
    h2sLevel: number;
    gasFlow: number;
    liquidLevel: number;
    stirringSpeed: number;
    powerConsumption: number;
  };
  trends?: {
    methane: number;
    production: number;
    temperature: number;
    pressure: number;
  };
}

// Mock detailed sensor data
const useDigesterData = () => {
  const [digesters] = React.useState<DigesterData[]>([
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
  ]);

  const refreshData = () => {
    console.log('Refreshing digester data...');
  };

  return { digesters, refreshData, isLoading: false };
};

// Generate hourly sensor data for the selected digester
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
      ph: Math.round((digester.detailedSensors!.ph + variation * 0.1 + Math.random() * 0.2) * 10) / 10,
      gasFlow: Math.round(digester.detailedSensors!.gasFlow + variation + Math.random() * 5),
      efficiency: Math.round(digester.efficiency + variation * 0.5 + Math.random() * 2)
    };
  });

  return hours;
};

// Sensor Card Component
const SensorCard: React.FC<{
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  status?: 'normal' | 'warning' | 'critical';
}> = ({ title, value, unit = '', icon, trend, color, status = 'normal' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'critical': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    return trend > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${getStatusColor()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-lg bg-${color}-100 flex items-center justify-center`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">
            {value}{unit}
          </div>
          {getTrendIcon()}
        </div>
      </CardContent>
    </Card>
  );
};

// Individual Digester Detail Component
const DigesterDetailView: React.FC<{ digester: DigesterData }> = ({ digester }) => {
  const chartData = getDetailedChartData(digester);

  const statusColor = digester.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                     digester.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                     'bg-red-100 text-red-800 border-red-200';

  const statusIcon = digester.status === 'active' ? CheckCircle : AlertTriangle;
  const StatusIcon = statusIcon;

  return (
    <div className="space-y-6">
      {/* Digester Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">{digester.name}</CardTitle>
              <CardDescription className="text-lg">
                Last Updated: {new Date(digester.lastUpdated).toLocaleString()}
              </CardDescription>
            </div>
            <Badge className={`${statusColor} border font-semibold capitalize flex items-center gap-2 px-4 py-2`}>
              <StatusIcon className="w-4 h-4" />
              {digester.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Primary Sensors Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Primary Sensors</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SensorCard
            title="Temperature"
            value={digester.temperature}
            unit="°C"
            icon={<Thermometer className="w-4 h-4 text-orange-600" />}
            trend={digester.trends?.temperature}
            color="orange"
            status={digester.temperature > 40 ? 'warning' : 'normal'}
          />
          <SensorCard
            title="Pressure"
            value={digester.pressure}
            unit=" kPa"
            icon={<Gauge className="w-4 h-4 text-blue-600" />}
            trend={digester.trends?.pressure}
            color="blue"
          />
          <SensorCard
            title="Methane Level"
            value={digester.methaneLevel}
            unit="%"
            icon={<Zap className="w-4 h-4 text-yellow-600" />}
            trend={digester.trends?.methane}
            color="yellow"
            status={digester.methaneLevel < 60 ? 'warning' : 'normal'}
          />
          <SensorCard
            title="Daily Production"
            value={digester.dailyProduction}
            unit=" m³"
            icon={<Droplets className="w-4 h-4 text-green-600" />}
            trend={digester.trends?.production}
            color="green"
          />
        </div>
      </div>

      {/* Secondary Sensors Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Secondary Sensors</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SensorCard
            title="pH Level"
            value={digester.detailedSensors?.ph}
            icon={<Beaker className="w-4 h-4 text-purple-600" />}
            color="purple"
            status={digester.detailedSensors?.ph! < 6.5 || digester.detailedSensors?.ph! > 8 ? 'warning' : 'normal'}
          />
          <SensorCard
            title="Humidity"
            value={digester.detailedSensors?.humidity}
            unit="%"
            icon={<Droplets className="w-4 h-4 text-cyan-600" />}
            color="cyan"
          />
          <SensorCard
            title="CO₂ Level"
            value={digester.detailedSensors?.co2Level}
            unit="%"
            icon={<Wind className="w-4 h-4 text-gray-600" />}
            color="gray"
          />
          <SensorCard
            title="H₂S Level"
            value={digester.detailedSensors?.h2sLevel}
            unit=" ppm"
            icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
            color="red"
            status={digester.detailedSensors?.h2sLevel! > 0.2 ? 'warning' : 'normal'}
          />
        </div>
      </div>

      {/* Operational Metrics */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Operational Metrics</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SensorCard
            title="Gas Flow Rate"
            value={digester.detailedSensors?.gasFlow}
            unit=" L/min"
            icon={<Wind className="w-4 h-4 text-blue-600" />}
            color="blue"
          />
          <SensorCard
            title="Liquid Level"
            value={digester.detailedSensors?.liquidLevel}
            unit="%"
            icon={<Gauge className="w-4 h-4 text-teal-600" />}
            color="teal"
            status={digester.detailedSensors?.liquidLevel! < 70 ? 'warning' : 'normal'}
          />
          <SensorCard
            title="Stirring Speed"
            value={digester.detailedSensors?.stirringSpeed}
            unit=" RPM"
            icon={<Settings className="w-4 h-4 text-indigo-600" />}
            color="indigo"
            status={digester.status === 'maintenance' && digester.detailedSensors?.stirringSpeed === 0 ? 'warning' : 'normal'}
          />
          <SensorCard
            title="Power Consumption"
            value={digester.detailedSensors?.powerConsumption}
            unit=" kW"
            icon={<Zap className="w-4 h-4 text-yellow-600" />}
            color="yellow"
          />
        </div>
      </div>

      {/* Efficiency & Production */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Efficiency Trends</CardTitle>
            <CardDescription>24-hour efficiency and production correlation</CardDescription>
          </CardHeader>
          <CardContent>
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
                  stroke="#22c55e"
                  strokeWidth={3}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Conditions</CardTitle>
            <CardDescription>Temperature, pressure, and pH monitoring</CardDescription>
          </CardHeader>
          <CardContent>
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
                  strokeWidth={3}
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
          </CardContent>
        </Card>
      </div>

      {/* Methane Production Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Methane Production Analysis</CardTitle>
          <CardDescription>24-hour methane concentration and production correlation</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="methaneGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
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
                fillOpacity={1}
                fill="url(#methaneGradient)"
                strokeWidth={3}
                name="Methane Level (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const IndividualDigesterMonitoring: React.FC = () => {
  const [selectedDigesterId, setSelectedDigesterId] = useState<string>('D001');

  const { digesters, refreshData, isLoading } = useDigesterData();
  const selectedDigester = digesters.find(d => d.id === selectedDigesterId) || digesters[0];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        refreshData();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isLoading, refreshData]);

  return (
    <div className="space-y-6">
      {/* Header with Digester Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Individual Digester Monitoring</h1>
          <p className="text-muted-foreground">
            Detailed sensor data and analytics for selected digester
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Select Digester:</label>
            <Select value={selectedDigesterId} onValueChange={setSelectedDigesterId}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose a digester" />
              </SelectTrigger>
              <SelectContent>
                {digesters.map((digester) => (
                  <SelectItem key={digester.id} value={digester.id}>
                    {digester.name}
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

      {/* Selected Digester Details */}
      <DigesterDetailView digester={selectedDigester} />
    </div>
  );
};

export default IndividualDigesterMonitoring;