import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BarChart3,
  TrendingUp,
  Mic,
  Target,
  DollarSign,
  Leaf,
  Globe,
  Brain
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import BaseLayout from '../components/layout/BaseLayout'

// Import the actual UrjaNeta page components
import Dashboard from '../modules/urjaneta/pages/Dashboard/Dashboard'
import VoiceAnalytics from '../modules/urjaneta/pages/VoiceAnalytics/VoiceAnalytics'
import StrategicPlanning from '../modules/urjaneta/pages/StrategicPlanning/StrategicPlanning'
import OperationalMetrics from '../modules/urjaneta/pages/OperationalMetrics/OperationalMetrics'
import FinancialAnalytics from '../modules/urjaneta/pages/FinancialAnalytics/FinancialAnalytics'
import CarbonDashboard from '../modules/urjaneta/pages/CarbonDashboard/CarbonDashboard'
import MarketIntelligence from '../modules/urjaneta/pages/MarketIntelligence/MarketIntelligence'
import PredictiveAnalytics from '../modules/urjaneta/pages/PredictiveAnalytics/PredictiveAnalytics'

// Simple placeholder for the main dashboard
const UrjaNetaDashboard = () => (
  <div className="p-6 space-y-6">
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">UrjaNeta Analytics & Intelligence</h1>
      <p className="text-purple-100">AI-powered business intelligence and strategic decision support</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">CBG Production</h3>
        <p className="text-3xl font-bold text-purple-600">2,450 m³</p>
        <p className="text-sm text-gray-500">This month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h3>
        <p className="text-3xl font-bold text-green-600">₹8.2L</p>
        <p className="text-sm text-gray-500">Monthly revenue</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Carbon Credits</h3>
        <p className="text-3xl font-bold text-blue-600">145.5 tCO2e</p>
        <p className="text-sm text-gray-500">Credits earned</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
        <p className="text-3xl font-bold text-orange-600">42</p>
        <p className="text-sm text-gray-500">Active recommendations</p>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Quick Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100">
          <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Executive Dashboard</span>
        </button>
        <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
          <Mic className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Voice Analytics</span>
        </button>
        <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100">
          <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Strategic Planning</span>
        </button>
        <button className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100">
          <Brain className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Predictive Analytics</span>
        </button>
      </div>
    </div>
  </div>
);

const UrjaNeta = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation items for the UrjaNeta module
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => navigate('/urjaneta'),
      isActive: location.pathname === '/urjaneta'
    },
    {
      id: 'voice',
      label: 'Voice Analytics',
      icon: <Mic className="w-4 h-4" />,
      onClick: () => navigate('/urjaneta/voice'),
      isActive: location.pathname === '/urjaneta/voice'
    },
    {
      id: 'strategic',
      label: 'Strategic Planning',
      icon: <Target className="w-4 h-4" />,
      onClick: () => navigate('/urjaneta/strategic'),
      isActive: location.pathname === '/urjaneta/strategic'
    },
    {
      id: 'operations',
      label: 'Operational Metrics',
      icon: <TrendingUp className="w-4 h-4" />,
      onClick: () => navigate('/urjaneta/operations'),
      isActive: location.pathname === '/urjaneta/operations'
    },
    {
      id: 'financial',
      label: 'Financial Analytics',
      icon: <DollarSign className="w-4 h-4" />,
      onClick: () => navigate('/urjaneta/financial'),
      isActive: location.pathname === '/urjaneta/financial'
    },
    {
      id: 'carbon',
      label: 'Carbon Dashboard',
      icon: <Leaf className="w-4 h-4" />,
      onClick: () => navigate('/urjaneta/carbon'),
      isActive: location.pathname === '/urjaneta/carbon'
    },
    {
      id: 'market',
      label: 'Market Intelligence',
      icon: <Globe className="w-4 h-4" />,
      onClick: () => navigate('/urjaneta/market'),
      isActive: location.pathname === '/urjaneta/market'
    },
    {
      id: 'predictive',
      label: 'Predictive Analytics',
      icon: <Brain className="w-4 h-4" />,
      onClick: () => navigate('/urjaneta/predictive'),
      isActive: location.pathname === '/urjaneta/predictive'
    }
  ]

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'SAUBHAGYA', onClick: () => navigate('/') },
    { label: 'UrjaNeta Analytics', onClick: () => navigate('/urjaneta') }
  ]

  // Page content based on current route
  const renderPageContent = () => {
    const currentPath = location.pathname

    if (currentPath === '/urjaneta/voice') {
      return <VoiceAnalytics />
    }

    if (currentPath === '/urjaneta/strategic') {
      return <StrategicPlanning />
    }

    if (currentPath === '/urjaneta/operations') {
      return <OperationalMetrics />
    }

    if (currentPath === '/urjaneta/financial') {
      return <FinancialAnalytics />
    }

    if (currentPath === '/urjaneta/carbon') {
      return <CarbonDashboard />
    }

    if (currentPath === '/urjaneta/market') {
      return <MarketIntelligence />
    }

    if (currentPath === '/urjaneta/predictive') {
      return <PredictiveAnalytics />
    }

    // Default dashboard - use the main executive dashboard
    return <Dashboard />
  }

  return (
    <BaseLayout
      moduleName="UrjaNeta"
      moduleSubtitle="AI-Powered Analytics & Business Intelligence"
      navigationItems={navigationItems}
      userInfo={{ name: user?.name || "Analytics Manager", role: "ANALYTICS_MANAGER" }}
      breadcrumbs={breadcrumbs}
      contentClassName="!pt-16 !mt-2"
    >
      {renderPageContent()}
    </BaseLayout>
  )
}

export default UrjaNeta