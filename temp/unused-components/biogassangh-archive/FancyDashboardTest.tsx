import React from 'react'
import BiogasKPIDashboard from '../components/BiogasKPIDashboard'

const FancyDashboardTest = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎨 Fancy Dashboard Test</h1>
      <p className="mb-6 text-gray-600">Testing the BiogasKPIDashboard with Ant Design and Recharts</p>
      <BiogasKPIDashboard />
    </div>
  )
}

export default FancyDashboardTest