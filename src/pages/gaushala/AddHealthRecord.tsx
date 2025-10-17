/**
 * Add Health Record Page - Create new health records for cattle
 * Mapped to backend HealthRecordDTO with exact field names
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Calendar, FileText, Search, ChevronDown, Heart } from 'lucide-react';
import {
  healthRecordsApi,
  cattleApi,
  type HealthRecord,
  type Cattle
} from '../../services/gaushala/api';
import { getStoredToken } from '../../utils/auth';

interface HealthRecordFormData {
  cattleId: number;
  recordType: string;
  recordDate: string;
  veterinarianName: string;
  veterinarianLicense: string;
  veterinarianContact: string;
  diagnosis: string;
  treatment: string;
  medications: string;
  dosageInstructions: string;
  vaccinationType: string;
  nextVaccinationDate: string;
  nextCheckupDate: string;
  cost: number;
  notes: string;
  performedBy: string;
  status: string;
}

export default function AddHealthRecord() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dropdown data from backend APIs
  const [cattle, setCattle] = useState<{ id: number; name: string }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [gaushalaId, setGaushalaId] = useState<number | null>(null);

  const [formData, setFormData] = useState<HealthRecordFormData>({
    cattleId: 0,
    recordType: '',
    recordDate: '',
    veterinarianName: '',
    veterinarianLicense: '',
    veterinarianContact: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    dosageInstructions: '',
    vaccinationType: '',
    nextVaccinationDate: '',
    nextCheckupDate: '',
    cost: 0,
    notes: '',
    performedBy: '',
    status: 'COMPLETED'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof HealthRecordFormData, string>>>({});

  useEffect(() => {
    // Get gaushala ID from JWT token
    const token = getStoredToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userGaushalaId = payload.gaushalaId;
        setGaushalaId(userGaushalaId);
      } catch (error) {
        console.error('Error parsing JWT token:', error);
      }
    }

    // Fetch cattle from backend API
    const fetchDropdownData = async () => {
      setDataLoading(true);
      try {
        const cattleResponse = await cattleApi.getAllCattle(0, 1000);

        // Process cattle data
        if (cattleResponse.success && cattleResponse.data?.content) {
          const cattleList = cattleResponse.data.content.map((c: Cattle) => ({
            id: c.id!,
            name: `${c.uniqueAnimalId} - ${c.name}`
          }));
          setCattle(cattleList);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load cattle data. Please refresh the page.'
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleInputChange = (field: keyof HealthRecordFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HealthRecordFormData, string>> = {};

    if (formData.cattleId === 0) newErrors.cattleId = 'Cattle is required';
    if (!formData.recordType.trim()) newErrors.recordType = 'Record Type is required';
    if (!formData.recordDate.trim()) newErrors.recordDate = 'Record Date is required';
    if (!formData.status.trim()) newErrors.status = 'Status is required';

    // Type-specific validations
    if (formData.recordType === 'VACCINATION' && !formData.vaccinationType.trim()) {
      newErrors.vaccinationType = 'Vaccination Type is required for vaccination records';
    }

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

    if (!gaushalaId) {
      setMessage({
        type: 'error',
        text: 'Gaushala ID not found. Please login again.'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Convert date to YYYY-MM-DD format for backend LocalDate
      const healthRecordData: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isActive'> = {
        cattleId: formData.cattleId,
        gaushalaId: gaushalaId,
        recordType: formData.recordType,
        recordDate: formData.recordDate, // Already in YYYY-MM-DD from date input
        veterinarianName: formData.veterinarianName || undefined,
        veterinarianLicense: formData.veterinarianLicense || undefined,
        veterinarianContact: formData.veterinarianContact || undefined,
        diagnosis: formData.diagnosis || undefined,
        treatment: formData.treatment || undefined,
        medications: formData.medications || undefined,
        dosageInstructions: formData.dosageInstructions || undefined,
        vaccinationType: formData.vaccinationType || undefined,
        nextVaccinationDate: formData.nextVaccinationDate || undefined,
        nextCheckupDate: formData.nextCheckupDate || undefined,
        cost: formData.cost > 0 ? formData.cost : undefined,
        notes: formData.notes || undefined,
        performedBy: formData.performedBy || undefined,
        status: formData.status
      };

      const result = await healthRecordsApi.createHealthRecord(healthRecordData);

      if (result.success) {
        setMessage({
          type: 'success',
          text: result.message || 'Health record created successfully!'
        });

        // Navigate back after delay
        setTimeout(() => {
          navigate('/gaushala/health-history');
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to create health record.'
        });
      }
    } catch (error) {
      console.error('Error creating health record:', error);
      setMessage({
        type: 'error',
        text: 'Failed to create health record. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/gaushala/health-history');
  };

  // Searchable Select Field Component
  const SearchableSelectField = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    options,
    className = ''
  }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get selected option name
    const selectedOption = options.find((opt: any) => opt.id === value);
    const displayValue = selectedOption ? selectedOption.name : placeholder;

    // Filter options based on search term
    const filteredOptions = options.filter((option: any) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className={`space-y-2 ${className}`} ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {/* Selected Value Display */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}
          >
            <span className="truncate">{displayValue}</span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm text-gray-500">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option: any) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onChange(option.id);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors ${
                        option.id === value ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-900'
                      }`}
                    >
                      {option.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <span className="text-red-500">⚠</span>
            {error}
          </div>
        )}
      </div>
    );
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
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      >
        <option value="">{placeholder}</option>
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

  // Show loading state while fetching dropdown data
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading form data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Health Record</h1>
          <p className="text-gray-600 mt-1">Record new health checkup or treatment</p>
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
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            Create New Health Record
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cattle - Searchable */}
            <SearchableSelectField
              label="Cattle"
              value={formData.cattleId}
              onChange={(value: number) => handleInputChange('cattleId', value)}
              placeholder="Search and select cattle"
              required
              error={errors.cattleId}
              options={cattle}
            />

            {/* Record Type */}
            <SelectField
              label="Record Type"
              value={formData.recordType}
              onChange={(value: string) => handleInputChange('recordType', value)}
              placeholder="Select record type"
              required
              error={errors.recordType}
              options={[
                { id: 'VACCINATION', name: 'Vaccination' },
                { id: 'TREATMENT', name: 'Treatment' },
                { id: 'CHECKUP', name: 'Checkup' },
                { id: 'SURGERY', name: 'Surgery' }
              ]}
            />

            {/* Record Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Record Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.recordDate}
                  onChange={(e) => handleInputChange('recordDate', e.target.value)}
                  className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
                    errors.recordDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.recordDate && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <span className="text-red-500">⚠</span>
                  {errors.recordDate}
                </div>
              )}
            </div>

            {/* Status */}
            <SelectField
              label="Status"
              value={formData.status}
              onChange={(value: string) => handleInputChange('status', value)}
              placeholder="Select status"
              required
              error={errors.status}
              options={[
                { id: 'SCHEDULED', name: 'Scheduled' },
                { id: 'COMPLETED', name: 'Completed' },
                { id: 'CANCELLED', name: 'Cancelled' }
              ]}
            />

            {/* Veterinarian Name */}
            <InputField
              label="Veterinarian Name"
              value={formData.veterinarianName}
              onChange={(value: string) => handleInputChange('veterinarianName', value)}
              placeholder="Enter veterinarian name"
            />

            {/* Veterinarian License */}
            <InputField
              label="Veterinarian License"
              value={formData.veterinarianLicense}
              onChange={(value: string) => handleInputChange('veterinarianLicense', value)}
              placeholder="Enter license number"
            />

            {/* Veterinarian Contact */}
            <InputField
              label="Veterinarian Contact"
              value={formData.veterinarianContact}
              onChange={(value: string) => handleInputChange('veterinarianContact', value)}
              type="tel"
              placeholder="Enter contact number"
            />

            {/* Performed By */}
            <InputField
              label="Performed By"
              value={formData.performedBy}
              onChange={(value: string) => handleInputChange('performedBy', value)}
              placeholder="Enter who performed the procedure"
            />

            {/* Vaccination Type - Show only for VACCINATION */}
            {formData.recordType === 'VACCINATION' && (
              <InputField
                label="Vaccination Type"
                value={formData.vaccinationType}
                onChange={(value: string) => handleInputChange('vaccinationType', value)}
                placeholder="Enter vaccination type"
                required
                error={errors.vaccinationType}
              />
            )}

            {/* Next Vaccination Date */}
            {formData.recordType === 'VACCINATION' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800">
                  Next Vaccination Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.nextVaccinationDate}
                    onChange={(e) => handleInputChange('nextVaccinationDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Next Checkup Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Next Checkup Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.nextCheckupDate}
                  onChange={(e) => handleInputChange('nextCheckupDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cost */}
            <InputField
              label="Cost (₹)"
              value={formData.cost}
              onChange={(value: number) => handleInputChange('cost', value)}
              type="number"
              placeholder="Enter cost"
              min="0"
              step="0.01"
            />

            {/* Diagnosis */}
            <TextAreaField
              label="Diagnosis"
              value={formData.diagnosis}
              onChange={(value: string) => handleInputChange('diagnosis', value)}
              placeholder="Enter diagnosis details"
              className="md:col-span-2"
            />

            {/* Treatment */}
            <TextAreaField
              label="Treatment"
              value={formData.treatment}
              onChange={(value: string) => handleInputChange('treatment', value)}
              placeholder="Enter treatment details"
              className="md:col-span-2"
            />

            {/* Medications */}
            <TextAreaField
              label="Medications"
              value={formData.medications}
              onChange={(value: string) => handleInputChange('medications', value)}
              placeholder="Enter medications prescribed"
            />

            {/* Dosage Instructions */}
            <TextAreaField
              label="Dosage Instructions"
              value={formData.dosageInstructions}
              onChange={(value: string) => handleInputChange('dosageInstructions', value)}
              placeholder="Enter dosage instructions"
            />

            {/* Notes */}
            <TextAreaField
              label="Notes"
              value={formData.notes}
              onChange={(value: string) => handleInputChange('notes', value)}
              placeholder="Enter any additional notes"
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
              {isLoading ? 'Creating...' : 'Create Health Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
