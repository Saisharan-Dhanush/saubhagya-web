/**
 * Edit Cattle Page - Edit existing cattle entries with all comprehensive fields
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Calendar, FileText, Scan, Upload, Camera } from 'lucide-react';

interface CattleFormData {
  // Basic Identification
  uniqueAnimalId: string;
  name: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  age: string;
  colorMarkings: string;

  // Gaushala Assignment
  gaushala: string;

  // Health & Medical Records
  vaccinationStatus: string;
  disability: string;
  veterinarianName: string;
  veterinarianContact: string;

  // Physical Characteristics
  weight: string;
  height: string;
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
}

// Create mock data for any ID
const createMockFormData = (id: string): CattleFormData => ({
  uniqueAnimalId: `COW-2025-${id.padStart(3, '0')}`,
  name: id === '1' ? 'Ganga' : `Cattle ${id}`,
  breed: id === '1' ? 'gir' : 'holstein',
  gender: 'female',
  dateOfBirth: '2022-03-15',
  age: '35',
  colorMarkings: 'Light brown with white patches on forehead',
  gaushala: 'main_gaushala',
  vaccinationStatus: 'FMD, HS, BQ completed',
  disability: 'None',
  veterinarianName: 'Dr. Rajesh Kumar',
  veterinarianContact: '+91-9876543210',
  weight: '450',
  height: '140',
  hornStatus: 'horned',
  rfidTagNumber: `RFID-${id}2345`,
  earTagNumber: `EAR-${id.padStart(3, '0')}`,
  microchipNumber: `MC-${id}2345`,
  reproductiveStatus: 'breeding',
  lastCalvingDate: '2024-08-15',
  pregnancyStatus: 'not_pregnant',
  breedingHistory: 'Delivered 3 healthy calves',
  sourceLocation: 'Ahmedabad, Gujarat',
  previousOwner: 'Ramesh Patel',
  acquisitionDate: '2022-04-01',
  ownershipStatus: 'owned',
  shedNumber: `Shed-A${id}`,
  typeOfFeed: 'grass',
  feedingSchedule: 'Morning: 10kg fodder, Evening: 8kg concentrate'
});

export default function EditCattle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const [formData, setFormData] = useState<CattleFormData>({
    uniqueAnimalId: '',
    name: '',
    breed: '',
    gender: '',
    dateOfBirth: '',
    age: '',
    colorMarkings: '',
    gaushala: '',
    vaccinationStatus: '',
    disability: '',
    veterinarianName: '',
    veterinarianContact: '',
    weight: '',
    height: '',
    hornStatus: '',
    rfidTagNumber: '',
    earTagNumber: '',
    microchipNumber: '',
    reproductiveStatus: '',
    lastCalvingDate: '',
    pregnancyStatus: '',
    breedingHistory: '',
    sourceLocation: '',
    previousOwner: '',
    acquisitionDate: '',
    ownershipStatus: '',
    shedNumber: '',
    typeOfFeed: '',
    feedingSchedule: ''
  });

  const [errors, setErrors] = useState<Partial<CattleFormData>>({});

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        if (id) {
          const foundRecord = createMockFormData(id);
          setFormData(foundRecord);
        }
      } catch (error) {
        console.error('Error fetching cattle record:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load cattle record.'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleInputChange = (field: keyof CattleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CattleFormData> = {};

    if (!formData.uniqueAnimalId.trim()) newErrors.uniqueAnimalId = 'Unique Animal ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.breed.trim()) newErrors.breed = 'Breed is required';
    if (!formData.gender.trim()) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of Birth is required';
    if (!formData.gaushala.trim()) newErrors.gaushala = 'Gaushala selection is required';
    if (!formData.rfidTagNumber.trim()) newErrors.rfidTagNumber = 'RFID Tag Number is required';

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
      console.log('Updating cattle entry:', { id, ...formData });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({
        type: 'success',
        text: 'Cattle record updated successfully!'
      });

      // Navigate back after delay
      setTimeout(() => {
        navigate('/gaushala/cattle');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update cattle record. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/gaushala/cattle');
  };

  const handleScanRfid = async () => {
    setIsScanning(true);
    // Simulate RFID scanning
    setTimeout(() => {
      const newRfidNumber = `RFID-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, rfidTagNumber: newRfidNumber }));
      setIsScanning(false);
    }, 2000);
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Cattle</h1>
          <p className="text-gray-600 mt-1">Update cattle record #{id}</p>
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
            Edit Cattle Information
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Basic Identification */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                🐄 Basic Identification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField
                  label="Unique Animal ID"
                  value={formData.uniqueAnimalId}
                  onChange={(value: string) => handleInputChange('uniqueAnimalId', value)}
                  placeholder="e.g., COW-2025-001"
                  required
                  error={errors.uniqueAnimalId}
                />

                <InputField
                  label="Name"
                  value={formData.name}
                  onChange={(value: string) => handleInputChange('name', value)}
                  placeholder="Enter cattle name"
                  required
                  error={errors.name}
                />

                <SelectField
                  label="Breed"
                  value={formData.breed}
                  onChange={(value: string) => handleInputChange('breed', value)}
                  placeholder="Select breed"
                  required
                  error={errors.breed}
                  options={[
                    { value: 'gir', label: 'Gir' },
                    { value: 'holstein', label: 'Holstein Friesian' },
                    { value: 'jersey', label: 'Jersey' },
                    { value: 'sahiwal', label: 'Sahiwal' },
                    { value: 'red_sindhi', label: 'Red Sindhi' },
                    { value: 'tharparkar', label: 'Tharparkar' }
                  ]}
                />

                <SelectField
                  label="Gender"
                  value={formData.gender}
                  onChange={(value: string) => handleInputChange('gender', value)}
                  placeholder="Select gender"
                  required
                  error={errors.gender}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' }
                  ]}
                />

                <InputField
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(value: string) => handleInputChange('dateOfBirth', value)}
                  type="date"
                  required
                  error={errors.dateOfBirth}
                />

                <InputField
                  label="Age (months)"
                  value={formData.age}
                  onChange={(value: string) => handleInputChange('age', value)}
                  type="number"
                  placeholder="Age in months"
                />

                <TextAreaField
                  label="Color/Markings"
                  value={formData.colorMarkings}
                  onChange={(value: string) => handleInputChange('colorMarkings', value)}
                  placeholder="Describe physical appearance and unique markings"
                  className="md:col-span-2 lg:col-span-3"
                />
              </div>
            </div>

            {/* Gaushala */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                🏠 Gaushala
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SelectField
                  label="Select Gaushala"
                  value={formData.gaushala}
                  onChange={(value: string) => handleInputChange('gaushala', value)}
                  placeholder="Select Gaushala"
                  required
                  error={errors.gaushala}
                  options={[
                    { value: 'main_gaushala', label: 'Main Gaushala' },
                    { value: 'branch_gaushala_1', label: 'Branch Gaushala 1' },
                    { value: 'branch_gaushala_2', label: 'Branch Gaushala 2' },
                    { value: 'temporary_shelter', label: 'Temporary Shelter' }
                  ]}
                />
              </div>
            </div>

            {/* Physical Characteristics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                📏 Physical Characteristics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField
                  label="Weight (kg)"
                  value={formData.weight}
                  onChange={(value: string) => handleInputChange('weight', value)}
                  type="number"
                  step="0.1"
                  placeholder="Weight in kilograms"
                />

                <InputField
                  label="Height (cm)"
                  value={formData.height}
                  onChange={(value: string) => handleInputChange('height', value)}
                  type="number"
                  placeholder="Height in centimeters"
                />

                <SelectField
                  label="Horn Status"
                  value={formData.hornStatus}
                  onChange={(value: string) => handleInputChange('hornStatus', value)}
                  placeholder="Select Status"
                  options={[
                    { value: 'horned', label: 'Horned' },
                    { value: 'dehorned', label: 'Dehorned' },
                    { value: 'polled', label: 'Polled (Naturally hornless)' }
                  ]}
                />

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    RFID Tag Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.rfidTagNumber}
                      onChange={(e) => handleInputChange('rfidTagNumber', e.target.value)}
                      placeholder="Scan or enter RFID tag"
                      className={`flex-1 px-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                        errors.rfidTagNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleScanRfid}
                      disabled={isScanning}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <Scan className="h-5 w-5" />
                      {isScanning ? 'Scanning...' : 'Scan'}
                    </button>
                  </div>
                  {errors.rfidTagNumber && (
                    <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                      <span className="text-red-500">⚠</span>
                      {errors.rfidTagNumber}
                    </div>
                  )}
                </div>

                <InputField
                  label="Ear Tag Number"
                  value={formData.earTagNumber}
                  onChange={(value: string) => handleInputChange('earTagNumber', value)}
                  placeholder="Ear tag number"
                />

                <InputField
                  label="Microchip Number"
                  value={formData.microchipNumber}
                  onChange={(value: string) => handleInputChange('microchipNumber', value)}
                  placeholder="Microchip number"
                />
              </div>
            </div>

            {/* Health & Medical Records */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                🩺 Health & Medical Records
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TextAreaField
                  label="Vaccination Status"
                  value={formData.vaccinationStatus}
                  onChange={(value: string) => handleInputChange('vaccinationStatus', value)}
                  placeholder="List completed vaccinations (e.g., FMD, HS, BQ)"
                  className="md:col-span-2 lg:col-span-3"
                />

                <InputField
                  label="Disability/Injury"
                  value={formData.disability}
                  onChange={(value: string) => handleInputChange('disability', value)}
                  placeholder="Any disabilities or injuries (e.g., None, Limp in left leg)"
                />

                <InputField
                  label="Veterinarian Name"
                  value={formData.veterinarianName}
                  onChange={(value: string) => handleInputChange('veterinarianName', value)}
                  placeholder="Regular veterinarian name"
                />

                <InputField
                  label="Veterinarian Contact"
                  value={formData.veterinarianContact}
                  onChange={(value: string) => handleInputChange('veterinarianContact', value)}
                  placeholder="+91-9876543210"
                />
              </div>
            </div>

            {/* Reproductive Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-pink-600" />
                </div>
                🤱 Reproductive Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SelectField
                  label="Reproductive Status"
                  value={formData.reproductiveStatus}
                  onChange={(value: string) => handleInputChange('reproductiveStatus', value)}
                  placeholder="Select Status"
                  options={[
                    { value: 'breeding', label: 'Breeding' },
                    { value: 'pregnant', label: 'Pregnant' },
                    { value: 'dry', label: 'Dry' },
                    { value: 'heifer', label: 'Heifer' },
                    { value: 'bull', label: 'Bull' }
                  ]}
                />

                <InputField
                  label="Last Calving Date"
                  value={formData.lastCalvingDate}
                  onChange={(value: string) => handleInputChange('lastCalvingDate', value)}
                  type="date"
                />

                <SelectField
                  label="Pregnancy Status"
                  value={formData.pregnancyStatus}
                  onChange={(value: string) => handleInputChange('pregnancyStatus', value)}
                  placeholder="Select Status"
                  options={[
                    { value: 'not_pregnant', label: 'Not Pregnant' },
                    { value: 'pregnant', label: 'Pregnant' },
                    { value: 'uncertain', label: 'Uncertain' }
                  ]}
                />

                <TextAreaField
                  label="Breeding History"
                  value={formData.breedingHistory}
                  onChange={(value: string) => handleInputChange('breedingHistory', value)}
                  placeholder="Breeding history and notes"
                />
              </div>
            </div>

            {/* Origin & Ownership */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                🌍 Origin & Ownership
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputField
                  label="Source Location"
                  value={formData.sourceLocation}
                  onChange={(value: string) => handleInputChange('sourceLocation', value)}
                  placeholder="Where the cattle came from"
                />

                <InputField
                  label="Previous Owner"
                  value={formData.previousOwner}
                  onChange={(value: string) => handleInputChange('previousOwner', value)}
                  placeholder="Previous owner name"
                />

                <InputField
                  label="Acquisition Date"
                  value={formData.acquisitionDate}
                  onChange={(value: string) => handleInputChange('acquisitionDate', value)}
                  type="date"
                />

                <SelectField
                  label="Ownership Status"
                  value={formData.ownershipStatus}
                  onChange={(value: string) => handleInputChange('ownershipStatus', value)}
                  placeholder="Select Status"
                  options={[
                    { value: 'owned', label: 'Owned' },
                    { value: 'donated', label: 'Donated' },
                    { value: 'rescued', label: 'Rescued' },
                    { value: 'temporary_care', label: 'Temporary Care' }
                  ]}
                />
              </div>
            </div>

            {/* Shelter & Feeding */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                🏠 Shelter & Feeding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField
                  label="Shed Number"
                  value={formData.shedNumber}
                  onChange={(value: string) => handleInputChange('shedNumber', value)}
                  placeholder="e.g., Shed-A1, Shed-B2"
                />

                <SelectField
                  label="Type of Feed"
                  value={formData.typeOfFeed}
                  onChange={(value: string) => handleInputChange('typeOfFeed', value)}
                  placeholder="Select Feed Type"
                  options={[
                    { value: 'grass', label: 'Grass' },
                    { value: 'hay', label: 'Hay' },
                    { value: 'silage', label: 'Silage' },
                    { value: 'concentrate', label: 'Concentrate' },
                    { value: 'mixed', label: 'Mixed Feed' }
                  ]}
                />

                <TextAreaField
                  label="Feeding Schedule"
                  value={formData.feedingSchedule}
                  onChange={(value: string) => handleInputChange('feedingSchedule', value)}
                  placeholder="Detailed feeding schedule and quantities"
                  className="md:col-span-2 lg:col-span-3"
                />
              </div>
            </div>

            {/* Supporting Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                📄 Supporting Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">Cattle Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <button type="button" className="text-blue-600 hover:text-blue-500">
                        Upload photo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">Health Certificate</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <button type="button" className="text-blue-600 hover:text-blue-500">
                        Upload certificate
                      </button>
                      <p className="text-xs text-gray-500 mt-1">PDF up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">Purchase Document</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <button type="button" className="text-blue-600 hover:text-blue-500">
                        Upload document
                      </button>
                      <p className="text-xs text-gray-500 mt-1">PDF up to 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-start gap-4 pt-6 border-t border-gray-100">
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
                {isLoading ? 'Updating...' : 'Update Cattle Record'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}