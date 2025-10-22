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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
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
  Info,
  Plus,
  Search
} from 'lucide-react';
import { biogasService, AlertResponse, AlertConfigurationResponse, AlertActionRequest, AlertConfigurationRequest } from '../../services/biogasService';
import { showSuccessToast, showErrorToast, showLoadingToast } from '../../lib/toast';
import { toast } from 'sonner';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';

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
  onAcknowledge: (id: string) => Promise<void>;
  onResolve: (id: string) => Promise<void>;
  t: (key: string) => string;
}> = ({ alert, onAcknowledge, onResolve, t }) => {
  const [acknowledging, setAcknowledging] = useState(false);
  const [resolving, setResolving] = useState(false);

  const handleAcknowledge = async () => {
    try {
      setAcknowledging(true);
      await onAcknowledge(alert.alertId || alert.id);
    } catch (error) {
      console.error('Error in handleAcknowledge:', error);
    } finally {
      setAcknowledging(false);
    }
  };

  const handleResolve = async () => {
    try {
      setResolving(true);
      await onResolve(alert.alertId || alert.id);
    } catch (error) {
      console.error('Error in handleResolve:', error);
    } finally {
      setResolving(false);
    }
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
              onClick={handleAcknowledge}
              disabled={alert.status !== 'ACTIVE' || acknowledging || resolving}
            >
              {acknowledging ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResolve}
              disabled={alert.status === 'RESOLVED' || acknowledging || resolving}
            >
              {resolving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface Cluster {
  id: number;
  clusterName: string;
  clusterCode: string;
  district?: string;
  state?: string;
}

export const AlertsManagement: React.FC<AlertsManagementProps> = ({ languageContext }) => {
  const [activeAlerts, setActiveAlerts] = useState<AlertResponse[]>([]);
  const [alertHistory, setAlertHistory] = useState<AlertResponse[]>([]);
  const [configurations, setConfigurations] = useState<AlertConfigurationResponse[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clusterId, setClusterId] = useState<string>('1'); // Default to cluster 1
  const [selectedAlert, setSelectedAlert] = useState<AlertResponse | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [dialogAcknowledging, setDialogAcknowledging] = useState(false);
  const [dialogResolving, setDialogResolving] = useState(false);

  // Add Alert Configuration Dialog State
  const [isAddAlertDialogOpen, setIsAddAlertDialogOpen] = useState(false);
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);
  const [newAlertConfig, setNewAlertConfig] = useState<AlertConfigurationRequest>({
    clusterId: '1',
    alertType: 'LOW_PRODUCTION',
    severity: 'WARNING',
    thresholdValue: undefined,
    description: '',
    enabled: true
  });

  const lang = languageContext?.language || 'en';
  const t = (key: string): string => {
    return languageContext?.t(key) || translations[lang][key as keyof typeof translations[typeof lang]] || key;
  };

  // Handle add alert functionality
  const handleAddAlert = () => {
    if (!clusterId) {
      showErrorToast('Please select a digester first before adding an alert');
      return;
    }

    // Reset form and set cluster ID
    setNewAlertConfig({
      clusterId: clusterId,
      alertType: 'LOW_PRODUCTION',
      severity: 'WARNING',
      thresholdValue: undefined,
      description: '',
      enabled: true
    });
    setIsAddAlertDialogOpen(true);

    console.log('📝 Opening Add Alert dialog for cluster:', clusterId);
  };

  // Handle view alert details
  const handleViewAlertDetails = (alert: AlertResponse) => {
    setSelectedAlert(alert);
    setIsDetailDialogOpen(true);
  };

  // Handle submit new alert configuration
  const handleSubmitNewAlert = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('🚀🚀🚀 SUBMIT FUNCTION CALLED! 🚀🚀🚀');
    console.group('🔔 Add Alert - Starting Validation');
    console.log('Current form state:', newAlertConfig);

    // Validation
    if (!newAlertConfig.clusterId) {
      console.error('❌ Validation failed: No cluster ID');
      console.groupEnd();
      showErrorToast('Cluster ID is missing. Please close and reopen the dialog.');
      return;
    }

    if (!newAlertConfig.alertType) {
      console.error('❌ Validation failed: No alert type');
      console.groupEnd();
      showErrorToast('Alert type is required');
      return;
    }

    if (!newAlertConfig.severity) {
      console.error('❌ Validation failed: No severity');
      console.groupEnd();
      showErrorToast('Severity is required');
      return;
    }

    console.log('✅ Validation passed');
    console.groupEnd();

    setIsSubmittingAlert(true);
    const toastId = showLoadingToast('Creating alert configuration...');

    try {
      console.group('🔔 Creating Alert Configuration');
      console.log('📤 Request payload:', JSON.stringify(newAlertConfig, null, 2));
      console.log('🌐 API Endpoint:', 'POST http://localhost:8082/biogas-service/api/v1/alerts/configurations');

      // Try API call with 10 second timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
          console.error('⏱️ Request timed out after 10 seconds');
          reject(new Error('TIMEOUT'));
        }, 10000)
      );

      console.log('⏳ Sending API request...');
      const startTime = Date.now();

      const response = await Promise.race([
        biogasService.createAlertConfiguration(newAlertConfig),
        timeoutPromise
      ]) as any;

      const endTime = Date.now();
      console.log(`⏱️ Request completed in ${endTime - startTime}ms`);
      console.log('📥 Response received:', response);

      toast.dismiss(toastId);

      if (response && response.success) {
        console.log('✅ Alert configuration created successfully!');
        console.log('📥 Response data:', response.data);
        console.groupEnd();

        toast.dismiss(toastId);
        showSuccessToast('✅ Alert configuration added successfully!');

        // Close dialog
        setIsAddAlertDialogOpen(false);

        // Reset form
        setNewAlertConfig({
          clusterId: clusterId,
          alertType: 'LOW_PRODUCTION',
          severity: 'WARNING',
          thresholdValue: undefined,
          description: '',
          enabled: true
        });

        // Small delay to ensure backend has persisted the data
        console.log('⏳ Waiting 500ms before reloading data...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Reload configurations
        console.log('🔄 Reloading alert configurations...');
        await loadData();
        console.log('✅ Data reload complete');
      } else {
        throw new Error(response?.error || response?.message || 'Backend returned error');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error('❌ Backend error:', error.message);
      console.groupEnd();

      // Show appropriate error message
      let errorMessage = '❌ Failed to create alert configuration.';
      let detailedMessage = '';

      if (error.message === 'TIMEOUT') {
        errorMessage = '⏱️ Request timed out after 10 seconds';
        detailedMessage = '\n\n🔧 Please ensure:\n' +
          '1. Biogas service is running on port 8082\n' +
          '2. Run: mvn spring-boot:run -DskipTests -pl biogas-service\n' +
          '3. Check: http://localhost:8082/biogas-service/actuator/health';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = '🔌 Cannot connect to backend server';
        detailedMessage = '\n\n🔧 Possible causes:\n' +
          '1. Biogas service not running\n' +
          '2. Wrong port (should be 8082)\n' +
          '3. Network/firewall issue';
      } else if (error.message.includes('HTTP 401')) {
        errorMessage = '🔒 Unauthorized. Please log in again.';
      } else if (error.message.includes('HTTP 500')) {
        errorMessage = '⚠️ Server error. Check backend logs.';
      } else if (error.message.includes('HTTP 404')) {
        errorMessage = '❌ API endpoint not found. Backend may not have this endpoint implemented.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      showErrorToast(errorMessage + detailedMessage);
    } finally {
      setIsSubmittingAlert(false);
      console.log('🏁 Submit process completed');
    }
  };

  // Load clusters on mount
  useEffect(() => {
    const loadClusters = async () => {
      try {
        const response = await biogasService.getAllClusters();
        if (response.success && response.data && response.data.length > 0) {
          setClusters(response.data);
          // Set first cluster as default
          setClusterId(response.data[0].id.toString());
        } else {
          // Fallback: If no clusters returned, use default cluster ID
          console.warn('No clusters returned, using default cluster ID: 1');
          setClusterId('1');
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load clusters:', error);
        // Fallback: On error, use default cluster ID and stop loading
        console.warn('Error loading clusters, using default cluster ID: 1');
        setClusterId('1');
        setLoading(false);
      }
    };
    loadClusters();
  }, []);

  // Load data
  const loadData = async () => {
    if (!clusterId) {
      console.warn('⚠️ loadData called without clusterId');
      return; // Don't load if no cluster selected
    }

    console.log('🔄 Loading alert data for cluster:', clusterId);
    setLoading(true);
    try {
      // Load active alerts
      console.log('📡 Fetching active alerts...');
      const activeResponse = await biogasService.getActiveAlerts(
        clusterId,
        severityFilter === 'all' ? undefined : severityFilter
      );
      if (activeResponse.success && activeResponse.data) {
        console.log('✅ Active alerts loaded:', activeResponse.data.content?.length || 0);
        setActiveAlerts(activeResponse.data.content || []);
      } else {
        console.error('❌ Failed to load active alerts:', activeResponse.error);
      }

      // Load alert history
      console.log('📡 Fetching alert history...');
      const historyResponse = await biogasService.getAlertHistory(clusterId);
      if (historyResponse.success && historyResponse.data) {
        console.log('✅ Alert history loaded:', historyResponse.data.content?.length || 0);
        setAlertHistory(historyResponse.data.content || []);
      } else {
        console.error('❌ Failed to load alert history:', historyResponse.error);
      }

      // Load configurations
      console.log('📡 Fetching alert configurations for cluster:', clusterId);
      const configResponse = await biogasService.getAlertConfigurations(clusterId);
      console.log('📥 Config response:', configResponse);
      console.log('📥 Config response.data:', configResponse.data);
      console.log('📥 Config response.success:', configResponse.success);

      if (configResponse.success && configResponse.data) {
        console.log('✅ Alert configurations loaded:', configResponse.data.length, 'configurations');
        console.table(configResponse.data);
        console.log('🔄 Setting configurations state...');
        setConfigurations(configResponse.data || []);
        console.log('✅ Configurations state set');
      } else {
        console.error('❌ Failed to load configurations:', configResponse.error);
        console.error('❌ Response was:', configResponse);
      }
    } catch (error) {
      console.error('❌ Failed to load alert data:', error);
    } finally {
      setLoading(false);
      console.log('✅ loadData completed');
    }
  };

  useEffect(() => {
    if (clusterId) {
      loadData();
    }
  }, [clusterId, severityFilter]);

  // Debug: Log whenever configurations state changes
  useEffect(() => {
    console.log('🔍 Configurations state changed:', configurations.length, 'items');
    console.log('🔍 Configurations:', configurations);
  }, [configurations]);

  const handleAcknowledge = async (alertId: string) => {
    const toastId = showLoadingToast('Acknowledging alert...');

    try {
      console.log('✓ Acknowledging alert:', alertId);

      // Shorter timeout - 10 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
      );

      const response = await Promise.race([
        biogasService.acknowledgeAlert(alertId),
        timeoutPromise
      ]) as any;

      console.log('✅ Acknowledge response:', response);
      toast.dismiss(toastId);

      if (response.success) {
        showSuccessToast('Alert acknowledged successfully!');
        await loadData(); // Reload data
      } else {
        const errorMsg = response.error || response.message || 'Failed to acknowledge alert';
        console.error('❌ Acknowledge failed:', errorMsg);
        showErrorToast(errorMsg);
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error('❌ Failed to acknowledge alert:', error);

      let errorMessage = 'Failed to acknowledge alert.';
      if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the biogas service is running.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      showErrorToast(errorMessage);
    }
  };

  const handleResolve = async (alertId: string) => {
    const toastId = showLoadingToast('Resolving alert...');

    try {
      console.log('✗ Resolving alert:', alertId);
      const request: AlertActionRequest = {
        actionTaken: 'Resolved via web dashboard',
        resolutionNotes: 'Issue resolved by operator'
      };

      // Shorter timeout - 10 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
      );

      const response = await Promise.race([
        biogasService.resolveAlert(alertId, request),
        timeoutPromise
      ]) as any;

      console.log('✅ Resolve response:', response);
      toast.dismiss(toastId);

      if (response.success) {
        showSuccessToast('Alert resolved successfully!');
        await loadData(); // Reload data
      } else {
        const errorMsg = response.error || response.message || 'Failed to resolve alert';
        console.error('❌ Resolve failed:', errorMsg);
        showErrorToast(errorMsg);
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error('❌ Failed to resolve alert:', error);

      let errorMessage = 'Failed to resolve alert.';
      if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the biogas service is running.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      showErrorToast(errorMessage);
    }
  };

  // Filter alerts based on search query
  const filteredAlerts = activeAlerts.filter(alert => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      alert.message?.toLowerCase().includes(query) ||
      alert.alertType?.toLowerCase().includes(query) ||
      alert.severity?.toLowerCase().includes(query) ||
      alert.status?.toLowerCase().includes(query)
    );
  });

  const criticalAlerts = filteredAlerts.filter(a => a.severity === 'CRITICAL');
  const warningAlerts = filteredAlerts.filter(a => a.severity === 'WARNING');
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

  const selectedCluster = clusters.find(c => c.id.toString() === clusterId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Title Row */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Cluster Selector & Actions Row */}
        <div className="flex items-center justify-between gap-3 p-4 bg-muted/30 rounded-lg border">
          {/* Cluster Selector - Prominent Display */}
          <div className="flex items-center gap-3">
            <Label className="text-sm font-semibold whitespace-nowrap">Select Digester:</Label>
            {clusters.length > 0 ? (
              <Select value={clusterId} onValueChange={setClusterId}>
                <SelectTrigger className="w-[300px] bg-background">
                  <SelectValue>
                    {selectedCluster ? (
                      <span className="font-medium">
                        {selectedCluster.clusterName}
                        {selectedCluster.district && ` - ${selectedCluster.district}`}
                      </span>
                    ) : (
                      'Select Digester'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {clusters.map((cluster) => (
                    <SelectItem key={cluster.id} value={cluster.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{cluster.clusterName}</span>
                        <span className="text-xs text-muted-foreground">
                          {cluster.clusterCode}
                          {cluster.district && ` • ${cluster.district}`}
                          {cluster.state && `, ${cluster.state}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground">Loading clusters...</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button onClick={handleAddAlert} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Alert
            </Button>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('refresh')}
            </Button>
          </div>
        </div>
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
            <div className="text-2xl font-bold">{filteredAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredAlerts.length} active
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
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search alerts by message, type, severity, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Severity Filter */}
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
            {filteredAlerts.length === 0 ? (
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
              filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.alertId || alert.id}
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
                    <div key={alert.alertId || alert.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewAlertDetails(alert)}
                      >
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

      {/* Alert Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert && getAlertIcon(selectedAlert.severity)}
              Alert Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this alert
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-4">
              {/* Status Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getAlertLevelColor(selectedAlert.severity)}>
                  {selectedAlert.severity}
                </Badge>
                <Badge variant="outline">
                  {selectedAlert.alertType}
                </Badge>
                <Badge variant={selectedAlert.status === 'RESOLVED' ? 'default' : 'secondary'}>
                  {selectedAlert.status}
                </Badge>
              </div>

              {/* Alert Message */}
              <div>
                <Label className="text-sm font-semibold">Message</Label>
                <p className="mt-1 text-sm">{selectedAlert.message}</p>
              </div>

              {/* Alert Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Alert ID</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedAlert.alertId || selectedAlert.id}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Cluster ID</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedAlert.clusterId}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Alert Type</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedAlert.alertType}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Severity</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedAlert.severity}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Triggered At</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(selectedAlert.triggeredAt).toLocaleString()}
                  </p>
                </div>

                {selectedAlert.acknowledgedAt && (
                  <div>
                    <Label className="text-sm font-semibold">Acknowledged At</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(selectedAlert.acknowledgedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {selectedAlert.resolvedAt && (
                  <div>
                    <Label className="text-sm font-semibold">Resolved At</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(selectedAlert.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {selectedAlert.acknowledgedBy && (
                  <div>
                    <Label className="text-sm font-semibold">Acknowledged By</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedAlert.acknowledgedBy}
                    </p>
                  </div>
                )}

                {selectedAlert.resolvedBy && (
                  <div>
                    <Label className="text-sm font-semibold">Resolved By</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedAlert.resolvedBy}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Details if available */}
              {selectedAlert.details && (
                <div>
                  <Label className="text-sm font-semibold">Additional Details</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedAlert.details}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                {selectedAlert.status === 'ACTIVE' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          setDialogAcknowledging(true);
                          await handleAcknowledge(selectedAlert.alertId || selectedAlert.id);
                          setIsDetailDialogOpen(false);
                        } catch (error) {
                          console.error('Dialog acknowledge error:', error);
                        } finally {
                          setDialogAcknowledging(false);
                        }
                      }}
                      disabled={dialogAcknowledging || dialogResolving}
                    >
                      {dialogAcknowledging ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      {dialogAcknowledging ? 'Acknowledging...' : 'Acknowledge'}
                    </Button>
                    <Button
                      variant="default"
                      onClick={async () => {
                        try {
                          setDialogResolving(true);
                          await handleResolve(selectedAlert.alertId || selectedAlert.id);
                          setIsDetailDialogOpen(false);
                        } catch (error) {
                          console.error('Dialog resolve error:', error);
                        } finally {
                          setDialogResolving(false);
                        }
                      }}
                      disabled={dialogAcknowledging || dialogResolving}
                    >
                      {dialogResolving ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      {dialogResolving ? 'Resolving...' : 'Resolve'}
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                  disabled={dialogAcknowledging || dialogResolving}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Alert Configuration Dialog */}
      <Dialog open={isAddAlertDialogOpen} onOpenChange={setIsAddAlertDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Alert Configuration
            </DialogTitle>
            <DialogDescription>
              Create a new alert configuration for monitoring this digester
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitNewAlert} className="space-y-4">
            {/* Cluster Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Label className="text-sm font-semibold text-blue-900">Selected Digester</Label>
              <p className="text-sm text-blue-700 mt-1 font-medium">
                {selectedCluster ? (
                  <>
                    {selectedCluster.clusterName}
                    {selectedCluster.district && <span className="text-blue-600"> • {selectedCluster.district}</span>}
                  </>
                ) : (
                  'No digester selected'
                )}
              </p>
            </div>

            {/* Alert Type */}
            <div className="space-y-2">
              <Label htmlFor="alertType" className="text-sm font-semibold">
                Alert Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newAlertConfig.alertType}
                onValueChange={(value) => {
                  console.log('Alert type changed to:', value);
                  setNewAlertConfig({ ...newAlertConfig, alertType: value });
                }}
              >
                <SelectTrigger id="alertType">
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW_PRODUCTION">Low Production</SelectItem>
                  <SelectItem value="QUALITY_ISSUE">Quality Issue</SelectItem>
                  <SelectItem value="PAYMENT_FAILURE">Payment Failure</SelectItem>
                  <SelectItem value="MAINTENANCE_DUE">Maintenance Due</SelectItem>
                  <SelectItem value="HIGH_INVENTORY">High Inventory</SelectItem>
                  <SelectItem value="LOW_INVENTORY">Low Inventory</SelectItem>
                  <SelectItem value="PICKUP_OVERDUE">Pickup Overdue</SelectItem>
                  <SelectItem value="DISPUTE_RAISED">Dispute Raised</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <Label htmlFor="severity" className="text-sm font-semibold">
                Severity <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newAlertConfig.severity}
                onValueChange={(value) => {
                  console.log('Severity changed to:', value);
                  setNewAlertConfig({ ...newAlertConfig, severity: value });
                }}
              >
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Threshold Value */}
            <div className="space-y-2">
              <Label htmlFor="thresholdValue" className="text-sm font-semibold">
                Threshold Value (Optional)
              </Label>
              <Input
                id="thresholdValue"
                type="number"
                step="0.01"
                placeholder="e.g., 75.5"
                value={newAlertConfig.thresholdValue || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  console.log('Threshold value changed to:', value);
                  setNewAlertConfig({
                    ...newAlertConfig,
                    thresholdValue: value
                  });
                }}
              />
              <p className="text-xs text-muted-foreground">
                Numeric value that will trigger this alert
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this alert configuration..."
                value={newAlertConfig.description || ''}
                onChange={(e) => {
                  console.log('Description changed');
                  setNewAlertConfig({ ...newAlertConfig, description: e.target.value });
                }}
                rows={3}
              />
            </div>

            {/* Enabled Toggle - Simple Checkbox */}
            <div
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => {
                const newValue = !newAlertConfig.enabled;
                console.log('🔘 Checkbox area clicked, toggling from', newAlertConfig.enabled, 'to', newValue);
                setNewAlertConfig({ ...newAlertConfig, enabled: newValue });
              }}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  newAlertConfig.enabled
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                {newAlertConfig.enabled && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="text-sm font-medium flex-1">
                Enable this alert configuration immediately
              </span>
              <Badge variant={newAlertConfig.enabled ? "default" : "secondary"}>
                {newAlertConfig.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log('🚫 Cancel clicked');
                  setIsAddAlertDialogOpen(false);
                }}
                disabled={isSubmittingAlert}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={(e) => {
                  console.log('🖱️🖱️🖱️ CREATE ALERT BUTTON CLICKED! 🖱️🖱️🖱️');
                  e.preventDefault();
                  handleSubmitNewAlert();
                }}
                disabled={isSubmittingAlert || !clusterId || !newAlertConfig.alertType || !newAlertConfig.severity}
                className="min-w-[150px] bg-blue-600 hover:bg-blue-700"
              >
                {isSubmittingAlert ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Create Alert</span>
                  </>
                )}
              </Button>
            </div>

            {/* Debug Info */}
            <div className="text-xs p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
              <div className="font-semibold text-blue-900 mb-2">📊 Form Status:</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-blue-700">Cluster ID:</span>
                  <span className={`ml-2 font-mono ${newAlertConfig.clusterId ? 'text-green-700' : 'text-red-700'}`}>
                    {newAlertConfig.clusterId || '❌ NOT SET'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Alert Type:</span>
                  <span className={`ml-2 font-mono ${newAlertConfig.alertType ? 'text-green-700' : 'text-red-700'}`}>
                    {newAlertConfig.alertType || '❌ NOT SET'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Severity:</span>
                  <span className={`ml-2 font-mono ${newAlertConfig.severity ? 'text-green-700' : 'text-red-700'}`}>
                    {newAlertConfig.severity || '❌ NOT SET'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Enabled:</span>
                  <span className="ml-2 font-mono text-green-700">
                    {newAlertConfig.enabled ? '✅ YES' : '❌ NO'}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-blue-200">
                <span className="text-blue-700">Button Status:</span>
                <span className={`ml-2 font-semibold ${(!isSubmittingAlert && clusterId && newAlertConfig.alertType && newAlertConfig.severity) ? 'text-green-700' : 'text-red-700'}`}>
                  {(!isSubmittingAlert && clusterId && newAlertConfig.alertType && newAlertConfig.severity) ? '✅ READY TO SUBMIT' : '❌ DISABLED (missing required fields)'}
                </span>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertsManagement;
