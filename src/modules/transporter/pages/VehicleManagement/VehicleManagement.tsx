import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Truck,
  MapPin,
  Fuel,
  Wrench,
  Calendar,
  User,
  Plus,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Package,
  Route as RouteIcon
} from 'lucide-react';
import { transporterService } from '../../services/mockDataService';
import { Vehicle, Driver } from '../../types';

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Vehicle['status']>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [vehiclesResponse, driversResponse] = await Promise.all([
          transporterService.getVehicles(),
          transporterService.getDrivers()
        ]);

        if (vehiclesResponse.success) {
          setVehicles(vehiclesResponse.data);
        }

        if (driversResponse.success) {
          setDrivers(driversResponse.data);
        }
      } catch (err) {
        setError('Failed to load vehicle data');
        console.error('Vehicle data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusBadge = (status: Vehicle['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-500', label: 'Active' },
      maintenance: { color: 'bg-yellow-500', label: 'Maintenance' },
      inactive: { color: 'bg-gray-500', label: 'Inactive' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getVehicleTypeBadge = (type: Vehicle['type']) => {
    const typeConfig = {
      truck: { color: 'bg-blue-500', label: 'Truck' },
      van: { color: 'bg-purple-500', label: 'Van' },
      tanker: { color: 'bg-orange-500', label: 'Tanker' }
    };

    const config = typeConfig[type];
    return (
      <Badge variant="outline" className={`${config.color} text-white border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getFuelLevelColor = (level?: number) => {
    if (!level) return 'bg-gray-400';
    if (level > 50) return 'bg-green-500';
    if (level > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDriverName = (driverId?: string) => {
    if (!driverId) return 'Unassigned';
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const getMaintenanceStatus = (maintenanceDue?: string) => {
    if (!maintenanceDue) return null;

    const today = new Date();
    const dueDate = new Date(maintenanceDue);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { color: 'text-red-600', label: 'Overdue', icon: AlertTriangle };
    } else if (diffDays <= 7) {
      return { color: 'text-yellow-600', label: 'Due Soon', icon: Clock };
    } else {
      return { color: 'text-green-600', label: 'Scheduled', icon: CheckCircle };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    filterStatus === 'all' || vehicle.status === filterStatus
  );

  const getFleetStats = () => {
    const total = vehicles.length;
    const active = vehicles.filter(v => v.status === 'active').length;
    const maintenance = vehicles.filter(v => v.status === 'maintenance').length;
    const inactive = vehicles.filter(v => v.status === 'inactive').length;

    // Calculate vehicles needing maintenance soon
    const today = new Date();
    const maintenanceSoon = vehicles.filter(v => {
      if (!v.maintenanceDue) return false;
      const dueDate = new Date(v.maintenanceDue);
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).length;

    const lowFuel = vehicles.filter(v => (v.fuelLevel || 0) < 25).length;

    return { total, active, maintenance, inactive, maintenanceSoon, lowFuel };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Manage fleet vehicles and maintenance schedules
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
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Manage fleet vehicles and maintenance schedules
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

  const stats = getFleetStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Manage fleet vehicles and maintenance schedules
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fleet</p>
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
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <Activity className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance Due</p>
                <p className="text-2xl font-bold text-orange-600">{stats.maintenanceSoon}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Fuel</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowFuel}</p>
              </div>
              <Fuel className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Vehicles</option>
                <option value="active">Active</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles List */}
      <div className="space-y-4">
        {filteredVehicles.map((vehicle) => {
          const maintenanceStatus = getMaintenanceStatus(vehicle.maintenanceDue);
          const MaintenanceIcon = maintenanceStatus?.icon || CheckCircle;

          return (
            <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                  {/* Vehicle Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{vehicle.registrationNumber}</h3>
                        {getStatusBadge(vehicle.status)}
                        {getVehicleTypeBadge(vehicle.type)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {vehicle.id}
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>Capacity: {vehicle.capacity}kg</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>Driver: {getDriverName(vehicle.driverId)}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Hours: {vehicle.operatingHours.start}-{vehicle.operatingHours.end}</span>
                      </div>

                      {vehicle.assignedRoute && (
                        <div className="flex items-center space-x-2">
                          <RouteIcon className="h-4 w-4 text-gray-400" />
                          <span>Route: {vehicle.assignedRoute}</span>
                        </div>
                      )}
                    </div>

                    {/* Location Info */}
                    {vehicle.currentLocation && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600">{vehicle.currentLocation.address}</span>
                      </div>
                    )}

                    {/* Fuel Level */}
                    {vehicle.fuelLevel !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Fuel Level</span>
                          <span className="font-medium">{vehicle.fuelLevel}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getFuelLevelColor(vehicle.fuelLevel)}`}
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          ></div>
                        </div>
                        {vehicle.fuelLevel < 25 && (
                          <div className="flex items-center space-x-2 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">Low fuel level - refuel needed</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Maintenance Info */}
                    {vehicle.maintenanceDue && maintenanceStatus && (
                      <div className={`p-3 border rounded-lg ${
                        maintenanceStatus.color === 'text-red-600' ? 'border-red-200 bg-red-50' :
                        maintenanceStatus.color === 'text-yellow-600' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <MaintenanceIcon className={`h-4 w-4 ${maintenanceStatus.color}`} />
                          <span className={`text-sm font-medium ${maintenanceStatus.color}`}>
                            Maintenance {maintenanceStatus.label}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${maintenanceStatus.color}`}>
                          Due: {formatDate(vehicle.maintenanceDue)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 min-w-[120px]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>

                    {vehicle.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Wrench className="w-4 h-4 mr-1" />
                        Maintenance
                      </Button>
                    )}

                    {vehicle.status === 'maintenance' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Active
                      </Button>
                    )}

                    {vehicle.status === 'inactive' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Activity className="w-4 h-4 mr-1" />
                        Activate
                      </Button>
                    )}

                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      Track
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredVehicles.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filterStatus === 'all' ? 'No vehicles found' : `No ${filterStatus} vehicles`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {filterStatus === 'all'
                    ? 'No vehicles have been added to the fleet yet.'
                    : `There are no vehicles with ${filterStatus} status.`}
                </p>
                {filterStatus === 'all' && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Vehicle
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VehicleManagement;
export { VehicleManagement };