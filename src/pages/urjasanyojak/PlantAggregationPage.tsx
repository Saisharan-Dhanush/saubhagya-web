import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Cell
} from 'recharts';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  MapPin,
  Zap,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface Plant {
  id: string;
  name: string;
  location: string;
  capacity: number; // m³/day
  currentProduction: number;
  efficiency: number;
  status: 'operational' | 'maintenance' | 'offline';
  monthlyRevenue: number;
  carbonCredits: number;
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  onboardingDate: string;
}

const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Vrindavan Gaushala Plant',
    location: 'Mathura, UP',
    capacity: 1500,
    currentProduction: 1275,
    efficiency: 85,
    status: 'operational',
    monthlyRevenue: 1750000,
    carbonCredits: 450,
    healthScore: 92,
    riskLevel: 'low',
    onboardingDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Gokul Dairy Biogas',
    location: 'Gokul, UP',
    capacity: 800,
    currentProduction: 640,
    efficiency: 80,
    status: 'operational',
    monthlyRevenue: 920000,
    carbonCredits: 240,
    healthScore: 88,
    riskLevel: 'low',
    onboardingDate: '2024-02-01'
  },
  {
    id: '3',
    name: 'Nandgaon Community Plant',
    location: 'Nandgaon, UP',
    capacity: 1200,
    currentProduction: 900,
    efficiency: 75,
    status: 'maintenance',
    monthlyRevenue: 1200000,
    carbonCredits: 320,
    healthScore: 76,
    riskLevel: 'medium',
    onboardingDate: '2024-01-20'
  }
];

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336'];

export default function PlantAggregationPage() {
  const [plants, setPlants] = useState<Plant[]>(mockPlants);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plant.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || plant.riskLevel === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  // Analytics calculations
  const totalCapacity = plants.reduce((sum, plant) => sum + plant.capacity, 0);
  const totalProduction = plants.reduce((sum, plant) => sum + plant.currentProduction, 0);
  const averageEfficiency = plants.reduce((sum, plant) => sum + plant.efficiency, 0) / plants.length;
  const totalRevenue = plants.reduce((sum, plant) => sum + plant.monthlyRevenue, 0);
  const totalCarbonCredits = plants.reduce((sum, plant) => sum + plant.carbonCredits, 0);

  const statusDistribution = [
    { name: 'Operational', value: plants.filter(p => p.status === 'operational').length, color: '#4CAF50' },
    { name: 'Maintenance', value: plants.filter(p => p.status === 'maintenance').length, color: '#FF9800' },
    { name: 'Offline', value: plants.filter(p => p.status === 'offline').length, color: '#F44336' }
  ];

  const performanceData = plants.map(plant => ({
    name: plant.name.split(' ')[0],
    efficiency: plant.efficiency,
    healthScore: plant.healthScore,
    capacity: plant.capacity
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'offline':
        return <Activity className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
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
          <h1 className="text-3xl font-bold text-gray-900">Plant Aggregation Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive biogas plant management and optimization</p>
        </div>
        <Button size="lg" className="bg-green-600 hover:bg-green-700">
          <MapPin className="h-4 w-4 mr-2" />
          Discover New Plants
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold">{totalCapacity.toLocaleString()}</p>
                <p className="text-xs text-gray-500">m³/day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Production</p>
                <p className="text-2xl font-bold">{totalProduction.toLocaleString()}</p>
                <p className="text-xs text-gray-500">m³/day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
                <p className="text-2xl font-bold">{averageEfficiency.toFixed(1)}%</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.3%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Carbon Credits</p>
                <p className="text-2xl font-bold">{totalCarbonCredits}</p>
                <p className="text-xs text-gray-500">tonnes/month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="benchmarking">Benchmarking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search plants by name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Plants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlants.map(plant => (
              <Card key={plant.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{plant.name}</CardTitle>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {plant.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(plant.status)}
                      <Badge className={getRiskBadgeColor(plant.riskLevel)}>
                        {plant.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Capacity</span>
                      <span className="font-medium">{plant.capacity} m³/day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Production</span>
                      <span className="font-medium">{plant.currentProduction} m³/day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Efficiency</span>
                      <Badge variant={plant.efficiency > 80 ? 'default' : 'secondary'}>
                        {plant.efficiency}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Health Score</span>
                      <span className={`font-medium ${plant.healthScore > 85 ? 'text-green-600' :
                        plant.healthScore > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {plant.healthScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Revenue</span>
                      <span className="font-medium text-green-600">
                        ₹{(plant.monthlyRevenue / 100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Plant Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#4CAF50" name="Efficiency %" />
                    <Bar dataKey="healthScore" fill="#2196F3" name="Health Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Plant Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              Financial performance tracking and revenue optimization insights for all aggregated plants.
            </AlertDescription>
          </Alert>

          {/* Financial metrics will be implemented here */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends & Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Financial analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarking" className="space-y-4">
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Compare plant performance against industry benchmarks and identify optimization opportunities.
            </AlertDescription>
          </Alert>

          {/* Benchmarking tools will be implemented here */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmarking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Benchmarking analysis tools coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}