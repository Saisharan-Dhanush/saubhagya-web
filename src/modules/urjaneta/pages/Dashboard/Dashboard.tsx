import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, DollarSign, Zap, Target, Activity, Mic, Brain } from 'lucide-react';

interface KPIMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const kpiMetrics: KPIMetric[] = [
    {
      label: 'Total CBG Production',
      value: '2,450 m³',
      change: '+12.5%',
      trend: 'up',
      icon: <Zap className="h-6 w-6" />
    },
    {
      label: 'Monthly Revenue',
      value: '₹8.2L',
      change: '+8.3%',
      trend: 'up',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      label: 'Carbon Credits',
      value: '145.5 tCO2e',
      change: '+15.2%',
      trend: 'up',
      icon: <Target className="h-6 w-6" />
    },
    {
      label: 'Operational Efficiency',
      value: '89.2%',
      change: '+2.1%',
      trend: 'up',
      icon: <Activity className="h-6 w-6" />
    },
    {
      label: 'Active Clusters',
      value: '12',
      change: '0%',
      trend: 'stable',
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      label: 'Growth Rate',
      value: '23.4%',
      change: '+4.7%',
      trend: 'up',
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  const getTrendBadge = (trend: KPIMetric['trend'], change: string) => {
    switch (trend) {
      case 'up':
        return <Badge className="bg-green-500">{change}</Badge>;
      case 'down':
        return <Badge className="bg-red-500">{change}</Badge>;
      case 'stable':
        return <Badge className="bg-gray-500">{change}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time business intelligence and strategic insights
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice Query
          </Button>
          <Button className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="mt-2 flex items-center space-x-2">
                {getTrendBadge(metric.trend, metric.change)}
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
            <CardDescription>
              Daily CBG production across all clusters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive Chart Placeholder</p>
                <p className="text-xs text-gray-400">Production trending +12% this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>
              Revenue breakdown by source and cluster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">CBG Sales</p>
                  <p className="text-sm text-muted-foreground">Primary revenue</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹6.8L</p>
                  <Badge className="bg-green-500">+15%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Carbon Credits</p>
                  <p className="text-sm text-muted-foreground">Environmental revenue</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹1.2L</p>
                  <Badge className="bg-green-500">+22%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Slurry Sales</p>
                  <p className="text-sm text-muted-foreground">Organic fertilizer</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹0.2L</p>
                  <Badge className="bg-green-500">+8%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mathura Cluster</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">98.5%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Vrindavan Cluster</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">95.2%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Goverdhan Cluster</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500">87.8%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Next month production: 2,680 m³
                </p>
                <p className="text-xs text-blue-600">+9.4% predicted growth</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Revenue forecast: ₹9.1L
                </p>
                <p className="text-xs text-green-600">+11% increase expected</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-800">
                  Maintenance alert: 3 units
                </p>
                <p className="text-xs text-orange-600">Schedule within 7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Generate Monthly Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Voice Query Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export Dashboard Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Schedule Strategic Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
export { Dashboard };