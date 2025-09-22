import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Camera,
  Scale,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  MapPin,
  Truck,
  Save,
  RefreshCw,
  FileImage,
  Download,
  Eye,
  Calendar,
  Weight,
  QrCode,
  Smartphone,
  Shield,
  TrendingUp,
  CreditCard,
  Receipt,
  Verified
} from 'lucide-react';

// Enhanced types for TransactionEntry with IoT verification
type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'verified' | 'quality_check' | 'payment_pending';
type PaymentMethod = 'cash' | 'online' | 'bank_transfer' | 'upi';
type PaymentStatus = 'pending' | 'partial' | 'completed' | 'failed' | 'cancelled';
type QualityVerificationStatus = 'pending' | 'approved' | 'rejected' | 'requires_recheck';

interface IoTVerificationData {
  deviceId: string;
  deviceName: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  ph_level: number;
  gas_content: number;
  rfid_tag: string;
  gps_coordinates: string;
  verification_score: number;
  sensor_readings: {
    weight_sensor: number;
    quality_sensor: number;
    moisture_sensor: number;
  };
}

interface BatchReference {
  batchId: string;
  digesterId: string;
  expectedYield: number;
  fermentationDays: number;
  qualityPrediction: string;
}

interface TransactionData {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerAadhaar: string;
  location: string;
  phoneNumber: string;
  dungType: string;
  measuredWeight: number;
  qualityGrade: string;
  moistureContent: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  ratePerKg: number;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  notes: string;
  photos: string[];
  measurementDate: string;
  collectionDate: string;
  status: TransactionStatus;
  qualityVerificationStatus: QualityVerificationStatus;
  iotVerification: IoTVerificationData;
  batchReference: BatchReference;
  transportDetails: {
    vehicleNumber: string;
    driverName: string;
    routeId: string;
    estimatedDelivery: string;
  };
  inspector: {
    name: string;
    id: string;
    signature: boolean;
  };
  certificates: string[];
  verificationPhotos: string[];
  qrCode: string;
  receiptNumber: string;
  gstDetails: {
    gstNumber: string;
    taxAmount: number;
    cgst: number;
    sgst: number;
  };
}

// Enhanced comprehensive demo data with realistic Indian biogas operation scenarios
const transactions: TransactionData[] = [
  {
    id: 'TXN-2024-001',
    farmerId: 'FARM-MH-001',
    farmerName: 'राजेश कुमार शर्मा',
    farmerAadhaar: '****-****-2156',
    location: 'गोकुल गौशाला, मथुरा, उत्तर प्रदेश',
    phoneNumber: '+91 98765 43210',
    dungType: 'cow',
    measuredWeight: 52.8,
    qualityGrade: 'gradeA',
    moistureContent: 12,
    paymentMethod: 'upi',
    paymentStatus: 'completed',
    ratePerKg: 9.5,
    totalAmount: 501.60,
    advanceAmount: 250.00,
    balanceAmount: 251.60,
    notes: 'प्रीमियम गुणवत्ता गाय का गोबर। जैविक खाद से पोषित 18 गायों से संग्रह। श्रेष्ठ किण्वन क्षमता के साथ उच्च मीथेन सामग्री की अपेक्षा।',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    measurementDate: '2024-01-15T08:30:00Z',
    collectionDate: '2024-01-15T09:00:00Z',
    status: 'verified',
    qualityVerificationStatus: 'approved',
    iotVerification: {
      deviceId: 'IOT-SCALE-001',
      deviceName: 'Smart Scale Alpha-1',
      timestamp: '2024-01-15T08:32:15Z',
      temperature: 28.5,
      humidity: 65,
      ph_level: 7.2,
      gas_content: 68.5,
      rfid_tag: 'RFID-001-ABC123',
      gps_coordinates: '27.4924, 77.6737',
      verification_score: 95.8,
      sensor_readings: {
        weight_sensor: 52.8,
        quality_sensor: 94.2,
        moisture_sensor: 12.1
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-001',
      digesterId: 'DIG-MAIN-001',
      expectedYield: 42.5,
      fermentationDays: 28,
      qualityPrediction: 'excellent'
    },
    transportDetails: {
      vehicleNumber: 'UP-80-AB-1234',
      driverName: 'मोहन यादव',
      routeId: 'ROUTE-MTH-001',
      estimatedDelivery: '2024-01-15T11:00:00Z'
    },
    inspector: {
      name: 'डॉ. सुरेश गुप्ता',
      id: 'INS-001',
      signature: true
    },
    certificates: ['ORGANIC-CERT-001', 'QUALITY-CERT-001'],
    verificationPhotos: ['verify1.jpg', 'verify2.jpg'],
    qrCode: 'QR-TXN-2024-001-ABC123',
    receiptNumber: 'RCP-2024-000001',
    gstDetails: {
      gstNumber: 'GST09ABCDE1234F1Z5',
      taxAmount: 25.08,
      cgst: 12.54,
      sgst: 12.54
    }
  },
  {
    id: 'TXN-2024-002',
    farmerId: 'FARM-UP-002',
    farmerName: 'श्याम लाल यादव',
    farmerAadhaar: '****-****-3487',
    location: 'वृंदावन डेयरी फार्म, मथुरा',
    phoneNumber: '+91 87654 32109',
    dungType: 'buffalo',
    measuredWeight: 48.3,
    qualityGrade: 'gradeB',
    moistureContent: 15,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    ratePerKg: 8.5,
    totalAmount: 410.55,
    advanceAmount: 200.00,
    balanceAmount: 210.55,
    notes: 'भैंस का गोबर - उच्च नाइट्रोजन सामग्री। 12 भैंसों से दैनिक संग्रह। अगली डिलीवरी के समय भुगतान शेष।',
    photos: ['photo4.jpg', 'photo5.jpg'],
    measurementDate: '2024-01-14T16:45:00Z',
    collectionDate: '2024-01-14T17:15:00Z',
    status: 'payment_pending',
    qualityVerificationStatus: 'approved',
    iotVerification: {
      deviceId: 'IOT-SCALE-002',
      deviceName: 'Smart Scale Beta-2',
      timestamp: '2024-01-14T16:47:22Z',
      temperature: 26.8,
      humidity: 72,
      ph_level: 6.9,
      gas_content: 62.3,
      rfid_tag: 'RFID-002-DEF456',
      gps_coordinates: '27.5204, 77.6839',
      verification_score: 87.5,
      sensor_readings: {
        weight_sensor: 48.3,
        quality_sensor: 85.6,
        moisture_sensor: 15.2
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-002',
      digesterId: 'DIG-SEC-002',
      expectedYield: 38.2,
      fermentationDays: 30,
      qualityPrediction: 'good'
    },
    transportDetails: {
      vehicleNumber: 'UP-80-CD-5678',
      driverName: 'राम प्रसाद',
      routeId: 'ROUTE-VRN-001',
      estimatedDelivery: '2024-01-14T19:00:00Z'
    },
    inspector: {
      name: 'इंजी. अमित सिंह',
      id: 'INS-002',
      signature: true
    },
    certificates: ['QUALITY-CERT-002'],
    verificationPhotos: ['verify3.jpg'],
    qrCode: 'QR-TXN-2024-002-DEF456',
    receiptNumber: 'RCP-2024-000002',
    gstDetails: {
      gstNumber: 'GST09ABCDE1234F1Z5',
      taxAmount: 20.53,
      cgst: 10.26,
      sgst: 10.27
    }
  },
  {
    id: 'TXN-2024-003',
    farmerId: 'FARM-RJ-003',
    farmerName: 'गीता देवी',
    farmerAadhaar: '****-****-5692',
    location: 'आदर्श गौशाला, अलवर, राजस्थान',
    phoneNumber: '+91 96543 21087',
    dungType: 'mixed',
    measuredWeight: 65.7,
    qualityGrade: 'gradeA',
    moistureContent: 10,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'completed',
    ratePerKg: 10.0,
    totalAmount: 657.00,
    advanceAmount: 300.00,
    balanceAmount: 357.00,
    notes: 'मिश्रित गोबर - गाय और भैंस का संयोजन। उत्कृष्ट किण्वन गुणवत्ता। सबसे बड़ी दैनिक आपूर्ति। 25 पशुओं से एकत्रित।',
    photos: ['photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg'],
    measurementDate: '2024-01-13T07:15:00Z',
    collectionDate: '2024-01-13T07:45:00Z',
    status: 'verified',
    qualityVerificationStatus: 'approved',
    iotVerification: {
      deviceId: 'IOT-SCALE-003',
      deviceName: 'Smart Scale Gamma-3',
      timestamp: '2024-01-13T07:17:45Z',
      temperature: 29.2,
      humidity: 58,
      ph_level: 7.4,
      gas_content: 71.2,
      rfid_tag: 'RFID-003-GHI789',
      gps_coordinates: '27.5525, 76.6346',
      verification_score: 97.2,
      sensor_readings: {
        weight_sensor: 65.7,
        quality_sensor: 96.8,
        moisture_sensor: 10.3
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-003',
      digesterId: 'DIG-MAIN-001',
      expectedYield: 52.8,
      fermentationDays: 25,
      qualityPrediction: 'excellent'
    },
    transportDetails: {
      vehicleNumber: 'RJ-14-EF-9012',
      driverName: 'लखन सिंह',
      routeId: 'ROUTE-ALW-001',
      estimatedDelivery: '2024-01-13T10:30:00Z'
    },
    inspector: {
      name: 'डॉ. प्रिया शर्मा',
      id: 'INS-003',
      signature: true
    },
    certificates: ['ORGANIC-CERT-002', 'QUALITY-CERT-003', 'ISO-CERT-001'],
    verificationPhotos: ['verify4.jpg', 'verify5.jpg'],
    qrCode: 'QR-TXN-2024-003-GHI789',
    receiptNumber: 'RCP-2024-000003',
    gstDetails: {
      gstNumber: 'GST08FGHIJ5678K2A6',
      taxAmount: 32.85,
      cgst: 16.42,
      sgst: 16.43
    }
  },
  {
    id: 'TXN-2024-004',
    farmerId: 'FARM-HR-004',
    farmerName: 'विक्रम सिंह',
    farmerAadhaar: '****-****-7834',
    location: 'हरियाणा डेयरी कोऑपरेटिव, गुरुग्राम',
    phoneNumber: '+91 85432 10976',
    dungType: 'cow',
    measuredWeight: 42.1,
    qualityGrade: 'gradeB',
    moistureContent: 14,
    paymentMethod: 'upi',
    paymentStatus: 'partial',
    ratePerKg: 8.75,
    totalAmount: 368.37,
    advanceAmount: 150.00,
    balanceAmount: 218.37,
    notes: 'देसी गाय का गोबर। जैविक चारा उपयोग। मध्यम गुणवत्ता लेकिन स्थिर आपूर्ति। 14 देसी गायों से संग्रह।',
    photos: ['photo10.jpg', 'photo11.jpg'],
    measurementDate: '2024-01-12T14:20:00Z',
    collectionDate: '2024-01-12T15:00:00Z',
    status: 'quality_check',
    qualityVerificationStatus: 'pending',
    iotVerification: {
      deviceId: 'IOT-SCALE-004',
      deviceName: 'Smart Scale Delta-4',
      timestamp: '2024-01-12T14:22:18Z',
      temperature: 31.1,
      humidity: 55,
      ph_level: 6.8,
      gas_content: 59.7,
      rfid_tag: 'RFID-004-JKL012',
      gps_coordinates: '28.4595, 77.0266',
      verification_score: 82.3,
      sensor_readings: {
        weight_sensor: 42.1,
        quality_sensor: 78.9,
        moisture_sensor: 14.1
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-004',
      digesterId: 'DIG-SEC-003',
      expectedYield: 32.8,
      fermentationDays: 32,
      qualityPrediction: 'average'
    },
    transportDetails: {
      vehicleNumber: 'HR-26-GH-3456',
      driverName: 'सुरेश कुमार',
      routeId: 'ROUTE-GGN-001',
      estimatedDelivery: '2024-01-12T17:30:00Z'
    },
    inspector: {
      name: 'तकनीशियन राज कुमार',
      id: 'INS-004',
      signature: false
    },
    certificates: ['QUALITY-CERT-004'],
    verificationPhotos: ['verify6.jpg'],
    qrCode: 'QR-TXN-2024-004-JKL012',
    receiptNumber: 'RCP-2024-000004',
    gstDetails: {
      gstNumber: 'GST06MNOPQ9012L3B7',
      taxAmount: 18.42,
      cgst: 9.21,
      sgst: 9.21
    }
  },
  {
    id: 'TXN-2024-005',
    farmerId: 'FARM-PB-005',
    farmerName: 'जसप्रीत कौर',
    farmerAadhaar: '****-****-9156',
    location: 'पंजाब मिल्क फेडरेशन, लुधियाना',
    phoneNumber: '+91 74321 09865',
    dungType: 'buffalo',
    measuredWeight: 58.9,
    qualityGrade: 'gradeA',
    moistureContent: 11,
    paymentMethod: 'online',
    paymentStatus: 'completed',
    ratePerKg: 9.25,
    totalAmount: 544.82,
    advanceAmount: 0.00,
    balanceAmount: 544.82,
    notes: 'उच्च गुणवत्ता भैंस का गोबर। पंजाब की उन्नत नस्ल से। उत्कृष्ट कार्बन-नाइट्रोजन अनुपात। 20 मुर्रा भैंसों से दैनिक संग्रह।',
    photos: ['photo12.jpg', 'photo13.jpg', 'photo14.jpg'],
    measurementDate: '2024-01-11T09:30:00Z',
    collectionDate: '2024-01-11T10:00:00Z',
    status: 'verified',
    qualityVerificationStatus: 'approved',
    iotVerification: {
      deviceId: 'IOT-SCALE-005',
      deviceName: 'Smart Scale Epsilon-5',
      timestamp: '2024-01-11T09:32:55Z',
      temperature: 25.6,
      humidity: 68,
      ph_level: 7.1,
      gas_content: 69.8,
      rfid_tag: 'RFID-005-MNO345',
      gps_coordinates: '30.9010, 75.8573',
      verification_score: 93.7,
      sensor_readings: {
        weight_sensor: 58.9,
        quality_sensor: 92.4,
        moisture_sensor: 11.2
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-005',
      digesterId: 'DIG-MAIN-002',
      expectedYield: 47.3,
      fermentationDays: 26,
      qualityPrediction: 'excellent'
    },
    transportDetails: {
      vehicleNumber: 'PB-10-IJ-7890',
      driverName: 'गुरदीप सिंह',
      routeId: 'ROUTE-LDH-001',
      estimatedDelivery: '2024-01-11T12:45:00Z'
    },
    inspector: {
      name: 'डॉ. हरप्रीत कौर',
      id: 'INS-005',
      signature: true
    },
    certificates: ['ORGANIC-CERT-003', 'QUALITY-CERT-005'],
    verificationPhotos: ['verify7.jpg', 'verify8.jpg'],
    qrCode: 'QR-TXN-2024-005-MNO345',
    receiptNumber: 'RCP-2024-000005',
    gstDetails: {
      gstNumber: 'GST03PQRST3456M4C8',
      taxAmount: 27.24,
      cgst: 13.62,
      sgst: 13.62
    }
  },
  {
    id: 'TXN-2024-006',
    farmerId: 'FARM-MP-006',
    farmerName: 'रामेश्वर प्रसाद',
    farmerAadhaar: '****-****-2479',
    location: 'मध्यप्रदेश गौशाला, इंदौर',
    phoneNumber: '+91 93210 87654',
    dungType: 'cow',
    measuredWeight: 35.6,
    qualityGrade: 'gradeC',
    moistureContent: 18,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    ratePerKg: 7.50,
    totalAmount: 267.00,
    advanceAmount: 100.00,
    balanceAmount: 167.00,
    notes: 'मिश्रित नस्ल की गायों से गोबर। कुछ नमी अधिक होने के कारण Grade C। सुधार की संभावना। 10 गायों से संग्रह।',
    photos: ['photo15.jpg'],
    measurementDate: '2024-01-10T11:15:00Z',
    collectionDate: '2024-01-10T11:45:00Z',
    status: 'pending',
    qualityVerificationStatus: 'requires_recheck',
    iotVerification: {
      deviceId: 'IOT-SCALE-006',
      deviceName: 'Smart Scale Zeta-6',
      timestamp: '2024-01-10T11:17:33Z',
      temperature: 33.2,
      humidity: 78,
      ph_level: 6.5,
      gas_content: 52.4,
      rfid_tag: 'RFID-006-PQR678',
      gps_coordinates: '22.7196, 75.8577',
      verification_score: 68.9,
      sensor_readings: {
        weight_sensor: 35.6,
        quality_sensor: 65.2,
        moisture_sensor: 18.3
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-006',
      digesterId: 'DIG-SEC-004',
      expectedYield: 26.2,
      fermentationDays: 35,
      qualityPrediction: 'below_average'
    },
    transportDetails: {
      vehicleNumber: 'MP-09-KL-2345',
      driverName: 'अशोक यादव',
      routeId: 'ROUTE-IND-001',
      estimatedDelivery: '2024-01-10T14:00:00Z'
    },
    inspector: {
      name: 'तकनीशियन मनोज त्रिवेदी',
      id: 'INS-006',
      signature: false
    },
    certificates: [],
    verificationPhotos: ['verify9.jpg'],
    qrCode: 'QR-TXN-2024-006-PQR678',
    receiptNumber: 'RCP-2024-000006',
    gstDetails: {
      gstNumber: 'GST23STUVW7890N5D9',
      taxAmount: 13.35,
      cgst: 6.67,
      sgst: 6.68
    }
  },
  {
    id: 'TXN-2024-007',
    farmerId: 'FARM-GJ-007',
    farmerName: 'કિશોર ભાઈ પટેલ',
    farmerAadhaar: '****-****-5813',
    location: 'અમુલ ડેરી કોઓપરેટિવ, આણંદ, ગુજરાત',
    phoneNumber: '+91 82109 76543',
    dungType: 'mixed',
    measuredWeight: 71.4,
    qualityGrade: 'gradeA',
    moistureContent: 9,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'completed',
    ratePerKg: 10.50,
    totalAmount: 749.70,
    advanceAmount: 400.00,
    balanceAmount: 349.70,
    notes: 'ગુજરાતની શ્રેષ્ઠ ગુણવત્તાનું મિશ્રિત ગોબર। અમુલ ડેરીના ઉચ્ચ ધોરણ પ્રમાણે. 30 પશુઓથી દૈનિક સંગ્રહ। સર્વોત્તમ કિણ્વન ક્ષમતા।',
    photos: ['photo16.jpg', 'photo17.jpg', 'photo18.jpg', 'photo19.jpg'],
    measurementDate: '2024-01-09T06:45:00Z',
    collectionDate: '2024-01-09T07:15:00Z',
    status: 'verified',
    qualityVerificationStatus: 'approved',
    iotVerification: {
      deviceId: 'IOT-SCALE-007',
      deviceName: 'Smart Scale Eta-7',
      timestamp: '2024-01-09T06:47:42Z',
      temperature: 27.8,
      humidity: 62,
      ph_level: 7.6,
      gas_content: 74.1,
      rfid_tag: 'RFID-007-STU901',
      gps_coordinates: '22.5645, 72.9289',
      verification_score: 98.5,
      sensor_readings: {
        weight_sensor: 71.4,
        quality_sensor: 97.8,
        moisture_sensor: 9.1
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-007',
      digesterId: 'DIG-MAIN-003',
      expectedYield: 58.6,
      fermentationDays: 24,
      qualityPrediction: 'outstanding'
    },
    transportDetails: {
      vehicleNumber: 'GJ-01-MN-4567',
      driverName: 'રવિ ભાઈ શાહ',
      routeId: 'ROUTE-AND-001',
      estimatedDelivery: '2024-01-09T09:30:00Z'
    },
    inspector: {
      name: 'ડૉ. જયશ્રી પટેલ',
      id: 'INS-007',
      signature: true
    },
    certificates: ['ORGANIC-CERT-004', 'QUALITY-CERT-006', 'ISO-CERT-002', 'AMUL-CERT-001'],
    verificationPhotos: ['verify10.jpg', 'verify11.jpg'],
    qrCode: 'QR-TXN-2024-007-STU901',
    receiptNumber: 'RCP-2024-000007',
    gstDetails: {
      gstNumber: 'GST24VWXYZ1234O6E0',
      taxAmount: 37.48,
      cgst: 18.74,
      sgst: 18.74
    }
  },
  {
    id: 'TXN-2024-008',
    farmerId: 'FARM-TN-008',
    farmerName: 'முருகன் செட்டியார்',
    farmerAadhaar: '****-****-7926',
    location: 'தமிழ்நாடு பால் கூட்டுறவு, கோயம்புத்தூர்',
    phoneNumber: '+91 76543 21098',
    dungType: 'buffalo',
    measuredWeight: 46.8,
    qualityGrade: 'gradeB',
    moistureContent: 16,
    paymentMethod: 'upi',
    paymentStatus: 'completed',
    ratePerKg: 8.25,
    totalAmount: 386.10,
    advanceAmount: 150.00,
    balanceAmount: 236.10,
    notes: 'தமிழ்நாட்டு எருமையின் சாணம். நல்ல தரம். தென்னிந்திய காலநிலைக்கு ஏற்ற கிளர்வித்தல் குணங்கள். 16 எருமைகளில் இருந்து சேகரிப்பு.',
    photos: ['photo20.jpg', 'photo21.jpg'],
    measurementDate: '2024-01-08T15:30:00Z',
    collectionDate: '2024-01-08T16:00:00Z',
    status: 'completed',
    qualityVerificationStatus: 'approved',
    iotVerification: {
      deviceId: 'IOT-SCALE-008',
      deviceName: 'Smart Scale Theta-8',
      timestamp: '2024-01-08T15:32:28Z',
      temperature: 32.4,
      humidity: 75,
      ph_level: 6.7,
      gas_content: 61.9,
      rfid_tag: 'RFID-008-VWX234',
      gps_coordinates: '11.0168, 76.9558',
      verification_score: 84.6,
      sensor_readings: {
        weight_sensor: 46.8,
        quality_sensor: 82.3,
        moisture_sensor: 16.1
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-008',
      digesterId: 'DIG-SOUTH-001',
      expectedYield: 36.4,
      fermentationDays: 29,
      qualityPrediction: 'good'
    },
    transportDetails: {
      vehicleNumber: 'TN-38-OP-6789',
      driverName: 'குமார் ராஜு',
      routeId: 'ROUTE-CBE-001',
      estimatedDelivery: '2024-01-08T18:15:00Z'
    },
    inspector: {
      name: 'இன்ஜி. வெங்கடேஷ்',
      id: 'INS-008',
      signature: true
    },
    certificates: ['QUALITY-CERT-007', 'SOUTH-CERT-001'],
    verificationPhotos: ['verify12.jpg'],
    qrCode: 'QR-TXN-2024-008-VWX234',
    receiptNumber: 'RCP-2024-000008',
    gstDetails: {
      gstNumber: 'GST33ABCDE5678P7F1',
      taxAmount: 19.30,
      cgst: 9.65,
      sgst: 9.65
    }
  },
  {
    id: 'TXN-2024-009',
    farmerId: 'FARM-KA-009',
    farmerName: 'ಶ್ರೀನಿವಾಸ ರೆಡ್ಡಿ',
    farmerAadhaar: '****-****-4051',
    location: 'ಕರ್ನಾಟಕ ಮಿಲ್ಕ್ ಫೆಡರೇಶನ್, ಬೆಂಗಳೂರು',
    phoneNumber: '+91 65432 10987',
    dungType: 'cow',
    measuredWeight: 39.7,
    qualityGrade: 'gradeA',
    moistureContent: 13,
    paymentMethod: 'online',
    paymentStatus: 'partial',
    ratePerKg: 9.00,
    totalAmount: 357.30,
    advanceAmount: 200.00,
    balanceAmount: 157.30,
    notes: 'ಕರ್ನಾಟಕದ ಸ್ಥಳೀಯ ಹಸುಗಳ ಸಗಣಿ। ಉತ್ತಮ ಗುಣಮಟ್ಟ ಮತ್ತು ಜೈವಿಕ ಸಂಯೋಜನೆ। 12 ಸ್ಥಳೀಯ ಹಸುಗಳಿಂದ ಸಂಗ್ರಹ।',
    photos: ['photo22.jpg', 'photo23.jpg'],
    measurementDate: '2024-01-07T10:00:00Z',
    collectionDate: '2024-01-07T10:30:00Z',
    status: 'payment_pending',
    qualityVerificationStatus: 'approved',
    iotVerification: {
      deviceId: 'IOT-SCALE-009',
      deviceName: 'Smart Scale Iota-9',
      timestamp: '2024-01-07T10:02:15Z',
      temperature: 24.9,
      humidity: 69,
      ph_level: 7.3,
      gas_content: 66.7,
      rfid_tag: 'RFID-009-YZA567',
      gps_coordinates: '12.9716, 77.5946',
      verification_score: 91.2,
      sensor_readings: {
        weight_sensor: 39.7,
        quality_sensor: 89.8,
        moisture_sensor: 13.2
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-009',
      digesterId: 'DIG-SOUTH-002',
      expectedYield: 31.8,
      fermentationDays: 27,
      qualityPrediction: 'excellent'
    },
    transportDetails: {
      vehicleNumber: 'KA-03-QR-8901',
      driverName: 'ರಮೇಶ್ ಕುಮಾರ್',
      routeId: 'ROUTE-BLR-001',
      estimatedDelivery: '2024-01-07T13:00:00Z'
    },
    inspector: {
      name: 'ಡಾ. ಪ್ರಮೋದ್ ಶೆಟ್ಟಿ',
      id: 'INS-009',
      signature: true
    },
    certificates: ['ORGANIC-CERT-005', 'QUALITY-CERT-008'],
    verificationPhotos: ['verify13.jpg', 'verify14.jpg'],
    qrCode: 'QR-TXN-2024-009-YZA567',
    receiptNumber: 'RCP-2024-000009',
    gstDetails: {
      gstNumber: 'GST29FGHIJ9012Q8G2',
      taxAmount: 17.86,
      cgst: 8.93,
      sgst: 8.93
    }
  },
  {
    id: 'TXN-2024-010',
    farmerId: 'FARM-WB-010',
    farmerName: 'অমিত চক্রবর্তী',
    farmerAadhaar: '****-****-8394',
    location: 'পশ্চিমবঙ্গ দুগ্ধ সমবায়, কলকাতা',
    phoneNumber: '+91 54321 09876',
    dungType: 'mixed',
    measuredWeight: 55.2,
    qualityGrade: 'gradeB',
    moistureContent: 17,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'completed',
    ratePerKg: 8.00,
    totalAmount: 441.60,
    advanceAmount: 250.00,
    balanceAmount: 191.60,
    notes: 'পশ্চিমবঙ্গের মিশ্র গোবর। ভালো গুণমান এবং আর্দ্রতা কিছুটা বেশি। ১৮টি গরু ও মহিষ থেকে সংগ্রহ। বর্ষাকালের কারণে কিছুটা আর্দ্রতা।',
    photos: ['photo24.jpg', 'photo25.jpg', 'photo26.jpg'],
    measurementDate: '2024-01-06T13:45:00Z',
    collectionDate: '2024-01-06T14:15:00Z',
    status: 'completed',
    qualityVerificationStatus: 'approved',
    iotVerification: {
      deviceId: 'IOT-SCALE-010',
      deviceName: 'Smart Scale Kappa-10',
      timestamp: '2024-01-06T13:47:51Z',
      temperature: 30.5,
      humidity: 82,
      ph_level: 6.9,
      gas_content: 58.3,
      rfid_tag: 'RFID-010-BCD890',
      gps_coordinates: '22.5726, 88.3639',
      verification_score: 79.4,
      sensor_readings: {
        weight_sensor: 55.2,
        quality_sensor: 76.8,
        moisture_sensor: 17.3
      }
    },
    batchReference: {
      batchId: 'BATCH-2024-010',
      digesterId: 'DIG-EAST-001',
      expectedYield: 42.1,
      fermentationDays: 31,
      qualityPrediction: 'average'
    },
    transportDetails: {
      vehicleNumber: 'WB-06-ST-2345',
      driverName: 'সুভাষ দাস',
      routeId: 'ROUTE-KOL-001',
      estimatedDelivery: '2024-01-06T16:30:00Z'
    },
    inspector: {
      name: 'ইঞ্জি. রাজীব ঘোষ',
      id: 'INS-010',
      signature: true
    },
    certificates: ['QUALITY-CERT-009'],
    verificationPhotos: ['verify15.jpg'],
    qrCode: 'QR-TXN-2024-010-BCD890',
    receiptNumber: 'RCP-2024-000010',
    gstDetails: {
      gstNumber: 'GST19KLMNO3456R9H3',
      taxAmount: 22.08,
      cgst: 11.04,
      sgst: 11.04
    }
  }
];

// Mock functions with enhanced logging
const createTransaction = async (data: Partial<TransactionData>) => {
  console.log('Creating enhanced transaction with IoT verification:', data);
  // Simulate API call with comprehensive transaction data
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Transaction created with ID:', `TXN-${Date.now()}`);
      resolve(data);
    }, 1500);
  });
};

interface TransactionEntryProps {
  languageContext?: {
    language: 'hi' | 'en';
    t: (key: string) => string;
  };
}

const translations = {
  en: {
    title: 'Transaction Entry',
    subtitle: 'IoT weight capture and photo proof documentation',
    newTransaction: 'New Transaction',
    iotWeightCapture: 'IoT Weight Capture',
    photoProof: 'Photo Proof',
    transactionHistory: 'Transaction History',
    farmerDetails: 'Farmer Details',
    weightMeasurement: 'Weight Measurement',
    paymentDetails: 'Payment Details',
    farmerId: 'Farmer ID',
    farmerName: 'Farmer Name',
    farmerAadhaar: 'Aadhaar (Masked)',
    location: 'Location',
    phoneNumber: 'Phone Number',
    dungType: 'Dung Type',
    measurementDate: 'Measurement Date',
    collectionDate: 'Collection Date',
    measuredWeight: 'Measured Weight (kg)',
    qualityGrade: 'Quality Grade',
    moistureContent: 'Moisture Content (%)',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    ratePerKg: 'Rate per kg (₹)',
    totalAmount: 'Total Amount (₹)',
    advanceAmount: 'Advance Amount (₹)',
    balanceAmount: 'Balance Amount (₹)',
    notes: 'Notes',
    captureWeight: 'Capture Weight from IoT',
    takePhoto: 'Take Photo',
    uploadPhoto: 'Upload Photo',
    saveTransaction: 'Save Transaction',
    weighingInProgress: 'Weighing in Progress...',
    weightCaptured: 'Weight Captured Successfully',
    photoRequired: 'Photo proof is required',
    transactionSaved: 'Transaction saved successfully',
    cash: 'Cash',
    online: 'Online',
    bank_transfer: 'Bank Transfer',
    upi: 'UPI',
    pending: 'Pending',
    partial: 'Partial',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    verified: 'Verified',
    quality_check: 'Quality Check',
    payment_pending: 'Payment Pending',
    gradeA: 'Grade A (Premium)',
    gradeB: 'Grade B (Standard)',
    gradeC: 'Grade C (Basic)',
    cow: 'Cow Dung',
    buffalo: 'Buffalo Dung',
    mixed: 'Mixed Dung',
    connecting: 'Connecting to IoT scale...',
    connected: 'Connected to IoT scale',
    connectionFailed: 'Failed to connect to IoT scale',
    retryConnection: 'Retry Connection',
    manualEntry: 'Manual Entry',
    autoCapture: 'Auto Capture',
    calibrateScale: 'Calibrate Scale',
    viewDetails: 'View Details',
    printReceipt: 'Print Receipt',
    status: 'Status',
    amount: 'Amount',
    date: 'Date',
    actions: 'Actions',
    iotVerification: 'IoT Verification',
    batchReference: 'Batch Reference',
    transportDetails: 'Transport Details',
    inspector: 'Inspector',
    certificates: 'Certificates',
    qrCode: 'QR Code',
    receiptNumber: 'Receipt Number',
    gstDetails: 'GST Details',
    deviceId: 'Device ID',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    phLevel: 'pH Level',
    gasContent: 'Gas Content (%)',
    rfidTag: 'RFID Tag',
    gpsCoordinates: 'GPS Coordinates',
    verificationScore: 'Verification Score',
    batchId: 'Batch ID',
    digesterId: 'Digester ID',
    expectedYield: 'Expected Yield (L)',
    fermentationDays: 'Fermentation Days',
    qualityPrediction: 'Quality Prediction',
    vehicleNumber: 'Vehicle Number',
    driverName: 'Driver Name',
    routeId: 'Route ID',
    estimatedDelivery: 'Estimated Delivery',
    gstNumber: 'GST Number',
    taxAmount: 'Tax Amount (₹)',
    cgst: 'CGST (₹)',
    sgst: 'SGST (₹)',
    approved: 'Approved',
    rejected: 'Rejected',
    requires_recheck: 'Requires Recheck'
  },
  hi: {
    title: 'लेन-देन प्रविष्टि',
    subtitle: 'IoT वजन कैप्चर और फोटो प्रूफ दस्तावेजीकरण',
    newTransaction: 'नया लेन-देन',
    iotWeightCapture: 'IoT वजन कैप्चर',
    photoProof: 'फोटो प्रूफ',
    transactionHistory: 'लेन-देन इतिहास',
    farmerDetails: 'किसान विवरण',
    weightMeasurement: 'वजन माप',
    paymentDetails: 'भुगतान विवरण',
    farmerId: 'किसान आईडी',
    farmerName: 'किसान का नाम',
    farmerAadhaar: 'आधार (मास्क्ड)',
    location: 'स्थान',
    phoneNumber: 'फोन नंबर',
    dungType: 'गोबर का प्रकार',
    measurementDate: 'माप की तारीख',
    collectionDate: 'संग्रह की तारीख',
    measuredWeight: 'मापा गया वजन (किलो)',
    qualityGrade: 'गुणवत्ता ग्रेड',
    moistureContent: 'नमी की मात्रा (%)',
    paymentMethod: 'भुगतान विधि',
    paymentStatus: 'भुगतान स्थिति',
    ratePerKg: 'प्रति किलो दर (₹)',
    totalAmount: 'कुल राशि (₹)',
    advanceAmount: 'अग्रिम राशि (₹)',
    balanceAmount: 'शेष राशि (₹)',
    notes: 'टिप्पणियां',
    captureWeight: 'IoT से वजन कैप्चर करें',
    takePhoto: 'फोटो लें',
    uploadPhoto: 'फोटो अपलोड करें',
    saveTransaction: 'लेन-देन सेव करें',
    weighingInProgress: 'तौलना प्रगति में...',
    weightCaptured: 'वजन सफलतापूर्वक कैप्चर किया गया',
    photoRequired: 'फोटो प्रूफ आवश्यक है',
    transactionSaved: 'लेन-देन सफलतापूर्वक सेव किया गया',
    cash: 'नकद',
    online: 'ऑनलाइन',
    bank_transfer: 'बैंक ट्रांसफर',
    upi: 'UPI',
    pending: 'लंबित',
    partial: 'आंशिक',
    completed: 'पूर्ण',
    failed: 'असफल',
    cancelled: 'रद्द',
    verified: 'सत्यापित',
    quality_check: 'गुणवत्ता जांच',
    payment_pending: 'भुगतान लंबित',
    gradeA: 'ग्रेड A (प्रीमियम)',
    gradeB: 'ग्रेड B (मानक)',
    gradeC: 'ग्रेड C (बेसिक)',
    cow: 'गाय का गोबर',
    buffalo: 'भैंस का गोबर',
    mixed: 'मिश्रित गोबर',
    connecting: 'IoT स्केल से कनेक्ट हो रहा है...',
    connected: 'IoT स्केल से कनेक्ट हो गया',
    connectionFailed: 'IoT स्केल से कनेक्ट नहीं हो सका',
    retryConnection: 'फिर से कोशिश करें',
    manualEntry: 'मैन्युअल एंट्री',
    autoCapture: 'ऑटो कैप्चर',
    calibrateScale: 'स्केल कैलिब्रेट करें',
    viewDetails: 'विवरण देखें',
    printReceipt: 'रसीद प्रिंट करें',
    status: 'स्थिति',
    amount: 'राशि',
    date: 'तारीख',
    actions: 'कार्य',
    iotVerification: 'IoT सत्यापन',
    batchReference: 'बैच संदर्भ',
    transportDetails: 'परिवहन विवरण',
    inspector: 'निरीक्षक',
    certificates: 'प्रमाणपत्र',
    qrCode: 'QR कोड',
    receiptNumber: 'रसीद संख्या',
    gstDetails: 'GST विवरण',
    deviceId: 'डिवाइस आईडी',
    temperature: 'तापमान (°C)',
    humidity: 'आर्द्रता (%)',
    phLevel: 'pH स्तर',
    gasContent: 'गैस सामग्री (%)',
    rfidTag: 'RFID टैग',
    gpsCoordinates: 'GPS निर्देशांक',
    verificationScore: 'सत्यापन स्कोर',
    batchId: 'बैच आईडी',
    digesterId: 'डाइजेस्टर आईडी',
    expectedYield: 'अपेक्षित उत्पादन (L)',
    fermentationDays: 'किण्वन दिन',
    qualityPrediction: 'गुणवत्ता भविष्यवाणी',
    vehicleNumber: 'वाहन संख्या',
    driverName: 'चालक का नाम',
    routeId: 'मार्ग आईडी',
    estimatedDelivery: 'अनुमानित डिलीवरी',
    gstNumber: 'GST संख्या',
    taxAmount: 'कर राशि (₹)',
    cgst: 'CGST (₹)',
    sgst: 'SGST (₹)',
    approved: 'अनुमोदित',
    rejected: 'अस्वीकृत',
    requires_recheck: 'पुनः जांच आवश्यक'
  }
};

const getStatusColor = (status: TransactionStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'verified':
      return 'bg-blue-100 text-blue-800';
    case 'quality_check':
      return 'bg-orange-100 text-orange-800';
    case 'payment_pending':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'partial':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getQualityStatusColor = (status: QualityVerificationStatus): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'requires_recheck':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Enhanced IoT Weight Capture Component
const IoTWeightCapture: React.FC<{
  onWeightCaptured: (weight: number) => void;
  t: (key: string) => string;
}> = ({ onWeightCaptured, t }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isWeighing, setIsWeighing] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [connectionError, setConnectionError] = useState(false);
  const [iotData, setIotData] = useState<Partial<IoTVerificationData> | null>(null);

  const simulateConnection = useCallback(() => {
    setIsConnecting(true);
    setConnectionError(false);

    setTimeout(() => {
      setIsConnecting(false);
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        setIsConnected(true);

        // Simulate IoT device data
        const mockIotData: Partial<IoTVerificationData> = {
          deviceId: `IOT-SCALE-${Math.floor(Math.random() * 10) + 1}`.padStart(3, '0'),
          deviceName: 'Smart Scale Alpha-Pro',
          timestamp: new Date().toISOString(),
          temperature: 25 + Math.random() * 10,
          humidity: 55 + Math.random() * 25,
          ph_level: 6.5 + Math.random() * 1.5,
          gas_content: 55 + Math.random() * 20,
          verification_score: 80 + Math.random() * 20
        };
        setIotData(mockIotData);

        // Simulate real-time weight updates
        const interval = setInterval(() => {
          setCurrentWeight(prev => {
            const newWeight = 45 + Math.random() * 10; // Simulate weight between 45-55 kg
            return Math.round(newWeight * 10) / 10;
          });
        }, 500);

        return () => clearInterval(interval);
      } else {
        setConnectionError(true);
      }
    }, 2000);
  }, []);

  const captureWeight = () => {
    setIsWeighing(true);
    setTimeout(() => {
      setIsWeighing(false);
      onWeightCaptured(currentWeight);
    }, 1500);
  };

  const simulateManualWeight = () => {
    const manualWeight = 48.5 + Math.random() * 5; // Random weight between 48.5-53.5
    onWeightCaptured(Math.round(manualWeight * 10) / 10);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5" />
          {t('iotWeightCapture')}
        </CardTitle>
        <CardDescription>
          Connect to IoT scale for automatic weight measurement with verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && !connectionError && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Scale className="w-8 h-8 text-gray-400" />
            </div>
            <Button
              onClick={simulateConnection}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t('connecting')}
                </>
              ) : (
                'Connect to IoT Scale'
              )}
            </Button>
          </div>
        )}

        {connectionError && (
          <div className="text-center space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('connectionFailed')}
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button
                onClick={simulateConnection}
                variant="outline"
                className="w-full"
              >
                {t('retryConnection')}
              </Button>
              <Button
                onClick={simulateManualWeight}
                variant="secondary"
                className="w-full"
              >
                {t('manualEntry')}
              </Button>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-green-600 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                {t('connected')}
              </div>
              <div className="text-4xl font-bold text-blue-600">
                {currentWeight.toFixed(1)} kg
              </div>
              <div className="text-sm text-muted-foreground">
                Real-time weight reading
              </div>
            </div>

            {/* IoT Device Information */}
            {iotData && (
              <div className="grid grid-cols-2 gap-2 text-xs bg-blue-50 p-3 rounded">
                <div>Device: {iotData.deviceName}</div>
                <div>Score: {iotData.verification_score?.toFixed(1)}%</div>
                <div>Temp: {iotData.temperature?.toFixed(1)}°C</div>
                <div>Humidity: {iotData.humidity?.toFixed(0)}%</div>
                <div>pH: {iotData.ph_level?.toFixed(1)}</div>
                <div>Gas: {iotData.gas_content?.toFixed(1)}%</div>
              </div>
            )}

            {isWeighing && (
              <div className="space-y-2">
                <Progress value={75} className="w-full" />
                <div className="text-center text-sm text-muted-foreground">
                  {t('weighingInProgress')}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={captureWeight}
                disabled={isWeighing}
                className="w-full"
              >
                {isWeighing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Weight className="w-4 h-4 mr-2" />
                    {t('captureWeight')}
                  </>
                )}
              </Button>
              <Button
                onClick={() => {/* Calibrate scale */}}
                variant="outline"
                className="w-full"
              >
                {t('calibrateScale')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Enhanced Photo Capture Component
const PhotoCapture: React.FC<{
  onPhotoAdded: (photo: string) => void;
  photos: string[];
  t: (key: string) => string;
}> = ({ onPhotoAdded, photos, t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onPhotoAdded(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulatePhotoCapture = () => {
    // Simulate camera photo with placeholder
    const placeholderPhoto = `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="40%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#6b7280">
          Dung Sample Photo ${photos.length + 1}
        </text>
        <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="10" fill="#9ca3af">
          Timestamp: ${new Date().toLocaleString()}
        </text>
      </svg>
    `)}`;
    onPhotoAdded(placeholderPhoto);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          {t('photoProof')}
        </CardTitle>
        <CardDescription>
          Capture photos of dung samples for quality verification and compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={simulatePhotoCapture}
            variant="outline"
            className="w-full"
          >
            <Camera className="w-4 h-4 mr-2" />
            {t('takePhoto')}
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('uploadPhoto')}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {photos.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">
              Captured Photos ({photos.length})
            </div>
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <div className="absolute top-1 right-1">
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileImage className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm">No photos captured yet</p>
            <p className="text-xs">{t('photoRequired')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const TransactionEntry: React.FC<TransactionEntryProps> = ({ languageContext }) => {
  const [activeTab, setActiveTab] = useState('new');

  // Enhanced form state with additional fields
  const [formData, setFormData] = useState({
    farmerId: '',
    farmerName: '',
    farmerAadhaar: '',
    location: '',
    phoneNumber: '',
    dungType: 'cow',
    measuredWeight: 0,
    qualityGrade: 'gradeB',
    moistureContent: 15,
    paymentMethod: 'cash' as PaymentMethod,
    paymentStatus: 'pending' as PaymentStatus,
    ratePerKg: 8.50,
    advanceAmount: 0,
    notes: ''
  });

  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const lang = languageContext?.language || 'en';
  const t = (key: string): string => {
    return languageContext?.t(key) || translations[lang][key as keyof typeof translations[typeof lang]] || key;
  };

  const handleWeightCaptured = (weight: number) => {
    setFormData(prev => ({ ...prev, measuredWeight: weight }));
  };

  const handlePhotoAdded = (photo: string) => {
    setCapturedPhotos(prev => [...prev, photo]);
  };

  const calculateTotalAmount = () => {
    return formData.measuredWeight * formData.ratePerKg;
  };

  const calculateBalanceAmount = () => {
    return calculateTotalAmount() - formData.advanceAmount;
  };

  const handleSaveTransaction = async () => {
    if (formData.measuredWeight === 0) {
      alert('Please capture weight first');
      return;
    }

    if (capturedPhotos.length === 0) {
      alert(t('photoRequired'));
      return;
    }

    setIsSaving(true);

    try {
      const transactionData: Partial<TransactionData> = {
        ...formData,
        totalAmount: calculateTotalAmount(),
        balanceAmount: calculateBalanceAmount(),
        photos: capturedPhotos,
        measurementDate: new Date().toISOString(),
        collectionDate: new Date().toISOString(),
        status: 'pending' as TransactionStatus,
        qualityVerificationStatus: 'pending' as QualityVerificationStatus
      };

      await createTransaction(transactionData);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        // Reset form
        setFormData({
          farmerId: '',
          farmerName: '',
          farmerAadhaar: '',
          location: '',
          phoneNumber: '',
          dungType: 'cow',
          measuredWeight: 0,
          qualityGrade: 'gradeB',
          moistureContent: 15,
          paymentMethod: 'cash' as PaymentMethod,
          paymentStatus: 'pending' as PaymentStatus,
          ratePerKg: 8.50,
          advanceAmount: 0,
          notes: ''
        });
        setCapturedPhotos([]);
      }, 2000);

    } catch (error) {
      console.error('Failed to save transaction:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const recentTransactions = transactions.slice(0, 10);
  const pendingTransactions = transactions.filter(t => t.status === 'pending' || t.status === 'payment_pending');
  const todaysTransactions = transactions.filter(t =>
    new Date(t.measurementDate).toDateString() === new Date().toDateString()
  );
  const verifiedTransactions = transactions.filter(t => t.status === 'verified');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between -mt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        {saveSuccess && (
          <Alert className="w-auto">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {t('transactionSaved')}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {todaysTransactions.reduce((sum, t) => sum + t.measuredWeight, 0).toFixed(1)} kg total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Transactions</CardTitle>
            <Verified className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              IoT verified entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{transactions.reduce((sum, t) => sum + t.totalAmount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              All transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">{t('newTransaction')}</TabsTrigger>
          <TabsTrigger value="iot">{t('iotWeightCapture')}</TabsTrigger>
          <TabsTrigger value="history">{t('transactionHistory')}</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Enhanced Farmer Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t('farmerDetails')}</CardTitle>
                <CardDescription>
                  Basic farmer information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmerId">{t('farmerId')}</Label>
                    <Input
                      id="farmerId"
                      value={formData.farmerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, farmerId: e.target.value }))}
                      placeholder="FARM-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmerName">{t('farmerName')}</Label>
                    <Input
                      id="farmerName"
                      value={formData.farmerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, farmerName: e.target.value }))}
                      placeholder="राम कुमार"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmerAadhaar">{t('farmerAadhaar')}</Label>
                  <Input
                    id="farmerAadhaar"
                    value={formData.farmerAadhaar}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmerAadhaar: e.target.value }))}
                    placeholder="****-****-1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t('location')}</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Village, District"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Weight Measurement */}
            <Card>
              <CardHeader>
                <CardTitle>{t('weightMeasurement')}</CardTitle>
                <CardDescription>
                  Dung quality and weight measurement details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dungType">{t('dungType')}</Label>
                    <Select value={formData.dungType} onValueChange={(value) => setFormData(prev => ({ ...prev, dungType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cow">{t('cow')}</SelectItem>
                        <SelectItem value="buffalo">{t('buffalo')}</SelectItem>
                        <SelectItem value="mixed">{t('mixed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualityGrade">{t('qualityGrade')}</Label>
                    <Select value={formData.qualityGrade} onValueChange={(value) => setFormData(prev => ({ ...prev, qualityGrade: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gradeA">{t('gradeA')}</SelectItem>
                        <SelectItem value="gradeB">{t('gradeB')}</SelectItem>
                        <SelectItem value="gradeC">{t('gradeC')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="measuredWeight">{t('measuredWeight')}</Label>
                    <Input
                      id="measuredWeight"
                      type="number"
                      step="0.1"
                      value={formData.measuredWeight}
                      onChange={(e) => setFormData(prev => ({ ...prev, measuredWeight: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.0"
                    />
                    {formData.measuredWeight > 0 && (
                      <div className="text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        {t('weightCaptured')}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moistureContent">{t('moistureContent')}</Label>
                    <Input
                      id="moistureContent"
                      type="number"
                      value={formData.moistureContent}
                      onChange={(e) => setFormData(prev => ({ ...prev, moistureContent: parseInt(e.target.value) || 0 }))}
                      placeholder="15"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t('paymentDetails')}</CardTitle>
                <CardDescription>
                  Payment method and amount calculation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">{t('paymentMethod')}</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as PaymentMethod }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">{t('cash')}</SelectItem>
                        <SelectItem value="online">{t('online')}</SelectItem>
                        <SelectItem value="bank_transfer">{t('bank_transfer')}</SelectItem>
                        <SelectItem value="upi">{t('upi')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus">{t('paymentStatus')}</Label>
                    <Select value={formData.paymentStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentStatus: value as PaymentStatus }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{t('pending')}</SelectItem>
                        <SelectItem value="partial">{t('partial')}</SelectItem>
                        <SelectItem value="completed">{t('completed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ratePerKg">{t('ratePerKg')}</Label>
                  <Input
                    id="ratePerKg"
                    type="number"
                    step="0.50"
                    value={formData.ratePerKg}
                    onChange={(e) => setFormData(prev => ({ ...prev, ratePerKg: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('totalAmount')}</Label>
                    <div className="text-lg font-bold text-green-600">
                      ₹{calculateTotalAmount().toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="advanceAmount">{t('advanceAmount')}</Label>
                    <Input
                      id="advanceAmount"
                      type="number"
                      step="0.50"
                      value={formData.advanceAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, advanceAmount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('balanceAmount')}</Label>
                    <div className="text-lg font-bold text-blue-600">
                      ₹{calculateBalanceAmount().toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t('notes')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Photo Capture */}
            <PhotoCapture
              onPhotoAdded={handlePhotoAdded}
              photos={capturedPhotos}
              t={t}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveTransaction}
              disabled={isSaving || formData.measuredWeight === 0 || capturedPhotos.length === 0}
              className="w-48"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('saveTransaction')}
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="iot">
          <IoTWeightCapture
            onWeightCaptured={handleWeightCaptured}
            t={t}
          />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('transactionHistory')}</CardTitle>
              <CardDescription>
                Comprehensive transaction records with IoT verification and batch tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4 space-y-3">
                    {/* Transaction Header */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-4">
                          <h4 className="font-semibold">{transaction.farmerName}</h4>
                          <Badge className={getStatusColor(transaction.status)}>
                            {t(transaction.status)}
                          </Badge>
                          <Badge className={getPaymentStatusColor(transaction.paymentStatus)}>
                            {t(transaction.paymentStatus)}
                          </Badge>
                          <Badge className={getQualityStatusColor(transaction.qualityVerificationStatus)}>
                            {t(transaction.qualityVerificationStatus)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {transaction.farmerId}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {transaction.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Weight className="w-3 h-3" />
                            {transaction.measuredWeight} kg
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(transaction.measurementDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₹{transaction.totalAmount.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.receiptNumber}
                        </div>
                      </div>
                    </div>

                    {/* IoT Verification Info */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-blue-50 p-3 rounded text-xs">
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          IoT Device
                        </div>
                        <div>{transaction.iotVerification.deviceName}</div>
                        <div className="text-muted-foreground">{transaction.iotVerification.deviceId}</div>
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verification Score
                        </div>
                        <div className="text-green-600 font-bold">
                          {transaction.iotVerification.verification_score.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Batch Reference</div>
                        <div>{transaction.batchReference.batchId}</div>
                        <div className="text-muted-foreground">
                          Yield: {transaction.batchReference.expectedYield}L
                        </div>
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          <QrCode className="w-3 h-3" />
                          QR Code
                        </div>
                        <div className="font-mono">{transaction.qrCode}</div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="font-medium mb-1">Transport Details</div>
                        <div>{transaction.transportDetails.vehicleNumber}</div>
                        <div>{transaction.transportDetails.driverName}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Quality Inspector</div>
                        <div>{transaction.inspector.name}</div>
                        <div className="flex items-center gap-1">
                          {transaction.inspector.signature ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-orange-600" />
                          )}
                          {transaction.inspector.signature ? 'Signed' : 'Pending Signature'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Certificates</div>
                        <div className="flex flex-wrap gap-1">
                          {transaction.certificates.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        {t('viewDetails')}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Receipt className="w-4 h-4 mr-1" />
                        {t('printReceipt')}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileImage className="w-12 h-12 mx-auto mb-2" />
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionEntry;