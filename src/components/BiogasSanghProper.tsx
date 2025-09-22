import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BarChart3, Factory, Weight, Gavel, CreditCard, Clock, Receipt, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import BaseLayout from '../components/layout/BaseLayout'

// Import the actual page components
import EnhancedBiogasDashboard from '../pages/biogassangh/EnhancedBiogasDashboard'
import ModernDigesterMonitoring from '../pages/biogassangh/ModernDigesterMonitoring'
import BatchManagement from '../pages/biogassangh/BatchManagement'
import DisputeResolution from '../pages/biogassangh/DisputeResolution'
import PaymentReconciliation from '../pages/biogassangh/PaymentReconciliation'
import PickupScheduler from '../pages/biogassangh/PickupScheduler'
import TransactionEntry from '../pages/biogassangh/TransactionEntry'
import AlertsManagement from '../pages/biogassangh/AlertsManagement'

// Simple placeholder for the main dashboard
const BiogasSanghDashboard = () => (
  <div className="p-6 space-y-6">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">BiogasSangh Cluster Management</h1>
      <p className="text-blue-100">Real-time production monitoring and farmer network coordination</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Collection</h3>
        <p className="text-3xl font-bold text-blue-600">12,500 kg</p>
        <p className="text-sm text-gray-500">Today's collection</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Farmers</h3>
        <p className="text-3xl font-bold text-green-600">47</p>
        <p className="text-sm text-gray-500">Connected suppliers</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gas Production</h3>
        <p className="text-3xl font-bold text-purple-600">445 m³</p>
        <p className="text-sm text-gray-500">Current output</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">System Status</h3>
        <p className="text-3xl font-bold text-green-600">98.5%</p>
        <p className="text-sm text-gray-500">Operational efficiency</p>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
          <Factory className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Digesters</span>
        </button>
        <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100">
          <Weight className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Batches</span>
        </button>
        <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100">
          <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Payments</span>
        </button>
        <button className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100">
          <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Scheduler</span>
        </button>
      </div>
    </div>
  </div>
);

const BiogasSangh = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation items for the BiogasSangh module
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => navigate('/cluster'),
      isActive: location.pathname === '/cluster'
    },
    {
      id: 'digesters',
      label: 'Digester Monitoring',
      icon: <Factory className="w-4 h-4" />,
      onClick: () => navigate('/cluster/digesters'),
      isActive: location.pathname === '/cluster/digesters'
    },
    {
      id: 'batches',
      label: 'Batch Management',
      icon: <Weight className="w-4 h-4" />,
      onClick: () => navigate('/cluster/batches'),
      isActive: location.pathname === '/cluster/batches'
    },
    {
      id: 'disputes',
      label: 'Dispute Resolution',
      icon: <Gavel className="w-4 h-4" />,
      onClick: () => navigate('/cluster/disputes'),
      isActive: location.pathname === '/cluster/disputes'
    },
    {
      id: 'payments',
      label: 'Payment Reconciliation',
      icon: <CreditCard className="w-4 h-4" />,
      onClick: () => navigate('/cluster/payments'),
      isActive: location.pathname === '/cluster/payments'
    },
    {
      id: 'scheduler',
      label: 'Pickup Scheduler',
      icon: <Clock className="w-4 h-4" />,
      onClick: () => navigate('/cluster/scheduler'),
      isActive: location.pathname === '/cluster/scheduler'
    },
    {
      id: 'transactions',
      label: 'Transaction Entry',
      icon: <Receipt className="w-4 h-4" />,
      onClick: () => navigate('/cluster/transactions'),
      isActive: location.pathname === '/cluster/transactions'
    },
    {
      id: 'alerts',
      label: 'Alerts Management',
      icon: <Bell className="w-4 h-4" />,
      onClick: () => navigate('/cluster/alerts'),
      isActive: location.pathname === '/cluster/alerts'
    }
  ]

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'SAUBHAGYA', onClick: () => navigate('/') },
    { label: 'BiogasSangh Cluster', onClick: () => navigate('/cluster') }
  ]

  // Page content based on current route
  const renderPageContent = () => {
    const currentPath = location.pathname

    if (currentPath === '/cluster/digesters') {
      return <ModernDigesterMonitoring />
    }

    if (currentPath === '/cluster/batches') {
      return <BatchManagement />
    }

    if (currentPath === '/cluster/disputes') {
      return <DisputeResolution />
    }

    if (currentPath === '/cluster/payments') {
      return <PaymentReconciliation />
    }

    if (currentPath === '/cluster/scheduler') {
      return <PickupScheduler />
    }

    if (currentPath === '/cluster/transactions') {
      return <TransactionEntry />
    }

    if (currentPath === '/cluster/alerts') {
      return <AlertsManagement />
    }

    // Default dashboard - use the enhanced dashboard
    return <EnhancedBiogasDashboard />
  }

  return (
    <BaseLayout
      moduleName="BiogasSangh"
      moduleSubtitle="Cluster Management & Operations"
      navigationItems={navigationItems}
      userInfo={{ name: user?.name || "Cluster Manager", role: "CLUSTER_MANAGER" }}
      breadcrumbs={breadcrumbs}
      contentClassName="!pt-16 !mt-2"
    >
      {renderPageContent()}
    </BaseLayout>
  )
}

export default BiogasSangh