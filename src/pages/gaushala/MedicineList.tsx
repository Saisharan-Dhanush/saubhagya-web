/**
 * Medicine List Page - Shows all medicine inventory with filtering and pagination
 * Mapped to backend Medicine.java entity with exact field names
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Edit, Trash2, Plus, Download, AlertCircle, Package } from 'lucide-react';
import { medicineApi, type Medicine } from '../../services/gaushala/api';

export default function MedicineList() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredData, setFilteredData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterName, setFilterName] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterExpiry, setFilterExpiry] = useState<'all' | 'expired' | 'expiring_soon' | 'valid'>('all');

  useEffect(() => {
    fetchMedicines();
  }, [currentPage, entriesPerPage]);

  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await medicineApi.getAllMedicines(currentPage - 1, entriesPerPage);

      if (result.success && result.data) {
        setMedicines(result.data.content || []);
        setFilteredData(result.data.content || []);
        setTotalPages(result.data.totalPages || 1);
        setTotalItems(result.data.totalElements || 0);
      } else {
        setError(result.error || 'Failed to load medicines');
        setMedicines([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setError('Failed to load medicines');
      setMedicines([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (dateString?: string): boolean => {
    if (!dateString) return false;
    try {
      const expiryDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return expiryDate < today;
    } catch {
      return false;
    }
  };

  const isExpiringSoon = (dateString?: string): boolean => {
    if (!dateString) return false;
    try {
      const expiryDate = new Date(dateString);
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let filtered = medicines;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.manufacturer && item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.batchNumber && item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply specific filters
    if (filterName) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterManufacturer) {
      filtered = filtered.filter(item =>
        item.manufacturer && item.manufacturer.toLowerCase().includes(filterManufacturer.toLowerCase())
      );
    }
    if (filterUnit) {
      filtered = filtered.filter(item =>
        item.unit.toLowerCase() === filterUnit.toLowerCase()
      );
    }

    // Apply expiry filter
    if (filterExpiry !== 'all') {
      filtered = filtered.filter(item => {
        if (filterExpiry === 'expired') return isExpired(item.expiryDate);
        if (filterExpiry === 'expiring_soon') return isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate);
        if (filterExpiry === 'valid') return !isExpired(item.expiryDate) && !isExpiringSoon(item.expiryDate);
        return true;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, filterName, filterManufacturer, filterUnit, filterExpiry, medicines]);

  // Action handlers
  const handleView = (id: number) => {
    navigate(`/gaushala/medicine/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/gaushala/medicine/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this medicine record?')) {
      return;
    }

    try {
      const result = await medicineApi.deleteMedicine(id);

      if (result.success) {
        // Refresh the list after successful deletion
        fetchMedicines();
      } else {
        alert(result.error || 'Failed to delete medicine record');
      }
    } catch (error) {
      console.error('Error deleting medicine record:', error);
      alert('Failed to delete medicine record');
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

  if (loading && medicines.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading medicines...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Inventory</h1>
          <p className="text-gray-600 mt-1">Manage medicine stock and inventory</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => navigate('/gaushala/medicine/add')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Medicine
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
                placeholder="Search medicines..."
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
                  placeholder="Filter by Medicine Name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Filter by Manufacturer"
                  value={filterManufacturer}
                  onChange={(e) => setFilterManufacturer(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={filterUnit}
                  onChange={(e) => setFilterUnit(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Units</option>
                  <option value="mg">Milligrams (mg)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="g">Grams (g)</option>
                  <option value="tablets">Tablets</option>
                  <option value="capsules">Capsules</option>
                  <option value="units">Units</option>
                </select>
                <select
                  value={filterExpiry}
                  onChange={(e) => setFilterExpiry(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Medicines</option>
                  <option value="expired">Expired Only</option>
                  <option value="expiring_soon">Expiring Soon (30 days)</option>
                  <option value="valid">Valid Only</option>
                </select>
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
                  Medicine Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manufacturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                    {loading ? 'Loading...' : 'No medicine records found'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const expired = isExpired(item.expiryDate);
                  const expiringSoon = isExpiringSoon(item.expiryDate);
                  const lowStock = item.quantity < 10;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.dosage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className={lowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                            {item.quantity} {item.unit}
                          </span>
                          {lowStock && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Low</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={expired ? 'text-red-600 font-semibold' : expiringSoon ? 'text-amber-600 font-semibold' : 'text-gray-900'}>
                          {formatDate(item.expiryDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.manufacturer || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {expired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <AlertCircle className="h-3 w-3" />
                            Expired
                          </span>
                        ) : expiringSoon ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            <AlertCircle className="h-3 w-3" />
                            Expiring Soon
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            ✓ Valid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(item.id!)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item.id!)}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id!)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
