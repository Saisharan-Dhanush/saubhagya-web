/**
 * Maintenance Management Page - SAUB-FE-003
 * Equipment maintenance scheduling, tracking, and parts management
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
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  User,
  DollarSign,
  TrendingUp,
  Settings,
  History,
  Plus,
  Edit,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { MaintenanceSchedule, MaintenancePart } from '../../Purification.types';
import { EQUIPMENT_TYPES } from '../../Purification.config';

interface MaintenanceFormData {
  equipmentId: string;
  equipmentName: string;
  maintenanceType: 'routine' | 'predictive' | 'emergency' | 'overhaul';
  scheduledDate: Date;
  estimatedDuration: number;
  technician: string;
  workDescription: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  parts: MaintenancePart[];
  notes?: string;
}

export const MaintenanceManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [parts, setParts] = useState<MaintenancePart[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<MaintenanceSchedule | null>(null);
  const [newMaintenanceForm, setNewMaintenanceForm] = useState<MaintenanceFormData>({
    equipmentId: '',
    equipmentName: '',
    maintenanceType: 'routine',
    scheduledDate: new Date(),
    estimatedDuration: 2,
    technician: '',
    workDescription: '',
    priority: 'medium',
    parts: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  useEffect(() => {
    const mockSchedules: MaintenanceSchedule[] = [
      {
        id: 'maint-001',
        equipmentId: 'unit-1-scrubber',
        equipmentName: 'Primary Scrubber Unit 1',
        maintenanceType: 'routine',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
        status: 'scheduled',
        estimatedDuration: 4,
        technician: 'TECH001',
        workDescription: 'Replace filter cartridges and check valve seals',
        priority: 'medium',
        parts: [
          {
            id: 'part-001',
            name: 'Filter Cartridge Set',
            partNumber: 'FC-101-A',
            quantity: 4,
            unitCost: 850,
            supplier: 'ShuddhiTech Supplies',
            inStock: 8,
            minStock: 2
          }
        ]
      },
      {
        id: 'maint-002',
        equipmentId: 'unit-2-compressor',
        equipmentName: 'Compressor Unit 2',
        maintenanceType: 'emergency',
        scheduledDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // In 4 hours
        status: 'scheduled',
        estimatedDuration: 6,
        technician: 'TECH002',
        workDescription: 'Emergency repair - bearing replacement due to unusual noise',
        priority: 'critical',
        parts: [
          {
            id: 'part-002',
            name: 'Compressor Bearing Set',
            partNumber: 'CB-205-B',
            quantity: 2,
            unitCost: 1200,
            supplier: 'Industrial Bearings Ltd',
            inStock: 1,
            minStock: 2
          }
        ]
      },
      {
        id: 'maint-003',
        equipmentId: 'unit-3-sensors',
        equipmentName: 'Sensor Array Unit 3',
        maintenanceType: 'predictive',
        scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completedDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        status: 'completed',
        estimatedDuration: 3,
        actualDuration: 2.5,
        technician: 'TECH003',
        workDescription: 'Calibrate temperature and pressure sensors',
        priority: 'low',
        cost: 450,
        parts: []
      },
      {
        id: 'maint-004',
        equipmentId: 'unit-1-valves',
        equipmentName: 'Valve System Unit 1',
        maintenanceType: 'routine',
        scheduledDate: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        status: 'overdue',
        estimatedDuration: 2,
        technician: 'TECH001',
        workDescription: 'Inspect and lubricate control valves',
        priority: 'high',
        parts: [
          {
            id: 'part-003',
            name: 'Valve Lubricant',
            partNumber: 'VL-301',
            quantity: 2,
            unitCost: 120,
            supplier: 'Valve Solutions Inc',
            inStock: 5,
            minStock: 3
          }
        ]
      }
    ];

    const mockParts: MaintenancePart[] = [
      {
        id: 'part-001',
        name: 'Filter Cartridge Set',
        partNumber: 'FC-101-A',
        quantity: 8,
        unitCost: 850,
        supplier: 'ShuddhiTech Supplies',
        inStock: 8,
        minStock: 2
      },
      {
        id: 'part-002',
        name: 'Compressor Bearing Set',
        partNumber: 'CB-205-B',
        quantity: 1,
        unitCost: 1200,
        supplier: 'Industrial Bearings Ltd',
        inStock: 1,
        minStock: 2,
        lastOrdered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'part-004',
        name: 'Pressure Sensor',
        partNumber: 'PS-402',
        quantity: 6,
        unitCost: 380,
        supplier: 'Sensor Tech Co',
        inStock: 6,
        minStock: 4
      },
      {
        id: 'part-005',
        name: 'Temperature Probe',
        partNumber: 'TP-501',
        quantity: 4,
        unitCost: 290,
        supplier: 'Sensor Tech Co',
        inStock: 2,
        minStock: 4
      }
    ];

    setSchedules(mockSchedules);
    setParts(mockParts);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'overhaul': return 'bg-purple-100 text-purple-800';
      case 'predictive': return 'bg-blue-100 text-blue-800';
      case 'routine': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days > 0) return `In ${days} days`;
    return `${Math.abs(days)} days ago`;
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.workDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getMaintenanceStats = () => {
    const total = schedules.length;
    const scheduled = schedules.filter(s => s.status === 'scheduled').length;
    const overdue = schedules.filter(s => s.status === 'overdue').length;
    const completed = schedules.filter(s => s.status === 'completed').length;
    const inProgress = schedules.filter(s => s.status === 'in_progress').length;

    return { total, scheduled, overdue, completed, inProgress };
  };

  const getLowStockParts = () => {
    return parts.filter(part => part.inStock <= part.minStock);
  };

  const stats = getMaintenanceStats();
  const lowStockParts = getLowStockParts();

  const handleScheduleMaintenance = () => {
    const newSchedule: MaintenanceSchedule = {
      id: `maint-${Date.now()}`,
      equipmentId: newMaintenanceForm.equipmentId,
      equipmentName: newMaintenanceForm.equipmentName,
      maintenanceType: newMaintenanceForm.maintenanceType,
      scheduledDate: newMaintenanceForm.scheduledDate,
      status: 'scheduled',
      estimatedDuration: newMaintenanceForm.estimatedDuration,
      technician: newMaintenanceForm.technician,
      workDescription: newMaintenanceForm.workDescription,
      priority: newMaintenanceForm.priority,
      parts: newMaintenanceForm.parts,
      notes: newMaintenanceForm.notes
    };

    setSchedules(prev => [newSchedule, ...prev]);

    // Reset form
    setNewMaintenanceForm({
      equipmentId: '',
      equipmentName: '',
      maintenanceType: 'routine',
      scheduledDate: new Date(),
      estimatedDuration: 2,
      technician: '',
      workDescription: '',
      priority: 'medium',
      parts: []
    });
  };

  const handleStatusUpdate = (scheduleId: string, newStatus: MaintenanceSchedule['status']) => {
    setSchedules(prev => prev.map(schedule => {
      if (schedule.id === scheduleId) {
        const updated = { ...schedule, status: newStatus };
        if (newStatus === 'completed' && !schedule.completedDate) {
          updated.completedDate = new Date();
        }
        if (newStatus === 'in_progress' && !schedule.actualDuration) {
          // Start tracking actual duration
        }
        return updated;
      }
      return schedule;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="text-gray-600 mt-1">Equipment maintenance scheduling and parts inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Settings className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockParts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Low Stock Alert:</strong> {lowStockParts.length} parts are running low on inventory.{' '}
            <Button variant="link" className="p-0 h-auto text-yellow-800 underline">
              View Details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule ({schedules.length})</TabsTrigger>
          <TabsTrigger value="new">New Maintenance</TabsTrigger>
          <TabsTrigger value="parts">Parts ({parts.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by equipment, technician, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Maintenance Schedule */}
          <div className="space-y-4">
            {filteredSchedules.map((schedule) => (
              <Card key={schedule.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{schedule.equipmentName}</h3>
                      <p className="text-sm text-gray-600">
                        {schedule.workDescription}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(schedule.status)}>
                        {schedule.status}
                      </Badge>
                      <Badge className={getPriorityColor(schedule.priority)}>
                        {schedule.priority}
                      </Badge>
                      <Badge className={getMaintenanceTypeColor(schedule.maintenanceType)}>
                        {schedule.maintenanceType}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Scheduled</span>
                      <p className="font-medium">{formatDate(schedule.scheduledDate)}</p>
                      <p className="text-sm text-gray-500">
                        {schedule.scheduledDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Duration</span>
                      <p className="font-medium">{schedule.estimatedDuration}h estimated</p>
                      {schedule.actualDuration && (
                        <p className="text-sm text-gray-500">{schedule.actualDuration}h actual</p>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Technician</span>
                      <p className="font-medium">{schedule.technician}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Cost</span>
                      <p className="font-medium">
                        {schedule.cost ? `₹${schedule.cost.toLocaleString()}` : 'TBD'}
                      </p>
                    </div>
                  </div>

                  {schedule.parts.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Required Parts:</p>
                      <div className="flex flex-wrap gap-2">
                        {schedule.parts.map((part) => (
                          <Badge key={part.id} variant="outline" className="text-xs">
                            {part.name} (x{part.quantity})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Assigned to {schedule.technician}</span>
                    </div>
                    <div className="flex space-x-2">
                      {schedule.status === 'scheduled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(schedule.id, 'in_progress')}
                        >
                          Start Work
                        </Button>
                      )}
                      {schedule.status === 'in_progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(schedule.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  {schedule.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {schedule.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Schedule New Maintenance
              </CardTitle>
              <CardDescription>
                Create a new maintenance schedule for equipment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Equipment Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Equipment Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="equipmentId">Equipment ID</Label>
                      <Input
                        id="equipmentId"
                        value={newMaintenanceForm.equipmentId}
                        onChange={(e) => setNewMaintenanceForm(prev => ({
                          ...prev,
                          equipmentId: e.target.value
                        }))}
                        placeholder="Enter equipment ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="equipmentName">Equipment Name</Label>
                      <Input
                        id="equipmentName"
                        value={newMaintenanceForm.equipmentName}
                        onChange={(e) => setNewMaintenanceForm(prev => ({
                          ...prev,
                          equipmentName: e.target.value
                        }))}
                        placeholder="Enter equipment name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maintenanceType">Maintenance Type</Label>
                      <select
                        id="maintenanceType"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newMaintenanceForm.maintenanceType}
                        onChange={(e) => setNewMaintenanceForm(prev => ({
                          ...prev,
                          maintenanceType: e.target.value as any
                        }))}
                      >
                        <option value="routine">Routine</option>
                        <option value="predictive">Predictive</option>
                        <option value="emergency">Emergency</option>
                        <option value="overhaul">Overhaul</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newMaintenanceForm.priority}
                        onChange={(e) => setNewMaintenanceForm(prev => ({
                          ...prev,
                          priority: e.target.value as any
                        }))}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Schedule Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="scheduledDate">Scheduled Date</Label>
                      <Input
                        id="scheduledDate"
                        type="datetime-local"
                        value={newMaintenanceForm.scheduledDate.toISOString().slice(0, 16)}
                        onChange={(e) => setNewMaintenanceForm(prev => ({
                          ...prev,
                          scheduledDate: new Date(e.target.value)
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
                      <Input
                        id="estimatedDuration"
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={newMaintenanceForm.estimatedDuration}
                        onChange={(e) => setNewMaintenanceForm(prev => ({
                          ...prev,
                          estimatedDuration: parseFloat(e.target.value) || 2
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="technician">Assigned Technician</Label>
                      <Input
                        id="technician"
                        value={newMaintenanceForm.technician}
                        onChange={(e) => setNewMaintenanceForm(prev => ({
                          ...prev,
                          technician: e.target.value
                        }))}
                        placeholder="Enter technician ID or name"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="workDescription">Work Description</Label>
                <Textarea
                  id="workDescription"
                  placeholder="Describe the maintenance work to be performed..."
                  value={newMaintenanceForm.workDescription}
                  onChange={(e) => setNewMaintenanceForm(prev => ({
                    ...prev,
                    workDescription: e.target.value
                  }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or special instructions..."
                  value={newMaintenanceForm.notes || ''}
                  onChange={(e) => setNewMaintenanceForm(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button
                  onClick={handleScheduleMaintenance}
                  disabled={!newMaintenanceForm.equipmentName || !newMaintenanceForm.technician}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Parts Inventory
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Part
                </Button>
              </CardTitle>
              <CardDescription>
                Manage maintenance parts inventory and stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parts.map((part) => {
                  const isLowStock = part.inStock <= part.minStock;
                  return (
                    <div key={part.id} className={`border rounded-lg p-4 ${isLowStock ? 'border-red-200 bg-red-50' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{part.name}</h4>
                          <p className="text-sm text-gray-600">Part #{part.partNumber}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isLowStock && (
                            <Badge className="bg-red-100 text-red-800">
                              Low Stock
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {part.supplier}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">In Stock:</span>
                          <p className="font-medium text-lg">{part.inStock}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Min Stock:</span>
                          <p className="font-medium">{part.minStock}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Unit Cost:</span>
                          <p className="font-medium">₹{part.unitCost}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Value:</span>
                          <p className="font-medium">₹{(part.inStock * part.unitCost).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Ordered:</span>
                          <p className="font-medium">
                            {part.lastOrdered ? part.lastOrdered.toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                      </div>

                      {isLowStock && (
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-red-700">
                              Stock level is below minimum threshold
                            </p>
                            <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                              Reorder Now
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Maintenance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Duration</span>
                    <span className="font-medium">3.2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">On-Time Completion</span>
                    <span className="font-medium text-green-600">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cost per Hour</span>
                    <span className="font-medium">₹1,250</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Emergency Ratio</span>
                    <span className="font-medium text-yellow-600">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Parts Value</span>
                    <span className="font-medium">₹{parts.reduce((sum, part) => sum + (part.inStock * part.unitCost), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Maintenance</span>
                    <span className="font-medium">₹45,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Emergency Costs</span>
                    <span className="font-medium text-red-600">₹12,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cost Savings</span>
                    <span className="font-medium text-green-600">₹8,500</span>
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