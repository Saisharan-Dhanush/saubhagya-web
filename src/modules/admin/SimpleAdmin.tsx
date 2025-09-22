import React from 'react';

const SimpleAdmin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xl text-gray-600 mt-2">
            SAUBHAGYA Admin Portal - Comprehensive Platform Management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* System Health Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Auth Service</span>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">IoT Service</span>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-sm font-medium text-green-600">98.5%</span>
              </div>
            </div>
          </div>

          {/* User Management Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="text-sm font-medium text-gray-900">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active</span>
                <span className="text-sm font-medium text-green-600">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Admin Users</span>
                <span className="text-sm font-medium text-gray-900">8</span>
              </div>
            </div>
          </div>

          {/* Device Registry Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Device Registry</h3>
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Devices</span>
                <span className="text-sm font-medium text-gray-900">52</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Online</span>
                <span className="text-sm font-medium text-green-600">48</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Maintenance</span>
                <span className="text-sm font-medium text-yellow-600">4</span>
              </div>
            </div>
          </div>

          {/* Revenue Analytics Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="text-sm font-medium text-gray-900">₹8.2L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Carbon Credits</span>
                <span className="text-sm font-medium text-green-600">145.5 tCO2e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Growth</span>
                <span className="text-sm font-medium text-green-600">+15.3%</span>
              </div>
            </div>
          </div>

          {/* Audit Logs Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="text-sm font-medium text-gray-900">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success</span>
                <span className="text-sm font-medium text-green-600">1,186</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Warnings</span>
                <span className="text-sm font-medium text-yellow-600">61</span>
              </div>
            </div>
          </div>

          {/* System Configuration Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Config</h3>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Modules</span>
                <span className="text-sm font-medium text-gray-900">5/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Security Score</span>
                <span className="text-sm font-medium text-green-600">98/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm font-medium text-blue-600">2h ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Modules</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-sm font-medium text-blue-900">Dashboard</div>
            </button>
            <button className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium text-green-900">Users</div>
            </button>
            <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm font-medium text-purple-900">Devices</div>
            </button>
            <button className="p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium text-orange-900">Audit</div>
            </button>
            <button className="p-4 text-center bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-yellow-900">Reports</div>
            </button>
            <button className="p-4 text-center bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium text-gray-900">Config</div>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2,450</div>
              <div className="text-sm text-gray-600">CBG Production (m³)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">89.2%</div>
              <div className="text-sm text-gray-600">Operational Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">Active Clusters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">145.5</div>
              <div className="text-sm text-gray-600">Carbon Credits (tCO2e)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdmin;