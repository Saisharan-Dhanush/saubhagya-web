import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  History,
  Calendar,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  X,
  Star,
  Download,
  Filter,
  Search,
  Eye,
  AlertTriangle,
  User,
  Truck,
  Camera,
  PenTool
} from 'lucide-react';
import { transporterService } from '../../services/mockDataService';
import { Delivery, DeliveryFilter } from '../../types';

const DeliveryHistory: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const [filters, setFilters] = useState<DeliveryFilter>({
    status: ['delivered'],
    dateRange: {
      start: '',
      end: ''
    },
    vehicleId: '',
    driverId: '',
    priority: []
  });

  useEffect(() => {
    loadDeliveryHistory();
  }, []);

  const loadDeliveryHistory = async () => {
    try {
      setLoading(true);
      const response = await transporterService.getDeliveryHistory();
      if (response.success) {
        setDeliveries(response.data);
      } else {
        setError('Failed to load delivery history');
      }
    } catch (err) {
      setError('Failed to load delivery history');
      console.error('Delivery history load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      delivered: { color: 'bg-green-500', label: 'Delivered' },
      failed: { color: 'bg-red-500', label: 'Failed' },
      cancelled: { color: 'bg-gray-500', label: 'Cancelled' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-500', label: 'Unknown' };
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.customerAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || filters.status.length === 0 ||
                         filters.status.includes(delivery.status);

    const matchesVehicle = !filters.vehicleId || delivery.vehicleId === filters.vehicleId;
    const matchesDriver = !filters.driverId || delivery.driverId === filters.driverId;

    let matchesDateRange = true;
    if (filters.dateRange?.start && filters.dateRange?.end) {
      const deliveryDate = new Date(delivery.actualArrival || delivery.estimatedArrival);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      matchesDateRange = deliveryDate >= startDate && deliveryDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesVehicle && matchesDriver && matchesDateRange;
  });

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryDuration = (delivery: Delivery) => {
    if (!delivery.startTime || !delivery.actualArrival) return null;

    const start = new Date(delivery.startTime);
    const end = new Date(delivery.actualArrival);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    return durationMinutes;
  };

  const isDeliveryLate = (delivery: Delivery) => {
    if (!delivery.actualArrival) return false;

    const estimated = new Date(delivery.estimatedArrival);
    const actual = new Date(delivery.actualArrival);

    return actual > estimated;
  };

  const getHistoryStats = () => {
    const total = deliveries.length;
    const delivered = deliveries.filter(d => d.status === 'delivered').length;
    const failed = deliveries.filter(d => d.status === 'failed').length;
    const onTime = deliveries.filter(d => d.status === 'delivered' && !isDeliveryLate(d)).length;

    const onTimeRate = delivered > 0 ? (onTime / delivered * 100) : 0;

    // Calculate average delivery time
    const completedWithTimes = deliveries.filter(d =>
      d.status === 'delivered' && d.startTime && d.actualArrival
    );

    const avgDuration = completedWithTimes.length > 0
      ? completedWithTimes.reduce((sum, d) => sum + (getDeliveryDuration(d) || 0), 0) / completedWithTimes.length
      : 0;

    return { total, delivered, failed, onTime, onTimeRate: Math.round(onTimeRate), avgDuration: Math.round(avgDuration) };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery History</h1>
          <p className="text-muted-foreground">
            View completed deliveries and performance metrics
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
          <h1 className="text-3xl font-bold tracking-tight">Delivery History</h1>
          <p className="text-muted-foreground">
            View completed deliveries and performance metrics
          </p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
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

  const stats = getHistoryStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery History</h1>
          <p className="text-muted-foreground">
            View completed deliveries and performance metrics
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <History className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.onTimeRate}%</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgDuration}min</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Date Range</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: e.target.value }
                    })}
                  />
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="space-y-2">
                  {['delivered', 'failed', 'cancelled'].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(status as any) || false}
                        onChange={(e) => {
                          const currentStatus = filters.status || [];
                          const updatedStatus = e.target.checked
                            ? [...currentStatus, status as any]
                            : currentStatus.filter(s => s !== status);
                          setFilters({ ...filters, status: updatedStatus });
                        }}
                      />
                      <span className="text-sm capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Vehicle</label>
                <input
                  type="text"
                  placeholder="Vehicle ID"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={filters.vehicleId || ''}
                  onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Driver</label>
                <input
                  type="text"
                  placeholder="Driver ID"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={filters.driverId || ''}
                  onChange={(e) => setFilters({ ...filters, driverId: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery History List */}
      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => {
          const isLate = isDeliveryLate(delivery);
          const duration = getDeliveryDuration(delivery);

          return (
            <Card key={delivery.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                  {/* Delivery Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{delivery.customerName}</h3>
                        {getStatusBadge(delivery.status)}
                        {delivery.status === 'delivered' && isLate && (
                          <Badge className="bg-yellow-500 text-white">Late</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        #{delivery.id}
                      </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{delivery.biogasQuantity}kg Biogas</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span>Vehicle: {delivery.vehicleId}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>Driver: {delivery.driverId}</span>
                      </div>

                      {duration && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>Duration: {duration}min</span>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">{delivery.customerAddress}</span>
                    </div>

                    {/* Timing Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {delivery.startTime && (
                        <div>
                          <span className="font-medium text-gray-600">Started:</span>
                          <div>{formatDateTime(delivery.startTime)}</div>
                        </div>
                      )}

                      <div>
                        <span className="font-medium text-gray-600">Expected:</span>
                        <div>{formatDateTime(delivery.estimatedArrival)}</div>
                      </div>

                      {delivery.actualArrival && (
                        <div>
                          <span className="font-medium text-gray-600">Completed:</span>
                          <div className={isLate ? 'text-red-600' : 'text-green-600'}>
                            {formatDateTime(delivery.actualArrival)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Confirmation Details */}
                    {delivery.deliveryConfirmation && (
                      <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              Delivery Confirmed
                            </p>
                            <p className="text-sm text-green-700">
                              By: {delivery.deliveryConfirmation.confirmedBy}
                            </p>
                            {delivery.deliveryConfirmation.notes && (
                              <p className="text-sm text-green-700 mt-1">
                                Notes: {delivery.deliveryConfirmation.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {delivery.deliveryConfirmation.customerSignature && (
                              <Badge variant="outline" className="text-green-700">
                                <PenTool className="w-3 h-3 mr-1" />
                                Signed
                              </Badge>
                            )}
                            {delivery.deliveryConfirmation.photo && (
                              <Badge variant="outline" className="text-green-700">
                                <Camera className="w-3 h-3 mr-1" />
                                Photo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 min-w-[120px]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDelivery(delivery)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>

                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Receipt
                    </Button>

                    {delivery.status === 'delivered' && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>4.8</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredDeliveries.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery history found</h3>
                <p className="text-gray-500">
                  {searchTerm || showFilters
                    ? 'Try adjusting your search or filters.'
                    : 'No completed deliveries yet.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
export { DeliveryHistory };