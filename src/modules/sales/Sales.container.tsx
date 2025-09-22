import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import SalesDashboard from './pages/SalesDashboard';
import CustomerManagement from './pages/CustomerManagement';
import ContractManagement from './pages/ContractManagement';
import InventoryManagement from './pages/InventoryManagement';
import OrderManagement from './pages/OrderManagement';
import VoiceInvoicing from './pages/VoiceInvoicing';
import PaymentTracking from './pages/PaymentTracking';
import DeliveryScheduling from './pages/DeliveryScheduling';
import PriceBenchmarking from './pages/PriceBenchmarking';
import ComplianceReports from './pages/ComplianceReports';
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  ShoppingCart,
  Mic,
  CreditCard,
  Truck,
  TrendingUp,
  Shield
} from 'lucide-react';

const SalesModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Sales Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      onClick: () => navigate('/sales'),
      isActive: location.pathname === '/sales'
    },
    {
      id: 'customers',
      label: 'Customer Management',
      icon: <Users className="w-5 h-5" />,
      onClick: () => navigate('/sales/customers'),
      isActive: location.pathname === '/sales/customers'
    },
    {
      id: 'contracts',
      label: 'Contract Management',
      icon: <FileText className="w-5 h-5" />,
      onClick: () => navigate('/sales/contracts'),
      isActive: location.pathname === '/sales/contracts'
    },
    {
      id: 'inventory',
      label: 'Inventory Management',
      icon: <Package className="w-5 h-5" />,
      onClick: () => navigate('/sales/inventory'),
      isActive: location.pathname === '/sales/inventory'
    },
    {
      id: 'orders',
      label: 'Order & Invoice',
      icon: <ShoppingCart className="w-5 h-5" />,
      onClick: () => navigate('/sales/orders'),
      isActive: location.pathname === '/sales/orders'
    },
    {
      id: 'voice-invoice',
      label: 'Voice Invoicing',
      icon: <Mic className="w-5 h-5" />,
      onClick: () => navigate('/sales/voice-invoice'),
      isActive: location.pathname === '/sales/voice-invoice'
    },
    {
      id: 'payments',
      label: 'Payment Tracking',
      icon: <CreditCard className="w-5 h-5" />,
      onClick: () => navigate('/sales/payments'),
      isActive: location.pathname === '/sales/payments'
    },
    {
      id: 'delivery',
      label: 'Delivery Scheduling',
      icon: <Truck className="w-5 h-5" />,
      onClick: () => navigate('/sales/delivery'),
      isActive: location.pathname === '/sales/delivery'
    },
    {
      id: 'pricing',
      label: 'Price Benchmarking',
      icon: <TrendingUp className="w-5 h-5" />,
      onClick: () => navigate('/sales/pricing'),
      isActive: location.pathname === '/sales/pricing'
    },
    {
      id: 'compliance',
      label: 'Compliance & Reports',
      icon: <Shield className="w-5 h-5" />,
      onClick: () => navigate('/sales/compliance'),
      isActive: location.pathname === '/sales/compliance'
    }
  ];

  return (
    <BaseLayout
      moduleName="UrjaVyapar Sales"
      moduleSubtitle="Comprehensive Sales Management System"
      navigationItems={navigationItems}
      userInfo={{
        name: "Sales Manager",
        role: "Sales Operations"
      }}
    >
      <Routes>
        <Route path="/" element={<SalesDashboard />} />
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/contracts" element={<ContractManagement />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/voice-invoice" element={<VoiceInvoicing />} />
        <Route path="/payments" element={<PaymentTracking />} />
        <Route path="/delivery" element={<DeliveryScheduling />} />
        <Route path="/pricing" element={<PriceBenchmarking />} />
        <Route path="/compliance" element={<ComplianceReports />} />
      </Routes>
    </BaseLayout>
  );
};

export default SalesModule;