/**
 * RFID Analytics - Scan statistics and insights
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, TrendingUp, Tag, Clock, BarChart } from 'lucide-react';
import { rfidApi, type RFIDScanStats } from '../../../services/gaushala/api';
import { getLoggedInUserGaushalaId } from '../../../utils/auth';

export default function RFIDAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RFIDScanStats | null>(null);
  const [tagSearch, setTagSearch] = useState('');
  const [tagStats, setTagStats] = useState<{
    count: number;
    latestScan: string;
  } | null>(null);
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

      const response = await rfidApi.getScanStats(
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

  const handleTagSearch = async () => {
    if (!tagSearch.trim()) {
      alert('Please enter a tag ID');
      return;
    }

    try {
      const [countResponse, latestResponse] = await Promise.all([
        rfidApi.getScanCountByTag(tagSearch),
        rfidApi.getLatestScanByTag(tagSearch),
      ]);

      if (countResponse.success && latestResponse.success) {
        setTagStats({
          count: countResponse.data || 0,
          latestScan: latestResponse.data?.scanTimestamp || 'Never',
        });
      }
    } catch (error) {
      console.error('Error searching tag:', error);
      alert('Error searching tag');
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const clearDateRange = () => {
    setDateRange({ startDate: '', endDate: '' });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-IN');
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
        onClick={() => navigate('/gaushala/rfid/scans')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Back to Scan History
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-blue-100 p-3">
          <BarChart className="text-blue-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold">RFID Analytics</h1>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Clock className="text-gray-600" size={20} />
          <h3 className="font-semibold">Date Range Filter</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
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

      {/* Overall Statistics */}
      {stats ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Radio className="text-blue-600" size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Scans</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalScans}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Tag className="text-green-600" size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Unique Tags</p>
              <p className="text-3xl font-bold text-gray-900">{stats.uniqueTags}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-purple-100 p-3">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Scans/Day</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.averageScansPerDay.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Scan</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(stats.lastScanTime)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow mb-6">
          <Radio className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-600">No scan data available</p>
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

      {/* Tag-specific Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Tag-Specific Analytics</h3>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTagSearch()}
            className="flex-1 rounded-lg border px-4 py-2"
            placeholder="Enter Tag ID (e.g., A1B2C3D4)"
          />
          <button
            onClick={handleTagSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search Tag
          </button>
        </div>

        {tagStats && (
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Total Scans for Tag</p>
              <p className="text-2xl font-bold text-blue-600">{tagStats.count}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Latest Scan</p>
              <p className="text-sm font-medium text-gray-900">
                {tagStats.latestScan !== 'Never' ? formatDateTime(tagStats.latestScan) : 'Never'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
