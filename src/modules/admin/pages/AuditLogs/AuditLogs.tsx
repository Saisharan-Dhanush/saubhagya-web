import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, User, Database, AlertTriangle, CheckCircle, XCircle, Search, Download } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  status: 'success' | 'failed' | 'warning';
  ipAddress: string;
  details: string;
}

const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const mockLogs: AuditLog[] = [
    {
      id: 'AL-001',
      timestamp: '2024-01-15 14:30:25',
      user: 'admin@saubhagya.com',
      action: 'User Login',
      module: 'Authentication',
      status: 'success',
      ipAddress: '192.168.1.100',
      details: 'Successful admin login from dashboard'
    },
    {
      id: 'AL-002',
      timestamp: '2024-01-15 14:28:15',
      user: 'rajesh@gaushala.com',
      action: 'Update Device Configuration',
      module: 'Device Management',
      status: 'success',
      ipAddress: '192.168.1.105',
      details: 'Modified RFID reader settings for Cattle Tag Reader 1'
    },
    {
      id: 'AL-003',
      timestamp: '2024-01-15 14:25:10',
      user: 'priya@biogas.com',
      action: 'Failed Login Attempt',
      module: 'Authentication',
      status: 'failed',
      ipAddress: '192.168.1.110',
      details: 'Invalid password provided - 3rd attempt'
    },
    {
      id: 'AL-004',
      timestamp: '2024-01-15 14:20:05',
      user: 'system',
      action: 'Database Backup',
      module: 'System',
      status: 'success',
      ipAddress: 'localhost',
      details: 'Automated daily backup completed successfully'
    },
    {
      id: 'AL-005',
      timestamp: '2024-01-15 14:15:30',
      user: 'amit@sales.com',
      action: 'Export Customer Data',
      module: 'Sales',
      status: 'warning',
      ipAddress: '192.168.1.112',
      details: 'Large dataset export - monitoring for performance impact'
    },
    {
      id: 'AL-006',
      timestamp: '2024-01-15 14:10:20',
      user: 'admin@saubhagya.com',
      action: 'Create User Account',
      module: 'User Management',
      status: 'success',
      ipAddress: '192.168.1.100',
      details: 'New user account created for transport team member'
    }
  ];

  const getStatusIcon = (status: AuditLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: AuditLog['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Authentication':
        return <Shield className="h-4 w-4" />;
      case 'User Management':
        return <User className="h-4 w-4" />;
      case 'System':
        return <Database className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Comprehensive audit trail of all system activities and user actions
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Events</p>
                <p className="text-2xl font-bold">{mockLogs.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Success</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockLogs.filter(l => l.status === 'success').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockLogs.filter(l => l.status === 'failed').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockLogs.filter(l => l.status === 'warning').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Audit Trail
          </CardTitle>
          <CardDescription>
            Real-time monitoring of all user actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit logs by action, user, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="all">All Modules</option>
                <option value="Authentication">Authentication</option>
                <option value="User Management">User Management</option>
                <option value="Device Management">Device Management</option>
                <option value="Sales">Sales</option>
                <option value="System">System</option>
              </select>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Timestamp</th>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Action</th>
                  <th className="text-left p-4 font-medium">Module</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/30">
                    <td className="p-4">
                      <p className="text-sm font-mono">{log.timestamp}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <p className="text-sm">{log.user}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-sm">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.details}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getModuleIcon(log.module)}
                        <Badge variant="secondary">{log.module}</Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        {getStatusBadge(log.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-mono">{log.ipAddress}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No audit logs found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
export { AuditLogs };