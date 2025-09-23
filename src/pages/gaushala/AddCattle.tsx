/**
 * Add Cattle Page - Create new cattle records with RFID
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Scan, Save, ArrowLeft, Upload, MapPin, Calendar } from 'lucide-react';
import { gauShalaApi } from '../../services/gaushala/api';

interface LanguageContextType {
  language: 'hi' | 'en';
  t: (key: string) => string;
}

interface AddCattleProps {
  languageContext: LanguageContextType;
}

const translations = {
  en: {
    title: 'Add New Cattle',
    subtitle: 'Register new cattle with RFID tracking',
    basicInfo: 'Basic Information',
    name: 'Cattle Name',
    nameHint: 'Enter a unique name for the cattle',
    rfidTag: 'RFID Tag',
    rfidHint: 'Scan or enter RFID tag manually',
    scanRfid: 'Scan RFID',
    breed: 'Breed',
    selectBreed: 'Select Breed',
    age: 'Age (months)',
    weight: 'Weight (kg)',
    health: 'Health Status',
    selectHealth: 'Select Health Status',
    ownerInfo: 'Owner Information',
    ownerName: 'Owner Name',
    ownerId: 'Owner ID/Phone',
    locationInfo: 'Location Information',
    address: 'Address',
    latitude: 'Latitude',
    longitude: 'Longitude',
    getCurrentLocation: 'Get Current Location',
    photo: 'Cattle Photo',
    uploadPhoto: 'Upload Photo',
    medicalInfo: 'Medical Information',
    lastCheckup: 'Last Checkup Date',
    nextCheckup: 'Next Checkup Date',
    vaccination: 'Vaccination Status',
    notes: 'Additional Notes',
    save: 'Save Cattle',
    cancel: 'Cancel',
    saving: 'Saving...',
    success: 'Cattle added successfully!',
    error: 'Failed to add cattle. Please try again.',
    required: 'This field is required',
    breeds: {
      gir: 'Gir',
      sindhi: 'Red Sindhi',
      holstein: 'Holstein Friesian',
      jersey: 'Jersey',
      sahiwal: 'Sahiwal',
      tharparkar: 'Tharparkar'
    },
    healthStatus: {
      healthy: 'Healthy',
      sick: 'Sick',
      recovering: 'Recovering',
      vaccination_due: 'Vaccination Due'
    }
  },
  hi: {
    title: 'नया पशु जोड़ें',
    subtitle: 'RFID ट्रैकिंग के साथ नया पशु पंजीकरण',
    basicInfo: 'बुनियादी जानकारी',
    name: 'पशु का नाम',
    nameHint: 'पशु के लिए एक अनूठा नाम दर्ज करें',
    rfidTag: 'RFID टैग',
    rfidHint: 'RFID टैग स्कैन करें या मैन्युअल रूप से दर्ज करें',
    scanRfid: 'RFID स्कैन करें',
    breed: 'नस्ल',
    selectBreed: 'नस्ल चुनें',
    age: 'आयु (महीने)',
    weight: 'वजन (किलो)',
    health: 'स्वास्थ्य स्थिति',
    selectHealth: 'स्वास्थ्य स्थिति चुनें',
    ownerInfo: 'मालिक की जानकारी',
    ownerName: 'मालिक का नाम',
    ownerId: 'मालिक ID/फोन',
    locationInfo: 'स्थान की जानकारी',
    address: 'पता',
    latitude: 'अक्षांश',
    longitude: 'देशांतर',
    getCurrentLocation: 'वर्तमान स्थान प्राप्त करें',
    photo: 'पशु की फोटो',
    uploadPhoto: 'फोटो अपलोड करें',
    medicalInfo: 'चिकित्सा जानकारी',
    lastCheckup: 'अंतिम जांच की तारीख',
    nextCheckup: 'अगली जांच की तारीख',
    vaccination: 'टीकाकरण की स्थिति',
    notes: 'अतिरिक्त नोट्स',
    save: 'पशु सहेजें',
    cancel: 'रद्द करें',
    saving: 'सहेजा जा रहा है...',
    success: 'पशु सफलतापूर्वक जोड़ा गया!',
    error: 'पशु जोड़ने में विफल। कृपया पुनः प्रयास करें।',
    required: 'यह फील्ड आवश्यक है',
    breeds: {
      gir: 'गिर',
      sindhi: 'लाल सिंधी',
      holstein: 'होल्स्टीन फ्रीजियन',
      jersey: 'जर्सी',
      sahiwal: 'साहीवाल',
      tharparkar: 'थारपारकर'
    },
    healthStatus: {
      healthy: 'स्वस्थ',
      sick: 'बीमार',
      recovering: 'ठीक हो रहा',
      vaccination_due: 'टीकाकरण देय'
    }
  }
};

export default function AddCattle({ languageContext }: AddCattleProps) {
  const { t } = languageContext;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    rfidTag: '',
    breed: 'gir', // Default breed like mobile app
    age: '5', // Default age like mobile app
    weight: '450', // Default weight like mobile app
    health: 'healthy' as const,
    owner: '',
    ownerId: '1', // Default ownerId like mobile app
    location: {
      latitude: '23.7126',
      longitude: '76.6566',
      address: ''
    }
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Match the breeds from mobile app exactly
  const breeds = ['gir', 'sahiwal', 'sindhi', 'tharparkar', 'holstein', 'jersey'];
  const healthOptions = ['healthy', 'sick', 'recovering', 'vaccination_due'];

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setMessage(null);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleScanRfid = async () => {
    setIsScanning(true);
    try {
      const response = await gauShalaApi.cattle.scanRfid();
      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          rfidTag: response.data!.rfidTag
        }));

        if (response.data.cattleInfo) {
          setMessage({
            type: 'error',
            text: 'RFID tag already exists for another cattle'
          });
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to scan RFID'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            }
          }));
        },
        (error) => {
          setMessage({
            type: 'error',
            text: 'Failed to get current location'
          });
        }
      );
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.rfidTag || !formData.breed || !formData.owner) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Format data exactly like mobile app
      const cattleData = {
        tagId: formData.rfidTag.toUpperCase(), // Ensure uppercase RFID like mobile app
        name: formData.name,
        breed: formData.breed,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        health: formData.health,
        location: {
          latitude: 23.7126, // Default location like mobile app
          longitude: 76.6566,
          timestamp: new Date().toISOString(),
        },
        ownerId: formData.ownerId,
        ownerName: formData.owner,
        totalDungCollected: 0,
        isActive: true,
        photoUrl: '', // Optional field
        lastDungCollection: null, // Optional field
      };

      const response = await gauShalaApi.cattle.createCattle(cattleData);

      if (response.success && response.data) {
        // Upload photo if provided
        if (photoFile) {
          await gauShalaApi.cattle.uploadPhoto(response.data.id, photoFile);
        }

        setMessage({
          type: 'success',
          text: translations[languageContext.language].success
        });

        // Navigate back to cattle list after a delay
        setTimeout(() => {
          navigate('/gaushala/cattle');
        }, 2000);
      } else {
        throw new Error(response.error || 'Failed to create cattle');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: translations[languageContext.language].error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/gaushala/cattle');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {translations[languageContext.language].cancel}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
              <span className="text-3xl">🐄</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {translations[languageContext.language].title}
              </h1>
              <p className="text-gray-600">
                {translations[languageContext.language].subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🐄</span>
              {translations[languageContext.language].basicInfo}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].name} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={translations[languageContext.language].nameHint}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].rfidTag} *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.rfidTag}
                    onChange={(e) => handleInputChange('rfidTag', e.target.value)}
                    placeholder={translations[languageContext.language].rfidHint}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleScanRfid}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Scan className="h-4 w-4" />
                    {isScanning ? '...' : translations[languageContext.language].scanRfid}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].breed} *
                </label>
                <select
                  value={formData.breed}
                  onChange={(e) => handleInputChange('breed', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">{translations[languageContext.language].selectBreed}</option>
                  {breeds.map(breed => (
                    <option key={breed} value={breed}>
                      {translations[languageContext.language].breeds[breed]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].health}
                </label>
                <select
                  value={formData.health}
                  onChange={(e) => handleInputChange('health', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {healthOptions.map(health => (
                    <option key={health} value={health}>
                      {translations[languageContext.language].healthStatus[health]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].age}
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].weight}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {translations[languageContext.language].ownerInfo}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].ownerName} *
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].ownerId}
                </label>
                <input
                  type="text"
                  value={formData.ownerId}
                  onChange={(e) => handleInputChange('ownerId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              {translations[languageContext.language].locationInfo}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].address}
                </label>
                <textarea
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations[languageContext.language].latitude}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.latitude}
                    onChange={(e) => handleInputChange('location.latitude', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations[languageContext.language].longitude}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.longitude}
                    onChange={(e) => handleInputChange('location.longitude', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <MapPin className="h-4 w-4" />
                    {translations[languageContext.language].getCurrentLocation}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              {translations[languageContext.language].photo}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations[languageContext.language].uploadPhoto}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {photoFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {photoFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {translations[languageContext.language].medicalInfo}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].lastCheckup}
                </label>
                <input
                  type="date"
                  value={formData.lastCheckup}
                  onChange={(e) => handleInputChange('lastCheckup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].nextCheckup}
                </label>
                <input
                  type="date"
                  value={formData.nextCheckup}
                  onChange={(e) => handleInputChange('nextCheckup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].vaccination}
                </label>
                <input
                  type="text"
                  value={formData.vaccination}
                  onChange={(e) => handleInputChange('vaccination', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations[languageContext.language].notes}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {translations[languageContext.language].cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isLoading
                ? translations[languageContext.language].saving
                : translations[languageContext.language].save
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}