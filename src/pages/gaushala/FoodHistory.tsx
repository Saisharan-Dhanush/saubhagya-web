/**
 * Food History Page - Shows food consumption history with filtering and pagination
 * Mapped to backend FoodHistoryDTO with exact field names
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Edit, Trash2, Plus, Download } from 'lucide-react';
import { foodHistoryApi, type FoodHistory } from '../../services/gaushala/api';

export default function FoodHistory() {
  const navigate = useNavigate();
  const [foodHistory, setFoodHistory] = useState<FoodHistory[]>([]);
  const [filteredData, setFilteredData] = useState<FoodHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterLivestockId, setFilterLivestockId] = useState('');
  const [filterShedId, setFilterShedId] = useState('');
  const [filterInventoryId, setFilterInventoryId] = useState('');
  const [filterDuration, setFilterDuration] = useState('');

  useEffect(() => {
    fetchFoodHistory();
  }, [currentPage, entriesPerPage]);

  const fetchFoodHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await foodHistoryApi.getAllFoodHistory(currentPage - 1, entriesPerPage);

      if (result.success && result.data) {
        setFoodHistory(result.data.content || []);
        setFilteredData(result.data.content || []);
        setTotalPages(result.data.totalPages || 1);
        setTotalItems(result.data.totalElements || 0);
      } else {
        setError(result.error || 'Failed to load food history');
        setFoodHistory([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching food history:', error);
      setError('Failed to load food history');
      setFoodHistory([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = foodHistory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.livestockId.toString().includes(searchTerm) ||
        item.shedId.toString().includes(searchTerm) ||
        item.inventoryId.toString().includes(searchTerm) ||
        item.duration.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply specific filters
    if (filterLivestockId) {
      filtered = filtered.filter(item =>
        item.livestockId.toString().includes(filterLivestockId)
      );
    }
    if (filterShedId) {
      filtered = filtered.filter(item =>
        item.shedId.toString().includes(filterShedId)
      );
    }
    if (filterInventoryId) {
      filtered = filtered.filter(item =>
        item.inventoryId.toString().includes(filterInventoryId)
      );
    }
    if (filterDuration) {
      filtered = filtered.filter(item =>
        item.duration.toLowerCase().includes(filterDuration.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, filterLivestockId, filterShedId, filterInventoryId, filterDuration, foodHistory]);

  // Action handlers
  const handleView = (id: number) => {
    navigate(`/gaushala/food-history/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/gaushala/food-history/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this food history record?')) {
      return;
    }

    try {
      const result = await foodHistoryApi.deleteFoodHistory(id);

      if (result.success) {
        // Refresh the list after successful deletion
        fetchFoodHistory();
      } else {
        alert(result.error || 'Failed to delete food history record');
      }
    } catch (error) {
      console.error('Error deleting food history record:', error);
      alert('Failed to delete food history record');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate display values
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + filteredData.length, totalItems);

  if (loading && foodHistory.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading food history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food History</h1>
          <p className="text-gray-600 mt-1">Food consumption history and records</p>
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <span className="text-red-500">⚠</span>
            {error}
          </div>
        </div>
      )}

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
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
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
                  placeholder="Filter by Livestock ID"
                  value={filterLivestockId}
                  onChange={(e) => setFilterLivestockId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Filter by Shed ID"
                  value={filterShedId}
                  onChange={(e) => setFilterShedId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Filter by Inventory ID"
                  value={filterInventoryId}
                  onChange={(e) => setFilterInventoryId(e.target.value)}
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
                  Livestock ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shed ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consume Quantity (kg)
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
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading...' : 'No food history records found'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.livestockId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.shedId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.inventoryId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.consumeQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(item.date)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {endIndex} of {totalItems} entries
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
              <span className="text-sm text-gray-500">of {totalPages}</span>
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
