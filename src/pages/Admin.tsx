import { useState, useEffect } from 'react'
import { Users, Shield, Settings, Activity, Database, AlertTriangle, Download, Plus, Search, Filter, Eye, Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react'

interface User {
  id: string;
  name: string;
  email: string;
  role: 'GauSakhi' | 'BiogasSangh' | 'ShuddhiDoot' | 'UrjaVyapar' | 'UrjaNeta' | 'Admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  permissions: string[];
  createdAt: Date;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  status: 'success' | 'failure' | 'warning';
  details: string;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  database: 'healthy' | 'warning' | 'critical';
  uptime: number;
  activeUsers: number;
  lastBackup: Date;
}

interface Alert {
  id: string;
  type: 'security' | 'performance' | 'system' | 'user';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  status: 'open' | 'acknowledged' | 'resolved';
  assignedTo?: string;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    database: 'healthy',
    uptime: 0,
    activeUsers: 0,
    lastBackup: new Date()
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'security' | 'system' | 'logs'>('dashboard');

  const translations = {
    en: {
      title: 'System Administration Dashboard',
      subtitle: 'User management, system monitoring, and security controls',
      users: 'Users',
      auditLogs: 'Audit Logs',
      systemHealth: 'System Health',
      alerts: 'Alerts',
      searchUsers: 'Search users...',
      filterByRole: 'Filter by role',
      filterByStatus: 'Filter by status',
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
      addUser: 'Add User',
      exportData: 'Export Data',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      lastLogin: 'Last Login',
      actions: 'Actions',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      systemMetrics: 'System Metrics',
      cpu: 'CPU',
      memory: 'Memory',
      disk: 'Disk',
      network: 'Network',
      database: 'Database',
      uptime: 'Uptime',
      activeUsers: 'Active Users',
      lastBackup: 'Last Backup',
      healthy: 'Healthy',
      warning: 'Warning',
      critical: 'Critical',
      security: 'Security',
      performance: 'Performance',
      system: 'System',
      user: 'User',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      open: 'Open',
      acknowledged: 'Acknowledged',
      resolved: 'Resolved',
      assign: 'Assign',
      acknowledge: 'Acknowledge',
      resolve: 'Resolve',
      noActiveAlerts: 'No active alerts',
      systemStatus: 'System Status',
      diskUsage: 'Disk Usage',
      userManagement: 'User Management',
      timestamp: 'Timestamp',
      resource: 'Resource',
      ipAddress: 'IP Address',
      success: 'Success',
      failure: 'Failure',
      quickActions: 'Quick Actions',
      addUserDescription: 'Create new user account',
      securitySettings: 'Security Settings',
      securitySettingsDescription: 'Configure security policies',
      backupManagement: 'Backup Management',
      backupManagementDescription: 'Backup schedule and recovery',
      systemConfiguration: 'System Configuration',
      systemConfigurationDescription: 'Configure system settings',
      gauSakhi: 'GauSakhi',
      biogasSangh: 'BiogasSangh',
      shuddhiDoot: 'ShuddhiDoot',
      urjaVyapar: 'UrjaVyapar',
      urjaNeta: 'UrjaNeta',
      admin: 'Admin'
    },
    hi: {
      title: 'सिस्टम प्रशासन डैशबोर्ड',
      subtitle: 'उपयोगकर्ता प्रबंधन, सिस्टम निगरानी और सुरक्षा नियंत्रण',
      users: 'उपयोगकर्ता',
      auditLogs: 'ऑडिट लॉग',
      systemHealth: 'सिस्टम स्वास्थ्य',
      alerts: 'अलर्ट',
      searchUsers: 'उपयोगकर्ताओं को खोजें...',
      filterByRole: 'भूमिका के अनुसार फ़िल्टर करें',
      filterByStatus: 'स्थिति के अनुसार फ़िल्टर करें',
      all: 'सभी',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      suspended: 'निलंबित',
      addUser: 'उपयोगकर्ता जोड़ें',
      exportData: 'डेटा निर्यात करें',
      name: 'नाम',
      email: 'ईमेल',
      role: 'भूमिका',
      status: 'स्थिति',
      lastLogin: 'अंतिम लॉगिन',
      actions: 'कार्य',
      view: 'देखें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      systemMetrics: 'सिस्टम मेट्रिक्स',
      cpu: 'सीपीयू',
      memory: 'मेमोरी',
      disk: 'डिस्क',
      network: 'नेटवर्क',
      database: 'डेटाबेस',
      uptime: 'अपटाइम',
      activeUsers: 'सक्रिय उपयोगकर्ता',
      lastBackup: 'अंतिम बैकअप',
      healthy: 'स्वस्थ',
      warning: 'चेतावनी',
      critical: 'गंभीर',
      security: 'सुरक्षा',
      performance: 'प्रदर्शन',
      system: 'सिस्टम',
      user: 'उपयोगकर्ता',
      low: 'कम',
      medium: 'मध्यम',
      high: 'उच्च',
      open: 'खुला',
      acknowledged: 'स्वीकृत',
      resolved: 'समाधान',
      assign: 'नियुक्त करें',
      acknowledge: 'स्वीकार करें',
      resolve: 'समाधान करें',
      noActiveAlerts: 'कोई खुला अलर्ट नहीं',
      systemStatus: 'सिस्टम स्थिति',
      diskUsage: 'डिस्क उपयोग',
      userManagement: 'उपयोगकर्ता प्रबंधन',
      timestamp: 'समयांक',
      resource: 'संसाधन',
      ipAddress: 'IP पता',
      success: 'सफलता',
      failure: 'विफलता',
      quickActions: 'तेज़ कार्य',
      addUserDescription: 'नया उपयोगकर्ता खाता बनाएं',
      securitySettings: 'सुरक्षा सेटिंग्स',
      securitySettingsDescription: 'सुरक्षा नीतियों को कॉन्फ़िगर करें',
      backupManagement: 'बैकअप प्रबंधन',
      backupManagementDescription: 'बैकअप अनुसूची और पुनर्स्थापना',
      systemConfiguration: 'सिस्टम कॉन्फ़िगरेशन',
      systemConfigurationDescription: 'सिस्टम सेटिंग्स को कॉन्फ़िगर करें',
      gauSakhi: 'गौसाक्षी',
      biogasSangh: 'बिओगास संघ',
      shuddhiDoot: 'शुद्धिदूत',
      urjaVyapar: 'उर्जा व्यापार',
      urjaNeta: 'उर्जा नेटा',
      admin: 'व्यवस्थापक'
    }
  };

  const t = translations[language];

  // Mock user data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@saubhagya.com',
        role: 'GauSakhi',
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        permissions: ['cattle:read', 'cattle:write', 'location:read'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya@saubhagya.com',
        role: 'BiogasSangh',
        status: 'active',
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
        permissions: ['cluster:read', 'cluster:write', 'iot:read', 'reports:read'],
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Amit Singh',
        email: 'amit@saubhagya.com',
        role: 'ShuddhiDoot',
        status: 'active',
        lastLogin: new Date(Date.now() - 30 * 60 * 1000),
        permissions: ['purification:read', 'purification:write', 'maintenance:read'],
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        name: 'Sita Devi',
        email: 'sita@saubhagya.com',
        role: 'UrjaVyapar',
        status: 'active',
        lastLogin: new Date(Date.now() - 45 * 60 * 1000),
        permissions: ['sales:read', 'sales:write', 'inventory:read', 'customers:read'],
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        name: 'Vikram Patel',
        email: 'vikram@saubhagya.com',
        role: 'UrjaNeta',
        status: 'active',
        lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000),
        permissions: ['dashboard:read', 'reports:read', 'analytics:read'],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];
    setUsers(mockUsers);
  }, []);

  // Mock audit logs
  useEffect(() => {
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        user: 'Rajesh Kumar',
        action: 'LOGIN',
        resource: 'Authentication',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        ipAddress: '192.168.1.100',
        status: 'success',
        details: 'User logged in successfully'
      },
      {
        id: '2',
        user: 'Priya Sharma',
        action: 'UPDATE',
        resource: 'Cluster Data',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        ipAddress: '192.168.1.101',
        status: 'success',
        details: 'Updated cluster performance metrics'
      },
      {
        id: '3',
        user: 'Amit Singh',
        action: 'CREATE',
        resource: 'Maintenance Schedule',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        ipAddress: '192.168.1.102',
        status: 'success',
        details: 'Created new maintenance schedule for Compressor Unit A'
      },
      {
        id: '4',
        user: 'Unknown',
        action: 'LOGIN',
        resource: 'Authentication',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        ipAddress: '203.45.67.89',
        status: 'failure',
        details: 'Failed login attempt with invalid credentials'
      }
    ];
    setAuditLogs(mockLogs);
  }, []);

  // Mock system health data
  useEffect(() => {
    const updateSystemHealth = () => {
      setSystemHealth({
        cpu: Math.random() * 30 + 20, // 20-50%
        memory: Math.random() * 40 + 30, // 30-70%
        disk: Math.random() * 20 + 15, // 15-35%
        network: Math.random() * 25 + 10, // 10-35%
        database: Math.random() > 0.8 ? 'warning' : 'healthy',
        uptime: 15 * 24 * 60 * 60 * 1000 + Math.random() * 60 * 60 * 1000, // ~15 days
        activeUsers: Math.floor(Math.random() * 20) + 15, // 15-35 users
        lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      });
    };

    updateSystemHealth();
    const interval = setInterval(updateSystemHealth, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock alerts
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'security',
        severity: 'medium',
        message: 'Multiple failed login attempts detected from IP 203.45.67.89',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'open'
      },
      {
        id: '2',
        type: 'performance',
        severity: 'low',
        message: 'Database query response time increased by 15%',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'acknowledged',
        assignedTo: 'System Admin'
      },
      {
        id: '3',
        type: 'system',
        severity: 'low',
        message: 'Backup completed successfully',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'resolved'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'GauSakhi': return 'bg-blue-100 text-blue-800';
      case 'BiogasSangh': return 'bg-green-100 text-green-800';
      case 'ShuddhiDoot': return 'bg-purple-100 text-purple-800';
      case 'UrjaVyapar': return 'bg-orange-100 text-orange-800';
      case 'UrjaNeta': return 'bg-indigo-100 text-indigo-800';
      case 'Admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'performance': return <Activity className="h-4 w-4" />;
      case 'system': return <Database className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const exportData = (format: 'pdf' | 'excel') => {
    alert(`${format.toUpperCase()} export initiated for admin data`);
  };

  const filteredUsers = users.filter(user =>
    (filterRole === 'all' || user.role === filterRole) &&
    (filterStatus === 'all' || user.status === filterStatus) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
    const hours = Math.floor((uptime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1 text-sm bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4 inline mr-2" />
            {t.addUser}
          </button>
          <button
            onClick={() => exportData('pdf')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Download className="h-4 w-4 inline mr-2" />
            {t.exportData}
          </button>
          <button
            onClick={() => exportData('excel')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="h-4 w-4 inline mr-2" />
            Excel
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'system'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            System
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Database className="h-4 w-4 inline mr-2" />
            Audit Logs
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <>
          {/* System Health Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t.cpu}</dt>
                      <dd className="text-lg font-medium text-gray-900">{systemHealth.cpu.toFixed(1)}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Database className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t.memory}</dt>
                      <dd className="text-lg font-medium text-gray-900">{systemHealth.memory.toFixed(1)}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t.activeUsers}</dt>
                      <dd className="text-lg font-medium text-gray-900">{systemHealth.activeUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t.uptime}</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatUptime(systemHealth.uptime)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts and System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Active Alerts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.alerts}</h3>
                <div className="space-y-3">
                  {alerts.filter(alert => alert.status !== 'resolved').map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getAlertTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {alert.timestamp.toLocaleString('hi-IN')} • {alert.type}
                        </p>
                        {alert.assignedTo && (
                          <p className="text-sm text-blue-600 mt-1">{t.assign} to: {alert.assignedTo}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {alerts.filter(alert => alert.status !== 'resolved').length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto text-green-400 mb-2" />
                      <p>{t.noActiveAlerts}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.systemStatus}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.database}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      systemHealth.database === 'healthy' ? 'bg-green-100 text-green-800' :
                      systemHealth.database === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {systemHealth.database === 'healthy' ? t.healthy :
                       systemHealth.database === 'warning' ? t.warning : t.critical}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.diskUsage}</span>
                    <span className="text-sm font-medium">{systemHealth.disk.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.network}</span>
                    <span className="text-sm font-medium">{systemHealth.network.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.lastBackup}</span>
                    <span className="text-sm font-medium">{systemHealth.lastBackup.toLocaleString('hi-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t.userManagement}</h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.searchUsers}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{t.all}</option>
                  <option value="GauSakhi">{t.gauSakhi}</option>
                  <option value="BiogasSangh">{t.biogasSangh}</option>
                  <option value="ShuddhiDoot">{t.shuddhiDoot}</option>
                  <option value="UrjaVyapar">{t.urjaVyapar}</option>
                  <option value="UrjaNeta">{t.urjaNeta}</option>
                  <option value="Admin">{t.admin}</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{t.all}</option>
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                  <option value="suspended">{t.suspended}</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.user}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.role}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.lastLogin}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? t.active :
                           user.status === 'inactive' ? t.inactive : t.suspended}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin.toLocaleString('hi-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Eye className="h-4 w-4 inline" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          <Edit className="h-4 w-4 inline" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          {/* Active Alerts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.alerts}</h3>
              <div className="space-y-3">
                {alerts.filter(alert => alert.status !== 'resolved').map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {alert.timestamp.toLocaleString('hi-IN')} • {alert.type}
                      </p>
                      {alert.assignedTo && (
                        <p className="text-sm text-blue-600 mt-1">{t.assign} to: {alert.assignedTo}</p>
                      )}
                    </div>
                  </div>
                ))}
                {alerts.filter(alert => alert.status !== 'resolved').length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-400 mb-2" />
                    <p>{t.noActiveAlerts}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.securitySettings}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                      <Shield className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="mt-2 text-sm text-gray-500">Secure user accounts with 2FA</p>
                  </div>
                </div>
                <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                      <Users className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">Access Controls</h3>
                    <p className="mt-2 text-sm text-gray-500">Manage role-based permissions</p>
                  </div>
                </div>
                <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-red-50 text-red-700 ring-4 ring-white">
                      <AlertTriangle className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">Threat Detection</h3>
                    <p className="mt-2 text-sm text-gray-500">Monitor suspicious activities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          {/* System Health Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t.cpu}</dt>
                      <dd className="text-lg font-medium text-gray-900">{systemHealth.cpu.toFixed(1)}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Database className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t.memory}</dt>
                      <dd className="text-lg font-medium text-gray-900">{systemHealth.memory.toFixed(1)}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t.activeUsers}</dt>
                      <dd className="text-lg font-medium text-gray-900">{systemHealth.activeUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t.uptime}</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatUptime(systemHealth.uptime)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.systemStatus}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.database}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    systemHealth.database === 'healthy' ? 'bg-green-100 text-green-800' :
                    systemHealth.database === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {systemHealth.database === 'healthy' ? t.healthy :
                     systemHealth.database === 'warning' ? t.warning : t.critical}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.diskUsage}</span>
                  <span className="text-sm font-medium">{systemHealth.disk.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.network}</span>
                  <span className="text-sm font-medium">{systemHealth.network.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.lastBackup}</span>
                  <span className="text-sm font-medium">{systemHealth.lastBackup.toLocaleString('hi-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.quickActions}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                      <Users className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {t.addUser}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">{t.addUserDescription}</p>
                  </div>
                </button>

                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                      <Shield className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {t.securitySettings}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">{t.securitySettingsDescription}</p>
                  </div>
                </button>

                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                      <Database className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {t.backupManagement}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">{t.backupManagementDescription}</p>
                  </div>
                </button>

                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-700 ring-4 ring-white">
                      <Settings className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {t.systemConfiguration}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">{t.systemConfigurationDescription}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{t.auditLogs}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.timestamp}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.user}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.action}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.resource}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.ipAddress}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.timestamp.toLocaleString('hi-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.resource}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.status === 'success' ? 'bg-green-100 text-green-800' :
                          log.status === 'failure' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.status === 'success' ? t.success :
                           log.status === 'failure' ? t.failure : t.warning}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}