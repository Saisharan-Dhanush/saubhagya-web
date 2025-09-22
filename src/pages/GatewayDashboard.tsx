import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Shield, 
  Route, 
  Server, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface ServiceRoute {
  id: string;
  name: string;
  path: string;
  uri: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  responseTime: number;
  requestsPerMinute: number;
  errorRate: number;
  lastSeen: string;
}

interface GatewayMetrics {
  totalRequests: number;
  activeConnections: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
}

const GatewayDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [routes, setRoutes] = useState<ServiceRoute[]>([
    {
      id: 'auth-service',
      name: 'Authentication Service',
      path: '/api/auth/**',
      uri: 'lb://auth-service',
      status: 'healthy',
      responseTime: 45,
      requestsPerMinute: 120,
      errorRate: 0.2,
      lastSeen: '2024-01-15T10:30:00Z'
    },
    {
      id: 'iot-service',
      name: 'IoT Service',
      path: '/api/iot/**',
      uri: 'lb://iot-service',
      status: 'healthy',
      responseTime: 38,
      requestsPerMinute: 85,
      errorRate: 0.1,
      lastSeen: '2024-01-15T10:30:00Z'
    },
    {
      id: 'transaction-service',
      name: 'Transaction Service',
      path: '/api/transaction/**',
      uri: 'lb://transaction-service',
      status: 'warning',
      responseTime: 67,
      requestsPerMinute: 95,
      errorRate: 1.2,
      lastSeen: '2024-01-15T10:29:00Z'
    },
    {
      id: 'sales-service',
      name: 'Sales Service',
      path: '/api/sales/**',
      uri: 'lb://sales-service',
      status: 'healthy',
      responseTime: 42,
      requestsPerMinute: 78,
      errorRate: 0.3,
      lastSeen: '2024-01-15T10:30:00Z'
    },
    {
      id: 'reporting-service',
      name: 'Reporting Service',
      path: '/api/reporting/**',
      uri: 'lb://reporting-service',
      status: 'healthy',
      responseTime: 89,
      requestsPerMinute: 45,
      errorRate: 0.1,
      lastSeen: '2024-01-15T10:30:00Z'
    },
    {
      id: 'government-service',
      name: 'Government Service',
      path: '/api/government/**',
      uri: 'lb://government-service',
      status: 'error',
      responseTime: 156,
      requestsPerMinute: 32,
      errorRate: 5.8,
      lastSeen: '2024-01-15T10:25:00Z'
    }
  ]);

  const [metrics, setMetrics] = useState<GatewayMetrics>({
    totalRequests: 12450,
    activeConnections: 156,
    averageResponseTime: 73,
    errorRate: 1.2,
    throughput: 456
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Offline</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Gateway Dashboard</h1>
          <p className="text-muted-foreground">
            Spring Cloud Gateway Management & Monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Deploy Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Gateway Status Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last hour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeConnections}</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last hour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
                <p className="text-xs text-muted-foreground">
                  Target: &lt;50ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.errorRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Target: &lt;1%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Service Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Service Health Overview</CardTitle>
              <CardDescription>
                Real-time status of all microservices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {routes.map((route) => (
                  <div key={route.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    {getStatusIcon(route.status)}
                    <div className="flex-1">
                      <p className="font-medium">{route.name}</p>
                      <p className="text-sm text-muted-foreground">{route.path}</p>
                    </div>
                    {getStatusBadge(route.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Routes Configuration</CardTitle>
              <CardDescription>
                Manage routing rules and load balancing for all microservices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Path Pattern</TableHead>
                    <TableHead>URI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Requests/min</TableHead>
                    <TableHead>Error Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.name}</TableCell>
                      <TableCell className="font-mono text-sm">{route.path}</TableCell>
                      <TableCell className="font-mono text-sm">{route.uri}</TableCell>
                      <TableCell>{getStatusBadge(route.status)}</TableCell>
                      <TableCell>{route.responseTime}ms</TableCell>
                      <TableCell>{route.requestsPerMinute}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{route.errorRate}%</span>
                          <Progress value={route.errorRate * 10} className="w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Security Headers</CardTitle>
                <CardDescription>
                  Configure CORS, CSP, and HSTS policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cors-enabled">CORS Enabled</Label>
                  <Switch id="cors-enabled" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="csp-enabled">Content Security Policy</Label>
                  <Switch id="csp-enabled" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hsts-enabled">HSTS Enabled</Label>
                  <Switch id="hsts-enabled" defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Allowed Origins</Label>
                  <Input defaultValue="*" placeholder="Enter allowed origins" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limiting</CardTitle>
                <CardDescription>
                  Configure request throttling and limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Global Rate Limit (req/min)</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Burst Capacity</Label>
                  <Input type="number" defaultValue="2000" />
                </div>
                <div className="space-y-2">
                  <Label>IP Blacklist</Label>
                  <Input placeholder="Enter IP addresses (comma separated)" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>JWT Authentication</CardTitle>
              <CardDescription>
                Configure JWT token validation and forwarding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>JWT Secret Key</Label>
                  <Input type="password" placeholder="Enter JWT secret" />
                </div>
                <div className="space-y-2">
                  <Label>Token Expiry (minutes)</Label>
                  <Input type="number" defaultValue="60" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="jwt-forwarding" defaultChecked />
                <Label htmlFor="jwt-forwarding">Forward JWT tokens to microservices</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Real-time gateway performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Throughput</span>
                    <span>{metrics.throughput} req/s</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span>{metrics.averageResponseTime}ms</span>
                  </div>
                  <Progress value={metrics.averageResponseTime / 2} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span>{metrics.errorRate}%</span>
                  </div>
                  <Progress value={metrics.errorRate * 10} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Circuit Breaker Status</CardTitle>
                <CardDescription>
                  Service resilience and failover monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {routes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between">
                      <span className="text-sm">{route.name}</span>
                      <Badge variant={route.status === 'error' ? 'destructive' : 'default'}>
                        {route.status === 'error' ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Discovery</CardTitle>
              <CardDescription>
                Kubernetes service discovery and health monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <div className="text-sm text-muted-foreground">Healthy Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                  <div className="text-sm text-muted-foreground">Warning Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-muted-foreground">Error Services</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gateway Configuration</CardTitle>
              <CardDescription>
                Spring Cloud Gateway application.yml configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/api/auth/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
        
        - id: iot-service
          uri: lb://iot-service
          predicates:
            - Path=/api/iot/**
          filters:
            - StripPrefix=1
        
        - id: transaction-service
          uri: lb://transaction-service
          predicates:
            - Path=/api/transaction/**
          filters:
            - StripPrefix=1
        
        - id: sales-service
          uri: lb://sales-service
          predicates:
            - Path=/api/sales/**
          filters:
            - StripPrefix=1
        
        - id: reporting-service
          uri: lb://reporting-service
          predicates:
            - Path=/api/reporting/**
          filters:
            - StripPrefix=1
        
        - id: government-service
          uri: lb://government-service
          predicates:
            - Path=/api/government/**
          filters:
            - StripPrefix=1`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                  Configure gateway environment settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Server Port</Label>
                  <Input defaultValue="8080" />
                </div>
                <div className="space-y-2">
                  <Label>Log Level</Label>
                  <Input defaultValue="INFO" />
                </div>
                <div className="space-y-2">
                  <Label>Metrics Port</Label>
                  <Input defaultValue="9090" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment</CardTitle>
                <CardDescription>
                  Gateway deployment and scaling configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Replicas</Label>
                  <Input type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label>Memory Limit</Label>
                  <Input defaultValue="512Mi" />
                </div>
                <div className="space-y-2">
                  <Label>CPU Limit</Label>
                  <Input defaultValue="500m" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GatewayDashboard;
