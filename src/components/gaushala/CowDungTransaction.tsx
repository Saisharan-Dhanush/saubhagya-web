/**
 * Cow Dung Transaction Recording Component
 * Integrates with biogas service for contribution tracking
 */

import { useState, useEffect } from 'react';
import {
  Scale,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  Save,
  X,
  Star,
  TrendingUp,
  Coins
} from 'lucide-react';
import { BiogasServiceClient } from '../../services/microservices';

interface TransactionFormData {
  cattleId: string;
  farmerId: string;
  farmerName: string;
  weightKg: string;
  ratePerKg: string;
  totalAmount: string;
  paymentMethod: 'UPI' | 'CASH' | 'NEFT' | 'AEPS';
  qualityGrade: 'PREMIUM' | 'STANDARD' | 'BASIC';
  moistureContent: string;
  gpsLatitude: string;
  gpsLongitude: string;
  deviceReadingId?: string;
  notes?: string;
}

interface Cattle {
  id: string;
  name: string;
  rfidTag: string;
  owner: string;
  ownerId: string;
}

interface Props {
  cattle?: Cattle;
  onClose: () => void;
  onSuccess: (transaction: any) => void;
}

const qualityRates = {
  PREMIUM: 15.0,  // ₹15 per kg for premium quality
  STANDARD: 12.0, // ₹12 per kg for standard quality
  BASIC: 8.0      // ₹8 per kg for basic quality
};

const translations = {
  en: {
    title: 'Record Cow Dung Collection',
    subtitle: 'Add new contribution to biogas production',
    farmerInfo: 'Farmer Information',
    farmerName: 'Farmer Name',
    farmerId: 'Farmer ID',
    collectionDetails: 'Collection Details',
    weight: 'Weight (kg)',
    qualityGrade: 'Quality Grade',
    premium: 'Premium',
    standard: 'Standard',
    basic: 'Basic',
    moistureContent: 'Moisture Content (%)',
    location: 'Collection Location',
    latitude: 'Latitude',
    longitude: 'Longitude',
    getCurrentLocation: 'Get Current Location',
    paymentDetails: 'Payment Details',
    ratePerKg: 'Rate per kg (₹)',
    totalAmount: 'Total Amount (₹)',
    paymentMethod: 'Payment Method',
    additionalInfo: 'Additional Information',
    deviceId: 'Device Reading ID',
    notes: 'Notes',
    recordTransaction: 'Record Transaction',
    cancel: 'Cancel',
    processing: 'Processing...',
    success: 'Transaction recorded successfully!',
    error: 'Failed to record transaction. Please try again.',
    requiredField: 'This field is required',
    invalidWeight: 'Weight must be greater than 0',
    invalidRate: 'Rate must be greater than 0'
  },
  hi: {
    title: 'गोबर संग्रह रिकॉर्ड करें',
    subtitle: 'बायोगैस उत्पादन में नया योगदान जोड़ें',
    farmerInfo: 'किसान की जानकारी',
    farmerName: 'किसान का नाम',
    farmerId: 'किसान ID',
    collectionDetails: 'संग्रह विवरण',
    weight: 'वजन (किलो)',
    qualityGrade: 'गुणवत्ता श्रेणी',
    premium: 'प्रीमियम',
    standard: 'मानक',
    basic: 'बेसिक',
    moistureContent: 'नमी की मात्रा (%)',
    location: 'संग्रह स्थान',
    latitude: 'अक्षांश',
    longitude: 'देशांतर',
    getCurrentLocation: 'वर्तमान स्थान लें',
    paymentDetails: 'भुगतान विवरण',
    ratePerKg: 'प्रति किलो दर (₹)',
    totalAmount: 'कुल राशि (₹)',
    paymentMethod: 'भुगतान विधि',
    additionalInfo: 'अतिरिक्त जानकारी',
    deviceId: 'डिवाइस रीडिंग ID',
    notes: 'टिप्पणी',
    recordTransaction: 'लेनदेन रिकॉर्ड करें',
    cancel: 'रद्द करें',
    processing: 'प्रसंस्करण...',
    success: 'लेनदेन सफलतापूर्वक रिकॉर्ड हुआ!',
    error: 'लेनदेन रिकॉर्ड करने में विफल। कृपया पुनः प्रयास करें।',
    requiredField: 'यह फ़ील्ड आवश्यक है',
    invalidWeight: 'वजन 0 से अधिक होना चाहिए',
    invalidRate: 'दर 0 से अधिक होनी चाहिए'
  }
};

export default function CowDungTransaction({ cattle, onClose, onSuccess }: Props) {
  const [language] = useState<'en' | 'hi'>('en');
  const [formData, setFormData] = useState<TransactionFormData>({
    cattleId: cattle?.id || '',
    farmerId: cattle?.ownerId || '',
    farmerName: cattle?.owner || '',
    weightKg: '',
    ratePerKg: qualityRates.STANDARD.toString(),
    totalAmount: '0.00',
    paymentMethod: 'UPI',
    qualityGrade: 'STANDARD',
    moistureContent: '65',
    gpsLatitude: '',
    gpsLongitude: '',
    deviceReadingId: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Calculate total amount when weight or quality changes
  useEffect(() => {
    const weight = parseFloat(formData.weightKg);
    const rate = parseFloat(formData.ratePerKg);

    if (!isNaN(weight) && !isNaN(rate) && weight > 0 && rate > 0) {
      const total = (weight * rate).toFixed(2);
      setFormData(prev => ({ ...prev, totalAmount: total }));
    } else {
      setFormData(prev => ({ ...prev, totalAmount: '0.00' }));
    }
  }, [formData.weightKg, formData.ratePerKg]);

  // Update rate when quality grade changes
  useEffect(() => {
    const newRate = qualityRates[formData.qualityGrade].toString();
    setFormData(prev => ({ ...prev, ratePerKg: newRate }));
  }, [formData.qualityGrade]);

  const handleInputChange = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCurrentLocation = () => {
    setLocationStatus('loading');

    if (!navigator.geolocation) {
      setLocationStatus('error');
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          gpsLatitude: position.coords.latitude.toFixed(6),
          gpsLongitude: position.coords.longitude.toFixed(6)
        }));
        setLocationStatus('success');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationStatus('error');
        alert('Unable to get current location. Please enter manually.');
      }
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.farmerName.trim()) {
      newErrors.farmerName = t('requiredField');
    }

    if (!formData.farmerId.trim()) {
      newErrors.farmerId = t('requiredField');
    }

    const weight = parseFloat(formData.weightKg);
    if (!formData.weightKg || isNaN(weight) || weight <= 0) {
      newErrors.weightKg = t('invalidWeight');
    }

    const rate = parseFloat(formData.ratePerKg);
    if (!formData.ratePerKg || isNaN(rate) || rate <= 0) {
      newErrors.ratePerKg = t('invalidRate');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const contributionData = {
        externalId: `CONTRIB-${Date.now()}`,
        farmerId: formData.farmerId,
        farmerName: formData.farmerName,
        cattleId: formData.cattleId,
        deviceReadingId: formData.deviceReadingId || null,
        contributionDate: new Date().toISOString(),
        weightKg: parseFloat(formData.weightKg),
        ratePerKg: parseFloat(formData.ratePerKg),
        totalAmount: parseFloat(formData.totalAmount),
        paymentMethod: formData.paymentMethod,
        qualityGrade: formData.qualityGrade,
        moistureContent: parseFloat(formData.moistureContent),
        gpsLatitude: formData.gpsLatitude ? parseFloat(formData.gpsLatitude) : null,
        gpsLongitude: formData.gpsLongitude ? parseFloat(formData.gpsLongitude) : null,
        notes: formData.notes || null,
        isSubsidyEligible: true,
        carbonCreditEligible: true
      };

      const response = await BiogasServiceClient.recordContribution(contributionData);

      if (response.success !== false) {
        alert(t('success'));
        onSuccess(response);
        onClose();
      } else {
        throw new Error(response.message || 'Failed to record contribution');
      }
    } catch (error) {
      console.error('Error recording contribution:', error);
      alert(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQualityColor = (grade: string) => {
    switch (grade) {
      case 'PREMIUM':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'STANDARD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BASIC':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{t('title')}</h3>
            <p className="text-gray-600">{t('subtitle')}</p>
            {cattle && (
              <p className="text-sm text-green-600 mt-1">
                Cattle: {cattle.name} (ID: {cattle.rfidTag})
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Farmer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              {t('farmerInfo')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('farmerName')} *
                </label>
                <input
                  type="text"
                  value={formData.farmerName}
                  onChange={(e) => handleInputChange('farmerName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.farmerName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.farmerName && (
                  <p className="text-red-600 text-sm mt-1">{errors.farmerName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('farmerId')} *
                </label>
                <input
                  type="text"
                  value={formData.farmerId}
                  onChange={(e) => handleInputChange('farmerId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.farmerId ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.farmerId && (
                  <p className="text-red-600 text-sm mt-1">{errors.farmerId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Collection Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Scale className="h-5 w-5 mr-2 text-green-600" />
              {t('collectionDetails')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('weight')} *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weightKg}
                  onChange={(e) => handleInputChange('weightKg', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.weightKg ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.weightKg && (
                  <p className="text-red-600 text-sm mt-1">{errors.weightKg}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('qualityGrade')}
                </label>
                <select
                  value={formData.qualityGrade}
                  onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PREMIUM">{t('premium')} (₹{qualityRates.PREMIUM}/kg)</option>
                  <option value="STANDARD">{t('standard')} (₹{qualityRates.STANDARD}/kg)</option>
                  <option value="BASIC">{t('basic')} (₹{qualityRates.BASIC}/kg)</option>
                </select>
                <div className={`mt-2 px-2 py-1 rounded text-xs border ${getQualityColor(formData.qualityGrade)}`}>
                  <Star className="h-3 w-3 inline mr-1" />
                  {formData.qualityGrade} Quality
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('moistureContent')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.moistureContent}
                  onChange={(e) => handleInputChange('moistureContent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-600" />
              {t('location')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('latitude')}
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.gpsLatitude}
                  onChange={(e) => handleInputChange('gpsLatitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('longitude')}
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.gpsLongitude}
                  onChange={(e) => handleInputChange('gpsLongitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationStatus === 'loading'}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {locationStatus === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  {t('getCurrentLocation')}
                </button>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
              {t('paymentDetails')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ratePerKg')} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.ratePerKg}
                  onChange={(e) => handleInputChange('ratePerKg', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.ratePerKg ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.ratePerKg && (
                  <p className="text-red-600 text-sm mt-1">{errors.ratePerKg}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('totalAmount')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={`₹${formData.totalAmount}`}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold text-green-600"
                  />
                  <Coins className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('paymentMethod')}
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UPI">UPI</option>
                  <option value="CASH">Cash</option>
                  <option value="NEFT">NEFT</option>
                  <option value="AEPS">AEPS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
              {t('additionalInfo')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('deviceId')}
                </label>
                <input
                  type="text"
                  value={formData.deviceReadingId}
                  onChange={(e) => handleInputChange('deviceReadingId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional device reading ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('notes')}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional notes about the collection"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('processing')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t('recordTransaction')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}