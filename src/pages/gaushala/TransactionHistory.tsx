/**
 * Transaction History Page
 * Comprehensive dung collection transaction tracking with digestor information
 */

import { useState, useEffect } from 'react';
import {
  Calendar,
  Filter,
  Download,
  Search,
  TrendingUp,
  DollarSign,
  Scale,
  MapPin,
  Clock,
  User,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  FileText,
  BarChart3,
  Shield,
  Plus,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  Eye as EyeIcon,
  EyeOff
} from 'lucide-react';
import { biogasService, type DungCollectionResponse } from '../../services/biogasService';
import { authService } from '../../services/authService';

interface LanguageContextType {
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  t: (key: string) => string;
}

interface Transaction {
  id: string;
  cattleId: string;
  cattleName: string;
  workerId: string;
  workerName: string;
  digestorId: string;
  digestorName: string;
  weight: number;
  quality: number;
  amount: number;
  timestamp: number;
  status: 'completed' | 'processing' | 'failed' | 'pending_payment';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  collectionNotes?: string;
  paymentMethod?: 'cash' | 'upi' | 'bank' | 'pending';
  qualityGrade: 'A' | 'B' | 'C' | 'D';
  moistureContent: number;
  organicMatter: number;
  sessionId: string;
  paymentTimestamp: string | null;
  paymentRef: string | null;
  transactionStatus: string;
  assignedToBatch: boolean;
  createdAt: string;
  updatedAt: string;
  ratePerKg: number;
}

interface TransactionStats {
  totalTransactions: number;
  totalWeight: number;
  totalAmount: number;
  averageQuality: number;
  todayTransactions: number;
  pendingPayments: number;
  topDigestor: string;
  topWorker: string;
}

interface TransactionFilter {
  search: string;
  dateRange: 'today' | 'week' | 'month' | 'all';
  status: string;
  digestor: string;
  worker: string;
  paymentMethod: string;
}

interface SortConfig {
  column: SortableColumn;
  direction: 'asc' | 'desc';
}

type SortableColumn =
  | 'id'
  | 'cattle'
  | 'worker'
  | 'digestor'
  | 'weight'
  | 'quality'
  | 'amount'
  | 'status'
  | 'datetime'
  | 'ratePerKg'
  | 'paymentTimestamp'
  | 'paymentRef'
  | 'transactionStatus'
  | 'assignedToBatch'
  | 'createdAt'
  | 'updatedAt';

interface ColumnConfig {
  key: SortableColumn;
  label: string;
  visible: boolean;
  order: number;
}

const translations = {
  en: {
    title: 'Transaction History',
    subtitle: 'Complete dung collection transaction records with digestor tracking',
    exportData: 'Export Data',
    totalTransactions: 'Total Transactions',
    totalWeight: 'Total Weight',
    totalAmount: 'Total Amount',
    avgQuality: 'Average Quality',
    todayTransactions: 'Today\'s Transactions',
    pendingPayments: 'Pending Payments',
    topDigestor: 'Top Digestor',
    topWorker: 'Top Worker',
    searchPlaceholder: 'Search by cattle, worker, or digestor...',
    filterBy: 'Filter By',
    dateRange: 'Date Range',
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    all: 'All Time',
    allStatus: 'All Status',
    completed: 'Completed',
    processing: 'Processing',
    failed: 'Failed',
    pendingPayment: 'Pending Payment',
    allDigestors: 'All Digestors',
    allWorkers: 'All Workers',
    allPaymentMethods: 'All Payment Methods',
    cash: 'Cash',
    upi: 'UPI',
    bank: 'Bank Transfer',
    pending: 'Pending',
    transactionId: 'Transaction ID',
    cattle: 'Cattle',
    worker: 'Worker',
    digestor: 'Digestor',
    weight: 'Weight',
    quality: 'Quality',
    amount: 'Amount',
    status: 'Status',
    datetime: 'Date & Time',
    actions: 'Actions',
    view: 'View',
    kg: 'kg',
    gradeA: 'Grade A',
    gradeB: 'Grade B',
    gradeC: 'Grade C',
    gradeD: 'Grade D',
    moisture: 'Moisture',
    organicMatter: 'Organic Matter',
    paymentMethod: 'Payment Method',
    location: 'Location',
    collectionNotes: 'Collection Notes',
    sessionId: 'Session ID',
    ratePerKg: 'Rate/Kg',
    paymentTimestamp: 'Payment Time',
    paymentRef: 'Payment Ref',
    transactionStatus: 'Transaction Status',
    assignedToBatch: 'Assigned to Batch',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    transactionDetails: 'Transaction Details',
    basicInfo: 'Basic Information',
    qualityInfo: 'Quality Information',
    paymentInfo: 'Payment Information',
    locationInfo: 'Location Information',
    noTransactions: 'No transactions found',
    changeFilters: 'Try changing your filters or date range'
  },
  hi: {
    title: 'लेन-देन इतिहास',
    subtitle: 'डाइजेस्टर ट्रैकिंग के साथ पूर्ण गोबर संग्रह लेन-देन रिकॉर्ड',
    exportData: 'डेटा निर्यात करें',
    totalTransactions: 'कुल लेन-देन',
    totalWeight: 'कुल वजन',
    totalAmount: 'कुल राशि',
    avgQuality: 'औसत गुणवत्ता',
    todayTransactions: 'आज के लेन-देन',
    pendingPayments: 'लंबित भुगतान',
    topDigestor: 'शीर्ष डाइजेस्टर',
    topWorker: 'शीर्ष कार्यकर्ता',
    searchPlaceholder: 'पशु, कार्यकर्ता या डाइजेस्टर से खोजें...',
    filterBy: 'फ़िल्टर करें',
    dateRange: 'तारीख सीमा',
    today: 'आज',
    week: 'इस सप्ताह',
    month: 'इस महीने',
    all: 'सभी समय',
    allStatus: 'सभी स्थिति',
    completed: 'पूर्ण',
    processing: 'प्रक्रिया में',
    failed: 'असफल',
    pendingPayment: 'भुगतान लंबित',
    allDigestors: 'सभी डाइजेस्टर',
    allWorkers: 'सभी कार्यकर्ता',
    allPaymentMethods: 'सभी भुगतान विधि',
    cash: 'नकद',
    upi: 'UPI',
    bank: 'बैंक ट्रांसफर',
    pending: 'लंबित',
    transactionId: 'लेन-देन ID',
    cattle: 'पशु',
    worker: 'कार्यकर्ता',
    digestor: 'डाइजेस्टर',
    weight: 'वजन',
    quality: 'गुणवत्ता',
    amount: 'राशि',
    status: 'स्थिति',
    datetime: 'दिनांक और समय',
    actions: 'कार्य',
    view: 'देखें',
    kg: 'किलो',
    gradeA: 'ग्रेड A',
    gradeB: 'ग्रेड B',
    gradeC: 'ग्रेड C',
    gradeD: 'ग्रेड D',
    moisture: 'नमी',
    organicMatter: 'जैविक पदार्थ',
    paymentMethod: 'भुगतान विधि',
    location: 'स्थान',
    collectionNotes: 'संग्रह नोट्स',
    sessionId: 'सत्र ID',
    transactionDetails: 'लेन-देन विवरण',
    basicInfo: 'मूलभूत जानकारी',
    qualityInfo: 'गुणवत्ता जानकारी',
    paymentInfo: 'भुगतान जानकारी',
    locationInfo: 'स्थान जानकारी',
    noTransactions: 'कोई लेन-देन नहीं मिला',
    changeFilters: 'अपने फ़िल्टर या तारीख सीमा बदलने का प्रयास करें'
  }
};

interface Props {
  languageContext: LanguageContextType;
}

export default function TransactionHistory({ languageContext }: Props) {
  const { language } = languageContext;

  // CHECK USER ROLE
  const isBiogasOperator = authService.canViewAllTransactions();
  const isGaushalaManager = authService.canViewOnlyOwnTransactions();
  const userGaushalaId = authService.getUserGaushalaId();
  const userName = authService.getUserName();
  const userRole = authService.getRoleDisplayName();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    totalWeight: 0,
    totalAmount: 0,
    averageQuality: 0,
    todayTransactions: 0,
    pendingPayments: 0,
    topDigestor: '',
    topWorker: ''
  });
  const [filter, setFilter] = useState<TransactionFilter>({
    search: '',
    dateRange: 'month',
    status: '',
    digestor: '',
    worker: '',
    paymentMethod: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [newPaymentStatus, setNewPaymentStatus] = useState<'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'QUEUED'>('PENDING');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'UPI' | 'CASH' | 'BANK_TRANSFER' | 'pending'>('pending');
  const [paymentRef, setPaymentRef] = useState<string>('');

  // Sort state - supports multiple column sorting
  const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);

  // Column visibility state
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<SortableColumn | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<SortableColumn | null>(null);
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    // Default columns configuration - 16 total columns
    const defaultColumns: ColumnConfig[] = [
      { key: 'id', label: 'Transaction ID', visible: true, order: 0 },
      { key: 'cattle', label: 'Cattle', visible: true, order: 1 },
      { key: 'worker', label: 'Worker', visible: true, order: 2 },
      { key: 'digestor', label: 'Digestor', visible: true, order: 3 },
      { key: 'weight', label: 'Weight', visible: true, order: 4 },
      { key: 'quality', label: 'Quality', visible: true, order: 5 },
      { key: 'amount', label: 'Amount', visible: true, order: 6 },
      { key: 'status', label: 'Status', visible: true, order: 7 },
      { key: 'datetime', label: 'Date & Time', visible: true, order: 8 },
      { key: 'ratePerKg', label: 'Rate/Kg', visible: false, order: 9 },
      { key: 'paymentTimestamp', label: 'Payment Time', visible: false, order: 10 },
      { key: 'paymentRef', label: 'Payment Ref', visible: false, order: 11 },
      { key: 'transactionStatus', label: 'Transaction Status', visible: false, order: 12 },
      { key: 'assignedToBatch', label: 'Batch Status', visible: false, order: 13 },
      { key: 'createdAt', label: 'Created At', visible: false, order: 14 },
      { key: 'updatedAt', label: 'Updated At', visible: false, order: 15 },
    ];

    // Try to load from localStorage first
    const saved = localStorage.getItem('transactionTableColumns');
    const savedVersion = localStorage.getItem('transactionTableColumnsVersion');
    const CURRENT_VERSION = '1.0'; // Increment when adding new columns

    if (saved && savedVersion === CURRENT_VERSION) {
      try {
        const parsed = JSON.parse(saved);
        // Verify all 16 columns exist
        if (parsed.length === 16) {
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

  // NOTE: Mock data removed - now using real API data from biogasService.listDungCollections()

  useEffect(() => {
    loadTransactionData();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [transactions, filter]);

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

  const loadTransactionData = async () => {
    try {
      setLoading(true);

      // Role-based filtering: Gaushala Managers see only their own transactions
      const gaushalaIdFilter = isGaushalaManager ? userGaushalaId : undefined;

      // Fetch transaction data from biogas service - using dung collections API
      const response = await biogasService.listDungCollections(
        undefined, // clusterId - fetch all for now
        gaushalaIdFilter, // gaushalaId - filter for Gaushala Managers
        undefined, // paymentStatus - fetch all
        undefined, // startDate
        undefined, // endDate
        0, // page
        100 // size - load more records
      );

      if (!response.success || !response.data) {
        console.error('Failed to fetch dung collections:', response.error);
        setTransactions([]);
        return;
      }

      // Transform backend DungCollectionResponse to frontend Transaction interface
      const transformedTransactions = response.data.content.map((collection: DungCollectionResponse) => ({
        id: collection.id,
        cattleId: collection.gaushalaId?.toString() || 'N/A',
        cattleName: `Gaushala ${collection.gaushalaId || 'Unknown'}`,
        workerId: 'unknown_worker', // Not in DungCollectionResponse
        workerName: 'Collection Worker',
        digestorId: collection.clusterId || 'digestor_001',
        digestorName: `Cluster ${collection.clusterId || 'Unknown'}`,
        weight: collection.weightKg || 0,
        quality: collection.qualityGrade === 'A' ? 9 : collection.qualityGrade === 'B' ? 7 : collection.qualityGrade === 'C' ? 5 : 3,
        amount: collection.totalAmount || 0,
        timestamp: collection.collectionDate ? new Date(collection.collectionDate).getTime() : Date.now(),
        status: collection.paymentStatus === 'COMPLETED' ? 'completed' :
                collection.paymentStatus === 'PROCESSING' ? 'processing' :
                collection.paymentStatus === 'FAILED' ? 'failed' : 'pending_payment',
        location: {
          latitude: 0,
          longitude: 0,
          address: 'Location Not Available'
        },
        paymentMethod: collection.paymentMethod || 'Unknown',
        moisture: 0, // Not available in DungCollectionResponse
        rfidTag: collection.transactionRef || '',
        farmerName: 'Farmer Data Not Available',
        notes: collection.qualityNotes || '',
        qualityGrade: collection.qualityGrade || 'D',
        moistureContent: 0,
        organicMatter: 0,
        sessionId: collection.transactionRef || '',
        paymentTimestamp: collection.paymentTimestamp,
        paymentRef: collection.paymentRef,
        transactionStatus: collection.transactionStatus,
        assignedToBatch: collection.assignedToBatch,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        ratePerKg: collection.ratePerKg
      }));

      setTransactions(transformedTransactions);
    } catch (error) {
      console.error('Failed to fetch transaction data:', error);
      // Set empty array on API failure
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Search filter
    if (filter.search) {
      filtered = filtered.filter(t =>
        t.cattleName.toLowerCase().includes(filter.search.toLowerCase()) ||
        t.workerName.toLowerCase().includes(filter.search.toLowerCase()) ||
        t.digestorName.toLowerCase().includes(filter.search.toLowerCase()) ||
        t.id.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    // Date range filter
    const now = new Date();
    switch (filter.dateRange) {
      case 'today':
        filtered = filtered.filter(t =>
          new Date(t.timestamp).toDateString() === now.toDateString()
        );
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.timestamp) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.timestamp) >= monthAgo);
        break;
    }

    // Status filter
    if (filter.status) {
      filtered = filtered.filter(t => t.status === filter.status);
    }

    // Digestor filter
    if (filter.digestor) {
      filtered = filtered.filter(t => t.digestorId === filter.digestor);
    }

    // Worker filter
    if (filter.worker) {
      filtered = filtered.filter(t => t.workerId === filter.worker);
    }

    // Payment method filter
    if (filter.paymentMethod) {
      filtered = filtered.filter(t => t.paymentMethod === filter.paymentMethod);
    }

    setFilteredTransactions(filtered);
  };

  const calculateStats = () => {
    const totalTransactions = filteredTransactions.length;
    const totalWeight = filteredTransactions.reduce((sum, t) => sum + t.weight, 0);
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averageQuality = totalTransactions > 0
      ? filteredTransactions.reduce((sum, t) => sum + t.quality, 0) / totalTransactions
      : 0;

    const today = new Date().toDateString();
    const todayTransactions = filteredTransactions.filter(t =>
      new Date(t.timestamp).toDateString() === today
    ).length;

    const pendingPayments = filteredTransactions.filter(t =>
      t.paymentMethod === 'pending' || t.status === 'pending_payment'
    ).length;

    // Calculate top performer
    const digestorCounts: Record<string, number> = {};
    const workerCounts: Record<string, number> = {};

    filteredTransactions.forEach(t => {
      digestorCounts[t.digestorName] = (digestorCounts[t.digestorName] || 0) + 1;
      workerCounts[t.workerName] = (workerCounts[t.workerName] || 0) + 1;
    });

    const topDigestor = Object.keys(digestorCounts).reduce((a, b) =>
      digestorCounts[a] > digestorCounts[b] ? a : b, ''
    );

    const topWorker = Object.keys(workerCounts).reduce((a, b) =>
      workerCounts[a] > workerCounts[b] ? a : b, ''
    );

    setStats({
      totalTransactions,
      totalWeight,
      totalAmount,
      averageQuality,
      todayTransactions,
      pendingPayments,
      topDigestor,
      topWorker
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'pending_payment':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getQualityGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      { key: 'id', label: 'Transaction ID', visible: true, order: 0 },
      { key: 'cattle', label: 'Cattle', visible: true, order: 1 },
      { key: 'worker', label: 'Worker', visible: true, order: 2 },
      { key: 'digestor', label: 'Digestor', visible: true, order: 3 },
      { key: 'weight', label: 'Weight', visible: true, order: 4 },
      { key: 'quality', label: 'Quality', visible: true, order: 5 },
      { key: 'amount', label: 'Amount', visible: true, order: 6 },
      { key: 'status', label: 'Status', visible: true, order: 7 },
      { key: 'datetime', label: 'Date & Time', visible: true, order: 8 },
      { key: 'ratePerKg', label: 'Rate/Kg', visible: false, order: 9 },
      { key: 'paymentTimestamp', label: 'Payment Time', visible: false, order: 10 },
      { key: 'paymentRef', label: 'Payment Ref', visible: false, order: 11 },
      { key: 'transactionStatus', label: 'Transaction Status', visible: false, order: 12 },
      { key: 'assignedToBatch', label: 'Batch Status', visible: false, order: 13 },
      { key: 'createdAt', label: 'Created At', visible: false, order: 14 },
      { key: 'updatedAt', label: 'Updated At', visible: false, order: 15 },
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
   * Apply sorting to filtered transactions
   */
  const applySorting = (transactionList: Transaction[]): Transaction[] => {
    if (sortConfig.length === 0) return transactionList;

    return [...transactionList].sort((a, b) => {
      for (const { column, direction } of sortConfig) {
        let compareResult = 0;

        switch (column) {
          case 'id':
            compareResult = a.id.localeCompare(b.id);
            break;
          case 'cattle':
            compareResult = a.cattleName.localeCompare(b.cattleName);
            break;
          case 'worker':
            compareResult = a.workerName.localeCompare(b.workerName);
            break;
          case 'digestor':
            compareResult = a.digestorName.localeCompare(b.digestorName);
            break;
          case 'weight':
            compareResult = a.weight - b.weight;
            break;
          case 'quality':
            compareResult = a.quality - b.quality;
            break;
          case 'amount':
            compareResult = a.amount - b.amount;
            break;
          case 'status':
            compareResult = a.status.localeCompare(b.status);
            break;
          case 'datetime':
            compareResult = a.timestamp - b.timestamp;
            break;
          case 'ratePerKg':
            compareResult = (a.ratePerKg || 0) - (b.ratePerKg || 0);
            break;
          case 'paymentTimestamp':
            const paymentTimeA = a.paymentTimestamp ? new Date(a.paymentTimestamp).getTime() : 0;
            const paymentTimeB = b.paymentTimestamp ? new Date(b.paymentTimestamp).getTime() : 0;
            compareResult = paymentTimeA - paymentTimeB;
            break;
          case 'paymentRef':
            compareResult = (a.paymentRef || '').localeCompare(b.paymentRef || '');
            break;
          case 'transactionStatus':
            compareResult = a.transactionStatus.localeCompare(b.transactionStatus);
            break;
          case 'assignedToBatch':
            compareResult = (a.assignedToBatch ? 1 : 0) - (b.assignedToBatch ? 1 : 0);
            break;
          case 'createdAt':
            const createdA = new Date(a.createdAt).getTime();
            const createdB = new Date(b.createdAt).getTime();
            compareResult = createdA - createdB;
            break;
          case 'updatedAt':
            const updatedA = new Date(a.updatedAt).getTime();
            const updatedB = new Date(b.updatedAt).getTime();
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
   * Render cell content based on column type
   */
  const renderCellContent = (column: SortableColumn, transaction: Transaction) => {
    switch (column) {
      case 'id':
        return (
          <div>
            <div className="text-sm font-mono text-gray-900">{transaction.id}</div>
            <div className="text-xs text-gray-500">Session: {transaction.sessionId}</div>
          </div>
        );
      case 'cattle':
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{transaction.cattleName}</div>
            <div className="text-xs text-gray-500">ID: {transaction.cattleId}</div>
          </div>
        );
      case 'worker':
        return (
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">{transaction.workerName}</span>
          </div>
        );
      case 'digestor':
        return (
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-green-500 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-900">{transaction.digestorName}</div>
              <div className="text-xs text-gray-500">{transaction.digestorId}</div>
            </div>
          </div>
        );
      case 'weight':
        return <span className="text-sm text-gray-900">{transaction.weight} {t('kg')}</span>;
      case 'quality':
        return (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">{transaction.quality}/10</span>
            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityGradeColor(transaction.qualityGrade)}`}>
              {transaction.qualityGrade}
            </span>
          </div>
        );
      case 'amount':
        return <span className="text-sm font-semibold text-gray-900">₹{transaction.amount.toLocaleString('hi-IN')}</span>;
      case 'status':
        return (
          <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
            {getStatusIcon(transaction.status)}
            <span className="ml-1">{t(transaction.status)}</span>
          </div>
        );
      case 'datetime':
        return <span className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</span>;
      case 'ratePerKg':
        return <span className="text-sm text-gray-900">₹{transaction.ratePerKg}</span>;
      case 'paymentTimestamp':
        return <span className="text-sm text-gray-500">{transaction.paymentTimestamp ? formatDate(new Date(transaction.paymentTimestamp).getTime()) : 'N/A'}</span>;
      case 'paymentRef':
        return <span className="text-sm text-gray-900">{transaction.paymentRef || 'N/A'}</span>;
      case 'transactionStatus':
        return <span className="text-sm text-gray-900">{transaction.transactionStatus}</span>;
      case 'assignedToBatch':
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${transaction.assignedToBatch ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {transaction.assignedToBatch ? 'Yes' : 'No'}
          </span>
        );
      case 'createdAt':
        return <span className="text-sm text-gray-500">{formatDate(new Date(transaction.createdAt).getTime())}</span>;
      case 'updatedAt':
        return <span className="text-sm text-gray-500">{formatDate(new Date(transaction.updatedAt).getTime())}</span>;
      default:
        return null;
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN');
  };

  const handleExport = async () => {
    try {
      const response = await gauShalaApi.transactions.exportTransactions('csv', {
        dateFrom: filter.dateFrom,
        dateTo: filter.dateTo,
        status: filter.status,
        digestorId: filter.digestor,
        workerId: filter.worker
      });

      if (response.success && response.data) {
        // Open download URL in a new tab
        window.open(response.data.downloadUrl, '_blank');
      } else {
        console.error('Failed to export transactions:', response.error);
        alert('Failed to export data. Please try again.');
      }
    } catch (error) {
      console.error('Error exporting transactions:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleOpenPaymentUpdateModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewPaymentStatus(transaction.status === 'completed' ? 'COMPLETED' : 'PENDING');
    setNewPaymentMethod(transaction.paymentMethod || 'pending');
    setPaymentRef(transaction.paymentRef || '');
    setShowPaymentModal(true);
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedTransaction) return;

    try {
      setUpdatingPayment(true);

      const response = await biogasService.updateDungCollectionPaymentStatus(
        selectedTransaction.id,
        newPaymentStatus,
        newPaymentMethod !== 'pending' ? (newPaymentMethod as 'UPI' | 'CASH' | 'BANK_TRANSFER') : undefined,
        paymentRef || undefined
      );

      if (response.success) {
        // Reload transaction data from server to ensure accuracy
        const reloadResponse = await biogasService.listDungCollections(
          undefined,
          isGaushalaManager ? userGaushalaId : undefined,
          undefined,
          undefined,
          undefined,
          0,
          100
        );

        if (reloadResponse.success && reloadResponse.data) {
          const transformedTransactions = reloadResponse.data.content.map((collection: DungCollectionResponse) => ({
            id: collection.id,
            cattleId: collection.gaushalaId?.toString() || 'N/A',
            cattleName: `Gaushala ${collection.gaushalaId || 'Unknown'}`,
            workerId: 'unknown_worker',
            workerName: 'Collection Worker',
            digestorId: collection.clusterId || 'digestor_001',
            digestorName: `Cluster ${collection.clusterId || 'Unknown'}`,
            weight: collection.weightKg || 0,
            quality: collection.qualityGrade === 'A' ? 9 : collection.qualityGrade === 'B' ? 7 : collection.qualityGrade === 'C' ? 5 : 3,
            amount: collection.totalAmount || 0,
            timestamp: collection.collectionDate ? new Date(collection.collectionDate).getTime() : Date.now(),
            status: collection.paymentStatus === 'COMPLETED' ? 'completed' :
                    collection.paymentStatus === 'PROCESSING' ? 'processing' :
                    collection.paymentStatus === 'FAILED' ? 'failed' : 'pending_payment',
            location: {
              latitude: 0,
              longitude: 0,
              address: 'Location Not Available'
            },
            paymentMethod: collection.paymentMethod || 'Unknown',
            moisture: 0,
            rfidTag: collection.transactionRef || '',
            farmerName: 'Farmer Data Not Available',
            notes: collection.qualityNotes || '',
            qualityGrade: collection.qualityGrade || 'D',
            moistureContent: 0,
            organicMatter: 0,
            sessionId: collection.transactionRef || '',
            paymentTimestamp: collection.paymentTimestamp,
            paymentRef: collection.paymentRef,
            transactionStatus: collection.transactionStatus,
            assignedToBatch: collection.assignedToBatch,
            createdAt: collection.createdAt,
            updatedAt: collection.updatedAt,
            ratePerKg: collection.ratePerKg
          }));
          setTransactions(transformedTransactions);
        }

        setShowPaymentModal(false);
        alert(`Payment status updated to ${newPaymentStatus} successfully!`);
      } else {
        alert(`Failed to update payment status: ${response.error}`);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error updating payment status. Please try again.');
    } finally {
      setUpdatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          {t('exportData')}
        </button>
      </div>

      {/* Role Indicator Banner */}
      <div className={`rounded-lg p-4 ${
        isBiogasOperator
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className={`h-5 w-5 mr-2 ${
              isBiogasOperator ? 'text-blue-600' : 'text-green-600'
            }`} />
            <div>
              <p className={`font-semibold ${
                isBiogasOperator ? 'text-blue-900' : 'text-green-900'
              }`}>
                {isBiogasOperator ? 'Biogas Operator View' : 'Gaushala Manager View'}
              </p>
              <p className={`text-sm ${
                isBiogasOperator ? 'text-blue-700' : 'text-green-700'
              }`}>
                {isBiogasOperator
                  ? 'Viewing all transactions across all gaushalas'
                  : `Viewing transactions for your Gaushala (ID: ${userGaushalaId || 'Not assigned'})`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              isBiogasOperator ? 'text-blue-700' : 'text-green-700'
            }`}>
              {userName}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isBiogasOperator
                ? 'bg-blue-600 text-white'
                : 'bg-green-600 text-white'
            }`}>
              {userRole}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t('totalTransactions')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTransactions}</p>
              <p className="text-sm text-blue-600 mt-2">{t('todayTransactions')}: {stats.todayTransactions}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t('totalWeight')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalWeight.toFixed(1)} {t('kg')}</p>
              <p className="text-sm text-green-600 mt-2">↗ +8% from last period</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Scale className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t('totalAmount')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">₹{stats.totalAmount.toLocaleString('hi-IN')}</p>
              <p className="text-sm text-red-600 mt-2">{t('pendingPayments')}: {stats.pendingPayments}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t('avgQuality')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.averageQuality.toFixed(1)}/10</p>
              <div className="text-sm text-gray-600 mt-2">
                <p>{t('topDigestor')}: {stats.topDigestor}</p>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date Range */}
          <select
            value={filter.dateRange}
            onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">{t('today')}</option>
            <option value="week">{t('week')}</option>
            <option value="month">{t('month')}</option>
            <option value="all">{t('all')}</option>
          </select>

          {/* Status Filter */}
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('allStatus')}</option>
            <option value="completed">{t('completed')}</option>
            <option value="processing">{t('processing')}</option>
            <option value="failed">{t('failed')}</option>
            <option value="pending_payment">{t('pendingPayment')}</option>
          </select>

          {/* Digestor Filter */}
          <select
            value={filter.digestor}
            onChange={(e) => setFilter(prev => ({ ...prev, digestor: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('allDigestors')}</option>
            <option value="DIG001">डाइजेस्टर Unit-A</option>
            <option value="DIG002">डाइजेस्टर Unit-B</option>
            <option value="DIG003">डाइजेस्टर Unit-C</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={filter.paymentMethod}
            onChange={(e) => setFilter(prev => ({ ...prev, paymentMethod: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('allPaymentMethods')}</option>
            <option value="cash">{t('cash')}</option>
            <option value="upi">{t('upi')}</option>
            <option value="bank">{t('bank')}</option>
            <option value="pending">{t('pending')}</option>
          </select>
        </div>

        {/* Column Selector Button */}
        <div className="mt-4 flex justify-end">
          <div className="relative column-selector-container">
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Columns className="h-4 w-4" />
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
                  <p className="text-xs text-gray-500 mt-1">
                    Toggle columns, drag to reorder. Click: sort asc/desc/clear. Shift+Click: multi-sort.
                  </p>
                </div>

                <div className="p-2 max-h-96 overflow-y-auto">
                  {columns
                    .sort((a, b) => a.order - b.order)
                    .map((column, index) => (
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
                        <div className="flex items-center gap-2 flex-1">
                          {column.visible ? (
                            <EyeIcon className="h-4 w-4 text-blue-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">{column.label}</span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
                      </label>
                    ))}
                </div>

                <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {getVisibleColumns().length} of {columns.length} columns visible
                  </span>
                  <button
                    onClick={resetColumns}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {getVisibleColumns().map((column) => (
                  <th
                    key={column.key}
                    draggable
                    onDragStart={() => handleDragStart(column.key)}
                    onDragOver={(e) => handleDragOver(e, column.key)}
                    onDrop={() => handleDrop(column.key)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => handleSort(column.key, e.shiftKey)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none transition-all ${
                      draggedColumn === column.key ? 'opacity-50' : ''
                    } ${
                      dragOverColumn === column.key ? 'border-l-4 border-blue-500' : ''
                    } hover:bg-gray-100`}
                    title={`Click to sort by ${column.label}. Shift+Click for multi-column sort. Drag to reorder.`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">⋮⋮</span>
                      <span>{column.label}</span>
                      {getSortIndicator(column.key)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applySorting(filteredTransactions).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  {getVisibleColumns().map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {renderCellContent(column.key, transaction)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title={t('view')}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenPaymentUpdateModal(transaction)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Update Payment Status"
                      >
                        <DollarSign className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('noTransactions')}</p>
            <p className="text-gray-400 text-sm mt-2">{t('changeFilters')}</p>
          </div>
        )}
      </div>

      {/* Payment Status Update Modal */}
      {showPaymentModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Update Payment Status</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Transaction Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Transaction ID</p>
                <p className="text-lg font-semibold text-gray-900">{selectedTransaction.id}</p>
                <p className="text-sm text-gray-500 mt-2">Amount: ₹{selectedTransaction.amount.toLocaleString('hi-IN')}</p>
              </div>

              {/* Current Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Payment Status</label>
                <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedTransaction.status)}`}>
                  {t(selectedTransaction.status)}
                </div>
              </div>

              {/* New Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Payment Status</label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                  <option value="QUEUED">Queued</option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="UPI">UPI</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              {/* Payment Reference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Reference (Optional)</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g., UPI Transaction ID, Check Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  ℹ️ Changing the payment status will update the transaction record. If you mark as COMPLETED, the payment timestamp will be set to now.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePaymentStatus}
                disabled={updatingPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updatingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4" />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">{t('transactionDetails')} - {selectedTransaction.id}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">{t('basicInfo')}</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('transactionId')}:</span>
                    <span className="font-mono font-medium">{selectedTransaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('sessionId')}:</span>
                    <span className="font-medium">{selectedTransaction.sessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('cattle')}:</span>
                    <span className="font-medium">{selectedTransaction.cattleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('worker')}:</span>
                    <span className="font-medium">{selectedTransaction.workerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('digestor')}:</span>
                    <span className="font-medium">{selectedTransaction.digestorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('weight')}:</span>
                    <span className="font-medium">{selectedTransaction.weight} {t('kg')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('amount')}:</span>
                    <span className="font-medium">₹{selectedTransaction.amount.toLocaleString('hi-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('status')}:</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTransaction.status)}`}>
                      {t(selectedTransaction.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quality Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">{t('qualityInfo')}</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('quality')}:</span>
                    <span className="font-medium">{selectedTransaction.quality}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getQualityGradeColor(selectedTransaction.qualityGrade)}`}>
                      {selectedTransaction.qualityGrade}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('moisture')}:</span>
                    <span className="font-medium">{selectedTransaction.moistureContent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('organicMatter')}:</span>
                    <span className="font-medium">{selectedTransaction.organicMatter}%</span>
                  </div>
                  {selectedTransaction.collectionNotes && (
                    <div>
                      <p className="text-gray-600 mb-2">{t('collectionNotes')}:</p>
                      <p className="text-sm bg-white p-3 rounded border">{selectedTransaction.collectionNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">{t('paymentInfo')}</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('paymentMethod')}:</span>
                    <span className="font-medium">{selectedTransaction.paymentMethod ? t(selectedTransaction.paymentMethod) : t('pending')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('datetime')}:</span>
                    <span className="font-medium">{formatDate(selectedTransaction.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">{t('locationInfo')}</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-medium">{selectedTransaction.location.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-medium">{selectedTransaction.location.longitude.toFixed(6)}</span>
                  </div>
                  {selectedTransaction.location.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('location')}:</span>
                      <span className="font-medium text-right">{selectedTransaction.location.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}