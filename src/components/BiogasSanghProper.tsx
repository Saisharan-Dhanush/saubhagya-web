import { useNavigate, useLocation } from 'react-router-dom'
import { BarChart3, Factory, Weight, Gavel, CreditCard, Clock, Receipt, Bell, History } from 'lucide-react'
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
import TransactionHistory from '../pages/biogassangh/TransactionHistory'
import AlertsManagement from '../pages/biogassangh/AlertsManagement'


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
      id: 'transaction-history',
      label: 'Transaction History',
      icon: <History className="w-4 h-4" />,
      onClick: () => navigate('/cluster/transaction-history'),
      isActive: location.pathname === '/cluster/transaction-history'
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

    if (currentPath === '/cluster/transaction-history') {
      return <TransactionHistory />
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