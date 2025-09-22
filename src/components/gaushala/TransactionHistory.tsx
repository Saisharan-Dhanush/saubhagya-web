/**
 * Transaction History Component
 * Shows farmer contribution history with payment details and analytics
 */

import { useState, useEffect } from 'react';
import {
  Calendar,
  Scale,
  CreditCard,
  MapPin,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Download,
  Filter,
  Search,
  Coins,
  BarChart3
} from 'lucide-react';
import { BiogasServiceClient } from '../../services/microservices';

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
  farmerId: string;
  farmerName: string;
  onClose: () => void;
}

const translations = {
  en: {
    title: 'Transaction History',
    subtitle: 'Complete contribution and payment history',
    summary: 'Summary',
    totalContributions: 'Total Contributions',
    totalWeight: 'Total Weight',
    totalValue: 'Total Value',
    avgQuality: 'Average Quality',
    searchPlaceholder: 'Search by transaction ID or notes...',
    filterByPayment: 'Filter by Payment',
    filterByQuality: 'Filter by Quality',
    allPayments: 'All Payments',
    allQualities: 'All Qualities',
    date: 'Date',
    transactionId: 'Transaction ID',
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
  },
  hi: {
    title: 'लेनदेन इतिहास',
    subtitle: 'पूर्ण योगदान और भुगतान इतिहास',
    summary: 'सारांश',
    totalContributions: 'कुल योगदान',
    totalWeight: 'कुल वजन',
    totalValue: 'कुल मूल्य',
    avgQuality: 'औसत गुणवत्ता',
    searchPlaceholder: 'लेनदेन ID या नोट्स से खोजें...',
    filterByPayment: 'भुगतान के अनुसार फ़िल्टर करें',
    filterByQuality: 'गुणवत्ता के अनुसार फ़िल्टर करें',
    allPayments: 'सभी भुगतान',
    allQualities: 'सभी गुणवत्ता',
    date: 'दिनांक',
    transactionId: 'लेनदेन ID',
    weight: 'वजन (किलो)',
    quality: 'गुणवत्ता',
    amount: 'राशि (₹)',
    paymentMethod: 'भुगतान',
    status: 'स्थिति',
    actions: 'कार्य',
    view: 'विवरण देखें',
    premium: 'प्रीमियम',
    standard: 'मानक',
    basic: 'बेसिक',
    pending: 'लंबित',
    processing: 'प्रसंस्करण',
    completed: 'पूर्ण',
    failed: 'असफल',
    exportData: 'डेटा निर्यात करें',
    noTransactions: 'कोई लेनदेन नहीं मिला',
    kg: 'किलो',
    close: 'बंद करें',
    viewDetails: 'विवरण देखें',
    location: 'स्थान',
    moistureContent: 'नमी की मात्रा',
    notes: 'टिप्पणी',
    workflowStatus: 'वर्कफ़्लो स्थिति',
    validationStatus: 'सत्यापन स्थिति'
  }
};

export default function TransactionHistory({ farmerId, farmerName, onClose }: Props) {
  const [language] = useState<'en' | 'hi'>('en');
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  useEffect(() => {
    loadContributions();
  }, [farmerId]);

  useEffect(() => {
    applyFilters();
  }, [contributions, searchTerm, paymentFilter, qualityFilter]);

  const loadContributions = async () => {
    try {
      setLoading(true);
      const response = await BiogasServiceClient.getFarmerContributions(farmerId, 0, 100);

      if (response && Array.isArray(response)) {
        setContributions(response);
      } else {
        console.error('Invalid response format:', response);
        setContributions([]);
      }
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

    setFilteredContributions(filtered);
  };

  const calculateSummary = () => {
    const totalContributions = contributions.length;
    const totalWeight = contributions.reduce((sum, c) => sum + c.weightKg, 0);
    const totalValue = contributions.reduce((sum, c) => sum + c.totalAmount, 0);
    const qualityDistribution = contributions.reduce((acc, c) => {
      acc[c.qualityGrade] = (acc[c.qualityGrade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Handle empty contributions array
    const qualityKeys = Object.keys(qualityDistribution);
    const avgQuality = qualityKeys.length > 0
      ? qualityKeys.reduce((a, b) => qualityDistribution[a] > qualityDistribution[b] ? a : b)
      : 'STANDARD'; // Default quality when no data

    return {
      totalContributions,
      totalWeight: totalWeight.toFixed(1),
      totalValue: totalValue.toFixed(2),
      avgQuality
    };
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN');
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
    a.download = `farmer-${farmerId}-contributions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const summary = calculateSummary();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-green-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{t('title')}</h3>
            <p className="text-gray-600">{t('subtitle')}</p>
            <p className="text-sm text-blue-600 mt-1">Farmer: {farmerName} (ID: {farmerId})</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">{t('totalContributions')}</p>
                  <p className="text-2xl font-bold text-blue-900">{summary.totalContributions}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <Scale className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">{t('totalWeight')}</p>
                  <p className="text-2xl font-bold text-green-900">{summary.totalWeight} {t('kg')}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <Coins className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600">{t('totalValue')}</p>
                  <p className="text-2xl font-bold text-yellow-900">₹{summary.totalValue}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">{t('avgQuality')}</p>
                  <p className="text-2xl font-bold text-purple-900">{t(summary.avgQuality.toLowerCase())}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              {t('exportData')}
            </button>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionId')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('weight')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quality')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentMethod')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContributions.map((contribution) => (
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

            {filteredContributions.length === 0 && (
              <div className="text-center py-12">
                <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t('noTransactions')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedContribution && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Transaction Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="text-lg font-mono">{selectedContribution.externalId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-lg">{formatDate(selectedContribution.contributionDate)}</p>
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