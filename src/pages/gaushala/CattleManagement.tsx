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
  Circle,
  Scale,
  History,
  Clock,
  LogIn,
  LogOut
} from 'lucide-react';
import {
  cattleApi,
  masterDataApi,
  calculateAgeFromDob,
  type Cattle,
  type Breed,
  type Species,
  type Gender,
  type Color,
  type Location as GaushalaLocation
} from '../../services/gaushala/api';
import { getLoggedInUserGaushalaId, getCurrentUserContext } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import CowDungTransaction from '../../components/gaushala/CowDungTransaction';
import TransactionHistory from '../../components/gaushala/TransactionHistory';

interface LanguageContextType {
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  t: (key: string) => string;
}

// Legacy interface for backwards compatibility with transaction components
interface CattleLegacy {
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

interface AttendanceLog {
  id: string;
  cattleId: string;
  timestamp: number;
  type: 'IN' | 'OUT';
  location?: string;
  rfidScanned?: boolean;
}

interface DailyAttendance {
  date: string;
  firstIn?: AttendanceLog;
  lastOut?: AttendanceLog;
  totalLogs: AttendanceLog[];
}

interface AttendanceHistory {
  cattleId: string;
  days: DailyAttendance[];
  selectedDate: string;
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
    no: 'No',
    attendance: 'Attendance',
    viewAttendance: 'View Attendance',
    attendanceLogs: 'Attendance Logs',
    dailyAttendance: 'Daily Attendance',
    firstIn: 'First In',
    lastOut: 'Last Out',
    totalEntries: 'Total Entries',
    viewLogs: 'View Logs',
    timeIn: 'Time In',
    timeOut: 'Time Out',
    noAttendanceData: 'No attendance data available',
    today: 'Today',
    close: 'Close',
    selectDate: 'Select Date',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    attendanceHistory: 'Attendance History',
    noDataForDate: 'No attendance data for this date',
    present: 'Present',
    absent: 'Absent',
    dayView: 'Day View'
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
    no: 'नहीं',
    attendance: 'उपस्थिति',
    viewAttendance: 'उपस्थिति देखें',
    attendanceLogs: 'उपस्थिति लॉग',
    dailyAttendance: 'दैनिक उपस्थिति',
    firstIn: 'पहली प्रविष्टि',
    lastOut: 'अंतिम निकास',
    totalEntries: 'कुल प्रविष्टियां',
    viewLogs: 'लॉग देखें',
    timeIn: 'प्रवेश समय',
    timeOut: 'निकास समय',
    noAttendanceData: 'कोई उपस्थिति डेटा उपलब्ध नहीं',
    today: 'आज',
    close: 'बंद करें',
    selectDate: 'तारीख चुनें',
    last7Days: 'पिछले 7 दिन',
    last30Days: 'पिछले 30 दिन',
    attendanceHistory: 'उपस्थिति इतिहास',
    noDataForDate: 'इस तारीख के लिए कोई उपस्थिति डेटा नहीं',
    present: 'उपस्थित',
    absent: 'अनुपस्थित',
    dayView: 'दिन दृश्य'
  }
};

interface Props {
  languageContext: LanguageContextType;
}

export default function CattleManagement({ languageContext }: Props) {
  const { language } = languageContext;
  const navigate = useNavigate();

  // User context
  const userContext = getCurrentUserContext();
  const userGaushalaId = getLoggedInUserGaushalaId();

  // State management
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [filteredCattle, setFilteredCattle] = useState<Cattle[]>([]);
  const [loading, setLoading] = useState(true);

  // Master data state
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [locations, setLocations] = useState<GaushalaLocation[]>([]);

  // Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAttendanceLogsModal, setShowAttendanceLogsModal] = useState(false);
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistory | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [logsCurrentPage, setLogsCurrentPage] = useState(1);
  const [logsSearchTerm, setLogsSearchTerm] = useState('');
  const logsPerPage = 8;
  const [editFormData, setEditFormData] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter state
  const [filter, setFilter] = useState<CattleFilter>({
    search: '',
    health: '',
    breed: '',
    owner: '',
    status: '',
    isActive: null,
    gaushalaId: undefined
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Load cattle data and master data on component mount
  useEffect(() => {
    loadCattleData();
    loadMasterData();
  }, []);

  // Apply filters whenever cattle or filter state changes
  useEffect(() => {
    applyFilters();
  }, [cattle, filter]);

  /**
   * Load all cattle from Gaushala Service
   * Automatically filters by user's gaushalaId if available
   */
  const loadCattleData = async () => {
    try {
      setLoading(true);

      // Fetch cattle from Gaushala Service (port 8086)
      const response = await cattleApi.getAllCattle(0, 10000);

      if (response.success && response.data) {
        const allCattle = response.data.content || [];

        // Filter by logged-in user's gaushala if gaushalaId is available
        const ownedCattle = userGaushalaId
          ? allCattle.filter(c => c.gaushalaId === userGaushalaId)
          : allCattle;

        console.log(`Loaded ${ownedCattle.length} cattle records`);
        setCattle(ownedCattle);
      } else {
        console.error('Failed to fetch cattle data:', response.error);
        setCattle([]);
      }
    } catch (error) {
      console.error('Error loading cattle data:', error);
      setCattle([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load master data for displaying breed/species/gender/color names
   */
  const loadMasterData = async () => {
    try {
      const [breedsRes, speciesRes, gendersRes, colorsRes, locationsRes] = await Promise.all([
        masterDataApi.getAllBreeds(),
        masterDataApi.getAllSpecies(),
        masterDataApi.getAllGenders(),
        masterDataApi.getAllColors(),
        masterDataApi.getAllLocations(),
      ]);

      if (breedsRes.success && breedsRes.data) setBreeds(breedsRes.data);
      if (speciesRes.success && speciesRes.data) setSpecies(speciesRes.data);
      if (gendersRes.success && gendersRes.data) setGenders(gendersRes.data);
      if (colorsRes.success && colorsRes.data) setColors(colorsRes.data);
      if (locationsRes.success && locationsRes.data) setLocations(locationsRes.data);
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  /**
   * Helper functions to get master data names by ID
   */
  const getBreedName = (breedId: number): string => {
    const breed = breeds.find(b => b.id === breedId);
    return breed?.name || `Breed #${breedId}`;
  };

  const getSpeciesName = (speciesId: number): string => {
    const sp = species.find(s => s.id === speciesId);
    return sp?.name || `Species #${speciesId}`;
  };

  const getGenderName = (genderId: number): string => {
    const gender = genders.find(g => g.id === genderId);
    return gender?.name || `Gender #${genderId}`;
  };

  const getColorName = (colorId: number): string => {
    const color = colors.find(c => c.id === colorId);
    return color?.name || `Color #${colorId}`;
  };

  const getGaushalaName = (gaushalaId: number): string => {
    const location = locations.find(l => l.id === gaushalaId);
    return location?.name || `Gaushala #${gaushalaId}`;
  };

  /**
   * Apply all active filters to cattle list
   * Works with new Cattle interface using IDs for breeds, species, etc.
   */
  const applyFilters = () => {
    let filtered = [...cattle];

    // Search filter - search by name, RFID tag, or unique animal ID
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        (c.rfidTagNo && c.rfidTagNo.toLowerCase().includes(searchLower)) ||
        c.uniqueAnimalId.toLowerCase().includes(searchLower) ||
        getBreedName(c.breedId).toLowerCase().includes(searchLower)
      );
    }

    // Health status filter
    if (filter.health) {
      filtered = filtered.filter(c => c.healthStatus === filter.health);
    }

    // Breed filter (by breed name)
    if (filter.breed) {
      filtered = filtered.filter(c => getBreedName(c.breedId) === filter.breed);
    }

    // Active status filter
    if (filter.isActive !== null) {
      filtered = filtered.filter(c => c.isActive === filter.isActive);
    }

    // Gaushala filter - already filtered at load time by userGaushalaId
    // Additional gaushalaId filter can be applied if needed
    if (filter.gaushalaId) {
      filtered = filtered.filter(c => c.gaushalaId === parseInt(filter.gaushalaId));
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
    navigate(`/gaushala/cattle/view/${cattle.id}`);
  };

  const handleEdit = (cattle: Cattle) => {
    navigate(`/gaushala/cattle/edit/${cattle.id}`);
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

  // Generate mock attendance data for multiple days
  const generateMockAttendanceHistory = (cattleId: string): AttendanceHistory => {
    const days: DailyAttendance[] = [];
    const today = new Date();

    // Generate data for last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      // Random chance of attendance (85% chance of being present)
      const isPresent = Math.random() > 0.15;

      if (isPresent) {
        const logs: AttendanceLog[] = [];

        // Generate first in time (6-8 AM)
        const firstInTime = new Date(date);
        firstInTime.setHours(6 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

        // Generate last out time (17-19 PM)
        const lastOutTime = new Date(date);
        lastOutTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

        const firstInLog: AttendanceLog = {
          id: `${cattleId}-in-${date.getTime()}-${i}`,
          cattleId,
          timestamp: firstInTime.getTime(),
          type: 'IN',
          location: 'Main Gate',
          rfidScanned: true
        };

        const lastOutLog: AttendanceLog = {
          id: `${cattleId}-out-${date.getTime()}-${i}`,
          cattleId,
          timestamp: lastOutTime.getTime(),
          type: 'OUT',
          location: 'Main Gate',
          rfidScanned: true
        };

        // Generate intermediate logs (2-5 entries)
        const numIntermediateLogs = 2 + Math.floor(Math.random() * 4);
        for (let j = 0; j < numIntermediateLogs; j++) {
          const randomTime = new Date(date);
          randomTime.setHours(9 + j * 2, Math.floor(Math.random() * 60), 0, 0);

          const locations = ['Feeding Area', 'Water Point', 'Milking Shed', 'Rest Area', 'Medical Check'];

          logs.push({
            id: `${cattleId}-${j}-${date.getTime()}-${i}`,
            cattleId,
            timestamp: randomTime.getTime(),
            type: j % 2 === 0 ? 'OUT' : 'IN',
            location: locations[j % locations.length],
            rfidScanned: Math.random() > 0.1 // 90% RFID scan success
          });
        }

        logs.push(firstInLog, lastOutLog);
        logs.sort((a, b) => a.timestamp - b.timestamp);

        days.push({
          date: dateString,
          firstIn: firstInLog,
          lastOut: lastOutLog,
          totalLogs: logs
        });
      } else {
        // Absent day
        days.push({
          date: dateString,
          firstIn: undefined,
          lastOut: undefined,
          totalLogs: []
        });
      }
    }

    return {
      cattleId,
      days: days.reverse(), // Most recent first
      selectedDate: today.toISOString().split('T')[0]
    };
  };

  const handleViewAttendance = async (cattle: Cattle) => {
    setSelectedCattle(cattle);

    // Generate mock data for multiple days - replace with actual API call
    const historyData = generateMockAttendanceHistory(cattle.id);
    setAttendanceHistory(historyData);
    setSelectedDate(historyData.selectedDate);
    setShowAttendanceModal(true);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleViewAttendanceLogs = () => {
    if (attendanceHistory && selectedDate) {
      const dayData = attendanceHistory.days.find(day => day.date === selectedDate);
      if (dayData) {
        setAttendanceLogs(dayData.totalLogs);
        setLogsCurrentPage(1);
        setLogsSearchTerm('');
        setShowAttendanceLogsModal(true);
      }
    }
  };

  const getCurrentDayAttendance = (): DailyAttendance | null => {
    if (attendanceHistory && selectedDate) {
      return attendanceHistory.days.find(day => day.date === selectedDate) || null;
    }
    return null;
  };

  const getFilteredLogs = () => {
    if (!logsSearchTerm.trim()) return attendanceLogs;

    return attendanceLogs.filter(log =>
      log.type.toLowerCase().includes(logsSearchTerm.toLowerCase()) ||
      log.location?.toLowerCase().includes(logsSearchTerm.toLowerCase()) ||
      new Date(log.timestamp).toLocaleTimeString().includes(logsSearchTerm)
    );
  };

  const getPaginatedLogs = () => {
    const filtered = getFilteredLogs();
    const startIndex = (logsCurrentPage - 1) * logsPerPage;
    const endIndex = startIndex + logsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredLogs().length / logsPerPage);
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCattle.map((cattle) => (
                <tr key={cattle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {cattle.photoUrl ? (
                          <img src={cattle.photoUrl} alt={cattle.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <span className="text-2xl">🐄</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{cattle.name}</div>
                        <div className="text-sm text-gray-500">ID: {cattle.uniqueAnimalId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm font-mono text-gray-900">{cattle.rfidTagNo || 'No RFID'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBreedName(cattle.breedId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateAgeFromDob(cattle.dob)} {t('years')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cattle.weight || 'N/A'} {cattle.weight ? t('kg') : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthColor(cattle.healthStatus || 'unknown')}`}>
                      {t(cattle.healthStatus || 'unknown')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getGaushalaName(cattle.gaushalaId)}</td>
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
                        onClick={() => handleViewAttendance(cattle)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title={t('viewAttendance')}
                      >
                        <Clock className="h-4 w-4" />
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
            <span className="text-6xl mx-auto mb-4 block">🐄</span>
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

      {/* Daily Attendance Modal */}
      {showAttendanceModal && selectedCattle && attendanceHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full h-[85vh] flex flex-col shadow-sm border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    {t('attendanceHistory')}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedCattle.name} - {t('last30Days')}</p>
                </div>
                <button
                  onClick={() => {
                    setShowAttendanceModal(false);
                    setSelectedCattle(null);
                    setAttendanceHistory(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Date Selector */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  📅 {t('selectDate')}
                </h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                />
              </div>

              {(() => {
                const currentDay = getCurrentDayAttendance();
                if (!currentDay || currentDay.totalLogs.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📅</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('noDataForDate')}</h3>
                      <p className="text-gray-600 mb-4">{selectedDate === new Date().toISOString().split('T')[0] ? t('today') : new Date(selectedDate).toLocaleDateString()}</p>
                      <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        {t('absent')}
                      </div>
                    </div>
                  );
                }

                return (
                  <>
                    {/* Quick Stats for Selected Date */}
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        📊 {t('dayView')}
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <LogIn className="h-5 w-5 text-green-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">{t('firstIn')}</div>
                          <div className="text-sm font-bold text-gray-900">
                            {currentDay.firstIn ?
                              new Date(currentDay.firstIn.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                              : '--:--'
                            }
                          </div>
                        </div>

                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <LogOut className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">{t('lastOut')}</div>
                          <div className="text-sm font-bold text-gray-900">
                            {currentDay.lastOut ?
                              new Date(currentDay.lastOut.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                              : '--:--'
                            }
                          </div>
                        </div>

                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Activity className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">{t('totalEntries')}</div>
                          <div className="text-sm font-bold text-gray-900">{currentDay.totalLogs.length}</div>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Summary for Selected Date */}
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        📋 {new Date(selectedDate).toLocaleDateString()}
                        {selectedDate === new Date().toISOString().split('T')[0] && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">{t('today')}</span>
                        )}
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-600">{t('firstIn')} Details</label>
                          <div className="text-sm text-gray-900 font-medium">
                            {currentDay.firstIn ?
                              new Date(currentDay.firstIn.timestamp).toLocaleTimeString()
                              : '--'
                            }
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-600">{t('lastOut')} Details</label>
                          <div className="text-sm text-gray-900 font-medium">
                            {currentDay.lastOut ?
                              new Date(currentDay.lastOut.timestamp).toLocaleTimeString()
                              : '--'
                            }
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-600">Status</label>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-900 font-medium">{t('present')}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-600">Duration</label>
                          <div className="text-sm text-gray-900 font-medium">
                            {currentDay.firstIn && currentDay.lastOut ?
                              `${Math.round((currentDay.lastOut.timestamp - currentDay.firstIn.timestamp) / (1000 * 60 * 60))}h`
                              : '--'
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Week View */}
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        📅 {t('last7Days')}
                      </h3>
                      <div className="grid grid-cols-7 gap-2">
                        {attendanceHistory.days.slice(0, 7).map((day, index) => (
                          <div
                            key={day.date}
                            className={`p-3 rounded-lg text-center cursor-pointer transition-colors border ${
                              day.date === selectedDate
                                ? 'bg-blue-100 border-blue-200 text-blue-800'
                                : day.totalLogs.length > 0
                                ? 'bg-white border-green-200 hover:bg-green-50'
                                : 'bg-white border-red-200 hover:bg-red-50'
                            }`}
                            onClick={() => handleDateChange(day.date)}
                          >
                            <div className="text-xs font-medium text-gray-600">
                              {new Date(day.date).toLocaleDateString([], { weekday: 'short' })}
                            </div>
                            <div className="text-sm font-bold text-gray-900">
                              {new Date(day.date).getDate()}
                            </div>
                            <div className="text-xs mt-1">
                              {day.totalLogs.length > 0 ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-red-600">✗</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-start gap-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={handleViewAttendanceLogs}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        {t('viewLogs')} ({currentDay.totalLogs.length})
                      </button>

                      <button
                        onClick={() => {
                          setShowAttendanceModal(false);
                          setSelectedCattle(null);
                          setAttendanceHistory(null);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {t('close')}
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Logs Modal */}
      {showAttendanceLogsModal && attendanceLogs.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full h-[85vh] flex flex-col shadow-sm border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <History className="h-5 w-5 text-blue-600" />
                    </div>
                    {t('attendanceLogs')}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedCattle?.name} - {new Date(selectedDate).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => {
                    setShowAttendanceLogsModal(false);
                    setAttendanceLogs([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Search and Summary */}
              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-600" />
                    Search Logs ({getFilteredLogs().length} entries)
                  </h3>
                  <div className="text-sm text-gray-600">
                    Page {logsCurrentPage} of {getTotalPages()}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Search by location, type, or time..."
                  value={logsSearchTerm}
                  onChange={(e) => {
                    setLogsSearchTerm(e.target.value);
                    setLogsCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {getPaginatedLogs().length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No logs found</h3>
                  <p className="text-gray-500">
                    {logsSearchTerm ? 'Try adjusting your search terms' : 'No attendance logs for this date'}
                  </p>
                  {logsSearchTerm && (
                    <button
                      onClick={() => {
                        setLogsSearchTerm('');
                        setLogsCurrentPage(1);
                      }}
                      className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {getPaginatedLogs().map((log, index) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                        {(logsCurrentPage - 1) * logsPerPage + index + 1}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${log.type === 'IN' ? 'bg-green-100' : 'bg-orange-100'}`}>
                          {log.type === 'IN' ? (
                            <LogIn className="h-4 w-4 text-green-600" />
                          ) : (
                            <LogOut className="h-4 w-4 text-orange-600" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              log.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {log.type}
                            </span>
                            <span className="text-sm text-gray-600">{log.location}</span>
                          </div>
                          {log.rfidScanned && (
                            <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                              <Wifi className="h-3 w-3" />
                              RFID Scanned
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-sm font-medium text-gray-900">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowAttendanceLogsModal(false);
                    setAttendanceLogs([]);
                    setLogsCurrentPage(1);
                    setLogsSearchTerm('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('close')}
                </button>

                {getTotalPages() > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLogsCurrentPage(Math.max(1, logsCurrentPage - 1))}
                      disabled={logsCurrentPage === 1}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, getTotalPages()) }, (_, i) => {
                        let pageNum;
                        if (getTotalPages() <= 5) {
                          pageNum = i + 1;
                        } else if (logsCurrentPage <= 3) {
                          pageNum = i + 1;
                        } else if (logsCurrentPage >= getTotalPages() - 2) {
                          pageNum = getTotalPages() - 4 + i;
                        } else {
                          pageNum = logsCurrentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setLogsCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                              logsCurrentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setLogsCurrentPage(Math.min(getTotalPages(), logsCurrentPage + 1))}
                      disabled={logsCurrentPage === getTotalPages()}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}