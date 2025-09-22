import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BarChart3,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  FileText,
  TrendingUp,
  DollarSign,
  Package,
  Calendar
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import BaseLayout from '../components/layout/BaseLayout'

// Main Sales Dashboard Component
const SalesDashboard = () => (
  <div className="p-6 space-y-6">
    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">UrjaVyapar Sales Management</h1>
      <p className="text-green-100">CBG Sales, Distribution & Customer Management Platform</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sales</h3>
        <p className="text-3xl font-bold text-green-600">₹8.2L</p>
        <p className="text-sm text-gray-500">This month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Customers</h3>
        <p className="text-3xl font-bold text-blue-600">156</p>
        <p className="text-sm text-gray-500">+12 new this month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">CBG Volume</h3>
        <p className="text-3xl font-bold text-purple-600">2,450 m³</p>
        <p className="text-sm text-gray-500">Delivered this month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Status</h3>
        <p className="text-3xl font-bold text-orange-600">94.5%</p>
        <p className="text-sm text-gray-500">Collection efficiency</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Order #ORD-2025-001</p>
              <p className="text-sm text-gray-600">ABC Industries - 500 m³</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Order #ORD-2025-002</p>
              <p className="text-sm text-gray-600">XYZ Corp - 750 m³</p>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Transit</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Order #ORD-2025-003</p>
              <p className="text-sm text-gray-600">PQR Limited - 300 m³</p>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processing</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100">
            <ShoppingCart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium">New Order</span>
          </button>
          <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Customers</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100">
            <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Deliveries</span>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100">
            <CreditCard className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Payments</span>
          </button>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Sales Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">₹3.2L</div>
          <div className="text-sm text-gray-600">Weekly Revenue</div>
          <div className="text-sm font-medium text-green-600">+18.5% vs last week</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">89</div>
          <div className="text-sm text-gray-600">Orders This Week</div>
          <div className="text-sm font-medium text-blue-600">+12% vs last week</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">₹36,450</div>
          <div className="text-sm text-gray-600">Average Order Value</div>
          <div className="text-sm font-medium text-purple-600">+5.2% vs last week</div>
        </div>
      </div>
    </div>
  </div>
);

const Sales = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation items for the Sales module
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Sales Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => navigate('/sales'),
      isActive: location.pathname === '/sales'
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: <ShoppingCart className="w-4 h-4" />,
      onClick: () => navigate('/sales/orders'),
      isActive: location.pathname === '/sales/orders'
    },
    {
      id: 'customers',
      label: 'Customer Management',
      icon: <Users className="w-4 h-4" />,
      onClick: () => navigate('/sales/customers'),
      isActive: location.pathname === '/sales/customers'
    },
    {
      id: 'inventory',
      label: 'Inventory Management',
      icon: <Package className="w-4 h-4" />,
      onClick: () => navigate('/sales/inventory'),
      isActive: location.pathname === '/sales/inventory'
    },
    {
      id: 'contracts',
      label: 'Contract Management',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => navigate('/sales/contracts'),
      isActive: location.pathname === '/sales/contracts'
    },
    {
      id: 'payments',
      label: 'Payment Tracking',
      icon: <CreditCard className="w-4 h-4" />,
      onClick: () => navigate('/sales/payments'),
      isActive: location.pathname === '/sales/payments'
    },
    {
      id: 'delivery',
      label: 'Delivery Scheduling',
      icon: <Truck className="w-4 h-4" />,
      onClick: () => navigate('/sales/delivery'),
      isActive: location.pathname === '/sales/delivery'
    },
    {
      id: 'pricing',
      label: 'Price Benchmarking',
      icon: <TrendingUp className="w-4 h-4" />,
      onClick: () => navigate('/sales/pricing'),
      isActive: location.pathname === '/sales/pricing'
    },
    {
      id: 'invoicing',
      label: 'Voice Invoicing',
      icon: <DollarSign className="w-4 h-4" />,
      onClick: () => navigate('/sales/invoicing'),
      isActive: location.pathname === '/sales/invoicing'
    },
    {
      id: 'compliance',
      label: 'Compliance Reports',
      icon: <Calendar className="w-4 h-4" />,
      onClick: () => navigate('/sales/compliance'),
      isActive: location.pathname === '/sales/compliance'
    }
  ]

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'SAUBHAGYA', onClick: () => navigate('/') },
    { label: 'UrjaVyapar Sales', onClick: () => navigate('/sales') }
  ]

  // Page content based on current route
  const renderPageContent = () => {
    const currentPath = location.pathname

    if (currentPath === '/sales/orders') {
      return <div className="p-8"><h2 className="text-2xl font-bold">Order Management - Coming Soon</h2></div>
    }

    if (currentPath === '/sales/customers') {
      return <div className="p-8"><h2 className="text-2xl font-bold">Customer Management - Coming Soon</h2></div>
    }

    if (currentPath === '/sales/inventory') {
      return <div className="p-8"><h2 className="text-2xl font-bold">Inventory Management - Coming Soon</h2></div>
    }

    if (currentPath === '/sales/contracts') {
      return <div className="p-8"><h2 className="text-2xl font-bold">Contract Management - Coming Soon</h2></div>
    }

    if (currentPath === '/sales/payments') {
      return <div className="p-8"><h2 className="text-2xl font-bold">Payment Tracking - Coming Soon</h2></div>
    }

    if (currentPath === '/sales/delivery') {
      return <div className="p-8"><h2 className="text-2xl font-bold">Delivery Scheduling - Coming Soon</h2></div>
    }

    if (currentPath === '/sales/pricing') {
      return <div className="p-8"><h2 className="text-2xl font-bold">Price Benchmarking - Coming Soon</h2></div>
    }

    if (currentPath === '/sales/invoicing') {
      return <div className="p-8"><h2 className="text-2xl font-bold">Voice Invoicing - Coming Soon</h2></div>
    }

    if (currentPath === '/sales/compliance') {
      return <div className="p-8"><h2 className="text-2xl font-bold">Compliance Reports - Coming Soon</h2></div>
    }

    // Default dashboard
    return <SalesDashboard />
  }

  return (
    <BaseLayout
      moduleName="UrjaVyapar"
      moduleSubtitle="CBG Sales & Distribution Management"
      navigationItems={navigationItems}
      userInfo={{ name: user?.name || "Sales Manager", role: "SALES_MANAGER" }}
      breadcrumbs={breadcrumbs}
      contentClassName="!pt-16 !mt-2"
    >
      {renderPageContent()}
    </BaseLayout>
  )
}

export default Sales