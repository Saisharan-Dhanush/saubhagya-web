import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Truck,
  MapPin,
  Clock,
  User,
  Phone,
  Package,
  Navigation,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye,
  Route as RouteIcon
} from 'lucide-react';
import { transporterService } from '../../services/mockDataService';
import { Delivery } from '../../types';

const ActiveDeliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  useEffect(() => {
    loadActiveDeliveries();

    // Set up auto-refresh every 30 seconds for live tracking
    const interval = setInterval(loadActiveDeliveries, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadActiveDeliveries = async () => {
    try {
      if (!loading) setRefreshing(true);

      const response = await transporterService.getActiveDeliveries();

      if (response.success) {
        setDeliveries(response.data);
      } else {
        setError('Failed to load active deliveries');
      }
    } catch (err) {
      setError('Failed to load active deliveries');
      console.error('Active deliveries load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      pending: { color: 'bg-gray-500', label: 'Pending' },
      picked_up: { color: 'bg-blue-500', label: 'Picked Up' },
      in_transit: { color: 'bg-yellow-500', label: 'In Transit' },
      delivered: { color: 'bg-green-500', label: 'Delivered' },
      failed: { color: 'bg-red-500', label: 'Failed' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getTimeStatus = (estimatedArrival: string) => {
    const now = new Date();
    const estimated = new Date(estimatedArrival);
    const diffMinutes = (estimated.getTime() - now.getTime()) / (1000 * 60);

    if (diffMinutes < -15) {
      return { color: 'text-red-600', label: 'Late', icon: AlertTriangle };
    } else if (diffMinutes < 0) {
      return { color: 'text-yellow-600', label: 'Arriving Soon', icon: Clock };
    } else if (diffMinutes <= 15) {
      return { color: 'text-blue-600', label: 'On Time', icon: CheckCircle };
    } else {
      return { color: 'text-green-600', label: 'Early', icon: CheckCircle };
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryStats = () => {
    const total = deliveries.length;
    const pending = deliveries.filter(d => d.status === 'pending').length;
    const inTransit = deliveries.filter(d => d.status === 'in_transit').length;
    const pickedUp = deliveries.filter(d => d.status === 'picked_up').length;

    // Calculate estimated late deliveries
    const now = new Date();
    const lateCount = deliveries.filter(d => {
      const estimated = new Date(d.estimatedArrival);
      return estimated < now && !['delivered', 'failed'].includes(d.status);
    }).length;

    return { total, pending, inTransit, pickedUp, lateCount };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Deliveries</h1>
          <p className="text-muted-foreground">
            Track live delivery status and locations
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Active Deliveries</h1>
          <p className="text-muted-foreground">
            Track live delivery status and locations
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

  const stats = getDeliveryStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Deliveries</h1>
          <p className="text-muted-foreground">
            Track live delivery status and locations
          </p>
        </div>
        <Button
          onClick={loadActiveDeliveries}
          disabled={refreshing}
          variant="outline"
        >
          {refreshing ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Active</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Picked Up</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pickedUp}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
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
              <Navigation className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Running Late</p>
                <p className="text-2xl font-bold text-red-600">{stats.lateCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Deliveries List */}
      <div className="space-y-4">
        {deliveries.map((delivery) => {
          const timeStatus = getTimeStatus(delivery.estimatedArrival);
          const TimeIcon = timeStatus.icon;
          const latestUpdate = delivery.trackingUpdates[delivery.trackingUpdates.length - 1];

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
                        <div className={`flex items-center space-x-1 ${timeStatus.color}`}>
                          <TimeIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">{timeStatus.label}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Delivery #{delivery.id}
                      </div>
                    </div>

                    {/* Customer and Delivery Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{delivery.customerAddress}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{delivery.biogasQuantity}kg Biogas</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>ETA: {formatTime(delivery.estimatedArrival)}</span>
                      </div>
                    </div>

                    {/* Vehicle and Driver Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span>Vehicle:</span>
                        <Badge variant="outline">{delivery.vehicleId}</Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>Driver:</span>
                        <Badge variant="outline">{delivery.driverId}</Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RouteIcon className="h-4 w-4 text-gray-400" />
                        <span>Route:</span>
                        <Badge variant="outline">{delivery.routeId}</Badge>
                      </div>
                    </div>

                    {/* Latest Tracking Update */}
                    {latestUpdate && (
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Latest Update: {latestUpdate.status}
                            </p>
                            {latestUpdate.notes && (
                              <p className="text-sm text-blue-700 mt-1">{latestUpdate.notes}</p>
                            )}
                          </div>
                          <span className="text-xs text-blue-600">
                            {formatDateTime(latestUpdate.timestamp)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Timing Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {delivery.startTime && (
                        <div>
                          <span className="font-medium">Started:</span> {formatDateTime(delivery.startTime)}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Estimated Arrival:</span> {formatDateTime(delivery.estimatedArrival)}
                      </div>
                      {delivery.actualArrival && (
                        <div>
                          <span className="font-medium">Actual Arrival:</span> {formatDateTime(delivery.actualArrival)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 min-w-[120px]">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDelivery(delivery)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Track
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>

                    {delivery.status === 'in_transit' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                    )}

                    {delivery.status === 'pending' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Dispatch
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tracking Timeline (expandable) */}
                {selectedDelivery?.id === delivery.id && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium mb-3">Tracking Timeline</h4>
                    <div className="space-y-3">
                      {delivery.trackingUpdates.map((update, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium">{update.status}</p>
                                {update.notes && (
                                  <p className="text-sm text-gray-600 mt-1">{update.notes}</p>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDateTime(update.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDelivery(null)}
                      className="mt-3"
                    >
                      Hide Timeline
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {deliveries.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active deliveries</h3>
                <p className="text-gray-500">All deliveries have been completed or none are scheduled.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActiveDeliveries;
export { ActiveDeliveries };