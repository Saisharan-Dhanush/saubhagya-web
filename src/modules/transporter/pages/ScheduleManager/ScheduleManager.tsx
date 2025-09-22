import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Package,
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { transporterService } from '../../services/mockDataService';
import { DeliverySchedule } from '../../types';

interface ScheduleFilter {
  status: string;
  priority: string;
  date: string;
}

const ScheduleManager: React.FC = () => {
  const [schedules, setSchedules] = useState<DeliverySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ScheduleFilter>({
    status: 'all',
    priority: 'all',
    date: 'all'
  });

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        const response = await transporterService.getSchedules();
        if (response.success) {
          setSchedules(response.data);
        } else {
          setError('Failed to load schedules');
        }
      } catch (err) {
        setError('Failed to load schedules');
        console.error('Schedule load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, []);

  const getStatusBadge = (status: DeliverySchedule['status']) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-500', label: 'Scheduled' },
      confirmed: { color: 'bg-green-500', label: 'Confirmed' },
      in_transit: { color: 'bg-yellow-500', label: 'In Transit' },
      delivered: { color: 'bg-emerald-500', label: 'Delivered' },
      cancelled: { color: 'bg-red-500', label: 'Cancelled' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: DeliverySchedule['priority']) => {
    const priorityConfig = {
      low: { color: 'bg-gray-500', label: 'Low' },
      medium: { color: 'bg-blue-500', label: 'Medium' },
      high: { color: 'bg-orange-500', label: 'High' },
      urgent: { color: 'bg-red-500', label: 'Urgent' }
    };

    const config = priorityConfig[priority];
    return (
      <Badge variant="outline" className={`${config.color} text-white border-0`}>
        {config.label}
      </Badge>
    );
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.customerAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'all' || schedule.status === filters.status;
    const matchesPriority = filters.priority === 'all' || schedule.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatTimeSlot = (timeSlot: { start: string; end: string }) => {
    return `${timeSlot.start} - ${timeSlot.end}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScheduleStats = () => {
    const total = schedules.length;
    const scheduled = schedules.filter(s => s.status === 'scheduled').length;
    const confirmed = schedules.filter(s => s.status === 'confirmed').length;
    const inTransit = schedules.filter(s => s.status === 'in_transit').length;
    const urgent = schedules.filter(s => s.priority === 'urgent').length;

    return { total, scheduled, confirmed, inTransit, urgent };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Manager</h1>
          <p className="text-muted-foreground">
            Manage biogas delivery schedules and appointments
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Manager</h1>
          <p className="text-muted-foreground">
            Manage biogas delivery schedules and appointments
          </p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getScheduleStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Manager</h1>
          <p className="text-muted-foreground">
            Manage biogas delivery schedules and appointments
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Schedule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inTransit}</p>
              </div>
              <MapPin className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name or address..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedules List */}
      <div className="space-y-4">
        {filteredSchedules.map((schedule) => (
          <Card key={schedule.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                {/* Schedule Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{schedule.customerName}</h3>
                      {getStatusBadge(schedule.status)}
                      {getPriorityBadge(schedule.priority)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {schedule.id}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(schedule.deliveryDate)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{formatTimeSlot(schedule.timeSlot)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{schedule.biogasQuantity}kg Biogas</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{schedule.customerPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-600">{schedule.customerAddress}</span>
                  </div>

                  {schedule.specialInstructions && (
                    <div className="p-2 bg-yellow-50 border-l-4 border-yellow-400">
                      <p className="text-sm text-yellow-800">
                        <strong>Special Instructions:</strong> {schedule.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Assignment Info */}
                  {(schedule.vehicleId || schedule.driverId) && (
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {schedule.vehicleId && (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Vehicle:</span>
                          <Badge variant="outline">{schedule.vehicleId}</Badge>
                        </div>
                      )}
                      {schedule.driverId && (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Driver:</span>
                          <Badge variant="outline">{schedule.driverId}</Badge>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions and Cost */}
                <div className="flex flex-col items-end space-y-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total Cost</div>
                    <div className="text-xl font-bold">₹{schedule.cost.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{schedule.estimatedDuration} mins</div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>

                  {schedule.status === 'scheduled' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSchedules.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filters.status !== 'all' || filters.priority !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'No delivery schedules have been created yet.'}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScheduleManager;
export { ScheduleManager };