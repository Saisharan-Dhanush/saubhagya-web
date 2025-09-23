/**
 * View Food History Page - Display detailed view of a specific food history record
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Edit, Trash2 } from 'lucide-react';

interface FoodHistoryRecord {
  id: number;
  foodName: string;
  batchName: string;
  type: string;
  shedNo: string;
  consumeQuantity: number;
  duration: string;
  date: string;
  comments?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock data for demonstration
const mockData: FoodHistoryRecord[] = [
  {
    id: 1,
    foodName: 'Unprocessed Food',
    batchName: 'Batch-07',
    type: 'Organic Feed',
    shedNo: 'Shed_1',
    consumeQuantity: 34,
    duration: 'morning',
    date: 'Apr 26, 2025',
    comments: 'High quality organic food given to cattle in shed 1 during morning hours. All cattle responded well to this feed. No adverse reactions observed.',
    version: '1.2',
    createdAt: 'Apr 26, 2025 08:30 AM',
    updatedAt: 'Apr 26, 2025 08:30 AM'
  },
  {
    id: 2,
    foodName: 'Dry grass',
    batchName: 'Batch-03',
    type: 'Natural Hay',
    shedNo: 'Shed_2',
    consumeQuantity: 12,
    duration: '1st half',
    date: 'Mar 30, 2025',
    comments: 'Natural dry grass distributed to multiple cattle. Quality was good and cattle consumed it well.',
    version: '1.0',
    createdAt: 'Mar 30, 2025 10:15 AM',
    updatedAt: 'Mar 30, 2025 10:15 AM'
  },
  {
    id: 3,
    foodName: 'Dry grass',
    batchName: 'Batch-03',
    type: 'Natural Hay',
    shedNo: 'Shed_3',
    consumeQuantity: 12,
    duration: 'Last Half of the day',
    date: 'Mar 02, 2025',
    comments: 'Evening feeding session with dry grass. Cattle were satisfied and consumed the entire portion.',
    version: '1.1',
    createdAt: 'Mar 02, 2025 06:45 PM',
    updatedAt: 'Mar 02, 2025 06:45 PM'
  }
];

export default function ViewFoodHistory() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<FoodHistoryRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const foundRecord = mockData.find(item => item.id === parseInt(id || '0'));
        setRecord(foundRecord || null);
      } catch (error) {
        console.error('Error fetching food history record:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/gaushala/food-history/edit/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this food history record?')) {
      // TODO: Implement delete API call
      console.log('Deleting food history record:', id);
      navigate('/gaushala/food-history');
    }
  };

  const handleBack = () => {
    navigate('/gaushala/food-history');
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
            <h1 className="text-2xl font-bold text-gray-900">Food History Not Found</h1>
            <p className="text-gray-600 mt-1">The requested food history record could not be found.</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Food History
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food History Details</h1>
          <p className="text-gray-600 mt-1">View food history record #{record.id}</p>
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
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            Food History Information
          </h2>
        </div>

        <div className="p-6">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              📋 Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Food Name" value={record.foodName} />
              <DetailField label="Batch Name" value={record.batchName} />
              <DetailField label="Food Type" value={record.type || 'Not specified'} />
            </div>
          </div>

          {/* Location & Distribution Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              🏠 Location & Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Shed Number" value={record.shedNo || 'Multiple/Not specified'} />
              <DetailField label="Consume Quantity" value={`${record.consumeQuantity} kg`} />
              <DetailField label="Duration" value={record.duration} />
            </div>
          </div>

          {/* Date & Timeline Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              📅 Timeline Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Feeding Date</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {record.date}
                </div>
              </div>
              {record.createdAt && (
                <DetailField label="Record Created" value={record.createdAt} />
              )}
              {record.updatedAt && (
                <DetailField label="Last Updated" value={record.updatedAt} />
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              ℹ️ Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailField label="Version" value={record.version || 'Not specified'} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Record Status</label>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-900 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {record.comments && (
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                💬 Comments & Notes
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