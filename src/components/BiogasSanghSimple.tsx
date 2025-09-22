import React from 'react';

const BiogasSanghSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Biogas Sangh Dashboard</h1>
          <p className="text-xl text-gray-600 mt-2">
            Cluster Management & Biogas Production Monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Production */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">CBG Production</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">2,450 m³</div>
              <div className="text-sm text-gray-600">Today's Production</div>
              <div className="text-sm font-medium text-green-600">+15.3% vs yesterday</div>
            </div>
          </div>

          {/* Active Digesters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Digesters</h3>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">8/10</div>
              <div className="text-sm text-gray-600">Digesters Online</div>
              <div className="text-sm font-medium text-yellow-600">2 in maintenance</div>
            </div>
          </div>

          {/* Farmers Connected */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Connected Farmers</h3>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">147</div>
              <div className="text-sm text-gray-600">Active Suppliers</div>
              <div className="text-sm font-medium text-green-600">+8 this month</div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">₹3.2L</div>
              <div className="text-sm text-gray-600">This Month</div>
              <div className="text-sm font-medium text-green-600">+22.1% growth</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cluster Management</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <div className="text-2xl mb-2">🏭</div>
              <div className="text-sm font-medium text-blue-900">Production Monitor</div>
            </button>
            <button className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <div className="text-2xl mb-2">👨‍🌾</div>
              <div className="text-sm font-medium text-green-900">Farmer Network</div>
            </button>
            <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-purple-900">Analytics</div>
            </button>
            <button className="p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium text-orange-900">Maintenance</div>
            </button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">45°C</div>
              <div className="text-sm text-gray-600">Avg Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">78%</div>
              <div className="text-sm text-gray-600">CH4 Concentration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiogasSanghSimple;