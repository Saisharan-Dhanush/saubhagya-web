/**
 * ShuddhiDoot Purification Module Container
 * SAUB-FE-003: Complete Purification Enhancement with Modern UI
 */

import React, { Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3,
  RotateCcw,
  CheckCircle,
  Wrench,
  Package,
  Droplets,
  Activity,
  Gauge,
  Factory,
  AlertTriangle,
  TrendingUp,
  Users,
  Settings
} from 'lucide-react';

// Lazy loaded page components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));

const CycleManagement = React.lazy(() =>
  import('./pages/CycleManagement/CycleManagement').then(module => ({
    default: module.CycleManagement
  }))
);

const QualityControl = React.lazy(() =>
  import('./pages/QualityControl/QualityControl').then(module => ({
    default: module.QualityControl
  }))
);

const MaintenanceManagement = React.lazy(() =>
  import('./pages/MaintenanceManagement/MaintenanceManagement').then(module => ({
    default: module.MaintenanceManagement
  }))
);

const InventoryTransfer = React.lazy(() =>
  import('./pages/InventoryTransfer/InventoryTransfer').then(module => ({
    default: module.InventoryTransferPage
  }))
);

const SlurryManagement = React.lazy(() =>
  import('./pages/SlurryManagement/SlurryManagement').then(module => ({
    default: module.SlurryManagement
  }))
);

const RealTimeMonitoring = React.lazy(() =>
  import('./pages/RealTimeMonitoring/RealTimeMonitoring').then(module => ({
    default: module.RealTimeMonitoring
  }))
);

// Enhanced loading component with modern design
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <CardTitle className="text-lg font-medium text-gray-600 mb-2">
          Loading ShuddhiDoot Module...
        </CardTitle>
        <CardDescription className="text-center text-gray-500">
          Initializing purification systems and real-time data feeds
        </CardDescription>
      </CardContent>
    </Card>
  </div>
);

// Quick metrics display for overview
const QuickMetrics: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">CH₄ Purity</p>
            <p className="text-2xl font-bold text-green-600">96.5%</p>
          </div>
          <Gauge className="h-8 w-8 text-green-600" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Cycles</p>
            <p className="text-2xl font-bold text-blue-600">3</p>
          </div>
          <RotateCcw className="h-8 w-8 text-blue-600" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">System Status</p>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Operational
            </Badge>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Efficiency</p>
            <p className="text-2xl font-bold text-purple-600">94.2%</p>
          </div>
          <TrendingUp className="h-8 w-8 text-purple-600" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const PurificationModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Base path for the purification module
  const basePath = '/purification';

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}`),
      isActive: location.pathname === basePath || location.pathname === `${basePath}/`,
      badge: undefined
    },
    {
      id: 'cycles',
      label: 'Cycle Management',
      icon: <RotateCcw className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/cycles`),
      isActive: location.pathname === `${basePath}/cycles`,
      badge: '3' // Active cycles
    },
    {
      id: 'quality',
      label: 'Quality Control',
      icon: <CheckCircle className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/quality`),
      isActive: location.pathname === `${basePath}/quality`,
      badge: undefined
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: <Wrench className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/maintenance`),
      isActive: location.pathname === `${basePath}/maintenance`,
      badge: '2' // Pending maintenance
    },
    {
      id: 'inventory',
      label: 'Inventory Transfer',
      icon: <Package className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/inventory`),
      isActive: location.pathname === `${basePath}/inventory`,
      badge: '5' // Pending transfers
    },
    {
      id: 'slurry',
      label: 'Slurry Management',
      icon: <Droplets className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/slurry`),
      isActive: location.pathname === `${basePath}/slurry`,
      badge: undefined
    },
    {
      id: 'monitoring',
      label: 'Real-time Monitoring',
      icon: <Activity className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/monitoring`),
      isActive: location.pathname === `${basePath}/monitoring`,
      badge: undefined
    }
  ];

  return (
    <BaseLayout
      moduleName="ShuddhiDoot"
      moduleSubtitle="Biogas Purification & Quality Management"
      navigationItems={navigationItems}
      userInfo={{
        name: "Purification Manager",
        role: "Plant Operations Head"
      }}
    >
      <div className="space-y-6">
        {/* Main content area */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Default route redirects to dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/cycles" element={<CycleManagement />} />
            <Route path="/quality" element={<QualityControl />} />
            <Route path="/maintenance" element={<MaintenanceManagement />} />
            <Route path="/inventory" element={<InventoryTransfer />} />
            <Route path="/slurry" element={<SlurryManagement />} />
            <Route path="/monitoring" element={<RealTimeMonitoring />} />

            {/* Fallback route */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </div>
    </BaseLayout>
  );
};

export default PurificationModule;