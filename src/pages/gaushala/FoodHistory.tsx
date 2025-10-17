/**
 * Food History Page - Shows food consumption history with filtering and pagination
 * Mapped to backend FoodHistoryDTO with exact field names
 * Features: Multi-column sorting, column visibility management, drag-and-drop reordering
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Edit, Trash2, Plus, Download, ArrowUpDown, ArrowUp, ArrowDown, Columns, Eye as EyeIcon, EyeOff, X, GripVertical } from 'lucide-react';
import { foodHistoryApi, type FoodHistory } from '../../services/gaushala/api';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Define all sortable columns
type SortableColumn = 'cattleName' | 'shed' | 'feedItem' | 'quantity' | 'duration' | 'date';

// Sort configuration
interface SortConfig {
  column: SortableColumn;
  direction: 'asc' | 'desc';
}

// Column configuration
interface ColumnConfig {
  key: SortableColumn | 'sl' | 'action';
  label: string;
  visible: boolean;
  order: number;
  sortable: boolean;
}

// localStorage version for schema changes
const COLUMNS_VERSION = 1;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Initialize columns from localStorage or defaults
const initializeColumns = (): ColumnConfig[] => {
  try {
    const savedVersion = localStorage.getItem('foodHistoryColumnsVersion');
    const savedColumns = localStorage.getItem('foodHistoryColumns');

    // Check version compatibility
    if (savedVersion === COLUMNS_VERSION.toString() && savedColumns) {
      return JSON.parse(savedColumns);
    }
  } catch (error) {
    console.error('Error loading saved columns:', error);
  }

  // Default column configuration
  return [
    { key: 'sl', label: 'SL.', visible: true, order: 0, sortable: false },
    { key: 'cattleName', label: 'Cattle Name', visible: true, order: 1, sortable: true },
    { key: 'shed', label: 'Shed', visible: true, order: 2, sortable: true },
    { key: 'feedItem', label: 'Feed Item', visible: true, order: 3, sortable: true },
    { key: 'quantity', label: 'Quantity', visible: true, order: 4, sortable: true },
    { key: 'duration', label: 'Duration', visible: true, order: 5, sortable: true },
    { key: 'date', label: 'Date', visible: true, order: 6, sortable: true },
    { key: 'action', label: 'Action', visible: true, order: 7, sortable: false },
  ];
};

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

  // Table customization states
  const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>(initializeColumns);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<SortableColumn | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<SortableColumn | null>(null);

  // ============================================================================
  // COLUMN MANAGEMENT FUNCTIONS
  // ============================================================================

  // Save columns to localStorage
  const saveColumnsToStorage = (cols: ColumnConfig[]) => {
    localStorage.setItem('foodHistoryColumns', JSON.stringify(cols));
    localStorage.setItem('foodHistoryColumnsVersion', COLUMNS_VERSION.toString());
  };

  // Get visible columns sorted by order
  const getVisibleColumns = (): ColumnConfig[] => {
    return columns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (key: ColumnConfig['key']) => {
    // Action column must always be visible
    if (key === 'action') return;

    const updated = columns.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    setColumns(updated);
    saveColumnsToStorage(updated);
  };

  // Reset columns to default
  const resetColumns = () => {
    const defaultCols = initializeColumns();
    setColumns(defaultCols);
    saveColumnsToStorage(defaultCols);
    setSortConfig([]);
  };

  // ============================================================================
  // DRAG-AND-DROP HANDLERS
  // ============================================================================

  const handleDragStart = (column: SortableColumn) => {
    setDraggedColumn(column);
  };

  const handleDragOver = (e: React.DragEvent, column: SortableColumn) => {
    e.preventDefault();
    setDragOverColumn(column);
  };

  const handleDrop = (e: React.DragEvent, targetColumn: SortableColumn) => {
    e.preventDefault();

    if (!draggedColumn || draggedColumn === targetColumn) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const draggedIndex = columns.findIndex(col => col.key === draggedColumn);
    const targetIndex = columns.findIndex(col => col.key === targetColumn);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    // Create new order
    const newColumns = [...columns];
    const [draggedCol] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedCol);

    // Update order values
    const updatedColumns = newColumns.map((col, index) => ({
      ...col,
      order: index,
    }));

    setColumns(updatedColumns);
    saveColumnsToStorage(updatedColumns);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // ============================================================================
  // SORTING FUNCTIONS
  // ============================================================================

  // Handle column sort
  const handleSort = (column: SortableColumn, shiftKey: boolean) => {
    // Check if column is already sorted
    const existingIndex = sortConfig.findIndex(sc => sc.column === column);

    if (!shiftKey) {
      // Single sort mode
      if (existingIndex !== -1) {
        const existing = sortConfig[existingIndex];
        if (existing.direction === 'asc') {
          // Change to desc
          setSortConfig([{ column, direction: 'desc' }]);
        } else {
          // Clear sort
          setSortConfig([]);
        }
      } else {
        // Add new asc sort
        setSortConfig([{ column, direction: 'asc' }]);
      }
    } else {
      // Multi-sort mode (Shift+Click)
      if (existingIndex !== -1) {
        const existing = sortConfig[existingIndex];
        if (existing.direction === 'asc') {
          // Change to desc
          const updated = [...sortConfig];
          updated[existingIndex] = { column, direction: 'desc' };
          setSortConfig(updated);
        } else {
          // Remove this sort
          setSortConfig(sortConfig.filter(sc => sc.column !== column));
        }
      } else {
        // Add new asc sort
        setSortConfig([...sortConfig, { column, direction: 'asc' }]);
      }
    }
  };

  // Get sort indicator for a column
  const getSortIndicator = (column: SortableColumn) => {
    const index = sortConfig.findIndex(sc => sc.column === column);
    if (index === -1) return <ArrowUpDown className="h-3 w-3 text-gray-400" />;

    const config = sortConfig[index];
    const Icon = config.direction === 'asc' ? ArrowUp : ArrowDown;

    return (
      <div className="flex items-center gap-1">
        <Icon className="h-3 w-3 text-blue-600" />
        {sortConfig.length > 1 && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center">
            {index + 1}
          </span>
        )}
      </div>
    );
  };

  // Apply sorting to data
  const applySorting = (data: FoodHistory[]): FoodHistory[] => {
    if (sortConfig.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const config of sortConfig) {
        let comparison = 0;

        switch (config.column) {
          case 'cattleName':
            comparison = (a.livestock?.name || '').localeCompare(b.livestock?.name || '');
            break;
          case 'shed':
            comparison = (a.shed?.shedName || '').localeCompare(b.shed?.shedName || '');
            break;
          case 'feedItem':
            comparison = (a.inventory?.itemName || '').localeCompare(b.inventory?.itemName || '');
            break;
          case 'quantity':
            comparison = (a.consumeQuantity || 0) - (b.consumeQuantity || 0);
            break;
          case 'duration':
            comparison = a.duration.localeCompare(b.duration);
            break;
          case 'date':
            comparison = new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
            break;
        }

        if (comparison !== 0) {
          return config.direction === 'asc' ? comparison : -comparison;
        }
      }

      return 0;
    });
  };

  // ============================================================================
  // CELL RENDERING
  // ============================================================================

  const renderCellContent = (column: ColumnConfig['key'], item: FoodHistory, index: number) => {
    switch (column) {
      case 'sl':
        return startIndex + index + 1;

      case 'cattleName':
        return (
          <div className="flex flex-col">
            <span className="font-semibold">{item.livestock?.name || 'Unknown'}</span>
            <span className="text-xs text-gray-500">{item.livestock?.uniqueAnimalId || `ID: ${item.livestockId}`}</span>
          </div>
        );

      case 'shed':
        return (
          <div className="flex flex-col">
            <span className="font-medium">{item.shed?.shedName || 'Unknown'}</span>
            <span className="text-xs text-gray-500">{item.shed?.shedNumber || `ID: ${item.shedId}`}</span>
          </div>
        );

      case 'feedItem':
        return (
          <div className="flex flex-col">
            <span className="font-medium">{item.inventory?.itemName || 'Unknown'}</span>
            <span className="text-xs text-gray-500">{item.inventory?.typeName || ''} {item.inventory?.unitName ? `(${item.inventory.unitName})` : ''}</span>
          </div>
        );

      case 'quantity':
        return `${item.consumeQuantity} ${item.inventory?.unitName || 'units'}`;

      case 'duration':
        return item.duration;

      case 'date':
        return formatDate(item.date);

      case 'action':
        return (
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
        );

      default:
        return null;
    }
  };

  // ============================================================================
  // CLICK-OUTSIDE HANDLER
  // ============================================================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.column-selector-container')) {
        setShowColumnSelector(false);
      }
    };

    if (showColumnSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnSelector]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

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

    // Apply search filter - now searches names too!
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        // Search by cattle name or unique ID
        item.livestock?.name?.toLowerCase().includes(lowerSearch) ||
        item.livestock?.uniqueAnimalId?.toLowerCase().includes(lowerSearch) ||
        item.livestockId.toString().includes(searchTerm) ||
        // Search by shed name or number
        item.shed?.shedName?.toLowerCase().includes(lowerSearch) ||
        item.shed?.shedNumber?.toLowerCase().includes(lowerSearch) ||
        item.shedId.toString().includes(searchTerm) ||
        // Search by inventory item name or type
        item.inventory?.itemName?.toLowerCase().includes(lowerSearch) ||
        item.inventory?.typeName?.toLowerCase().includes(lowerSearch) ||
        item.inventoryId?.toString().includes(searchTerm) ||
        // Search by duration
        item.duration.toLowerCase().includes(lowerSearch)
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
        item.inventoryId?.toString().includes(filterInventoryId)
      );
    }
    if (filterDuration) {
      filtered = filtered.filter(item =>
        item.duration.toLowerCase().includes(filterDuration.toLowerCase())
      );
    }

    // Apply sorting
    filtered = applySorting(filtered);

    setFilteredData(filtered);
  }, [searchTerm, filterLivestockId, filterShedId, filterInventoryId, filterDuration, foodHistory, sortConfig]);

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
            <div className="flex items-center gap-4 flex-wrap">
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

              {/* Column Management Button */}
              <div className="relative column-selector-container">
                <button
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  title="Manage Columns"
                >
                  <Columns className="h-4 w-4" />
                  Columns ({getVisibleColumns().length})
                </button>

                {/* Column Selector Dropdown */}
                {showColumnSelector && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Manage Columns</h3>
                      <button
                        onClick={() => setShowColumnSelector(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Column List */}
                    <div className="max-h-96 overflow-y-auto p-2">
                      {columns.map((col) => (
                        <div
                          key={col.key}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors"
                        >
                          {/* Order number */}
                          <span className="text-xs font-mono text-gray-400 w-6">
                            {col.order + 1}
                          </span>

                          {/* Checkbox */}
                          <button
                            onClick={() => toggleColumnVisibility(col.key)}
                            className="flex items-center gap-2 flex-1 text-left"
                            disabled={col.key === 'action'}
                          >
                            {col.visible ? (
                              <EyeIcon className="h-4 w-4 text-blue-600" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            )}
                            <span
                              className={`text-sm ${
                                col.visible ? 'text-gray-900' : 'text-gray-400'
                              } ${col.key === 'action' ? 'font-semibold' : ''}`}
                            >
                              {col.label}
                            </span>
                          </button>

                          {/* Action column note */}
                          {col.key === 'action' && (
                            <span className="text-xs text-gray-400 italic">Always visible</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                      <span className="text-sm text-gray-600">
                        {getVisibleColumns().length} of {columns.length} visible
                      </span>
                      <button
                        onClick={resetColumns}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                {getVisibleColumns().map((col) => (
                  <th
                    key={col.key}
                    draggable={col.sortable}
                    onDragStart={() => col.sortable && handleDragStart(col.key as SortableColumn)}
                    onDragOver={(e) => col.sortable && handleDragOver(e, col.key as SortableColumn)}
                    onDrop={(e) => col.sortable && handleDrop(e, col.key as SortableColumn)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => col.sortable && handleSort(col.key as SortableColumn, e.shiftKey)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                    } ${
                      draggedColumn === col.key ? 'opacity-50' : ''
                    } ${
                      dragOverColumn === col.key ? 'border-l-2 border-blue-500' : ''
                    }`}
                    title={
                      col.sortable
                        ? `Click to sort, Shift+Click for multi-sort${draggedColumn ? '' : ', Drag to reorder'}`
                        : col.label
                    }
                  >
                    <div className="flex items-center gap-2">
                      {col.sortable && draggedColumn === null && (
                        <GripVertical className="h-3 w-3 text-gray-400" />
                      )}
                      <span>{col.label}</span>
                      {col.sortable && getSortIndicator(col.key as SortableColumn)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={getVisibleColumns().length} className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading...' : 'No food history records found'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {getVisibleColumns().map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {renderCellContent(col.key, item, index)}
                      </td>
                    ))}
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
