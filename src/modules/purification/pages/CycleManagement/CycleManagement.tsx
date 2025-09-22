/**
 * Cycle Management Page - SAUB-FE-003
 * Complete purification cycle management with timer, readings, and history
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  Pause,
  Square,
  Clock,
  Gauge,
  Activity,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Timer,
  FlaskConical,
  Thermometer,
  Wind
} from 'lucide-react';
import { PurificationCycle, PurificationMetrics } from '../../Purification.types';
import { CYCLE_DURATIONS, PURIFICATION_STAGES, QUALITY_GRADES } from '../../Purification.config';

interface CycleFormData {
  targetCH4: number;
  sourceBatches: string[];
  estimatedDuration: number;
  operatorNotes: string;
  priority: 'normal' | 'high' | 'urgent';
}

export const CycleManagement: React.FC = () => {
  const [activeCycles, setActiveCycles] = useState<PurificationCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<PurificationCycle | null>(null);
  const [currentReading, setCurrentReading] = useState<Partial<PurificationMetrics>>({
    ch4Percentage: 0,
    pressure: 0,
    temperature: 0,
    h2sLevel: 0
  });
  const [newCycleForm, setNewCycleForm] = useState<CycleFormData>({
    targetCH4: 95,
    sourceBatches: [],
    estimatedDuration: CYCLE_DURATIONS.standard,
    operatorNotes: '',
    priority: 'normal'
  });
  const [cycleHistory, setCycleHistory] = useState<PurificationCycle[]>([]);

  // Mock active cycles
  useEffect(() => {
    const mockActiveCycles: PurificationCycle[] = [
      {
        id: 'cycle-001',
        batchId: 'BATCH-2024-001',
        startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        duration: 60,
        status: 'running',
        preCH4Reading: 88.5,
        targetCH4: 95,
        sourceUnits: ['unit-1', 'unit-2'],
        operatorId: 'OP001',
        qualityGrade: 'B',
        pesoCompliant: true,
        notes: 'Standard purification cycle'
      },
      {
        id: 'cycle-002',
        batchId: 'BATCH-2024-002',
        startTime: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
        duration: 90,
        status: 'running',
        preCH4Reading: 90.2,
        targetCH4: 96,
        sourceUnits: ['unit-3'],
        operatorId: 'OP002',
        qualityGrade: 'A',
        pesoCompliant: true,
        notes: 'Extended cycle for premium grade'
      },
      {
        id: 'cycle-003',
        batchId: 'BATCH-2024-003',
        startTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        duration: 45,
        status: 'paused',
        preCH4Reading: 87.1,
        targetCH4: 92,
        sourceUnits: ['unit-2'],
        operatorId: 'OP001',
        qualityGrade: 'B',
        pesoCompliant: false,
        notes: 'Rapid cycle - paused for maintenance'
      }
    ];

    const mockHistory: PurificationCycle[] = [
      {
        id: 'cycle-h001',
        batchId: 'BATCH-2024-H001',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        duration: 60,
        status: 'completed',
        preCH4Reading: 89.5,
        postCH4Reading: 95.8,
        targetCH4: 95,
        sourceUnits: ['unit-1'],
        outputVolume: 1250,
        efficiency: 94.2,
        operatorId: 'OP003',
        qualityGrade: 'A',
        pesoCompliant: true,
        notes: 'Excellent results achieved'
      },
      {
        id: 'cycle-h002',
        batchId: 'BATCH-2024-H002',
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
        duration: 45,
        status: 'failed',
        preCH4Reading: 85.2,
        postCH4Reading: 88.1,
        targetCH4: 95,
        sourceUnits: ['unit-2'],
        efficiency: 68.5,
        operatorId: 'OP001',
        qualityGrade: 'FAILED',
        pesoCompliant: false,
        notes: 'Equipment malfunction detected'
      }
    ];

    setActiveCycles(mockActiveCycles);
    setCycleHistory(mockHistory);
    setSelectedCycle(mockActiveCycles[0]);
  }, []);

  const formatDuration = (startTime: Date, durationMinutes: number) => {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / (1000 * 60));
    const remaining = Math.max(0, durationMinutes - elapsed);
    const progress = Math.min(100, (elapsed / durationMinutes) * 100);

    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;

    return {
      elapsed,
      remaining,
      progress,
      display: `${hours}h ${minutes}m remaining`
    };
  };

  const getCurrentStage = (progress: number) => {
    let cumulativeTime = 0;
    for (const stage of PURIFICATION_STAGES) {
      cumulativeTime += stage.duration;
      if (progress <= (cumulativeTime / 60) * 100) {
        return stage;
      }
    }
    return PURIFICATION_STAGES[PURIFICATION_STAGES.length - 1];
  };

  const handleStartCycle = () => {
    const newCycle: PurificationCycle = {
      id: `cycle-${Date.now()}`,
      batchId: `BATCH-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      startTime: new Date(),
      duration: newCycleForm.estimatedDuration,
      status: 'running',
      preCH4Reading: currentReading.ch4Percentage || 0,
      targetCH4: newCycleForm.targetCH4,
      sourceUnits: ['unit-1'], // Default assignment
      operatorId: 'CURRENT_USER',
      qualityGrade: 'B',
      pesoCompliant: true,
      notes: newCycleForm.operatorNotes
    };

    setActiveCycles(prev => [...prev, newCycle]);
    setSelectedCycle(newCycle);

    // Reset form
    setNewCycleForm({
      targetCH4: 95,
      sourceBatches: [],
      estimatedDuration: CYCLE_DURATIONS.standard,
      operatorNotes: '',
      priority: 'normal'
    });
  };

  const handleCycleAction = (cycleId: string, action: 'pause' | 'resume' | 'stop') => {
    setActiveCycles(prev => prev.map(cycle => {
      if (cycle.id === cycleId) {
        switch (action) {
          case 'pause':
            return { ...cycle, status: 'paused' as const };
          case 'resume':
            return { ...cycle, status: 'running' as const };
          case 'stop':
            return { ...cycle, status: 'completed' as const, endTime: new Date() };
          default:
            return cycle;
        }
      }
      return cycle;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cycle Management</h1>
          <p className="text-gray-600 mt-1">Monitor and control purification cycles</p>
        </div>
        <Button onClick={() => setSelectedCycle(null)} className="bg-blue-600 hover:bg-blue-700">
          <Play className="w-4 h-4 mr-2" />
          New Cycle
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Cycles ({activeCycles.length})</TabsTrigger>
          <TabsTrigger value="new">Start New Cycle</TabsTrigger>
          <TabsTrigger value="history">Cycle History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeCycles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Cycles</h3>
                <p className="text-gray-500 text-center mb-4">
                  Start a new purification cycle to begin processing biogas batches
                </p>
                <Button onClick={() => setSelectedCycle(null)} variant="outline">
                  Start New Cycle
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Cycles List */}
              <div className="space-y-4">
                {activeCycles.map((cycle) => {
                  const timing = formatDuration(cycle.startTime, cycle.duration);
                  const currentStage = getCurrentStage(timing.progress);

                  return (
                    <Card key={cycle.id} className={`cursor-pointer transition-shadow ${
                      selectedCycle?.id === cycle.id ? 'ring-2 ring-blue-500' : ''
                    }`} onClick={() => setSelectedCycle(cycle)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{cycle.batchId}</CardTitle>
                            <CardDescription>Target: {cycle.targetCH4}% CH₄</CardDescription>
                          </div>
                          <Badge className={getStatusColor(cycle.status)}>
                            {cycle.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{timing.progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={timing.progress} className="h-2" />
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Current: {currentStage.name}</span>
                            <span>{timing.display}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Pre-CH₄:</span>
                            <span className="ml-1 font-medium">{cycle.preCH4Reading}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Units:</span>
                            <span className="ml-1 font-medium">{cycle.sourceUnits.join(', ')}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Started {cycle.startTime.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            {cycle.status === 'running' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCycleAction(cycle.id, 'pause');
                                }}
                              >
                                <Pause className="w-3 h-3" />
                              </Button>
                            )}
                            {cycle.status === 'paused' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCycleAction(cycle.id, 'resume');
                                }}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCycleAction(cycle.id, 'stop');
                              }}
                            >
                              <Square className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Selected Cycle Details */}
              {selectedCycle && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Timer className="w-5 h-5 mr-2 text-blue-600" />
                      Cycle Details: {selectedCycle.batchId}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Live Readings */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Live Readings
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-700">CH₄ Level</span>
                            <Gauge className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-green-900">
                            {(selectedCycle.preCH4Reading + Math.random() * 2).toFixed(1)}%
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700">Pressure</span>
                            <Wind className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold text-blue-900">
                            {(2.1 + Math.random() * 0.2).toFixed(2)} bar
                          </div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-orange-700">Temperature</span>
                            <Thermometer className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="text-2xl font-bold text-orange-900">
                            {(37 + Math.random() * 2).toFixed(1)}°C
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-purple-700">H₂S Level</span>
                            <FlaskConical className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="text-2xl font-bold text-purple-900">
                            {(12 + Math.random() * 3).toFixed(1)} ppm
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Cycle Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Cycle Information</h4>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Target CH₄:</span>
                          <span className="font-medium">{selectedCycle.targetCH4}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Source Units:</span>
                          <span className="font-medium">{selectedCycle.sourceUnits.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Operator:</span>
                          <span className="font-medium">{selectedCycle.operatorId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PESO Compliant:</span>
                          <Badge className={selectedCycle.pesoCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {selectedCycle.pesoCompliant ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {selectedCycle.notes && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Notes</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            {selectedCycle.notes}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2 text-green-600" />
                Start New Purification Cycle
              </CardTitle>
              <CardDescription>
                Configure parameters for a new biogas purification cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pre-Treatment Readings */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <Gauge className="w-4 h-4 mr-2" />
                    Pre-Treatment Readings
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="preCH4">Current CH₄ Percentage</Label>
                      <Input
                        id="preCH4"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={currentReading.ch4Percentage || ''}
                        onChange={(e) => setCurrentReading(prev => ({
                          ...prev,
                          ch4Percentage: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="Enter current CH₄ %"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prePressure">Pressure (bar)</Label>
                      <Input
                        id="prePressure"
                        type="number"
                        step="0.1"
                        min="0"
                        value={currentReading.pressure || ''}
                        onChange={(e) => setCurrentReading(prev => ({
                          ...prev,
                          pressure: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="Enter pressure"
                      />
                    </div>
                    <div>
                      <Label htmlFor="preTemp">Temperature (°C)</Label>
                      <Input
                        id="preTemp"
                        type="number"
                        step="0.1"
                        value={currentReading.temperature || ''}
                        onChange={(e) => setCurrentReading(prev => ({
                          ...prev,
                          temperature: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="Enter temperature"
                      />
                    </div>
                    <div>
                      <Label htmlFor="preH2S">H₂S Level (ppm)</Label>
                      <Input
                        id="preH2S"
                        type="number"
                        step="0.1"
                        min="0"
                        value={currentReading.h2sLevel || ''}
                        onChange={(e) => setCurrentReading(prev => ({
                          ...prev,
                          h2sLevel: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="Enter H₂S level"
                      />
                    </div>
                  </div>
                </div>

                {/* Cycle Configuration */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Cycle Configuration
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="targetCH4">Target CH₄ Percentage</Label>
                      <Input
                        id="targetCH4"
                        type="number"
                        step="0.1"
                        min="90"
                        max="98"
                        value={newCycleForm.targetCH4}
                        onChange={(e) => setNewCycleForm(prev => ({
                          ...prev,
                          targetCH4: parseFloat(e.target.value) || 95
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                      <select
                        id="duration"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newCycleForm.estimatedDuration}
                        onChange={(e) => setNewCycleForm(prev => ({
                          ...prev,
                          estimatedDuration: parseInt(e.target.value)
                        }))}
                      >
                        <option value={CYCLE_DURATIONS.rapid}>Rapid (45 min)</option>
                        <option value={CYCLE_DURATIONS.standard}>Standard (60 min)</option>
                        <option value={CYCLE_DURATIONS.extended}>Extended (90 min)</option>
                        <option value={CYCLE_DURATIONS.deep_clean}>Deep Clean (120 min)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority Level</Label>
                      <select
                        id="priority"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newCycleForm.priority}
                        onChange={(e) => setNewCycleForm(prev => ({
                          ...prev,
                          priority: e.target.value as 'normal' | 'high' | 'urgent'
                        }))}
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Operator Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any specific instructions or observations..."
                  value={newCycleForm.operatorNotes}
                  onChange={(e) => setNewCycleForm(prev => ({
                    ...prev,
                    operatorNotes: e.target.value
                  }))}
                  rows={3}
                />
              </div>

              {/* Validation and Start */}
              <div className="space-y-4">
                {(!currentReading.ch4Percentage || !currentReading.pressure) && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please enter pre-treatment readings before starting the cycle.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleStartCycle}
                    disabled={!currentReading.ch4Percentage || !currentReading.pressure}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Cycle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Cycle History
              </CardTitle>
              <CardDescription>
                View completed and failed purification cycles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cycleHistory.map((cycle) => (
                  <div key={cycle.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{cycle.batchId}</h4>
                        <p className="text-sm text-gray-600">
                          {cycle.startTime.toLocaleDateString()} at {cycle.startTime.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(cycle.status)}>
                          {cycle.status}
                        </Badge>
                        <Badge className={`bg-${QUALITY_GRADES[cycle.qualityGrade]?.color}-100 text-${QUALITY_GRADES[cycle.qualityGrade]?.color}-800`}>
                          Grade {cycle.qualityGrade}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Pre-CH₄:</span>
                        <span className="ml-1 font-medium">{cycle.preCH4Reading}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Post-CH₄:</span>
                        <span className="ml-1 font-medium">{cycle.postCH4Reading || 'N/A'}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Output:</span>
                        <span className="ml-1 font-medium">{cycle.outputVolume || 'N/A'} L</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Efficiency:</span>
                        <span className="ml-1 font-medium">{cycle.efficiency || 'N/A'}%</span>
                      </div>
                    </div>

                    {cycle.notes && (
                      <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-2 rounded">
                        {cycle.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};