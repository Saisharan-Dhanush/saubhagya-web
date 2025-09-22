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
  chartData?: any[];
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
// Mock hook for digester data
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
      trends: { methane: 2, production: 5 },
      chartData: []
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
      trends: { methane: 1, production: 3 },
      chartData: []
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

// Mock MetricsChart component
const MetricsChart: React.FC<{ data: any[]; type: string; height: number }> = ({ data, type, height }) => (
  <div style={{ height }} className="flex items-center justify-center bg-gray-100 rounded">
    <p className="text-gray-500">Chart: {type} (Mock)</p>
  </div>
);

interface DigesterMonitoringProps {
  languageContext?: {
    language: 'hi' | 'en';
    t: (key: string) => string;
  };
}

const translations = {
  en: {
    title: 'Digester Monitoring',
    subtitle: 'Real-time biogas production monitoring and analytics',
    overview: 'Overview',
    details: 'Details',
    alerts: 'Alerts',
    refresh: 'Refresh Data',
    temperature: 'Temperature',
    pressure: 'Pressure',
    methane: 'Methane Level',
    gasProduction: 'Gas Production',
    efficiency: 'Efficiency',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Maintenance',
    optimal: 'Optimal',
    warning: 'Warning',
    critical: 'Critical',
    lastUpdated: 'Last Updated',
    viewTrends: 'View Trends',
    dailyProduction: 'Daily Production',
    weeklyTrends: 'Weekly Trends',
    monthlyAnalysis: 'Monthly Analysis'
  },
  hi: {
    title: 'डाइजेस्टर निगरानी',
    subtitle: 'वास्तविक समय बायोगैस उत्पादन निगरानी और विश्लेषण',
    overview: 'अवलोकन',
    details: 'विवरण',
    alerts: 'अलर्ट',
    refresh: 'डेटा रीफ्रेश करें',
    temperature: 'तापमान',
    pressure: 'दबाव',
    methane: 'मीथेन स्तर',
    gasProduction: 'गैस उत्पादन',
    efficiency: 'दक्षता',
    status: 'स्थिति',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    maintenance: 'रखरखाव',
    optimal: 'इष्टतम',
    warning: 'चेतावनी',
    critical: 'गंभीर',
    lastUpdated: 'अंतिम अपडेट',
    viewTrends: 'रुझान देखें',
    dailyProduction: 'दैनिक उत्पादन',
    weeklyTrends: 'साप्ताहिक रुझान',
    monthlyAnalysis: 'मासिक विश्लेषण'
  }
};

const getStatusColor = (status: string | undefined): string => {
  if (!status) return 'bg-gray-100 text-gray-800';

  switch (status.toLowerCase()) {
    case 'active':
    case 'optimal':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'critical':
    case 'maintenance':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getAlertIcon = (level: AlertLevel) => {
  switch (level) {
    case 'critical':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info':
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    default:
      return <CheckCircle className="w-4 h-4 text-green-500" />;
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

export const DigesterMonitoring: React.FC<DigesterMonitoringProps> = ({ languageContext }) => {
  const [selectedDigester, setSelectedDigester] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const lang = languageContext?.language || 'en';
  const t = (key: string): string => {
    return languageContext?.t(key) || translations[lang][key as keyof typeof translations[typeof lang]] || key;
  };
  // Use the mock hook for digester data
  const { digesters, alerts, refreshData, isLoading } = useDigesterData();


  useEffect(() => {
    // Auto-refresh every 30 seconds
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button 
          onClick={() => refreshData()} 
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Digesters</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{digesters.length}</div>
            <p className="text-xs text-muted-foreground">
              {digesters.filter(d => d.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dailyProduction')}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">{t('efficiency')}</CardTitle>
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
            <CardTitle className="text-sm font-medium">{t('alerts')}</CardTitle>
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

          {/* Production Trends */}
          <Card>
            <CardHeader>
              <CardTitle>{t('weeklyTrends')}</CardTitle>
              <CardDescription>
                Gas production and efficiency trends over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsChart 
                data={digesters[0]?.chartData || []} 
                type="production"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Detailed Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Metrics</CardTitle>
                <CardDescription>
                  Comprehensive digester performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {digesters.map((digester) => (
                    <div key={digester.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{digester.name}</h4>
                        <Badge className={getStatusColor(digester.status)}>
                          {t(digester.status.toLowerCase())}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Temperature:</span>
                          <span className="ml-2 font-medium">{digester.temperature}°C</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pressure:</span>
                          <span className="ml-2 font-medium">{digester.pressure} kPa</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CH4 Level:</span>
                          <span className="ml-2 font-medium">{digester.methaneLevel}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Production:</span>
                          <span className="ml-2 font-medium">{digester.dailyProduction} m³</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t('monthlyAnalysis')}</CardTitle>
                <CardDescription>
                  Monthly production and efficiency analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MetricsChart 
                  data={digesters[0]?.chartData || []} 
                  type="efficiency"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Real-time system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>No active alerts. All systems running optimally.</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      {getAlertIcon(alert.level)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge className={getStatusColor(alert.level)}>
                            {alert.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Digester: {alert.digesterId}</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigesterMonitoring;