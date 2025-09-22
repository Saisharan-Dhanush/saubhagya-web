import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Droplets,
  BarChart3,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  Factory,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Gauge,
  CheckCircle
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

// Type definitions for digester data
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

// Mock data for dashboard overview
const overviewData = {
  totalDigesters: 3,
  activeDigesters: 2,
  maintenanceDigesters: 1,
  totalProduction: 445.5, // m³
  averageEfficiency: 83.7, // %
  criticalAlerts: 0,
  warningAlerts: 1,
  totalBatches: 156,
  pendingPayments: 12,
  scheduledPickups: 8
};

// Mock digester data
const digestersData: DigesterData[] = [
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
];

const productionTrend = [
  { month: 'Jan', production: 380, efficiency: 85 },
  { month: 'Feb', production: 420, efficiency: 87 },
  { month: 'Mar', production: 445, efficiency: 84 },
  { month: 'Apr', production: 465, efficiency: 88 },
  { month: 'May', production: 445, efficiency: 86 }
];

const statusDistribution = [
  { name: 'Active', value: 2, color: '#22c55e' },
  { name: 'Maintenance', value: 1, color: '#f59e0b' },
  { name: 'Offline', value: 0, color: '#ef4444' }
];

const KPICard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  className?: string;
}> = ({ title, value, change, trend, icon, className = '' }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />;
      case 'down': return <TrendingDown className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
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

const DigesterCard: React.FC<{ digester: DigesterData }> = ({ digester }) => {
  const statusColor = digester.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                     digester.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                     'bg-red-100 text-red-800 border-red-200';

  const statusIcon = digester.status === 'active' ? CheckCircle : AlertTriangle;
  const StatusIcon = statusIcon;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
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

const StatusBadge: React.FC<{ status: string; count: number }> = ({ status, count }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={`${getStatusColor()} px-2 py-1`}>
      {count} {status}
    </Badge>
  );
};

export const EnhancedBiogasDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between -mt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">BiogasSangh Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of cluster operations and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Production"
          value={`${overviewData.totalProduction} m³`}
          change="+12% from last month"
          trend="up"
          icon={<Droplets className="h-4 w-4 text-blue-600" />}
        />
        <KPICard
          title="Average Efficiency"
          value={`${overviewData.averageEfficiency}%`}
          change="+2.1% from last week"
          trend="up"
          icon={<Zap className="h-4 w-4 text-yellow-600" />}
        />
        <KPICard
          title="Active Digesters"
          value={`${overviewData.activeDigesters}/${overviewData.totalDigesters}`}
          change="1 in maintenance"
          trend="neutral"
          icon={<Factory className="h-4 w-4 text-green-600" />}
        />
        <KPICard
          title="Critical Alerts"
          value={overviewData.criticalAlerts.toString()}
          change={`${overviewData.warningAlerts} warnings`}
          trend="neutral"
          icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
        />
      </div>

      {/* 3 Digester Cards Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Live Digester Status</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {digestersData.map((digester) => (
            <DigesterCard key={digester.id} digester={digester} />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Production Trends - Takes up 4 columns */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
            <CardDescription>
              Monthly biogas production and efficiency over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="production"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Production (m³)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Efficiency (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Overview - Takes up 3 columns */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Digester Status</CardTitle>
            <CardDescription>
              Current operational status distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {statusDistribution.map((status) => (
                <StatusBadge
                  key={status.name}
                  status={status.name}
                  count={status.value}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Summaries */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.totalBatches}</div>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              +23 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.pendingPayments}</div>
            <Progress value={30} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              2 overdue items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Pickups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.scheduledPickups}</div>
            <Progress value={60} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Next pickup: Today 2:00 PM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <Progress value={95} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and notifications from the cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Digester Alpha-2 efficiency increased to 88%</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Batch #156 scheduled for pickup</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Payment reconciliation completed</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBiogasDashboard;