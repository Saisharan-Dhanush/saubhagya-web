/**
 * Edit Medicine Page - Update existing medicine records
 * Mapped to backend Medicine.java entity with exact field names
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Calendar, Pill } from 'lucide-react';
import { medicineApi, type Medicine } from '../../services/gaushala/api';

interface MedicineFormData {
  name: string;
  description: string;
  dosage: string;
  unit: string;
  quantity: number;
  expiryDate: string;
  manufacturer: string;
  batchNumber: string;
  purpose: string;
}

export default function EditMedicine() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<MedicineFormData>({
    name: '',
    description: '',
    dosage: '',
    unit: 'mg',
    quantity: 0,
    expiryDate: '',
    manufacturer: '',
    batchNumber: '',
    purpose: ''
  });

  const [errors, setErrors] = useState<Partial<MedicineFormData>>({});

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const result = await medicineApi.getMedicineById(parseInt(id));

        if (result.success && result.data) {
          const medicine = result.data;
          // Convert ISO date string to YYYY-MM-DD format for date input
          const dateObj = new Date(medicine.expiryDate);
          const formattedDate = dateObj.toISOString().split('T')[0];

          setFormData({
            name: medicine.name,
            description: medicine.description || '',
            dosage: medicine.dosage,
            unit: medicine.unit,
            quantity: medicine.quantity,
            expiryDate: formattedDate,
            manufacturer: medicine.manufacturer || '',
            batchNumber: medicine.batchNumber || '',
            purpose: medicine.purpose || ''
          });
        } else {
          setMessage({
            type: 'error',
            text: result.error || 'Failed to load medicine record.'
          });
        }
      } catch (error) {
        console.error('Error fetching medicine record:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load medicine record.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  const handleInputChange = (field: keyof MedicineFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MedicineFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Medicine Name is required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry Date is required';

    // Date validation - expiry date should be in the future
    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        newErrors.expiryDate = 'Expiry Date should be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields and fix validation errors.'
      });
      return;
    }

    if (!id) {
      setMessage({
        type: 'error',
        text: 'Invalid medicine ID.'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Convert date to ISO format for backend LocalDateTime
      const medicineData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        description: formData.description || undefined,
        dosage: formData.dosage,
        unit: formData.unit,
        quantity: formData.quantity,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        manufacturer: formData.manufacturer || undefined,
        batchNumber: formData.batchNumber || undefined,
        purpose: formData.purpose || undefined
      };

      const result = await medicineApi.updateMedicine(parseInt(id), medicineData);

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Medicine record updated successfully!'
        });

        // Navigate back after delay
        setTimeout(() => {
          navigate('/gaushala/medicine');
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to update medicine record.'
        });
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update medicine record. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/gaushala/medicine');
  };

  const InputField = ({
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    required = false,
    error,
    className = '',
    ...props
  }: any) => (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <span className="text-red-500">⚠</span>
          {error}
        </div>
      )}
    </div>
  );

  const SelectField = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    options,
    className = ''
  }: any) => (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <span className="text-red-500">⚠</span>
          {error}
        </div>
      )}
    </div>
  );

  const TextAreaField = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    rows = 3,
    className = ''
  }: any) => (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 resize-vertical ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <span className="text-red-500">⚠</span>
          {error}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading medicine record...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Medicine</h1>
          <p className="text-gray-600 mt-1">Update medicine inventory record #{id}</p>
        </div>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-red-500">⚠</span>
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Pill className="h-5 w-5 text-blue-600" />
            </div>
            Edit Medicine Information
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medicine Name */}
            <InputField
              label="Medicine Name"
              value={formData.name}
              onChange={(value: string) => handleInputChange('name', value)}
              placeholder="Enter medicine name"
              required
              error={errors.name}
            />

            {/* Batch Number */}
            <InputField
              label="Batch Number"
              value={formData.batchNumber}
              onChange={(value: string) => handleInputChange('batchNumber', value)}
              placeholder="Enter batch number"
              error={errors.batchNumber}
            />

            {/* Dosage */}
            <InputField
              label="Dosage"
              value={formData.dosage}
              onChange={(value: string) => handleInputChange('dosage', value)}
              placeholder="e.g., 500mg twice daily"
              required
              error={errors.dosage}
            />

            {/* Unit */}
            <SelectField
              label="Unit"
              value={formData.unit}
              onChange={(value: string) => handleInputChange('unit', value)}
              placeholder="Select unit"
              required
              error={errors.unit}
              options={[
                { value: 'mg', label: 'Milligrams (mg)' },
                { value: 'ml', label: 'Milliliters (ml)' },
                { value: 'g', label: 'Grams (g)' },
                { value: 'tablets', label: 'Tablets' },
                { value: 'capsules', label: 'Capsules' },
                { value: 'units', label: 'Units' }
              ]}
            />

            {/* Quantity */}
            <InputField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(value: number) => handleInputChange('quantity', value)}
              placeholder="Enter quantity in stock"
              required
              error={errors.quantity}
              min="0"
            />

            {/* Expiry Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
                    errors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.expiryDate && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <span className="text-red-500">⚠</span>
                  {errors.expiryDate}
                </div>
              )}
            </div>

            {/* Manufacturer */}
            <InputField
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={(value: string) => handleInputChange('manufacturer', value)}
              placeholder="Enter manufacturer name"
              error={errors.manufacturer}
            />

            {/* Purpose */}
            <TextAreaField
              label="Purpose"
              value={formData.purpose}
              onChange={(value: string) => handleInputChange('purpose', value)}
              placeholder="Enter purpose or indication for use"
              className="md:col-span-2"
              rows={2}
            />

            {/* Description */}
            <TextAreaField
              label="Description"
              value={formData.description}
              onChange={(value: string) => handleInputChange('description', value)}
              placeholder="Enter additional details about the medicine"
              className="md:col-span-2"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Updating...' : 'Update Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
