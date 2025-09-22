import React, { Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import {
  LayoutDashboard,
  Calendar,
  Route as RouteIcon,
  Truck,
  CheckCircle,
  Settings,
  History
} from 'lucide-react';

// Lazy loaded components for better performance
const Dashboard = React.lazy(() =>
  import('./pages/Dashboard/Dashboard').then(module => ({
    default: module.Dashboard
  }))
);

const ScheduleManager = React.lazy(() =>
  import('./pages/ScheduleManager/ScheduleManager').then(module => ({
    default: module.ScheduleManager
  }))
);

const RouteOptimization = React.lazy(() =>
  import('./pages/RouteOptimization/RouteOptimization').then(module => ({
    default: module.RouteOptimization
  }))
);

const ActiveDeliveries = React.lazy(() =>
  import('./pages/ActiveDeliveries/ActiveDeliveries').then(module => ({
    default: module.ActiveDeliveries
  }))
);

const DeliveryConfirmation = React.lazy(() =>
  import('./pages/DeliveryConfirmation/DeliveryConfirmation').then(module => ({
    default: module.DeliveryConfirmation
  }))
);

const VehicleManagement = React.lazy(() =>
  import('./pages/VehicleManagement/VehicleManagement').then(module => ({
    default: module.VehicleManagement
  }))
);

const DeliveryHistory = React.lazy(() =>
  import('./pages/DeliveryHistory/DeliveryHistory').then(module => ({
    default: module.DeliveryHistory
  }))
);

// Loading component for Suspense
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading...</span>
  </div>
);

const TransporterModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Base path for the transporter module
  const basePath = '/transport';

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/dashboard`),
      isActive: location.pathname === `${basePath}/dashboard` || location.pathname === basePath
    },
    {
      id: 'schedule',
      label: 'Schedule Manager',
      icon: <Calendar className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/schedule`),
      isActive: location.pathname === `${basePath}/schedule`,
      badge: '15' // Example badge for pending schedules
    },
    {
      id: 'routes',
      label: 'Route Optimization',
      icon: <RouteIcon className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/routes`),
      isActive: location.pathname === `${basePath}/routes`
    },
    {
      id: 'deliveries',
      label: 'Active Deliveries',
      icon: <Truck className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/deliveries`),
      isActive: location.pathname === `${basePath}/deliveries`,
      badge: '8' // Example badge for active deliveries
    },
    {
      id: 'confirmation',
      label: 'Delivery Confirmation',
      icon: <CheckCircle className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/confirmation`),
      isActive: location.pathname === `${basePath}/confirmation`,
      badge: '3' // Example badge for pending confirmations
    },
    {
      id: 'vehicles',
      label: 'Vehicle Management',
      icon: <Settings className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/vehicles`),
      isActive: location.pathname === `${basePath}/vehicles`
    },
    {
      id: 'history',
      label: 'Delivery History',
      icon: <History className="w-5 h-5" />,
      onClick: () => navigate(`${basePath}/history`),
      isActive: location.pathname === `${basePath}/history`
    }
  ];

  return (
    <BaseLayout
      moduleName="Transporter"
      moduleSubtitle="Biogas Delivery Management"
      navigationItems={navigationItems}
      userInfo={{
        name: "Transport Manager",
        role: "Operations Head"
      }}
    >
      <div className="p-6">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Default route redirects to dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule" element={<ScheduleManager />} />
            <Route path="/routes" element={<RouteOptimization />} />
            <Route path="/deliveries" element={<ActiveDeliveries />} />
            <Route path="/confirmation" element={<DeliveryConfirmation />} />
            <Route path="/vehicles" element={<VehicleManagement />} />
            <Route path="/history" element={<DeliveryHistory />} />

            {/* Fallback route */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </div>
    </BaseLayout>
  );
};

export default TransporterModule;