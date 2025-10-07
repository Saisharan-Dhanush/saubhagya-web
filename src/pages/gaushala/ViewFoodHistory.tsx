/**
 * View Food History Page - Display detailed view of a specific food history record
 * Mapped to backend FoodHistoryDTO with exact field names
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Edit, Trash2 } from 'lucide-react';
import { foodHistoryApi, type FoodHistory } from '../../services/gaushala/api';

export default function ViewFoodHistory() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<FoodHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const result = await foodHistoryApi.getFoodHistoryById(parseInt(id));

        if (result.success && result.data) {
          setRecord(result.data);
        } else {
          setError(result.error || 'Food history record not found');
        }
      } catch (error) {
        console.error('Error fetching food history record:', error);
        setError('Failed to load food history details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleEdit = () => {
    navigate(`/gaushala/food-history/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this food history record?')) {
      return;
    }

    try {
      const result = await foodHistoryApi.deleteFoodHistory(parseInt(id));

      if (result.success) {
        navigate('/gaushala/food-history');
      } else {
        alert(result.error || 'Failed to delete food history record');
      }
    } catch (error) {
      console.error('Error deleting food history record:', error);
      alert('Failed to delete food history record');
    }
  };

  const handleBack = () => {
    navigate('/gaushala/food-history');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatFeedingDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const DetailField = ({ label, value, className = '' }: { label: string; value: string | number; className?: string }) => (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <div className="text-gray-900 font-medium">{value || '-'}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading food history details...</div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Food History Not Found</h1>
            <p className="text-gray-600 mt-1">{error || 'The requested food history record could not be found.'}</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food History Details</h1>
          <p className="text-gray-600 mt-1">Record #{record.id}</p>
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
              <DetailField label="Livestock ID" value={record.livestockId} />
              <DetailField label="Shed ID" value={record.shedId} />
              <DetailField label="Inventory ID" value={record.inventoryId} />
            </div>
          </div>

          {/* Consumption Details Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              🍽️ Consumption Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Consume Quantity (kg)" value={record.consumeQuantity} />
              <DetailField label="Duration" value={record.duration} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Feeding Date</label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatFeedingDate(record.date)}
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

          {/* Record Information Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              ℹ️ Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {record.id && <DetailField label="Record ID" value={record.id} />}
              {record.createdAt && (
                <DetailField label="Record Created" value={formatDate(record.createdAt)} />
              )}
              {record.updatedAt && (
                <DetailField label="Last Updated" value={formatDate(record.updatedAt)} />
              )}
            </div>
          </div>
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
