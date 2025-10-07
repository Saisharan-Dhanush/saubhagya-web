/**
 * Milk Analytics - Production statistics and insights
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Droplet, Award, Calendar } from 'lucide-react';
import { milkProductionApi, type MilkProductionStats } from '../../../services/gaushala/api';
import { getLoggedInUserGaushalaId } from '../../../utils/auth';

export default function MilkAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MilkProductionStats | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadStats();
  }, [dateRange]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const gaushalaId = getLoggedInUserGaushalaId();
      if (!gaushalaId) {
        console.error('No gaushala ID found');
        return;
      }

      const response = await milkProductionApi.getMilkProductionStats(
        gaushalaId,
        dateRange.startDate || undefined,
        dateRange.endDate || undefined
      );

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const clearDateRange = () => {
    setDateRange({ startDate: '', endDate: '' });
  };

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
        onClick={() => navigate('/gaushala/production')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Back to Records
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-blue-100 p-3">
          <TrendingUp className="text-blue-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold">Milk Production Analytics</h1>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Calendar className="text-gray-600" size={20} />
          <h3 className="font-semibold">Date Range Filter</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearDateRange}
              className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Droplet className="text-blue-600" size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Production</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalQuantity.toFixed(2)} L
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Fat %</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.averageFatPercentage.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-purple-100 p-3">
                <Award className="text-purple-600" size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Average SNF %</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.averageSnfPercentage.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-yellow-100 p-3">
                <Calendar className="text-yellow-600" size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Records</p>
              <p className="text-3xl font-bold text-gray-900">{stats.recordCount}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Droplet className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-600">No production data available</p>
          {(dateRange.startDate || dateRange.endDate) && (
            <button
              onClick={clearDateRange}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Clear date filter to see all data
            </button>
          )}
        </div>
      )}

      {/* Additional Insights */}
      {stats && stats.recordCount > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Production Insights</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Average per Record</p>
              <p className="text-2xl font-bold text-blue-600">
                {(stats.totalQuantity / stats.recordCount).toFixed(2)} L
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Quality Index</p>
              <p className="text-2xl font-bold text-green-600">
                {((stats.averageFatPercentage + stats.averageSnfPercentage) / 2).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Combined Fat & SNF average</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
