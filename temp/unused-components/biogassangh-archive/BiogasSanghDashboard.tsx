import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Factory,
  Gauge,
  Thermometer,
  Timer,
  Users,
  Weight,
  Zap,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Mic
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Digester {
  id: string;
  temperature: number;
  pressure: number;
  gasProduction: number;
  status: 'Active' | 'Maintenance' | 'Offline';
  lastMaintenance: string;
  ch4Percentage: number;
  h2sLevel: number;
  location: string;
  capacity: number;
}

interface CollectionData {
  totalWeight: number;
  farmerCount: number;
  avgWeightPerFarmer: number;
  completedPickups: number;
  pendingPickups: number;
}

interface DashboardProps {}

const BiogasSanghDashboard: React.FC<DashboardProps> = () => {
  const { user } = useAuth();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Mock data for demonstration
  const [digesters] = useState<Digester[]>([
    {
      id: 'D001',
      temperature: 35.5,
      pressure: 1.2,
      gasProduction: 150.0,
      status: 'Active',
      lastMaintenance: '2025-01-10',
      ch4Percentage: 65.0,
      h2sLevel: 15,
      location: 'Cluster A - Unit 1',
      capacity: 1000
    },
    {
      id: 'D002',
      temperature: 37.2,
      pressure: 1.5,
      gasProduction: 175.0,
      status: 'Active',
      lastMaintenance: '2025-01-08',
      ch4Percentage: 68.0,
      h2sLevel: 12,
      location: 'Cluster A - Unit 2',
      capacity: 1200
    },
    {
      id: 'D003',
      temperature: 32.1,
      pressure: 0.8,
      gasProduction: 120.0,
      status: 'Maintenance',
      lastMaintenance: '2025-01-15',
      ch4Percentage: 58.0,
      h2sLevel: 25,
      location: 'Cluster A - Unit 3',
      capacity: 800
    }
  ]);

  const [collectionData] = useState<CollectionData>({
    totalWeight: 12500,
    farmerCount: 47,
    avgWeightPerFarmer: 265.96,
    completedPickups: 42,
    pendingPickups: 5
  });

  const refreshData = () => {
    setLastRefresh(new Date());
  };

  // Hindi voice summary generator
  const generateHindiSummary = () => {
    const activeDigesters = digesters.filter(d => d.status === 'Active').length;

    return {
      hindi: `आज ${collectionData.totalWeight.toLocaleString()} किलो गोबर कलेक्ट किया गया है। ${collectionData.farmerCount} किसान भाइयों से। सभी ${activeDigesters} डाइजेस्टर सही तरीके से काम कर रहे हैं।`,
      english: `Today ${collectionData.totalWeight.toLocaleString()} kg cow dung has been collected from ${collectionData.farmerCount} farmer brothers. All ${activeDigesters} digesters are working properly.`
    };
  };

  const hindiSummary = generateHindiSummary();

  return (
    <div className="w-full space-y-4">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">BiogasSangh Dashboard</h1>
            <p className="text-blue-100 text-sm">
              {user?.name || "Cluster Manager"} • Cluster A
            </p>
          </div>
          <div className="flex space-x-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-2 text-xs text-blue-100">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <Weight className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-green-700 font-medium">Total Collection</p>
                <p className="text-lg font-bold text-green-900">{collectionData.totalWeight.toLocaleString()} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-blue-700 font-medium">Farmers</p>
                <p className="text-lg font-bold text-blue-900">{collectionData.farmerCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-500 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-orange-700 font-medium">Avg/Farmer</p>
                <p className="text-lg font-bold text-orange-900">{collectionData.avgWeightPerFarmer.toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-emerald-700 font-medium">Completed</p>
                <p className="text-lg font-bold text-emerald-900">{collectionData.completedPickups}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-red-700 font-medium">Pending</p>
                <p className="text-lg font-bold text-red-900">{collectionData.pendingPickups}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live Digester Monitoring */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Factory className="h-4 w-4 text-white" />
              </div>
              <span>Live Digesters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {digesters.map((digester) => (
                <div key={digester.id} className="bg-white border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-sm">Digester {digester.id}</h3>
                    <Badge
                      variant={digester.status === 'Active' ? 'default' :
                               digester.status === 'Maintenance' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {digester.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="flex flex-col items-center p-2 bg-red-50 rounded">
                      <Thermometer className="h-3 w-3 text-red-500 mb-1" />
                      <span className="font-medium">{digester.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-blue-50 rounded">
                      <Gauge className="h-3 w-3 text-blue-500 mb-1" />
                      <span className="font-medium">{digester.pressure.toFixed(1)} bar</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-green-50 rounded">
                      <Zap className="h-3 w-3 text-green-500 mb-1" />
                      <span className="font-medium">{digester.gasProduction.toFixed(1)} m³</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-purple-50 rounded">
                      <span className="text-purple-600 font-medium mb-1">CH₄</span>
                      <span className="font-medium">{digester.ch4Percentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between items-center text-xs">
                    <span className="text-gray-500">Maintenance: {digester.lastMaintenance}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      digester.h2sLevel < 20 ? 'bg-green-100 text-green-700' :
                      digester.h2sLevel < 40 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      H₂S: {digester.h2sLevel.toFixed(0)}ppm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Voice Summary */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Mic className="h-4 w-4 text-white" />
              </div>
              <span>Voice Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-white rounded-lg p-3 border-2 border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-2">{hindiSummary.hindi}</p>
              <p className="text-xs text-purple-600">{hindiSummary.english}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => {
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(hindiSummary.hindi);
                  utterance.lang = 'hi-IN';
                  speechSynthesis.speak(utterance);
                }
              }}
            >
              <Mic className="h-3 w-3 mr-1" />
              Speak Summary
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BiogasSanghDashboard;