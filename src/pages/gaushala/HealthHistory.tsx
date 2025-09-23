/**
 * Health History Page - Shows health history records with filtering and pagination
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Edit, Trash2, Plus, Download, Calendar } from 'lucide-react';

interface HealthHistoryRecord {
  id: number;
  batchName: string;
  type: string;
  shedNo: string;
  doctor: string;
  identifyDate: string;
  startDate: string;
  endDate: string;
  nextFollowUpDate: string;
}

const mockData: HealthHistoryRecord[] = [
  {
    id: 1,
    batchName: 'Batch-04',
    type: '',
    shedNo: 'Shed_1',
    doctor: 'Mr. User',
    identifyDate: 'Apr 17, 2025',
    startDate: 'Apr 17, 2025',
    endDate: 'Apr 18, 2025',
    nextFollowUpDate: 'Apr 27, 2025'
  },
  {
    id: 2,
    batchName: 'Batch-07',
    type: '',
    shedNo: '',
    doctor: 'Mr. User',
    identifyDate: 'Apr 02, 2025',
    startDate: 'Apr 02, 2025',
    endDate: 'Apr 04, 2025',
    nextFollowUpDate: 'Apr 12, 2025'
  },
  {
    id: 3,
    batchName: 'Batch-06',
    type: '',
    shedNo: 'Shed_1',
    doctor: 'Mr. User',
    identifyDate: 'Mar 14, 2025',
    startDate: 'Mar 04, 2025',
    endDate: 'Mar 04, 2025',
    nextFollowUpDate: 'Mar 20, 2025'
  }
];

export default function HealthHistory() {
  const navigate = useNavigate();
  const [healthHistory, setHealthHistory] = useState<HealthHistoryRecord[]>(mockData);
  const [filteredData, setFilteredData] = useState<HealthHistoryRecord[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterBatchName, setFilterBatchName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterIdentifyDate, setFilterIdentifyDate] = useState('');
  const [filterNextFollowUpDate, setFilterNextFollowUpDate] = useState('');

  useEffect(() => {
    let filtered = healthHistory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shedNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.identifyDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nextFollowUpDate.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply specific filters
    if (filterBatchName && filterBatchName !== 'all') {
      filtered = filtered.filter(item =>
        item.batchName.toLowerCase().includes(filterBatchName.toLowerCase())
      );
    }
    if (filterType && filterType !== 'all') {
      filtered = filtered.filter(item =>
        item.type.toLowerCase().includes(filterType.toLowerCase())
      );
    }
    if (filterDoctor && filterDoctor !== 'all') {
      filtered = filtered.filter(item =>
        item.doctor.toLowerCase().includes(filterDoctor.toLowerCase())
      );
    }
    if (filterIdentifyDate) {
      filtered = filtered.filter(item =>
        item.identifyDate.toLowerCase().includes(filterIdentifyDate.toLowerCase())
      );
    }
    if (filterNextFollowUpDate) {
      filtered = filtered.filter(item =>
        item.nextFollowUpDate.toLowerCase().includes(filterNextFollowUpDate.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterBatchName, filterType, filterDoctor, filterIdentifyDate, filterNextFollowUpDate, healthHistory]);

  // Pagination
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health History</h1>
          <p className="text-gray-600 mt-1">Health History Listing</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => navigate('/gaushala/health-history/add')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Controls */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left side - Show entries and Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filter Box
              </button>
            </div>

            {/* Right side - Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Box */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Batch Name</label>
                  <select
                    value={filterBatchName}
                    onChange={(e) => setFilterBatchName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">------ All ------</option>
                    <option value="Batch-04">Batch-04</option>
                    <option value="Batch-06">Batch-06</option>
                    <option value="Batch-07">Batch-07</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">------ All ------</option>
                    <option value="checkup">Check-up</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="treatment">Treatment</option>
                    <option value="surgery">Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Identify Date</label>
                  <input
                    type="date"
                    value={filterIdentifyDate}
                    onChange={(e) => setFilterIdentifyDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Doctor</label>
                  <select
                    value={filterDoctor}
                    onChange={(e) => setFilterDoctor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">------ All ------</option>
                    <option value="Mr. User">Mr. User</option>
                    <option value="Dr. Smith">Dr. Smith</option>
                    <option value="Dr. Johnson">Dr. Johnson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Next Follow Up Date</label>
                  <input
                    type="date"
                    value={filterNextFollowUpDate}
                    onChange={(e) => setFilterNextFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shed No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identify Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Follow Up Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {item.batchName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.shedNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.doctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.identifyDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.nextFollowUpDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}