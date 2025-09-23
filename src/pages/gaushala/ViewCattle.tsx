/**
 * View Cattle Page - Display detailed view of a specific cattle record
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Edit,
  Trash2,
  User,
  Home,
  Ruler,
  Baby,
  Globe,
  Settings,
  Activity,
  Scan
} from 'lucide-react';
import { gauShalaApi, Cattle } from '../../services/gaushala/api';

interface CattleRecord {
  id: string;
  // Basic Identification
  uniqueAnimalId: string;
  name: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  colorMarkings: string;

  // Gaushala Assignment
  gaushala: string;

  // Health & Medical Records
  vaccinationStatus: string;
  disability: string;
  veterinarianName: string;
  veterinarianContact: string;

  // Physical Characteristics
  weight: number;
  height: number;
  hornStatus: string;
  rfidTagNumber: string;
  earTagNumber: string;
  microchipNumber: string;

  // Reproductive Details
  reproductiveStatus: string;
  lastCalvingDate: string;
  pregnancyStatus: string;
  breedingHistory: string;

  // Origin & Ownership
  sourceLocation: string;
  previousOwner: string;
  acquisitionDate: string;
  ownershipStatus: string;

  // Shelter & Feeding
  shedNumber: string;
  typeOfFeed: string;
  feedingSchedule: string;

  // Supporting Documents
  photoUrl?: string;
  healthCertificate?: string;
  purchaseDocument?: string;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

// Mock data for demonstration - create multiple records to handle any ID
const createMockRecord = (id: string, name: string, breed: string): CattleRecord => ({
  id,
  uniqueAnimalId: `COW-2025-${id.padStart(3, '0')}`,
  name,
  breed,
  gender: 'Female',
  dateOfBirth: '2022-03-15',
  age: 35,
  colorMarkings: 'Light brown with white patches on forehead',
  gaushala: 'main_gaushala',
  vaccinationStatus: 'FMD, HS, BQ completed',
  disability: 'None',
  veterinarianName: 'Dr. Rajesh Kumar',
  veterinarianContact: '+91-9876543210',
  weight: 450,
  height: 140,
  hornStatus: 'horned',
  rfidTagNumber: `RFID-${id}2345`,
  earTagNumber: `EAR-${id.padStart(3, '0')}`,
  microchipNumber: `MC-${id}2345`,
  reproductiveStatus: 'Breeding',
  lastCalvingDate: '2024-08-15',
  pregnancyStatus: 'Not Pregnant',
  breedingHistory: 'Delivered 3 healthy calves',
  sourceLocation: 'Ahmedabad, Gujarat',
  previousOwner: 'Ramesh Patel',
  acquisitionDate: '2022-04-01',
  ownershipStatus: 'owned',
  shedNumber: `Shed-A${id}`,
  typeOfFeed: 'grass',
  feedingSchedule: 'Morning: 10kg fodder, Evening: 8kg concentrate',
  photoUrl: `/images/cattle/cow-${id.padStart(3, '0')}.jpg`,
  healthCertificate: `health-cert-${id.padStart(3, '0')}.pdf`,
  purchaseDocument: `purchase-doc-${id.padStart(3, '0')}.pdf`,
  createdAt: 'Apr 01, 2022 10:30 AM',
  updatedAt: 'Dec 15, 2024 02:45 PM',
  status: 'Active'
});

const mockData: CattleRecord[] = [
  createMockRecord('1', 'Ganga', 'Gir'),
  createMockRecord('2', 'Yamuna', 'Holstein'),
  createMockRecord('3', 'Saraswati', 'Jersey'),
  createMockRecord('4', 'Kamdhenu', 'Sahiwal'),
  createMockRecord('5', 'Nandi', 'Red Sindhi')
];

export default function ViewCattle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<CattleRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        // For now, use mock data until API is ready
        // TODO: Replace with actual API call when ready
        // const response = await gauShalaApi.cattle.getCattleList();
        // if (response.success && response.data) {
        //   const foundRecord = response.data.find((cattle: Cattle) => cattle.id === id);
        //   setRecord(foundRecord || null);
        // }

        // Use mock data for now
        console.log('Looking for cattle with ID:', id);
        console.log('Available mock data IDs:', mockData.map(c => c.id));

        let foundRecord = mockData.find(cattle => cattle.id === id);

        // If not found, create a dynamic record for any ID
        if (!foundRecord && id) {
          console.log('Creating dynamic record for ID:', id);
          foundRecord = createMockRecord(id, `Cattle ${id}`, 'Mixed Breed');
        }

        setRecord(foundRecord || null);
      } catch (error) {
        console.error('Error fetching cattle record:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/gaushala/cattle/edit/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this cattle record?')) {
      // TODO: Implement delete API call
      console.log('Deleting cattle record:', id);
      navigate('/gaushala/cattle');
    }
  };

  const handleBack = () => {
    navigate('/gaushala/cattle');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cattle Not Found</h1>
            <p className="text-gray-600 mt-1">The requested cattle record could not be found.</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cattle List
          </button>
        </div>
      </div>
    );
  }

  const DetailField = ({ label, value, className = '' }: { label: string; value: string | number; className?: string }) => (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <div className="text-gray-900 font-medium">{value || '-'}</div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'sick':
        return 'bg-red-500';
      case 'recovering':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'bg-green-500';
      case 'sick':
        return 'bg-red-500';
      case 'recovering':
        return 'bg-yellow-500';
      case 'vaccination_due':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return `${ageInMonths} months (${Math.floor(ageInMonths / 12)} years)`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cattle Details</h1>
          <p className="text-gray-600 mt-1">{record.name} - {record.uniqueAnimalId}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            Cattle Information
          </h2>
        </div>

        <div className="p-6">
          {/* Basic Identification Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              🐄 Basic Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Unique Animal ID" value={record.uniqueAnimalId} />
              <DetailField label="Name" value={record.name} />
              <DetailField label="Breed" value={record.breed} />
              <DetailField label="Gender" value={record.gender} />
              <DetailField label="Date of Birth" value={record.dateOfBirth} />
              <DetailField label="Age" value={`${record.age} months`} />
              <DetailField label="Color & Markings" value={record.colorMarkings} className="md:col-span-2 lg:col-span-3" />
            </div>
          </div>

          {/* Gaushala Assignment Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Home className="h-5 w-5 text-green-600" />
              🏠 Gaushala Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Assigned Gaushala" value={record.gaushala.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Status</label>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${getStatusColor(record.status || 'Active')} rounded-full`}></div>
                  <span className="text-gray-900 font-medium">{record.status || 'Active'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Characteristics Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Ruler className="h-5 w-5 text-purple-600" />
              📏 Physical Characteristics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Weight" value={`${record.weight} kg`} />
              <DetailField label="Height" value={`${record.height} cm`} />
              <DetailField label="Horn Status" value={record.hornStatus.replace(/\b\w/g, l => l.toUpperCase())} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">RFID Tag Number</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium font-mono bg-gray-50 p-2 rounded">
                  <Scan className="h-4 w-4 text-gray-400" />
                  {record.rfidTagNumber}
                </div>
              </div>
              <DetailField label="Ear Tag Number" value={record.earTagNumber} />
              <DetailField label="Microchip Number" value={record.microchipNumber} />
            </div>
          </div>

          {/* Health & Medical Records Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              🩺 Health & Medical Records
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Vaccination Status" value={record.vaccinationStatus} className="md:col-span-2 lg:col-span-3" />
              <DetailField label="Disability/Injury" value={record.disability || 'None'} />
              <DetailField label="Veterinarian Name" value={record.veterinarianName} />
              <DetailField label="Veterinarian Contact" value={record.veterinarianContact} />
            </div>
          </div>

          {/* Reproductive Details Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Baby className="h-5 w-5 text-pink-600" />
              🤱 Reproductive Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DetailField label="Reproductive Status" value={record.reproductiveStatus} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Last Calving Date</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {record.lastCalvingDate}
                </div>
              </div>
              <DetailField label="Pregnancy Status" value={record.pregnancyStatus} />
              <DetailField label="Breeding History" value={record.breedingHistory} />
            </div>
          </div>

          {/* Origin & Ownership Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-600" />
              🌍 Origin & Ownership
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DetailField label="Source Location" value={record.sourceLocation} />
              <DetailField label="Previous Owner" value={record.previousOwner} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Acquisition Date</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {record.acquisitionDate}
                </div>
              </div>
              <DetailField label="Ownership Status" value={record.ownershipStatus.replace(/\b\w/g, l => l.toUpperCase())} />
            </div>
          </div>

          {/* Shelter & Feeding Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Settings className="h-5 w-5 text-amber-600" />
              🏠 Shelter & Feeding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Shed Number" value={record.shedNumber} />
              <DetailField label="Type of Feed" value={record.typeOfFeed.replace(/\b\w/g, l => l.toUpperCase())} />
              <DetailField label="Feeding Schedule" value={record.feedingSchedule} className="md:col-span-2 lg:col-span-3" />
            </div>
          </div>

          {/* Record Information Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              ℹ️ Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {record.createdAt && (
                <DetailField label="Record Created" value={record.createdAt} />
              )}
              {record.updatedAt && (
                <DetailField label="Last Updated" value={record.updatedAt} />
              )}
              <DetailField label="Record ID" value={record.id} />
            </div>
          </div>

          {/* Supporting Documents Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              📄 Supporting Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Cattle Photo</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-32 flex items-center justify-center">
                  {record.photoUrl ? (
                    <img src={record.photoUrl} alt="Cattle Photo" className="max-h-full max-w-full object-cover rounded" />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      No photo available
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Health Certificate</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-32 flex items-center justify-center">
                  {record.healthCertificate ? (
                    <a href={record.healthCertificate} className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      View Certificate
                    </a>
                  ) : (
                    <div className="text-gray-400 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      No certificate available
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Purchase Document</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-32 flex items-center justify-center">
                  {record.purchaseDocument ? (
                    <a href={record.purchaseDocument} className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      View Document
                    </a>
                  ) : (
                    <div className="text-gray-400 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      No document available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </button>
      </div>
    </div>
  );
}