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
  LineChart, Line,
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

// Color palette for dynamic chart lines - Extended for 15+ digesters
const CHART_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
  '#14b8a6', '#f43f5e', '#a855f7', '#10b981', '#0ea5e9'
];

// Demo data for 15 digesters
const useDigesterData = () => {
  const [digesters] = React.useState<DigesterData[]>([
    {
      id: 'D001', name: 'Digester Alpha-1', status: 'active', temperature: 35.5, pressure: 1.2, methaneLevel: 65, dailyProduction: 150.5, efficiency: 85, lastUpdated: new Date().toISOString(), trends: { methane: 2, production: 5 }
    },
    {
      id: 'D002', name: 'Digester Alpha-2', status: 'active', temperature: 37.2, pressure: 1.5, methaneLevel: 68, dailyProduction: 175.0, efficiency: 88, lastUpdated: new Date().toISOString(), trends: { methane: 1, production: 3 }
    },
    {
      id: 'D003', name: 'Digester Alpha-3', status: 'maintenance', temperature: 32.1, pressure: 0.8, methaneLevel: 58, dailyProduction: 120.0, efficiency: 78, lastUpdated: new Date().toISOString(), trends: { methane: -1, production: -2 }
    },
    {
      id: 'D004', name: 'Digester Beta-1', status: 'active', temperature: 36.8, pressure: 1.3, methaneLevel: 72, dailyProduction: 165.0, efficiency: 90, lastUpdated: new Date().toISOString(), trends: { methane: 3, production: 4 }
    },
    {
      id: 'D005', name: 'Digester Beta-2', status: 'active', temperature: 34.2, pressure: 1.1, methaneLevel: 61, dailyProduction: 140.0, efficiency: 82, lastUpdated: new Date().toISOString(), trends: { methane: 1, production: 2 }
    },
    {
      id: 'D006', name: 'Digester Gamma-1', status: 'active', temperature: 35.8, pressure: 1.4, methaneLevel: 69, dailyProduction: 158.0, efficiency: 87, lastUpdated: new Date().toISOString(), trends: { methane: 2, production: 3 }
    },
    {
      id: 'D007', name: 'Digester Gamma-2', status: 'active', temperature: 36.1, pressure: 1.2, methaneLevel: 64, dailyProduction: 142.0, efficiency: 84, lastUpdated: new Date().toISOString(), trends: { methane: 1, production: 2 }
    },
    {
      id: 'D008', name: 'Digester Delta-1', status: 'offline', temperature: 30.5, pressure: 0.6, methaneLevel: 45, dailyProduction: 0.0, efficiency: 0, lastUpdated: new Date().toISOString(), trends: { methane: -5, production: -10 }
    },
    {
      id: 'D009', name: 'Digester Delta-2', status: 'active', temperature: 37.5, pressure: 1.6, methaneLevel: 74, dailyProduction: 185.0, efficiency: 92, lastUpdated: new Date().toISOString(), trends: { methane: 4, production: 6 }
    },
    {
      id: 'D010', name: 'Digester Epsilon-1', status: 'active', temperature: 34.8, pressure: 1.1, methaneLevel: 62, dailyProduction: 145.0, efficiency: 83, lastUpdated: new Date().toISOString(), trends: { methane: 1, production: 2 }
    },
    {
      id: 'D011', name: 'Digester Epsilon-2', status: 'maintenance', temperature: 33.2, pressure: 0.9, methaneLevel: 55, dailyProduction: 110.0, efficiency: 75, lastUpdated: new Date().toISOString(), trends: { methane: -2, production: -3 }
    },
    {
      id: 'D012', name: 'Digester Zeta-1', status: 'active', temperature: 38.1, pressure: 1.7, methaneLevel: 76, dailyProduction: 192.0, efficiency: 94, lastUpdated: new Date().toISOString(), trends: { methane: 5, production: 7 }
    },
    {
      id: 'D013', name: 'Digester Zeta-2', status: 'active', temperature: 35.9, pressure: 1.3, methaneLevel: 67, dailyProduction: 156.0, efficiency: 86, lastUpdated: new Date().toISOString(), trends: { methane: 2, production: 4 }
    },
    {
      id: 'D014', name: 'Digester Eta-1', status: 'active', temperature: 36.6, pressure: 1.4, methaneLevel: 71, dailyProduction: 168.0, efficiency: 89, lastUpdated: new Date().toISOString(), trends: { methane: 3, production: 5 }
    },
    {
      id: 'D015', name: 'Digester Eta-2', status: 'active', temperature: 34.5, pressure: 1.0, methaneLevel: 59, dailyProduction: 135.0, efficiency: 81, lastUpdated: new Date().toISOString(), trends: { methane: 0, production: 1 }
    }
  ]);

  const [alerts] = React.useState<Alert[]>([
    { id: 'A001', level: 'warning', title: 'High Temperature Alert', message: 'Temperature exceeds optimal range', digesterId: 'D001', timestamp: new Date().toISOString() },
    { id: 'A002', level: 'critical', title: 'Offline Digester', message: 'Delta-1 is offline and needs attention', digesterId: 'D008', timestamp: new Date().toISOString() },
    { id: 'A003', level: 'warning', title: 'Low Efficiency', message: 'Efficiency below target', digesterId: 'D011', timestamp: new Date().toISOString() }
  ]);

  const refreshData = () => {
    console.log('Refreshing data for 15 digesters...');
  };

  const isLoading = false;
  return { digesters, alerts, refreshData, isLoading };
};

// Dynamic chart data generation for any number of digesters
const getChartData = (digesters: DigesterData[]) => {
  const timePoints = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];

  return timePoints.map(time => {
    const dataPoint: any = { time };

    digesters.forEach((digester) => {
      const digesterName = digester.name.replace('Digester ', '');
      dataPoint[`${digesterName}_CH4`] = Math.max(0, digester.methaneLevel + Math.random() * 10 - 5);
      dataPoint[`${digesterName}_Production`] = Math.max(0, digester.dailyProduction * (0.8 + Math.random() * 0.4));
      dataPoint[`${digesterName}_Temp`] = Math.max(0, digester.temperature + Math.random() * 4 - 2);
    });

    return dataPoint;
  });
};

// Dynamic chart components that scale with any number of digesters
const DynamicComparisonChart: React.FC<{
  data: any[],
  digesters: DigesterData[],
  metric: 'CH4' | 'Production' | 'Temp',
  yAxisDomain?: [number, number],
  unit?: string
}> = ({ data, digesters, metric, yAxisDomain, unit = '' }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis domain={yAxisDomain} />
      <Tooltip />
      <Legend />
      {digesters.map((digester, index) => {
        const digesterName = digester.name.replace('Digester ', '');
        const dataKey = `${digesterName}_${metric}`;
        const color = CHART_COLORS[index % CHART_COLORS.length];

        return (
          <Line
            key={digester.id}
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            name={`${digesterName} ${metric}${unit}`}
          />
        );
      })}
    </LineChart>
  </ResponsiveContainer>
);

const translations = {
  en: {
    overview: 'Overview', details: 'Details', alerts: 'Alerts', temperature: 'Temperature', pressure: 'Pressure', methane: 'Methane', dailyProduction: 'Daily Production', efficiency: 'Efficiency', lastUpdated: 'Last Updated', active: 'Active', maintenance: 'Maintenance', offline: 'Offline'
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    case 'offline': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const DigesterCard: React.FC<{ digester: DigesterData; t: (key: string) => string }> = ({ digester, t }) => {
  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{digester.name}</CardTitle>
          <Badge className={getStatusColor(digester.status)}>
            {t(digester.status.toLowerCase())}
          </Badge>
        </div>
        <CardDescription className="text-xs text-gray-600">
          {t('lastUpdated')}: {new Date(digester.lastUpdated).toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Compact Key Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-medium">{digester.temperature}°C</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium">{digester.pressure} kPa</span>
            </div>
          </div>
        </div>

        {/* Gas Production */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium">CH4</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold">{digester.methaneLevel}%</span>
              {getTrendIcon(digester.trends?.methane || 0)}
            </div>
          </div>
          <Progress value={digester.methaneLevel} className="h-1" />
        </div>

        {/* Daily Production */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium">Production</span>
            </div>
            <span className="text-xs font-bold">{digester.dailyProduction} m³</span>
          </div>
          <Progress value={digester.efficiency} className="h-1" />
        </div>

        {/* Efficiency */}
        <div className="flex items-center justify-between pt-1 border-t">
          <span className="text-xs font-medium">Efficiency</span>
          <span className="text-xs font-bold text-green-600">{digester.efficiency}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const Demo15DigestersMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const t = (key: string): string => translations.en[key as keyof typeof translations.en] || key;

  const { digesters, alerts, refreshData, isLoading } = useDigesterData();
  const chartData = getChartData(digesters);

  const criticalAlerts = alerts.filter(alert => alert.level === 'critical');
  const warningAlerts = alerts.filter(alert => alert.level === 'warning');

  const totalProduction = digesters.reduce((sum, d) => sum + d.dailyProduction, 0);
  const averageEfficiency = digesters.reduce((sum, d) => sum + d.efficiency, 0) / digesters.length;
  const activeDigesters = digesters.filter(d => d.status === 'active').length;

  // Enhanced grid class for 15+ digesters
  const getDigesterGridClass = (count: number) => {
    if (count <= 5) return 'grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
    if (count <= 10) return 'grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
    return 'grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">15 Digesters Monitoring Demo</h1>
          <p className="text-gray-600">Scalable real-time biogas production monitoring ({digesters.length} digesters)</p>
        </div>
        <Button onClick={refreshData} disabled={isLoading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Enhanced Summary Cards for Large Scale */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Digesters</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{digesters.length}</div>
            <p className="text-xs text-muted-foreground">{activeDigesters} active, {digesters.filter(d => d.status === 'maintenance').length} maintenance, {digesters.filter(d => d.status === 'offline').length} offline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Production</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProduction.toFixed(1)} m³</div>
            <p className="text-xs text-muted-foreground">Average: {(totalProduction/digesters.length).toFixed(1)} m³/digester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Range: {Math.min(...digesters.map(d => d.efficiency))}% - {Math.max(...digesters.map(d => d.efficiency))}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">{warningAlerts.length} warnings total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Production</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...digesters.map(d => d.dailyProduction)).toFixed(0)} m³</div>
            <p className="text-xs text-muted-foreground">Best performer: {digesters.find(d => d.dailyProduction === Math.max(...digesters.map(d => d.dailyProduction)))?.name.replace('Digester ', '')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="details">{t('details')}</TabsTrigger>
          <TabsTrigger value="alerts">{t('alerts')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Compact Digesters Grid for 15 digesters */}
          <div className={getDigesterGridClass(digesters.length)}>
            {digesters.map((digester) => (
              <DigesterCard key={digester.id} digester={digester} t={t} />
            ))}
          </div>

          {/* Enhanced Comparison Charts */}
          <div className="grid gap-6 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>CH4 Level Comparison - All 15 Digesters</CardTitle>
                <CardDescription>Methane concentration comparison across all {digesters.length} digesters with color-coded tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicComparisonChart data={chartData} digesters={digesters} metric="CH4" yAxisDomain={[40, 80]} unit="%" />
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Production Comparison</CardTitle>
                  <CardDescription>Daily biogas production across all {digesters.length} digesters</CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicComparisonChart data={chartData} digesters={digesters} metric="Production" unit=" (m³)" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temperature Comparison</CardTitle>
                  <CardDescription>Temperature monitoring across all {digesters.length} digesters</CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicComparisonChart data={chartData} digesters={digesters} metric="Temp" yAxisDomain={[25, 45]} unit=" (°C)" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Demo15DigestersMonitoring;