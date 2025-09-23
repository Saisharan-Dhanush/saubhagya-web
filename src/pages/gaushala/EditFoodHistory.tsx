/**
 * Edit Food History Page - Edit existing food history entries
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Calendar, FileText } from 'lucide-react';

interface FoodHistoryFormData {
  foodName: string;
  batchName: string;
  shed: string;
  date: string;
  consumeQuantity: string;
  duration: string;
  comments: string;
  version: string;
}

interface FoodHistoryRecord extends FoodHistoryFormData {
  id: number;
  type: string;
}

// Mock data for demonstration
const mockData: FoodHistoryRecord[] = [
  {
    id: 1,
    foodName: 'Unprocessed Food',
    batchName: 'Batch-07',
    type: 'Organic',
    shed: 'Shed_1',
    consumeQuantity: '34',
    duration: 'morning',
    date: '2025-04-26',
    comments: 'High quality organic food given to cattle in shed 1 during morning hours.',
    version: '1.2'
  },
  {
    id: 2,
    foodName: 'Dry grass',
    batchName: 'Batch-03',
    type: 'Natural',
    shed: '',
    consumeQuantity: '12',
    duration: '1st half',
    date: '2025-03-30',
    comments: 'Natural dry grass distributed to multiple cattle.',
    version: '1.0'
  },
  {
    id: 3,
    foodName: 'Dry grass',
    batchName: 'Batch-03',
    type: 'Natural',
    shed: '',
    consumeQuantity: '12',
    duration: 'Last Half of the day',
    date: '2025-03-02',
    comments: 'Evening feeding session with dry grass.',
    version: '1.1'
  }
];

export default function EditFoodHistory() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<FoodHistoryFormData>({
    foodName: '',
    batchName: '',
    shed: '',
    date: '',
    consumeQuantity: '',
    duration: '',
    comments: '',
    version: ''
  });

  const [errors, setErrors] = useState<Partial<FoodHistoryFormData>>({});

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const foundRecord = mockData.find(item => item.id === parseInt(id || '0'));
        if (foundRecord) {
          setFormData({
            foodName: foundRecord.foodName,
            batchName: foundRecord.batchName,
            shed: foundRecord.shed,
            date: foundRecord.date,
            consumeQuantity: foundRecord.consumeQuantity,
            duration: foundRecord.duration,
            comments: foundRecord.comments,
            version: foundRecord.version
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

    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleInputChange = (field: keyof FoodHistoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FoodHistoryFormData> = {};

    if (!formData.foodName.trim()) newErrors.foodName = 'Food Name is required';
    if (!formData.batchName.trim()) newErrors.batchName = 'Batch Name is required';
    if (!formData.shed.trim()) newErrors.shed = 'Shed is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (!formData.consumeQuantity.trim()) newErrors.consumeQuantity = 'Consume Quantity is required';
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

    setIsLoading(true);
    setMessage(null);

    try {
      // TODO: Replace with actual API call
      console.log('Updating food history entry:', { id, ...formData });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({
        type: 'success',
        text: 'Food history entry updated successfully!'
      });

      // Navigate back after delay
      setTimeout(() => {
        navigate('/gaushala/food-history');
      }, 2000);
    } catch (error) {
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
        onChange={(e) => onChange(e.target.value)}
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
        <div className="text-gray-500">Loading...</div>
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
            {/* Food Name */}
            <InputField
              label="Food Name"
              value={formData.foodName}
              onChange={(value: string) => handleInputChange('foodName', value)}
              placeholder="Enter food name"
              required
              error={errors.foodName}
            />

            {/* Batch Name */}
            <InputField
              label="Batch Name"
              value={formData.batchName}
              onChange={(value: string) => handleInputChange('batchName', value)}
              placeholder="Enter batch name"
              required
              error={errors.batchName}
            />

            {/* Shed */}
            <SelectField
              label="Shed"
              value={formData.shed}
              onChange={(value: string) => handleInputChange('shed', value)}
              placeholder="Select shed"
              required
              error={errors.shed}
              options={[
                { value: 'Shed_1', label: 'Shed 1' },
                { value: 'Shed_2', label: 'Shed 2' },
                { value: 'Shed_3', label: 'Shed 3' },
                { value: 'Shed_4', label: 'Shed 4' },
                { value: 'Shed_5', label: 'Shed 5' }
              ]}
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

            {/* Consume Quantity */}
            <InputField
              label="Consume Quantity"
              value={formData.consumeQuantity}
              onChange={(value: string) => handleInputChange('consumeQuantity', value)}
              type="number"
              placeholder="Enter quantity"
              required
              error={errors.consumeQuantity}
            />

            {/* Duration */}
            <SelectField
              label="Duration"
              value={formData.duration}
              onChange={(value: string) => handleInputChange('duration', value)}
              placeholder="Select duration"
              required
              error={errors.duration}
              options={[
                { value: 'morning', label: 'Morning' },
                { value: 'afternoon', label: 'Afternoon' },
                { value: 'evening', label: 'Evening' },
                { value: '1st half', label: '1st Half' },
                { value: 'Last Half of the day', label: 'Last Half of the day' },
                { value: 'full day', label: 'Full Day' }
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

            {/* Version */}
            <InputField
              label="Version"
              value={formData.version}
              onChange={(value: string) => handleInputChange('version', value)}
              placeholder="Enter version (e.g., 1.0, 2.1)"
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