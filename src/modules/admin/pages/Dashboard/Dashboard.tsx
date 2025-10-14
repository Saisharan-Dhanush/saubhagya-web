import React, { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive, Timer, RefreshCw, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { dashboardService, SystemMetrics, ServicesStatusResponse } from '@/services/admin/dashboard.service';

const Dashboard: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [servicesStatus, setServicesStatus] = useState<ServicesStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [metrics, services] = await Promise.all([
        dashboardService.getSystemMetrics(),
        dashboardService.getServicesStatus()
      ]);
      setSystemMetrics(metrics);
      setServicesStatus(services);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data. Please ensure the Reporting Service is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30 seconds
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchDashboardData, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    toast.info('Refreshing dashboard...');
    fetchDashboardData();
  };

  const formatUptime = (uptimeMs?: number) => {
    if (!uptimeMs) return 'N/A';
    const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  };

  const formatBytes = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      UP: 'default',
      DOWN: 'destructive',
      UNKNOWN: 'secondary'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (loading && !systemMetrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Platform overview and system health monitoring
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and system health monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
        </div>
      </div>

      {/* System Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Load</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics?.cpu.systemLoadAverage.toFixed(2) || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {systemMetrics?.cpu.availableProcessors || 0} processors available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heap Memory</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics?.memory.heapUsagePercent.toFixed(1) || 'N/A'}%
            </div>
            <p className="text-xs text-muted-foreground">
              {systemMetrics ? formatBytes(systemMetrics.memory.heapUsed) : 'N/A'} / {systemMetrics ? formatBytes(systemMetrics.memory.heapMax) : 'N/A'} MB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threads</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics?.threads.threadCount || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Peak: {systemMetrics?.threads.peakThreadCount || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatUptime(systemMetrics?.uptime.uptimeMs)}
            </div>
            <p className="text-xs text-muted-foreground">
              Since last restart
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Microservices Health Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Microservices Health Status
              </CardTitle>
              <CardDescription>
                Real-time status of all platform microservices
              </CardDescription>
            </div>
            {servicesStatus && (
              <div className="text-sm font-medium">
                <span className="text-green-600">{servicesStatus.upServices}</span>
                {' / '}
                <span className="text-gray-600">{servicesStatus.totalServices}</span>
                {' services online'}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {servicesStatus?.services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div className="flex-1">
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-muted-foreground">{service.url}</div>
                </div>
                <div className="flex items-center gap-4">
                  {service.responseTime !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      {service.responseTime}ms
                    </span>
                  )}
                  {getStatusBadge(service.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* JVM Details */}
      {systemMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>JVM Information</CardTitle>
            <CardDescription>Java Virtual Machine details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Memory</p>
                <p className="text-lg font-semibold">
                  {formatBytes(systemMetrics.jvm.totalMemoryMB)} MB
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Free Memory</p>
                <p className="text-lg font-semibold">
                  {formatBytes(systemMetrics.jvm.freeMemoryMB)} MB
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Used Memory</p>
                <p className="text-lg font-semibold">
                  {formatBytes(systemMetrics.jvm.usedMemoryMB)} MB
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Max Memory</p>
                <p className="text-lg font-semibold">
                  {formatBytes(systemMetrics.jvm.maxMemoryMB)} MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
export { Dashboard };
