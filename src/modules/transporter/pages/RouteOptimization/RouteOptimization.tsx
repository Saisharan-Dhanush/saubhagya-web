import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Route as RouteIcon,
  MapPin,
  Clock,
  Fuel,
  TrendingUp,
  Zap,
  RefreshCw,
  Settings,
  Target,
  Navigation,
  Calculator,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { transporterService } from '../../services/mockDataService';
import { Route, OptimizationSettings } from '../../types';

interface OptimizationResult {
  originalRoute: Route;
  optimizedRoute: Route;
  improvements: {
    distanceReduction: number;
    timeReduction: number;
    fuelSavings: number;
    costSavings: number;
  };
}

const RouteOptimization: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    prioritizeBy: 'time',
    maxDeliveriesPerRoute: 8,
    maxDistancePerRoute: 100,
    considerTrafficConditions: true,
    considerVehicleCapacity: true,
    considerDriverPreferences: false,
    operatingHours: {
      start: '06:00',
      end: '18:00'
    }
  });

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        const response = await transporterService.getRoutes();
        if (response.success) {
          setRoutes(response.data);
        } else {
          setError('Failed to load routes');
        }
      } catch (err) {
        setError('Failed to load routes');
        console.error('Routes load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  const handleOptimizeRoute = async (route: Route) => {
    if (!route) return;

    try {
      setOptimizing(true);
      setSelectedRoute(route);

      // Create original route snapshot
      const originalRoute = { ...route };

      // Call optimization service
      const response = await transporterService.optimizeRoute(route.id);

      if (response.success) {
        const optimizedRoute = response.data;

        // Calculate improvements
        const improvements = {
          distanceReduction: originalRoute.totalDistance - optimizedRoute.totalDistance,
          timeReduction: originalRoute.estimatedDuration - optimizedRoute.estimatedDuration,
          fuelSavings: originalRoute.fuelCost - optimizedRoute.fuelCost,
          costSavings: (originalRoute.fuelCost + originalRoute.tollCost) -
                      (optimizedRoute.fuelCost + optimizedRoute.tollCost)
        };

        setOptimizationResult({
          originalRoute,
          optimizedRoute,
          improvements
        });

        // Update the route in the list
        setRoutes(prev => prev.map(r => r.id === route.id ? optimizedRoute : r));
      }
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setOptimizing(false);
    }
  };

  const getRouteStatusBadge = (status: Route['status']) => {
    const statusConfig = {
      planned: { color: 'bg-blue-500', label: 'Planned' },
      active: { color: 'bg-green-500', label: 'Active' },
      completed: { color: 'bg-gray-500', label: 'Completed' },
      cancelled: { color: 'bg-red-500', label: 'Cancelled' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getOptimizationScore = (score: number) => {
    if (score >= 90) return { color: 'text-green-600', label: 'Excellent' };
    if (score >= 75) return { color: 'text-blue-600', label: 'Good' };
    if (score >= 60) return { color: 'text-yellow-600', label: 'Average' };
    return { color: 'text-red-600', label: 'Poor' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Route Optimization</h1>
          <p className="text-muted-foreground">
            Optimize delivery routes for efficiency and cost savings
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Route Optimization</h1>
          <p className="text-muted-foreground">
            Optimize delivery routes for efficiency and cost savings
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Route Optimization</h1>
          <p className="text-muted-foreground">
            Optimize delivery routes for efficiency and cost savings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Optimize All
          </Button>
        </div>
      </div>

      {/* Optimization Settings */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Optimization Settings</span>
            </CardTitle>
            <CardDescription>
              Configure how routes should be optimized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Prioritize By</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={optimizationSettings.prioritizeBy}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    prioritizeBy: e.target.value as any
                  })}
                >
                  <option value="time">Time</option>
                  <option value="distance">Distance</option>
                  <option value="fuel_cost">Fuel Cost</option>
                  <option value="customer_priority">Customer Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Deliveries per Route</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={optimizationSettings.maxDeliveriesPerRoute}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    maxDeliveriesPerRoute: parseInt(e.target.value)
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Distance (km)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={optimizationSettings.maxDistancePerRoute}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    maxDistancePerRoute: parseInt(e.target.value)
                  })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="traffic"
                  checked={optimizationSettings.considerTrafficConditions}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    considerTrafficConditions: e.target.checked
                  })}
                />
                <label htmlFor="traffic" className="text-sm font-medium">
                  Consider Traffic Conditions
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="capacity"
                  checked={optimizationSettings.considerVehicleCapacity}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    considerVehicleCapacity: e.target.checked
                  })}
                />
                <label htmlFor="capacity" className="text-sm font-medium">
                  Consider Vehicle Capacity
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="preferences"
                  checked={optimizationSettings.considerDriverPreferences}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    considerDriverPreferences: e.target.checked
                  })}
                />
                <label htmlFor="preferences" className="text-sm font-medium">
                  Consider Driver Preferences
                </label>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <Button onClick={() => setShowSettings(false)}>
                Apply Settings
              </Button>
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Results */}
      {optimizationResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>Optimization Results</span>
            </CardTitle>
            <CardDescription>
              Route optimization completed for {optimizationResult.originalRoute.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  -{optimizationResult.improvements.distanceReduction.toFixed(1)}km
                </div>
                <div className="text-sm text-gray-600">Distance Saved</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  -{optimizationResult.improvements.timeReduction}min
                </div>
                <div className="text-sm text-gray-600">Time Saved</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ₹{optimizationResult.improvements.fuelSavings.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Fuel Savings</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ₹{optimizationResult.improvements.costSavings.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Total Savings</div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button className="bg-green-600 hover:bg-green-700">
                Apply Optimization
              </Button>
              <Button variant="outline" onClick={() => setOptimizationResult(null)}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Routes List */}
      <div className="grid gap-6">
        {routes.map((route) => {
          const optimizationScore = getOptimizationScore(route.optimizationScore);

          return (
            <Card key={route.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                  {/* Route Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{route.name}</h3>
                        {getRouteStatusBadge(route.status)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Route ID: {route.id}
                      </div>
                    </div>

                    {/* Route Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Navigation className="h-4 w-4 text-gray-400" />
                        <span>{route.totalDistance}km</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{route.estimatedDuration}min</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Fuel className="h-4 w-4 text-gray-400" />
                        <span>₹{route.fuelCost}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{route.waypoints.length} stops</span>
                      </div>
                    </div>

                    {/* Start and End Locations */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Start:</span>
                        <span className="text-gray-600">{route.startLocation.address}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium">End:</span>
                        <span className="text-gray-600">{route.endLocation.address}</span>
                      </div>
                    </div>

                    {/* Waypoints */}
                    {route.waypoints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Delivery Stops:</h4>
                        <div className="space-y-1">
                          {route.waypoints.slice(0, 3).map((waypoint, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                              <span>{waypoint.address}</span>
                              <span className="text-xs text-gray-400">
                                ({new Date(waypoint.estimatedArrival).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })})
                              </span>
                            </div>
                          ))}
                          {route.waypoints.length > 3 && (
                            <div className="text-sm text-gray-500 ml-4">
                              +{route.waypoints.length - 3} more stops
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optimization Score and Actions */}
                  <div className="flex flex-col items-end space-y-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Optimization Score</div>
                      <div className={`text-2xl font-bold ${optimizationScore.color}`}>
                        {route.optimizationScore}%
                      </div>
                      <div className={`text-sm ${optimizationScore.color}`}>
                        {optimizationScore.label}
                      </div>
                    </div>

                    <div className="text-right text-sm text-gray-600">
                      <div>Total Cost: ₹{(route.fuelCost + route.tollCost).toLocaleString()}</div>
                      <div>Toll: ₹{route.tollCost}</div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => handleOptimizeRoute(route)}
                        disabled={optimizing && selectedRoute?.id === route.id}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {optimizing && selectedRoute?.id === route.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Optimizing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Optimize
                          </>
                        )}
                      </Button>

                      <Button variant="outline" size="sm">
                        <RouteIcon className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>

                    {/* Assignment Info */}
                    {(route.assignedVehicleId || route.assignedDriverId) && (
                      <div className="text-right text-sm space-y-1">
                        {route.assignedVehicleId && (
                          <div>
                            <span className="text-gray-500">Vehicle: </span>
                            <Badge variant="outline">{route.assignedVehicleId}</Badge>
                          </div>
                        )}
                        {route.assignedDriverId && (
                          <div>
                            <span className="text-gray-500">Driver: </span>
                            <Badge variant="outline">{route.assignedDriverId}</Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {routes.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <RouteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
                <p className="text-gray-500">No delivery routes have been created yet.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RouteOptimization;
export { RouteOptimization };