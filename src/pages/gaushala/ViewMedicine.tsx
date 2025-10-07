/**
 * View Medicine Page - Display detailed view of a specific medicine record
 * Mapped to backend Medicine.java entity with exact field names
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pill, Edit, Trash2, Calendar, Package, AlertCircle } from 'lucide-react';
import { medicineApi, type Medicine } from '../../services/gaushala/api';

export default function ViewMedicine() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const result = await medicineApi.getMedicineById(parseInt(id));

        if (result.success && result.data) {
          setMedicine(result.data);
        } else {
          setError(result.error || 'Medicine not found');
        }
      } catch (error) {
        console.error('Error fetching medicine:', error);
        setError('Failed to load medicine details');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  const handleEdit = () => {
    navigate(`/gaushala/health-history/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this medicine record?')) {
      return;
    }

    try {
      const result = await medicineApi.deleteMedicine(parseInt(id));

      if (result.success) {
        navigate('/gaushala/health-history');
      } else {
        alert(result.error || 'Failed to delete medicine');
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('Failed to delete medicine');
    }
  };

  const handleBack = () => {
    navigate('/gaushala/health-history');
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

  const formatExpiryDate = (dateString?: string) => {
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

  const isExpired = (dateString?: string): boolean => {
    if (!dateString) return false;
    try {
      const expiryDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return expiryDate < today;
    } catch {
      return false;
    }
  };

  const isExpiringSoon = (dateString?: string): boolean => {
    if (!dateString) return false;
    try {
      const expiryDate = new Date(dateString);
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
    } catch {
      return false;
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
        <div className="text-gray-500">Loading medicine details...</div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medicine Not Found</h1>
            <p className="text-gray-600 mt-1">{error || 'The requested medicine record could not be found.'}</p>
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

  const expired = isExpired(medicine.expiryDate);
  const expiringSoon = isExpiringSoon(medicine.expiryDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Details</h1>
          <p className="text-gray-600 mt-1">{medicine.name}</p>
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

      {/* Expiry Warning */}
      {expired && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Medicine Expired</span>
          </div>
          <p className="text-red-700 text-sm mt-1">This medicine has expired and should not be used.</p>
        </div>
      )}

      {expiringSoon && !expired && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Expiring Soon</span>
          </div>
          <p className="text-amber-700 text-sm mt-1">This medicine will expire within 30 days.</p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Pill className="h-5 w-5 text-blue-600" />
            </div>
            Medicine Information
          </h2>
        </div>

        <div className="p-6">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              📋 Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Medicine Name" value={medicine.name} />
              <DetailField label="Batch Number" value={medicine.batchNumber || '-'} />
              <DetailField label="Manufacturer" value={medicine.manufacturer || '-'} />
              <DetailField label="Dosage" value={medicine.dosage} />
              <DetailField label="Unit" value={medicine.unit} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Stock Quantity</label>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className={`text-gray-900 font-medium ${medicine.quantity < 10 ? 'text-red-600' : ''}`}>
                    {medicine.quantity} {medicine.unit}
                  </span>
                  {medicine.quantity < 10 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Low Stock</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Expiry Information */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              📅 Expiry Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Expiry Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className={`h-4 w-4 ${expired ? 'text-red-400' : expiringSoon ? 'text-amber-400' : 'text-gray-400'}`} />
                  <span className={`font-medium ${expired ? 'text-red-600' : expiringSoon ? 'text-amber-600' : 'text-gray-900'}`}>
                    {formatExpiryDate(medicine.expiryDate)}
                  </span>
                  {expired && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Expired</span>}
                  {expiringSoon && !expired && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Expiring Soon</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Purpose Section */}
          {medicine.purpose && (
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                💊 Purpose & Usage
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-900">{medicine.purpose}</p>
              </div>
            </div>
          )}

          {/* Description Section */}
          {medicine.description && (
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                📝 Description
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 leading-relaxed">{medicine.description}</p>
              </div>
            </div>
          )}

          {/* Record Information Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              ℹ️ Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicine.id && <DetailField label="Medicine ID" value={medicine.id} />}
              {medicine.createdAt && (
                <DetailField label="Record Created" value={formatDate(medicine.createdAt)} />
              )}
              {medicine.updatedAt && (
                <DetailField label="Last Updated" value={formatDate(medicine.updatedAt)} />
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
          Edit Medicine
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
