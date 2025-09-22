import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Shield, Bell, Database, Globe, Key, Save } from 'lucide-react';

interface ConfigSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  settings: ConfigSetting[];
}

interface ConfigSetting {
  key: string;
  label: string;
  type: 'text' | 'password' | 'toggle' | 'select';
  value: string | boolean;
  options?: string[];
}

const Configuration: React.FC = () => {
  const [config, setConfig] = useState<Record<string, any>>({
    // Module Settings
    'biogasModule': true,
    'salesModule': true,
    'transportModule': true,
    'purificationModule': true,
    'analyticsModule': true,
    
    // Integration Config
    'apiBaseUrl': 'https://api.saubhagya.com',
    'webhookUrl': 'https://webhook.saubhagya.com/events',
    'apiKey': '••••••••••••••••',
    
    // Notification Rules
    'emailNotifications': true,
    'smsNotifications': false,
    'alertThreshold': '85',
    'maintenanceReminders': true,
    
    // Backup Settings
    'autoBackup': true,
    'backupFrequency': 'daily',
    'retentionDays': '30',
    
    // Security Settings
    'twoFactorAuth': true,
    'sessionTimeout': '60',
    'passwordExpiry': '90',
    
    // Localization
    'defaultLanguage': 'en',
    'timezone': 'Asia/Kolkata',
    'currency': 'INR'
  });

  const configSections: ConfigSection[] = [
    {
      title: 'Module Settings',
      description: 'Enable or disable platform modules',
      icon: <Settings className="h-5 w-5" />,
      settings: [
        { key: 'biogasModule', label: 'Biogas Production Module', type: 'toggle', value: config.biogasModule },
        { key: 'salesModule', label: 'Sales & Distribution Module', type: 'toggle', value: config.salesModule },
        { key: 'transportModule', label: 'Transport Management Module', type: 'toggle', value: config.transportModule },
        { key: 'purificationModule', label: 'Purification Operations Module', type: 'toggle', value: config.purificationModule },
        { key: 'analyticsModule', label: 'Analytics & Reporting Module', type: 'toggle', value: config.analyticsModule }
      ]
    },
    {
      title: 'Integration Configuration',
      description: 'API keys and webhook settings',
      icon: <Key className="h-5 w-5" />,
      settings: [
        { key: 'apiBaseUrl', label: 'API Base URL', type: 'text', value: config.apiBaseUrl },
        { key: 'webhookUrl', label: 'Webhook URL', type: 'text', value: config.webhookUrl },
        { key: 'apiKey', label: 'API Key', type: 'password', value: config.apiKey }
      ]
    },
    {
      title: 'Notification Rules',
      description: 'Alert thresholds and notification preferences',
      icon: <Bell className="h-5 w-5" />,
      settings: [
        { key: 'emailNotifications', label: 'Email Notifications', type: 'toggle', value: config.emailNotifications },
        { key: 'smsNotifications', label: 'SMS Notifications', type: 'toggle', value: config.smsNotifications },
        { key: 'alertThreshold', label: 'System Alert Threshold (%)', type: 'text', value: config.alertThreshold },
        { key: 'maintenanceReminders', label: 'Maintenance Reminders', type: 'toggle', value: config.maintenanceReminders }
      ]
    },
    {
      title: 'Backup Settings',
      description: 'Data backup schedule and retention',
      icon: <Database className="h-5 w-5" />,
      settings: [
        { key: 'autoBackup', label: 'Automatic Backups', type: 'toggle', value: config.autoBackup },
        { key: 'backupFrequency', label: 'Backup Frequency', type: 'select', value: config.backupFrequency, options: ['hourly', 'daily', 'weekly'] },
        { key: 'retentionDays', label: 'Retention Period (days)', type: 'text', value: config.retentionDays }
      ]
    },
    {
      title: 'Security Settings',
      description: 'Authentication and security policies',
      icon: <Shield className="h-5 w-5" />,
      settings: [
        { key: 'twoFactorAuth', label: 'Two-Factor Authentication', type: 'toggle', value: config.twoFactorAuth },
        { key: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'text', value: config.sessionTimeout },
        { key: 'passwordExpiry', label: 'Password Expiry (days)', type: 'text', value: config.passwordExpiry }
      ]
    },
    {
      title: 'Localization',
      description: 'Language and regional settings',
      icon: <Globe className="h-5 w-5" />,
      settings: [
        { key: 'defaultLanguage', label: 'Default Language', type: 'select', value: config.defaultLanguage, options: ['en', 'hi'] },
        { key: 'timezone', label: 'Timezone', type: 'select', value: config.timezone, options: ['Asia/Kolkata', 'UTC'] },
        { key: 'currency', label: 'Currency', type: 'select', value: config.currency, options: ['INR', 'USD'] }
      ]
    }
  ];

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const renderSetting = (setting: ConfigSetting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{setting.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={setting.value as boolean}
                onChange={(e) => handleConfigChange(setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        );
      case 'select':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">{setting.label}</label>
            <select
              value={setting.value as string}
              onChange={(e) => handleConfigChange(setting.key, e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
            >
              {setting.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      case 'password':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">{setting.label}</label>
            <Input
              type="password"
              value={setting.value as string}
              onChange={(e) => handleConfigChange(setting.key, e.target.value)}
              placeholder="Enter value..."
            />
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">{setting.label}</label>
            <Input
              type="text"
              value={setting.value as string}
              onChange={(e) => handleConfigChange(setting.key, e.target.value)}
              placeholder="Enter value..."
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground">
            Manage platform settings, integrations, and security policies
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {section.icon}
                {section.title}
              </CardTitle>
              <CardDescription>
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex}>
                    {renderSetting(setting)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system configuration and status overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Modules</span>
                <Badge className="bg-green-500">5/5</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                All platform modules are operational
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Security Score</span>
                <Badge className="bg-green-500">98/100</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Excellent security configuration
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Last Backup</span>
                <Badge className="bg-blue-500">2h ago</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Next backup scheduled in 22 hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuration;
export { Configuration };