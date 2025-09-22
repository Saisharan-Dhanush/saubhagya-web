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

// Color palette for charts
const CHART_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b'
];

// Mock hook for digester data - exactly 3 digesters
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
    console.log('Refreshing data...');
  };

  const isLoading = false;

  return { digesters, alerts, refreshData, isLoading };
};

// Chart data generation
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

// Chart component
const DynamicComparisonChart: React.FC<{
  data: any[],
  digesters: DigesterData[],
  metric: 'CH4' | 'Production' | 'Temp',
  yAxisDomain?: [number, number],
  unit?: string
}> = ({ data, digesters, metric, yAxisDomain, unit = '' }) => (
  <ResponsiveContainer width="100%" height={300}>
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

interface DigesterMonitoringProps {
  languageContext?: {
    language: 'hi' | 'en';
    t: (key: string) => string;
  };
}

const translations = {
  en: {
    overview: 'Overview',
    details: 'Details',
    alerts: 'Alerts',
    temperature: 'Temperature',
    pressure: 'Pressure',
    methane: 'Methane',
    dailyProduction: 'Daily Production',
    efficiency: 'Efficiency',
    lastUpdated: 'Last Updated',
    active: 'Active',
    maintenance: 'Maintenance',
    offline: 'Offline'
  },
  hi: {
    overview: 'अवलोकन',
    details: 'विवरण',
    alerts: 'अलर्ट',
    temperature: 'तापमान',
    pressure: 'दबाव',
    methane: 'मीथेन',
    dailyProduction: 'दैनिक उत्पादन',
    efficiency: 'दक्षता',
    lastUpdated: 'अंतिम अपडेट',
    active: 'सक्रिय',
    maintenance: 'रखरखाव',
    offline: 'ऑफलाइन'
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
          <CardTitle className="text-lg">{digester.name}</CardTitle>
          <Badge className={getStatusColor(digester.status)}>
            {t(digester.status.toLowerCase())}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600">
          {t('lastUpdated')}: {new Date(digester.lastUpdated).toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{t('temperature')}</span>
            </div>
            <div className="text-2xl font-bold">{digester.temperature}°C</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">{t('pressure')}</span>
            </div>
            <div className="text-2xl font-bold">{digester.pressure} kPa</div>
          </div>
        </div>

        {/* Gas Production */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{t('methane')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold">{digester.methaneLevel}%</span>
              {getTrendIcon(digester.trends?.methane || 0)}
            </div>
          </div>
          <Progress value={digester.methaneLevel} className="h-2" />
        </div>

        {/* Daily Production */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">{t('dailyProduction')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold">{digester.dailyProduction} m³</span>
              {getTrendIcon(digester.trends?.production || 0)}
            </div>
          </div>
          <Progress value={digester.efficiency} className="h-2" />
        </div>

        {/* Efficiency */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-medium">{t('efficiency')}</span>
          <span className="text-sm font-bold text-green-600">{digester.efficiency}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const EnhancedDigesterMonitoring: React.FC<DigesterMonitoringProps> = ({ languageContext }) => {
  const [selectedDigester, setSelectedDigester] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const lang = languageContext?.language || 'en';
  const t = (key: string): string => {
    return languageContext?.t(key) || translations[lang][key as keyof typeof translations[typeof lang]] || key;
  };

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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Digester Monitoring</h1>
          <p className="text-gray-600">Real-time biogas production monitoring and analytics ({digesters.length} digesters)</p>
        </div>
        <Button onClick={refreshData} disabled={isLoading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Digesters</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{digesters.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeDigesters} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Production</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProduction.toFixed(1)} m³</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {warningAlerts.length} warnings
            </p>
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
          {/* Digesters Grid - 3 digesters layout */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {digesters.map((digester) => (
              <DigesterCard
                key={digester.id}
                digester={digester}
                t={t}
              />
            ))}
          </div>

          {/* Comparison Charts - 3 digesters */}
          <div className="grid gap-6 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>CH4 Level Comparison</CardTitle>
                <CardDescription>
                  Methane concentration comparison across all {digesters.length} digesters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicComparisonChart
                  data={chartData}
                  digesters={digesters}
                  metric="CH4"
                  yAxisDomain={[50, 80]}
                  unit="%"
                />
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Comparison</CardTitle>
                  <CardDescription>
                    Temperature monitoring across all {digesters.length} digesters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicComparisonChart
                    data={chartData}
                    digesters={digesters}
                    metric="Temp"
                    yAxisDomain={[30, 40]}
                    unit=" (°C)"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pressure Comparison</CardTitle>
                  <CardDescription>
                    Pressure monitoring across all {digesters.length} digesters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicComparisonChart
                    data={chartData}
                    digesters={digesters}
                    metric="Production"
                    unit=" (kPa)"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDigesterMonitoring;