import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Truck,
  User,
  Route,
  Plus,
  Edit,
  Trash2,
  Navigation,
  AlertCircle,
  CheckCircle,
  Timer,
  Users,
  Phone,
  Map
} from 'lucide-react';
// Removed date-fns dependency - using native Date methods

// Define PickupStatus type locally since the interface uses a different format
type PickupStatus = 'SCHEDULED' | 'IN_TRANSIT' | 'COLLECTED' | 'CANCELLED';
interface PickupSchedule {
  id: string;
  farmerId: string;
  farmerName: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedWorker: string;
  vehicleId: string;
  priority: string;
  notes: string;
  status: 'scheduled' | 'inProgress' | 'completed' | 'delayed' | 'cancelled';
  estimatedDuration?: number;
  estimatedDistance?: number;
}

// Mock data
const schedules: PickupSchedule[] = [
  {
    id: 'SCH-001',
    farmerId: 'FARM-001',
    farmerName: 'राम कुमार',
    location: 'Village A, District B',
    scheduledDate: new Date().toISOString(),
    scheduledTime: '09:00',
    assignedWorker: 'W001',
    vehicleId: 'V001',
    priority: 'high',
    notes: 'Regular pickup',
    status: 'scheduled',
    estimatedDuration: 45,
    estimatedDistance: 12.5
  },
  {
    id: 'SCH-002',
    farmerId: 'FARM-002',
    farmerName: 'श्याम यादव',
    location: 'Village C, District B',
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    scheduledTime: '10:30',
    assignedWorker: 'W002',
    vehicleId: 'V002',
    priority: 'medium',
    notes: 'Buffalo dung collection',
    status: 'scheduled',
    estimatedDuration: 30,
    estimatedDistance: 8.2
  }
];

// Mock functions
const createSchedule = async (data: Partial<PickupSchedule>) => {
  console.log('Creating schedule:', data);
  return Promise.resolve();
};

const updateSchedule = async (id: string, data: Partial<PickupSchedule>) => {
  console.log('Updating schedule:', id, data);
  return Promise.resolve();
};

const deleteSchedule = async (id: string) => {
  console.log('Deleting schedule:', id);
  return Promise.resolve();
};


interface PickupSchedulerProps {
  languageContext?: {
    language: 'hi' | 'en';
    t: (key: string) => string;
  };
}

const translations = {
  en: {
    title: 'Pickup Scheduler',
    subtitle: 'Route planning and farmer assignment management',
    createSchedule: 'Create Schedule',
    editSchedule: 'Edit Schedule',
    deleteSchedule: 'Delete Schedule',
    scheduleList: 'Schedule List',
    routeOptimization: 'Route Optimization',
    farmerAssignments: 'Farmer Assignments',
    todaysPickups: 'Today\'s Pickups',
    upcomingSchedules: 'Upcoming Schedules',
    routeHistory: 'Route History',
    farmerId: 'Farmer ID',
    farmerName: 'Farmer Name',
    location: 'Location',
    scheduledTime: 'Scheduled Time',
    estimatedDuration: 'Est. Duration',
    status: 'Status',
    assignedWorker: 'Assigned Worker',
    vehicleId: 'Vehicle ID',
    priority: 'Priority',
    notes: 'Notes',
    actions: 'Actions',
    create: 'Create',
    update: 'Update',
    cancel: 'Cancel',
    delete: 'Delete',
    scheduled: 'Scheduled',
    inProgress: 'In Progress',
    completed: 'Completed',
    delayed: 'Delayed',
    cancelled: 'Cancelled',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    selectDate: 'Select date',
    selectTime: 'Select time',
    selectWorker: 'Select worker',
    selectVehicle: 'Select vehicle',
    optimizeRoute: 'Optimize Route',
    viewMap: 'View Map',
    contactFarmer: 'Contact Farmer',
    estimatedTime: 'ETA',
    distance: 'Distance',
    totalDistance: 'Total Distance',
    totalDuration: 'Total Duration',
    numberOfStops: 'Number of Stops',
    efficiency: 'Route Efficiency'
  },
  hi: {
    title: 'पिकअप शेड्यूलर',
    subtitle: 'रूट प्लानिंग और किसान असाइनमेंट प्रबंधन',
    createSchedule: 'शेड्यूल बनाएं',
    editSchedule: 'शेड्यूल संपादित करें',
    deleteSchedule: 'शेड्यूल हटाएं',
    scheduleList: 'शेड्यूल सूची',
    routeOptimization: 'रूट ऑप्टिमाइज़ेशन',
    farmerAssignments: 'किसान असाइनमेंट',
    todaysPickups: 'आज के पिकअप',
    upcomingSchedules: 'आने वाले शेड्यूल',
    routeHistory: 'रूट इतिहास',
    farmerId: 'किसान आईडी',
    farmerName: 'किसान का नाम',
    location: 'स्थान',
    scheduledTime: 'निर्धारित समय',
    estimatedDuration: 'अनुमानित अवधि',
    status: 'स्थिति',
    assignedWorker: 'असाइन किया गया कार्यकर्ता',
    vehicleId: 'वाहन आईडी',
    priority: 'प्राथमिकता',
    notes: 'टिप्पणियां',
    actions: 'कार्य',
    create: 'बनाएं',
    update: 'अपडेट करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    scheduled: 'निर्धारित',
    inProgress: 'प्रगति में',
    completed: 'पूर्ण',
    delayed: 'विलंबित',
    cancelled: 'रद्द',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'निम्न',
    selectDate: 'दिनांक चुनें',
    selectTime: 'समय चुनें',
    selectWorker: 'कार्यकर्ता चुनें',
    selectVehicle: 'वाहन चुनें',
    optimizeRoute: 'रूट ऑप्टिमाइज़ करें',
    viewMap: 'मैप देखें',
    contactFarmer: 'किसान से संपर्क करें',
    estimatedTime: 'अनुमानित पहुंच समय',
    distance: 'दूरी',
    totalDistance: 'कुल दूरी',
    totalDuration: 'कुल अवधि',
    numberOfStops: 'स्टॉप की संख्या',
    efficiency: 'रूट दक्षता'
  }
};

const getStatusColor = (status: PickupStatus): string => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'inProgress':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'delayed':
      return 'bg-orange-100 text-orange-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: PickupStatus) => {
  switch (status) {
    case 'scheduled':
      return <Clock className="w-4 h-4" />;
    case 'inProgress':
      return <Truck className="w-4 h-4" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'delayed':
      return <AlertCircle className="w-4 h-4" />;
    case 'cancelled':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const ScheduleForm: React.FC<{
  schedule?: PickupSchedule;
  onSubmit: (data: Partial<PickupSchedule>) => void;
  onCancel: () => void;
  t: (key: string) => string;
}> = ({ schedule, onSubmit, onCancel, t }) => {
  const [formData, setFormData] = useState({
    farmerId: schedule?.farmerId || '',
    farmerName: schedule?.farmerName || '',
    location: schedule?.location || '',
    scheduledDate: schedule?.scheduledDate ? new Date(schedule.scheduledDate) : new Date(),
    scheduledTime: schedule?.scheduledTime || '',
    assignedWorker: schedule?.assignedWorker || '',
    vehicleId: schedule?.vehicleId || '',
    priority: schedule?.priority || 'medium',
    notes: schedule?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      scheduledDate: formData.scheduledDate.toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="farmerId">{t('farmerId')}</Label>
          <Input
            id="farmerId"
            value={formData.farmerId}
            onChange={(e) => setFormData(prev => ({ ...prev, farmerId: e.target.value }))}
            placeholder="FARM-001"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="farmerName">{t('farmerName')}</Label>
          <Input
            id="farmerName"
            value={formData.farmerName}
            onChange={(e) => setFormData(prev => ({ ...prev, farmerName: e.target.value }))}
            placeholder="Farmer name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">{t('location')}</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Village, District"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('selectDate')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.scheduledDate.toLocaleDateString()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.scheduledDate}
                onSelect={(date) => date && setFormData(prev => ({ ...prev, scheduledDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="scheduledTime">{t('selectTime')}</Label>
          <Input
            id="scheduledTime"
            type="time"
            value={formData.scheduledTime}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignedWorker">{t('selectWorker')}</Label>
          <Select value={formData.assignedWorker} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedWorker: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select worker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="W001">राजेश कुमार</SelectItem>
              <SelectItem value="W002">सुनील यादव</SelectItem>
              <SelectItem value="W003">अमित शर्मा</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleId">{t('selectVehicle')}</Label>
          <Select value={formData.vehicleId} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="V001">Truck - RJ14-AB-1234</SelectItem>
              <SelectItem value="V002">Van - RJ14-CD-5678</SelectItem>
              <SelectItem value="V003">Pickup - RJ14-EF-9012</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">{t('priority')}</Label>
        <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">{t('high')}</SelectItem>
            <SelectItem value="medium">{t('medium')}</SelectItem>
            <SelectItem value="low">{t('low')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('notes')}</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes..."
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit">
          {schedule ? t('update') : t('create')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export const PickupScheduler: React.FC<PickupSchedulerProps> = ({ languageContext }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<PickupSchedule | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<PickupSchedule | null>(null);

  const lang = languageContext?.language || 'en';
  const t = (key: string): string => {
    return languageContext?.t(key) || translations[lang][key as keyof typeof translations[typeof lang]] || key;
  };

  const handleCreateSchedule = async (data: Partial<PickupSchedule>) => {
    await createSchedule(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateSchedule = async (data: Partial<PickupSchedule>) => {
    if (editingSchedule) {
      await updateSchedule(editingSchedule.id, data);
      setEditingSchedule(null);
    }
  };

  const handleDeleteSchedule = async () => {
    if (deletingSchedule) {
      await deleteSchedule(deletingSchedule.id);
      setDeletingSchedule(null);
    }
  };

  const todaysSchedules = schedules.filter(s =>
    new Date(s.scheduledDate).toDateString() === new Date().toDateString()
  );
  const upcomingSchedules = schedules.filter(s =>
    new Date(s.scheduledDate) > new Date() &&
    new Date(s.scheduledDate).toDateString() !== new Date().toDateString()
  );
  const inProgressSchedules = schedules.filter(s => s.status === 'inProgress');
  const completedSchedules = schedules.filter(s => s.status === 'completed');

  const totalDistance = schedules.reduce((sum, s) => sum + (s.estimatedDistance || 0), 0);
  const averageEfficiency = schedules.length > 0 ?
    (completedSchedules.length / schedules.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between -mt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Route className="w-4 h-4" />
            {t('optimizeRoute')}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t('createSchedule')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('createSchedule')}</DialogTitle>
                <DialogDescription>
                  Create a new pickup schedule for farmer dung collection
                </DialogDescription>
              </DialogHeader>
              <ScheduleForm
                onSubmit={handleCreateSchedule}
                onCancel={() => setIsCreateDialogOpen(false)}
                t={t}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('todaysPickups')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysSchedules.length}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressSchedules.length} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressSchedules.length}</div>
            <p className="text-xs text-muted-foreground">
              Workers on field
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalDistance')}</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
            <p className="text-xs text-muted-foreground">
              Total planned distance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('efficiency')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">{t('todaysPickups')}</TabsTrigger>
          <TabsTrigger value="upcoming">{t('upcomingSchedules')}</TabsTrigger>
          <TabsTrigger value="routes">{t('routeOptimization')}</TabsTrigger>
          <TabsTrigger value="assignments">{t('farmerAssignments')}</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>{t('todaysPickups')}</CardTitle>
              <CardDescription>
                Today's scheduled pickups and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('farmerName')}</TableHead>
                    <TableHead>{t('location')}</TableHead>
                    <TableHead>{t('scheduledTime')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('assignedWorker')}</TableHead>
                    <TableHead>{t('estimatedTime')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaysSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {schedule.farmerName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {schedule.location}
                        </div>
                      </TableCell>
                      <TableCell>{schedule.scheduledTime}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(schedule.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(schedule.status)}
                            {t(schedule.status)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{schedule.assignedWorker}</TableCell>
                      <TableCell>
                        {schedule.estimatedDuration ? `${schedule.estimatedDuration} min` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Map className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSchedule(schedule)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {todaysSchedules.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-2" />
                  <p>No pickups scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>{t('upcomingSchedules')}</CardTitle>
              <CardDescription>
                Scheduled pickups for the coming days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-4">
                        <h4 className="font-semibold">{schedule.farmerName}</h4>
                        <Badge className={getPriorityColor(schedule.priority)}>
                          {t(schedule.priority)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {schedule.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(schedule.scheduledDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {schedule.scheduledTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(schedule.status)}>
                        {t(schedule.status)}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => setEditingSchedule(schedule)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setDeletingSchedule(schedule)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {upcomingSchedules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>No upcoming schedules</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('routeOptimization')}</CardTitle>
                <CardDescription>
                  Optimize pickup routes for maximum efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
                      <div className="text-sm text-muted-foreground">{t('numberOfStops')}</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{totalDistance.toFixed(1)} km</div>
                      <div className="text-sm text-muted-foreground">{t('totalDistance')}</div>
                    </div>
                  </div>
                  <Button className="w-full gap-2">
                    <Route className="w-4 h-4" />
                    {t('optimizeRoute')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Route Efficiency</CardTitle>
                <CardDescription>
                  Current route performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span>{averageEfficiency.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${averageEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Avg. Duration:</span>
                      <span className="ml-2 font-medium">45 min</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fuel Efficiency:</span>
                      <span className="ml-2 font-medium">12 km/L</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>{t('farmerAssignments')}</CardTitle>
              <CardDescription>
                Manage farmer-worker assignments and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.slice(0, 10).map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-semibold">{schedule.farmerName}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({schedule.farmerId})</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {schedule.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {schedule.assignedWorker}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingSchedule} onOpenChange={() => setEditingSchedule(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('editSchedule')}</DialogTitle>
            <DialogDescription>
              Update schedule information and assignments
            </DialogDescription>
          </DialogHeader>
          {editingSchedule && (
            <ScheduleForm
              schedule={editingSchedule}
              onSubmit={handleUpdateSchedule}
              onCancel={() => setEditingSchedule(null)}
              t={t}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingSchedule} onOpenChange={() => setDeletingSchedule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteSchedule')}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this pickup schedule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingSchedule(null)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteSchedule}>
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PickupScheduler;