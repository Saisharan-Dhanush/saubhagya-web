import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Factory,
  Calculator,
  Kanban,
  TrendingUp,
  DollarSign,
  BarChart3,
  Home,
  Settings,
  User,
  Bell,
  Search
} from 'lucide-react';

import PlantAggregationPage from './PlantAggregationPage';
import FeasibilityAnalysisPage from './FeasibilityAnalysisPage';
import PipelineManagementPage from './PipelineManagementPage';
import StrategicAnalyticsPage from './StrategicAnalyticsPage';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Plant Aggregation',
    icon: <Factory className="h-5 w-5" />,
    description: 'Manage and optimize existing biogas plants',
    badge: '12 Active'
  },
  {
    path: '/feasibility',
    label: 'Feasibility Analysis',
    icon: <Calculator className="h-5 w-5" />,
    description: 'ROI modeling and investment analysis',
    badge: 'New'
  },
  {
    path: '/pipeline',
    label: 'Pipeline Management',
    icon: <Kanban className="h-5 w-5" />,
    description: 'Track project development stages',
    badge: '6 Projects'
  },
  {
    path: '/analytics',
    label: 'Strategic Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'Market intelligence and growth insights'
  }
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const getCurrentPageInfo = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem || navigationItems[0];
  };

  const currentPage = getCurrentPageInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Factory className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">UrjaSanyojak</h1>
                  <p className="text-xs text-gray-500">Business Development Dashboard</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{currentPage.label}</h2>
                <p className="text-sm text-gray-600">{currentPage.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects, plants..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={isActive ? 'text-green-600' : 'text-gray-500'}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500 hidden lg:block">
                          {item.description.split(' ').slice(0, 3).join(' ')}...
                        </p>
                      </div>
                    </div>
                    {item.badge && (
                      <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            <Separator className="my-6" />

            {/* Quick Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-xs text-gray-600">Active Plants</span>
                  <span className="text-sm font-bold text-green-700">12</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-xs text-gray-600">Pipeline Value</span>
                  <span className="text-sm font-bold text-blue-700">₹250Cr</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                  <span className="text-xs text-gray-600">Monthly Revenue</span>
                  <span className="text-sm font-bold text-purple-700">₹38L</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <span className="text-xs text-gray-600">Market Share</span>
                  <span className="text-sm font-bold text-orange-700">35%</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Recent Activity */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">New feasibility study completed</p>
                  <p className="text-gray-500">Goverdhan Dairy Plant - 2 hours ago</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">Pipeline project updated</p>
                  <p className="text-gray-500">Barsana Community Plant - 4 hours ago</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">Market analysis refreshed</p>
                  <p className="text-gray-500">Strategic Analytics - 6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function UrjaSanyojakApp() {
  return (
    <BrowserRouter basename="/urjasanyojak">
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<PlantAggregationPage />} />
          <Route path="/feasibility" element={<FeasibilityAnalysisPage />} />
          <Route path="/pipeline" element={<PipelineManagementPage />} />
          <Route path="/analytics" element={<StrategicAnalyticsPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}