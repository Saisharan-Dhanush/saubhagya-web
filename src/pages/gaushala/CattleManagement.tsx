/**
 * Cattle Management System
 * Complete CRUD operations with RFID integration, search, filtering, and detailed cattle records
 */

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Users,
  Activity,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Camera,
  X,
  Save,
  Scan,
  Beef,
  Scale,
  History
} from 'lucide-react';
import { gauShalaApi } from '../../services/gaushala/api';
import { useNavigate } from 'react-router-dom';
import CowDungTransaction from '../../components/gaushala/CowDungTransaction';
import TransactionHistory from '../../components/gaushala/TransactionHistory';

interface LanguageContextType {
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  t: (key: string) => string;
}

interface Cattle {
  id: string;
  rfidTag: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  health: 'healthy' | 'sick' | 'recovering' | 'vaccination_due';
  owner: string;
  ownerId: string;
  currentStatus: 'IN' | 'OUT' | 'UNKNOWN';
  location: {
    latitude: number;
    longitude: number;
    timestamp: number;
    address?: string;
  };
  totalDungCollected: number;
  lastDungCollection?: number;
  isActive: boolean;
  photoUrl?: string;
  medicalHistory: MedicalRecord[];
  createdAt: number;
  updatedAt: number;
}

interface MedicalRecord {
  id: string;
  date: number;
  type: 'checkup' | 'vaccination' | 'treatment' | 'surgery';
  description: string;
  veterinarian: string;
  medication?: string;
  nextCheckup?: number;
}

interface CattleFilter {
  search: string;
  health: string;
  breed: string;
  owner: string;
  status: string;
  isActive: boolean | null;
  gaushalaId?: string;
}

const translations = {
  en: {
    title: 'Cattle Management',
    subtitle: 'Manage cattle records with RFID tracking',
    addCattle: 'Add Cattle',
    searchPlaceholder: 'Search by name, RFID, or owner...',
    filterBy: 'Filter',
    allHealth: 'All Health',
    healthy: 'Healthy',
    sick: 'Sick',
    recovering: 'Recovering',
    vaccinationDue: 'Vaccination Due',
    allBreeds: 'All Breeds',
    allOwners: 'All Owners',
    active: 'Active',
    inactive: 'Inactive',
    name: 'Name',
    rfidTag: 'RFID Tag',
    breed: 'Breed',
    age: 'Age',
    weight: 'Weight',
    health: 'Health',
    status: 'Status',
    statusIn: 'Inside',
    statusOut: 'Outside',
    statusUnknown: 'Unknown',
    allStatus: 'All Status',
    owner: 'Owner',
    lastCollection: 'Last Collection',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    recordTransaction: 'Record Dung Collection',
    viewHistory: 'View Transaction History',
    scanRFID: 'Scan RFID',
    addPhoto: 'Add Photo',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    cattleDetails: 'Cattle Details',
    basicInfo: 'Basic Information',
    locationInfo: 'Location Information',
    collectionStats: 'Collection Statistics',
    medicalHistory: 'Medical History',
    latitude: 'Latitude',
    longitude: 'Longitude',
    address: 'Address',
    totalCollected: 'Total Collected',
    avgQuality: 'Average Quality',
    lastCheckup: 'Last Checkup',
    nextCheckup: 'Next Checkup',
    kg: 'kg',
    years: 'years',
    never: 'Never',
    editCattle: 'Edit Cattle',
    deleteCattle: 'Delete Cattle',
    confirmDelete: 'Are you sure you want to delete this cattle record?',
    yes: 'Yes',
    no: 'No'
  },
  hi: {
    title: 'पशु प्रबंधन',
    subtitle: 'RFID ट्रैकिंग के साथ पशु रिकॉर्ड प्रबंधन',
    addCattle: 'पशु जोड़ें',
    searchPlaceholder: 'नाम, RFID, या मालिक से खोजें...',
    filterBy: 'फ़िल्टर',
    allHealth: 'सभी स्वास्थ्य',
    healthy: 'स्वस्थ',
    sick: 'बीमार',
    recovering: 'ठीक हो रहा',
    vaccinationDue: 'टीकाकरण देय',
    allBreeds: 'सभी नस्लें',
    allOwners: 'सभी मालिक',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    name: 'नाम',
    rfidTag: 'RFID टैग',
    breed: 'नस्ल',
    age: 'आयु',
    weight: 'वज़न',
    health: 'स्वास्थ्य',
    owner: 'मालिक',
    lastCollection: 'अंतिम संग्रह',
    actions: 'कार्य',
    view: 'देखें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    recordTransaction: 'गोबर संग्रह रिकॉर्ड करें',
    viewHistory: 'लेनदेन इतिहास देखें',
    scanRFID: 'RFID स्कैन करें',
    addPhoto: 'फोटो जोड़ें',
    saveChanges: 'परिवर्तन सेव करें',
    cancel: 'रद्द करें',
    cattleDetails: 'पशु विवरण',
    basicInfo: 'मूलभूत जानकारी',
    locationInfo: 'स्थान की जानकारी',
    collectionStats: 'संग्रह आंकड़े',
    medicalHistory: 'चिकित्सा इतिहास',
    latitude: 'अक्षांश',
    longitude: 'देशांतर',
    address: 'पता',
    totalCollected: 'कुल संग्रहीत',
    avgQuality: 'औसत गुणवत्ता',
    lastCheckup: 'अंतिम जांच',
    nextCheckup: 'अगली जांच',
    kg: 'किलो',
    years: 'वर्ष',
    never: 'कभी नहीं',
    editCattle: 'पशु संपादित करें',
    deleteCattle: 'पशु हटाएं',
    confirmDelete: 'क्या आप वाकई इस पशु रिकॉर्ड को हटाना चाहते हैं?',
    yes: 'हाँ',
    no: 'नहीं'
  }
};

interface Props {
  languageContext: LanguageContextType;
}

export default function CattleManagement({ languageContext }: Props) {
  const { language } = languageContext;
  const navigate = useNavigate();
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [filteredCattle, setFilteredCattle] = useState<Cattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [filter, setFilter] = useState<CattleFilter>({
    search: '',
    health: '',
    breed: '',
    owner: '',
    status: '',
    isActive: null,
    gaushalaId: undefined // No default filter - show all cattle
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  useEffect(() => {
    loadCattleData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cattle, filter]);

  const loadCattleData = async () => {
    try {
      setLoading(true);

      // Fetch cattle data from API
      const response = await gauShalaApi.cattle.getAllCattle();

      if (response.success && response.data) {
        setCattle(response.data);
      } else {
        console.error('Failed to fetch cattle data:', response.error);
      }
    } catch (error) {
      console.error('Error loading cattle data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cattle];

    // Search filter
    if (filter.search) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        c.rfidTag.toLowerCase().includes(filter.search.toLowerCase()) ||
        c.owner.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    // Health filter
    if (filter.health) {
      filtered = filtered.filter(c => c.health === filter.health);
    }

    // Breed filter
    if (filter.breed) {
      filtered = filtered.filter(c => c.breed === filter.breed);
    }

    // Owner filter
    if (filter.owner) {
      filtered = filtered.filter(c => c.owner === filter.owner);
    }

    // Status filter (IN/OUT/UNKNOWN)
    if (filter.status) {
      filtered = filtered.filter(c => c.currentStatus === filter.status);
    }

    // Active status filter
    if (filter.isActive !== null) {
      filtered = filtered.filter(c => c.isActive === filter.isActive);
    }

    // Gaushala filter - only show cattle belonging to specific gaushala
    if (filter.gaushalaId) {
      // For now, we'll filter by ownerId (assuming ownerId represents gaushala membership)
      // This can be enhanced later with proper gaushala-cattle relationship data
      filtered = filtered.filter(c => c.ownerId === filter.gaushalaId);
    }

    setFilteredCattle(filtered);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'recovering':
        return 'bg-yellow-100 text-yellow-800';
      case 'vaccination_due':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN':
        return 'bg-green-100 text-green-800';
      case 'OUT':
        return 'bg-orange-100 text-orange-800';
      case 'UNKNOWN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN');
  };

  const handleView = (cattle: Cattle) => {
    setSelectedCattle(cattle);
    setShowViewModal(true);
  };

  const handleEdit = (cattle: Cattle) => {
    setSelectedCattle(cattle);
    // Initialize edit form with current cattle data
    setEditFormData({
      name: cattle.name,
      rfidTag: cattle.rfidTag,
      breed: cattle.breed.toLowerCase(), // Convert to lowercase to match breed options
      age: (cattle.age * 12).toString(), // Convert years to months for form input
      weight: cattle.weight.toString(),
      health: cattle.health,
      owner: cattle.owner,
      ownerId: cattle.ownerId,
      location: {
        latitude: cattle.location.latitude.toString(),
        longitude: cattle.location.longitude.toString(),
        address: cattle.location.address || ''
      }
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (field: string, value: string) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1];
      setEditFormData((prev: any) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setEditFormData((prev: any) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedCattle) return;

    setIsUpdating(true);
    try {
      // Prepare update data in the format expected by the API
      const updateData = {
        ...editFormData,
        age: parseInt(editFormData.age),
        weight: parseFloat(editFormData.weight),
        location: {
          latitude: parseFloat(editFormData.location.latitude),
          longitude: parseFloat(editFormData.location.longitude),
          address: editFormData.location.address,
          timestamp: Date.now()
        }
      };

      const response = await gauShalaApi.cattle.updateCattle(selectedCattle.id, updateData);

      if (response.success) {
        // Update the cattle in the local state
        setCattle(prevCattle =>
          prevCattle.map(c =>
            c.id === selectedCattle.id
              ? { ...c, ...updateData, updatedAt: Date.now() }
              : c
          )
        );
        setShowEditModal(false);
        setSelectedCattle(null);
        setEditFormData({});
        alert('Cattle updated successfully!');
      } else {
        alert('Failed to update cattle: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to update cattle:', error);
      alert('Failed to update cattle. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (cattle: Cattle) => {
    if (confirm(t('confirmDelete'))) {
      try {
        const response = await gauShalaApi.cattle.deleteCattle(cattle.id);

        if (response.success) {
          setCattle(prev => prev.filter(c => c.id !== cattle.id));
        } else {
          console.error('Failed to delete cattle:', response.error);
          alert('Failed to delete cattle. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting cattle:', error);
        alert('Error deleting cattle. Please try again.');
      }
    }
  };

  const handleRecordTransaction = (cattle: Cattle) => {
    setSelectedCattle(cattle);
    setShowTransactionModal(true);
  };

  const handleViewHistory = (cattle: Cattle) => {
    setSelectedCattle(cattle);
    setShowHistoryModal(true);
  };

  const handleTransactionSuccess = (transaction: any) => {
    // Update cattle data with latest collection info
    setCattle(prevCattle =>
      prevCattle.map(c =>
        c.id === selectedCattle?.id
          ? {
              ...c,
              totalDungCollected: c.totalDungCollected + parseFloat(transaction.weightKg || '0'),
              lastDungCollection: Date.now()
            }
          : c
      )
    );

    console.log('Transaction recorded successfully:', transaction);
  };


  const handleScanRFID = async () => {
    try {
      const response = await gauShalaApi.cattle.scanRfid();

      if (response.success && response.data) {
        const { rfidTag, cattleInfo } = response.data;
        if (cattleInfo) {
          alert(`RFID Scanned: ${rfidTag}\nCattle Found: ${cattleInfo.name}`);
        } else {
          alert(`RFID Scanned: ${rfidTag}\nNo cattle found with this tag.`);
        }
      } else {
        console.error('Failed to scan RFID:', response.error);
        alert('Failed to scan RFID. Please try again.');
      }
    } catch (error) {
      console.error('Error scanning RFID:', error);
      alert('Error scanning RFID. Please try again.');
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
          onClick={() => navigate('/gaushala/cattle/add')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('addCattle')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

          {/* Health Filter */}
          <select
            value={filter.health}
            onChange={(e) => setFilter(prev => ({ ...prev, health: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('allHealth')}</option>
            <option value="healthy">{t('healthy')}</option>
            <option value="sick">{t('sick')}</option>
            <option value="recovering">{t('recovering')}</option>
            <option value="vaccination_due">{t('vaccinationDue')}</option>
          </select>

          {/* Breed Filter */}
          <select
            value={filter.breed}
            onChange={(e) => setFilter(prev => ({ ...prev, breed: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('allBreeds')}</option>
            <option value="गिर">गिर</option>
            <option value="सिंधी">सिंधी</option>
            <option value="होल्स्टीन">होल्स्टीन</option>
            <option value="जर्सी">जर्सी</option>
          </select>

          {/* RFID Scan Button */}
          <button
            onClick={handleScanRFID}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Scan className="h-4 w-4" />
            {t('scanRFID')}
          </button>
        </div>
      </div>

      {/* Cattle Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('rfidTag')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('breed')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('age')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('weight')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('health')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('owner')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('lastCollection')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCattle.map((cattle) => (
                <tr key={cattle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Beef className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{cattle.name}</div>
                        <div className="text-sm text-gray-500">ID: {cattle.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm font-mono text-gray-900">{cattle.rfidTag || cattle.tagId || cattle.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cattle.breed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cattle.age} {t('years')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cattle.weight} {t('kg')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthColor(cattle.health)}`}>
                      {t(cattle.health)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cattle.owner}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cattle.lastDungCollection ? formatDate(cattle.lastDungCollection) : t('never')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(cattle)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title={t('view')}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(cattle)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title={t('edit')}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRecordTransaction(cattle)}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                        title={t('recordTransaction')}
                      >
                        <Scale className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewHistory(cattle)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title={t('viewHistory')}
                      >
                        <History className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cattle)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title={t('delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCattle.length === 0 && (
          <div className="text-center py-12">
            <Beef className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No cattle found matching your filters</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedCattle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">{t('cattleDetails')} - {selectedCattle.name}</h3>
              <button
                onClick={() => setShowViewModal(false)}
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
                    <span className="text-gray-600">{t('name')}:</span>
                    <span className="font-medium">{selectedCattle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('rfidTag')}:</span>
                    <span className="font-mono font-medium">{selectedCattle.rfidTag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('breed')}:</span>
                    <span className="font-medium">{selectedCattle.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('age')}:</span>
                    <span className="font-medium">{selectedCattle.age} {t('years')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('weight')}:</span>
                    <span className="font-medium">{selectedCattle.weight} {t('kg')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('health')}:</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getHealthColor(selectedCattle.health)}`}>
                      {t(selectedCattle.health)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('owner')}:</span>
                    <span className="font-medium">{selectedCattle.owner}</span>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">{t('locationInfo')}</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('latitude')}:</span>
                    <span className="font-medium">{selectedCattle.location.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('longitude')}:</span>
                    <span className="font-medium">{selectedCattle.location.longitude.toFixed(6)}</span>
                  </div>
                  {selectedCattle.location.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('address')}:</span>
                      <span className="font-medium text-right">{selectedCattle.location.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Collection Statistics */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">{t('collectionStats')}</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('totalCollected')}:</span>
                    <span className="font-medium">{selectedCattle.totalDungCollected} {t('kg')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('lastCollection')}:</span>
                    <span className="font-medium">
                      {selectedCattle.lastDungCollection ? formatDate(selectedCattle.lastDungCollection) : t('never')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">{t('medicalHistory')}</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {selectedCattle.medicalHistory.map((record) => (
                    <div key={record.id} className="border-l-4 border-blue-500 pl-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{record.description}</p>
                          <p className="text-sm text-gray-600">{record.veterinarian}</p>
                          {record.medication && (
                            <p className="text-xs text-gray-500">{record.medication}</p>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(record.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Edit Cattle Modal */}
      {showEditModal && selectedCattle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">{t('editCattle')} - {selectedCattle.name}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cattle Name *
                    </label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => handleEditInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RFID Tag *
                    </label>
                    <input
                      type="text"
                      value={editFormData.rfidTag || ''}
                      onChange={(e) => handleEditInputChange('rfidTag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Breed *
                    </label>
                    <select
                      value={editFormData.breed || ''}
                      onChange={(e) => handleEditInputChange('breed', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Breed</option>
                      <option value="gir">Gir</option>
                      <option value="sahiwal">Sahiwal</option>
                      <option value="sindhi">Red Sindhi</option>
                      <option value="tharparkar">Tharparkar</option>
                      <option value="holstein">Holstein Friesian</option>
                      <option value="jersey">Jersey</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Health Status
                    </label>
                    <select
                      value={editFormData.health || ''}
                      onChange={(e) => handleEditInputChange('health', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="healthy">Healthy</option>
                      <option value="sick">Sick</option>
                      <option value="recovering">Recovering</option>
                      <option value="vaccination_due">Vaccination Due</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age (months)
                    </label>
                    <input
                      type="number"
                      value={editFormData.age || ''}
                      onChange={(e) => handleEditInputChange('age', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={editFormData.weight || ''}
                      onChange={(e) => handleEditInputChange('weight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Owner Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      value={editFormData.owner || ''}
                      onChange={(e) => handleEditInputChange('owner', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner ID/Phone
                    </label>
                    <input
                      type="text"
                      value={editFormData.ownerId || ''}
                      onChange={(e) => handleEditInputChange('ownerId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Location Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editFormData.location?.address || ''}
                      onChange={(e) => handleEditInputChange('location.address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      value={editFormData.location?.latitude || ''}
                      onChange={(e) => handleEditInputChange('location.latitude', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="any"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      value={editFormData.location?.longitude || ''}
                      onChange={(e) => handleEditInputChange('location.longitude', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="any"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditFormData({});
                  }}
                  disabled={isUpdating}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isUpdating || !editFormData.name || !editFormData.rfidTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isUpdating ? 'Updating...' : 'Update Cattle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cow Dung Transaction Modal */}
      {showTransactionModal && selectedCattle && (
        <CowDungTransaction
          cattle={selectedCattle}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedCattle(null);
          }}
          onSuccess={handleTransactionSuccess}
        />
      )}

      {/* Transaction History Modal */}
      {showHistoryModal && selectedCattle && (
        <TransactionHistory
          farmerId={selectedCattle.ownerId}
          farmerName={selectedCattle.owner}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedCattle(null);
          }}
        />
      )}
    </div>
  );
}