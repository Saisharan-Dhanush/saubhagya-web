import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
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
  Droplets
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
  trends?: {
    methane: number;
    production: number;
  };
}

interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
  digesterId: string;
  timestamp: string;
}

type AlertLevel = 'critical' | 'warning' | 'info';

// Mock hook for digester data with enhanced data for charts
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
      trends: { methane: 2, production: 5 }
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
      trends: { methane: 1, production: 3 }
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
      trends: { methane: -1, production: -2 }
    }
  ]);

  const [alerts] = React.useState<Alert[]>([
    {
      id: 'A001',
      level: 'warning',
      title: 'High Temperature Alert',
      message: 'Temperature exceeds optimal range',
      digesterId: 'D001',
      timestamp: new Date().toISOString()
    }
  ]);

  const refreshData = () => {
    console.log('Refreshing digester data...');
  };

  return { digesters, alerts, refreshData, isLoading: false };
};

// Chart data generation
const getChartData = (digesters: DigesterData[]) => {
  const timeSlots = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];

  return timeSlots.map((time, index) => {
    const baseVariation = Math.sin(index * 0.5) * 5;

    return {
      time,
      'Alpha-1_CH4': Math.round(digesters[0].methaneLevel + baseVariation + Math.random() * 4),
      'Alpha-2_CH4': Math.round(digesters[1].methaneLevel + baseVariation + Math.random() * 4),
      'Alpha-3_CH4': Math.round(digesters[2].methaneLevel + baseVariation + Math.random() * 4),
      'Alpha-1_Temp': Math.round((digesters[0].temperature + baseVariation * 0.5 + Math.random() * 2) * 10) / 10,
      'Alpha-2_Temp': Math.round((digesters[1].temperature + baseVariation * 0.5 + Math.random() * 2) * 10) / 10,
      'Alpha-3_Temp': Math.round((digesters[2].temperature + baseVariation * 0.5 + Math.random() * 2) * 10) / 10,
      'Alpha-1_Pressure': Math.round((digesters[0].pressure + baseVariation * 0.1 + Math.random() * 0.3) * 10) / 10,
      'Alpha-2_Pressure': Math.round((digesters[1].pressure + baseVariation * 0.1 + Math.random() * 0.3) * 10) / 10,
      'Alpha-3_Pressure': Math.round((digesters[2].pressure + baseVariation * 0.1 + Math.random() * 0.3) * 10) / 10,
    };
  });
};

// Enhanced CH4 Comparison Chart with beautiful styling
const CH4ComparisonChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg">
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="alpha1Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
          </linearGradient>
          <linearGradient id="alpha2Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
          </linearGradient>
          <linearGradient id="alpha3Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" strokeOpacity={0.5} />
        <XAxis
          dataKey="time"
          stroke="#64748b"
          fontSize={12}
          fontWeight={500}
          tick={{ fill: '#64748b' }}
          axisLine={{ stroke: '#cbd5e1' }}
        />
        <YAxis
          domain={[45, 85]}
          stroke="#64748b"
          fontSize={12}
          fontWeight={500}
          tick={{ fill: '#64748b' }}
          axisLine={{ stroke: '#cbd5e1' }}
          label={{
            value: 'CH4 Level (%)',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#475569', fontWeight: 600 }
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontWeight: 500
          }}
          labelStyle={{ color: '#1e293b', fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 500 }} />
        <Line
          type="monotone"
          dataKey="Alpha-1_CH4"
          stroke="#10b981"
          strokeWidth={3}
          name="Alpha-1 CH4%"
          dot={{ fill: '#ffffff', stroke: '#10b981', strokeWidth: 3, r: 6 }}
          activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
        />
        <Line
          type="monotone"
          dataKey="Alpha-2_CH4"
          stroke="#3b82f6"
          strokeWidth={3}
          name="Alpha-2 CH4%"
          dot={{ fill: '#ffffff', stroke: '#3b82f6', strokeWidth: 3, r: 6 }}
          activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
        />
        <Line
          type="monotone"
          dataKey="Alpha-3_CH4"
          stroke="#f59e0b"
          strokeWidth={3}
          name="Alpha-3 CH4%"
          dot={{ fill: '#ffffff', stroke: '#f59e0b', strokeWidth: 3, r: 6 }}
          activeDot={{ r: 8, stroke: '#f59e0b', strokeWidth: 2, fill: '#ffffff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Enhanced Temperature Comparison Chart
const TemperatureComparisonChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg">
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="tempBar1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="tempBar2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="tempBar3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" strokeOpacity={0.5} />
        <XAxis
          dataKey="time"
          stroke="#64748b"
          fontSize={12}
          fontWeight={500}
          tick={{ fill: '#64748b' }}
          axisLine={{ stroke: '#cbd5e1' }}
        />
        <YAxis
          domain={[28, 42]}
          stroke="#64748b"
          fontSize={12}
          fontWeight={500}
          tick={{ fill: '#64748b' }}
          axisLine={{ stroke: '#cbd5e1' }}
          label={{
            value: 'Temperature (°C)',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#475569', fontWeight: 600 }
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontWeight: 500
          }}
          labelStyle={{ color: '#1e293b', fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 500 }} />
        <Bar
          dataKey="Alpha-1_Temp"
          fill="url(#tempBar1)"
          name="Alpha-1 Temp (°C)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="Alpha-2_Temp"
          fill="url(#tempBar2)"
          name="Alpha-2 Temp (°C)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="Alpha-3_Temp"
          fill="url(#tempBar3)"
          name="Alpha-3 Temp (°C)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// New Pressure Comparison Chart
const PressureComparisonChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg">
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="pressureAlpha1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.7}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="pressureAlpha2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="pressureAlpha3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.7}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" strokeOpacity={0.5} />
        <XAxis
          dataKey="time"
          stroke="#64748b"
          fontSize={12}
          fontWeight={500}
          tick={{ fill: '#64748b' }}
          axisLine={{ stroke: '#cbd5e1' }}
        />
        <YAxis
          domain={[0.5, 2.0]}
          stroke="#64748b"
          fontSize={12}
          fontWeight={500}
          tick={{ fill: '#64748b' }}
          axisLine={{ stroke: '#cbd5e1' }}
          label={{
            value: 'Pressure (kPa)',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#475569', fontWeight: 600 }
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontWeight: 500
          }}
          labelStyle={{ color: '#1e293b', fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 500 }} />
        <Area
          type="monotone"
          dataKey="Alpha-1_Pressure"
          stroke="#10b981"
          fill="url(#pressureAlpha1)"
          strokeWidth={2}
          name="Alpha-1 Pressure (kPa)"
        />
        <Area
          type="monotone"
          dataKey="Alpha-2_Pressure"
          stroke="#3b82f6"
          fill="url(#pressureAlpha2)"
          strokeWidth={2}
          name="Alpha-2 Pressure (kPa)"
        />
        <Area
          type="monotone"
          dataKey="Alpha-3_Pressure"
          stroke="#f59e0b"
          fill="url(#pressureAlpha3)"
          strokeWidth={2}
          name="Alpha-3 Pressure (kPa)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// Digester Card Component
const DigesterCard: React.FC<{ digester: DigesterData; t: (key: string) => string }> = ({ digester, t }) => {
  const statusColor = digester.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                     digester.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                     'bg-red-100 text-red-800 border-red-200';

  const statusIcon = digester.status === 'active' ? CheckCircle : AlertTriangle;
  const StatusIcon = statusIcon;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800">{digester.name}</CardTitle>
          <Badge className={`${statusColor} border font-semibold capitalize flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {digester.status}
          </Badge>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Last Updated: {new Date(digester.lastUpdated).toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">Temperature</span>
            </div>
            <div className="text-lg font-bold text-orange-900">{digester.temperature}°C</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Pressure</span>
            </div>
            <div className="text-lg font-bold text-blue-900">{digester.pressure} kPa</div>
          </div>
        </div>

        {/* Methane Level */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">Methane</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-yellow-900">{digester.methaneLevel}%</span>
              {digester.trends?.methane && digester.trends.methane > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
          </div>
          <Progress value={digester.methaneLevel} className="h-3 bg-yellow-200" />
        </div>

        {/* Daily Production */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Daily Production</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-green-900">{digester.dailyProduction} m³</span>
              {digester.trends?.production && digester.trends.production > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
          </div>
          <Progress value={digester.efficiency} className="h-3 bg-green-200" />
        </div>

        {/* Efficiency */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <span className="text-sm font-semibold text-slate-700">Efficiency</span>
          <span className="text-lg font-bold text-emerald-600">{digester.efficiency}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

const UpdatedDigesterMonitoring: React.FC = () => {
  const [selectedDigester, setSelectedDigester] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const t = (key: string): string => key;

  const { digesters, alerts, refreshData, isLoading } = useDigesterData();
  const chartData = getChartData(digesters);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        refreshData();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isLoading, refreshData]);

  const criticalAlerts = alerts.filter(alert => alert.level === 'critical');
  const warningAlerts = alerts.filter(alert => alert.level === 'warning');

  const totalProduction = digesters.reduce((sum, d) => sum + d.dailyProduction, 0);
  const averageEfficiency = digesters.reduce((sum, d) => sum + d.efficiency, 0) / digesters.length;
  const activeDigesters = digesters.filter(d => d.status === 'active').length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Digester Monitoring
          </h1>
          <p className="text-slate-600 text-lg font-medium">Real-time biogas production monitoring and analytics</p>
        </div>
        <Button
          onClick={refreshData}
          disabled={isLoading}
          className="gap-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Total Digesters</CardTitle>
            <Activity className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{digesters.length}</div>
            <p className="text-sm text-blue-600 font-medium">
              {activeDigesters} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Daily Production</CardTitle>
            <Droplets className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{totalProduction.toFixed(1)} m³</div>
            <p className="text-sm text-green-600 font-medium">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Efficiency</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{averageEfficiency.toFixed(1)}%</div>
            <p className="text-sm text-purple-600 font-medium">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Alerts</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">{criticalAlerts.length}</div>
            <p className="text-sm text-orange-600 font-medium">
              {warningAlerts.length} warnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="details" className="font-semibold">Details</TabsTrigger>
          <TabsTrigger value="alerts" className="font-semibold">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Digesters Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {digesters.map((digester) => (
              <DigesterCard
                key={digester.id}
                digester={digester}
                t={t}
              />
            ))}
          </div>

          {/* Comparison Charts - Only CH4, Temperature, and Pressure */}
          <div className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  CH4 Level Comparison
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium">
                  Methane concentration comparison across all digesters throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CH4ComparisonChart data={chartData} />
              </CardContent>
            </Card>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Thermometer className="w-6 h-6 text-orange-500" />
                    Temperature Comparison
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Temperature monitoring across all digesters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TemperatureComparisonChart data={chartData} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Gauge className="w-6 h-6 text-purple-500" />
                    Pressure Comparison
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Pressure monitoring across all digesters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PressureComparisonChart data={chartData} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpdatedDigesterMonitoring;