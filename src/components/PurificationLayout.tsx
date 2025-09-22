import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useAlerts } from '../contexts/AlertContext';
import {
  Gauge,
  Beaker,
  Settings,
  Wrench,
  PackageCheck,
  Bell,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PurificationLayoutProps {
  children: React.ReactNode;
}

export const PurificationLayout: React.FC<PurificationLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isConnected, connectionStatus } = useWebSocket();
  const { getCriticalAlerts, getActiveAlerts, acknowledgeAlert } = useAlerts();

  const criticalAlerts = getCriticalAlerts();
  const activeAlerts = getActiveAlerts();

  const navigationItems = [
    {
      path: '/monitoring',
      label: 'Process Monitoring',
      icon: Gauge,
      description: 'Real-time system monitoring'
    },
    {
      path: '/quality',
      label: 'Quality Control',
      icon: Beaker,
      description: 'BIS & PESO compliance'
    },
    {
      path: '/optimization',
      label: 'Process Optimization',
      icon: Settings,
      description: 'Performance tuning'
    },
    {
      path: '/maintenance',
      label: 'Maintenance',
      icon: Wrench,
      description: 'Equipment health'
    },
    {
      path: '/batches',
      label: 'Batch Management',
      icon: PackageCheck,
      description: 'Production tracking'
    }
  ];

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">ShuddhiDoot</h1>
                <p className="text-sm text-gray-500">Purification Control Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                </Badge>
                <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} />
              </div>

              {/* Alert Indicator */}
              <div className="relative">
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {criticalAlerts.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5"
                    >
                      {criticalAlerts.length}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* System Status */}
              <div className="flex items-center space-x-2">
                {criticalAlerts.length > 0 ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                <Badge variant={criticalAlerts.length > 0 ? "destructive" : "default"}>
                  {criticalAlerts.length > 0 ? 'CRITICAL' : 'NORMAL'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-700">
                <strong>Critical System Alert:</strong> {criticalAlerts.length} critical issue(s) require immediate attention.
              </p>
              <div className="mt-2 space-y-1">
                {criticalAlerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="flex justify-between items-center">
                    <span className="text-xs text-red-600">{alert.message}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Active Alerts Summary */}
            {activeAlerts.length > 0 && (
              <Card className="mt-6">
                <CardContent className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Active Alerts ({activeAlerts.length})
                  </h4>
                  <div className="space-y-2">
                    {activeAlerts.slice(0, 5).map(alert => (
                      <Alert key={alert.id} variant={alert.type === 'critical' ? 'destructive' : 'default'}>
                        <AlertDescription className="text-xs">
                          <div className="flex justify-between items-start">
                            <span>{alert.message}</span>
                            <Badge variant="outline" className="text-xs ml-2">
                              {alert.type}
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PurificationLayout;