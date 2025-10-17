/**
 * Inventory List - Main inventory management page
 * Displays paginated inventory with search, low-stock alerts, and CRUD operations
 * 100% API-driven with NO hardcoded data
 * Features: Multi-column sorting, column visibility management, drag-and-drop reordering
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  Eye as EyeIcon,
  EyeOff,
  X,
  Calendar,
  Hash,
  FileText,
  Tag,
  Boxes,
  Scale,
} from 'lucide-react';
import {
  inventoryApi,
  type Inventory,
  type InventoryType,
  type InventoryUnit,
  type PagedResponse,
} from '../../../services/gaushala/api';

// Type definitions for advanced table features
type SortableColumn =
  | 'id'
  | 'itemName'
  | 'description'
  | 'type'
  | 'unit'
  | 'quantity'
  | 'reorderLevel'
  | 'supplier'
  | 'gaushalaId'
  | 'status'
  | 'createdAt'
  | 'updatedAt';

interface SortConfig {
  column: SortableColumn;
  direction: 'asc' | 'desc';
}

interface ColumnConfig {
  key: SortableColumn;
  label: string;
  visible: boolean;
  order: number;
}

export default function InventoryList() {
  const navigate = useNavigate();

  // State
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [inventoryTypes, setInventoryTypes] = useState<InventoryType[]>([]);
  const [inventoryUnits, setInventoryUnits] = useState<InventoryUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Sort state - supports multiple column sorting
  const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);

  // Column visibility state
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<SortableColumn | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<SortableColumn | null>(null);
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    // Default columns configuration - 12 total columns
    const defaultColumns: ColumnConfig[] = [
      { key: 'id', label: 'ID', visible: true, order: 0 },
      { key: 'itemName', label: 'Item Name', visible: true, order: 1 },
      { key: 'description', label: 'Description', visible: true, order: 2 },
      { key: 'type', label: 'Type', visible: true, order: 3 },
      { key: 'unit', label: 'Unit', visible: true, order: 4 },
      { key: 'quantity', label: 'Quantity', visible: true, order: 5 },
      { key: 'reorderLevel', label: 'Reorder Level', visible: true, order: 6 },
      { key: 'supplier', label: 'Supplier', visible: true, order: 7 },
      { key: 'gaushalaId', label: 'Gaushala ID', visible: false, order: 8 },
      { key: 'status', label: 'Status', visible: true, order: 9 },
      { key: 'createdAt', label: 'Created At', visible: false, order: 10 },
      { key: 'updatedAt', label: 'Updated At', visible: false, order: 11 },
    ];

    // Try to load from localStorage first
    const saved = localStorage.getItem('inventoryTableColumns');
    const savedVersion = localStorage.getItem('inventoryTableColumnsVersion');
    const CURRENT_VERSION = '1.0';

    if (saved && savedVersion === CURRENT_VERSION) {
      try {
        const parsed = JSON.parse(saved);
        // Verify all 12 columns exist
        if (parsed.length === 12) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved columns:', e);
      }
    }

    // If no saved data or version mismatch, use defaults and save them
    localStorage.setItem('inventoryTableColumns', JSON.stringify(defaultColumns));
    localStorage.setItem('inventoryTableColumnsVersion', CURRENT_VERSION);
    return defaultColumns;
  });

  // Load inventory from API
  useEffect(() => {
    loadInventory();
  }, [currentPage]);

  // Load inventory types and units from API for filtering/display
  useEffect(() => {
    loadInventoryTypes();
    loadInventoryUnits();
  }, []);

  // Close column selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showColumnSelector && !target.closest('.column-selector-container')) {
        setShowColumnSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnSelector]);

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

  const loadInventoryUnits = async () => {
    try {
      const response = await inventoryApi.getInventoryUnits();
      if (response.success && response.data) {
        setInventoryUnits(response.data);
      }
    } catch (error) {
      console.error('Error loading inventory units:', error);
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

  const getInventoryUnitName = (unitId: number): string => {
    const unit = inventoryUnits.find(u => u.id === unitId);
    return unit ? unit.unitName : 'Unit';
  };

  const isLowStock = (item: Inventory): boolean => {
    // Use minimumStockLevel as the primary field (backend field name)
    return item.quantity <= (item.minimumStockLevel || 0);
  };

  /**
   * Handle column sorting with multi-column support
   * Click: Toggle single column sort (asc → desc → clear)
   * Shift+Click: Add column to multi-column sort
   */
  const handleSort = (column: SortableColumn, shiftKey: boolean = false) => {
    setSortConfig(prevConfig => {
      if (shiftKey) {
        // Multi-column sorting (Shift+Click)
        const existingIndex = prevConfig.findIndex(s => s.column === column);

        if (existingIndex >= 0) {
          // Column already in sort - toggle direction or remove
          const existing = prevConfig[existingIndex];
          if (existing.direction === 'asc') {
            // Change to desc
            const newConfig = [...prevConfig];
            newConfig[existingIndex] = { column, direction: 'desc' };
            return newConfig;
          } else {
            // Remove this sort column
            return prevConfig.filter((_, i) => i !== existingIndex);
          }
        } else {
          // Add new column to sort (asc by default)
          return [...prevConfig, { column, direction: 'asc' }];
        }
      } else {
        // Single column sorting (regular click)
        const existing = prevConfig.find(s => s.column === column);

        if (existing) {
          // Toggle direction or clear if already desc
          if (existing.direction === 'asc') {
            return [{ column, direction: 'desc' }];
          } else {
            return []; // Clear sort
          }
        } else {
          // New sort column
          return [{ column, direction: 'asc' }];
        }
      }
    });
  };

  /**
   * Get sort indicator for a column
   */
  const getSortIndicator = (column: SortableColumn) => {
    const sortIndex = sortConfig.findIndex(s => s.column === column);

    if (sortIndex === -1) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    }

    const sort = sortConfig[sortIndex];
    const isMulti = sortConfig.length > 1;

    return (
      <div className="flex items-center gap-1">
        {sort.direction === 'asc' ? (
          <ArrowUp className="h-3 w-3 text-blue-600" />
        ) : (
          <ArrowDown className="h-3 w-3 text-blue-600" />
        )}
        {isMulti && (
          <span className="text-xs font-bold text-blue-600 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center">
            {sortIndex + 1}
          </span>
        )}
      </div>
    );
  };

  /**
   * Apply sorting to inventory list
   */
  const applySorting = (inventoryList: Inventory[]): Inventory[] => {
    if (sortConfig.length === 0) return inventoryList;

    return [...inventoryList].sort((a, b) => {
      for (const { column, direction } of sortConfig) {
        let compareResult = 0;

        switch (column) {
          case 'id':
            compareResult = (a.id || 0) - (b.id || 0);
            break;
          case 'itemName':
            compareResult = a.itemName.localeCompare(b.itemName);
            break;
          case 'description':
            compareResult = (a.description || '').localeCompare(b.description || '');
            break;
          case 'type':
            compareResult = getInventoryTypeName(a.inventoryTypeId).localeCompare(
              getInventoryTypeName(b.inventoryTypeId)
            );
            break;
          case 'unit':
            compareResult = getInventoryUnitName(a.inventoryUnitId).localeCompare(
              getInventoryUnitName(b.inventoryUnitId)
            );
            break;
          case 'quantity':
            compareResult = (a.quantity || 0) - (b.quantity || 0);
            break;
          case 'reorderLevel':
            // Use minimumStockLevel as the backend field name
            compareResult = (a.minimumStockLevel || 0) - (b.minimumStockLevel || 0);
            break;
          case 'supplier':
            compareResult = (a.supplier || '').localeCompare(b.supplier || '');
            break;
          case 'gaushalaId':
            compareResult = (a.gaushalaId || 0) - (b.gaushalaId || 0);
            break;
          case 'status':
            const statusA = isLowStock(a) ? 0 : 1;
            const statusB = isLowStock(b) ? 0 : 1;
            compareResult = statusA - statusB;
            break;
          case 'createdAt':
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            compareResult = dateA - dateB;
            break;
          case 'updatedAt':
            const updatedA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const updatedB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            compareResult = updatedA - updatedB;
            break;
        }

        if (compareResult !== 0) {
          return direction === 'asc' ? compareResult : -compareResult;
        }
      }

      return 0;
    });
  };

  /**
   * Get visible columns sorted by order
   */
  const getVisibleColumns = (): ColumnConfig[] => {
    return columns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  };

  /**
   * Toggle column visibility
   */
  const toggleColumnVisibility = (key: SortableColumn) => {
    const newColumns = columns.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    setColumns(newColumns);
    localStorage.setItem('inventoryTableColumns', JSON.stringify(newColumns));
    localStorage.setItem('inventoryTableColumnsVersion', '1.0');
  };

  /**
   * Reset columns to default
   */
  const resetColumns = () => {
    const defaultColumns: ColumnConfig[] = [
      { key: 'id', label: 'ID', visible: true, order: 0 },
      { key: 'itemName', label: 'Item Name', visible: true, order: 1 },
      { key: 'description', label: 'Description', visible: true, order: 2 },
      { key: 'type', label: 'Type', visible: true, order: 3 },
      { key: 'unit', label: 'Unit', visible: true, order: 4 },
      { key: 'quantity', label: 'Quantity', visible: true, order: 5 },
      { key: 'reorderLevel', label: 'Reorder Level', visible: true, order: 6 },
      { key: 'supplier', label: 'Supplier', visible: true, order: 7 },
      { key: 'gaushalaId', label: 'Gaushala ID', visible: false, order: 8 },
      { key: 'status', label: 'Status', visible: true, order: 9 },
      { key: 'createdAt', label: 'Created At', visible: false, order: 10 },
      { key: 'updatedAt', label: 'Updated At', visible: false, order: 11 },
    ];
    setColumns(defaultColumns);
    localStorage.setItem('inventoryTableColumns', JSON.stringify(defaultColumns));
    localStorage.setItem('inventoryTableColumnsVersion', '1.0');
  };

  /**
   * Handle drag start for column reordering
   */
  const handleDragStart = (key: SortableColumn) => {
    setDraggedColumn(key);
  };

  /**
   * Handle drag over for column reordering
   */
  const handleDragOver = (e: React.DragEvent, key: SortableColumn) => {
    e.preventDefault();
    setDragOverColumn(key);
  };

  /**
   * Handle drop for column reordering
   */
  const handleDrop = (targetKey: SortableColumn) => {
    if (!draggedColumn || draggedColumn === targetKey) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const newColumns = [...columns];
    const draggedIndex = newColumns.findIndex(col => col.key === draggedColumn);
    const targetIndex = newColumns.findIndex(col => col.key === targetKey);

    // Swap orders
    const draggedCol = newColumns[draggedIndex];
    const targetCol = newColumns[targetIndex];

    const tempOrder = draggedCol.order;
    draggedCol.order = targetCol.order;
    targetCol.order = tempOrder;

    setColumns(newColumns);
    localStorage.setItem('inventoryTableColumns', JSON.stringify(newColumns));
    localStorage.setItem('inventoryTableColumnsVersion', '1.0');
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  /**
   * Render cell content based on column type
   */
  const renderCellContent = (column: SortableColumn, item: Inventory) => {
    switch (column) {
      case 'id':
        return (
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">{item.id || '-'}</span>
          </div>
        );

      case 'itemName':
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900">{item.itemName || '-'}</span>
          </div>
        );

      case 'description':
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 truncate max-w-xs">{item.description || '-'}</span>
          </div>
        );

      case 'type':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {getInventoryTypeName(item.inventoryTypeId)}
          </span>
        );

      case 'unit':
        return (
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-900">{getInventoryUnitName(item.inventoryUnitId)}</span>
          </div>
        );

      case 'quantity':
        return (
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-900">{item.quantity || 0}</span>
          </div>
        );

      case 'reorderLevel':
        return (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-900">{item.minimumStockLevel || 0}</span>
          </div>
        );

      case 'supplier':
        return (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-gray-500">{item.supplier || '-'}</span>
          </div>
        );

      case 'gaushalaId':
        return (
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">{item.gaushalaId || '-'}</span>
          </div>
        );

      case 'status':
        return isLowStock(item) ? (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <AlertTriangle size={16} />
            Low Stock
          </span>
        ) : (
          <span className="text-green-600 font-medium">In Stock</span>
        );

      case 'createdAt':
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'}
            </span>
          </div>
        );

      case 'updatedAt':
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'}
            </span>
          </div>
        );

      default:
        return null;
    }
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

      {/* Search Bar and Column Selector */}
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

        {/* Column Selector Button */}
        <div className="relative column-selector-container">
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Columns size={20} />
            Manage Columns ({getVisibleColumns().length}/{columns.length})
          </button>

          {/* Column Selector Dropdown */}
          {showColumnSelector && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Column Visibility</h3>
                  <button
                    onClick={() => setShowColumnSelector(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Toggle columns to show/hide, drag to reorder</p>
              </div>

              <div className="p-2 max-h-96 overflow-y-auto">
                {columns.map((column) => (
                  <label
                    key={column.key}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={column.visible}
                      onChange={() => toggleColumnVisibility(column.key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {column.visible ? (
                      <EyeIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="flex-1 text-sm text-gray-700">{column.label}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      #{column.order + 1}
                    </span>
                  </label>
                ))}
              </div>

              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {getVisibleColumns().length} of {columns.length} visible
                  </span>
                  <button
                    onClick={resetColumns}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>
          )}
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
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {getVisibleColumns().map((column) => (
                  <th
                    key={column.key}
                    draggable
                    onDragStart={() => handleDragStart(column.key)}
                    onDragOver={(e) => handleDragOver(e, column.key)}
                    onDrop={() => handleDrop(column.key)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => !draggedColumn && handleSort(column.key, e.shiftKey)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none transition-all ${
                      draggedColumn === column.key ? 'opacity-50' : ''
                    } ${dragOverColumn === column.key ? 'border-l-4 border-blue-500' : ''}`}
                    title={`Click to sort by ${column.label}, Shift+Click for multi-sort, Drag to reorder`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 cursor-move" title="Drag to reorder">⋮⋮</span>
                      <span>{column.label}</span>
                      {getSortIndicator(column.key)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applySorting(inventory).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {getVisibleColumns().map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {renderCellContent(column.key, item)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/gaushala/inventory/${item.id}/stock-history`)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="View Stock History"
                      >
                        <History size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/gaushala/inventory/edit/${item.id}`)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
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
