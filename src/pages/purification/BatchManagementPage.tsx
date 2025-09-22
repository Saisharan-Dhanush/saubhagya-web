import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useAlerts } from '../../contexts/AlertContext';
import {
  PackageCheck,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  FileText,
  Download,
  QrCode,
  Beaker,
  Factory,
  Users,
  Target,
  Award,
  Upload
} from 'lucide-react';

interface ProductionBatch {
  id: string;
  batchNumber: string;
  startDate: string;
  endDate?: string;
  status: 'planned' | 'in_progress' | 'quality_check' | 'completed' | 'failed';
  targetVolume: number; // m³
  currentVolume: number;
  gasQuality: {
    methaneContent: number;
    co2Content: number;
    h2sContent: number;
    moistureContent: number;
    calorificValue: number;
  };
  operator: string;
  shift: 'morning' | 'afternoon' | 'night';
  equipment: string[];
  qualityTests: QualityTest[];
  certificates: Certificate[];
  traceability: {
    rawMaterials: string[];
    processParameters: ProcessParameter[];
    qualityCheckpoints: string[];
  };
}

interface QualityTest {
  id: string;
  testType: 'bis_compliance' | 'peso_safety' | 'calorific_value' | 'composition';
  timestamp: string;
  result: 'pass' | 'fail' | 'pending';
  values: Record<string, number>;
  operator: string;
  notes?: string;
}

interface Certificate {
  id: string;
  type: 'bis_16087' | 'peso_approval' | 'quality_certificate';
  issuedDate: string;
  validUntil: string;
  certificateNumber: string;
  status: 'valid' | 'expired' | 'pending';
  downloadUrl?: string;
}

interface ProcessParameter {
  timestamp: string;
  pressure: number;
  temperature: number;
  flowRate: number;
  scrubberEfficiency: number;
}

interface ProductionSchedule {
  id: string;
  batchNumber: string;
  plannedStartDate: string;
  plannedEndDate: string;
  targetVolume: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'delayed' | 'in_progress' | 'completed';
  assignedOperator: string;
  equipmentRequired: string[];
  notes?: string;
}

const BatchManagementPage: React.FC = () => {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [schedule, setSchedule] = useState<ProductionSchedule[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [newBatchForm, setNewBatchForm] = useState(false);
  const { wsData, isConnected } = useWebSocket('/purification/batch');
  const { addAlert } = useAlerts();

  // Mock data generation
  const generateMockBatches = (): ProductionBatch[] => [
    {
      id: 'batch-001',
      batchNumber: 'PUR-2024-09-001',
      startDate: '2024-09-16T06:00:00Z',
      endDate: '2024-09-16T14:00:00Z',
      status: 'completed',
      targetVolume: 1000,
      currentVolume: 985,
      gasQuality: {
        methaneContent: 94.2,
        co2Content: 4.8,
        h2sContent: 3.2,
        moistureContent: 0.08,
        calorificValue: 8750
      },
      operator: 'Rajesh Kumar',
      shift: 'morning',
      equipment: ['Primary Scrubber', 'Gas Compressor', 'Quality Analyzer'],
      qualityTests: [
        {
          id: 'test-001',
          testType: 'bis_compliance',
          timestamp: '2024-09-16T10:00:00Z',
          result: 'pass',
          values: { methane: 94.2, h2s: 3.2, moisture: 0.08 },
          operator: 'Lab Technician A'
        }
      ],
      certificates: [
        {
          id: 'cert-001',
          type: 'bis_16087',
          issuedDate: '2024-09-16',
          validUntil: '2024-12-16',
          certificateNumber: 'BIS-PUR-001-2024',
          status: 'valid'
        }
      ],
      traceability: {
        rawMaterials: ['Biogas Input Stream A', 'Process Water Batch 1'],
        processParameters: [
          { timestamp: '2024-09-16T06:00:00Z', pressure: 1.8, temperature: 45, flowRate: 850, scrubberEfficiency: 94 },
          { timestamp: '2024-09-16T10:00:00Z', pressure: 1.9, temperature: 48, flowRate: 880, scrubberEfficiency: 96 },
          { timestamp: '2024-09-16T14:00:00Z', pressure: 1.7, temperature: 44, flowRate: 820, scrubberEfficiency: 95 }
        ],
        qualityCheckpoints: ['Initial Quality Check', 'Mid-process Validation', 'Final Certification']
      }
    },
    {
      id: 'batch-002',
      batchNumber: 'PUR-2024-09-002',
      startDate: '2024-09-16T14:00:00Z',
      status: 'in_progress',
      targetVolume: 1200,
      currentVolume: 650,
      gasQuality: {
        methaneContent: 92.8,
        co2Content: 5.2,
        h2sContent: 4.1,
        moistureContent: 0.12,
        calorificValue: 8620
      },
      operator: 'Priya Patel',
      shift: 'afternoon',
      equipment: ['Primary Scrubber', 'Gas Compressor', 'Quality Analyzer'],
      qualityTests: [
        {
          id: 'test-002',
          testType: 'composition',
          timestamp: '2024-09-16T16:00:00Z',
          result: 'pending',
          values: { methane: 92.8, co2: 5.2, h2s: 4.1 },
          operator: 'Lab Technician B'
        }
      ],
      certificates: [],
      traceability: {
        rawMaterials: ['Biogas Input Stream B', 'Process Water Batch 2'],
        processParameters: [
          { timestamp: '2024-09-16T14:00:00Z', pressure: 1.9, temperature: 46, flowRate: 900, scrubberEfficiency: 92 },
          { timestamp: '2024-09-16T16:00:00Z', pressure: 2.0, temperature: 49, flowRate: 920, scrubberEfficiency: 94 }
        ],
        qualityCheckpoints: ['Initial Quality Check', 'Mid-process Validation']
      }
    },
    {
      id: 'batch-003',
      batchNumber: 'PUR-2024-09-003',
      startDate: '2024-09-16T22:00:00Z',
      status: 'quality_check',
      targetVolume: 800,
      currentVolume: 800,
      gasQuality: {
        methaneContent: 91.5,
        co2Content: 6.1,
        h2sContent: 8.2,
        moistureContent: 0.15,
        calorificValue: 8450
      },
      operator: 'Suresh Gupta',
      shift: 'night',
      equipment: ['Primary Scrubber', 'Gas Compressor', 'Quality Analyzer'],
      qualityTests: [
        {
          id: 'test-003',
          testType: 'bis_compliance',
          timestamp: '2024-09-17T02:00:00Z',
          result: 'fail',
          values: { methane: 91.5, h2s: 8.2, moisture: 0.15 },
          operator: 'Lab Technician C',
          notes: 'H2S content exceeds BIS limits - requires additional scrubbing'
        }
      ],
      certificates: [],
      traceability: {
        rawMaterials: ['Biogas Input Stream C', 'Process Water Batch 3'],
        processParameters: [
          { timestamp: '2024-09-16T22:00:00Z', pressure: 1.8, temperature: 43, flowRate: 780, scrubberEfficiency: 88 },
          { timestamp: '2024-09-17T02:00:00Z', pressure: 1.9, temperature: 45, flowRate: 800, scrubberEfficiency: 90 }
        ],
        qualityCheckpoints: ['Initial Quality Check', 'Final Quality Assessment']
      }
    }
  ];

  const generateMockSchedule = (): ProductionSchedule[] => [
    {
      id: 'sched-001',
      batchNumber: 'PUR-2024-09-004',
      plannedStartDate: '2024-09-17T06:00:00Z',
      plannedEndDate: '2024-09-17T14:00:00Z',
      targetVolume: 1100,
      priority: 'high',
      status: 'scheduled',
      assignedOperator: 'Amit Sharma',
      equipmentRequired: ['Primary Scrubber', 'Gas Compressor', 'Quality Analyzer'],
      notes: 'Priority batch for morning delivery'
    },
    {
      id: 'sched-002',
      batchNumber: 'PUR-2024-09-005',
      plannedStartDate: '2024-09-17T14:00:00Z',
      plannedEndDate: '2024-09-17T22:00:00Z',
      targetVolume: 900,
      priority: 'medium',
      status: 'scheduled',
      assignedOperator: 'Priya Patel',
      equipmentRequired: ['Primary Scrubber', 'Secondary Compressor'],
      notes: 'Standard production batch'
    },
    {
      id: 'sched-003',
      batchNumber: 'PUR-2024-09-006',
      plannedStartDate: '2024-09-17T22:00:00Z',
      plannedEndDate: '2024-09-18T06:00:00Z',
      targetVolume: 1000,
      priority: 'urgent',
      status: 'delayed',
      assignedOperator: 'Rajesh Kumar',
      equipmentRequired: ['Primary Scrubber', 'Gas Compressor', 'Quality Analyzer'],
      notes: 'Delayed due to equipment maintenance'
    }
  ];

  useEffect(() => {
    if (wsData) {
      setBatches(wsData.batches || []);
      setSchedule(wsData.schedule || []);
    } else {
      setBatches(generateMockBatches());
      setSchedule(generateMockSchedule());
    }
  }, [wsData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'quality_check': return 'outline';
      case 'failed': return 'destructive';
      case 'planned': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const BatchOverview: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {batches.map(batch => {
        const progress = batch.targetVolume > 0 ? (batch.currentVolume / batch.targetVolume) * 100 : 0;
        const isQualityPass = batch.qualityTests.every(test => test.result === 'pass');

        return (
          <Card
            key={batch.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedBatch === batch.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedBatch(batch.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center">
                  <PackageCheck className="h-4 w-4 mr-2" />
                  {batch.batchNumber}
                </span>
                <Badge variant={getStatusColor(batch.status)}>
                  {batch.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-lg font-bold">
                    {batch.currentVolume}/{batch.targetVolume} m³
                  </span>
                </div>
                <Progress value={progress} className="h-2" />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Operator:</span>
                    <div className="font-medium">{batch.operator}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Shift:</span>
                    <div className="font-medium capitalize">{batch.shift}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">CH₄:</span>
                    <div className="font-medium">{batch.gasQuality.methaneContent.toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Quality:</span>
                    <div className={`font-medium ${isQualityPass ? 'text-green-600' : 'text-red-600'}`}>
                      {isQualityPass ? 'Pass' : 'Fail'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-600 mb-1">
                    Started: {new Date(batch.startDate).toLocaleString()}
                  </div>
                  {batch.endDate && (
                    <div className="text-xs text-gray-600">
                      Completed: {new Date(batch.endDate).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const ProductionScheduleView: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Production Schedule
          </span>
          <Button onClick={() => setNewBatchForm(true)}>
            <Play className="h-4 w-4 mr-2" />
            Schedule Batch
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map(item => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{item.batchNumber}</h4>
                    <Badge variant={getPriorityColor(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Badge>
                    <Badge variant={item.status === 'delayed' ? 'destructive' :
                      item.status === 'in_progress' ? 'secondary' : 'default'}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Operator: {item.assignedOperator} | Target: {item.targetVolume} m³
                  </div>
                  {item.notes && (
                    <div className="text-sm text-blue-600 mt-1">{item.notes}</div>
                  )}
                </div>
                <div className="text-right text-sm">
                  <div className="text-gray-600">Planned Start:</div>
                  <div className="font-medium">
                    {new Date(item.plannedStartDate).toLocaleString()}
                  </div>
                  <div className="text-gray-600 mt-1">Duration:</div>
                  <div className="font-medium">
                    {Math.round((new Date(item.plannedEndDate).getTime() - new Date(item.plannedStartDate).getTime()) / (1000 * 60 * 60))}h
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-1">Required Equipment:</div>
                <div className="flex flex-wrap gap-1">
                  {item.equipmentRequired.map(equipment => (
                    <Badge key={equipment} variant="outline" className="text-xs">
                      {equipment}
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

  const QualityTracking: React.FC = () => {
    const qualityTrend = batches.map(batch => ({
      batch: batch.batchNumber.split('-').pop(),
      methane: batch.gasQuality.methaneContent,
      h2s: batch.gasQuality.h2sContent,
      calorific: batch.gasQuality.calorificValue / 100, // Scale for chart
      status: batch.status
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Beaker className="h-5 w-5 mr-2" />
            Quality Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="batch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="methane"
                stroke="#4CAF50"
                name="Methane (%)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="h2s"
                stroke="#FF5722"
                name="H₂S (ppm)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="calorific"
                stroke="#2196F3"
                name="Calorific Value (x100 kcal/m³)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const BatchDetails: React.FC = () => {
    const selectedBatchData = batches.find(batch => batch.id === selectedBatch);
    if (!selectedBatchData) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {selectedBatchData.batchNumber} - Detailed View
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quality" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="quality">Quality Data</TabsTrigger>
                <TabsTrigger value="process">Process Parameters</TabsTrigger>
                <TabsTrigger value="tests">Quality Tests</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
              </TabsList>

              <TabsContent value="quality" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">Methane Content</div>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedBatchData.gasQuality.methaneContent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Target: ≥90%</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">CO₂ Content</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedBatchData.gasQuality.co2Content.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Typical: 4-6%</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-sm text-gray-600">H₂S Content</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedBatchData.gasQuality.h2sContent.toFixed(1)} ppm
                    </div>
                    <div className="text-xs text-gray-500">Limit: ≤10 ppm</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600">Moisture</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedBatchData.gasQuality.moistureContent.toFixed(3)}%
                    </div>
                    <div className="text-xs text-gray-500">Limit: ≤0.1%</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600">Calorific Value</div>
                    <div className="text-2xl font-bold text-red-600">
                      {selectedBatchData.gasQuality.calorificValue} kcal/m³
                    </div>
                    <div className="text-xs text-gray-500">Min: 8500 kcal/m³</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="process" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={selectedBatchData.traceability.processParameters}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip labelFormatter={(time) => new Date(time).toLocaleString()} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="pressure"
                      stackId="1"
                      stroke="#4CAF50"
                      fill="#4CAF50"
                      fillOpacity={0.6}
                      name="Pressure (bar)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="temperature"
                      stackId="2"
                      stroke="#FF9800"
                      fill="#FF9800"
                      fillOpacity={0.6}
                      name="Temperature (°C)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="scrubberEfficiency"
                      stackId="3"
                      stroke="#2196F3"
                      fill="#2196F3"
                      fillOpacity={0.6}
                      name="Efficiency (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="tests" className="space-y-4">
                {selectedBatchData.qualityTests.map(test => (
                  <div key={test.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium capitalize">{test.testType.replace('_', ' ')}</h4>
                        <div className="text-sm text-gray-600">
                          Operator: {test.operator} | {new Date(test.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={test.result === 'pass' ? 'default' :
                        test.result === 'fail' ? 'destructive' : 'secondary'}>
                        {test.result.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {Object.entries(test.values).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="ml-1 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    {test.notes && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                        <strong>Notes:</strong> {test.notes}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="certificates" className="space-y-4">
                {selectedBatchData.certificates.length > 0 ? (
                  selectedBatchData.certificates.map(cert => (
                    <div key={cert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{cert.type.replace('_', ' ').toUpperCase()}</h4>
                          <div className="text-sm text-gray-600">
                            Certificate No: {cert.certificateNumber}
                          </div>
                        </div>
                        <Badge variant={cert.status === 'valid' ? 'default' :
                          cert.status === 'expired' ? 'destructive' : 'secondary'}>
                          {cert.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Issued:</span>
                          <div className="font-medium">{new Date(cert.issuedDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Valid Until:</span>
                          <div className="font-medium">{new Date(cert.validUntil).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  ))
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No certificates available for this batch. Complete quality tests to generate certificates.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  const ProductionStats: React.FC = () => {
    const completedBatches = batches.filter(b => b.status === 'completed');
    const totalVolume = completedBatches.reduce((sum, b) => sum + b.currentVolume, 0);
    const avgQuality = completedBatches.reduce((sum, b) => sum + b.gasQuality.methaneContent, 0) / completedBatches.length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Factory className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Total Batches</div>
                <div className="text-2xl font-bold">{batches.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Volume Produced</div>
                <div className="text-2xl font-bold">{totalVolume.toLocaleString()} m³</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Avg Quality</div>
                <div className="text-2xl font-bold">{avgQuality.toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">Success Rate</div>
                <div className="text-2xl font-bold">
                  {((completedBatches.length / batches.length) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Batch Management</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Live Data" : "Demo Mode"}
          </Badge>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </div>
      </div>

      <ProductionStats />

      <Tabs defaultValue="batches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="batches">Active Batches</TabsTrigger>
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="quality">Quality Tracking</TabsTrigger>
          <TabsTrigger value="details">Batch Details</TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="space-y-6">
          <BatchOverview />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <ProductionScheduleView />
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <QualityTracking />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedBatch ? (
            <BatchDetails />
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Select a batch from the Active Batches tab to view detailed information.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchManagementPage;