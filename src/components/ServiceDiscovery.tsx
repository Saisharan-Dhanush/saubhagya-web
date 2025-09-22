import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Eye,
  EyeOff,
  Network,
  Database,
  LoadBalancer
} from 'lucide-react';

interface ServiceInstance {
  id: string;
  name: string;
  namespace: string;
  ip: string;
  port: number;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  lastHeartbeat: string;
  responseTime: number;
  load: number;
  version: string;
  endpoints: string[];
}

interface ServiceRegistry {
  name: string;
  namespace: string;
  instances: ServiceInstance[];
  totalInstances: number;
  healthyInstances: number;
  loadBalancing: 'round-robin' | 'least-connections' | 'weighted';
  circuitBreaker: 'closed' | 'open' | 'half-open';
  lastUpdated: string;
}

interface DiscoveryMetrics {
  totalServices: number;
  totalInstances: number;
  healthyInstances: number;
  discoveryLatency: number;
  registrySize: number;
  lastSync: string;
}

const ServiceDiscovery: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOffline, setShowOffline] = useState(true);

  const [metrics, setMetrics] = useState<DiscoveryMetrics>({
    totalServices: 6,
    totalInstances: 18,
    healthyInstances: 15,
    discoveryLatency: 45,
    registrySize: 2.4,
    lastSync: '2024-01-15T10:30:00Z'
  });

  const [services, setServices] = useState<ServiceRegistry[]>([
    {
      name: 'auth-service',
      namespace: 'default',
      instances: [
        {
          id: 'auth-1',
          name: 'auth-service',
          namespace: 'default',
          ip: '10.0.1.10',
          port: 8080,
          status: 'healthy',
          lastHeartbeat: '2024-01-15T10:30:00Z',
          responseTime: 45,
          load: 65,
          version: '1.2.0',
          endpoints: ['/health', '/metrics', '/actuator']
        },
        {
          id: 'auth-2',
          name: 'auth-service',
          namespace: 'default',
          ip: '10.0.1.11',
          port: 8080,
          status: 'healthy',
          lastHeartbeat: '2024-01-15T10:30:00Z',
          responseTime: 42,
          load: 58,
          version: '1.2.0',
          endpoints: ['/health', '/metrics', '/actuator']
        },
        {
          id: 'auth-3',
          name: 'auth-service',
          namespace: 'default',
          ip: '10.0.1.12',
          port: 8080,
          status: 'warning',
          lastHeartbeat: '2024-01-15T10:29:00Z',
          responseTime: 78,
          load: 89,
          version: '1.2.0',
          endpoints: ['/health', '/metrics', '/actuator']
        }
      ],
      totalInstances: 3,
      healthyInstances: 2,
      loadBalancing: 'round-robin',
      circuitBreaker: 'closed',
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      name: 'iot-service',
      namespace: 'default',
      instances: [
        {
          id: 'iot-1',
          name: 'iot-service',
          namespace: 'default',
          ip: '10.0.2.10',
          port: 8080,
          status: 'healthy',
          lastHeartbeat: '2024-01-15T10:30:00Z',
          responseTime: 38,
          load: 45,
          version: '1.1.0',
          endpoints: ['/health', '/metrics', '/actuator']
        },
        {
          id: 'iot-2',
          name: 'iot-service',
          namespace: 'default',
          ip: '10.0.2.11',
          port: 8080,
          status: 'healthy',
          lastHeartbeat: '2024-01-15T10:30:00Z',
          responseTime: 41,
          load: 52,
          version: '1.1.0',
          endpoints: ['/health', '/metrics', '/actuator']
        }
      ],
      totalInstances: 2,
      healthyInstances: 2,
      loadBalancing: 'round-robin',
      circuitBreaker: 'closed',
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      name: 'transaction-service',
      namespace: 'default',
      instances: [
        {
          id: 'tx-1',
          name: 'transaction-service',
          namespace: 'default',
          ip: '10.0.3.10',
          port: 8080,
          status: 'warning',
          lastHeartbeat: '2024-01-15T10:29:00Z',
          responseTime: 67,
          load: 78,
          version: '1.0.0',
          endpoints: ['/health', '/metrics', '/actuator']
        },
        {
          id: 'tx-2',
          name: 'transaction-service',
          namespace: 'default',
          ip: '10.0.3.11',
          port: 8080,
          status: 'error',
          lastHeartbeat: '2024-01-15T10:25:00Z',
          responseTime: 156,
          load: 95,
          version: '1.0.0',
          endpoints: ['/health', '/metrics', '/actuator']
        }
      ],
      totalInstances: 2,
      healthyInstances: 0,
      loadBalancing: 'round-robin',
      circuitBreaker: 'open',
      lastUpdated: '2024-01-15T10:30:00Z'
    }
  ]);

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

  const getCircuitBreakerBadge = (status: string) => {
    switch (status) {
      case 'closed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Closed</Badge>;
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'half-open':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Half-Open</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const filteredServices = showOffline 
    ? services 
    : services.filter(service => service.healthyInstances > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Service Discovery</h2>
          <p className="text-muted-foreground">
            Kubernetes service discovery and health monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowOffline(!showOffline)}
          >
            {showOffline ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Offline
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show All
              </>
            )}
          </Button>
          <Button onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="instances">Instances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Discovery Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalServices}</div>
                <p className="text-xs text-muted-foreground">
                  Registered services
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalInstances}</div>
                <p className="text-xs text-muted-foreground">
                  Service instances
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Healthy Instances</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.healthyInstances}</div>
                <p className="text-xs text-muted-foreground">
                  {((metrics.healthyInstances / metrics.totalInstances) * 100).toFixed(1)}% healthy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discovery Latency</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.discoveryLatency}ms</div>
                <p className="text-xs text-muted-foreground">
                  Service lookup time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Service Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Service Health Summary</CardTitle>
              <CardDescription>
                Overview of all registered services and their health status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Server className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.namespace} • {service.totalInstances} instances
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {service.healthyInstances}/{service.totalInstances}
                        </div>
                        <div className="text-xs text-muted-foreground">Healthy</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{service.loadBalancing}</Badge>
                        {getCircuitBreakerBadge(service.circuitBreaker)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discovery Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Discovery Configuration</CardTitle>
              <CardDescription>
                Kubernetes service discovery settings and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Kubernetes Discovery</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• Enabled: Yes</div>
                    <div>• All namespaces: No</div>
                    <div>• Namespaces: default</div>
                    <div>• Reload mode: polling</div>
                    <div>• Reload period: 30s</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Registry Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• Registry size: {metrics.registrySize}MB</div>
                    <div>• Last sync: {new Date(metrics.lastSync).toLocaleString()}</div>
                    <div>• Auto-refresh: Enabled</div>
                    <div>• Health check interval: 30s</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Registry</CardTitle>
              <CardDescription>
                Detailed view of all registered services and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Namespace</TableHead>
                    <TableHead>Instances</TableHead>
                    <TableHead>Load Balancing</TableHead>
                    <TableHead>Circuit Breaker</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.namespace}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{service.healthyInstances}/{service.totalInstances}</span>
                          <Progress 
                            value={(service.healthyInstances / service.totalInstances) * 100} 
                            className="w-16" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{service.loadBalancing}</Badge>
                      </TableCell>
                      <TableCell>
                        {getCircuitBreakerBadge(service.circuitBreaker)}
                      </TableCell>
                      <TableCell>
                        {new Date(service.lastUpdated).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Instances</CardTitle>
              <CardDescription>
                Individual service instance details and health status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instance</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Load</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Heartbeat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.flatMap(service => 
                    service.instances.map(instance => (
                      <TableRow key={instance.id}>
                        <TableCell className="font-medium">{instance.id}</TableCell>
                        <TableCell>{instance.name}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {instance.ip}:{instance.port}
                        </TableCell>
                        <TableCell>{getStatusBadge(instance.status)}</TableCell>
                        <TableCell>{instance.responseTime}ms</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{instance.load}%</span>
                            <Progress value={instance.load} className="w-16" />
                          </div>
                        </TableCell>
                        <TableCell>{instance.version}</TableCell>
                        <TableCell>
                          {new Date(instance.lastHeartbeat).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alerts */}
      {services.some(s => s.circuitBreaker === 'open') && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Some services have open circuit breakers. Check service health and consider scaling or restarting affected instances.
          </AlertDescription>
        </Alert>
      )}

      {metrics.healthyInstances / metrics.totalInstances < 0.8 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Service health is below 80%. Review instance health and consider scaling healthy services.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ServiceDiscovery;
