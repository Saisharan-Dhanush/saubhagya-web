import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Volume2,
  VolumeX,
  Thermometer,
  Gauge,
  Zap,
  Trash2,
  Eye,
  Plus,
  Filter,
  RotateCcw,
  BellRing,
  Info,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  RefreshCw,
  Shield,
  Wrench,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';

// Mock types for AlertsManagement
type AlertLevel = 'critical' | 'warning' | 'info' | 'success';
type AlertType = 'temperature' | 'pressure' | 'methane' | 'gasProduction' | 'efficiency' | 'connectivity' | 'safety' | 'maintenance';

interface AlertData {
  id: string;
  level: AlertLevel;
  type: AlertType;
  title: string;
  message: string;
  digesterId: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  value?: string;
  severity?: number;
  location?: string;
  assignedTo?: string;
  estimatedResolution?: string;
}

interface ThresholdConfig {
  type: AlertType;
  enabled: boolean;
  minThreshold: number;
  maxThreshold: number;
  unit?: string;
  description?: string;
}

// Enhanced Mock data with comprehensive Indian biogas operations alerts
const alerts: AlertData[] = [
  {
    id: 'A001',
    level: 'warning',
    type: 'temperature',
    title: 'High Temperature Alert - Digester 001',
    message: 'Temperature exceeds optimal range at 42°C. Recommended range: 35-40°C. Automatic cooling system activated.',
    digesterId: 'DIG-001',
    timestamp: new Date().toISOString(),
    status: 'active',
    value: '42.3°C',
    severity: 3,
    location: 'Gokul Gaushala Main Unit',
    assignedTo: 'राजेश कुमार',
    estimatedResolution: '2 hours'
  },
  {
    id: 'A002',
    level: 'critical',
    type: 'pressure',
    title: 'Critical Pressure Level - Buffalo Unit',
    message: 'Pressure levels dangerously high at 2.1 kPa. Immediate attention required. Safety valve may trigger.',
    digesterId: 'DIG-003',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'active',
    value: '2.1 kPa',
    severity: 5,
    location: 'Yamuna Riverside Buffalo Unit',
    assignedTo: 'सुनील यादव',
    estimatedResolution: 'Immediate'
  },
  {
    id: 'A003',
    level: 'warning',
    type: 'methane',
    title: 'Low Methane Content - Secondary Unit',
    message: 'Methane levels dropped to 58%. Expected range: 60-70%. Check feedstock quality and pH levels.',
    digesterId: 'DIG-002',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'active',
    value: '58.2%',
    severity: 3,
    location: 'Vrindavan Organic Farm',
    assignedTo: 'अमित शर्मा',
    estimatedResolution: '4 hours'
  },
  {
    id: 'A004',
    level: 'critical',
    type: 'connectivity',
    title: 'IoT Sensor Connection Lost',
    message: 'Temperature and pressure sensors offline for Digester 005. Last reading 45 minutes ago. Manual monitoring required.',
    digesterId: 'DIG-005',
    timestamp: new Date(Date.now() - 2700000).toISOString(),
    status: 'active',
    value: 'Offline 45min',
    severity: 4,
    location: 'Experimental Unit',
    assignedTo: 'तकनीकी टीम',
    estimatedResolution: '1 hour'
  },
  {
    id: 'A005',
    level: 'warning',
    type: 'gasProduction',
    title: 'Reduced Gas Production - Main Unit',
    message: 'Daily production down 15% from average. Current: 128 m³/day, Expected: 150 m³/day. Check feeding schedule.',
    digesterId: 'DIG-001',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    status: 'active',
    value: '128 m³/day',
    severity: 2,
    location: 'Gokul Gaushala Main Unit',
    assignedTo: 'गीता देवी',
    estimatedResolution: '6 hours'
  },
  {
    id: 'A006',
    level: 'info',
    type: 'maintenance',
    title: 'Scheduled Maintenance Due - Mixed Feed Unit',
    message: 'Routine maintenance scheduled for Digester 004 tomorrow at 10:00 AM. Expected downtime: 4 hours.',
    digesterId: 'DIG-004',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    status: 'active',
    value: 'Tomorrow 10:00 AM',
    severity: 1,
    location: 'Mixed Feed Processing',
    assignedTo: 'रखरखाव टीम',
    estimatedResolution: '24 hours'
  },
  {
    id: 'A007',
    level: 'critical',
    type: 'safety',
    title: 'Gas Leak Detection - Safety Alert',
    message: 'Potential gas leak detected near Digester 002. Area evacuated. Emergency response team notified. Safety protocols activated.',
    digesterId: 'DIG-002',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    status: 'active',
    value: 'Level 3 Alert',
    severity: 5,
    location: 'Vrindavan Organic Farm',
    assignedTo: 'आपातकालीन टीम',
    estimatedResolution: 'Immediate'
  },
  {
    id: 'A008',
    level: 'warning',
    type: 'efficiency',
    title: 'Efficiency Drop - Buffalo Unit',
    message: 'Overall efficiency decreased to 78%. Normal range: 85-92%. Consider feedstock optimization and pH adjustment.',
    digesterId: 'DIG-003',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    status: 'acknowledged',
    value: '78%',
    severity: 3,
    location: 'Yamuna Riverside Buffalo Unit',
    assignedTo: 'विकास कुमार',
    estimatedResolution: '8 hours'
  },
  {
    id: 'A009',
    level: 'warning',
    type: 'temperature',
    title: 'Low Temperature - Experimental Unit',
    message: 'Temperature dropped to 32°C due to ambient weather. Heating system activated. Monitoring bacterial activity.',
    digesterId: 'DIG-005',
    timestamp: new Date(Date.now() - 25200000).toISOString(),
    status: 'resolved',
    value: '32.1°C',
    severity: 2,
    location: 'Experimental Unit',
    assignedTo: 'लक्ष्मी यादव',
    estimatedResolution: 'Resolved'
  },
  {
    id: 'A010',
    level: 'info',
    type: 'gasProduction',
    title: 'Optimal Production - Main Unit',
    message: 'Excellent gas production recorded. 165 m³/day achieved - 10% above target. Feeding schedule optimized.',
    digesterId: 'DIG-001',
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    status: 'resolved',
    value: '165 m³/day',
    severity: 1,
    location: 'Gokul Gaushala Main Unit',
    assignedTo: 'राजेश कुमार',
    estimatedResolution: 'Resolved'
  },
  {
    id: 'A011',
    level: 'critical',
    type: 'pressure',
    title: 'Pressure Relief Valve Triggered',
    message: 'Automatic pressure relief activated on Digester 004. System stabilized. Check for blockages in gas outlet lines.',
    digesterId: 'DIG-004',
    timestamp: new Date(Date.now() - 32400000).toISOString(),
    status: 'acknowledged',
    value: '2.3 kPa',
    severity: 4,
    location: 'Mixed Feed Processing',
    assignedTo: 'सुरेश चंद्र',
    estimatedResolution: '3 hours'
  },
  {
    id: 'A012',
    level: 'warning',
    type: 'maintenance',
    title: 'Cleaning Cycle Overdue - Secondary Unit',
    message: 'Digester cleaning overdue by 3 days. Efficiency may be impacted. Schedule cleaning within 24 hours.',
    digesterId: 'DIG-002',
    timestamp: new Date(Date.now() - 36000000).toISOString(),
    status: 'active',
    value: '3 days overdue',
    severity: 3,
    location: 'Vrindavan Organic Farm',
    assignedTo: 'रखरखाव टीम',
    estimatedResolution: '12 hours'
  },
  {
    id: 'A013',
    level: 'info',
    type: 'connectivity',
    title: 'IoT System Upgrade Complete',
    message: 'Sensor firmware updated successfully on all digesters. New features: enhanced accuracy and predictive maintenance alerts.',
    digesterId: 'ALL',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    status: 'resolved',
    value: 'v2.1.3',
    severity: 1,
    location: 'All Units',
    assignedTo: 'तकनीकी टीम',
    estimatedResolution: 'Completed'
  },
  {
    id: 'A014',
    level: 'warning',
    type: 'methane',
    title: 'Methane Purity Concern - Mixed Feed',
    message: 'Methane purity at 61% with higher CO2 content. Check feedstock composition and pH balance. Consider additives.',
    digesterId: 'DIG-004',
    timestamp: new Date(Date.now() - 46800000).toISOString(),
    status: 'acknowledged',
    value: '61.3%',
    severity: 3,
    location: 'Mixed Feed Processing',
    assignedTo: 'अमित शर्मा',
    estimatedResolution: '6 hours'
  },
  {
    id: 'A015',
    level: 'critical',
    type: 'safety',
    title: 'Emergency Shutdown - Buffalo Unit',
    message: 'Emergency shutdown triggered due to multiple sensor failures. Unit isolated. Technical team dispatched for inspection.',
    digesterId: 'DIG-003',
    timestamp: new Date(Date.now() - 50400000).toISOString(),
    status: 'resolved',
    value: 'System Isolated',
    severity: 5,
    location: 'Yamuna Riverside Buffalo Unit',
    assignedTo: 'आपातकालीन टीम',
    estimatedResolution: 'Resolved'
  }
];

const thresholds: ThresholdConfig[] = [
  {
    type: 'temperature',
    enabled: true,
    minThreshold: 35,
    maxThreshold: 40,
    unit: '°C',
    description: 'Optimal temperature range for methanogenic bacteria activity'
  },
  {
    type: 'pressure',
    enabled: true,
    minThreshold: 0.8,
    maxThreshold: 1.8,
    unit: 'kPa',
    description: 'Safe operating pressure range for biogas digester'
  },
  {
    type: 'methane',
    enabled: true,
    minThreshold: 60,
    maxThreshold: 75,
    unit: '%',
    description: 'Methane content percentage in biogas output'
  },
  {
    type: 'gasProduction',
    enabled: true,
    minThreshold: 100,
    maxThreshold: 200,
    unit: 'm³/day',
    description: 'Daily biogas production volume'
  },
  {
    type: 'efficiency',
    enabled: true,
    minThreshold: 80,
    maxThreshold: 95,
    unit: '%',
    description: 'Overall digester efficiency percentage'
  },
  {
    type: 'connectivity',
    enabled: true,
    minThreshold: 95,
    maxThreshold: 100,
    unit: '%',
    description: 'IoT sensor connectivity and data availability'
  },
  {
    type: 'safety',
    enabled: true,
    minThreshold: 0,
    maxThreshold: 0,
    unit: 'level',
    description: 'Safety alert threshold (0 = no tolerance for safety issues)'
  },
  {
    type: 'maintenance',
    enabled: true,
    minThreshold: 0,
    maxThreshold: 7,
    unit: 'days',
    description: 'Maintenance schedule adherence (max 7 days overdue)'
  }
];

// Mock functions
const resolveAlert = async (alertId: string) => {
  console.log('Resolving alert:', alertId);
  return Promise.resolve();
};

const dismissAlert = async (alertId: string) => {
  console.log('Dismissing alert:', alertId);
  return Promise.resolve();
};

const updateThreshold = async (config: ThresholdConfig) => {
  console.log('Updating threshold:', config);
  return Promise.resolve();
};

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
    thresholdSettings: 'Threshold Settings',
    notificationSettings: 'Notification Settings',
    createAlert: 'Create Alert',
    critical: 'Critical',
    warning: 'Warning',
    info: 'Info',
    success: 'Success',
    temperature: 'Temperature',
    pressure: 'Pressure',
    methane: 'Methane Level',
    gasProduction: 'Gas Production',
    efficiency: 'Efficiency',
    connectivity: 'Connectivity',
    safety: 'Safety',
    maintenance: 'Maintenance',
    digesterId: 'Digester ID',
    alertType: 'Alert Type',
    level: 'Level',
    message: 'Message',
    timestamp: 'Timestamp',
    status: 'Status',
    actions: 'Actions',
    resolve: 'Resolve',
    dismiss: 'Dismiss',
    viewDetails: 'View Details',
    soundAlerts: 'Sound Alerts',
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    pushNotifications: 'Push Notifications',
    acknowledgeAll: 'Acknowledge All',
    clearHistory: 'Clear History',
    exportAlerts: 'Export Alerts',
    minThreshold: 'Minimum Threshold',
    maxThreshold: 'Maximum Threshold',
    enabled: 'Enabled',
    disabled: 'Disabled',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved',
    active: 'Active',
    temperatureThresholds: 'Temperature Thresholds',
    pressureThresholds: 'Pressure Thresholds',
    methaneThresholds: 'Methane Thresholds',
    productionThresholds: 'Production Thresholds',
    alertCount: 'Total Alerts',
    criticalCount: 'Critical Alerts',
    warningCount: 'Warning Alerts',
    resolvedToday: 'Resolved Today',
    alertFrequency: 'Alert Frequency',
    responseTime: 'Avg Response Time',
    systemStatus: 'System Status',
    monitoringActive: 'Monitoring Active',
    allSystems: 'All Systems Operational',
    someIssues: 'Some Issues Detected',
    criticalIssues: 'Critical Issues Present',
    location: 'Location',
    assignedTo: 'Assigned To',
    estimatedResolution: 'Est. Resolution',
    severity: 'Severity',
    value: 'Current Value',
    unit: 'Unit',
    description: 'Description'
  },
  hi: {
    title: 'अलर्ट प्रबंधन',
    subtitle: 'रियल-टाइम निगरानी और थ्रेशोल्ड प्रबंधन',
    activeAlerts: 'सक्रिय अलर्ट',
    alertHistory: 'अलर्ट इतिहास',
    thresholdSettings: 'थ्रेशोल्ड सेटिंग्स',
    notificationSettings: 'नोटिफिकेशन सेटिंग्स',
    createAlert: 'अलर्ट बनाएं',
    critical: 'गंभीर',
    warning: 'चेतावनी',
    info: 'जानकारी',
    success: 'सफलता',
    temperature: 'तापमान',
    pressure: 'दबाव',
    methane: 'मीथेन स्तर',
    gasProduction: 'गैस उत्पादन',
    efficiency: 'दक्षता',
    connectivity: 'कनेक्टिविटी',
    safety: 'सुरक्षा',
    maintenance: 'रखरखाव',
    digesterId: 'डाइजेस्टर आईडी',
    alertType: 'अलर्ट प्रकार',
    level: 'स्तर',
    message: 'संदेश',
    timestamp: 'समयमुहर',
    status: 'स्थिति',
    actions: 'कार्य',
    resolve: 'हल करें',
    dismiss: 'खारिज करें',
    viewDetails: 'विवरण देखें',
    soundAlerts: 'ध्वनि अलर्ट',
    emailNotifications: 'ईमेल नोटिफिकेशन',
    smsNotifications: 'SMS नोटिफिकेशन',
    pushNotifications: 'पुश नोटिफिकेशन',
    acknowledgeAll: 'सभी स्वीकार करें',
    clearHistory: 'इतिहास साफ करें',
    exportAlerts: 'अलर्ट निर्यात करें',
    minThreshold: 'न्यूनतम थ्रेशोल्ड',
    maxThreshold: 'अधिकतम थ्रेशोल्ड',
    enabled: 'सक्षम',
    disabled: 'अक्षम',
    acknowledged: 'स्वीकृत',
    resolved: 'हल किया गया',
    active: 'सक्रिय',
    temperatureThresholds: 'तापमान थ्रेशोल्ड',
    pressureThresholds: 'दबाव थ्रेशोल्ड',
    methaneThresholds: 'मीथेन थ्रेशोल्ड',
    productionThresholds: 'उत्पादन थ्रेशोल्ड',
    alertCount: 'कुल अलर्ट',
    criticalCount: 'गंभीर अलर्ट',
    warningCount: 'चेतावनी अलर्ट',
    resolvedToday: 'आज हल किए गए',
    alertFrequency: 'अलर्ट आवृत्ति',
    responseTime: 'औसत प्रतिक्रिया समय',
    systemStatus: 'सिस्टम स्थिति',
    monitoringActive: 'निगरानी सक्रिय',
    allSystems: 'सभी सिस्टम चालू',
    someIssues: 'कुछ समस्याएं मिलीं',
    criticalIssues: 'गंभीर समस्याएं मौजूद',
    location: 'स्थान',
    assignedTo: 'सौंपा गया',
    estimatedResolution: 'अनुमानित समाधान',
    severity: 'गंभीरता',
    value: 'वर्तमान मान',
    unit: 'इकाई',
    description: 'विवरण'
  }
};

const getAlertLevelColor = (level: AlertLevel): string => {
  switch (level) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'info':
      return 'bg-blue-100 text-blue-800';
    case 'success':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getAlertIcon = (level: AlertLevel) => {
  switch (level) {
    case 'critical':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'warning':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'info':
      return <Info className="w-4 h-4 text-blue-500" />;
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const getTypeIcon = (type: AlertType) => {
  switch (type) {
    case 'temperature':
      return <Thermometer className="w-4 h-4" />;
    case 'pressure':
      return <Gauge className="w-4 h-4" />;
    case 'methane':
      return <Zap className="w-4 h-4" />;
    case 'gasProduction':
      return <Activity className="w-4 h-4" />;
    case 'efficiency':
      return <CheckCircle className="w-4 h-4" />;
    case 'connectivity':
      return <Wifi className="w-4 h-4" />;
    case 'safety':
      return <Shield className="w-4 h-4" />;
    case 'maintenance':
      return <Wrench className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

const getSeverityIcon = (severity: number) => {
  if (severity >= 5) return <AlertTriangle className="w-4 h-4 text-red-500" />;
  if (severity >= 4) return <AlertCircle className="w-4 h-4 text-orange-500" />;
  if (severity >= 3) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  if (severity >= 2) return <Info className="w-4 h-4 text-blue-500" />;
  return <CheckCircle className="w-4 h-4 text-green-500" />;
};

const AlertCard: React.FC<{
  alert: AlertData;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
  t: (key: string) => string;
}> = ({ alert, onResolve, onDismiss, t }) => {
  return (
    <Card className={`border-l-4 ${
      alert.level === 'critical' ? 'border-l-red-500' :
      alert.level === 'warning' ? 'border-l-yellow-500' :
      alert.level === 'info' ? 'border-l-blue-500' :
      'border-l-green-500'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              {getAlertIcon(alert.level)}
              <Badge className={getAlertLevelColor(alert.level)}>
                {t(alert.level)}
              </Badge>
              <Badge variant="outline">
                {getTypeIcon(alert.type)}
                <span className="ml-1">{t(alert.type)}</span>
              </Badge>
              {alert.severity && (
                <div className="flex items-center gap-1">
                  {getSeverityIcon(alert.severity)}
                  <span className="text-xs">{alert.severity}/5</span>
                </div>
              )}
            </div>
            <h4 className="font-semibold">{alert.title}</h4>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Location:</span> {alert.location}
              </div>
              <div>
                <span className="font-medium">Assigned:</span> {alert.assignedTo}
              </div>
              <div>
                <span className="font-medium">Digester:</span> {alert.digesterId}
              </div>
              <div>
                <span className="font-medium">ETA:</span> {alert.estimatedResolution}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Time:</span> {new Date(alert.timestamp).toLocaleString()}
              </div>
              {alert.value && (
                <div className="col-span-2">
                  <span className="font-medium">Value:</span> {alert.value}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onResolve(alert.id)}
              disabled={alert.status === 'resolved'}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDismiss(alert.id)}
              disabled={alert.status === 'resolved'}
            >
              <XCircle className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ThresholdConfigCard: React.FC<{
  config: ThresholdConfig;
  onUpdate: (config: ThresholdConfig) => void;
  t: (key: string) => string;
}> = ({ config, onUpdate, t }) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    onUpdate(localConfig);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getTypeIcon(config.type)}
          {t(config.type)} {t('thresholds')}
        </CardTitle>
        <CardDescription>
          {config.description} ({config.unit})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${config.type}-enabled`}>Enable Monitoring</Label>
          <Switch
            id={`${config.type}-enabled`}
            checked={localConfig.enabled}
            onCheckedChange={(checked) => setLocalConfig(prev => ({ ...prev, enabled: checked }))}
          />
        </div>

        {localConfig.enabled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${config.type}-min`}>{t('minThreshold')} ({config.unit})</Label>
                <Input
                  id={`${config.type}-min`}
                  type="number"
                  value={localConfig.minThreshold}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    minThreshold: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${config.type}-max`}>{t('maxThreshold')} ({config.unit})</Label>
                <Input
                  id={`${config.type}-max`}
                  type="number"
                  value={localConfig.maxThreshold}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    maxThreshold: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Configuration
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const AlertsManagement: React.FC<AlertsManagementProps> = ({ languageContext }) => {
  const [alertFilter, setAlertFilter] = useState<'all' | AlertLevel>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | AlertType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    sound: true,
    email: true,
    sms: false,
    push: true
  });

  const lang = languageContext?.language || 'en';
  const t = (key: string): string => {
    return languageContext?.t(key) || translations[lang][key as keyof typeof translations[typeof lang]] || key;
  };

  // Real-time simulation
  useEffect(() => {
    if (!isMonitoringActive) return;

    const interval = setInterval(() => {
      // Simulate real-time monitoring updates
      console.log('Real-time monitoring active...');
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoringActive]);

  const filteredAlerts = alerts.filter(alert => {
    const matchesLevel = alertFilter === 'all' || alert.level === alertFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    return matchesLevel && matchesType && matchesStatus;
  });

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const criticalAlerts = activeAlerts.filter(alert => alert.level === 'critical');
  const warningAlerts = activeAlerts.filter(alert => alert.level === 'warning');
  const resolvedToday = alerts.filter(alert =>
    alert.status === 'resolved' &&
    new Date(alert.timestamp).toDateString() === new Date().toDateString()
  );

  const systemStatus = criticalAlerts.length > 0 ? 'critical' :
                     warningAlerts.length > 0 ? 'warning' : 'normal';

  const handleResolveAlert = async (alertId: string) => {
    await resolveAlert(alertId);
  };

  const handleDismissAlert = async (alertId: string) => {
    await dismissAlert(alertId);
  };

  const handleAcknowledgeAll = async () => {
    for (const alert of activeAlerts) {
      await resolveAlert(alert.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="monitoring-toggle">{t('monitoringActive')}</Label>
            <Switch
              id="monitoring-toggle"
              checked={isMonitoringActive}
              onCheckedChange={setIsMonitoringActive}
            />
          </div>
          <Button
            onClick={handleAcknowledgeAll}
            disabled={activeAlerts.length === 0}
            variant="outline"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {t('acknowledgeAll')} ({activeAlerts.length})
          </Button>
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

      {/* Enhanced Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('alertCount')}</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('resolvedToday')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedToday.length}</div>
            <p className="text-xs text-muted-foreground">
              Issues resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('responseTime')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              Average resolution time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">{t('activeAlerts')}</TabsTrigger>
          <TabsTrigger value="history">{t('alertHistory')}</TabsTrigger>
          <TabsTrigger value="thresholds">{t('thresholdSettings')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notificationSettings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Enhanced Filter Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Label>Filters:</Label>
            </div>
            <Select value={alertFilter} onValueChange={(value) => setAlertFilter(value as 'all' | AlertLevel)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">{t('critical')}</SelectItem>
                <SelectItem value="warning">{t('warning')}</SelectItem>
                <SelectItem value="info">{t('info')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as 'all' | AlertType)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="temperature">{t('temperature')}</SelectItem>
                <SelectItem value="pressure">{t('pressure')}</SelectItem>
                <SelectItem value="methane">{t('methane')}</SelectItem>
                <SelectItem value="gasProduction">{t('gasProduction')}</SelectItem>
                <SelectItem value="efficiency">{t('efficiency')}</SelectItem>
                <SelectItem value="connectivity">{t('connectivity')}</SelectItem>
                <SelectItem value="safety">{t('safety')}</SelectItem>
                <SelectItem value="maintenance">{t('maintenance')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="acknowledged">{t('acknowledged')}</SelectItem>
                <SelectItem value="resolved">{t('resolved')}</SelectItem>
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
                    No alerts match the current filter criteria. All monitored systems are operating within normal parameters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onResolve={handleResolveAlert}
                  onDismiss={handleDismissAlert}
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
                Historical alert data and resolution tracking with detailed analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.slice(0, 20).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.level)}
                        <Badge className={getAlertLevelColor(alert.level)}>
                          {t(alert.level)}
                        </Badge>
                        <Badge variant="outline">
                          {getTypeIcon(alert.type)}
                          <span className="ml-1">{t(alert.type)}</span>
                        </Badge>
                        <Badge variant={alert.status === 'resolved' ? 'default' : 'secondary'}>
                          {t(alert.status)}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Location: {alert.location}</span>
                        <span>Assigned: {alert.assignedTo}</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-2" />
                    <p>No alert history available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds">
          <div className="grid gap-6 md:grid-cols-2">
            {thresholds.map((threshold) => (
              <ThresholdConfigCard
                key={threshold.type}
                config={threshold}
                onUpdate={updateThreshold}
                t={t}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('notificationSettings')}</CardTitle>
                <CardDescription>
                  Configure how you receive alert notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-alerts" className="flex items-center gap-2">
                      {notificationSettings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      {t('soundAlerts')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound when new alerts arrive
                    </p>
                  </div>
                  <Switch
                    id="sound-alerts"
                    checked={notificationSettings.sound}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, sound: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">{t('emailNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      Send alerts via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">{t('smsNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      Send critical alerts via SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notificationSettings.sms}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, sms: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">{t('pushNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      Browser push notifications
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.push}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, push: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Management</CardTitle>
                <CardDescription>
                  Bulk actions and system controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleAcknowledgeAll}
                  disabled={activeAlerts.length === 0}
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('acknowledgeAll')} ({activeAlerts.length})
                </Button>

                <Button variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('clearHistory')}
                </Button>

                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  {t('exportAlerts')}
                </Button>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label>Real-time Monitoring</Label>
                    <div className="flex items-center gap-2">
                      {isMonitoringActive ? (
                        <Play className="w-4 h-4 text-green-500" />
                      ) : (
                        <Pause className="w-4 h-4 text-gray-500" />
                      )}
                      <Switch
                        checked={isMonitoringActive}
                        onCheckedChange={setIsMonitoringActive}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isMonitoringActive ? 'Monitoring system is active' : 'Monitoring is paused'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsManagement;