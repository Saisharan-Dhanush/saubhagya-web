/**
 * RFID Scan History - Display all RFID scans with date range filter
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Calendar, Search } from 'lucide-react';
import { rfidApi, type RFIDScan, type PagedResponse } from '../../../services/gaushala/api';

export default function RFIDScanHistory() {
  const navigate = useNavigate();
  const [scans, setScans] = useState<RFIDScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [searchTag, setSearchTag] = useState('');
  const pageSize = 20;

  useEffect(() => {
    loadScans();
  }, [currentPage, dateRange]);

  const loadScans = async () => {
    setLoading(true);
    try {
      let response;

      if (dateRange.startDate && dateRange.endDate) {
        response = await rfidApi.getScansByDateRange(
          dateRange.startDate,
          dateRange.endDate,
          currentPage,
          pageSize
        );
      } else {
        response = await rfidApi.getAllScans(currentPage, pageSize);
      }

      if (response.success && response.data) {
        setScans(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        setScans([]);
      }
    } catch (error) {
      console.error('Error loading scans:', error);
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(0);
  };

  const handleSearchTag = async () => {
    if (!searchTag.trim()) {
      alert('Please enter a tag ID');
      return;
    }

    setLoading(true);
    try {
      const response = await rfidApi.getScansByTag(searchTag, currentPage, pageSize);
      if (response.success && response.data) {
        setScans(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        setScans([]);
      }
    } catch (error) {
      console.error('Error searching tag:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setSearchTag('');
    setCurrentPage(0);
    loadScans();
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-IN');
  };

  const getSignalStrengthColor = (strength?: number): string => {
    if (!strength) return 'text-gray-400';
    if (strength >= 80) return 'text-green-600';
    if (strength >= 50) return 'text-yellow-600';
    return 'text-red-600';
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RFID Scan History</h1>
          <p className="text-gray-600 mt-1">Total: {totalElements} scans</p>
        </div>
        <button
          onClick={() => navigate('/gaushala/rfid/analytics')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          View Analytics
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range Filter */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-gray-600" size={16} />
              <label className="text-sm font-medium text-gray-700">Date Range</label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="End Date"
              />
            </div>
          </div>

          {/* Tag Search */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Search className="text-gray-600" size={16} />
              <label className="text-sm font-medium text-gray-700">Search Tag</label>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchTag()}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
                placeholder="Enter Tag ID"
              />
              <button
                onClick={handleSearchTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {(dateRange.startDate || dateRange.endDate || searchTag) && (
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Scan List */}
      {scans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Radio className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-600">No RFID scans found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tag ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cattle ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Scanner Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Signal Strength
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(scan.scanTimestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                      {scan.tagIdHex}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {scan.cattleId ? `#${scan.cattleId}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {scan.scanLocation || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scan.scannerDeviceId || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getSignalStrengthColor(scan.signalStrength)}`}>
                        {scan.signalStrength ? `${scan.signalStrength}%` : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
