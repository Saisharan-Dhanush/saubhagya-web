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
  Search,
  Edit,
  Trash2,
  Check,
  FileCheck
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

// Alert status type
type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

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
  onResolve: (id: string, request: AlertActionRequest) => Promise<void>;
  onUpdate?: (alert: AlertResponse) => void;
  onDelete?: (id: string) => Promise<void>;
  onView?: (alert: AlertResponse) => void;
  t: (key: string) => string;
  showDeleteEdit?: boolean; // Only show edit/delete in config tab
}> = ({ alert, onAcknowledge, onResolve, onUpdate, onDelete, onView, t, showDeleteEdit = false }) => {
  const [acknowledging, setAcknowledging] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        setDeleting(true);
        await onDelete(alert.alertId || alert.id);
      } catch (error) {
        console.error('Error in handleDelete:', error);
      } finally {
        setDeleting(false);
      }
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
                <span className="font-medium">Triggered:</span> {new Date(alert.createdAt || alert.triggeredAt).toLocaleString()}
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
            {/* View Button - Always shown */}
            {onView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(alert)}
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}

            {/* Resolve Button - Always shown */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onResolve(alert.alertId || alert.id, {} as AlertActionRequest)}
              disabled={alert.status === 'RESOLVED'}
              title="Resolve Alert"
            >
              <FileCheck className="w-4 h-4 text-blue-600" />
            </Button>

            {/* Acknowledge Button - Only for ACTIVE alerts */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleAcknowledge}
              disabled={alert.status !== 'ACTIVE' || acknowledging}
              title="Acknowledge Alert"
            >
              {acknowledging ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </Button>

            {/* Edit & Delete - Only shown in config/history when explicitly enabled */}
            {showDeleteEdit && onUpdate && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdate(alert)}
                title="Update Alert"
              >
                <Edit className="w-4 h-4 text-orange-600" />
              </Button>
            )}
            {showDeleteEdit && onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete Alert"
              >
                {deleting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 text-red-600" />
                )}
              </Button>
            )}
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

  // Separate filter states for Active Alerts tab
  const [activeAlertsSeverityFilter, setActiveAlertsSeverityFilter] = useState<string>('all');
  const [activeAlertsSearchQuery, setActiveAlertsSearchQuery] = useState<string>('');

  // Separate filter states for Alert History tab
  const [historyAlertsSeverityFilter, setHistoryAlertsSeverityFilter] = useState<string>('all');
  const [historyAlertsSearchQuery, setHistoryAlertsSearchQuery] = useState<string>('');

  const [clusterId, setClusterId] = useState<string>('1'); // Default to cluster 1
  const [selectedAlert, setSelectedAlert] = useState<AlertResponse | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [dialogAcknowledging, setDialogAcknowledging] = useState(false);
  const [dialogResolving, setDialogResolving] = useState(false);

  // Add Alert Configuration Dialog State
  const [isAddAlertDialogOpen, setIsAddAlertDialogOpen] = useState(false);
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    clusterId: '1',
    alertType: 'LOW_PRODUCTION',
    severity: 'WARNING',
    message: '',
    description: '',
    enabled: true
  });

  // Resolve Alert Dialog State
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolveAlertId, setResolveAlertId] = useState<string | null>(null);
  const [resolveForm, setResolveForm] = useState({
    actionTaken: '',
    resolutionNotes: ''
  });

  // Update Alert Dialog State
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateAlert, setUpdateAlert] = useState<AlertResponse | null>(null);
  const [updateForm, setUpdateForm] = useState({
    clusterId: '1',
    alertType: '',
    severity: '',
    message: ''
  });

  // Alert Configuration states
  const [isViewConfigDialogOpen, setIsViewConfigDialogOpen] = useState(false);
  const [viewConfig, setViewConfig] = useState<AlertConfigurationResponse | null>(null);
  const [isUpdateConfigDialogOpen, setIsUpdateConfigDialogOpen] = useState(false);
  const [updateConfig, setUpdateConfig] = useState<AlertConfigurationResponse | null>(null);
  const [configForm, setConfigForm] = useState({
    clusterId: '',
    alertType: '',
    severity: '',
    thresholdValue: '',
    description: '',
    enabled: true
  });

  const lang = languageContext?.language || 'en';
  const t = (key: string): string => {
    return languageContext?.t(key) || translations[lang][key as keyof typeof translations[typeof lang]] || key;
  };

  // Handle add alert configuration functionality
  const handleAddAlert = () => {
    if (!clusterId) {
      showErrorToast('Please select a digester first before adding an alert configuration');
      return;
    }

    // Reset form and set cluster ID
    setNewAlert({
      clusterId: clusterId,
      alertType: 'LOW_PRODUCTION',
      severity: 'WARNING',
      message: '',
      description: '',
      enabled: true
    });
    setIsAddAlertDialogOpen(true);

    console.log('📝 Opening Add Alert Configuration dialog for cluster:', clusterId);
  };


  // Handle view alert details
  const handleViewAlertDetails = (alert: AlertResponse) => {
    setSelectedAlert(alert);
    setIsDetailDialogOpen(true);
  };

  // Handle submit alert configuration
  const handleSubmitNewAlert = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('🚀🚀🚀 CREATE CONFIGURATION SUBMIT CALLED! 🚀🚀🚀');
    console.group('⚙️ Add Alert Configuration - Starting Validation');
    console.log('Current form state:', newAlert);

    // Validation
    if (!newAlert.clusterId) {
      console.error('❌ Validation failed: No cluster ID');
      console.groupEnd();
      showErrorToast('Cluster ID is missing. Please close and reopen the dialog.');
      return;
    }

    if (!newAlert.alertType) {
      console.error('❌ Validation failed: No alert type');
      console.groupEnd();
      showErrorToast('Alert type is required');
      return;
    }

    if (!newAlert.severity) {
      console.error('❌ Validation failed: No severity');
      console.groupEnd();
      showErrorToast('Severity is required');
      return;
    }

    if (!newAlert.message || newAlert.message.trim() === '') {
      console.error('❌ Validation failed: No threshold value');
      console.groupEnd();
      showErrorToast('Threshold value is required');
      return;
    }

    console.log('✅ Validation passed');
    console.groupEnd();

    setIsSubmittingAlert(true);
    const toastId = showLoadingToast('Creating alert configuration...');

    try {
      console.group('⚙️ Creating Alert Configuration');

      const configPayload = {
        clusterId: Number(newAlert.clusterId),
        alertType: newAlert.alertType,
        severity: newAlert.severity,
        thresholdValue: parseFloat(newAlert.message),
        description: newAlert.description || `${newAlert.alertType} configuration`,
        enabled: newAlert.enabled
      };

      console.log('📤 Request payload:', JSON.stringify(configPayload, null, 2));
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
        biogasService.createAlertConfiguration(configPayload),
        timeoutPromise
      ]) as any;

      const endTime = Date.now();
      console.log(`⏱️ Request completed in ${endTime - startTime}ms`);
      console.log('📥 Response received:', response);

      // Dismiss the loading toast ONCE
      toast.dismiss(toastId);

      if (response && response.success) {
        console.log('✅ Alert configuration created successfully!');
        console.log('📥 Response data:', response.data);
        console.groupEnd();

        // Show success toast after loading is dismissed
        showSuccessToast('✅ Alert configuration created successfully!');

        // Close dialog
        setIsAddAlertDialogOpen(false);

        // Reset form
        setNewAlert({
          clusterId: clusterId,
          alertType: 'LOW_PRODUCTION',
          severity: 'WARNING',
          message: '',
          description: '',
          enabled: true
        });

        // Small delay to ensure backend has persisted the data
        console.log('⏳ Waiting 500ms before reloading data...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Reload data
        console.log('🔄 Reloading alert configurations...');
        await loadData();
        console.log('✅ Data reload complete');
      } else {
        throw new Error(response?.error || response?.message || 'Backend returned error');
      }
    } catch (error: any) {
      // Dismiss the loading toast ONCE
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

      // Show error toast after loading is dismissed
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

  // Create sample alerts in database if none exist
  const createSampleAlertsInDatabase = async (clusterIdParam: string) => {
    try {
      console.log('📝 Creating sample alerts in database...');

      const sampleAlerts = [
        {
          clusterId: Number(clusterIdParam),
          alertType: 'QUALITY_ISSUE',
          severity: 'CRITICAL',
          message: 'Gas quality parameters below acceptable threshold - immediate attention required'
        },
        {
          clusterId: Number(clusterIdParam),
          alertType: 'MAINTENANCE_DUE',
          severity: 'CRITICAL',
          message: 'System maintenance overdue - critical equipment failing'
        },
        {
          clusterId: Number(clusterIdParam),
          alertType: 'LOW_PRODUCTION',
          severity: 'WARNING',
          message: 'Biogas production levels dropping - operating at 75% capacity'
        },
        {
          clusterId: Number(clusterIdParam),
          alertType: 'PAYMENT_FAILURE',
          severity: 'INFO',
          message: 'Scheduled maintenance completed successfully'
        }
      ];

      for (const alert of sampleAlerts) {
        try {
          await biogasService.triggerAlert(
            alert.clusterId,
            alert.alertType,
            alert.message,
            alert.severity
          );
          console.log('✅ Created alert:', alert.alertType);
        } catch (error) {
          console.error('⚠️ Failed to create alert:', alert.alertType, error);
        }
      }

      console.log('✅ Sample alerts created in database');
    } catch (error) {
      console.error('❌ Error creating sample alerts:', error);
    }
  };

  // Load data
  const loadData = async () => {
    if (!clusterId) {
      console.warn('⚠️ loadData called without clusterId');
      return; // Don't load if no cluster selected
    }

    console.log('🔄 Loading alert data for cluster:', clusterId);
    setLoading(true);
    try {
      // Load active alerts (always fetch all, filter on frontend)
      console.log('📡 Fetching active alerts...');
      const activeResponse = await biogasService.getActiveAlerts(
        clusterId,
        undefined  // Always fetch all active alerts, filter on frontend for better UX
      );

      if (activeResponse.success && activeResponse.data) {
        const alerts = activeResponse.data.content || [];
        console.log('✅ Active alerts loaded:', alerts.length);

        // If no alerts exist in database, create sample alerts
        if (alerts.length === 0) {
          console.log('⚠️ No alerts found in database, creating sample alerts...');
          await createSampleAlertsInDatabase(clusterId);

          // Reload alerts after creating samples
          console.log('🔄 Reloading alerts after creating samples...');
          const reloadResponse = await biogasService.getActiveAlerts(
            clusterId,
            undefined
          );
          if (reloadResponse.success && reloadResponse.data) {
            setActiveAlerts(reloadResponse.data.content || []);
            console.log('✅ Alerts reloaded from database:', reloadResponse.data.content?.length || 0);
          }
        } else {
          // Display real alerts from database
          setActiveAlerts(alerts);
        }
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

      // Load configurations (existing threshold-based rules)
      console.log('📡 Fetching alert configurations for cluster:', clusterId);
      const configResponse = await biogasService.getAlertConfigurations(clusterId);

      if (configResponse.success && configResponse.data) {
        console.log('✅ Alert configurations loaded:', configResponse.data.length, 'configurations');
        setConfigurations(configResponse.data || []);
      } else {
        console.error('❌ Failed to load configurations:', configResponse.error);
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
  }, [clusterId]);


  const handleAcknowledgeAlert = async (id: string) => {
    const toastId = showLoadingToast('Acknowledging alert...');
    try {
      const result = await biogasService.acknowledgeAlert(Number(id));

      // Dismiss loading toast ONCE
      toast.dismiss(toastId);

      if (result.success) {
        console.log('✅ Alert acknowledged:', result.data);
        showSuccessToast('Alert acknowledged successfully');

        // Add small delay to ensure backend has persisted
        await new Promise(resolve => setTimeout(resolve, 500));

        // Reload both active alerts and history to reflect the change
        console.log('🔄 Reloading alert data...');
        await loadData();
        console.log('✅ Data reloaded');
      } else {
        showErrorToast(result.error || 'Failed to acknowledge alert');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error('❌ Acknowledge error:', error);
      showErrorToast(error.message || 'Failed to acknowledge alert');
    }
  };

  const handleResolveAlert = async (id: string, request: AlertActionRequest) => {
    setResolveAlertId(id);
    setIsResolveDialogOpen(true);
  };

  const submitResolveAlert = async () => {
    if (!resolveAlertId) return;

    const toastId = showLoadingToast('Resolving alert...');
    try {
      console.log('📝 Resolving alert with form data:', resolveForm);

      const result = await biogasService.resolveAlert(Number(resolveAlertId), resolveForm);

      // Dismiss loading toast ONCE
      toast.dismiss(toastId);

      if (result.success) {
        console.log('✅ Alert resolved:', result.data);
        showSuccessToast('Alert resolved successfully');

        // Close dialog and reset form
        setIsResolveDialogOpen(false);
        setResolveForm({ actionTaken: '', resolutionNotes: '' });

        // Add small delay to ensure backend has persisted
        await new Promise(resolve => setTimeout(resolve, 500));

        // Reload both active alerts and history to reflect the change
        console.log('🔄 Reloading alert data...');
        await loadData();
        console.log('✅ Data reloaded');
      } else {
        showErrorToast(result.error || 'Failed to resolve alert');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error('❌ Resolve error:', error);
      showErrorToast(error.message || 'Failed to resolve alert');
    }
  };

  const handleUpdateAlert = (alert: AlertResponse) => {
    setUpdateAlert(alert);
    setUpdateForm({
      clusterId: alert.clusterId.toString(),
      alertType: alert.alertType,
      severity: alert.severity,
      message: alert.message
    });
    setIsUpdateDialogOpen(true);
  };

  const submitUpdateAlert = async () => {
    if (!updateAlert) return;

    const toastId = showLoadingToast('Updating alert...');
    try {
      const result = await biogasService.updateAlert(Number(updateAlert.alertId || updateAlert.id), updateForm);

      // Dismiss loading toast ONCE
      toast.dismiss(toastId);

      if (result.success) {
        showSuccessToast('Alert updated successfully');
        setIsUpdateDialogOpen(false);
        await fetchActiveAlerts();
      } else {
        showErrorToast(result.error || 'Failed to update alert');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      showErrorToast(error.message || 'Failed to update alert');
    }
  };

  const handleDeleteAlert = async (id: string) => {
    const toastId = showLoadingToast('Deleting alert...');
    try {
      const result = await biogasService.deleteAlert(Number(id));

      // Dismiss loading toast ONCE
      toast.dismiss(toastId);

      if (result.success) {
        showSuccessToast('Alert deleted successfully');
        await fetchActiveAlerts();
      } else {
        showErrorToast(result.error || 'Failed to delete alert');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      showErrorToast(error.message || 'Failed to delete alert');
    }
  };

  // Handler functions for Alert Configuration
  const handleViewConfiguration = (config: AlertConfigurationResponse) => {
    setViewConfig(config);
    setIsViewConfigDialogOpen(true);
  };

  const handleUpdateConfiguration = (config: AlertConfigurationResponse) => {
    setUpdateConfig(config);
    setConfigForm({
      clusterId: config.clusterId.toString(),
      alertType: config.alertType,
      severity: config.severity,
      thresholdValue: config.thresholdValue?.toString() || '',
      description: config.description || '',
      enabled: config.enabled !== undefined ? config.enabled : true
    });
    setIsUpdateConfigDialogOpen(true);
  };

  const submitUpdateConfiguration = async () => {
    if (!updateConfig) return;
    const toastId = showLoadingToast('Updating alert configuration...');
    try {
      const result = await biogasService.updateAlertConfiguration(Number(updateConfig.id), configForm);

      // Dismiss loading toast ONCE
      toast.dismiss(toastId);

      if (result.success) {
        showSuccessToast('Alert configuration updated successfully');
        setIsUpdateConfigDialogOpen(false);
        await fetchAlertConfigurations();
      } else {
        showErrorToast(result.error || 'Failed to update alert configuration');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      showErrorToast(error.message || 'Failed to update alert configuration');
    }
  };

  const handleDeleteConfiguration = async (id: number) => {
    if (!confirm('Are you sure you want to delete this alert configuration? This action cannot be undone.')) {
      return;
    }
    const toastId = showLoadingToast('Deleting alert configuration...');
    try {
      const result = await biogasService.deleteAlertConfiguration(id);

      // Dismiss loading toast ONCE
      toast.dismiss(toastId);

      if (result.success) {
        showSuccessToast('Alert configuration deleted successfully');
        await fetchAlertConfigurations();
      } else {
        showErrorToast(result.error || 'Failed to delete alert configuration');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      showErrorToast(error.message || 'Failed to delete alert configuration');
    }
  };

  // Toggle configuration enabled/disabled status
  const handleToggleConfiguration = async (id: number) => {
    const toastId = showLoadingToast('Updating configuration status...');
    try {
      const result = await biogasService.toggleAlertConfiguration(id);

      // Dismiss loading toast ONCE
      toast.dismiss(toastId);

      if (result.success) {
        const newStatus = result.data?.enabled ? 'enabled' : 'disabled';
        showSuccessToast(`Alert configuration ${newStatus} successfully`);

        // Update the viewConfig state immediately with the new data
        if (result.data) {
          setViewConfig(result.data);
        }

        // Reload configurations in the background
        await fetchAlertConfigurations();
      } else {
        showErrorToast(result.error || 'Failed to update configuration status');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      showErrorToast(error.message || 'Failed to update configuration status');
    }
  };

  const fetchAlertConfigurations = async () => {
    if (!clusterId) return;
    try {
      const configResponse = await biogasService.getAlertConfigurations(clusterId);
      if (configResponse.success && configResponse.data) {
        setConfigurations(configResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch alert configurations:', error);
    }
  };

  // Keep backward compatibility alias for loadData
  const fetchActiveAlerts = loadData;

  // Filter ACTIVE ALERTS based on Active Alerts tab filters (independent from Alert History)
  const filteredAlerts = activeAlerts.filter(alert => {
    // Apply severity filter FIRST
    if (activeAlertsSeverityFilter !== 'all' && alert.severity !== activeAlertsSeverityFilter) {
      return false;
    }

    // If no search query, return true (show the alert if it passed severity filter)
    if (!activeAlertsSearchQuery) {
      return true;
    }

    // Apply search query filter
    const query = activeAlertsSearchQuery.toLowerCase();
    return (
      alert.message?.toLowerCase().includes(query) ||
      alert.alertType?.toLowerCase().includes(query) ||
      alert.severity?.toLowerCase().includes(query) ||
      alert.status?.toLowerCase().includes(query)
    );
  });

  // Filter ALERT HISTORY based on Alert History tab filters (independent from Active Alerts)
  const filteredHistory = alertHistory.filter(alert => {
    // Apply severity filter FIRST
    if (historyAlertsSeverityFilter !== 'all' && alert.severity !== historyAlertsSeverityFilter) {
      return false;
    }

    // If no search query, return true (show the alert if it passed severity filter)
    if (!historyAlertsSearchQuery) {
      return true;
    }

    // Apply search query filter
    const query = historyAlertsSearchQuery.toLowerCase();
    return (
      alert.message?.toLowerCase().includes(query) ||
      alert.alertType?.toLowerCase().includes(query) ||
      alert.severity?.toLowerCase().includes(query) ||
      alert.status?.toLowerCase().includes(query)
    );
  });

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
              Add Alert Configuration
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
          <Card>
            <CardHeader>
              <CardTitle>{t('activeAlerts')}</CardTitle>
              <CardDescription>
                Real-time alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Search and Filter Controls - Side by Side */}
                <div className="space-y-4">
                  {/* Search and Filter Row */}
                  <div className="flex gap-4">
                    {/* Search Box */}
                    <div className="flex-1">
                      <Label htmlFor="active-search" className="text-sm mb-2 block">
                        <Search className="w-4 h-4 inline mr-2" />
                        Search alerts
                      </Label>
                      <Input
                        id="active-search"
                        placeholder="Search alerts by message, type, severity, or status..."
                        value={activeAlertsSearchQuery}
                        onChange={(e) => setActiveAlertsSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex-1">
                      <Label htmlFor="active-severity-filter" className="text-sm mb-2 block">
                        <Filter className="w-4 h-4 inline mr-2" />
                        Filter by Severity
                      </Label>
                      <Select value={activeAlertsSeverityFilter} onValueChange={setActiveAlertsSeverityFilter}>
                        <SelectTrigger id="active-severity-filter" className="w-full">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities (All alerts combined)</SelectItem>
                          <SelectItem value="CRITICAL">{t('critical')}</SelectItem>
                          <SelectItem value="WARNING">{t('warning')}</SelectItem>
                          <SelectItem value="INFO">{t('info')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredAlerts.length} of {activeAlerts.length} alerts
                  </div>
                </div>

                {/* Active Alerts List */}
                <div className="space-y-4">
                  {filteredAlerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                      <p>
                        {activeAlertsSearchQuery || activeAlertsSeverityFilter !== 'all'
                          ? 'No alerts match your filters'
                          : t('noAlerts')}
                      </p>
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <AlertCard
                        key={alert.alertId || alert.id}
                        alert={alert}
                        onAcknowledge={handleAcknowledgeAlert}
                        onResolve={handleResolveAlert}
                        onView={handleViewAlertDetails}
                        t={t}
                        showDeleteEdit={false}
                      />
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('alertHistory')}</CardTitle>
              <CardDescription>
                All alerts including active, acknowledged, and resolved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Search and Filter Controls for Alert History - Side by Side */}
                <div className="space-y-4">
                  {/* Search and Filter Row */}
                  <div className="flex gap-4 items-end">
                    {/* Search Box */}
                    <div className="flex-1">
                      <Label htmlFor="history-search" className="text-sm mb-2 block">
                        <Search className="w-4 h-4 inline mr-2" />
                        Search alerts
                      </Label>
                      <Input
                        id="history-search"
                        placeholder="Search alerts by message, type, severity, or status..."
                        value={historyAlertsSearchQuery}
                        onChange={(e) => setHistoryAlertsSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex-1">
                      <Label htmlFor="history-severity-filter" className="text-sm mb-2 block">
                        <Filter className="w-4 h-4 inline mr-2" />
                        Filter by Severity
                      </Label>
                      <Select value={historyAlertsSeverityFilter} onValueChange={setHistoryAlertsSeverityFilter}>
                        <SelectTrigger id="history-severity-filter" className="w-full">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities (All alerts combined)</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                          <SelectItem value="WARNING">Warning</SelectItem>
                          <SelectItem value="INFO">Info</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters Button */}
                    {(historyAlertsSearchQuery || historyAlertsSeverityFilter !== 'all') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setHistoryAlertsSearchQuery('');
                          setHistoryAlertsSeverityFilter('all');
                        }}
                        className="mb-0"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredHistory.length} of {alertHistory.length} alerts
                  </div>
                </div>

                {/* Alerts List */}
                <div className="space-y-4">
                  {filteredHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-2" />
                      <p>
                        {historyAlertsSearchQuery || historyAlertsSeverityFilter !== 'all'
                          ? 'No alerts match your filters'
                          : t('noAlerts')}
                      </p>
                    </div>
                  ) : (
                    filteredHistory.slice(0, 20).map((alert) => (
                      <AlertCard
                        key={alert.alertId || alert.id}
                        alert={alert}
                        onAcknowledge={handleAcknowledgeAlert}
                        onResolve={handleResolveAlert}
                        onView={handleViewAlertDetails}
                        t={t}
                        showDeleteEdit={false}
                      />
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configurations">
          <Card>
            <CardHeader>
              <CardTitle>{t('configurations')}</CardTitle>
              <CardDescription>
                Threshold-based monitoring rules (NOT alert messages)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Note:</strong> This tab shows configuration rules only.
                  Alerts created using "Add Alert" button appear in the "Alert History" tab.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {configurations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info className="w-12 h-12 mx-auto mb-2" />
                    <p>No alert configurations found</p>
                    <p className="text-xs mt-2">This is normal - configurations are different from alerts</p>
                  </div>
                ) : (
                  configurations.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="space-y-1 flex-1">
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

                      {/* Action Buttons - Only 3 buttons: View, Update, Delete */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewConfiguration(config)}
                          className="h-8 w-8 p-0"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateConfiguration(config)}
                          className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          title="Update Configuration"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteConfiguration(Number(config.id))}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete Configuration"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                          await handleAcknowledgeAlert(selectedAlert.alertId || selectedAlert.id);
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
                          await handleResolveAlert(selectedAlert.alertId || selectedAlert.id, {} as AlertActionRequest);
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
              Add Alert Configuration
            </DialogTitle>
            <DialogDescription>
              Create a new alert configuration rule that will appear in Alert Configurations
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
                value={newAlert.alertType}
                onValueChange={(value) => {
                  console.log('Alert type changed to:', value);
                  setNewAlert({ ...newAlert, alertType: value });
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
                value={newAlert.severity}
                onValueChange={(value) => {
                  console.log('Severity changed to:', value);
                  setNewAlert({ ...newAlert, severity: value });
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

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description <span className="text-gray-400">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this alert configuration..."
                value={newAlert.description}
                onChange={(e) => {
                  console.log('Description changed');
                  setNewAlert({ ...newAlert, description: e.target.value });
                }}
                rows={2}
              />
            </div>

            {/* Threshold Value */}
            <div className="space-y-2">
              <Label htmlFor="threshold" className="text-sm font-semibold">
                Threshold Value <span className="text-red-500">*</span>
              </Label>
              <Input
                id="threshold"
                type="number"
                placeholder="Enter threshold value (e.g., 50, 100)"
                value={newAlert.message}
                onChange={(e) => {
                  console.log('Threshold changed');
                  setNewAlert({ ...newAlert, message: e.target.value });
                }}
              />
              <p className="text-xs text-muted-foreground">
                The threshold value for this alert configuration
              </p>
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
                  console.log('🖱️🖱️🖱️ CREATE ALERT CONFIGURATION BUTTON CLICKED! 🖱️🖱️🖱️');
                  e.preventDefault();
                  handleSubmitNewAlert();
                }}
                disabled={isSubmittingAlert || !clusterId || !newAlert.alertType || !newAlert.severity || !newAlert.message.trim()}
                className="min-w-[150px] bg-green-600 hover:bg-green-700"
              >
                {isSubmittingAlert ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Create Configuration</span>
                  </>
                )}
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

      {/* Resolve Alert Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Provide resolution details for this alert
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Resolution Type / Action Taken</Label>
              <Select
                value={resolveForm.actionTaken}
                onValueChange={(value) => setResolveForm(prev => ({ ...prev, actionTaken: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISSUE_FIXED">Issue Fixed</SelectItem>
                  <SelectItem value="SYSTEM_RESTORED">System Restored</SelectItem>
                  <SelectItem value="MAINTENANCE_COMPLETED">Maintenance Completed</SelectItem>
                  <SelectItem value="FALSE_ALARM">False Alarm</SelectItem>
                  <SelectItem value="ESCALATED">Escalated to Higher Authority</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Resolution Notes</Label>
              <Textarea
                placeholder="Describe how the issue was resolved..."
                value={resolveForm.resolutionNotes}
                onChange={(e) => setResolveForm(prev => ({ ...prev, resolutionNotes: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitResolveAlert} disabled={!resolveForm.actionTaken || !resolveForm.resolutionNotes}>
                Resolve Alert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Alert Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Alert</DialogTitle>
            <DialogDescription>
              Modify alert details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Alert Type</Label>
              <Select
                value={updateForm.alertType}
                onValueChange={(value) => setUpdateForm(prev => ({ ...prev, alertType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW_PRODUCTION">Low Production</SelectItem>
                  <SelectItem value="QUALITY_ISSUE">Quality Issue</SelectItem>
                  <SelectItem value="PAYMENT_FAILURE">Payment Failure</SelectItem>
                  <SelectItem value="MAINTENANCE_DUE">Maintenance Due</SelectItem>
                  <SelectItem value="PICKUP_OVERDUE">Pickup Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Severity</Label>
              <Select
                value={updateForm.severity}
                onValueChange={(value) => setUpdateForm(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={updateForm.message}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitUpdateAlert} disabled={!updateForm.message}>
                Update Alert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Configuration Dialog */}
      <Dialog open={isViewConfigDialogOpen} onOpenChange={setIsViewConfigDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Alert Configuration Details</DialogTitle>
            <DialogDescription>
              View and manage configuration
            </DialogDescription>
          </DialogHeader>
          {viewConfig && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-semibold">Cluster ID</Label>
                <p className="text-sm">{viewConfig.clusterId}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Alert Type</Label>
                <p className="text-sm">{viewConfig.alertType}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Severity</Label>
                <Badge className={getAlertLevelColor(viewConfig.severity)}>
                  {viewConfig.severity}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-semibold">Threshold Value</Label>
                <p className="text-sm">{viewConfig.thresholdValue || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Description</Label>
                <p className="text-sm">{viewConfig.description || 'No description'}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Status</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={viewConfig.enabled ? 'default' : 'secondary'}>
                    {viewConfig.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Button
                    size="sm"
                    variant={viewConfig.enabled ? 'destructive' : 'default'}
                    onClick={() => handleToggleConfiguration(Number(viewConfig.id))}
                    className="ml-2"
                  >
                    {viewConfig.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">Created At</Label>
                <p className="text-sm">{viewConfig.createdAt ? new Date(viewConfig.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsViewConfigDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Configuration Dialog */}
      <Dialog open={isUpdateConfigDialogOpen} onOpenChange={setIsUpdateConfigDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Alert Configuration</DialogTitle>
            <DialogDescription>
              Modify alert configuration settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Alert Type</Label>
              <Select
                value={configForm.alertType}
                onValueChange={(value) => setConfigForm(prev => ({ ...prev, alertType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW_PRODUCTION">Low Production</SelectItem>
                  <SelectItem value="QUALITY_ISSUE">Quality Issue</SelectItem>
                  <SelectItem value="PAYMENT_FAILURE">Payment Failure</SelectItem>
                  <SelectItem value="MAINTENANCE_DUE">Maintenance Due</SelectItem>
                  <SelectItem value="PICKUP_OVERDUE">Pickup Overdue</SelectItem>
                  <SelectItem value="HIGH_INVENTORY">High Inventory</SelectItem>
                  <SelectItem value="DISPUTE_RAISED">Dispute Raised</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Severity</Label>
              <Select
                value={configForm.severity}
                onValueChange={(value) => setConfigForm(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Threshold Value</Label>
              <Input
                value={configForm.thresholdValue}
                onChange={(e) => setConfigForm(prev => ({ ...prev, thresholdValue: e.target.value }))}
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={configForm.description}
                onChange={(e) => setConfigForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the alert configuration..."
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enabled"
                checked={configForm.enabled}
                onChange={(e) => setConfigForm(prev => ({ ...prev, enabled: e.target.checked }))}
                className="h-4 w-4"
              />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsUpdateConfigDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitUpdateConfiguration} disabled={!configForm.alertType || !configForm.severity}>
                Update Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AlertsManagement;
