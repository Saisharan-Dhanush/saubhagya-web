/**
 * Payment Processing Component
 * Handles payment processing for cow dung contributions
 */

import { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Banknote,
  Building,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  Loader,
  Receipt,
  QrCode,
  Phone,
  User
} from 'lucide-react';
import { BiogasServiceClient } from '../../services/microservices';

interface PaymentData {
  paymentMethod: 'UPI' | 'CASH' | 'NEFT' | 'AEPS';
  amount: number;
  contributionId: string;
  farmerName: string;
  farmerId: string;
  upiId?: string;
  bankAccount?: string;
  ifscCode?: string;
  phoneNumber?: string;
  notes?: string;
}

interface Props {
  contributionId: string;
  amount: number;
  farmerName: string;
  farmerId: string;
  onClose: () => void;
  onSuccess: (payment: any) => void;
}

const translations = {
  en: {
    title: 'Process Payment',
    subtitle: 'Complete payment for cow dung contribution',
    amount: 'Amount to Pay',
    selectMethod: 'Select Payment Method',
    upi: 'UPI Payment',
    cash: 'Cash Payment',
    neft: 'NEFT Transfer',
    aeps: 'AEPS (Aadhaar)',
    upiId: 'UPI ID',
    phoneNumber: 'Phone Number',
    bankAccount: 'Bank Account Number',
    ifscCode: 'IFSC Code',
    notes: 'Payment Notes',
    processPayment: 'Process Payment',
    processing: 'Processing...',
    cancel: 'Cancel',
    success: 'Payment processed successfully!',
    error: 'Payment processing failed. Please try again.',
    enterUpiId: 'Enter UPI ID (e.g., farmer@paytm)',
    enterPhone: 'Enter phone number linked to Aadhaar',
    enterBankDetails: 'Enter bank account details',
    enterNotes: 'Optional payment notes',
    paymentConfirmation: 'Payment Confirmation',
    transactionId: 'Transaction ID',
    paymentStatus: 'Payment Status',
    completed: 'Completed',
    viewReceipt: 'View Receipt',
    scanQrCode: 'Scan QR Code to Pay',
    cashReceived: 'Mark as Cash Received',
    generateReceipt: 'Generate Receipt'
  },
  hi: {
    title: 'भुगतान प्रक्रिया',
    subtitle: 'गोबर योगदान के लिए भुगतान पूरा करें',
    amount: 'भुगतान राशि',
    selectMethod: 'भुगतान विधि चुनें',
    upi: 'UPI भुगतान',
    cash: 'नकद भुगतान',
    neft: 'NEFT स्थानांतरण',
    aeps: 'AEPS (आधार)',
    upiId: 'UPI ID',
    phoneNumber: 'फोन नंबर',
    bankAccount: 'बैंक खाता संख्या',
    ifscCode: 'IFSC कोड',
    notes: 'भुगतान टिप्पणी',
    processPayment: 'भुगतान प्रक्रिया',
    processing: 'प्रसंस्करण...',
    cancel: 'रद्द करें',
    success: 'भुगतान सफलतापूर्वक प्रसंस्करित!',
    error: 'भुगतान प्रसंस्करण असफल। कृपया पुनः प्रयास करें।',
    enterUpiId: 'UPI ID दर्ज करें (जैसे, farmer@paytm)',
    enterPhone: 'आधार से जुड़ा फोन नंबर दर्ज करें',
    enterBankDetails: 'बैंक खाता विवरण दर्ज करें',
    enterNotes: 'वैकल्पिक भुगतान टिप्पणी',
    paymentConfirmation: 'भुगतान पुष्टि',
    transactionId: 'लेनदेन ID',
    paymentStatus: 'भुगतान स्थिति',
    completed: 'पूर्ण',
    viewReceipt: 'रसीद देखें',
    scanQrCode: 'भुगतान के लिए QR कोड स्कैन करें',
    cashReceived: 'नकद प्राप्त के रूप में चिह्नित करें',
    generateReceipt: 'रसीद जेनरेट करें'
  }
};

export default function PaymentProcessor({
  contributionId,
  amount,
  farmerName,
  farmerId,
  onClose,
  onSuccess
}: Props) {
  const [language] = useState<'en' | 'hi'>('en');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentMethod: 'UPI',
    amount,
    contributionId,
    farmerName,
    farmerId
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (paymentData.paymentMethod) {
      case 'UPI':
        if (!paymentData.upiId?.trim()) {
          newErrors.upiId = 'UPI ID is required';
        }
        break;
      case 'NEFT':
        if (!paymentData.bankAccount?.trim()) {
          newErrors.bankAccount = 'Bank account is required';
        }
        if (!paymentData.ifscCode?.trim()) {
          newErrors.ifscCode = 'IFSC code is required';
        }
        break;
      case 'AEPS':
        if (!paymentData.phoneNumber?.trim()) {
          newErrors.phoneNumber = 'Phone number is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProcessPayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const paymentRequest = {
        paymentMethod: paymentData.paymentMethod,
        amount: paymentData.amount,
        upiId: paymentData.upiId,
        bankAccount: paymentData.bankAccount,
        ifscCode: paymentData.ifscCode,
        phoneNumber: paymentData.phoneNumber,
        notes: paymentData.notes,
        transactionReference: `TXN-${Date.now()}`,
        operatorUserId: 'current-user-id' // This should come from auth context
      };

      const response = await BiogasServiceClient.processPayment(contributionId, paymentRequest);

      if (response.success !== false) {
        setPaymentResult(response);
        setPaymentSuccess(true);
        onSuccess(response);
      } else {
        throw new Error(response.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert(t('error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="h-5 w-5" />;
      case 'CASH':
        return <Banknote className="h-5 w-5" />;
      case 'NEFT':
        return <Building className="h-5 w-5" />;
      case 'AEPS':
        return <CreditCard className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'UPI':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'CASH':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'NEFT':
        return 'border-purple-200 bg-purple-50 text-purple-800';
      case 'AEPS':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-lg w-full p-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('paymentConfirmation')}</h3>
            <p className="text-gray-600 mb-6">{t('success')}</p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('transactionId')}:</span>
                <span className="font-mono font-medium">{paymentResult?.paymentId || 'TXN123456'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('amount')}:</span>
                <span className="font-semibold text-green-600">₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Farmer:</span>
                <span className="font-medium">{farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('paymentStatus')}:</span>
                <span className="font-medium text-green-600">{t('completed')}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  // Generate and download receipt
                  console.log('Generating receipt for:', paymentResult);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                {t('generateReceipt')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{t('title')}</h3>
            <p className="text-gray-600">{t('subtitle')}</p>
            <p className="text-sm text-green-600 mt-1">
              Farmer: {farmerName} (ID: {farmerId})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Display */}
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600 mb-1">{t('amount')}</p>
            <p className="text-3xl font-bold text-green-800">₹{amount.toFixed(2)}</p>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('selectMethod')}</h4>
            <div className="grid grid-cols-2 gap-3">
              {['UPI', 'CASH', 'NEFT', 'AEPS'].map((method) => (
                <button
                  key={method}
                  onClick={() => handleInputChange('paymentMethod', method as any)}
                  className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all ${
                    paymentData.paymentMethod === method
                      ? `${getPaymentMethodColor(method)} border-current`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {getPaymentIcon(method)}
                  <span className="font-medium">{t(method.toLowerCase())}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Details Form */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Details - {t(paymentData.paymentMethod.toLowerCase())}
            </h4>

            {paymentData.paymentMethod === 'UPI' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('upiId')} *
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('enterUpiId')}
                      value={paymentData.upiId || ''}
                      onChange={(e) => handleInputChange('upiId', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.upiId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.upiId && (
                    <p className="text-red-600 text-sm mt-1">{errors.upiId}</p>
                  )}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                  <QrCode className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{t('scanQrCode')}</p>
                    <p className="text-sm text-blue-700">Generate QR code for instant payment</p>
                  </div>
                </div>
              </div>
            )}

            {paymentData.paymentMethod === 'CASH' && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <Banknote className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{t('cashReceived')}</p>
                    <p className="text-sm text-green-700">Confirm cash payment of ₹{amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {paymentData.paymentMethod === 'NEFT' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('bankAccount')} *
                  </label>
                  <input
                    type="text"
                    placeholder={t('enterBankDetails')}
                    value={paymentData.bankAccount || ''}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.bankAccount ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.bankAccount && (
                    <p className="text-red-600 text-sm mt-1">{errors.bankAccount}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ifscCode')} *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., SBIN0001234"
                    value={paymentData.ifscCode || ''}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.ifscCode ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.ifscCode && (
                    <p className="text-red-600 text-sm mt-1">{errors.ifscCode}</p>
                  )}
                </div>
              </div>
            )}

            {paymentData.paymentMethod === 'AEPS' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('phoneNumber')} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder={t('enterPhone')}
                      value={paymentData.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('notes')}
              </label>
              <textarea
                placeholder={t('enterNotes')}
                value={paymentData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {t('processPayment')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}