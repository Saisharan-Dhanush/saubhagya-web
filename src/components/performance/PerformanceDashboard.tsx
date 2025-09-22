import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { usePerformance } from '../../contexts/PerformanceContext'
import {
  Activity,
  Shield,
  Zap,
  Database,
  Network,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Trash2,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Server
} from 'lucide-react'

interface PerformanceDashboardProps {
  className?: string
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  className = ''
}) => {
  const {
    metrics,
    systemHealth,
    isLoading,
    securityEvents,
    securityScore,
    threatLevel,
    clearCache,
    optimizePerformance,
    enhanceSecurity,
    resolveSecurityEvent
  } = usePerformance()

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthBadge = (value: number) => {
    if (value >= 80) return 'bg-green-100 text-green-800'
    if (value >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CPU Usage</p>
                <p className={`text-2xl font-bold ${getHealthColor(100 - systemHealth.cpu)}`}>
                  {systemHealth.cpu}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={systemHealth.cpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Memory</p>
                <p className={`text-2xl font-bold ${getHealthColor(100 - systemHealth.memory)}`}>
                  {systemHealth.memory}%
                </p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={systemHealth.memory} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Network</p>
                <p className={`text-2xl font-bold ${getHealthColor(systemHealth.network)}`}>
                  {systemHealth.network}%
                </p>
              </div>
              <Network className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={systemHealth.network} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className={`text-2xl font-bold ${getHealthColor(securityScore)}`}>
                  {securityScore}
                </p>
              </div>
              <Shield className="h-8 w-8 text-indigo-500" />
            </div>
            <Progress value={securityScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Page Load Time</p>
                <p className="text-lg font-semibold">{metrics.pageLoadTime.toFixed(0)}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Memory Usage</p>
                <p className="text-lg font-semibold">{formatBytes(metrics.memoryUsage)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Network Requests</p>
                <p className="text-lg font-semibold">{metrics.networkRequests}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Session Duration</p>
                <p className="text-lg font-semibold">{formatDuration(metrics.sessionDuration)}</p>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCache}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={optimizePerformance}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Optimize
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Service Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(systemHealth.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {service.replace('-', ' ')}
                  </span>
                  <Badge
                    variant={status === 'healthy' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {status === 'healthy' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Dashboard
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getThreatLevelColor(threatLevel)}>
                Threat Level: {threatLevel.toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={enhanceSecurity}
                disabled={isLoading}
              >
                <Shield className="h-4 w-4 mr-2" />
                Enhance Security
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {threatLevel !== 'low' && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Security events detected. Review and resolve issues below.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {securityEvents
              .filter(event => !event.resolved)
              .slice(0, 5)
              .map((event) => (
              <div key={event.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(event.severity)}
                    <span className="font-medium capitalize">
                      {event.type.replace('_', ' ')}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {event.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {event.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{event.details}</p>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resolveSecurityEvent(event.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </Button>
                </div>
              </div>
            ))}

            {securityEvents.filter(event => !event.resolved).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No unresolved security events</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PerformanceDashboard