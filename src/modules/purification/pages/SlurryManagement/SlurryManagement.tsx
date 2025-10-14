/**
 * Slurry Management Page - SAUB-FE-003
 * Slurry output tracking, collection scheduling, and revenue management
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Droplets,
  Calendar,
  Truck,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Leaf,
  Beaker,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import { SlurryOutput } from '../../Purification.types';
import { SLURRY_DESTINATIONS } from '../../Purification.config';
import { apiService } from '@/services/api';

interface SlurryFormData {
  cycleId: string;
  volume: number;
  qualityGrade: 'high' | 'medium' | 'low';
  destination: 'fertilizer' | 'disposal' | 'treatment' | 'sale';
  collectionScheduled: Date;
  moistureContent: number;
  npkContent: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  notes?: string;
}

export const SlurryManagement: React.FC = () => {
  const [slurryOutputs, setSlurryOutputs] = useState<SlurryOutput[]>([]);
  const [selectedSlurry, setSelectedSlurry] = useState<SlurryOutput | null>(null);
  const [newSlurryForm, setNewSlurryForm] = useState<SlurryFormData>({
    cycleId: '',
    volume: 0,
    qualityGrade: 'medium',
    destination: 'fertilizer',
    collectionScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    moistureContent: 0,
    npkContent: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDestination, setFilterDestination] = useState<string>('all');

  // Fetch slurry outputs from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getSlurryOutputs();
        if (response.success && response.data) {
          const slurryData = (Array.isArray(response.data) ? response.data : response.data.content || []).map((slurry: any) => ({
            ...slurry,
            id: slurry.id?.toString() || `slurry-${Date.now()}`,
            outputDate: new Date(slurry.outputDate || slurry.createdAt),
            collectionScheduled: new Date(slurry.collectionScheduled || Date.now()),
            qualityGrade: slurry.qualityGrade?.toLowerCase() || 'medium',
            collected: slurry.collected || false,
            moistureContent: slurry.moistureContent || 0,
            npkContent: {
              nitrogen: slurry.nitrogenContent || 0,
              phosphorus: slurry.phosphorusContent || 0,
              potassium: slurry.potassiumContent || 0
            },
            revenue: slurry.revenue || 0,
            analysisReport: slurry.notes || slurry.analysisReport
          }));
          setSlurryOutputs(slurryData);
        }
      } catch (error) {
        console.error('Failed to fetch slurry outputs:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000); // Refresh every 20 seconds
    return () => clearInterval(interval);
  }, []);

  const getQualityColor = (grade: string) => {
    switch (grade) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDestinationColor = (destination: string) => {
    switch (destination) {
      case 'fertilizer': return 'bg-green-100 text-green-800';
      case 'sale': return 'bg-blue-100 text-blue-800';
      case 'treatment': return 'bg-yellow-100 text-yellow-800';
      case 'disposal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDestinationPrice = (destination: string): number => {
    const dest = SLURRY_DESTINATIONS.find(d => d.id === destination);
    return dest?.price_per_liter || 0;
  };

  const filteredSlurry = slurryOutputs.filter(slurry => {
    const matchesSearch = slurry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slurry.cycleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (slurry.collectedBy && slurry.collectedBy.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDestination = filterDestination === 'all' || slurry.destination === filterDestination;

    return matchesSearch && matchesDestination;
  });

  const handleCreateSlurry = async () => {
    try {
      // Match backend CreateSlurryOutputRequest DTO structure
      const slurryData = {
        cycleId: newSlurryForm.cycleId, // String UUID, not integer
        slurryType: 'LIQUID', // Backend expects: LIQUID, SOLID, MIXED, SEPARATED
        volumeLiters: newSlurryForm.volume,
        weightKg: newSlurryForm.volume * 0.75, // Approximate density calculation
        qualityGrade: `GRADE_${newSlurryForm.qualityGrade.toUpperCase().charAt(0)}`, // Convert high/medium/low to GRADE_A/GRADE_B/GRADE_C
        moisturePercent: newSlurryForm.moistureContent,
        organicMatterPercent: 50, // Not captured in form, use default
        nitrogenPercent: newSlurryForm.npkContent.nitrogen,
        phosphorusPercent: newSlurryForm.npkContent.phosphorus,
        potassiumPercent: newSlurryForm.npkContent.potassium,
        phLevel: 7.0, // Not captured in form, use neutral default
        intendedUsage: newSlurryForm.destination.toUpperCase() === 'FERTILIZER' ? 'FERTILIZER' :
                       newSlurryForm.destination.toUpperCase() === 'DISPOSAL' ? 'WASTE_DISPOSAL' :
                       newSlurryForm.destination.toUpperCase() === 'TREATMENT' ? 'COMPOST' : 'SOIL_CONDITIONER',
        storageLocation: 'Primary Storage', // Not captured in form
        collectedBy: null,
        notes: `${newSlurryForm.notes || ''}\nCollection scheduled: ${newSlurryForm.collectionScheduled.toISOString()}`
      };

      const response = await apiService.createSlurryOutput(slurryData);
      if (response.success && response.data) {
        const newSlurry: SlurryOutput = {
          ...response.data,
          id: response.data.id?.toString() || `slurry-${Date.now()}`,
          outputDate: new Date(response.data.outputDate || Date.now()),
          collectionScheduled: new Date(response.data.collectionScheduled || newSlurryForm.collectionScheduled),
          qualityGrade: newSlurryForm.qualityGrade,
          collected: false,
          revenue: newSlurryForm.destination === 'disposal' ? -revenue : revenue,
          npkContent: newSlurryForm.npkContent,
          analysisReport: newSlurryForm.notes
        };

        setSlurryOutputs(prev => [newSlurry, ...prev]);

        // Reset form
        setNewSlurryForm({
          cycleId: '',
          volume: 0,
          qualityGrade: 'medium',
          destination: 'fertilizer',
          collectionScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000),
          moistureContent: 0,
          npkContent: {
            nitrogen: 0,
            phosphorus: 0,
            potassium: 0
          }
        });
      }
    } catch (error) {
      console.error('Failed to create slurry output:', error);
    }
  };

  const handleMarkCollected = (slurryId: string, collectedBy: string) => {
    setSlurryOutputs(prev => prev.map(slurry =>
      slurry.id === slurryId ? { ...slurry, collected: true, collectedBy } : slurry
    ));
  };

  const getSlurryStats = () => {
    const total = slurryOutputs.length;
    const pending = slurryOutputs.filter(s => !s.collected).length;
    const collected = slurryOutputs.filter(s => s.collected).length;
    const totalVolume = slurryOutputs.reduce((sum, s) => sum + s.volume, 0);
    const totalRevenue = slurryOutputs.reduce((sum, s) => sum + (s.revenue || 0), 0);
    const avgQuality = slurryOutputs.filter(s => s.qualityGrade === 'high').length / total * 100;

    return { total, pending, collected, totalVolume, totalRevenue, avgQuality };
  };

  const stats = getSlurryStats();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.ceil(diff / (1000 * 60 * 60));

    if (hours === 0) return 'Now';
    if (hours === 1) return 'In 1 hour';
    if (hours === -1) return '1 hour ago';
    if (hours > 0) return `In ${hours} hours`;
    return `${Math.abs(hours)} hours ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slurry Management</h1>
          <p className="text-gray-600 mt-1">Track slurry output, collection, and revenue</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Record Output
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Outputs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Droplets className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Collection</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-2xl font-bold text-green-600">{stats.collected}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalVolume}L</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Quality</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgQuality.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="outputs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="outputs">Slurry Outputs ({slurryOutputs.length})</TabsTrigger>
          <TabsTrigger value="collection">Collection Schedule</TabsTrigger>
          <TabsTrigger value="new">Record Output</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="outputs" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by output ID, cycle, or collector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={filterDestination}
              onChange={(e) => setFilterDestination(e.target.value)}
            >
              <option value="all">All Destinations</option>
              <option value="fertilizer">Fertilizer</option>
              <option value="sale">Direct Sale</option>
              <option value="treatment">Treatment</option>
              <option value="disposal">Disposal</option>
            </select>
          </div>

          {/* Slurry Output List */}
          <div className="space-y-4">
            {filteredSlurry.map((slurry) => (
              <Card key={slurry.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{slurry.id}</h3>
                      <p className="text-sm text-gray-600">
                        From cycle {slurry.cycleId} • Output on {slurry.outputDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {slurry.collected ? (
                        <Badge className="bg-green-100 text-green-800">
                          Collected
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      )}
                      <Badge className={getQualityColor(slurry.qualityGrade)}>
                        {slurry.qualityGrade} quality
                      </Badge>
                      <Badge className={getDestinationColor(slurry.destination)}>
                        {slurry.destination}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Volume</span>
                      <p className="text-lg font-bold text-blue-600">{slurry.volume} L</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Collection</span>
                      <p className="font-medium">{formatDate(slurry.collectionScheduled)}</p>
                      <p className="text-sm text-gray-500">{slurry.collectionScheduled.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Moisture</span>
                      <p className="font-medium">{slurry.moistureContent}%</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">NPK</span>
                      <p className="font-medium text-sm">
                        N:{slurry.npkContent.nitrogen}% P:{slurry.npkContent.phosphorus}% K:{slurry.npkContent.potassium}%
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Revenue</span>
                      <p className={`font-medium ${slurry.revenue && slurry.revenue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{Math.abs(slurry.revenue || 0).toLocaleString()}
                        {slurry.revenue && slurry.revenue < 0 && ' (cost)'}
                      </p>
                    </div>
                  </div>

                  {slurry.environmentalCertification && (
                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Leaf className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-800">
                            Environmental Certification: {slurry.environmentalCertification}
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}

                  {slurry.analysisReport && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Analysis:</strong> {slurry.analysisReport}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {slurry.collected && slurry.collectedBy && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-600">
                            Collected by {slurry.collectedBy}
                          </span>
                        </div>
                      )}
                      {!slurry.collected && (
                        <span className="text-sm text-yellow-600">
                          Collection scheduled for {slurry.collectionScheduled.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!slurry.collected && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const collector = prompt('Enter collector name:');
                            if (collector) {
                              handleMarkCollected(slurry.id, collector);
                            }
                          }}
                        >
                          Mark Collected
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Collection Schedule
              </CardTitle>
              <CardDescription>
                Upcoming slurry collection appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slurryOutputs
                  .filter(s => !s.collected)
                  .sort((a, b) => a.collectionScheduled.getTime() - b.collectionScheduled.getTime())
                  .map((slurry) => (
                    <div key={slurry.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{slurry.id}</h4>
                          <p className="text-sm text-gray-600">
                            {slurry.volume}L • {slurry.qualityGrade} quality • {slurry.destination}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatDate(slurry.collectionScheduled)}</p>
                        <p className="text-sm text-gray-600">{slurry.collectionScheduled.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-green-600" />
                Record New Slurry Output
              </CardTitle>
              <CardDescription>
                Document slurry production from a purification cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cycleId">Source Cycle ID</Label>
                      <Input
                        id="cycleId"
                        value={newSlurryForm.cycleId}
                        onChange={(e) => setNewSlurryForm(prev => ({
                          ...prev,
                          cycleId: e.target.value
                        }))}
                        placeholder="Enter cycle ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="volume">Volume (Liters)</Label>
                      <Input
                        id="volume"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newSlurryForm.volume}
                        onChange={(e) => setNewSlurryForm(prev => ({
                          ...prev,
                          volume: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="Enter volume in liters"
                      />
                    </div>
                    <div>
                      <Label htmlFor="qualityGrade">Quality Grade</Label>
                      <select
                        id="qualityGrade"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newSlurryForm.qualityGrade}
                        onChange={(e) => setNewSlurryForm(prev => ({
                          ...prev,
                          qualityGrade: e.target.value as any
                        }))}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="destination">Destination</Label>
                      <select
                        id="destination"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newSlurryForm.destination}
                        onChange={(e) => setNewSlurryForm(prev => ({
                          ...prev,
                          destination: e.target.value as any
                        }))}
                      >
                        {SLURRY_DESTINATIONS.map((dest) => (
                          <option key={dest.id} value={dest.id}>
                            {dest.name} (₹{dest.price_per_liter}/L)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="collectionDate">Collection Scheduled</Label>
                      <Input
                        id="collectionDate"
                        type="datetime-local"
                        value={newSlurryForm.collectionScheduled.toISOString().slice(0, 16)}
                        onChange={(e) => setNewSlurryForm(prev => ({
                          ...prev,
                          collectionScheduled: new Date(e.target.value)
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Quality Analysis */}
                <div className="space-y-4">
                  <h3 className="font-medium">Quality Analysis</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="moisture">Moisture Content (%)</Label>
                      <Input
                        id="moisture"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={newSlurryForm.moistureContent}
                        onChange={(e) => setNewSlurryForm(prev => ({
                          ...prev,
                          moistureContent: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="Enter moisture percentage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nitrogen">Nitrogen Content (%)</Label>
                      <Input
                        id="nitrogen"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newSlurryForm.npkContent.nitrogen}
                        onChange={(e) => setNewSlurryForm(prev => ({
                          ...prev,
                          npkContent: {
                            ...prev.npkContent,
                            nitrogen: parseFloat(e.target.value) || 0
                          }
                        }))}
                        placeholder="Enter nitrogen percentage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phosphorus">Phosphorus Content (%)</Label>
                      <Input
                        id="phosphorus"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newSlurryForm.npkContent.phosphorus}
                        onChange={(e) => setNewSlurryForm(prev => ({
                          ...prev,
                          npkContent: {
                            ...prev.npkContent,
                            phosphorus: parseFloat(e.target.value) || 0
                          }
                        }))}
                        placeholder="Enter phosphorus percentage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="potassium">Potassium Content (%)</Label>
                      <Input
                        id="potassium"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newSlurryForm.npkContent.potassium}
                        onChange={(e) => setNewSlurryForm(prev => ({
                          ...prev,
                          npkContent: {
                            ...prev.npkContent,
                            potassium: parseFloat(e.target.value) || 0
                          }
                        }))}
                        placeholder="Enter potassium percentage"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Calculation */}
              {newSlurryForm.volume > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    Revenue Calculation
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Price per Liter:</span>
                      <span className="ml-1 font-medium">₹{getDestinationPrice(newSlurryForm.destination)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="ml-1 font-medium text-green-600">
                        ₹{(newSlurryForm.volume * getDestinationPrice(newSlurryForm.destination)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="notes">Analysis Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter analysis results, observations, or special notes..."
                  value={newSlurryForm.notes || ''}
                  onChange={(e) => setNewSlurryForm(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button
                  onClick={handleCreateSlurry}
                  disabled={!newSlurryForm.cycleId || !newSlurryForm.volume}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  Record Output
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Production Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Output per Cycle</span>
                    <span className="font-medium">{(stats.totalVolume / stats.total).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Collection Efficiency</span>
                    <span className="font-medium text-green-600">{((stats.collected / stats.total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">High Quality Rate</span>
                    <span className="font-medium">{stats.avgQuality.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue per Liter</span>
                    <span className="font-medium">₹{(stats.totalRevenue / stats.totalVolume).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-5 h-5 mr-2 text-green-600" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Organic Fertilizer</span>
                    <span className="font-medium">{slurryOutputs.filter(s => s.destination === 'fertilizer').length} batches</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Waste Diverted</span>
                    <span className="font-medium text-green-600">{stats.totalVolume}L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Carbon Credits</span>
                    <span className="font-medium">2.4 tons CO₂eq</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Soil Enhancement</span>
                    <span className="font-medium">{slurryOutputs.filter(s => s.destination === 'fertilizer').reduce((sum, s) => sum + s.volume, 0)}L applied</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};