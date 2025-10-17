/**
 * Health History Page - Shows health history records with filtering and pagination
 * Updated to use real API data from gaushala-service
 * Features: Multi-column sorting, column visibility management, drag-and-drop reordering
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Edit, Trash2, Plus, Download, Calendar, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, Columns, Eye as EyeIcon, EyeOff, X, GripVertical } from 'lucide-react';
import { healthRecordsApi, HealthRecord, Cattle, cattleApi } from '../../services/gaushala/api';
import { getStoredToken, isTokenExpired } from '../../utils/auth';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Define all sortable columns
type SortableColumn = 'cattleName' | 'recordType' | 'recordDate' | 'veterinarian' | 'diagnosis' | 'nextCheckup' | 'status';

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
    const savedVersion = localStorage.getItem('healthHistoryColumnsVersion');
    const savedColumns = localStorage.getItem('healthHistoryColumns');

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
    { key: 'recordType', label: 'Record Type', visible: true, order: 2, sortable: true },
    { key: 'recordDate', label: 'Record Date', visible: true, order: 3, sortable: true },
    { key: 'veterinarian', label: 'Veterinarian', visible: true, order: 4, sortable: true },
    { key: 'diagnosis', label: 'Diagnosis', visible: true, order: 5, sortable: true },
    { key: 'nextCheckup', label: 'Next Checkup', visible: true, order: 6, sortable: true },
    { key: 'status', label: 'Status', visible: true, order: 7, sortable: true },
    { key: 'action', label: 'Action', visible: true, order: 8, sortable: false },
  ];
};

export default function HealthHistory() {
  const navigate = useNavigate();
  const [healthHistory, setHealthHistory] = useState<HealthRecord[]>([]);
  const [cattle, setCattle] = useState<Map<number, Cattle>>(new Map());
  const [filteredData, setFilteredData] = useState<HealthRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filter states
  const [filterRecordType, setFilterRecordType] = useState('');
  const [filterVeterinarian, setFilterVeterinarian] = useState('');
  const [filterRecordDate, setFilterRecordDate] = useState('');
  const [filterNextFollowUpDate, setFilterNextFollowUpDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Table customization states
  const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>(initializeColumns);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<SortableColumn | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<SortableColumn | null>(null);

  // Fetch health records from API
  useEffect(() => {
    fetchHealthRecords();
  }, [currentPage, entriesPerPage]);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is logged in and token is valid
      const token = getStoredToken();
      console.log('JWT Token present in localStorage:', !!token);

      if (!token) {
        setError('You are not logged in. Please login to access health records.');
        console.error('No JWT token found in localStorage');
        // Redirect to login page after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (isTokenExpired()) {
        setError('Your session has expired. Please login again.');
        console.error('JWT token has expired');
        // Redirect to login page after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      console.log('Fetching health records from API...');
      console.log('API Base URL:', 'http://localhost:8086/gaushala-service');
      console.log('Endpoint:', `/api/v1/gaushala/health-records?page=${currentPage - 1}&size=${entriesPerPage}`);
      console.log('Token (first 20 chars):', token.substring(0, 20) + '...');

      const response = await healthRecordsApi.getAllHealthRecords(currentPage - 1, entriesPerPage);

      console.log('API Response:', response);

      if (response.success && response.data) {
        const records = response.data.content;
        console.log('Fetched records:', records.length);
        setHealthHistory(records);
        setTotalRecords(response.data.totalElements);

        // Fetch cattle details for all records
        const cattleIds = [...new Set(records.map(r => r.cattleId))];
        const cattleMap = new Map<number, Cattle>();

        await Promise.all(
          cattleIds.map(async (cattleId) => {
            const cattleResponse = await cattleApi.getCattleById(cattleId);
            if (cattleResponse.success && cattleResponse.data) {
              cattleMap.set(cattleId, cattleResponse.data);
            }
          })
        );

        setCattle(cattleMap);
      } else {
        const errorMsg = response.error || 'Failed to fetch health records';
        console.error('API Error:', errorMsg);

        // Check if it's an authentication error
        if (errorMsg.includes('Session Expired') || errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
          setError('Your session has expired. Please login again to access health records.');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setError(errorMsg);
        }
      }
    } catch (err) {
      console.error('Error fetching health records:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError('Cannot connect to gaushala-service. Please ensure:\n1. Gaushala service is running on port 8086\n2. Run: mvn spring-boot:run -DskipTests -pl gaushala-service');
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        setError('Authentication failed. Please login again.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(`Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // COLUMN MANAGEMENT FUNCTIONS
  // ============================================================================

  // Save columns to localStorage
  const saveColumnsToStorage = (cols: ColumnConfig[]) => {
    localStorage.setItem('healthHistoryColumns', JSON.stringify(cols));
    localStorage.setItem('healthHistoryColumnsVersion', COLUMNS_VERSION.toString());
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
  const applySorting = (data: HealthRecord[]): HealthRecord[] => {
    if (sortConfig.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const config of sortConfig) {
        let comparison = 0;

        switch (config.column) {
          case 'cattleName':
            comparison = (cattle.get(a.cattleId)?.name || '').localeCompare(cattle.get(b.cattleId)?.name || '');
            break;
          case 'recordType':
            comparison = (a.recordType || '').localeCompare(b.recordType || '');
            break;
          case 'recordDate':
            comparison = new Date(a.recordDate || 0).getTime() - new Date(b.recordDate || 0).getTime();
            break;
          case 'veterinarian':
            comparison = (a.veterinarianName || '').localeCompare(b.veterinarianName || '');
            break;
          case 'diagnosis':
            comparison = (a.diagnosis || '').localeCompare(b.diagnosis || '');
            break;
          case 'nextCheckup':
            comparison = new Date(a.nextCheckupDate || a.nextVaccinationDate || 0).getTime() -
                        new Date(b.nextCheckupDate || b.nextVaccinationDate || 0).getTime();
            break;
          case 'status':
            comparison = (a.status || '').localeCompare(b.status || '');
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

  const renderCellContent = (column: ColumnConfig['key'], item: HealthRecord, index: number) => {
    switch (column) {
      case 'sl':
        return (currentPage - 1) * entriesPerPage + index + 1;

      case 'cattleName':
        return (
          <div className="font-medium">
            {cattle.get(item.cattleId)?.name || `Cattle #${item.cattleId}`}
          </div>
        );

      case 'recordType':
        return getRecordTypeBadge(item.recordType);

      case 'recordDate':
        return formatDate(item.recordDate);

      case 'veterinarian':
        return item.veterinarianName || '-';

      case 'diagnosis':
        return (
          <div className="max-w-xs truncate" title={item.diagnosis || '-'}>
            {item.diagnosis || '-'}
          </div>
        );

      case 'nextCheckup':
        return formatDate(item.nextCheckupDate || item.nextVaccinationDate);

      case 'status':
        return getStatusBadge(item.status);

      case 'action':
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/gaushala/health-history/view/${item.id}`)}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate(`/gaushala/health-history/edit/${item.id}`)}
              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => item.id && handleDelete(item.id)}
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

  // Apply filters
  useEffect(() => {
    let filtered = healthHistory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const cattleName = cattle.get(item.cattleId)?.name || '';
        const recordType = item.recordType || '';
        const veterinarianName = item.veterinarianName || '';
        const recordDate = item.recordDate || '';

        return (
          cattleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          veterinarianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recordDate.includes(searchTerm)
        );
      });
    }

    // Apply specific filters
    if (filterRecordType) {
      filtered = filtered.filter(item => item.recordType === filterRecordType);
    }
    if (filterVeterinarian) {
      filtered = filtered.filter(item =>
        item.veterinarianName?.toLowerCase().includes(filterVeterinarian.toLowerCase())
      );
    }
    if (filterRecordDate) {
      filtered = filtered.filter(item => item.recordDate === filterRecordDate);
    }
    if (filterNextFollowUpDate) {
      filtered = filtered.filter(item =>
        item.nextCheckupDate === filterNextFollowUpDate ||
        item.nextVaccinationDate === filterNextFollowUpDate
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Apply sorting
    filtered = applySorting(filtered);

    setFilteredData(filtered);
  }, [searchTerm, filterRecordType, filterVeterinarian, filterRecordDate, filterNextFollowUpDate, filterStatus, healthHistory, cattle, sortConfig]);

  // Pagination
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalRecords / entriesPerPage);
  const startIndex = 0;
  const endIndex = filteredData.length;
  const currentData = filteredData;

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get status badge color
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>;
      case 'SCHEDULED':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Scheduled</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Unknown</span>;
    }
  };

  // Get record type badge color
  const getRecordTypeBadge = (type: string) => {
    switch (type) {
      case 'VACCINATION':
        return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Vaccination</span>;
      case 'TREATMENT':
        return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Treatment</span>;
      case 'CHECKUP':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Checkup</span>;
      case 'SURGERY':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Surgery</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{type}</span>;
    }
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this health record?')) return;

    try {
      const response = await healthRecordsApi.deleteHealthRecord(id);
      if (response.success) {
        alert('Health record deleted successfully');
        fetchHealthRecords();
      } else {
        alert('Failed to delete health record: ' + response.error);
      }
    } catch (err) {
      alert('An error occurred while deleting the health record');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health History</h1>
          <p className="text-gray-600 mt-1">Cattle health records and medical history</p>
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
            Add Health Record
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900">Error loading health records</h3>
            <div className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</div>
            <button
              onClick={fetchHealthRecords}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Record Type</label>
                  <select
                    value={filterRecordType}
                    onChange={(e) => setFilterRecordType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">------ All ------</option>
                    <option value="VACCINATION">Vaccination</option>
                    <option value="TREATMENT">Treatment</option>
                    <option value="CHECKUP">Checkup</option>
                    <option value="SURGERY">Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">------ All ------</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Record Date</label>
                  <input
                    type="date"
                    value={filterRecordDate}
                    onChange={(e) => setFilterRecordDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Veterinarian</label>
                  <input
                    type="text"
                    placeholder="Search vet name..."
                    value={filterVeterinarian}
                    onChange={(e) => setFilterVeterinarian(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : currentData.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Calendar className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-700">No health records found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalRecords === 0
                      ? "Get started by adding your first health record for cattle"
                      : "Try adjusting your search or filter criteria"}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/gaushala/health-history/add')}
                  className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add First Health Record
                </button>
              </div>
            </div>
          ) : (
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
                      onClick={(e) => col.sortable && !draggedColumn && handleSort(col.key as SortableColumn, e.shiftKey)}
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
                {currentData.map((item, index) => (
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
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
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
                disabled={currentPage === totalPages || totalPages === 0}
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
