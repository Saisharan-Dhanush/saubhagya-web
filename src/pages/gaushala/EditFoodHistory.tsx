/**
 * Edit Food History Page - Edit existing food history entries
 * Mapped to backend FoodHistoryDTO with exact field names
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Calendar, FileText } from 'lucide-react';
import { foodHistoryApi, type FoodHistory } from '../../services/gaushala/api';

interface FoodHistoryFormData {
  livestockId: number;
  shedId: number;
  inventoryId: number;
  consumeQuantity: number;
  duration: string;
  date: string;
  comments: string;
}

export default function EditFoodHistory() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // TODO: Fetch these from backend APIs when available
  const [cattle, setCattle] = useState<any[]>([]);
  const [sheds, setSheds] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  const [formData, setFormData] = useState<FoodHistoryFormData>({
    livestockId: 0,
    shedId: 0,
    inventoryId: 0,
    consumeQuantity: 0,
    duration: '',
    date: '',
    comments: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FoodHistoryFormData, string>>>({});

  useEffect(() => {
    // TODO: Fetch cattle, sheds, and inventory from backend
    // For now using mock data
    setCattle([
      { id: 1, name: 'Cow 001 - Ganga' },
      { id: 2, name: 'Cow 002 - Yamuna' },
      { id: 3, name: 'Cow 003 - Saraswati' }
    ]);

    setSheds([
      { id: 1, name: 'Shed 1' },
      { id: 2, name: 'Shed 2' },
      { id: 3, name: 'Shed 3' },
      { id: 4, name: 'Shed 4' },
      { id: 5, name: 'Shed 5' }
    ]);

    setInventory([
      { id: 1, name: 'Green Fodder' },
      { id: 2, name: 'Dry Fodder' },
      { id: 3, name: 'Concentrate Feed' },
      { id: 4, name: 'Mineral Mixture' },
      { id: 5, name: 'Water' }
    ]);
  }, []);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const result = await foodHistoryApi.getFoodHistoryById(parseInt(id));

        if (result.success && result.data) {
          const record = result.data;
          // Convert ISO date string to YYYY-MM-DD format for date input
          const dateObj = new Date(record.date);
          const formattedDate = dateObj.toISOString().split('T')[0];

          setFormData({
            livestockId: record.livestockId,
            shedId: record.shedId,
            inventoryId: record.inventoryId,
            consumeQuantity: record.consumeQuantity,
            duration: record.duration,
            date: formattedDate,
            comments: record.comments || ''
          });
        } else {
          setMessage({
            type: 'error',
            text: result.error || 'Failed to load food history record.'
          });
        }
      } catch (error) {
        console.error('Error fetching food history record:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load food history record.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleInputChange = (field: keyof FoodHistoryFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FoodHistoryFormData, string>> = {};

    if (formData.livestockId === 0) newErrors.livestockId = 'Livestock is required';
    if (formData.shedId === 0) newErrors.shedId = 'Shed is required';
    if (formData.inventoryId === 0) newErrors.inventoryId = 'Food Type is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (formData.consumeQuantity <= 0) newErrors.consumeQuantity = 'Consume Quantity must be greater than 0';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields.'
      });
      return;
    }

    if (!id) {
      setMessage({
        type: 'error',
        text: 'Invalid food history ID.'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Convert date to ISO format for backend LocalDateTime
      const foodHistoryData: Omit<FoodHistory, 'id' | 'createdAt' | 'updatedAt'> = {
        livestockId: formData.livestockId,
        shedId: formData.shedId,
        inventoryId: formData.inventoryId,
        consumeQuantity: formData.consumeQuantity,
        duration: formData.duration,
        date: new Date(formData.date).toISOString(),
        comments: formData.comments || undefined
      };

      const result = await foodHistoryApi.updateFoodHistory(parseInt(id), foodHistoryData);

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Food history entry updated successfully!'
        });

        // Navigate back after delay
        setTimeout(() => {
          navigate('/gaushala/food-history');
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to update food history entry.'
        });
      }
    } catch (error) {
      console.error('Error updating food history:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update food history entry. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/gaushala/food-history');
  };

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
        onChange={(e) => onChange(Number(e.target.value) || e.target.value)}
        className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      >
        <option value={0}>{placeholder}</option>
        {options.map((option: any) => (
          <option key={option.id} value={option.id}>
            {option.name}
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
        <div className="text-gray-500">Loading food history record...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Food History</h1>
          <p className="text-gray-600 mt-1">Update food history record #{id}</p>
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
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            Edit Food History Information
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Livestock */}
            <SelectField
              label="Livestock (Cattle)"
              value={formData.livestockId}
              onChange={(value: number) => handleInputChange('livestockId', value)}
              placeholder="Select cattle"
              required
              error={errors.livestockId}
              options={cattle}
            />

            {/* Shed */}
            <SelectField
              label="Shed"
              value={formData.shedId}
              onChange={(value: number) => handleInputChange('shedId', value)}
              placeholder="Select shed"
              required
              error={errors.shedId}
              options={sheds}
            />

            {/* Food Type (Inventory) */}
            <SelectField
              label="Food Type"
              value={formData.inventoryId}
              onChange={(value: number) => handleInputChange('inventoryId', value)}
              placeholder="Select food type"
              required
              error={errors.inventoryId}
              options={inventory}
            />

            {/* Consume Quantity */}
            <InputField
              label="Consume Quantity (kg)"
              value={formData.consumeQuantity}
              onChange={(value: number) => handleInputChange('consumeQuantity', value)}
              type="number"
              placeholder="Enter quantity"
              required
              error={errors.consumeQuantity}
              min="0"
              step="0.1"
            />

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
                    errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.date && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <span className="text-red-500">⚠</span>
                  {errors.date}
                </div>
              )}
            </div>

            {/* Duration */}
            <SelectField
              label="Duration"
              value={formData.duration}
              onChange={(value: string) => handleInputChange('duration', value)}
              placeholder="Select duration"
              required
              error={errors.duration}
              options={[
                { id: 'morning', name: 'Morning' },
                { id: 'afternoon', name: 'Afternoon' },
                { id: 'evening', name: 'Evening' },
                { id: '1st half', name: '1st Half' },
                { id: 'Last Half of the day', name: 'Last Half of the day' },
                { id: 'full day', name: 'Full Day' }
              ]}
            />

            {/* Comments */}
            <TextAreaField
              label="Comments"
              value={formData.comments}
              onChange={(value: string) => handleInputChange('comments', value)}
              placeholder="Enter any additional comments or notes"
              className="md:col-span-2"
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
              {isLoading ? 'Updating...' : 'Update Food History'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
