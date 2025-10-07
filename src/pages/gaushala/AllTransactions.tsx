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
  Users
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

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  useEffect(() => {
    loadAllContributions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contributions, searchTerm, paymentFilter, qualityFilter, workerFilter]);

  // Pagination calculation
  const totalEntries = filteredContributions.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentData = filteredContributions.slice(startIndex, endIndex);

  const loadAllContributions = async () => {
    try {
      setLoading(true);

      // Fetch dung collections from biogas service
      const response = await biogasService.listDungCollections(
        undefined, // clusterId - fetch all
        undefined, // paymentStatus - fetch all
        undefined, // startDate
        undefined, // endDate
        0, // page
        1000 // size - fetch a large batch
      );

      if (!response.success || !response.data) {
        console.error('Failed to fetch dung collections:', response.error);
        setContributions([]);
        return;
      }

      // Transform DungCollectionResponse to Contribution format
      const transformedContributions = response.data.content.map((collection: DungCollectionResponse): Contribution => ({
        id: collection.id,
        externalId: collection.transactionRef || collection.id,
        contributionDate: collection.collectionDate,
        weightKg: collection.weightKg,
        ratePerKg: collection.ratePerKg,
        totalAmount: collection.totalAmount,
        paymentMethod: collection.paymentMethod as 'UPI' | 'CASH' | 'NEFT' | 'AEPS',
        paymentStatus: collection.paymentStatus,
        qualityGrade: collection.qualityGrade === 'A' ? 'PREMIUM' : collection.qualityGrade === 'B' ? 'STANDARD' : 'BASIC',
        moistureContent: 0, // Not available in DungCollectionResponse
        gpsLatitude: 0,
        gpsLongitude: 0,
        workflowStatus: collection.transactionStatus,
        validationStatus: collection.assignedToBatch ? 'ASSIGNED' : 'PENDING',
        notes: collection.qualityNotes,
        operatorUserId: undefined,
        operatorName: 'Collection Worker',
        operatorPhone: undefined,
        farmer: {
          name: `Gaushala ${collection.gaushalaId || 'Unknown'}`,
          externalId: collection.gaushalaId?.toString() || 'unknown',
          phone: undefined
        }
      }));

      setContributions(transformedContributions);
    } catch (error) {
      console.error('Error loading contributions:', error);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 mt-1">{t('subtitle')}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <BarChart3 className="h-10 w-10 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('totalTransactions')}</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalTransactions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <Scale className="h-10 w-10 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('totalWeight')}</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalWeight} {t('kg')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <Coins className="h-10 w-10 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('totalValue')}</p>
                <p className="text-2xl font-bold text-gray-900">₹{summary.totalValue}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('activeWorkers')}</p>
                <p className="text-2xl font-bold text-gray-900">{summary.activeWorkers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={workerFilter}
              onChange={(e) => setWorkerFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('allWorkers')}</option>
              {uniqueWorkers.map((worker) => (
                <option key={worker.id} value={worker.id}>{worker.name}</option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('allPayments')}</option>
              <option value="UPI">UPI</option>
              <option value="CASH">Cash</option>
              <option value="NEFT">NEFT</option>
              <option value="AEPS">AEPS</option>
            </select>
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('allQualities')}</option>
              <option value="PREMIUM">{t('premium')}</option>
              <option value="STANDARD">{t('standard')}</option>
              <option value="BASIC">{t('basic')}</option>
            </select>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              {t('exportData')}
            </button>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>
        </div>


        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionId')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('farmer')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('fieldWorker')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('weight')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quality')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentMethod')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((contribution) => (
                  <tr key={contribution.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(contribution.contributionDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {contribution.externalId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{contribution.farmer?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{contribution.farmer?.externalId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium">{contribution.operatorName || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{contribution.operatorPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contribution.weightKg} {t('kg')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityColor(contribution.qualityGrade)}`}>
                        {t(contribution.qualityGrade.toLowerCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ₹{contribution.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contribution.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(contribution.paymentStatus)}`}>
                        {t(contribution.paymentStatus.toLowerCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(contribution)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
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

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
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
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>


          {filteredContributions.length === 0 && (
            <div className="text-center py-12">
              <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t('noTransactions')}</p>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedContribution && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Transaction Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="text-lg font-mono">{selectedContribution.externalId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-lg">{formatDate(selectedContribution.contributionDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Farmer</label>
                    <p className="text-lg">{selectedContribution.farmer?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedContribution.farmer?.externalId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Field Worker</label>
                    <p className="text-lg">{selectedContribution.operatorName || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedContribution.operatorPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Weight</label>
                    <p className="text-lg">{selectedContribution.weightKg} kg</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rate per kg</label>
                    <p className="text-lg">₹{selectedContribution.ratePerKg}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-lg font-semibold text-green-600">₹{selectedContribution.totalAmount}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Method</label>
                    <p className="text-lg">{selectedContribution.paymentMethod}</p>
                  </div>
                  {selectedContribution.moistureContent && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Moisture Content</label>
                      <p className="text-lg">{selectedContribution.moistureContent}%</p>
                    </div>
                  )}
                  {selectedContribution.gpsLatitude && selectedContribution.gpsLongitude && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-lg">{selectedContribution.gpsLatitude}, {selectedContribution.gpsLongitude}</p>
                    </div>
                  )}
                </div>
                {selectedContribution.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-lg">{selectedContribution.notes}</p>
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