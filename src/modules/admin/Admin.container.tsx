import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { UserManagement } from './pages/UserManagement/UserManagement';
import { DeviceRegistry } from './pages/DeviceRegistry/DeviceRegistry';
import { AuditLogs } from './pages/AuditLogs/AuditLogs';
import { Reports } from './pages/Reports/Reports';
import { Configuration } from './pages/Configuration/Configuration';
import { Profile } from './pages/Profile/Profile';
import UserAccessManagement from '@/pages/admin/UserAccessManagement';
import {
  LayoutDashboard,
  Users,
  HardDrive,
  FileText,
  BarChart3,
  Settings,
  UserCircle,
  Shield
} from 'lucide-react';

const AdminModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      onClick: () => navigate('/admin'),
      isActive: location.pathname === '/admin' || location.pathname === '/admin/'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="w-5 h-5" />,
      onClick: () => navigate('/admin/users'),
      isActive: location.pathname === '/admin/users'
    },
    {
      id: 'devices',
      label: 'Device Registry',
      icon: <HardDrive className="w-5 h-5" />,
      onClick: () => navigate('/admin/devices'),
      isActive: location.pathname === '/admin/devices'
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: <FileText className="w-5 h-5" />,
      onClick: () => navigate('/admin/audit'),
      isActive: location.pathname === '/admin/audit'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      onClick: () => navigate('/admin/reports'),
      isActive: location.pathname === '/admin/reports'
    },
    {
      id: 'access-management',
      label: 'Access Management',
      icon: <Shield className="w-5 h-5" />,
      onClick: () => navigate('/admin/access-management'),
      isActive: location.pathname === '/admin/access-management'
    },
    {
      id: 'config',
      label: 'Configuration',
      icon: <Settings className="w-5 h-5" />,
      onClick: () => navigate('/admin/config'),
      isActive: location.pathname === '/admin/config'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <UserCircle className="w-5 h-5" />,
      onClick: () => navigate('/admin/profile'),
      isActive: location.pathname === '/admin/profile'
    }
  ];

  return (
    <BaseLayout
      moduleName="Admin"
      moduleSubtitle="Platform Management"
      navigationItems={navigationItems}
      userInfo={user ? {
        name: user.name,
        role: user.department || 'User',
        avatar: undefined
      } : undefined}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/devices" element={<DeviceRegistry />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/access-management" element={<UserAccessManagement />} />
        <Route path="/config" element={<Configuration />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BaseLayout>
  );
};

export default AdminModule;