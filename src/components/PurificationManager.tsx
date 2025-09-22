import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Factory,
  FlaskConical,
  Settings,
  Wrench,
  Package2,
  Gauge,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import BaseLayout from '../components/layout/BaseLayout'
import { WebSocketProvider } from '../contexts/WebSocketContext'
import { AlertProvider } from '../contexts/AlertContext'

// Import the actual purification page components
import ProcessMonitoringPage from '../pages/purification/ProcessMonitoringPage'
import QualityControlPage from '../pages/purification/QualityControlPage'
import ProcessOptimizationPage from '../pages/purification/ProcessOptimizationPage'
import MaintenancePage from '../pages/purification/MaintenancePage'
import BatchManagementPage from '../pages/purification/BatchManagementPage'

// Simple placeholder for the main dashboard
const PurificationDashboard = () => (
  <div className="p-6 space-y-6">
    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">ShuddhiDoot Purification Management</h1>
      <p className="text-blue-100">Real-time biogas purification monitoring and quality control</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Purity Level</h3>
        <p className="text-3xl font-bold text-green-600">96.5%</p>
        <p className="text-sm text-gray-500">Current methane content</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Rate</h3>
        <p className="text-3xl font-bold text-blue-600">2,850 m³/h</p>
        <p className="text-sm text-gray-500">Current throughput</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">System Efficiency</h3>
        <p className="text-3xl font-bold text-purple-600">94.2%</p>
        <p className="text-sm text-gray-500">Overall performance</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Status</h3>
        <p className="text-3xl font-bold text-green-600">PASS</p>
        <p className="text-sm text-gray-500">PESO compliance</p>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
          <Gauge className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Monitoring</span>
        </button>
        <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Quality</span>
        </button>
        <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100">
          <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Optimization</span>
        </button>
        <button className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100">
          <Wrench className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Maintenance</span>
        </button>
        <button className="p-4 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100">
          <Package2 className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Batches</span>
        </button>
      </div>
    </div>
  </div>
);

const Purification = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation items for the Purification module
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => navigate('/purification'),
      isActive: location.pathname === '/purification'
    },
    {
      id: 'monitoring',
      label: 'Process Monitoring',
      icon: <Gauge className="w-4 h-4" />,
      onClick: () => navigate('/purification/monitoring'),
      isActive: location.pathname === '/purification/monitoring'
    },
    {
      id: 'quality',
      label: 'Quality Control',
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: () => navigate('/purification/quality'),
      isActive: location.pathname === '/purification/quality'
    },
    {
      id: 'optimization',
      label: 'Process Optimization',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => navigate('/purification/optimization'),
      isActive: location.pathname === '/purification/optimization'
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: <Wrench className="w-4 h-4" />,
      onClick: () => navigate('/purification/maintenance'),
      isActive: location.pathname === '/purification/maintenance'
    },
    {
      id: 'batches',
      label: 'Batch Management',
      icon: <Package2 className="w-4 h-4" />,
      onClick: () => navigate('/purification/batches'),
      isActive: location.pathname === '/purification/batches'
    }
  ]

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'SAUBHAGYA', onClick: () => navigate('/') },
    { label: 'ShuddhiDoot Purification', onClick: () => navigate('/purification') }
  ]

  // Page content based on current route
  const renderPageContent = () => {
    const currentPath = location.pathname

    if (currentPath === '/purification/monitoring') {
      return <ProcessMonitoringPage />
    }

    if (currentPath === '/purification/quality') {
      return <QualityControlPage />
    }

    if (currentPath === '/purification/optimization') {
      return <ProcessOptimizationPage />
    }

    if (currentPath === '/purification/maintenance') {
      return <MaintenancePage />
    }

    if (currentPath === '/purification/batches') {
      return <BatchManagementPage />
    }

    // Default dashboard
    return <PurificationDashboard />
  }

  return (
    <WebSocketProvider>
      <AlertProvider>
        <BaseLayout
          moduleName="ShuddhiDoot"
          moduleSubtitle="Biogas Purification & Quality Management"
          navigationItems={navigationItems}
          userInfo={{ name: user?.name || "Purification Manager", role: "PURIFICATION_MANAGER" }}
          breadcrumbs={breadcrumbs}
          contentClassName="!pt-16 !mt-2"
        >
          {renderPageContent()}
        </BaseLayout>
      </AlertProvider>
    </WebSocketProvider>
  )
}

export default Purification