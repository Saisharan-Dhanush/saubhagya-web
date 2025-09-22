import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Package,
  DollarSign,
  AlertTriangle,
  Calendar,
  Truck,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { salesService } from '../services/salesService';
import { SalesMetrics, InventoryItem, Order, Customer } from '../types';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
  status?: 'positive' | 'negative' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, description, status = 'neutral' }) => {
  const getChangeColor = () => {
    if (change === undefined) return 'text-gray-500';
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = () => {
    if (change === undefined) return null;
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}>
            {getChangeIcon()}
            <span>{Math.abs(change)}% from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

interface RecentOrderProps {
  order: Order;
}

const RecentOrderItem: React.FC<RecentOrderProps> = ({ order }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{order.orderNumber}</span>
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        </div>
        <div className="text-sm text-gray-600">
          {order.items[0]?.gasType} • {order.totalQuantity.toLocaleString()} units
        </div>
        <div className="text-xs text-gray-500">
          {order.orderDate.toLocaleDateString()}
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">₹{order.finalAmount.toLocaleString()}</div>
        <div className="text-sm text-gray-600">
          Due: {order.requestedDeliveryDate.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

interface InventoryAlertProps {
  item: InventoryItem;
}

const InventoryAlert: React.FC<InventoryAlertProps> = ({ item }) => {
  const getAlertType = () => {
    const usagePercentage = ((item.quantity - item.availableQuantity) / item.quantity) * 100;
    if (usagePercentage > 80) return { color: 'text-red-600', level: 'Critical' };
    if (usagePercentage > 60) return { color: 'text-yellow-600', level: 'Warning' };
    return { color: 'text-blue-600', level: 'Info' };
  };

  const alert = getAlertType();

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center space-x-3">
        <AlertTriangle className={`w-5 h-5 ${alert.color}`} />
        <div>
          <div className="font-medium">{item.batchNumber}</div>
          <div className="text-sm text-gray-600">
            {item.gasType} • Available: {item.availableQuantity.toLocaleString()} {item.unit}
          </div>
          <div className="text-xs text-gray-500">
            PESO: {item.pesoCompliance.status}
          </div>
        </div>
      </div>
      <div className="text-right">
        <Badge className={alert.color.includes('red') ? 'bg-red-100 text-red-800' :
                          alert.color.includes('yellow') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}>
          {alert.level}
        </Badge>
        <div className="text-sm text-gray-600 mt-1">
          ₹{(item.availableQuantity * item.pricePerUnit).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// Performance data with varied statuses for realistic dashboard
const performanceData = [
  { metric: "Delivery Success", current: 98.5, target: 98 }, // Green - Target Achieved
  { metric: "Customer Satisfaction", current: 87, target: 90 }, // Yellow - Near Target
  { metric: "Order Fulfillment", current: 95.2, target: 95 }, // Green - Target Achieved
  { metric: "Payment Collection", current: 82, target: 95 }, // Red - Below Target
];

// Sample data for simple charts - Realistic revenue figures in thousands
const revenueData = [
  { month: "Jan", value: 1850 },
  { month: "Feb", value: 2305 },
  { month: "Mar", value: 1870 },
  { month: "Apr", value: 2450 },
  { month: "May", value: 2890 },
  { month: "Jun", value: 3140 },
];

const gasTypeData = [
  { type: "Biogas", percentage: 45, color: "bg-blue-500" },
  { type: "CBG", percentage: 30, color: "bg-green-500" },
  { type: "Methane", percentage: 25, color: "bg-purple-500" },
];

const customerGrowthData = [
  { month: "Jan", customers: 12 },
  { month: "Feb", customers: 18 },
  { month: "Mar", customers: 15 },
  { month: "Apr", customers: 22 },
  { month: "May", customers: 25 },
  { month: "Jun", customers: 28 },
];

// Simple Bar Chart Component
const SimpleBarChart: React.FC<{ data: any[], title: string }> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value || d.customers));

  return (
    <div className="space-y-4">
      <div className="relative h-48 flex items-end justify-between space-x-1 bg-gray-50 p-4 rounded-lg">
        {data.map((item, index) => {
          const value = item.value || item.customers;
          const height = (value / maxValue) * 80; // Use 80% of container height
          const isRevenue = item.value !== undefined;
          const displayValue = isRevenue ? `₹${(value/1000).toFixed(1)}K` : value.toString();

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              {/* Value label above bar */}
              <div className="text-xs font-semibold text-gray-700 mb-2 absolute -top-6">
                {displayValue}
              </div>

              {/* Bar container */}
              <div className="w-full flex flex-col items-center">
                {/* Actual bar */}
                <div
                  className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-700 hover:to-blue-500 shadow-md border border-blue-300"
                  style={{
                    height: `${Math.max(height, 12)}px`,
                    minHeight: '12px'
                  }}
                  title={`${item.month}: ${displayValue}`}
                />

                {/* Month label */}
                <span className="text-xs text-gray-600 font-medium mt-2">{item.month}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart info */}
      <div className="text-xs text-gray-500 text-center">
        Peak: {title.includes('Revenue') ? `₹${(maxValue/1000).toFixed(1)}K` : maxValue} •
        Growth: {title.includes('Revenue') ? '+69.7%' : '+133%'} vs Jan
      </div>
    </div>
  );
};

// Simple Pie Chart Component (using simple bars for reliability)
const SimplePieChart: React.FC<{ data: any[], title: string }> = ({ data, title }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-gray-600">{item.type}</span>
              </div>
              <span className="font-medium">{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SalesDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsResponse, ordersResponse, inventoryResponse] = await Promise.all([
        salesService.getSalesMetrics(),
        salesService.getOrders(),
        salesService.getInventory()
      ]);

      if (metricsResponse.success) {
        setMetrics(metricsResponse.data);
      }

      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data.slice(0, 5));
      }

      if (inventoryResponse.success) {
        // Filter for items that need attention
        const alertItems = inventoryResponse.data.filter(item => {
          const usagePercentage = ((item.quantity - item.availableQuantity) / item.quantity) * 100;
          return usagePercentage > 60 || item.pesoCompliance.status !== 'valid';
        });
        setInventoryAlerts(alertItems.slice(0, 5));
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your biogas sales performance and operations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right text-sm">
            <div className="text-muted-foreground">Last updated</div>
            <div className="font-semibold">{lastUpdated.toLocaleTimeString()}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`₹${(metrics.totalRevenue / 1000000).toFixed(1)}M`}
            change={metrics.periodComparison.revenue.change}
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
            description="Monthly revenue growth"
          />
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders}
            change={metrics.periodComparison.orders.change}
            icon={<FileText className="w-5 h-5 text-blue-600" />}
            description="Orders processed"
          />
          <MetricCard
            title="Active Customers"
            value={metrics.totalCustomers}
            change={metrics.periodComparison.customers.change}
            icon={<Users className="w-5 h-5 text-purple-600" />}
            description="Customer base growth"
          />
          <MetricCard
            title="Avg Order Value"
            value={`₹${(metrics.averageOrderValue / 1000).toFixed(0)}K`}
            icon={<Package className="w-5 h-5 text-orange-600" />}
            description="Per order average"
          />
        </div>
      )}

      {/* Performance Metrics and Revenue Trend in Half Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Half-size Performance Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {performanceData.map((item) => {
              const percentage = (item.current / item.target) * 100;
              const isOnTarget = item.current >= item.target;
              const isNearTarget = item.current >= item.target * 0.9;

              return (
                <div key={item.metric} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-700">{item.metric}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">
                        {item.current}% / {item.target}%
                      </span>
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center text-xs ${
                        isOnTarget
                          ? 'bg-green-100 text-green-700'
                          : isNearTarget
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {isOnTarget ? '✓' : isNearTarget ? '!' : '⚠'}
                      </div>
                    </div>
                  </div>

                  {/* Mini Progress bar */}
                  <div className="relative w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isOnTarget
                          ? 'bg-green-500'
                          : isNearTarget
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Revenue Trend</span>
            </CardTitle>
            <CardDescription className="text-xs">6-month revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={revenueData} title="Monthly Revenue" />
          </CardContent>
        </Card>
      </div>

      {/* Other Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gas Type Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <PieChart className="w-4 h-4 text-green-600" />
              <span>Gas Type Mix</span>
            </CardTitle>
            <CardDescription className="text-xs">Distribution by gas type</CardDescription>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={gasTypeData} title="Gas Types" />
          </CardContent>
        </Card>

        {/* Customer Growth */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Customer Growth</span>
            </CardTitle>
            <CardDescription className="text-xs">New customers per month</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={customerGrowthData} title="New Customers" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Recent Orders</span>
            </CardTitle>
            <CardDescription>Latest order activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <RecentOrderItem key={order.id} order={order} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No recent orders available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Inventory Alerts</span>
            </CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryAlerts.length > 0 ? (
                inventoryAlerts.map((item) => (
                  <InventoryAlert key={item.id} item={item} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No inventory alerts at this time
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default SalesDashboard;