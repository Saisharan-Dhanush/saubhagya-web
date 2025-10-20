/**
 * Milk Production List - Display all milk production records
 * Features: Multi-column sorting, column visibility management, drag-and-drop reordering
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Milk,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  Eye as EyeIcon,
  EyeOff,
  X,
  Search
} from 'lucide-react';
import { milkProductionApi, type MilkRecord, type PagedResponse } from '../../../services/gaushala/api';

// Type definitions for table customization
type SortableColumn =
  | 'createdDate'
  | 'shedNumber'
  | 'quantity'
  | 'fatPercentage'
  | 'snf'
  | 'status'
  | 'notes'
  | 'createdBy'
  | 'updatedBy'
  | 'updatedAt'
  | 'gaushalaId';

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

export default function MilkProductionList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<MilkRecord[]>([]);

  // Sort state - supports multiple column sorting
  const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);

  // Column visibility state
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<SortableColumn | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<SortableColumn | null>(null);
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    // Default columns configuration
    const defaultColumns: ColumnConfig[] = [
      { key: 'createdDate', label: 'Date', visible: true, order: 0 },
      { key: 'shedNumber', label: 'Shed Number', visible: true, order: 1 },
      { key: 'quantity', label: 'Quantity (L)', visible: true, order: 2 },
      { key: 'fatPercentage', label: 'Fat %', visible: true, order: 3 },
      { key: 'snf', label: 'SNF', visible: true, order: 4 },
      { key: 'status', label: 'Status', visible: true, order: 5 },
      { key: 'notes', label: 'Notes', visible: false, order: 6 },
      { key: 'createdBy', label: 'Created By', visible: false, order: 7 },
      { key: 'updatedBy', label: 'Updated By', visible: false, order: 8 },
      { key: 'updatedAt', label: 'Updated At', visible: false, order: 9 },
      { key: 'gaushalaId', label: 'Gaushala ID', visible: false, order: 10 },
    ];

    // Try to load from localStorage first
    const saved = localStorage.getItem('milkProductionTableColumns');
    const savedVersion = localStorage.getItem('milkProductionTableColumnsVersion');
    const CURRENT_VERSION = '1.0';

    if (saved && savedVersion === CURRENT_VERSION) {
      try {
        const parsed = JSON.parse(saved);
        // Verify all columns exist
        if (parsed.length === 11) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved columns:', e);
      }
    }

    // If no saved data or version mismatch, use defaults and save them
    localStorage.setItem('milkProductionTableColumns', JSON.stringify(defaultColumns));
    localStorage.setItem('milkProductionTableColumnsVersion', CURRENT_VERSION);
    return defaultColumns;
  });

  useEffect(() => {
    loadRecords();
  }, [currentPage]);

  // Apply search filter whenever records or search query changes
  useEffect(() => {
    applySearchFilter();
  }, [records, searchQuery]);

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

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await milkProductionApi.getAllMilkRecords(currentPage, pageSize);
      if (response.success && response.data) {
        setRecords(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error('Error loading milk records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this milk production record?')) return;
    try {
      const response = await milkProductionApi.deleteMilkRecord(id);
      if (response.success) {
        loadRecords();
      } else {
        alert('Failed to delete record: ' + response.error);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Error deleting record');
    }
  };

  /**
   * Advanced search filter functionality
   * Features: Multi-term search, field-specific search, relevance ranking
   * Examples: "shed-1", "quantity:50", "status:verified"
   */
  const applySearchFilter = () => {
    if (!searchQuery.trim()) {
      setFilteredRecords(records);
      return;
    }

    const searchInput = searchQuery.toLowerCase().trim();
    const searchTerms = searchInput.split(/\s+/).filter(term => term.length > 0);

    // Check for field-specific search syntax (field:value)
    const fieldSearchMatch = searchInput.match(/^(\w+):(.+)$/);

    if (fieldSearchMatch) {
      // Field-specific search
      const [, field, value] = fieldSearchMatch;
      const valueLower = value.toLowerCase().trim();

      const filtered = records.filter(record => {
        switch (field) {
          case 'shed':
          case 'shedNumber':
            return record.shedNumber?.toLowerCase().includes(valueLower);
          case 'quantity':
          case 'milk':
            return record.milkQuantity?.toString().includes(valueLower);
          case 'fat':
          case 'fatPercentage':
            return record.fatPercentage?.toString().includes(valueLower);
          case 'snf':
            return record.snf?.toString().includes(valueLower);
          case 'status':
            return record.status?.toLowerCase().includes(valueLower);
          case 'notes':
            return record.notes?.toLowerCase().includes(valueLower);
          case 'gaushala':
          case 'gaushalaId':
            return record.gaushalaId?.toString().includes(valueLower);
          default:
            return false;
        }
      });

      setFilteredRecords(filtered);
    } else {
      // Multi-term general search with relevance scoring
      const resultsWithScore = records.map(record => {
        let score = 0;

        searchTerms.forEach(term => {
          // Shed number matches
          if (record.shedNumber?.toLowerCase().includes(term)) score += 50;
          if (record.shedNumber?.toLowerCase() === term) score += 100;

          // Status matches
          if (record.status?.toLowerCase().includes(term)) score += 40;
          if (record.status?.toLowerCase() === term) score += 80;

          // Numeric field matches
          if (record.milkQuantity?.toString().includes(term)) score += 30;
          if (record.fatPercentage?.toString().includes(term)) score += 25;
          if (record.snf?.toString().includes(term)) score += 25;

          // Notes matches
          if (record.notes?.toLowerCase().includes(term)) score += 20;

          // ID matches
          if (record.gaushalaId?.toString().includes(term)) score += 15;
          if (record.id?.toString().includes(term)) score += 15;

          // Date matches
          if (record.createdAt?.toLowerCase().includes(term)) score += 10;
        });

        return { record, score };
      });

      // Filter: must have score > 0
      const matched = resultsWithScore.filter(r => r.score > 0);

      // Sort by relevance score (highest first)
      matched.sort((a, b) => b.score - a.score);

      setFilteredRecords(matched.map(r => r.record));
    }
  };

  /**
   * Handle column sorting with multi-column support
   * Click: Set single column sort (asc → desc → clear)
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
   * Apply sorting to records
   */
  const applySorting = (recordsList: MilkRecord[]): MilkRecord[] => {
    if (sortConfig.length === 0) return recordsList;

    return [...recordsList].sort((a, b) => {
      for (const { column, direction } of sortConfig) {
        let compareResult = 0;

        switch (column) {
          case 'createdDate':
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            compareResult = dateA - dateB;
            break;
          case 'shedNumber':
            compareResult = (a.shedNumber || '').localeCompare(b.shedNumber || '');
            break;
          case 'quantity':
            compareResult = (a.milkQuantity || 0) - (b.milkQuantity || 0);
            break;
          case 'fatPercentage':
            compareResult = (a.fatPercentage || 0) - (b.fatPercentage || 0);
            break;
          case 'snf':
            compareResult = (a.snf || 0) - (b.snf || 0);
            break;
          case 'status':
            compareResult = (a.status || '').localeCompare(b.status || '');
            break;
          case 'notes':
            compareResult = (a.notes || '').localeCompare(b.notes || '');
            break;
          case 'createdBy':
            compareResult = (a.createdBy || 0) - (b.createdBy || 0);
            break;
          case 'updatedBy':
            compareResult = (a.updatedBy || 0) - (b.updatedBy || 0);
            break;
          case 'updatedAt':
            const updatedA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const updatedB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            compareResult = updatedA - updatedB;
            break;
          case 'gaushalaId':
            compareResult = (a.gaushalaId || 0) - (b.gaushalaId || 0);
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
    localStorage.setItem('milkProductionTableColumns', JSON.stringify(newColumns));
    localStorage.setItem('milkProductionTableColumnsVersion', '1.0');
  };

  /**
   * Reset columns to default
   */
  const resetColumns = () => {
    const defaultColumns: ColumnConfig[] = [
      { key: 'createdDate', label: 'Date', visible: true, order: 0 },
      { key: 'shedNumber', label: 'Shed Number', visible: true, order: 1 },
      { key: 'quantity', label: 'Quantity (L)', visible: true, order: 2 },
      { key: 'fatPercentage', label: 'Fat %', visible: true, order: 3 },
      { key: 'snf', label: 'SNF', visible: true, order: 4 },
      { key: 'status', label: 'Status', visible: true, order: 5 },
      { key: 'notes', label: 'Notes', visible: false, order: 6 },
      { key: 'createdBy', label: 'Created By', visible: false, order: 7 },
      { key: 'updatedBy', label: 'Updated By', visible: false, order: 8 },
      { key: 'updatedAt', label: 'Updated At', visible: false, order: 9 },
      { key: 'gaushalaId', label: 'Gaushala ID', visible: false, order: 10 },
    ];
    setColumns(defaultColumns);
    localStorage.setItem('milkProductionTableColumns', JSON.stringify(defaultColumns));
    localStorage.setItem('milkProductionTableColumnsVersion', '1.0');
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
    localStorage.setItem('milkProductionTableColumns', JSON.stringify(newColumns));
    localStorage.setItem('milkProductionTableColumnsVersion', '1.0');
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
  const renderCellContent = (column: SortableColumn, record: MilkRecord) => {
    switch (column) {
      case 'createdDate':
        return record.createdAt ? formatDate(record.createdAt) : '-';
      case 'shedNumber':
        return record.shedNumber || '-';
      case 'quantity':
        return record.milkQuantity ? record.milkQuantity.toFixed(2) : '-';
      case 'fatPercentage':
        return record.fatPercentage ? `${record.fatPercentage.toFixed(1)}%` : '-';
      case 'snf':
        return record.snf ? record.snf.toFixed(1) : '-';
      case 'status':
        return record.status ? (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getQualityBadgeColor(record.status)}`}>
            {record.status}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        );
      case 'notes':
        return record.notes ? (
          <span className="text-sm text-gray-600 truncate max-w-xs" title={record.notes}>
            {record.notes}
          </span>
        ) : '-';
      case 'createdBy':
        return record.createdBy || '-';
      case 'updatedBy':
        return record.updatedBy || '-';
      case 'updatedAt':
        return record.updatedAt ? formatDate(record.updatedAt) : '-';
      case 'gaushalaId':
        return record.gaushalaId || '-';
      default:
        return '-';
    }
  };

  const getQualityBadgeColor = (quality?: string): string => {
    switch (quality?.toUpperCase()) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-800';
      case 'GOOD':
        return 'bg-blue-100 text-blue-800';
      case 'AVERAGE':
        return 'bg-yellow-100 text-yellow-800';
      case 'POOR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sortedRecords = applySorting(filteredRecords.length > 0 || searchQuery ? filteredRecords : records);
  const visibleColumns = getVisibleColumns();
  const displayRecords = sortedRecords;
  const displayCount = searchQuery ? displayRecords.length : totalElements;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Milk Production Records</h1>
          <p className="text-gray-600 mt-1">
            {searchQuery ? (
              <>Showing {displayRecords.length} of {totalElements} records</>
            ) : (
              <>Total: {totalElements} records</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Column Selector Button */}
          <div className="relative column-selector-container">
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              title="Manage columns"
            >
              <Columns size={18} />
              <span className="text-sm font-medium">
                Columns ({visibleColumns.length}/{columns.length})
              </span>
            </button>

            {/* Column Selector Dropdown */}
            {showColumnSelector && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Manage Columns</h3>
                  <button
                    onClick={() => setShowColumnSelector(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Column List */}
                <div className="overflow-y-auto flex-1">
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className="px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={col.visible}
                          onChange={() => toggleColumnVisibility(col.key)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 flex-1">{col.label}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          #{col.order + 1}
                        </span>
                        {col.visible ? (
                          <EyeIcon size={14} className="text-blue-600" />
                        ) : (
                          <EyeOff size={14} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {visibleColumns.length} visible
                  </span>
                  <button
                    onClick={resetColumns}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/gaushala/production/record')}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus size={20} />
            Record Production
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder='Search: "shed-1", "quantity:50", "status:verified", "fat:4.5"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Search tips:</span> Use "field:value" for specific searches (e.g., "shed:shed-1", "quantity:50", "status:verified")
          </div>
        )}
      </div>

      {displayRecords.length === 0 && !loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Milk className="mx-auto text-gray-400" size={48} />
          {searchQuery ? (
            <>
              <p className="mt-4 text-gray-600">No records match your search "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <p className="mt-4 text-gray-600">No milk production records found</p>
              <button
                onClick={() => navigate('/gaushala/production/record')}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Record your first production
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.map((col) => (
                      <th
                        key={col.key}
                        draggable
                        onDragStart={() => handleDragStart(col.key)}
                        onDragOver={(e) => handleDragOver(e, col.key)}
                        onDrop={() => handleDrop(col.key)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => !draggedColumn && handleSort(col.key, e.shiftKey)}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-move select-none transition-all ${
                          draggedColumn === col.key ? 'opacity-50' : ''
                        } ${
                          dragOverColumn === col.key && draggedColumn !== col.key
                            ? 'border-l-4 border-blue-500'
                            : ''
                        }`}
                        title={`Drag to reorder, Click to sort, Shift+Click to multi-sort`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1">
                            <span className="text-gray-400">⋮⋮</span>
                            {col.label}
                          </span>
                          {getSortIndicator(col.key)}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      {visibleColumns.map((col) => (
                        <td
                          key={col.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {renderCellContent(col.key, record)}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/gaushala/production/edit/${record.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit record"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => record.id && handleDelete(record.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
