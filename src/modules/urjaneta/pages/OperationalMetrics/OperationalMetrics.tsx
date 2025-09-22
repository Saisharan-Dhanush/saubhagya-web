import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Clock, AlertTriangle } from 'lucide-react';

const OperationalMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operational Metrics</h1>
        <p className="text-muted-foreground">
          Production analytics, quality metrics, and operational efficiency tracking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Rate</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450 m³/day</div>
            <div className="mt-2">
              <Badge className="bg-green-500">+12.5%</Badge>
              <span className="text-xs text-muted-foreground ml-2">vs target</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <div className="mt-2">
              <Badge className="bg-green-500">Excellent</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <div className="mt-2">
              <Badge className="bg-purple-500">Optimal</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="mt-2">
              <Badge className="bg-yellow-500">Minor</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cluster Performance Overview</CardTitle>
          <CardDescription>Real-time operational metrics across all production clusters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Mathura Cluster', production: '850 m³', efficiency: 98.5, quality: 'A+', status: 'optimal' },
              { name: 'Vrindavan Cluster', production: '780 m³', efficiency: 95.2, quality: 'A', status: 'good' },
              { name: 'Goverdhan Cluster', production: '820 m³', efficiency: 87.8, quality: 'A-', status: 'attention' }
            ].map((cluster, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{cluster.name}</h3>
                  <p className="text-sm text-muted-foreground">Production: {cluster.production}</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{cluster.efficiency}%</div>
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary">{cluster.quality}</Badge>
                  <p className="text-xs text-muted-foreground">Quality Grade</p>
                </div>
                <div className="text-center">
                  <Badge className={`${
                    cluster.status === 'optimal' ? 'bg-green-500' :
                    cluster.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}>
                    {cluster.status === 'optimal' ? 'Optimal' :
                     cluster.status === 'good' ? 'Good' : 'Needs Attention'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationalMetrics;
export { OperationalMetrics };