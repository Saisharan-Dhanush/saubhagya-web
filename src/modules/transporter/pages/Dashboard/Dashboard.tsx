import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Fuel,
  TrendingUp,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { transporterService } from '../../services/mockDataService';
import { DashboardStats, AlertNotification } from '../../types';

interface DashboardMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: 'success' | 'warning' | 'danger' | 'info';
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, alertsResponse] = await Promise.all([
          transporterService.getDashboardStats(),
          transporterService.getAlerts()
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (alertsResponse.success) {
          setAlerts(alertsResponse.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getDashboardMetrics = (): DashboardMetric[] => {
    if (!stats) return [];

    return [
      {
        label: 'Active Deliveries',
        value: stats.activeDeliveries,
        icon: <Truck className="h-6 w-6" />,
        status: 'info',
        trend: { value: 12, isPositive: true }
      },
      {
        label: 'Completed Today',
        value: stats.completedToday,
        icon: <CheckCircle className="h-6 w-6" />,
        status: 'success',
        trend: { value: 8, isPositive: true }
      },
      {
        label: 'Pending Schedules',
        value: stats.pendingSchedules,
        icon: <Clock className="h-6 w-6" />,
        status: 'warning',
        trend: { value: 5, isPositive: false }
      },
      {
        label: 'Vehicles On Route',
        value: stats.vehiclesOnRoute,
        icon: <MapPin className="h-6 w-6" />,
        status: 'info'
      },
      {
        label: 'Avg Delivery Time',
        value: `${stats.averageDeliveryTime}min`,
        icon: <Activity className="h-6 w-6" />,
        status: 'success',
        trend: { value: 3, isPositive: true }
      },
      {
        label: 'On-Time Rate',
        value: `${stats.onTimeDeliveryRate}%`,
        icon: <TrendingUp className="h-6 w-6" />,
        status: stats.onTimeDeliveryRate >= 90 ? 'success' : 'warning',
        trend: { value: 2.5, isPositive: true }
      },
      {
        label: 'Revenue Today',
        value: `₹${(stats.revenueToday / 1000).toFixed(0)}K`,
        icon: <DollarSign className="h-6 w-6" />,
        status: 'success',
        trend: { value: 15, isPositive: true }
      },
      {
        label: 'Fuel Consumption',
        value: `${stats.fuelConsumption}L`,
        icon: <Fuel className="h-6 w-6" />,
        status: 'info',
        trend: { value: 8, isPositive: false }
      }
    ];
  };

  const getStatusBadge = (status: DashboardMetric['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  const getAlertSeverityColor = (severity: AlertNotification['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'high':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const getAlertIcon = (type: AlertNotification['type']) => {
    switch (type) {
      case 'delivery_delay':
        return <Clock className="h-4 w-4" />;
      case 'vehicle_breakdown':
        return <AlertTriangle className="h-4 w-4" />;
      case 'route_issue':
        return <MapPin className="h-4 w-4" />;
      case 'maintenance_due':
        return <Truck className="h-4 w-4" />;
      case 'customer_complaint':
        return <Users className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time biogas delivery operations overview
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time biogas delivery operations overview
          </p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dashboardMetrics = getDashboardMetrics();
  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transport Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time biogas delivery operations overview
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${getStatusBadge(metric.status)} bg-opacity-10`}>
                <div className={`${getStatusBadge(metric.status)} bg-opacity-100 text-white rounded p-1`}>
                  {metric.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.trend && (
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-3 w-3 mr-1 ${
                    metric.trend.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'
                  }`} />
                  <span className={`text-xs ${
                    metric.trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend.isPositive ? '+' : ''}{metric.trend.value}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>System Alerts</span>
                  {unreadAlerts.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadAlerts.length}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Issues requiring attention
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs opacity-90 mt-1">{alert.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-75">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                          {alert.actionRequired && (
                            <Badge variant="outline" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {!alert.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No alerts at this time
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Truck className="h-6 w-6" />
                <span className="text-sm">Add Delivery</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MapPin className="h-6 w-6" />
                <span className="text-sm">Optimize Route</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Assign Driver</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Activity className="h-6 w-6" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>This month's metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">On-Time Deliveries</span>
                <span className="text-sm font-bold text-green-600">
                  {stats?.onTimeDeliveryRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats?.onTimeDeliveryRate}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Delivery Time</span>
                <span className="text-sm font-bold text-blue-600">
                  {stats?.averageDeliveryTime}min
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-sm font-bold text-purple-600">4.6/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Vehicle utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Vehicles</span>
                <Badge className="bg-green-500">6</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Under Maintenance</span>
                <Badge className="bg-yellow-500">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Idle Vehicles</span>
                <Badge className="bg-gray-500">2</Badge>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Fuel className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Fleet Efficiency: 87%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
            <CardDescription>Financial overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Today</span>
                  <span className="text-sm font-bold">
                    ₹{(stats?.revenueToday || 0).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-green-600">+15% from yesterday</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">This Month</span>
                  <span className="text-sm font-bold">₹24.8L</span>
                </div>
                <div className="text-xs text-green-600">+8% from last month</div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Profit Margin
                  </span>
                  <span className="text-sm font-bold text-green-800">32%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
export { Dashboard };