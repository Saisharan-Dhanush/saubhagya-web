/**
 * View Medicine Page - Display detailed view of a specific medicine/health record
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Heart, Edit, Trash2, Clock } from 'lucide-react';

interface MedicineRecord {
  id: number;
  batchName: string;
  shedNo: string;
  startDate: string;
  endDate: string;
  identifyDate: string;
  nextFollowUpDate: string;
  doctor: string;
  regularDose: string;
  specialDose?: string;
  comments?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  treatmentType?: string;
}

// Mock data for demonstration
const mockData: MedicineRecord[] = [
  {
    id: 1,
    batchName: 'Health-Batch-001',
    shedNo: 'Shed_1',
    startDate: 'Apr 20, 2025',
    endDate: 'Apr 30, 2025',
    identifyDate: 'Apr 19, 2025',
    nextFollowUpDate: 'May 05, 2025',
    doctor: 'Dr. Smith',
    regularDose: '10mg twice daily',
    specialDose: 'Additional 5mg if symptoms persist',
    comments: 'Patient showing good response to treatment. Continue current medication regime. Monitor for any adverse reactions.',
    version: '1.0',
    createdAt: 'Apr 20, 2025 09:15 AM',
    updatedAt: 'Apr 20, 2025 09:15 AM',
    status: 'Active',
    treatmentType: 'Antibiotic Therapy'
  },
  {
    id: 2,
    batchName: 'Health-Batch-002',
    shedNo: 'Shed_2',
    startDate: 'Mar 25, 2025',
    endDate: 'Apr 05, 2025',
    identifyDate: 'Mar 24, 2025',
    nextFollowUpDate: 'Apr 10, 2025',
    doctor: 'Dr. Johnson',
    regularDose: '5mg once daily',
    specialDose: '',
    comments: 'Treatment completed successfully. No side effects observed.',
    version: '1.1',
    createdAt: 'Mar 25, 2025 02:30 PM',
    updatedAt: 'Apr 05, 2025 04:45 PM',
    status: 'Completed',
    treatmentType: 'Vitamin Supplement'
  }
];

export default function ViewMedicine() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<MedicineRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const foundRecord = mockData.find(item => item.id === parseInt(id || '0'));
        setRecord(foundRecord || null);
      } catch (error) {
        console.error('Error fetching medicine record:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/gaushala/health-history/edit/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this medicine record?')) {
      // TODO: Implement delete API call
      console.log('Deleting medicine record:', id);
      navigate('/gaushala/health-history');
    }
  };

  const handleBack = () => {
    navigate('/gaushala/health-history');
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
            <h1 className="text-2xl font-bold text-gray-900">Medicine Record Not Found</h1>
            <p className="text-gray-600 mt-1">The requested medicine record could not be found.</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Health History
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
      case 'completed':
        return 'bg-blue-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Record Details</h1>
          <p className="text-gray-600 mt-1">View medicine record #{record.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
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
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            Medicine & Treatment Information
          </h2>
        </div>

        <div className="p-6">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              📋 Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Batch Name" value={record.batchName} />
              <DetailField label="Shed Number" value={record.shedNo} />
              <DetailField label="Treatment Type" value={record.treatmentType || 'General Treatment'} />
              <DetailField label="Doctor" value={record.doctor} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Treatment Status</label>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${getStatusColor(record.status || 'active')} rounded-full`}></div>
                  <span className="text-gray-900 font-medium">{record.status || 'Active'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Timeline Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              📅 Treatment Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Condition Identified</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {record.identifyDate}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Treatment Start</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Calendar className="h-4 w-4 text-green-400" />
                  {record.startDate}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Treatment End</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Calendar className="h-4 w-4 text-red-400" />
                  {record.endDate}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Next Follow-up</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Clock className="h-4 w-4 text-blue-400" />
                  {record.nextFollowUpDate}
                </div>
              </div>
            </div>
          </div>

          {/* Medication Details Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              💊 Medication Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Regular Dose</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-900 font-medium">{record.regularDose}</p>
                </div>
              </div>
              {record.specialDose && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-600">Special Dose Instructions</label>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-900 font-medium">{record.specialDose}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Record Information Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              ℹ️ Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Version" value={record.version || 'Not specified'} />
              {record.createdAt && (
                <DetailField label="Record Created" value={record.createdAt} />
              )}
              {record.updatedAt && (
                <DetailField label="Last Updated" value={record.updatedAt} />
              )}
            </div>
          </div>

          {/* Comments Section */}
          {record.comments && (
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                💬 Treatment Notes & Comments
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 leading-relaxed">{record.comments}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start gap-4">
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Edit className="h-4 w-4" />
          Edit Record
        </button>
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