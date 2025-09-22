import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Zap,
  DollarSign
} from 'lucide-react';

// Import new executive components
import { ExecutiveAnalyticsProvider } from '../../contexts/ExecutiveAnalyticsContext';
import StrategicPlanning from '../../components/executive/StrategicPlanning';
import CarbonAnalytics from '../../components/executive/CarbonAnalytics';
import CompetitiveIntelligence from '../../components/executive/CompetitiveIntelligence';

const marketTrendsData = [
  { month: 'Jan 24', biogasAdoption: 65, carbonCredits: 45, government: 80, private: 35 },
  { month: 'Feb 24', biogasAdoption: 68, carbonCredits: 50, government: 82, private: 38 },
  { month: 'Mar 24', biogasAdoption: 72, carbonCredits: 55, government: 85, private: 42 },
  { month: 'Apr 24', biogasAdoption: 75, carbonCredits: 60, government: 88, private: 45 },
  { month: 'May 24', biogasAdoption: 78, carbonCredits: 65, government: 90, private: 48 },
  { month: 'Jun 24', biogasAdoption: 82, carbonCredits: 70, government: 92, private: 52 },
  { month: 'Jul 24', biogasAdoption: 85, carbonCredits: 75, government: 95, private: 55 },
  { month: 'Aug 24', biogasAdoption: 88, carbonCredits: 80, government: 97, private: 58 },
  { month: 'Sep 24', biogasAdoption: 90, carbonCredits: 85, government: 98, private: 62 }
];

const competitiveAnalysisData = [
  { name: 'SAUBHAGYA', marketShare: 35, satisfaction: 92, innovation: 88, expansion: 25 },
  { name: 'BioPower Corp', marketShare: 22, satisfaction: 78, innovation: 65, expansion: 15 },
  { name: 'GreenEnergy Ltd', marketShare: 18, satisfaction: 82, innovation: 72, expansion: 12 },
  { name: 'EcoGas Systems', marketShare: 15, satisfaction: 75, innovation: 68, expansion: 8 },
  { name: 'Others', marketShare: 10, satisfaction: 70, innovation: 60, expansion: 5 }
];

const expansionOpportunities = [
  {
    region: 'Western UP',
    score: 92,
    potential: 'High',
    cattlePopulation: 450000,
    existingPlants: 12,
    marketGap: 78,
    investmentNeeded: 15000000000,
    roi: 18.5,
    timeframe: '18-24 months'
  },
  {
    region: 'Central UP',
    score: 88,
    potential: 'High',
    cattlePopulation: 380000,
    existingPlants: 8,
    marketGap: 85,
    investmentNeeded: 12000000000,
    roi: 16.8,
    timeframe: '15-20 months'
  },
  {
    region: 'Eastern UP',
    score: 75,
    potential: 'Medium',
    cattlePopulation: 320000,
    existingPlants: 15,
    marketGap: 62,
    investmentNeeded: 8000000000,
    roi: 14.2,
    timeframe: '12-18 months'
  },
  {
    region: 'Bundelkhand',
    score: 68,
    potential: 'Medium',
    cattlePopulation: 180000,
    existingPlants: 5,
    marketGap: 88,
    investmentNeeded: 6000000000,
    roi: 15.5,
    timeframe: '20-30 months'
  }
];

const performanceKPIs = [
  { metric: 'Market Share Growth', current: 35, target: 45, unit: '%', trend: 'up', change: 8.2 },
  { metric: 'Customer Satisfaction', current: 92, target: 95, unit: '%', trend: 'up', change: 3.1 },
  { metric: 'Plant Efficiency', current: 82, target: 88, unit: '%', trend: 'up', change: 5.4 },
  { metric: 'Revenue Growth', current: 28, target: 35, unit: '%', trend: 'up', change: 12.3 },
  { metric: 'Carbon Credits', current: 2450, target: 3000, unit: 'tonnes', trend: 'up', change: 18.7 },
  { metric: 'Pipeline Value', current: 250, target: 400, unit: '₹Cr', trend: 'up', change: 22.5 }
];

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'];

export default function StrategicAnalyticsPage() {
  const [timeframe, setTimeframe] = useState('6m');
  const [region, setRegion] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic Analytics & Intelligence</h1>
          <p className="text-gray-600 mt-1">Market intelligence, competitive analysis, and growth planning insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="2y">2 Years</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {performanceKPIs.map(kpi => (
          <Card key={kpi.metric}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">{kpi.metric}</p>
                  <p className="text-lg font-bold">{kpi.current}{kpi.unit}</p>
                  <div className={`flex items-center text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {kpi.change}%
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Target</p>
                  <p className="text-sm font-medium">{kpi.target}{kpi.unit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="market-trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="market-trends">Market Trends</TabsTrigger>
          <TabsTrigger value="competitive">Basic Analysis</TabsTrigger>
          <TabsTrigger value="expansion">Expansion</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="strategic-planning">Strategic Planning</TabsTrigger>
          <TabsTrigger value="carbon-analytics">Carbon Analytics</TabsTrigger>
          <TabsTrigger value="competitive-intelligence">Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="market-trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Adoption Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Market Adoption Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={marketTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="biogasAdoption" stroke="#4CAF50" strokeWidth={2} name="Biogas Adoption %" />
                    <Line type="monotone" dataKey="carbonCredits" stroke="#2196F3" strokeWidth={2} name="Carbon Credits %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sector-wise Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Sector-wise Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={marketTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="government" stackId="1" stroke="#4CAF50" fill="#4CAF50" name="Government Sector" />
                    <Area type="monotone" dataKey="private" stackId="1" stroke="#2196F3" fill="#2196F3" name="Private Sector" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Share */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Market Share Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={competitiveAnalysisData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="marketShare"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {competitiveAnalysisData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Competitive Benchmarking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Competitive Benchmarking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={competitiveAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="satisfaction" fill="#4CAF50" name="Customer Satisfaction" />
                    <Bar dataKey="innovation" fill="#2196F3" name="Innovation Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Competitive Analysis Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Competitive Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Company</th>
                      <th className="text-center p-3">Market Share</th>
                      <th className="text-center p-3">Customer Satisfaction</th>
                      <th className="text-center p-3">Innovation Score</th>
                      <th className="text-center p-3">Expansion Rate</th>
                      <th className="text-center p-3">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitiveAnalysisData.map((company, index) => (
                      <tr key={company.name} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{company.name}</td>
                        <td className="text-center p-3">{company.marketShare}%</td>
                        <td className="text-center p-3">{company.satisfaction}%</td>
                        <td className="text-center p-3">{company.innovation}%</td>
                        <td className="text-center p-3">{company.expansion}%</td>
                        <td className="text-center p-3">
                          <Badge variant={index === 0 ? 'default' : 'secondary'}>
                            #{index + 1}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expansion" className="space-y-4">
          {/* Expansion Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {expansionOpportunities.map(opportunity => (
              <Card key={opportunity.region} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{opportunity.region}</CardTitle>
                    <Badge className={getPotentialColor(opportunity.potential)}>
                      {opportunity.potential}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    Opportunity Score: {opportunity.score}/100
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Cattle Population:</span>
                      <p className="font-medium">{opportunity.cattlePopulation.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Existing Plants:</span>
                      <p className="font-medium">{opportunity.existingPlants}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Market Gap:</span>
                      <p className="font-medium">{opportunity.marketGap}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected ROI:</span>
                      <p className="font-medium text-green-600">{opportunity.roi}%</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Investment Needed:</span>
                    <p className="font-medium">₹{(opportunity.investmentNeeded / 10000000000).toFixed(1)}K Cr</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Timeframe:</span>
                    <p className="font-medium">{opportunity.timeframe}</p>
                  </div>
                  <Button className="w-full mt-4" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Explore Opportunity
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Projections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Revenue Growth Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Projected Revenue (2025)</p>
                      <p className="text-2xl font-bold text-blue-600">₹850 Cr</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Growth Rate</p>
                      <p className="text-lg font-medium text-green-600">+32%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Market Share (2025)</p>
                      <p className="text-2xl font-bold text-green-600">42%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Increase</p>
                      <p className="text-lg font-medium text-green-600">+7%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">New Plants (2025)</p>
                      <p className="text-2xl font-bold text-purple-600">125</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Addition</p>
                      <p className="text-lg font-medium text-green-600">+85</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Risk Assessment & Mitigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Policy Changes</p>
                      <p className="text-sm text-gray-600">Government subsidy modifications</p>
                    </div>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Market Competition</p>
                      <p className="text-sm text-gray-600">New players entering market</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Technology Disruption</p>
                      <p className="text-sm text-gray-600">Alternative energy solutions</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Low</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Supply Chain</p>
                      <p className="text-sm text-gray-600">Raw material availability</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* New Executive Analytics Tabs */}
        <TabsContent value="strategic-planning" className="space-y-4">
          <ExecutiveAnalyticsProvider>
            <StrategicPlanning />
          </ExecutiveAnalyticsProvider>
        </TabsContent>

        <TabsContent value="carbon-analytics" className="space-y-4">
          <ExecutiveAnalyticsProvider>
            <CarbonAnalytics />
          </ExecutiveAnalyticsProvider>
        </TabsContent>

        <TabsContent value="competitive-intelligence" className="space-y-4">
          <ExecutiveAnalyticsProvider>
            <CompetitiveIntelligence />
          </ExecutiveAnalyticsProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
}