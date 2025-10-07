/**
 * Shed Capacity Dashboard - Analytics and utilization metrics
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { shedApi, type Shed, type ShedCapacity } from '../../../services/gaushala/api';
import { getLoggedInUserGaushalaId } from '../../../utils/auth';

export default function ShedCapacityDashboard() {
  const navigate = useNavigate();
  const [sheds, setSheds] = useState<Shed[]>([]);
  const [capacityData, setCapacityData] = useState<ShedCapacity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCapacityData();
  }, []);

  const loadCapacityData = async () => {
    setLoading(true);
    try {
      const gaushalaId = getLoggedInUserGaushalaId();
      if (!gaushalaId) {
        console.error('No gaushala ID found');
        return;
      }

      const [shedsResponse, capacityResponse] = await Promise.all([
        shedApi.getAllSheds(0, 100),
        shedApi.getAvailableCapacity(gaushalaId),
      ]);

      if (shedsResponse.success && shedsResponse.data) {
        setSheds(shedsResponse.data.content);
      }

      if (capacityResponse.success && capacityResponse.data) {
        setCapacityData(capacityResponse.data);
      }
    } catch (error) {
      console.error('Error loading capacity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationPercentage = (shed: Shed): number => {
    if (shed.capacity === 0) return 0;
    return (shed.currentOccupancy / shed.capacity) * 100;
  };

  const getUtilizationStatus = (percentage: number): { color: string; label: string } => {
    if (percentage >= 90) return { color: 'bg-red-500', label: 'Critical' };
    if (percentage >= 70) return { color: 'bg-yellow-500', label: 'High' };
    if (percentage >= 50) return { color: 'bg-blue-500', label: 'Moderate' };
    return { color: 'bg-green-500', label: 'Low' };
  };

  const overcrowdedSheds = sheds.filter(shed => getUtilizationPercentage(shed) >= 90);
  const highUtilizationSheds = sheds.filter(shed => {
    const util = getUtilizationPercentage(shed);
    return util >= 70 && util < 90;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/gaushala/sheds')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Back to Sheds
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-blue-100 p-3">
          <Home className="text-blue-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold">Shed Capacity Analytics</h1>
      </div>

      {/* Summary Stats */}
      {capacityData && (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold">{capacityData.totalCapacity}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Home className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Occupancy</p>
                <p className="text-2xl font-bold">{capacityData.totalOccupancy}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <TrendingUp className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Space</p>
                <p className="text-2xl font-bold">{capacityData.availableCapacity}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <TrendingDown className="text-purple-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization Rate</p>
                <p className="text-2xl font-bold">
                  {capacityData.utilizationPercentage.toFixed(1)}%
                </p>
              </div>
              <div
                className={`rounded-full p-3 ${
                  capacityData.utilizationPercentage >= 90
                    ? 'bg-red-100'
                    : capacityData.utilizationPercentage >= 70
                    ? 'bg-yellow-100'
                    : 'bg-green-100'
                }`}
              >
                <AlertCircle
                  className={
                    capacityData.utilizationPercentage >= 90
                      ? 'text-red-600'
                      : capacityData.utilizationPercentage >= 70
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Section */}
      {overcrowdedSheds.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-600" size={20} />
            <h3 className="font-semibold text-red-900">Overcrowded Sheds ({overcrowdedSheds.length})</h3>
          </div>
          <div className="space-y-2">
            {overcrowdedSheds.map(shed => (
              <div key={shed.id} className="flex items-center justify-between text-sm">
                <span className="text-red-800">
                  {shed.shedName} ({shed.shedNumber})
                </span>
                <span className="font-medium text-red-900">
                  {getUtilizationPercentage(shed).toFixed(1)}% - {shed.currentOccupancy}/{shed.capacity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {highUtilizationSheds.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-yellow-600" size={20} />
            <h3 className="font-semibold text-yellow-900">High Utilization Sheds ({highUtilizationSheds.length})</h3>
          </div>
          <div className="space-y-2">
            {highUtilizationSheds.map(shed => (
              <div key={shed.id} className="flex items-center justify-between text-sm">
                <span className="text-yellow-800">
                  {shed.shedName} ({shed.shedNumber})
                </span>
                <span className="font-medium text-yellow-900">
                  {getUtilizationPercentage(shed).toFixed(1)}% - {shed.currentOccupancy}/{shed.capacity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Shed Utilization */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Shed Utilization Breakdown</h3>

        {sheds.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Home className="mx-auto text-gray-400 mb-4" size={48} />
            <p>No sheds found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sheds.map(shed => {
              const utilization = getUtilizationPercentage(shed);
              const status = getUtilizationStatus(utilization);

              return (
                <div key={shed.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{shed.shedName}</h4>
                      <p className="text-sm text-gray-600">{shed.shedNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Occupancy</p>
                      <p className="font-semibold">
                        {shed.currentOccupancy} / {shed.capacity}
                      </p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Utilization</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          utilization >= 90 ? 'bg-red-100 text-red-800' :
                          utilization >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {status.label}
                        </span>
                        <span className="font-medium">{utilization.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${status.color}`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm mt-3 pt-3 border-t">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-medium">{shed.shedType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Area</p>
                      <p className="font-medium">{shed.areaSqFt ? `${shed.areaSqFt} sq ft` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        shed.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shed.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
