import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';
import { biogasService, AlertResponse, AlertConfigurationResponse, AlertActionRequest } from '../../services/biogasService';

// Type mapping for alert severity
type AlertLevel = 'INFO' | 'WARNING' | 'CRITICAL';

interface AlertsManagementProps {
  languageContext?: {
    language: 'hi' | 'en';
    t: (key: string) => string;
  };
}

const translations = {
  en: {
    title: 'Alerts Management',
    subtitle: 'Real-time monitoring and threshold management',
    activeAlerts: 'Active Alerts',
    alertHistory: 'Alert History',
    configurations: 'Alert Configurations',
    critical: 'Critical',
    warning: 'Warning',
    info: 'Info',
    alertCount: 'Total Alerts',
    criticalCount: 'Critical Alerts',
    warningCount: 'Warning Alerts',
    allSystems: 'All Systems Operational',
    someIssues: 'Some Issues Detected',
    criticalIssues: 'Critical Issues Present',
    acknowledge: 'Acknowledge',
    resolve: 'Resolve',
    viewDetails: 'View Details',
    loading: 'Loading...',
    noAlerts: 'No alerts found',
    refresh: 'Refresh'
  },
  hi: {
    title: 'अलर्ट प्रबंधन',
    subtitle: 'रियल-टाइम निगरानी और थ्रेशोल्ड प्रबंधन',
    activeAlerts: 'सक्रिय अलर्ट',
    alertHistory: 'अलर्ट इतिहास',
    configurations: 'अलर्ट कॉन्फ़िगरेशन',
    critical: 'गंभीर',
    warning: 'चेतावनी',
    info: 'जानकारी',
    alertCount: 'कुल अलर्ट',
    criticalCount: 'गंभीर अलर्ट',
    warningCount: 'चेतावनी अलर्ट',
    allSystems: 'सभी सिस्टम चालू',
    someIssues: 'कुछ समस्याएं मिलीं',
    criticalIssues: 'गंभीर समस्याएं मौजूद',
    acknowledge: 'स्वीकार करें',
    resolve: 'हल करें',
    viewDetails: 'विवरण देखें',
    loading: 'लोड हो रहा है...',
    noAlerts: 'कोई अलर्ट नहीं मिला',
    refresh: 'रिफ्रेश करें'
  }
};

const getAlertLevelColor = (level: string): string => {
  switch (level.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    case 'WARNING':
      return 'bg-yellow-100 text-yellow-800';
    case 'INFO':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getAlertIcon = (level: string) => {
  switch (level.toUpperCase()) {
    case 'CRITICAL':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'WARNING':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'INFO':
      return <Info className="w-4 h-4 text-blue-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const AlertCard: React.FC<{
  alert: AlertResponse;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  t: (key: string) => string;
}> = ({ alert, onAcknowledge, onResolve, t }) => {
  const [resolving, setResolving] = useState(false);

  const handleResolve = async () => {
    setResolving(true);
    await onResolve(alert.id);
    setResolving(false);
  };

  return (
    <Card className={`border-l-4 ${
      alert.severity === 'CRITICAL' ? 'border-l-red-500' :
      alert.severity === 'WARNING' ? 'border-l-yellow-500' :
      'border-l-blue-500'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              {getAlertIcon(alert.severity)}
              <Badge className={getAlertLevelColor(alert.severity)}>
                {t(alert.severity.toLowerCase())}
              </Badge>
              <Badge variant="outline">
                {alert.alertType}
              </Badge>
              <Badge variant={alert.status === 'RESOLVED' ? 'default' : 'secondary'}>
                {alert.status}
              </Badge>
            </div>
            <h4 className="font-semibold">{alert.message}</h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Cluster:</span> {alert.clusterId}
              </div>
              <div>
                <span className="font-medium">Triggered:</span> {new Date(alert.triggeredAt).toLocaleString()}
              </div>
              {alert.acknowledgedAt && (
                <div className="col-span-2">
                  <span className="font-medium">Acknowledged:</span> {new Date(alert.acknowledgedAt).toLocaleString()}
                </div>
              )}
              {alert.resolvedAt && (
                <div className="col-span-2">
                  <span className="font-medium">Resolved:</span> {new Date(alert.resolvedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAcknowledge(alert.id)}
              disabled={alert.status !== 'ACTIVE' || resolving}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResolve}
              disabled={alert.status === 'RESOLVED' || resolving}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AlertsManagement: React.FC<AlertsManagementProps> = ({ languageContext }) => {
  const [activeAlerts, setActiveAlerts] = useState<AlertResponse[]>([]);
  const [alertHistory, setAlertHistory] = useState<AlertResponse[]>([]);
  const [configurations, setConfigurations] = useState<AlertConfigurationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [clusterId] = useState<string>('582d792f-dbf9-490c-bb9b-6f67e294c3fe'); // Default test cluster

  const lang = languageContext?.language || 'en';
  const t = (key: string): string => {
    return languageContext?.t(key) || translations[lang][key as keyof typeof translations[typeof lang]] || key;
  };

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      // Load active alerts
      const activeResponse = await biogasService.getActiveAlerts(
        clusterId,
        severityFilter === 'all' ? undefined : severityFilter
      );
      if (activeResponse.success && activeResponse.data) {
        setActiveAlerts(activeResponse.data.content || []);
      }

      // Load alert history
      const historyResponse = await biogasService.getAlertHistory(clusterId);
      if (historyResponse.success && historyResponse.data) {
        setAlertHistory(historyResponse.data.content || []);
      }

      // Load configurations
      const configResponse = await biogasService.getAlertConfigurations(clusterId);
      if (configResponse.success && configResponse.data) {
        setConfigurations(configResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to load alert data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clusterId, severityFilter]);

  const handleAcknowledge = async (alertId: string) => {
    try {
      const response = await biogasService.acknowledgeAlert(alertId);
      if (response.success) {
        loadData(); // Reload data
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      const request: AlertActionRequest = {
        actionTaken: 'Resolved via web dashboard',
        resolutionNotes: 'Issue resolved by operator'
      };
      const response = await biogasService.resolveAlert(alertId, request);
      if (response.success) {
        loadData(); // Reload data
      }
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const criticalAlerts = activeAlerts.filter(a => a.severity === 'CRITICAL');
  const warningAlerts = activeAlerts.filter(a => a.severity === 'WARNING');
  const systemStatus = criticalAlerts.length > 0 ? 'critical' :
                     warningAlerts.length > 0 ? 'warning' : 'normal';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between -mt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('refresh')}
        </Button>
      </div>

      {/* System Status Alert */}
      {systemStatus !== 'normal' && (
        <Alert className={`${
          systemStatus === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
        }`}>
          <AlertTriangle className={`h-4 w-4 ${
            systemStatus === 'critical' ? 'text-red-600' : 'text-yellow-600'
          }`} />
          <AlertDescription className={`${
            systemStatus === 'critical' ? 'text-red-800' : 'text-yellow-800'
          }`}>
            {systemStatus === 'critical' ? t('criticalIssues') : t('someIssues')}
            {systemStatus === 'critical' && ` - ${criticalAlerts.length} critical alerts require immediate attention.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('alertCount')}</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAlerts.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('criticalCount')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('warningCount')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">{t('activeAlerts')}</TabsTrigger>
          <TabsTrigger value="history">{t('alertHistory')}</TabsTrigger>
          <TabsTrigger value="configurations">{t('configurations')}</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Label>Filters:</Label>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="CRITICAL">{t('critical')}</SelectItem>
                <SelectItem value="WARNING">{t('warning')}</SelectItem>
                <SelectItem value="INFO">{t('info')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Alerts */}
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    {t('allSystems')}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {t('noAlerts')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={handleAcknowledge}
                  onResolve={handleResolve}
                  t={t}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('alertHistory')}</CardTitle>
              <CardDescription>
                Historical alert data and resolution tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-2" />
                    <p>{t('noAlerts')}</p>
                  </div>
                ) : (
                  alertHistory.slice(0, 20).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getAlertIcon(alert.severity)}
                          <Badge className={getAlertLevelColor(alert.severity)}>
                            {t(alert.severity.toLowerCase())}
                          </Badge>
                          <Badge variant="outline">
                            {alert.alertType}
                          </Badge>
                          <Badge variant={alert.status === 'RESOLVED' ? 'default' : 'secondary'}>
                            {alert.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold">{alert.message}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(alert.triggeredAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configurations">
          <Card>
            <CardHeader>
              <CardTitle>{t('configurations')}</CardTitle>
              <CardDescription>
                Alert threshold configurations for this cluster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {configurations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info className="w-12 h-12 mx-auto mb-2" />
                    <p>No alert configurations found</p>
                  </div>
                ) : (
                  configurations.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getAlertLevelColor(config.severity)}>
                            {config.severity}
                          </Badge>
                          <Badge variant="outline">
                            {config.alertType}
                          </Badge>
                          <Badge variant={config.enabled ? 'default' : 'secondary'}>
                            {config.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        <h4 className="font-semibold">{config.description || config.alertType}</h4>
                        {config.thresholdValue && (
                          <p className="text-sm text-muted-foreground">
                            Threshold: {config.thresholdValue}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsManagement;
