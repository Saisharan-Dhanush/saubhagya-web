/**
 * Inventory List - Main inventory management page
 * Displays paginated inventory with search, low-stock alerts, and CRUD operations
 * 100% API-driven with NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  History,
} from 'lucide-react';
import {
  inventoryApi,
  type Inventory,
  type InventoryType,
  type PagedResponse,
} from '../../../services/gaushala/api';

export default function InventoryList() {
  const navigate = useNavigate();

  // State
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [inventoryTypes, setInventoryTypes] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Load inventory from API
  useEffect(() => {
    loadInventory();
  }, [currentPage]);

  // Load inventory types from API for filtering/display
  useEffect(() => {
    loadInventoryTypes();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const response = await inventoryApi.getAllInventory(currentPage, pageSize);
      if (response.success && response.data) {
        setInventory(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        console.error('Failed to load inventory:', response.error);
        setInventory([]);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryTypes = async () => {
    try {
      const response = await inventoryApi.getInventoryTypes();
      if (response.success && response.data) {
        setInventoryTypes(response.data);
      }
    } catch (error) {
      console.error('Error loading inventory types:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadInventory();
      return;
    }

    setLoading(true);
    try {
      const response = await inventoryApi.searchInventory(searchTerm);
      if (response.success && response.data) {
        setInventory(response.data);
        setTotalPages(1);
        setTotalElements(response.data.length);
      }
    } catch (error) {
      console.error('Error searching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) {
      return;
    }

    try {
      const response = await inventoryApi.deleteInventory(id);
      if (response.success) {
        loadInventory(); // Reload from backend
      } else {
        alert('Failed to delete inventory item: ' + response.error);
      }
    } catch (error) {
      console.error('Error deleting inventory:', error);
      alert('Error deleting inventory item');
    }
  };

  const getInventoryTypeName = (typeId: number): string => {
    const type = inventoryTypes.find(t => t.id === typeId);
    return type ? type.name : `Type ${typeId}`;
  };

  const isLowStock = (item: Inventory): boolean => {
    return item.quantity <= item.minimumStockLevel || 0;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage inventory items, stock levels, and reorder points
          </p>
        </div>
        <button
          onClick={() => navigate('/gaushala/inventory/add')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
          >
            <Search size={20} />
            Search
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-white p-4 shadow border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold">{totalElements}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <TrendingDown className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold">{inventory.filter(isLowStock).length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <Package className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-2xl font-bold">{inventory.filter(item => !isLowStock(item)).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : inventory.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-600">No inventory items found</p>
          <button
            onClick={() => navigate('/gaushala/inventory/add')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Add your first item
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.itemName || item.description || `Item #${item.id}`}</div>
                    {item.supplier && (
                      <div className="text-sm text-gray-500">Supplier: {item.supplier}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getInventoryTypeName(item.inventoryTypeId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.minimumStockLevel || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isLowStock(item) ? (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle size={16} />
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600">In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/gaushala/inventory/${item.id}/stock-history`)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Stock History"
                      >
                        <History size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/gaushala/inventory/edit/${item.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{currentPage * pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min((currentPage + 1) * pageSize, totalElements)}
                  </span>{' '}
                  of <span className="font-medium">{totalElements}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
