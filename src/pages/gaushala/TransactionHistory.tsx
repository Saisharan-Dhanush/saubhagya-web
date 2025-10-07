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
  BarChart3
} from 'lucide-react';
import { biogasService, type DungCollectionResponse } from '../../services/biogasService';

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

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN001',
      cattleId: 'C001',
      cattleName: 'गौ माता 1',
      workerId: 'W001',
      workerName: 'राम कुमार',
      digestorId: 'DIG001',
      digestorName: 'डाइजेस्टर Unit-A',
      weight: 8.5,
      quality: 9.2,
      amount: 127.5,
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      status: 'completed',
      location: {
        latitude: 23.7126,
        longitude: 76.6566,
        address: 'ग्राम पटेल नगर, भोपाल'
      },
      collectionNotes: 'उत्कृष्ट गुणवत्ता का गोबर, अच्छी नमी',
      paymentMethod: 'upi',
      qualityGrade: 'A',
      moistureContent: 65,
      organicMatter: 85,
      sessionId: 'SES001'
    },
    {
      id: 'TXN002',
      cattleId: 'C002',
      cattleName: 'कामधेनु 2',
      workerId: 'W002',
      workerName: 'श्याम वर्मा',
      digestorId: 'DIG002',
      digestorName: 'डाइजेस्टर Unit-B',
      weight: 12.3,
      quality: 8.8,
      amount: 172.2,
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      status: 'processing',
      location: {
        latitude: 23.7130,
        longitude: 76.6570,
        address: 'ग्राम शिवपुरी, भोपाल'
      },
      collectionNotes: 'अच्छी गुणवत्ता, मानक नमी स्तर',
      paymentMethod: 'pending',
      qualityGrade: 'B',
      moistureContent: 62,
      organicMatter: 82,
      sessionId: 'SES002'
    },
    {
      id: 'TXN003',
      cattleId: 'C003',
      cattleName: 'लक्ष्मी 3',
      workerId: 'W003',
      workerName: 'गीता देवी',
      digestorId: 'DIG001',
      digestorName: 'डाइजेस्टर Unit-A',
      weight: 6.7,
      quality: 7.5,
      amount: 93.8,
      timestamp: Date.now() - 6 * 60 * 60 * 1000,
      status: 'completed',
      location: {
        latitude: 23.7134,
        longitude: 76.6574,
        address: 'ग्राम बरखेड़ी, भोपाल'
      },
      collectionNotes: 'औसत गुणवत्ता, कुछ अशुद्धियाँ',
      paymentMethod: 'cash',
      qualityGrade: 'C',
      moistureContent: 58,
      organicMatter: 78,
      sessionId: 'SES003'
    },
    {
      id: 'TXN004',
      cattleId: 'C001',
      cattleName: 'गौ माता 1',
      workerId: 'W001',
      workerName: 'राम कुमार',
      digestorId: 'DIG003',
      digestorName: 'डाइजेस्टर Unit-C',
      weight: 15.2,
      quality: 9.5,
      amount: 228,
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      status: 'completed',
      location: {
        latitude: 23.7128,
        longitude: 76.6568,
        address: 'ग्राम पटेल नगर, भोपाल'
      },
      collectionNotes: 'प्रीमियम गुणवत्ता, उत्कृष्ट जैविक सामग्री',
      paymentMethod: 'bank',
      qualityGrade: 'A',
      moistureContent: 68,
      organicMatter: 88,
      sessionId: 'SES004'
    },
    {
      id: 'TXN005',
      cattleId: 'C002',
      cattleName: 'कामधेनु 2',
      workerId: 'W002',
      workerName: 'श्याम वर्मा',
      digestorId: 'DIG002',
      digestorName: 'डाइजेस्टर Unit-B',
      weight: 9.8,
      quality: 8.2,
      amount: 137.2,
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      status: 'failed',
      location: {
        latitude: 23.7132,
        longitude: 76.6572,
        address: 'ग्राम शिवपुरी, भोपाल'
      },
      collectionNotes: 'गुणवत्ता मुद्दे, फिर से संग्रह आवश्यक',
      paymentMethod: 'pending',
      qualityGrade: 'D',
      moistureContent: 45,
      organicMatter: 65,
      sessionId: 'SES005'
    }
  ];

  useEffect(() => {
    loadTransactionData();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [transactions, filter]);

  const loadTransactionData = async () => {
    try {
      setLoading(true);

      // Fetch transaction data from biogas service - using dung collections API
      const response = await biogasService.listDungCollections(
        undefined, // clusterId - fetch all for now
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
        digestorName: `Cluster ${collection.clusterId?.substring(0, 8) || 'Unknown'}`,
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
        sessionId: collection.transactionRef || ''
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
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionId')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cattle')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('worker')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('digestor')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('weight')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quality')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('datetime')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{transaction.id}</div>
                    <div className="text-xs text-gray-500">Session: {transaction.sessionId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.cattleName}</div>
                    <div className="text-xs text-gray-500">ID: {transaction.cattleId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{transaction.workerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-green-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.digestorName}</div>
                        <div className="text-xs text-gray-500">{transaction.digestorId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.weight} {t('kg')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{transaction.quality}/10</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityGradeColor(transaction.qualityGrade)}`}>
                        {transaction.qualityGrade}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{transaction.amount.toLocaleString('hi-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{t(transaction.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title={t('view')}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
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