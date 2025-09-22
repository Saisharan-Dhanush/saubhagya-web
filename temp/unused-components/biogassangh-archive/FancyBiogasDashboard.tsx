import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip
} from 'recharts'
import {
  TrendingUp, Zap, DollarSign, Users, Leaf, Factory,
  Gauge, Award, AlertTriangle, Calendar
} from 'lucide-react'

const FancyBiogasDashboard = () => {
  // Mock data for charts
  const productionData = [
    { month: 'Jan', biogas: 1250, methane: 812, efficiency: 65 },
    { month: 'Feb', biogas: 1350, methane: 878, efficiency: 65 },
    { month: 'Mar', biogas: 1420, methane: 923, efficiency: 65 },
    { month: 'Apr', biogas: 1380, methane: 897, efficiency: 65 },
    { month: 'May', biogas: 1520, methane: 988, efficiency: 65 },
    { month: 'Jun', biogas: 1680, methane: 1092, efficiency: 65 }
  ]

  const farmerData = [
    { name: 'राजेश कुमार', contribution: 450, earnings: 18500 },
    { name: 'सुरेश पटेल', contribution: 420, earnings: 17200 },
    { name: 'मुकेश यादव', contribution: 380, earnings: 15600 },
    { name: 'रामेश सिंह', contribution: 360, earnings: 14800 },
    { name: 'विकास शर्मा', contribution: 340, earnings: 13900 }
  ]

  const performanceData = [
    { metric: 'Production', value: 85, color: '#22c55e' },
    { metric: 'Quality', value: 92, color: '#3b82f6' },
    { metric: 'Efficiency', value: 78, color: '#f59e0b' },
    { metric: 'Revenue', value: 88, color: '#8b5cf6' }
  ]

  const wasteSourceData = [
    { name: 'गौशाला', value: 45, color: '#22c55e' },
    { name: 'कृषि अपशिष्ट', value: 30, color: '#3b82f6' },
    { name: 'घरेलू जैविक', value: 15, color: '#f59e0b' },
    { name: 'अन्य स्रोत', value: 10, color: '#ef4444' }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biogas KPI Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive Analytics & Performance Metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button className="gap-2">
            <TrendingUp className="w-4 h-4" />
            View Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biogas Production</CardTitle>
            <Factory className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8,570 m³</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹4,28,500</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">147</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-purple-600">+5</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
            <Gauge className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">87.4%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-600">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Production Trends
            </CardTitle>
            <CardDescription>Monthly biogas and methane production</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="biogas"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Biogas (m³)"
                />
                <Line
                  type="monotone"
                  dataKey="methane"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Methane (m³)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Farmers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Top Contributing Farmers
            </CardTitle>
            <CardDescription>Highest waste contributors this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {farmerData.map((farmer, index) => (
                <div key={farmer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{farmer.name}</p>
                      <p className="text-sm text-gray-600">{farmer.contribution} kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">₹{farmer.earnings.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">earnings</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Waste Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Waste Source Distribution
            </CardTitle>
            <CardDescription>Source breakdown of organic waste</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={wasteSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {wasteSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Environmental Impact
            </CardTitle>
            <CardDescription>Positive environmental contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">CO₂ Reduced</span>
                </div>
                <span className="font-bold text-green-600">2,845 tons</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Energy Generated</span>
                </div>
                <span className="font-bold text-blue-600">15,420 kWh</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Waste Processed</span>
                </div>
                <span className="font-bold text-purple-600">12,350 kg</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium">Carbon Credits</span>
                </div>
                <span className="font-bold text-amber-600">1,250 units</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FancyBiogasDashboard