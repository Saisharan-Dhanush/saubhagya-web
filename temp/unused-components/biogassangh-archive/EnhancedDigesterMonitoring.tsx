import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Activity,
  Thermometer,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Droplets,
  BarChart3,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Filter,
  Download
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar
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

// Modern color palette
const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  muted: '#6b7280'
};

const STATUS_COLORS = {
  active: '#10b981',
  maintenance: '#f59e0b',
  offline: '#ef4444'
};

// Mock data
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

// Modern KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  className?: string;
}> = ({ title, value, change, trend, icon, className = '' }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          {change}
        </div>
      </CardContent>
    </Card>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { variant: 'default' as const, className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' };
      case 'maintenance':
        return { variant: 'secondary' as const, className: 'bg-amber-100 text-amber-800 hover:bg-amber-100' };
      case 'offline':
        return { variant: 'destructive' as const, className: 'bg-red-100 text-red-800 hover:bg-red-100' };
      default:
        return { variant: 'outline' as const, className: '' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const { digesters, alerts } = useDigesterData();

  const totalProduction = digesters.reduce((sum, d) => sum + d.dailyProduction, 0);
  const averageEfficiency = digesters.reduce((sum, d) => sum + d.efficiency, 0) / digesters.length;
  const activeDigesters = digesters.filter(d => d.status === 'active').length;
  const avgTemperature = digesters.reduce((sum, d) => sum + d.temperature, 0) / digesters.length;
  const avgMethane = digesters.reduce((sum, d) => sum + d.methaneLevel, 0) / digesters.length;

  // Chart data
  const productionTrend = [
    { time: '06:00', production: 120, target: 130 },
    { time: '09:00', production: 180, target: 185 },
    { time: '12:00', production: 250, target: 240 },
    { time: '15:00', production: 320, target: 310 },
    { time: '18:00', production: 380, target: 370 },
    { time: '21:00', production: 445, target: 420 }
  ];

  const statusData = [
    { name: 'Active', value: digesters.filter(d => d.status === 'active').length, color: STATUS_COLORS.active },
    { name: 'Maintenance', value: digesters.filter(d => d.status === 'maintenance').length, color: STATUS_COLORS.maintenance },
    { name: 'Offline', value: digesters.filter(d => d.status === 'offline').length, color: STATUS_COLORS.offline }
  ].filter(item => item.value > 0);

  const efficiencyData = digesters.map(d => ({
    name: d.name.replace('Digester ', ''),
    efficiency: d.efficiency,
    target: 85
  }));

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">BiogasSangh Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time cluster monitoring and analytics • Last updated {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Production"
            value={`${totalProduction.toFixed(1)} m³`}
            change="+12% from yesterday"
            trend="up"
            icon={<Droplets className="h-4 w-4 text-primary" />}
          />
          <KPICard
            title="Average Efficiency"
            value={`${averageEfficiency.toFixed(1)}%`}
            change="+2.1% from last week"
            trend="up"
            icon={<BarChart3 className="h-4 w-4 text-primary" />}
          />
          <KPICard
            title="Active Digesters"
            value={`${activeDigesters}/${digesters.length}`}
            change="All systems operational"
            trend="neutral"
            icon={<Activity className="h-4 w-4 text-primary" />}
          />
          <KPICard
            title="Active Alerts"
            value={alerts.length.toString()}
            change="1 requires attention"
            trend="down"
            icon={<AlertTriangle className="h-4 w-4 text-primary" />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Production Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Daily Production Trend
                  </CardTitle>
                  <CardDescription>
                    Cumulative biogas production vs target
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  +8.2% above target
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={productionTrend}>
                  <defs>
                    <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="production"
                    stroke={CHART_COLORS.primary}
                    fill="url(#productionGradient)"
                    strokeWidth={3}
                    name="Actual Production"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke={CHART_COLORS.muted}
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current operational distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Digester Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Digester Performance</CardTitle>
              <CardDescription>Efficiency comparison vs target (85%)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar
                    dataKey="efficiency"
                    fill={CHART_COLORS.primary}
                    radius={[4, 4, 0, 0]}
                    name="Current Efficiency"
                  />
                  <Bar
                    dataKey="target"
                    fill={CHART_COLORS.muted}
                    radius={[4, 4, 0, 0]}
                    opacity={0.3}
                    name="Target"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Live Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Live System Metrics</CardTitle>
              <CardDescription>Real-time operational parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span>Average Temperature</span>
                  </div>
                  <span className="font-medium">{avgTemperature.toFixed(1)}°C</span>
                </div>
                <Progress value={(avgTemperature / 40) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: 30°C</span>
                  <span>Optimal: 35-37°C</span>
                  <span>Max: 40°C</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Average Methane Level</span>
                  </div>
                  <span className="font-medium">{avgMethane.toFixed(1)}%</span>
                </div>
                <Progress value={avgMethane} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low: 0%</span>
                  <span>Target: 60-70%</span>
                  <span>High: 100%</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{totalProduction.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">Total m³/day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{activeDigesters}</div>
                  <div className="text-xs text-muted-foreground">Active Units</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>Latest system notifications and warnings</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg border bg-amber-50/50 border-amber-200">
                  <Avatar className="h-8 w-8 bg-amber-100">
                    <AvatarFallback>
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-amber-900">{alert.title}</p>
                      <StatusBadge status={alert.level} />
                    </div>
                    <p className="text-sm text-amber-700">{alert.message}</p>
                    <p className="text-xs text-amber-600 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Resolve
                  </Button>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-emerald-500" />
                  <h3 className="font-medium text-lg mb-2">All systems operational</h3>
                  <p className="text-muted-foreground">No active alerts or warnings</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const EnhancedDigesterMonitoring: React.FC = () => {
  return <DashboardOverview />;
};

export default EnhancedDigesterMonitoring;