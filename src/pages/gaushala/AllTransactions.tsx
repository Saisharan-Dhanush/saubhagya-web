/**
 * All Transactions Page - Shows all field worker transactions
 * Displays comprehensive transaction history with field worker management
 */

import { useState, useEffect } from 'react';
import {
  Calendar,
  Scale,
  User,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  X,
  Download,
  Filter,
  Search,
  Coins,
  BarChart3,
  Users,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  Eye as EyeIcon,
  EyeOff,
  ChevronDown
} from 'lucide-react';
import { biogasService, type DungCollectionResponse } from '../../services/biogasService';

interface Contribution {
  id: string;
  externalId: string;
  contributionDate: string;
  weightKg: number;
  ratePerKg: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'CASH' | 'NEFT' | 'AEPS';
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  qualityGrade: 'PREMIUM' | 'STANDARD' | 'BASIC';
  moistureContent?: number;
  gpsLatitude?: number;
  gpsLongitude?: number;
  workflowStatus: string;
  validationStatus: string;
  notes?: string;
  operatorUserId?: string;
  operatorName?: string;
  operatorPhone?: string;
  farmer?: {
    name: string;
    externalId: string;
    phone?: string;
  };
}

interface Props {
  onClose?: () => void;
}

interface SortConfig {
  column: SortableColumn;
  direction: 'asc' | 'desc';
}

type SortableColumn =
  | 'date'
  | 'transactionId'
  | 'farmer'
  | 'fieldWorker'
  | 'weight'
  | 'quality'
  | 'amount'
  | 'paymentMethod'
  | 'status';

interface ColumnConfig {
  key: SortableColumn;
  label: string;
  visible: boolean;
  order: number;
}

const translations = {
  en: {
    title: 'All Field Worker Transactions',
    subtitle: 'Comprehensive transaction history across all field workers',
    summary: 'Summary',
    totalTransactions: 'Total Transactions',
    totalWeight: 'Total Weight',
    totalValue: 'Total Value',
    activeWorkers: 'Active Workers',
    searchPlaceholder: 'Search by transaction ID, farmer, or field worker...',
    filterByPayment: 'Filter by Payment',
    filterByQuality: 'Filter by Quality',
    filterByWorker: 'Filter by Field Worker',
    allPayments: 'All Payments',
    allQualities: 'All Qualities',
    allWorkers: 'All Field Workers',
    date: 'Date',
    transactionId: 'Transaction ID',
    farmer: 'Farmer',
    fieldWorker: 'Field Worker',
    weight: 'Weight (kg)',
    quality: 'Quality',
    amount: 'Amount (₹)',
    paymentMethod: 'Payment',
    status: 'Status',
    actions: 'Actions',
    view: 'View Details',
    premium: 'Premium',
    standard: 'Standard',
    basic: 'Basic',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    exportData: 'Export Data',
    noTransactions: 'No transactions found',
    kg: 'kg',
    close: 'Close',
    viewDetails: 'View Details',
    location: 'Location',
    moistureContent: 'Moisture Content',
    notes: 'Notes',
    workflowStatus: 'Workflow Status',
    validationStatus: 'Validation Status'
  }
};

export default function AllTransactions({ onClose }: Props) {
  const [language] = useState<'en'>('en');
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  const [workerFilter, setWorkerFilter] = useState('');
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // Sort state - supports multiple column sorting
  const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);

  // Column visibility state
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<SortableColumn | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<SortableColumn | null>(null);
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    // Default columns configuration - 9 total columns
    const defaultColumns: ColumnConfig[] = [
      { key: 'date', label: 'Date', visible: true, order: 0 },
      { key: 'transactionId', label: 'Transaction ID', visible: true, order: 1 },
      { key: 'farmer', label: 'Farmer', visible: true, order: 2 },
      { key: 'fieldWorker', label: 'Field Worker', visible: true, order: 3 },
      { key: 'weight', label: 'Weight (kg)', visible: true, order: 4 },
      { key: 'quality', label: 'Quality', visible: true, order: 5 },
      { key: 'amount', label: 'Amount (₹)', visible: true, order: 6 },
      { key: 'paymentMethod', label: 'Payment', visible: true, order: 7 },
      { key: 'status', label: 'Status', visible: true, order: 8 },
    ];

    // Try to load from localStorage first
    const saved = localStorage.getItem('transactionTableColumns');
    const savedVersion = localStorage.getItem('transactionTableColumnsVersion');
    const CURRENT_VERSION = '1.0';

    if (saved && savedVersion === CURRENT_VERSION) {
      try {
        const parsed = JSON.parse(saved);
        // Verify all 9 columns exist
        if (parsed.length === 9) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved columns:', e);
      }
    }

    // If no saved data or version mismatch, use defaults and save them
    localStorage.setItem('transactionTableColumns', JSON.stringify(defaultColumns));
    localStorage.setItem('transactionTableColumnsVersion', CURRENT_VERSION);
    return defaultColumns;
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  useEffect(() => {
    loadAllContributions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contributions, searchTerm, paymentFilter, qualityFilter, workerFilter]);

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

  // Pagination calculation
  const totalEntries = filteredContributions.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentData = filteredContributions.slice(startIndex, endIndex);

  const loadAllContributions = async () => {
    try {
      setLoading(true);

      // Call the new simplified endpoint that automatically filters by user's gaushala
      const response = await biogasService.getMyGaushalaCollections(0, 1000);

      // Check if response has data
      if (!response.success || !response.data) {
        setContributions([]);
        return;
      }

      // Handle different response formats
      let collections: DungCollectionResponse[] = [];

      if (response.data.content && Array.isArray(response.data.content)) {
        // Standard pagination format: { content: [], totalElements: X }
        collections = response.data.content;
      } else if (Array.isArray(response.data)) {
        // Direct array format
        collections = response.data;
      }

      // Transform DungCollectionResponse to Contribution format
      const transformedContributions = collections.map((collection: DungCollectionResponse): Contribution => ({
        id: collection.id,
        externalId: collection.transactionRef || collection.id,
        contributionDate: collection.collectionDate,
        weightKg: collection.weightKg,
        ratePerKg: collection.ratePerKg,
        totalAmount: collection.totalAmount,
        paymentMethod: collection.paymentMethod as 'UPI' | 'CASH' | 'NEFT' | 'AEPS',
        paymentStatus: collection.paymentStatus,
        qualityGrade: collection.qualityGrade === 'A' ? 'PREMIUM' : collection.qualityGrade === 'B' ? 'STANDARD' : 'BASIC',
        moistureContent: 0,
        gpsLatitude: 0,
        gpsLongitude: 0,
        workflowStatus: collection.transactionStatus,
        validationStatus: collection.assignedToBatch ? 'ASSIGNED' : 'PENDING',
        notes: collection.qualityNotes,
        operatorUserId: undefined,
        operatorName: 'Collection Worker',
        operatorPhone: undefined,
        farmer: {
          name: `Gaushala ${collection.gaushalaId}`,
          externalId: collection.gaushalaId?.toString() || 'unknown',
          phone: undefined
        }
      }));

      setContributions(transformedContributions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setContributions([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...contributions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.externalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.farmer?.name && c.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.operatorName && c.operatorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Payment method filter
    if (paymentFilter) {
      filtered = filtered.filter(c => c.paymentMethod === paymentFilter);
    }

    // Quality filter
    if (qualityFilter) {
      filtered = filtered.filter(c => c.qualityGrade === qualityFilter);
    }

    // Field worker filter
    if (workerFilter) {
      filtered = filtered.filter(c => c.operatorUserId === workerFilter);
    }

    setFilteredContributions(filtered);
    setCurrentPage(1);
  };

  const calculateSummary = () => {
    const totalTransactions = contributions.length;
    const totalWeight = contributions.reduce((sum, c) => sum + c.weightKg, 0);
    const totalValue = contributions.reduce((sum, c) => sum + c.totalAmount, 0);
    const uniqueWorkers = new Set(contributions.map(c => c.operatorUserId).filter(Boolean));

    return {
      totalTransactions,
      totalWeight: totalWeight.toFixed(1),
      totalValue: totalValue.toFixed(2),
      activeWorkers: uniqueWorkers.size
    };
  };

  const getUniqueWorkers = () => {
    const workers = new Map();
    contributions.forEach(c => {
      if (c.operatorUserId && c.operatorName) {
        workers.set(c.operatorUserId, c.operatorName);
      }
    });
    return Array.from(workers.entries()).map(([id, name]) => ({ id, name }));
  };

  /**
   * Handle column sorting with multi-column support
   * Click: Set single column sort (toggle asc/desc/clear)
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
    localStorage.setItem('transactionTableColumns', JSON.stringify(newColumns));
    localStorage.setItem('transactionTableColumnsVersion', '1.0');
  };

  /**
   * Reset columns to default
   */
  const resetColumns = () => {
    const defaultColumns: ColumnConfig[] = [
      { key: 'date', label: 'Date', visible: true, order: 0 },
      { key: 'transactionId', label: 'Transaction ID', visible: true, order: 1 },
      { key: 'farmer', label: 'Farmer', visible: true, order: 2 },
      { key: 'fieldWorker', label: 'Field Worker', visible: true, order: 3 },
      { key: 'weight', label: 'Weight (kg)', visible: true, order: 4 },
      { key: 'quality', label: 'Quality', visible: true, order: 5 },
      { key: 'amount', label: 'Amount (₹)', visible: true, order: 6 },
      { key: 'paymentMethod', label: 'Payment', visible: true, order: 7 },
      { key: 'status', label: 'Status', visible: true, order: 8 },
    ];
    setColumns(defaultColumns);
    localStorage.setItem('transactionTableColumns', JSON.stringify(defaultColumns));
    localStorage.setItem('transactionTableColumnsVersion', '1.0');
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
    localStorage.setItem('transactionTableColumns', JSON.stringify(newColumns));
    localStorage.setItem('transactionTableColumnsVersion', '1.0');
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
   * Apply sorting to filtered contributions
   */
  const applySorting = (contributionsList: Contribution[]): Contribution[] => {
    if (sortConfig.length === 0) return contributionsList;

    return [...contributionsList].sort((a, b) => {
      for (const { column, direction } of sortConfig) {
        let compareResult = 0;

        switch (column) {
          case 'date':
            const dateA = new Date(a.contributionDate).getTime();
            const dateB = new Date(b.contributionDate).getTime();
            compareResult = dateA - dateB;
            break;
          case 'transactionId':
            compareResult = a.externalId.localeCompare(b.externalId);
            break;
          case 'farmer':
            compareResult = (a.farmer?.name || '').localeCompare(b.farmer?.name || '');
            break;
          case 'fieldWorker':
            compareResult = (a.operatorName || '').localeCompare(b.operatorName || '');
            break;
          case 'weight':
            compareResult = (a.weightKg || 0) - (b.weightKg || 0);
            break;
          case 'quality':
            compareResult = a.qualityGrade.localeCompare(b.qualityGrade);
            break;
          case 'amount':
            compareResult = (a.totalAmount || 0) - (b.totalAmount || 0);
            break;
          case 'paymentMethod':
            compareResult = a.paymentMethod.localeCompare(b.paymentMethod);
            break;
          case 'status':
            compareResult = a.paymentStatus.localeCompare(b.paymentStatus);
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
   * Render cell content based on column key
   */
  const renderCellContent = (column: SortableColumn, contribution: Contribution) => {
    switch (column) {
      case 'date':
        return (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            {formatDate(contribution.contributionDate)}
          </div>
        );
      case 'transactionId':
        return <span className="font-mono text-sm">{contribution.externalId}</span>;
      case 'farmer':
        return (
          <div>
            <div className="font-medium">{contribution.farmer?.name || 'Unknown'}</div>
            <div className="text-xs text-gray-500">{contribution.farmer?.externalId}</div>
          </div>
        );
      case 'fieldWorker':
        return (
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <div className="font-medium">{contribution.operatorName || 'Unknown'}</div>
              <div className="text-xs text-gray-500">{contribution.operatorPhone}</div>
            </div>
          </div>
        );
      case 'weight':
        return `${contribution.weightKg} ${t('kg')}`;
      case 'quality':
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityColor(contribution.qualityGrade)}`}>
            {t(contribution.qualityGrade.toLowerCase())}
          </span>
        );
      case 'amount':
        return <span className="font-semibold text-green-600">₹{contribution.totalAmount.toFixed(2)}</span>;
      case 'paymentMethod':
        return contribution.paymentMethod;
      case 'status':
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(contribution.paymentStatus)}`}>
            {t(contribution.paymentStatus.toLowerCase())}
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'PREMIUM':
        return 'bg-green-100 text-green-800';
      case 'STANDARD':
        return 'bg-blue-100 text-blue-800';
      case 'BASIC':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setShowDetailsModal(true);
  };

  const handleExportData = () => {
    const csvData = contributions.map(c => ({
      'Transaction ID': c.externalId,
      'Date': formatDate(c.contributionDate),
      'Farmer': c.farmer?.name || 'Unknown',
      'Field Worker': c.operatorName || 'Unknown',
      'Phone': c.operatorPhone || 'N/A',
      'Weight (kg)': c.weightKg,
      'Quality': c.qualityGrade,
      'Rate (₹/kg)': c.ratePerKg,
      'Total Amount (₹)': c.totalAmount,
      'Payment Method': c.paymentMethod,
      'Payment Status': c.paymentStatus,
      'Location': c.gpsLatitude && c.gpsLongitude ? `${c.gpsLatitude}, ${c.gpsLongitude}` : 'N/A',
      'Notes': c.notes || 'N/A'
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `field-worker-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const summary = calculateSummary();
  const uniqueWorkers = getUniqueWorkers();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Modern Floating Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur opacity-40"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {t('title')}
                </h1>
                <p className="text-xs text-slate-500">
                  {t('subtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 duration-200"
              >
                <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {t('exportData')}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Transactions Card */}
          <div className="group relative backdrop-blur-xl bg-white/60 rounded-2xl p-5 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">+0%</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('totalTransactions')}</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">{summary.totalTransactions}</p>
                <p className="text-xs text-slate-500">Total records</p>
              </div>
            </div>
          </div>

          {/* Total Weight Card */}
          <div className="group relative backdrop-blur-xl bg-white/60 rounded-2xl p-5 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+0%</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('totalWeight')}</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">{summary.totalWeight} <span className="text-lg text-slate-500">kg</span></p>
                <p className="text-xs text-slate-500">Kilograms collected</p>
              </div>
            </div>
          </div>

          {/* Total Value Card */}
          <div className="group relative backdrop-blur-xl bg-white/60 rounded-2xl p-5 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/30">
                  <Coins className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">+0%</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('totalValue')}</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">₹{summary.totalValue}</p>
                <p className="text-xs text-slate-500">Total earnings</p>
              </div>
            </div>
          </div>

          {/* Active Workers Card */}
          <div className="group relative backdrop-blur-xl bg-white/60 rounded-2xl p-5 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">+0%</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('activeWorkers')}</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">{summary.activeWorkers}</p>
                <p className="text-xs text-slate-500">Field workers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Filters and Controls Card */}
        <div className="relative backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5 rounded-2xl"></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-lg shadow-slate-600/30">
                <Filter className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Filters & Search</h3>
            </div>

            <div className="space-y-4">
              {/* Modern Search Bar */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="relative w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm hover:shadow-md"
                />
              </div>

              {/* Modern Filter Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-700 mb-2 tracking-wide uppercase">Field Worker</label>
                  <div className="relative">
                    <select
                      value={workerFilter}
                      onChange={(e) => setWorkerFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-sm font-medium text-slate-900 appearance-none cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <option value="">{t('allWorkers')}</option>
                      {uniqueWorkers.map((worker) => (
                        <option key={worker.id} value={worker.id}>{worker.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-700 mb-2 tracking-wide uppercase">Payment Method</label>
                  <div className="relative">
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-sm font-medium text-slate-900 appearance-none cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <option value="">{t('allPayments')}</option>
                      <option value="UPI">UPI</option>
                      <option value="CASH">Cash</option>
                      <option value="NEFT">NEFT</option>
                      <option value="AEPS">AEPS</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-700 mb-2 tracking-wide uppercase">Quality Grade</label>
                  <div className="relative">
                    <select
                      value={qualityFilter}
                      onChange={(e) => setQualityFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-sm font-medium text-slate-900 appearance-none cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <option value="">{t('allQualities')}</option>
                      <option value="PREMIUM">{t('premium')}</option>
                      <option value="STANDARD">{t('standard')}</option>
                      <option value="BASIC">{t('basic')}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table Controls Bar */}
        <div className="relative backdrop-blur-xl bg-white/60 rounded-2xl p-5 border border-white/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5 rounded-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm font-semibold text-slate-700">entries</span>
            </div>

            <div className="text-sm font-medium text-slate-600">
              Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-slate-900">{endIndex}</span> of{' '}
              <span className="font-bold text-slate-900">{totalEntries}</span> transactions
            </div>
          </div>
        </div>


        {/* Column Selector Button */}
        <div className="relative backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/50 shadow-xl mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5 rounded-2xl"></div>
          <div className="relative flex justify-end">
            <div className="relative column-selector-container">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 font-medium"
              >
                <Columns className="h-4 w-4" />
                Manage Columns ({getVisibleColumns().length}/{columns.length})
              </button>

              {/* Modern Column Selector Dropdown */}
              {showColumnSelector && (
                <div className="absolute right-0 mt-3 w-80 backdrop-blur-xl bg-white/95 border border-slate-200/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-5 border-b border-slate-200/50 bg-gradient-to-br from-slate-50/50 to-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Column Visibility</h3>
                      <button
                        onClick={() => setShowColumnSelector(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-3">
                    {columns.sort((a, b) => a.order - b.order).map((column) => (
                      <button
                        key={column.key}
                        onClick={() => toggleColumnVisibility(column.key)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center w-5 h-5">
                          {column.visible ? (
                            <EyeIcon className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-slate-400 group-hover:text-slate-500" />
                          )}
                        </div>
                        <span className="flex-1 text-left text-sm font-medium text-slate-700">
                          {column.label}
                        </span>
                        <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                          #{column.order + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="p-4 border-t border-slate-200/50 bg-gradient-to-br from-slate-50/50 to-white">
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                      <span className="font-medium">Visible: <span className="text-blue-600 font-bold">{getVisibleColumns().length}</span> / {columns.length}</span>
                    </div>
                    <button
                      onClick={resetColumns}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm font-semibold shadow-sm"
                    >
                      Reset to Default
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modern Transactions Table Card */}
        <div className="relative backdrop-blur-xl bg-white/60 rounded-2xl overflow-hidden border border-white/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5"></div>

          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200/50 bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm">
                  {/* Dynamic Column Headers */}
                  {getVisibleColumns().map((column) => (
                    <th
                      key={column.key}
                      draggable
                      onDragStart={() => handleDragStart(column.key)}
                      onDragOver={(e) => handleDragOver(e, column.key)}
                      onDrop={() => handleDrop(column.key)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => {
                        // Don't sort during drag
                        if (!draggedColumn) {
                          handleSort(column.key, e.shiftKey);
                        }
                      }}
                      className={`px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer select-none transition-all duration-300 ${
                        draggedColumn === column.key ? 'opacity-50 scale-95' : ''
                      } ${
                        dragOverColumn === column.key ? 'border-l-4 border-blue-500 bg-blue-50/50' : ''
                      } hover:bg-slate-100/80`}
                      title={`Click to sort, Shift+Click for multi-column sort, Drag to reorder`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 cursor-move hover:text-slate-600 transition-colors">⋮⋮</span>
                        {column.label}
                        {getSortIndicator(column.key)}
                      </div>
                    </th>
                  ))}
                  {/* Actions Column - Always Visible */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {applySorting(currentData).map((contribution, index) => (
                  <tr
                    key={contribution.id}
                    className={`group transition-all duration-300 hover:bg-blue-50/50 hover:scale-[1.01] ${
                      index % 2 === 0 ? 'bg-white/50' : 'bg-slate-50/30'
                    }`}
                  >
                    {/* Dynamic Column Cells */}
                    {getVisibleColumns().map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {renderCellContent(column.key, contribution)}
                      </td>
                    ))}
                    {/* Actions Column - Always Visible */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(contribution)}
                        className="p-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-500/30 group-hover:scale-110"
                        title={t('viewDetails')}
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modern Pagination Footer */}
          <div className="relative backdrop-blur-sm bg-gradient-to-r from-slate-50/90 to-slate-100/90 px-6 py-5 border-t border-slate-200/50">
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-slate-600">Showing</span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-sm">
                  {startIndex + 1}
                </span>
                <span className="text-slate-600">to</span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-sm">
                  {endIndex}
                </span>
                <span className="text-slate-600">of</span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-sm">
                  {totalEntries}
                </span>
                <span className="text-slate-600">entries</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
                    {currentPage}
                  </span>
                  <span className="text-slate-400 font-bold px-1">/</span>
                  <span className="text-slate-700 font-bold">{totalPages}</span>
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>


          {filteredContributions.length === 0 && (
            <div className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-400/20 to-slate-500/20 rounded-full blur-xl"></div>
                <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                  <Scale className="h-12 w-12 text-slate-400" />
                </div>
              </div>
              <p className="text-slate-900 text-xl font-bold mb-2">{t('noTransactions')}</p>
              <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>

        {/* Modern Glassmorphism Details Modal */}
        {showDetailsModal && selectedContribution && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="relative backdrop-blur-2xl bg-white/95 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 pointer-events-none"></div>

              {/* Modern Modal Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-7">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Transaction Details</h3>
                      <p className="text-blue-100 text-sm font-medium">Complete transaction information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2.5 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:rotate-90"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modern Modal Content */}
              <div className="relative overflow-y-auto max-h-[calc(90vh-140px)] p-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Transaction ID Card */}
                  <div className="group relative backdrop-blur-xl bg-white/70 p-5 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>
                    <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Transaction ID</label>
                    <p className="relative text-lg font-mono font-bold text-slate-900 break-all">{selectedContribution.externalId}</p>
                  </div>

                  {/* Date Card */}
                  <div className="group relative backdrop-blur-xl bg-white/70 p-5 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>
                    <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Date</label>
                    <p className="relative text-lg font-bold text-slate-900">{formatDate(selectedContribution.contributionDate)}</p>
                  </div>

                  {/* Farmer Card */}
                  <div className="group relative backdrop-blur-xl bg-white/70 p-5 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl"></div>
                    <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Farmer</label>
                    <p className="relative text-lg font-bold text-slate-900">{selectedContribution.farmer?.name || 'Unknown'}</p>
                    <p className="relative text-sm text-slate-500 font-medium mt-1">{selectedContribution.farmer?.externalId}</p>
                  </div>

                  {/* Field Worker Card */}
                  <div className="group relative backdrop-blur-xl bg-white/70 p-5 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-2xl"></div>
                    <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Field Worker</label>
                    <p className="relative text-lg font-bold text-slate-900">{selectedContribution.operatorName || 'Unknown'}</p>
                    <p className="relative text-sm text-slate-500 font-medium mt-1">{selectedContribution.operatorPhone}</p>
                  </div>

                  {/* Weight Card */}
                  <div className="group relative backdrop-blur-xl bg-white/70 p-5 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
                    <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Weight</label>
                    <p className="relative text-3xl font-bold text-slate-900">{selectedContribution.weightKg} <span className="text-xl text-slate-600">kg</span></p>
                  </div>

                  {/* Rate Card */}
                  <div className="group relative backdrop-blur-xl bg-white/70 p-5 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl"></div>
                    <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Rate per kg</label>
                    <p className="relative text-3xl font-bold text-slate-900">₹{selectedContribution.ratePerKg}</p>
                  </div>

                  {/* Total Amount Card - Premium */}
                  <div className="group relative backdrop-blur-xl bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-2xl border-2 border-emerald-300/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl"></div>
                    <label className="relative text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      Total Amount
                    </label>
                    <p className="relative text-4xl font-bold text-emerald-700">₹{selectedContribution.totalAmount}</p>
                  </div>

                  {/* Payment Method Card */}
                  <div className="group relative backdrop-blur-xl bg-white/70 p-5 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-2xl"></div>
                    <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Payment Method</label>
                    <p className="relative text-lg font-bold text-slate-900">{selectedContribution.paymentMethod}</p>
                  </div>

                  {/* Optional Fields */}
                  {selectedContribution.moistureContent && (
                    <div className="group relative backdrop-blur-xl bg-white/70 p-5 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 rounded-2xl"></div>
                      <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Moisture Content</label>
                      <p className="relative text-2xl font-bold text-slate-900">{selectedContribution.moistureContent}%</p>
                    </div>
                  )}
                  {selectedContribution.gpsLatitude && selectedContribution.gpsLongitude && (
                    <div className="group relative backdrop-blur-xl bg-white/70 p-5 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-2xl"></div>
                      <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Location</label>
                      <p className="relative text-sm font-mono font-medium text-slate-900">{selectedContribution.gpsLatitude}, {selectedContribution.gpsLongitude}</p>
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                {selectedContribution.notes && (
                  <div className="relative backdrop-blur-xl bg-white/70 p-6 rounded-2xl border border-slate-200/50 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-2xl"></div>
                    <label className="relative text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">Notes</label>
                    <p className="relative text-base font-medium text-slate-700 leading-relaxed">{selectedContribution.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}