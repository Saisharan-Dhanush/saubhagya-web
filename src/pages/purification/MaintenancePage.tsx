import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useAlerts } from '../../contexts/AlertContext';
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Settings,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Thermometer,
  Gauge,
  Timer,
  User,
  FileText,
  Search
} from 'lucide-react';

interface EquipmentHealth {
  id: string;
  name: string;
  type: 'pump' | 'scrubber' | 'compressor' | 'sensor' | 'valve';
  health: number; // 0-100
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  lastMaintenance: string;
  nextMaintenance: string;
  operatingHours: number;
  efficiency: number;
  vibration: number;
  temperature: number;
  predictions: {
    failureProbability: number;
    estimatedFailureDate: string;
    recommendedAction: string;
  };
}

interface MaintenanceTask {
  id: string;
  equipment: string;
  type: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  assignedTo: string;
  scheduledDate: string;
  estimatedDuration: number; // hours
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  spareParts: string[];
}

interface SparePart {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  supplier: string;
  lastOrdered: string;
  cost: number;
}

const MaintenancePage: React.FC = () => {
  const [equipmentData, setEquipmentData] = useState<EquipmentHealth[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [spareParts, setSparePartsData] = useState<SparePart[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const { wsData, isConnected } = useWebSocket('/purification/maintenance');
  const { addAlert } = useAlerts();

  // Mock data generation
  const generateMockEquipmentData = (): EquipmentHealth[] => [
    {
      id: 'pump-001',
      name: 'Primary Water Pump',
      type: 'pump',
      health: 85,
      status: 'healthy',
      lastMaintenance: '2024-08-15',
      nextMaintenance: '2024-11-15',
      operatingHours: 2350,
      efficiency: 88,
      vibration: 2.1,
      temperature: 45,
      predictions: {
        failureProbability: 15,
        estimatedFailureDate: '2025-03-20',
        recommendedAction: 'Schedule bearing lubrication'
      }
    },
    {
      id: 'scrubber-001',
      name: 'H₂S Scrubber Unit',
      type: 'scrubber',
      health: 92,
      status: 'healthy',
      lastMaintenance: '2024-09-01',
      nextMaintenance: '2024-12-01',
      operatingHours: 1890,
      efficiency: 94,
      vibration: 1.5,
      temperature: 52,
      predictions: {
        failureProbability: 8,
        estimatedFailureDate: '2025-06-15',
        recommendedAction: 'Monitor packing efficiency'
      }
    },
    {
      id: 'compressor-001',
      name: 'Gas Compressor',
      type: 'compressor',
      health: 68,
      status: 'warning',
      lastMaintenance: '2024-07-20',
      nextMaintenance: '2024-10-20',
      operatingHours: 3120,
      efficiency: 76,
      vibration: 4.2,
      temperature: 68,
      predictions: {
        failureProbability: 35,
        estimatedFailureDate: '2024-12-10',
        recommendedAction: 'Replace compression rings'
      }
    },
    {
      id: 'sensor-001',
      name: 'CH₄ Analyzer',
      type: 'sensor',
      health: 95,
      status: 'healthy',
      lastMaintenance: '2024-09-10',
      nextMaintenance: '2024-12-10',
      operatingHours: 8760,
      efficiency: 98,
      vibration: 0.1,
      temperature: 25,
      predictions: {
        failureProbability: 5,
        estimatedFailureDate: '2025-09-01',
        recommendedAction: 'Calibration check due'
      }
    },
    {
      id: 'valve-001',
      name: 'Main Control Valve',
      type: 'valve',
      health: 45,
      status: 'critical',
      lastMaintenance: '2024-06-01',
      nextMaintenance: '2024-09-01',
      operatingHours: 4200,
      efficiency: 62,
      vibration: 3.8,
      temperature: 55,
      predictions: {
        failureProbability: 78,
        estimatedFailureDate: '2024-10-05',
        recommendedAction: 'Immediate replacement required'
      }
    }
  ];

  const generateMockMaintenanceTasks = (): MaintenanceTask[] => [
    {
      id: 'task-001',
      equipment: 'Main Control Valve',
      type: 'emergency',
      priority: 'critical',
      description: 'Replace faulty control valve - gas flow irregularities detected',
      assignedTo: 'Rajesh Kumar',
      scheduledDate: '2024-09-17',
      estimatedDuration: 6,
      status: 'in_progress',
      progress: 45,
      spareParts: ['Valve Body', 'Actuator', 'Gaskets']
    },
    {
      id: 'task-002',
      equipment: 'Gas Compressor',
      type: 'preventive',
      priority: 'high',
      description: 'Compression ring replacement and bearing maintenance',
      assignedTo: 'Amit Sharma',
      scheduledDate: '2024-09-20',
      estimatedDuration: 8,
      status: 'scheduled',
      progress: 0,
      spareParts: ['Compression Rings', 'Bearings', 'Oil Filter']
    },
    {
      id: 'task-003',
      equipment: 'Primary Water Pump',
      type: 'preventive',
      priority: 'medium',
      description: 'Quarterly bearing lubrication and impeller inspection',
      assignedTo: 'Priya Patel',
      scheduledDate: '2024-09-25',
      estimatedDuration: 4,
      status: 'scheduled',
      progress: 0,
      spareParts: ['Bearing Grease', 'Seals']
    },
    {
      id: 'task-004',
      equipment: 'H₂S Scrubber Unit',
      type: 'corrective',
      priority: 'medium',
      description: 'Packing material replacement - efficiency below target',
      assignedTo: 'Suresh Gupta',
      scheduledDate: '2024-09-18',
      estimatedDuration: 5,
      status: 'overdue',
      progress: 0,
      spareParts: ['Structured Packing', 'Distribution Plates']
    }
  ];

  const generateMockSparePartsData = (): SparePart[] => [
    {
      id: 'part-001',
      name: 'Valve Body',
      category: 'Control Components',
      currentStock: 2,
      minStock: 1,
      maxStock: 5,
      unit: 'pcs',
      supplier: 'Industrial Valves Ltd',
      lastOrdered: '2024-08-15',
      cost: 15000
    },
    {
      id: 'part-002',
      name: 'Compression Rings',
      category: 'Compressor Parts',
      currentStock: 0,
      minStock: 2,
      maxStock: 8,
      unit: 'set',
      supplier: 'Compressor Solutions',
      lastOrdered: '2024-07-20',
      cost: 8500
    },
    {
      id: 'part-003',
      name: 'Structured Packing',
      category: 'Scrubber Components',
      currentStock: 5,
      minStock: 2,
      maxStock: 10,
      unit: 'm³',
      supplier: 'Mass Transfer Tech',
      lastOrdered: '2024-09-01',
      cost: 12000
    },
    {
      id: 'part-004',
      name: 'Bearing Grease',
      category: 'Maintenance Supplies',
      currentStock: 1,
      minStock: 3,
      maxStock: 12,
      unit: 'kg',
      supplier: 'Lubrication Systems',
      lastOrdered: '2024-08-10',
      cost: 850
    }
  ];

  useEffect(() => {
    if (wsData) {
      setEquipmentData(wsData.equipment || []);
      setMaintenanceTasks(wsData.tasks || []);
      setSparePartsData(wsData.spareParts || []);
    } else {
      // Use mock data when not connected
      setEquipmentData(generateMockEquipmentData());
      setMaintenanceTasks(generateMockMaintenanceTasks());
      setSparePartsData(generateMockSparePartsData());
    }
  }, [wsData]);

  // Check for critical maintenance alerts
  useEffect(() => {
    const criticalEquipment = equipmentData.filter(eq =>
      eq.status === 'critical' || eq.predictions.failureProbability > 70
    );

    criticalEquipment.forEach(equipment => {
      addAlert(
        `${equipment.name} requires immediate attention - ${equipment.predictions.recommendedAction}`,
        'critical',
        { system: 'maintenance', persistent: true }
      );
    });
  }, [equipmentData, addAlert]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'offline': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'bg-green-500';
    if (health >= 60) return 'bg-yellow-500';
    if (health >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const EquipmentOverview: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {equipmentData.map(equipment => (
        <Card
          key={equipment.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedEquipment === equipment.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setSelectedEquipment(equipment.id)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                {equipment.name}
              </span>
              <Badge variant={equipment.status === 'healthy' ? 'default' :
                equipment.status === 'warning' ? 'secondary' : 'destructive'}>
                {equipment.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Health Score</span>
                <span className={`text-lg font-bold ${getStatusColor(equipment.status)}`}>
                  {equipment.health}%
                </span>
              </div>
              <Progress value={equipment.health} className="h-2" />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Efficiency:</span>
                  <span className="ml-1 font-medium">{equipment.efficiency}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Hours:</span>
                  <span className="ml-1 font-medium">{equipment.operatingHours}h</span>
                </div>
                <div>
                  <span className="text-gray-500">Vibration:</span>
                  <span className="ml-1 font-medium">{equipment.vibration} mm/s</span>
                </div>
                <div>
                  <span className="text-gray-500">Temp:</span>
                  <span className="ml-1 font-medium">{equipment.temperature}°C</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-xs text-gray-600 mb-1">Failure Risk: {equipment.predictions.failureProbability}%</div>
                <Progress value={equipment.predictions.failureProbability} className="h-1" />
                <div className="text-xs text-gray-500 mt-1">
                  Next maintenance: {new Date(equipment.nextMaintenance).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const MaintenanceTasks: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Maintenance Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenanceTasks.map(task => (
            <div key={task.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant={getPriorityColor(task.priority)}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{task.type}</Badge>
                    <Badge variant={task.status === 'overdue' ? 'destructive' :
                      task.status === 'in_progress' ? 'secondary' : 'default'}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-medium">{task.description}</h4>
                  <div className="text-sm text-gray-600">
                    Equipment: {task.equipment} | Assigned to: {task.assignedTo}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-gray-600">Scheduled:</div>
                  <div className="font-medium">
                    {new Date(task.scheduledDate).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600 mt-1">Duration: {task.estimatedDuration}h</div>
                </div>
              </div>

              {task.status === 'in_progress' && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              )}

              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-1">Required Parts:</div>
                <div className="flex flex-wrap gap-1">
                  {task.spareParts.map(part => (
                    <Badge key={part} variant="outline" className="text-xs">
                      {part}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const SparePartsInventory: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Spare Parts Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {spareParts.map(part => {
            const stockPercentage = (part.currentStock / part.maxStock) * 100;
            const isLowStock = part.currentStock <= part.minStock;

            return (
              <div key={part.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{part.name}</h4>
                    <div className="text-sm text-gray-600">{part.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {part.currentStock} {part.unit}
                    </div>
                    <div className="text-sm text-gray-600">
                      Min: {part.minStock} | Max: {part.maxStock}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Stock Level</span>
                    <span className={isLowStock ? 'text-red-600 font-medium' : ''}>
                      {stockPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={stockPercentage}
                    className={`h-2 ${isLowStock ? '[&>div]:bg-red-500' : ''}`}
                  />

                  {isLowStock && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Low stock alert - Reorder from {part.supplier}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Supplier:</span>
                      <div className="font-medium">{part.supplier}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Unit Cost:</span>
                      <div className="font-medium">₹{part.cost.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const PredictiveAnalytics: React.FC = () => {
    const healthTrendData = equipmentData.map(eq => ({
      name: eq.name.split(' ')[0],
      health: eq.health,
      efficiency: eq.efficiency,
      risk: eq.predictions.failureProbability
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Predictive Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={healthTrendData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={0} domain={[0, 100]} />
              <Radar
                name="Health Score"
                dataKey="health"
                stroke="#4CAF50"
                fill="#4CAF50"
                fillOpacity={0.3}
              />
              <Radar
                name="Efficiency"
                dataKey="efficiency"
                stroke="#2196F3"
                fill="#2196F3"
                fillOpacity={0.3}
              />
              <Radar
                name="Failure Risk"
                dataKey="risk"
                stroke="#FF5722"
                fill="#FF5722"
                fillOpacity={0.3}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const EquipmentDetails: React.FC = () => {
    const selectedEq = equipmentData.find(eq => eq.id === selectedEquipment);
    if (!selectedEq) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              {selectedEq.name} - Detailed Analysis
            </span>
            <Badge variant={selectedEq.status === 'healthy' ? 'default' :
              selectedEq.status === 'warning' ? 'secondary' : 'destructive'}>
              {selectedEq.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Current Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Health Score</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{selectedEq.health}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Efficiency</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{selectedEq.efficiency}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Temperature</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{selectedEq.temperature}°C</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Vibration</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{selectedEq.vibration} mm/s</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Predictive Insights</h4>
              <Alert variant={selectedEq.predictions.failureProbability > 50 ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div><strong>Failure Probability:</strong> {selectedEq.predictions.failureProbability}%</div>
                    <div><strong>Estimated Failure Date:</strong> {new Date(selectedEq.predictions.estimatedFailureDate).toLocaleDateString()}</div>
                    <div><strong>Recommendation:</strong> {selectedEq.predictions.recommendedAction}</div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">Maintenance Schedule</div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Next Maintenance</span>
                  </div>
                  <div>{new Date(selectedEq.nextMaintenance).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Last maintenance: {new Date(selectedEq.lastMaintenance).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Maintenance Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Live Data" : "Demo Mode"}
          </Badge>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Equipment Overview</TabsTrigger>
          <TabsTrigger value="tasks">Maintenance Tasks</TabsTrigger>
          <TabsTrigger value="inventory">Spare Parts</TabsTrigger>
          <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <EquipmentOverview />
          {selectedEquipment && <EquipmentDetails />}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <MaintenanceTasks />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <SparePartsInventory />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PredictiveAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenancePage;