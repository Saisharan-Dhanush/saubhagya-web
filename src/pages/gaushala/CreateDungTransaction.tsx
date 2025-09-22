/**
 * Create Dung Transaction Page
 * Allows field workers to record new cow dung collection transactions
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Camera,
  MapPin,
  Calendar,
  Weight,
  DollarSign,
  User,
  Scan,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { gauShalaApi } from '../../services/gaushala/api';
import { BiogasServiceClient } from '../../services/microservices';

interface LanguageContextType {
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  t: (key: string) => string;
}

interface Cattle {
  id: string;
  name: string;
  rfidTag: string;
  breed: string;
  owner: string;
  ownerId: string;
}

interface TransactionFormData {
  cattleId: string;
  cattleName: string;
  rfidTag: string;
  farmerName: string;
  farmerId: string;
  weightKg: string;
  qualityGrade: 'PREMIUM' | 'STANDARD' | 'BASIC';
  ratePerKg: string;
  totalAmount: string;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  moistureContent: string;
  location: {
    latitude: string;
    longitude: string;
    address: string;
  };
  notes: string;
  operatorName: string;
  operatorUserId: string;
}

const translations = {
  en: {
    title: 'Create Dung Transaction',
    subtitle: 'Record new cow dung collection transaction',
    backToCattle: 'Back to Cattle Management',
    cattleSelection: 'Cattle Selection',
    selectCattle: 'Select Cattle',
    searchCattle: 'Search by name or RFID...',
    rfidScan: 'Scan RFID',
    transactionDetails: 'Transaction Details',
    weight: 'Weight (kg)',
    qualityGrade: 'Quality Grade',
    premium: 'Premium',
    standard: 'Standard',
    basic: 'Basic',
    ratePerKg: 'Rate per kg (₹)',
    totalAmount: 'Total Amount (₹)',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    upi: 'UPI',
    bankTransfer: 'Bank Transfer',
    moistureContent: 'Moisture Content (%)',
    location: 'Location Details',
    getCurrentLocation: 'Get Current Location',
    latitude: 'Latitude',
    longitude: 'Longitude',
    address: 'Address',
    additionalInfo: 'Additional Information',
    notes: 'Notes',
    operatorInfo: 'Operator Information',
    operatorName: 'Operator Name',
    operatorId: 'Operator ID',
    createTransaction: 'Create Transaction',
    cancel: 'Cancel',
    required: 'Required',
    cattleInfo: 'Cattle Information',
    farmerInfo: 'Farmer Information',
    farmerName: 'Farmer Name',
    farmerId: 'Farmer ID',
    success: 'Transaction created successfully!',
    error: 'Failed to create transaction. Please try again.',
    calculating: 'Calculating...',
    getting: 'Getting location...'
  },
  hi: {
    title: 'गोबर लेन-देन बनाएं',
    subtitle: 'नया गाय गोबर संग्रह लेन-देन रिकॉर्ड करें',
    backToCattle: 'पशु प्रबंधन पर वापस जाएं',
    cattleSelection: 'पशु चयन',
    selectCattle: 'पशु चुनें',
    searchCattle: 'नाम या RFID से खोजें...',
    rfidScan: 'RFID स्कैन करें',
    transactionDetails: 'लेन-देन विवरण',
    weight: 'वजन (किलो)',
    qualityGrade: 'गुणवत्ता ग्रेड',
    premium: 'प्रीमियम',
    standard: 'मानक',
    basic: 'बेसिक',
    ratePerKg: 'प्रति किलो दर (₹)',
    totalAmount: 'कुल राशि (₹)',
    paymentMethod: 'भुगतान विधि',
    cash: 'नकद',
    upi: 'UPI',
    bankTransfer: 'बैंक ट्रांसफर',
    moistureContent: 'नमी सामग्री (%)',
    location: 'स्थान विवरण',
    getCurrentLocation: 'वर्तमान स्थान प्राप्त करें',
    latitude: 'अक्षांश',
    longitude: 'देशांतर',
    address: 'पता',
    additionalInfo: 'अतिरिक्त जानकारी',
    notes: 'टिप्पणियां',
    operatorInfo: 'ऑपरेटर जानकारी',
    operatorName: 'ऑपरेटर नाम',
    operatorId: 'ऑपरेटर ID',
    createTransaction: 'लेन-देन बनाएं',
    cancel: 'रद्द करें',
    required: 'आवश्यक',
    cattleInfo: 'पशु जानकारी',
    farmerInfo: 'किसान जानकारी',
    farmerName: 'किसान का नाम',
    farmerId: 'किसान ID',
    success: 'लेन-देन सफलतापूर्वक बनाया गया!',
    error: 'लेन-देन बनाने में विफल। कृपया पुनः प्रयास करें।',
    calculating: 'गणना कर रहे हैं...',
    getting: 'स्थान प्राप्त कर रहे हैं...'
  }
};

interface Props {
  languageContext: LanguageContextType;
}

export default function CreateDungTransaction({ languageContext }: Props) {
  const { language } = languageContext;
  const navigate = useNavigate();

  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [filteredCattle, setFilteredCattle] = useState<Cattle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<TransactionFormData>({
    cattleId: '',
    cattleName: '',
    rfidTag: '',
    farmerName: '',
    farmerId: '',
    weightKg: '',
    qualityGrade: 'STANDARD',
    ratePerKg: '12.00',
    totalAmount: '',
    paymentMethod: 'UPI',
    moistureContent: '65',
    location: {
      latitude: '',
      longitude: '',
      address: ''
    },
    notes: '',
    operatorName: 'Ravi Sharma',
    operatorUserId: 'field_worker_001'
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Quality grade rates
  const qualityRates = {
    PREMIUM: 15.00,
    STANDARD: 12.00,
    BASIC: 8.00
  };

  useEffect(() => {
    loadCattleData();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    // Filter cattle based on search term
    if (searchTerm) {
      const filtered = cattle.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rfidTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCattle(filtered);
    } else {
      setFilteredCattle(cattle.slice(0, 10)); // Show first 10 cattle
    }
  }, [searchTerm, cattle]);

  useEffect(() => {
    // Calculate total amount when weight or rate changes
    const weight = parseFloat(formData.weightKg);
    const rate = parseFloat(formData.ratePerKg);
    if (!isNaN(weight) && !isNaN(rate)) {
      const total = (weight * rate).toFixed(2);
      setFormData(prev => ({ ...prev, totalAmount: total }));
    }
  }, [formData.weightKg, formData.ratePerKg]);

  useEffect(() => {
    // Update rate when quality grade changes
    const newRate = qualityRates[formData.qualityGrade];
    setFormData(prev => ({ ...prev, ratePerKg: newRate.toFixed(2) }));
  }, [formData.qualityGrade]);

  const loadCattleData = async () => {
    try {
      const response = await gauShalaApi.cattle.getAllCattle();
      if (response.success && response.data) {
        setCattle(response.data);
        setFilteredCattle(response.data.slice(0, 10));
      }
    } catch (error) {
      console.error('Error loading cattle data:', error);
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: latitude.toFixed(6),
              longitude: longitude.toFixed(6),
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            }
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Set default location (Delhi area)
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: '28.6139',
              longitude: '77.2090',
              address: 'Default Location, Delhi'
            }
          }));
          setIsGettingLocation(false);
        }
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleCattleSelect = (cattle: Cattle) => {
    setSelectedCattle(cattle);
    setFormData(prev => ({
      ...prev,
      cattleId: cattle.id,
      cattleName: cattle.name,
      rfidTag: cattle.rfidTag,
      farmerName: cattle.owner,
      farmerId: cattle.ownerId
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCattle || !formData.weightKg) {
      alert('Please select cattle and enter weight');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare transaction data for the biogas service
      // Use external ID as user ID so respective user will see their transactions only
      const currentUserExternalId = 'gaushala_user'; // This should be the logged-in user's external ID

      const transactionData = {
        cattleId: formData.cattleId,
        cattleName: formData.cattleName,
        rfidTag: formData.rfidTag,
        farmerId: currentUserExternalId, // Use external ID for user-specific transactions
        farmerName: formData.farmerName,
        contributionDate: new Date().toISOString(),
        weightKg: parseFloat(formData.weightKg),
        ratePerKg: parseFloat(formData.ratePerKg),
        totalAmount: parseFloat(formData.totalAmount),
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'COMPLETED',
        qualityGrade: formData.qualityGrade,
        moistureContent: parseFloat(formData.moistureContent),
        gpsLatitude: parseFloat(formData.location.latitude),
        gpsLongitude: parseFloat(formData.location.longitude),
        operatorUserId: currentUserExternalId, // Use external ID for operator as well
        operatorName: formData.operatorName,
        operatorPhone: '+919876543210',
        workflowStatus: 'CONTRIBUTION_RECORDED',
        validationStatus: 'VALIDATED',
        remarks: formData.notes
      };

      // Submit to biogas service
      const result = await BiogasServiceClient.recordContribution(transactionData);

      if (result.success || result.id) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/gaushala/transactions');
        }, 2000);
      } else {
        throw new Error('Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">{t('success')}</h2>
          <p className="text-gray-600">Redirecting to transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/gaushala/cattle')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToCattle')}
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cattle Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('cattleSelection')}
          </h2>

          {/* Search */}
          <div className="mb-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={t('searchCattle')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Scan className="h-4 w-4" />
                {t('rfidScan')}
              </button>
            </div>
          </div>

          {/* Cattle List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {filteredCattle.map((cattle) => (
              <div
                key={cattle.id}
                onClick={() => handleCattleSelect(cattle)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedCattle?.id === cattle.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{cattle.name}</div>
                <div className="text-sm text-gray-600">RFID: {cattle.rfidTag}</div>
                <div className="text-sm text-gray-600">Owner: {cattle.owner}</div>
              </div>
            ))}
          </div>

          {/* Selected Cattle Info */}
          {selectedCattle && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">{t('cattleInfo')}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Name:</span> {selectedCattle.name}
                </div>
                <div>
                  <span className="text-blue-700">RFID:</span> {selectedCattle.rfidTag}
                </div>
                <div>
                  <span className="text-blue-700">Breed:</span> {selectedCattle.breed}
                </div>
                <div>
                  <span className="text-blue-700">Owner:</span> {selectedCattle.owner}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Weight className="h-5 w-5" />
            {t('transactionDetails')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('weight')} *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weightKg}
                onChange={(e) => handleInputChange('weightKg', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('qualityGrade')}
              </label>
              <select
                value={formData.qualityGrade}
                onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="PREMIUM">{t('premium')} (₹15/kg)</option>
                <option value="STANDARD">{t('standard')} (₹12/kg)</option>
                <option value="BASIC">{t('basic')} (₹8/kg)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('ratePerKg')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.ratePerKg}
                onChange={(e) => handleInputChange('ratePerKg', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('totalAmount')}
              </label>
              <input
                type="text"
                value={formData.totalAmount}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('paymentMethod')}
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="UPI">{t('upi')}</option>
                <option value="CASH">{t('cash')}</option>
                <option value="BANK_TRANSFER">{t('bankTransfer')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('moistureContent')}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.moistureContent}
                onChange={(e) => handleInputChange('moistureContent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('location')}
            </h2>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isGettingLocation ? t('getting') : t('getCurrentLocation')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('latitude')}
              </label>
              <input
                type="text"
                value={formData.location.latitude}
                onChange={(e) => handleInputChange('location.latitude', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('longitude')}
              </label>
              <input
                type="text"
                value={formData.location.longitude}
                onChange={(e) => handleInputChange('location.longitude', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('address')}
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('additionalInfo')}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('notes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes about the transaction..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('operatorName')}
                </label>
                <input
                  type="text"
                  value={formData.operatorName}
                  onChange={(e) => handleInputChange('operatorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('operatorId')}
                </label>
                <input
                  type="text"
                  value={formData.operatorUserId}
                  onChange={(e) => handleInputChange('operatorUserId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/gaushala/cattle')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedCattle || !formData.weightKg}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting ? 'Creating...' : t('createTransaction')}
          </button>
        </div>
      </form>
    </div>
  );
}