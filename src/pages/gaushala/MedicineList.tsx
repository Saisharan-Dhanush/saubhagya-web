/**
 * Medicine List Page - Beautiful UI with shadcn components
 * Mapped to backend Medicine.java entity with exact field names
 * Features: Multi-column sorting, column visibility management, drag-and-drop reordering
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Edit, Trash2, Plus, Download, AlertCircle, Package, Pill, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Columns, Eye as EyeIcon, EyeOff, X, GripVertical } from 'lucide-react';
import { medicineApi, type Medicine } from '../../services/gaushala/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Define all sortable columns
type SortableColumn = 'name' | 'dosage' | 'quantity' | 'expiryDate' | 'manufacturer' | 'status';

// Sort configuration
interface SortConfig {
  column: SortableColumn;
  direction: 'asc' | 'desc';
}

// Column configuration
interface ColumnConfig {
  key: SortableColumn | 'sl' | 'actions';
  label: string;
  visible: boolean;
  order: number;
  sortable: boolean;
}

// localStorage version for schema changes
const COLUMNS_VERSION = '1.0.0';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Initialize columns from localStorage or defaults
const initializeColumns = (): ColumnConfig[] => {
  try {
    const savedVersion = localStorage.getItem('medicineColumnsVersion');
    const savedColumns = localStorage.getItem('medicineColumns');

    // Check version compatibility
    if (savedVersion === COLUMNS_VERSION && savedColumns) {
      return JSON.parse(savedColumns);
    }
  } catch (error) {
    console.error('Error loading saved columns:', error);
  }

  // Default column configuration
  return [
    { key: 'sl', label: 'SL.', visible: true, order: 0, sortable: false },
    { key: 'name', label: 'Medicine Name', visible: true, order: 1, sortable: true },
    { key: 'dosage', label: 'Dosage', visible: true, order: 2, sortable: true },
    { key: 'quantity', label: 'Stock Quantity', visible: true, order: 3, sortable: true },
    { key: 'expiryDate', label: 'Expiry Date', visible: true, order: 4, sortable: true },
    { key: 'manufacturer', label: 'Manufacturer', visible: true, order: 5, sortable: true },
    { key: 'status', label: 'Status', visible: true, order: 6, sortable: true },
    { key: 'actions', label: 'Actions', visible: true, order: 7, sortable: false },
  ];
};

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
    localStorage.setItem('medicineColumns', JSON.stringify(cols));
    localStorage.setItem('medicineColumnsVersion', COLUMNS_VERSION);
  };

  // Get visible columns sorted by order
  const getVisibleColumns = (): ColumnConfig[] => {
    return columns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (key: ColumnConfig['key']) => {
    // Actions column must always be visible
    if (key === 'actions') return;

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
    // Prevent sort during drag
    if (draggedColumn) return;

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
  const applySorting = (data: Medicine[]): Medicine[] => {
    if (sortConfig.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const config of sortConfig) {
        let comparison = 0;

        switch (config.column) {
          case 'name':
            comparison = (a.name || '').localeCompare(b.name || '');
            break;
          case 'dosage':
            comparison = (a.dosage || '').localeCompare(b.dosage || '');
            break;
          case 'quantity':
            comparison = (a.quantity || 0) - (b.quantity || 0);
            break;
          case 'expiryDate':
            comparison = new Date(a.expiryDate || 0).getTime() - new Date(b.expiryDate || 0).getTime();
            break;
          case 'manufacturer':
            comparison = (a.manufacturer || '').localeCompare(b.manufacturer || '');
            break;
          case 'status':
            // Sort by expiry date for status (expired first, then expiring soon, then valid)
            const aExpired = isExpired(a.expiryDate);
            const bExpired = isExpired(b.expiryDate);
            const aExpiringSoon = isExpiringSoon(a.expiryDate);
            const bExpiringSoon = isExpiringSoon(b.expiryDate);

            if (aExpired !== bExpired) {
              comparison = aExpired ? -1 : 1;
            } else if (aExpiringSoon !== bExpiringSoon) {
              comparison = aExpiringSoon ? -1 : 1;
            } else {
              comparison = new Date(a.expiryDate || 0).getTime() - new Date(b.expiryDate || 0).getTime();
            }
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

    // Apply sorting
    filtered = applySorting(filtered);

    setFilteredData(filtered);
  }, [searchTerm, filterName, filterManufacturer, filterUnit, filterExpiry, medicines, sortConfig]);

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

  // ============================================================================
  // CELL RENDERING
  // ============================================================================

  const renderCellContent = (column: ColumnConfig['key'], item: Medicine, index: number) => {
    switch (column) {
      case 'sl':
        return (
          <span className="font-medium text-muted-foreground">
            {startIndex + index + 1}
          </span>
        );

      case 'name':
        return (
          <span className="font-semibold">
            {item.name}
          </span>
        );

      case 'dosage':
        return (
          <span className="text-muted-foreground">
            {item.dosage}
          </span>
        );

      case 'quantity':
        const lowStock = item.quantity < 10;
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className={lowStock ? 'font-semibold text-destructive' : ''}>
              {item.quantity} {item.unit}
            </span>
            {lowStock && (
              <Badge variant="destructive" className="text-xs">Low Stock</Badge>
            )}
          </div>
        );

      case 'expiryDate':
        const expired = isExpired(item.expiryDate);
        const expiringSoon = isExpiringSoon(item.expiryDate);
        return (
          <span className={
            expired ? 'font-semibold text-destructive' :
            expiringSoon ? 'font-semibold text-amber-600' :
            ''
          }>
            {formatDate(item.expiryDate)}
          </span>
        );

      case 'manufacturer':
        return (
          <span className="text-muted-foreground">
            {item.manufacturer || '-'}
          </span>
        );

      case 'status':
        const isExpiredStatus = isExpired(item.expiryDate);
        const isExpiringSoonStatus = isExpiringSoon(item.expiryDate);

        if (isExpiredStatus) {
          return (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Expired
            </Badge>
          );
        } else if (isExpiringSoonStatus) {
          return (
            <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
              <AlertCircle className="h-3 w-3" />
              Expiring Soon
            </Badge>
          );
        } else {
          return (
            <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 hover:bg-green-200">
              ✓ Valid
            </Badge>
          );
        }

      case 'actions':
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(item.id!)}
              title="View"
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(item.id!)}
              title="Edit"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(item.id!)}
              title="Delete"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  // Calculate display values
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + filteredData.length, totalItems);

  if (loading && medicines.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Pill className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Medicine Inventory</h1>
              <p className="text-muted-foreground">Manage medicine stock and inventory</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => navigate('/gaushala/medicine/add')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Medicine
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Card */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left side - Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={entriesPerPage.toString()}
                  onValueChange={(value) => {
                    setEntriesPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">entries</span>
              </div>

              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>

              {/* Column Management Button */}
              <div className="relative column-selector-container">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="gap-2"
                  title="Manage Columns"
                >
                  <Columns className="h-4 w-4" />
                  Columns ({getVisibleColumns().length})
                </Button>

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
                            disabled={col.key === 'actions'}
                          >
                            {col.visible ? (
                              <EyeIcon className="h-4 w-4 text-blue-600" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            )}
                            <span
                              className={`text-sm ${
                                col.visible ? 'text-gray-900' : 'text-gray-400'
                              } ${col.key === 'actions' ? 'font-semibold' : ''}`}
                            >
                              {col.label}
                            </span>
                          </button>

                          {/* Actions column note */}
                          {col.key === 'actions' && (
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
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Box */}
          {showFilters && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  type="text"
                  placeholder="Filter by Medicine Name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Filter by Manufacturer"
                  value={filterManufacturer}
                  onChange={(e) => setFilterManufacturer(e.target.value)}
                />
                <Select value={filterUnit} onValueChange={setFilterUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Units</SelectItem>
                    <SelectItem value="mg">Milligrams (mg)</SelectItem>
                    <SelectItem value="ml">Milliliters (ml)</SelectItem>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="capsules">Capsules</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterExpiry} onValueChange={(value: any) => setFilterExpiry(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Medicines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Medicines</SelectItem>
                    <SelectItem value="expired">Expired Only</SelectItem>
                    <SelectItem value="expiring_soon">Expiring Soon (30 days)</SelectItem>
                    <SelectItem value="valid">Valid Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {/* Table */}
          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {getVisibleColumns().map((col) => (
                    <TableHead
                      key={col.key}
                      draggable={col.sortable}
                      onDragStart={() => col.sortable && handleDragStart(col.key as SortableColumn)}
                      onDragOver={(e) => col.sortable && handleDragOver(e, col.key as SortableColumn)}
                      onDrop={(e) => col.sortable && handleDrop(e, col.key as SortableColumn)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => col.sortable && !draggedColumn && handleSort(col.key as SortableColumn, e.shiftKey)}
                      className={`${col.sortable ? 'cursor-pointer select-none hover:bg-muted/50' : ''} ${
                        draggedColumn === col.key ? 'opacity-50' : ''
                      } ${
                        dragOverColumn === col.key ? 'border-l-2 border-blue-500' : ''
                      } ${col.key === 'sl' ? 'w-[60px]' : col.key === 'actions' ? 'w-[120px]' : ''}`}
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
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={getVisibleColumns().length} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-12 w-12 mb-2 opacity-50" />
                        <p className="font-medium">{loading ? 'Loading...' : 'No medicine records found'}</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      {getVisibleColumns().map((col) => (
                        <TableCell key={col.key}>
                          {renderCellContent(col.key, item, index)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{filteredData.length > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="font-medium">{endIndex}</span> of{' '}
            <span className="font-medium">{totalItems}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <span className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md">
                {currentPage}
              </span>
              <span className="text-sm text-muted-foreground px-1">of</span>
              <span className="text-sm font-medium px-1">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
