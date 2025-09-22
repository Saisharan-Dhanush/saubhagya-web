import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Users,
  Server,
  AlertTriangle,
  Database,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Zap,
  Wifi,
  HardDrive,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface SystemMetric {
  label: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time metrics with progress values
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpuUsage: 68,
    memoryUsage: 84,
    diskUsage: 45,
    networkLatency: 12,
    uptime: 99.7,
    throughput: 1247
  });

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        cpuUsage: Math.max(50, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(70, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        diskUsage: Math.max(35, Math.min(60, prev.diskUsage + (Math.random() - 0.5) * 5)),
        networkLatency: Math.max(8, Math.min(25, prev.networkLatency + (Math.random() - 0.5) * 3)),
        uptime: Math.max(99.0, Math.min(99.9, prev.uptime + (Math.random() - 0.5) * 0.2)),
        throughput: Math.max(1000, Math.min(1500, prev.throughput + (Math.random() - 0.5) * 100))
      }));
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const systemMetrics: SystemMetric[] = [
    {
      label: 'Active Users',
      value: '247',
      status: 'healthy',
      icon: <Users className="h-6 w-6" />
    },
    {
      label: 'Auth Service',
      value: 'Online',
      status: 'healthy',
      icon: <Server className="h-6 w-6" />
    },
    {
      label: 'IoT Service',
      value: 'Online',
      status: 'healthy',
      icon: <Activity className="h-6 w-6" />
    },
    {
      label: 'System Alerts',
      value: '3',
      status: 'warning',
      icon: <AlertTriangle className="h-6 w-6" />
    },
    {
      label: 'Database',
      value: '98.5%',
      status: 'healthy',
      icon: <Database className="h-6 w-6" />
    },
    {
      label: 'Last Backup',
      value: '2h ago',
      status: 'healthy',
      icon: <Clock className="h-6 w-6" />
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 2000);
  };

  const getStatusBadge = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-500">Critical</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and system health monitoring
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right text-sm">
            <div className="text-gray-500">Last updated</div>
            <div className="font-medium">{lastUpdated.toLocaleTimeString()}</div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* System Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="mt-2">
                {getStatusBadge(metric.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics with Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Real-time Performance Metrics</span>
          </CardTitle>
          <CardDescription>
            Live system resource utilization and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CPU Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <span className="text-sm font-bold">{realTimeMetrics.cpuUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    realTimeMetrics.cpuUsage > 80 ? 'bg-red-500' :
                    realTimeMetrics.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${realTimeMetrics.cpuUsage}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {realTimeMetrics.cpuUsage > 80 ? 'High usage detected' : 'Normal operation'}
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <span className="text-sm font-bold">{realTimeMetrics.memoryUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    realTimeMetrics.memoryUsage > 90 ? 'bg-red-500' :
                    realTimeMetrics.memoryUsage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${realTimeMetrics.memoryUsage}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {realTimeMetrics.memoryUsage > 90 ? 'Critical memory usage' : 'Acceptable usage'}
              </div>
            </div>

            {/* Disk Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Disk Usage</span>
                </div>
                <span className="text-sm font-bold">{realTimeMetrics.diskUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    realTimeMetrics.diskUsage > 80 ? 'bg-red-500' :
                    realTimeMetrics.diskUsage > 60 ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${realTimeMetrics.diskUsage}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {realTimeMetrics.diskUsage > 80 ? 'Monitor disk space' : 'Plenty of space available'}
              </div>
            </div>

            {/* Network Latency */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Network Latency</span>
                </div>
                <span className="text-sm font-bold">{realTimeMetrics.networkLatency.toFixed(0)}ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    realTimeMetrics.networkLatency > 30 ? 'bg-red-500' :
                    realTimeMetrics.networkLatency > 15 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${(realTimeMetrics.networkLatency / 50) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {realTimeMetrics.networkLatency > 20 ? 'High latency detected' : 'Low latency - optimal'}
              </div>
            </div>

            {/* System Uptime */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">System Uptime</span>
                </div>
                <span className="text-sm font-bold">{realTimeMetrics.uptime.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    realTimeMetrics.uptime > 99.5 ? 'bg-green-500' :
                    realTimeMetrics.uptime > 99.0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${realTimeMetrics.uptime}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                Excellent availability rating
              </div>
            </div>

            {/* Throughput */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Throughput</span>
                </div>
                <span className="text-sm font-bold">{realTimeMetrics.throughput.toFixed(0)} req/min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    realTimeMetrics.throughput > 1400 ? 'bg-green-500' :
                    realTimeMetrics.throughput > 1000 ? 'bg-blue-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(realTimeMetrics.throughput / 2000) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {realTimeMetrics.throughput > 1400 ? 'High traffic volume' : 'Normal traffic levels'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest system events and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">New user registration</p>
                  <p className="text-xs text-green-700">Ram Kumar - Field Worker • 2 minutes ago</p>
                </div>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">System backup completed</p>
                  <p className="text-xs text-blue-700">Database backup successful • 15 minutes ago</p>
                </div>
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">Device calibration due</p>
                  <p className="text-xs text-yellow-700">IoT Sensor #247 requires attention • 1 hour ago</p>
                </div>
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-800">Data sync completed</p>
                  <p className="text-xs text-purple-700">Gaushala cluster data synchronized • 2 hours ago</p>
                </div>
                <RefreshCw className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>System Alerts</span>
              <Badge className="bg-yellow-500">3 Active</Badge>
            </CardTitle>
            <CardDescription>
              Issues requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      High memory usage on IoT Service
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Memory usage: {realTimeMetrics.memoryUsage.toFixed(1)}% • Action required
                    </p>
                  </div>
                  <Badge className="bg-yellow-600">High</Badge>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-yellow-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-yellow-600 rounded-full transition-all duration-500"
                      style={{ width: `${realTimeMetrics.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">
                      Scheduled maintenance reminder
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Database maintenance window in 2 days • Plan accordingly
                    </p>
                  </div>
                  <Badge className="bg-blue-600">Medium</Badge>
                </div>
              </div>

              <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">
                      SSL certificate expiring soon
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      Certificate expires in 30 days • Renewal needed
                    </p>
                  </div>
                  <Badge className="bg-orange-600">Low</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Statistics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>Platform Statistics</span>
          </CardTitle>
          <CardDescription>
            Comprehensive SAUBHAGYA platform metrics and KPIs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">2,450</div>
              <div className="text-sm text-blue-700">CBG Production (m³)</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">89.2%</div>
              <div className="text-sm text-green-700">Operational Efficiency</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+2.1%</span>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">12</div>
              <div className="text-sm text-purple-700">Active Clusters</div>
              <div className="flex items-center justify-center mt-2">
                <div className="w-4 h-4 bg-purple-600 rounded-full mr-1"></div>
                <span className="text-xs text-purple-600">Stable</span>
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">145.5</div>
              <div className="text-sm text-orange-700">Carbon Credits (tCO2e)</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+8.3%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
export { Dashboard };