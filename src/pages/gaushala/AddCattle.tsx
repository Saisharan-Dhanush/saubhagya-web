/**
 * Add Cattle Page - Production-level cattle registration form
 * Updated to use master data IDs and proper field mappings for backend integration
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save, ArrowLeft, Scan, Upload, Camera, FileText,
  User, Activity, Baby, Globe, Settings, Ruler,
  AlertCircle, CheckCircle, Clock, Plus, X
} from 'lucide-react';
import {
  gauShalaApi,
  calculateDobFromAge,
  type Breed,
  type Species,
  type Gender,
  type Color,
  type Cattle
} from '../../services/gaushala/api';

import { InputField, SelectField, TextAreaField, FileUploadField } from './CattleFormFields';
interface LanguageContextType {
  language: 'hi' | 'en';
  t: (key: string) => string;
}

interface AddCattleProps {
  languageContext: LanguageContextType;
}

export default function AddCattle({ languageContext }: AddCattleProps) {
  const navigate = useNavigate();

  // Master data state
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [masterDataLoading, setMasterDataLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Basic Identification - Updated to use IDs
    uniqueAnimalId: '',
    name: '',
    breedId: 0,
    speciesId: 0,
    genderId: 0,
    colorId: 0,
    ageYears: 0,  // User enters age, will be converted to dob on submit
    dateOfEntry: new Date().toISOString().split('T')[0],  // Store as date string for form input


    // Health & Medical Records
    vaccinationStatus: '',
    disability: '',
    veterinarianName: '',
    dewormingSchedule: '',
    lastHealthCheckup: '',
    veterinarianContact: '',
    medicalHistory: '',

    // Physical Characteristics - Updated field name
    weight: '',
    hornStatus: '',
    rfidTagNo: '',  // Changed from rfidTagNumber to match backend
    height: '',
    earTagNumber: '',
    microchipNumber: '',

    // Reproductive Details (Female only)
    milkingStatus: '',
    milkYieldPerDay: '',
    numberOfCalves: '',
    lactationNumber: '',
    lastCalvingDate: '',
    pregnancyStatus: '',

    // Origin & Ownership
    sourceOfAcquisition: '',
    previousOwner: '',
    dateOfAcquisition: '',
    ownershipStatus: '',

    // Shelter & Feeding
    shedNumber: '',
    typeOfFeed: '',
    feedingSchedule: '',

    // Supporting Documents
    photoFile: null as File | null,
    healthCertificate: null as File | null,
    vaccinationRecord: null as File | null,
    purchaseDocument: null as File | null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState(0);

  // Load master data on component mount
  useEffect(() => {
    const loadMasterData = async () => {
      setMasterDataLoading(true);
      try {
        const [breedsRes, speciesRes, gendersRes, colorsRes] = await Promise.all([
          gauShalaApi.masterData.getAllBreeds(),
          gauShalaApi.masterData.getAllSpecies(),
          gauShalaApi.masterData.getAllGenders(),
          gauShalaApi.masterData.getAllColors(),
        ]);

        if (breedsRes.success && breedsRes.data) setBreeds(breedsRes.data);
        if (speciesRes.success && speciesRes.data) setSpecies(speciesRes.data);
        if (gendersRes.success && gendersRes.data) setGenders(gendersRes.data);
        if (colorsRes.success && colorsRes.data) setColors(colorsRes.data);
      } catch (error) {
        console.error('Failed to load master data:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load reference data. Please refresh the page.'
        });
      } finally {
        setMasterDataLoading(false);
      }
    };

    loadMasterData();
  }, []);

  const handleInputChange = useCallback((field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field - use functional update to prevent input unfocus bug
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
    setMessage(null);
  }, []); // Empty dependency array - function is now stable

  const handleScanRfid = async () => {
    setIsScanning(true);
    try {
      const response = await gauShalaApi.cattle.scanRfid();
      if (response.success && response.data) {
        handleInputChange('rfidTagNo', response.data.rfidTag);

        if (response.data.cattleInfo) {
          setMessage({
            type: 'warning',
            text: 'RFID tag already exists for another cattle'
          });
        } else {
          setMessage({
            type: 'success',
            text: 'RFID tag scanned successfully'
          });
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to scan RFID tag'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation - Updated for ID fields
    if (!formData.uniqueAnimalId.trim()) newErrors.uniqueAnimalId = 'Unique Animal ID is required';
    if (formData.breedId === 0) newErrors.breedId = 'Breed is required';
    if (formData.speciesId === 0) newErrors.speciesId = 'Species is required';
    if (formData.genderId === 0) newErrors.genderId = 'Gender is required';
    if (!formData.dateOfEntry) newErrors.dateOfEntry = 'Date of Entry is required';
    if (!formData.rfidTagNo.trim()) newErrors.rfidTagNo = 'RFID Tag Number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to convert date string (YYYY-MM-DD) to LocalDateTime format (YYYY-MM-DDTHH:MM:SS)
  const convertToLocalDateTime = (dateString: string): string | undefined => {
    if (!dateString || dateString.trim() === '') return undefined;
    // If already in ISO format, return as-is
    if (dateString.includes('T')) return dateString;
    // Convert date-only string to LocalDateTime at midnight
    return `${dateString}T00:00:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Transform formData to match Cattle interface for backend - COMPLETE FIELD MAPPING
      const cattleData: Omit<Cattle, 'id' | 'createdAt' | 'updatedAt'> = {
        uniqueAnimalId: formData.uniqueAnimalId,
        name: formData.name || undefined,
        breedId: formData.breedId,
        speciesId: formData.speciesId,
        genderId: formData.genderId,
        colorId: formData.colorId,
        dob: formData.ageYears > 0 ? calculateDobFromAge(formData.ageYears) : new Date().toISOString(),

        // Physical Characteristics
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        hornStatus: formData.hornStatus || undefined,
        rfidTagNo: formData.rfidTagNo,
        earTagNo: formData.earTagNumber || undefined,
        microchipNo: formData.microchipNumber || undefined,
        shedNumber: formData.shedNumber || undefined,

        // Health & Medical Records
        vaccinationStatus: formData.vaccinationStatus || undefined,
        disability: formData.disability || undefined,
        dewormingSchedule: formData.dewormingSchedule || undefined,
        medicalHistory: formData.medicalHistory || undefined,
        lastHealthCheckupDate: formData.lastHealthCheckup ? convertToLocalDateTime(formData.lastHealthCheckup) : undefined,
        vetName: formData.veterinarianName || undefined,
        vetContact: formData.veterinarianContact || undefined,

        // Reproductive Details
        milkingStatus: formData.milkingStatus || undefined,
        lactationNumber: formData.lactationNumber ? parseInt(formData.lactationNumber) : undefined,
        milkYieldPerDay: formData.milkYieldPerDay ? parseFloat(formData.milkYieldPerDay) : undefined,
        lastCalvingDate: formData.lastCalvingDate ? convertToLocalDateTime(formData.lastCalvingDate) : undefined,
        calvesCount: formData.numberOfCalves ? parseInt(formData.numberOfCalves) : undefined,
        pregnancyStatus: formData.pregnancyStatus || undefined,

        // Origin & Ownership
        sourceId: formData.sourceOfAcquisition ? parseInt(formData.sourceOfAcquisition) : undefined,
        dateOfAcquisition: formData.dateOfAcquisition ? convertToLocalDateTime(formData.dateOfAcquisition) : undefined,
        previousOwner: formData.previousOwner || undefined,
        ownershipId: formData.ownershipStatus ? parseInt(formData.ownershipStatus) : undefined,

        // Shelter & Feeding
        feedingSchedule: formData.feedingSchedule || undefined,
        feedTypeId: formData.typeOfFeed ? parseInt(formData.typeOfFeed) : undefined,

        // System fields
        dateOfEntry: convertToLocalDateTime(formData.dateOfEntry),
        isActive: true,
        totalDungCollected: 0,
        lastDungCollection: 0,
      };

      const response = await gauShalaApi.cattle.createCattle(cattleData);

      if (response.success && response.data) {
        // Upload documents if provided
        const uploadPromises = [];

        if (formData.photoFile) {
          uploadPromises.push(gauShalaApi.cattle.uploadPhoto(response.data.id, formData.photoFile));
        }

        if (formData.healthCertificate) {
          uploadPromises.push(gauShalaApi.cattle.uploadDocument(response.data.id, formData.healthCertificate, 'health_certificate'));
        }

        if (formData.vaccinationRecord) {
          uploadPromises.push(gauShalaApi.cattle.uploadDocument(response.data.id, formData.vaccinationRecord, 'vaccination_record'));
        }

        if (formData.purchaseDocument) {
          uploadPromises.push(gauShalaApi.cattle.uploadDocument(response.data.id, formData.purchaseDocument, 'purchase_document'));
        }

        // Wait for all uploads
        if (uploadPromises.length > 0) {
          try {
            await Promise.all(uploadPromises);
          } catch (uploadError) {
            console.warn('Some document uploads failed:', uploadError);
          }
        }

        setMessage({
          type: 'success',
          text: 'Cattle registered successfully!'
        });

        // Navigate back after delay
        setTimeout(() => {
          navigate('/gaushala/cattle');
        }, 2000);
      } else {
        throw new Error(response.error || 'Failed to create cattle');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to register cattle. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/gaushala/cattle');
  };

  const sections = [
    {
      id: 'basic',
      title: 'Basic Identification',
      icon: User,
      color: 'from-blue-500 to-indigo-600',
      progress: 0
    },
    {
      id: 'physical',
      title: 'Physical Characteristics',
      icon: Ruler,
      color: 'from-purple-500 to-violet-600',
      progress: 0
    },
    {
      id: 'health',
      title: 'Health & Medical',
      icon: Activity,
      color: 'from-red-500 to-pink-600',
      progress: 0
    },
    {
      id: 'reproductive',
      title: 'Reproductive Details',
      icon: Baby,
      color: 'from-pink-500 to-rose-600',
      progress: 0
    },
    {
      id: 'origin',
      title: 'Origin & Ownership',
      icon: Globe,
      color: 'from-emerald-500 to-teal-600',
      progress: 0
    },
    {
      id: 'shelter',
      title: 'Shelter & Feeding',
      icon: Settings,
      color: 'from-amber-500 to-yellow-600',
      progress: 0
    }
  ];


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="h-8 w-px bg-gray-300"></div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐄</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Register New Cattle</h2>
              <p className="text-gray-600">Complete cattle registration with comprehensive details</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="cattle-form"
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Cattle'}
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between overflow-x-auto">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="flex items-center flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-700">{section.title}</p>
                </div>
                {index < sections.length - 1 && (
                  <div className="w-8 h-px bg-gray-300 mx-3"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg border-l-4 ${
          message.type === 'success'
            ? 'bg-green-50 border-green-400 text-green-800'
            : message.type === 'warning'
            ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : message.type === 'warning' ? (
              <Clock className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}
      <form id="cattle-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* Left Section - 3 columns */}
          <div className="xl:col-span-3 space-y-6">

            {/* Basic Identification */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                🐄 Basic Identification
              </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InputField
                    label="Unique Animal ID"
                    value={formData.uniqueAnimalId}
                    onChange={(value: string) => handleInputChange('uniqueAnimalId', value)}
                    placeholder="Enter unique animal ID"
                    required
                    error={errors.uniqueAnimalId}
                  />

                  <InputField
                    label="Name (Optional)"
                    value={formData.name}
                    onChange={(value: string) => handleInputChange('name', value)}
                    placeholder="Enter cattle name"
                  />

                  <SelectField
                    label="Breed"
                    value={formData.breedId}
                    onChange={(value: string) => handleInputChange('breedId', parseInt(value) || 0)}
                    placeholder={masterDataLoading ? 'Loading breeds...' : 'Select Breed'}
                    required
                    error={errors.breedId}
                    options={breeds.filter(breed => breed && breed.id && breed.name).map(breed => ({
                      value: breed.id.toString(),
                      label: breed.name
                    }))}
                  />

                  <SelectField
                    label="Species"
                    value={formData.speciesId}
                    onChange={(value: string) => handleInputChange('speciesId', parseInt(value) || 0)}
                    placeholder={masterDataLoading ? 'Loading species...' : 'Select Species'}
                    required
                    error={errors.speciesId}
                    options={species.filter(s => s && s.id && s.name).map(s => ({
                      value: s.id.toString(),
                      label: s.name
                    }))}
                  />

                  <SelectField
                    label="Gender"
                    value={formData.genderId}
                    onChange={(value: string) => handleInputChange('genderId', parseInt(value) || 0)}
                    placeholder={masterDataLoading ? 'Loading genders...' : 'Select Gender'}
                    required
                    error={errors.genderId}
                    options={genders.filter(gender => gender && gender.id && gender.name).map(gender => ({
                      value: gender.id.toString(),
                      label: gender.name
                    }))}
                  />

                  <SelectField
                    label="Color"
                    value={formData.colorId}
                    onChange={(value: string) => handleInputChange('colorId', parseInt(value) || 0)}
                    placeholder={masterDataLoading ? 'Loading colors...' : 'Select Color'}
                    error={errors.colorId}
                    options={colors.filter(color => color && color.id && color.name).map(color => ({
                      value: color.id.toString(),
                      label: color.name
                    }))}
                  />

                  <InputField
                    label="Age (Years)"
                    value={formData.ageYears}
                    onChange={(value: string) => handleInputChange('ageYears', parseInt(value) || 0)}
                    type="number"
                    min="0"
                    placeholder="Enter age in years"
                  />

                  <InputField
                    label="Date of Entry"
                    value={formData.dateOfEntry}
                    onChange={(value: string) => handleInputChange('dateOfEntry', value)}
                    type="date"
                    required
                    error={errors.dateOfEntry}
                  />
                </div>
              </div>


            {/* Physical Characteristics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Ruler className="h-5 w-5 text-purple-600" />
                </div>
                📏 Physical Characteristics
              </h2>

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
                        value={formData.rfidTagNo}
                        onChange={(e) => handleInputChange('rfidTagNo', e.target.value)}
                        placeholder="Scan or enter RFID tag"
                        className={`flex-1 px-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                          errors.rfidTagNo ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                    {errors.rfidTagNo && (
                      <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                        <AlertCircle className="h-4 w-4" />
                        {errors.rfidTagNo}
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                🩺 Health & Medical Records
              </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InputField
                    label="Vaccination Status"
                    value={formData.vaccinationStatus}
                    onChange={(value: string) => handleInputChange('vaccinationStatus', value)}
                    placeholder="e.g., FMD, HS completed"
                  />

                  <InputField
                    label="Disability / Injury"
                    value={formData.disability}
                    onChange={(value: string) => handleInputChange('disability', value)}
                    placeholder="Any disabilities or injuries"
                  />

                  <InputField
                    label="Veterinarian Name"
                    value={formData.veterinarianName}
                    onChange={(value: string) => handleInputChange('veterinarianName', value)}
                    placeholder="Name of attending veterinarian"
                  />

                  <InputField
                    label="Veterinarian Contact"
                    value={formData.veterinarianContact}
                    onChange={(value: string) => handleInputChange('veterinarianContact', value)}
                    type="tel"
                    placeholder="Phone number"
                  />

                  <InputField
                    label="Last Health Check-up"
                    value={formData.lastHealthCheckup}
                    onChange={(value: string) => handleInputChange('lastHealthCheckup', value)}
                    type="date"
                  />

                  <InputField
                    label="Deworming Schedule"
                    value={formData.dewormingSchedule}
                    onChange={(value: string) => handleInputChange('dewormingSchedule', value)}
                    placeholder="e.g., Every 6 months"
                  />

                  <TextAreaField
                    label="Medical History"
                    value={formData.medicalHistory}
                    onChange={(value: string) => handleInputChange('medicalHistory', value)}
                    placeholder="Previous medical treatments, surgeries, etc."
                    className="lg:col-span-3"
                  />
                </div>
              </div>

              {/* Additional Sections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Reproductive Details (Female only) */}
                {/* Note: Check if genderId matches female gender ID from master data */}
                {genders.find(g => g.name && g.name.toLowerCase() === 'female' && g.id === formData.genderId) && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Baby className="h-5 w-5 text-blue-600" />
                      </div>
                      🤱 Reproductive Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SelectField
                        label="Milking Status"
                        value={formData.milkingStatus}
                        onChange={(value: string) => handleInputChange('milkingStatus', value)}
                        placeholder="Select Status"
                        options={[
                          { value: 'lactating', label: 'Lactating' },
                          { value: 'dry', label: 'Dry' },
                          { value: 'pregnant', label: 'Pregnant' },
                          { value: 'not_breeding', label: 'Not for Breeding' }
                        ]}
                      />

                      <InputField
                        label="Milk Yield Per Day (Liters)"
                        value={formData.milkYieldPerDay}
                        onChange={(value: string) => handleInputChange('milkYieldPerDay', value)}
                        type="number"
                        step="0.1"
                        placeholder="Daily milk yield"
                      />

                      <InputField
                        label="Number of Calves"
                        value={formData.numberOfCalves}
                        onChange={(value: string) => handleInputChange('numberOfCalves', value)}
                        type="number"
                        placeholder="Total calves born"
                      />

                      <InputField
                        label="Lactation Number"
                        value={formData.lactationNumber}
                        onChange={(value: string) => handleInputChange('lactationNumber', value)}
                        type="number"
                        placeholder="Current lactation number"
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
                          { value: 'pregnant', label: 'Pregnant' },
                          { value: 'not_pregnant', label: 'Not Pregnant' },
                          { value: 'unknown', label: 'Unknown' }
                        ]}
                      />
                    </div>
                  </div>
                )}

                {/* Origin & Ownership */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    🌍 Origin & Ownership
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      label="Source of Acquisition"
                      value={formData.sourceOfAcquisition}
                      onChange={(value: string) => handleInputChange('sourceOfAcquisition', value)}
                      placeholder="Select Source"
                      options={[
                        { value: 'purchase', label: 'Purchase' },
                        { value: 'donation', label: 'Donation' },
                        { value: 'rescue', label: 'Rescue' },
                        { value: 'transfer', label: 'Transfer' },
                        { value: 'born_here', label: 'Born Here' }
                      ]}
                    />

                    <InputField
                      label="Previous Owner"
                      value={formData.previousOwner}
                      onChange={(value: string) => handleInputChange('previousOwner', value)}
                      placeholder="Name of previous owner"
                    />

                    <InputField
                      label="Date of Acquisition"
                      value={formData.dateOfAcquisition}
                      onChange={(value: string) => handleInputChange('dateOfAcquisition', value)}
                      type="date"
                    />

                    <SelectField
                      label="Ownership Status"
                      value={formData.ownershipStatus}
                      onChange={(value: string) => handleInputChange('ownershipStatus', value)}
                      placeholder="Select Status"
                      options={[
                        { value: 'owned', label: 'Owned by Gaushala' },
                        { value: 'fostered', label: 'Fostered' },
                        { value: 'temporary', label: 'Temporary Care' },
                        { value: 'sponsored', label: 'Sponsored' }
                      ]}
                    />
                  </div>
                </div>

                {/* Shelter & Feeding */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    🏠 Shelter & Feeding
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Shed Number"
                      value={formData.shedNumber}
                      onChange={(value: string) => handleInputChange('shedNumber', value)}
                      placeholder="Assigned shed number"
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

                    <div className="md:col-span-2">
                      <TextAreaField
                        label="Feeding Schedule"
                        value={formData.feedingSchedule}
                        onChange={(value: string) => handleInputChange('feedingSchedule', value)}
                        placeholder="Feeding times and quantities"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">

            {/* Supporting Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                📎 Documents
              </h2>

                <div className="space-y-6">
                  <FileUploadField
                    label="Photo"
                    value={formData.photoFile}
                    onChange={(value: File | null) => handleInputChange('photoFile', value)}
                    accept="image/*"
                  />

                  <FileUploadField
                    label="Health Certificate"
                    value={formData.healthCertificate}
                    onChange={(value: File | null) => handleInputChange('healthCertificate', value)}
                    accept=".pdf"
                  />

                  <FileUploadField
                    label="Vaccination Record"
                    value={formData.vaccinationRecord}
                    onChange={(value: File | null) => handleInputChange('vaccinationRecord', value)}
                    accept=".pdf"
                  />

                  <FileUploadField
                    label="Purchase/Donation Document"
                    value={formData.purchaseDocument}
                    onChange={(value: File | null) => handleInputChange('purchaseDocument', value)}
                    accept=".pdf"
                  />
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Form Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Required Fields</span>
                      <span className="font-medium text-gray-900">
                        {Object.keys(errors).length === 0 ? '✓ Complete' : `${Object.keys(errors).length} missing`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Documents</span>
                      <span className="font-medium text-gray-900">
                        {[formData.photoFile, formData.healthCertificate, formData.vaccinationRecord, formData.purchaseDocument].filter(Boolean).length}/4
                      </span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}