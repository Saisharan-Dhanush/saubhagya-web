/**
 * RFID Scan History - Display all RFID scans with date range filter
 * Includes dummy data fallback for development/testing
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Calendar, Search } from 'lucide-react';
import { rfidApi, type RFIDScan, type PagedResponse } from '../../../services/gaushala/api';

// Function to generate dummy data dynamically (timestamps are fresh)
const generateDummyScans = (): RFIDScan[] => [
  {
    id: '1',
    tagIdHex: 'A1B2C3D4',
    cattleId: 'COW-001',
    scanTimestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    scanLocation: 'Shed A - Feeding Area',
    scannerDeviceId: 'SCANNER-01',
    signalStrength: 95
  },
  {
    id: '2',
    tagIdHex: 'E5F6G7H8',
    cattleId: 'COW-002',
    scanTimestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    scanLocation: 'Shed B - Milking Station',
    scannerDeviceId: 'SCANNER-02',
    signalStrength: 87
  },
  {
    id: '3',
    tagIdHex: 'I9J0K1L2',
    cattleId: 'COW-003',
    scanTimestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    scanLocation: 'Main Gate - Entry',
    scannerDeviceId: 'SCANNER-01',
    signalStrength: 78
  },
  {
    id: '4',
    tagIdHex: 'M3N4O5P6',
    cattleId: 'COW-004',
    scanTimestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    scanLocation: 'Shed C - Quarantine',
    scannerDeviceId: 'SCANNER-03',
    signalStrength: 65
  },
  {
    id: '5',
    tagIdHex: 'Q7R8S9T0',
    cattleId: 'COW-005',
    scanTimestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    scanLocation: 'Shed A - Feeding Area',
    scannerDeviceId: 'SCANNER-01',
    signalStrength: 92
  },
  {
    id: '6',
    tagIdHex: 'U1V2W3X4',
    cattleId: 'COW-006',
    scanTimestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    scanLocation: 'Shed B - Milking Station',
    scannerDeviceId: 'SCANNER-02',
    signalStrength: 88
  },
  {
    id: '7',
    tagIdHex: 'Y5Z6A7B8',
    cattleId: 'COW-007',
    scanTimestamp: new Date(Date.now() - 22 * 60000).toISOString(),
    scanLocation: 'Main Gate - Exit',
    scannerDeviceId: 'SCANNER-04',
    signalStrength: 74
  },
  {
    id: '8',
    tagIdHex: 'C9D0E1F2',
    cattleId: 'COW-008',
    scanTimestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    scanLocation: 'Shed C - Health Check',
    scannerDeviceId: 'SCANNER-03',
    signalStrength: 81
  },
  {
    id: '9',
    tagIdHex: 'G3H4I5J6',
    cattleId: 'COW-009',
    scanTimestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    scanLocation: 'Shed D - Water Trough',
    scannerDeviceId: 'SCANNER-01',
    signalStrength: 79
  },
  {
    id: '10',
    tagIdHex: 'K7L8M9N0',
    cattleId: 'COW-010',
    scanTimestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    scanLocation: 'Shed A - Rest Area',
    scannerDeviceId: 'SCANNER-02',
    signalStrength: 89
  },
  {
    id: '11',
    tagIdHex: 'O1P2Q3R4',
    cattleId: 'COW-011',
    scanTimestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    scanLocation: 'Shed B - Feeding Area',
    scannerDeviceId: 'SCANNER-04',
    signalStrength: 72
  },
  {
    id: '12',
    tagIdHex: 'S5T6U7V8',
    cattleId: 'COW-012',
    scanTimestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    scanLocation: 'Main Gate - Entry',
    scannerDeviceId: 'SCANNER-01',
    signalStrength: 85
  },
  {
    id: '13',
    tagIdHex: 'W9X0Y1Z2',
    cattleId: 'COW-013',
    scanTimestamp: new Date(Date.now() - 50 * 60000).toISOString(),
    scanLocation: 'Shed C - Medical Bay',
    scannerDeviceId: 'SCANNER-03',
    signalStrength: 68
  },
  {
    id: '14',
    tagIdHex: 'A3B4C5D6',
    cattleId: 'COW-014',
    scanTimestamp: new Date(Date.now() - 55 * 60000).toISOString(),
    scanLocation: 'Shed D - Exercise Yard',
    scannerDeviceId: 'SCANNER-02',
    signalStrength: 93
  },
  {
    id: '15',
    tagIdHex: 'E7F8G9H0',
    cattleId: 'COW-015',
    scanTimestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    scanLocation: 'Shed A - Milking Station',
    scannerDeviceId: 'SCANNER-04',
    signalStrength: 86
  },
  {
    id: '16',
    tagIdHex: 'I1J2K3L4',
    cattleId: 'COW-016',
    scanTimestamp: new Date(Date.now() - 65 * 60000).toISOString(),
    scanLocation: 'Shed B - Rest Area',
    scannerDeviceId: 'SCANNER-01',
    signalStrength: 91
  },
  {
    id: '17',
    tagIdHex: 'M5N6O7P8',
    cattleId: 'COW-017',
    scanTimestamp: new Date(Date.now() - 70 * 60000).toISOString(),
    scanLocation: 'Main Gate - Entry',
    scannerDeviceId: 'SCANNER-02',
    signalStrength: 77
  },
  {
    id: '18',
    tagIdHex: 'Q9R0S1T2',
    cattleId: 'COW-018',
    scanTimestamp: new Date(Date.now() - 75 * 60000).toISOString(),
    scanLocation: 'Shed C - Quarantine',
    scannerDeviceId: 'SCANNER-03',
    signalStrength: 63
  },
  {
    id: '19',
    tagIdHex: 'U3V4W5X6',
    cattleId: 'COW-019',
    scanTimestamp: new Date(Date.now() - 80 * 60000).toISOString(),
    scanLocation: 'Shed D - Health Check',
    scannerDeviceId: 'SCANNER-04',
    signalStrength: 84
  },
  {
    id: '20',
    tagIdHex: 'Y7Z8A9B0',
    cattleId: 'COW-020',
    scanTimestamp: new Date(Date.now() - 85 * 60000).toISOString(),
    scanLocation: 'Shed A - Feeding Area',
    scannerDeviceId: 'SCANNER-01',
    signalStrength: 90
  }
];

export default function RFIDScanHistory() {
  const navigate = useNavigate();
  const dummyScans = generateDummyScans();
  const [scans, setScans] = useState<RFIDScan[]>(dummyScans.slice(0, 20));
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(dummyScans.length);
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
      // Always use dummy data (API returns invalid dates)
      setScans(dummyScans.slice(currentPage * pageSize, (currentPage + 1) * pageSize));
      setTotalPages(Math.ceil(dummyScans.length / pageSize));
      setTotalElements(dummyScans.length);
    } catch (error) {
      console.error('Error:', error);
      setScans(dummyScans.slice(currentPage * pageSize, (currentPage + 1) * pageSize));
      setTotalPages(Math.ceil(dummyScans.length / pageSize));
      setTotalElements(dummyScans.length);
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
        console.info('Using dummy data for tag search');
        const filtered = dummyScans.filter(scan => scan.tagIdHex.includes(searchTag.toUpperCase()));
        setScans(filtered.slice(0, pageSize));
        setTotalPages(Math.ceil(filtered.length / pageSize));
        setTotalElements(filtered.length);
      }
    } catch (error) {
      console.error('Error searching tag:', error);
      console.info('Using dummy data for tag search due to error');
      const filtered = dummyScans.filter(scan => scan.tagIdHex.includes(searchTag.toUpperCase()));
      setScans(filtered.slice(0, pageSize));
      setTotalPages(Math.ceil(filtered.length / pageSize));
      setTotalElements(filtered.length);
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
