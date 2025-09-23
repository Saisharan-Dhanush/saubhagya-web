/**
 * Food History Page - Shows food consumption history with filtering and pagination
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Edit, Trash2, Plus, Download } from 'lucide-react';

interface FoodHistoryRecord {
  id: number;
  foodName: string;
  batchName: string;
  type: string;
  shedNo: string;
  consumeQuantity: number;
  duration: string;
  date: string;
}

const mockData: FoodHistoryRecord[] = [
  {
    id: 1,
    foodName: 'Unprocessed Food',
    batchName: 'Batch-07',
    type: '',
    shedNo: 'Shed_1',
    consumeQuantity: 34,
    duration: 'morning',
    date: 'Apr 26, 2025'
  },
  {
    id: 2,
    foodName: 'Dry grass',
    batchName: 'Batch-03',
    type: '',
    shedNo: '',
    consumeQuantity: 12,
    duration: '1st half',
    date: 'Mar 30, 2025'
  },
  {
    id: 3,
    foodName: 'Dry grass',
    batchName: 'Batch-03',
    type: '',
    shedNo: '',
    consumeQuantity: 12,
    duration: 'Last Half of the day',
    date: 'Mar 02, 2025'
  }
];

export default function FoodHistory() {
  const navigate = useNavigate();
  const [foodHistory, setFoodHistory] = useState<FoodHistoryRecord[]>(mockData);
  const [filteredData, setFilteredData] = useState<FoodHistoryRecord[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterFoodName, setFilterFoodName] = useState('');
  const [filterBatchName, setFilterBatchName] = useState('');
  const [filterShedNo, setFilterShedNo] = useState('');
  const [filterDuration, setFilterDuration] = useState('');

  useEffect(() => {
    let filtered = foodHistory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shedNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.duration.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply specific filters
    if (filterFoodName) {
      filtered = filtered.filter(item =>
        item.foodName.toLowerCase().includes(filterFoodName.toLowerCase())
      );
    }
    if (filterBatchName) {
      filtered = filtered.filter(item =>
        item.batchName.toLowerCase().includes(filterBatchName.toLowerCase())
      );
    }
    if (filterShedNo) {
      filtered = filtered.filter(item =>
        item.shedNo.toLowerCase().includes(filterShedNo.toLowerCase())
      );
    }
    if (filterDuration) {
      filtered = filtered.filter(item =>
        item.duration.toLowerCase().includes(filterDuration.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterFoodName, filterBatchName, filterShedNo, filterDuration, foodHistory]);

  // Pagination
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentData = filteredData.slice(startIndex, endIndex);

  // Action handlers
  const handleView = (id: number) => {
    navigate(`/gaushala/food-history/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/gaushala/food-history/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this food history record?')) {
      // TODO: Implement delete API call
      setFoodHistory(prev => prev.filter(item => item.id !== id));
      console.log('Deleting food history record:', id);
    }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Food History</h1>
            <p className="text-gray-600 mt-1">Food History Listing</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => navigate('/gaushala/food-history/add')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Food Entry
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Filter by Food Name"
                    value={filterFoodName}
                    onChange={(e) => setFilterFoodName(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Filter by Batch Name"
                    value={filterBatchName}
                    onChange={(e) => setFilterBatchName(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Filter by Shed No"
                    value={filterShedNo}
                    onChange={(e) => setFilterShedNo(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Filter by Duration"
                    value={filterDuration}
                    onChange={(e) => setFilterDuration(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    Food Name
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
                    Consume Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                      {item.foodName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.batchName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.shedNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.consumeQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(item.id)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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