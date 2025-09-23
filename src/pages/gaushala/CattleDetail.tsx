/**
 * Cattle Detail Page - View and Update cattle information
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit,
  Save,
  ArrowLeft,
  Calendar,
  MapPin,
  Activity,
  Heart,
  FileText,
  Camera,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { gauShalaApi, Cattle, MedicalRecord } from '../../services/gaushala/api';

interface LanguageContextType {
  language: 'hi' | 'en';
  t: (key: string) => string;
}

interface CattleDetailProps {
  languageContext: LanguageContextType;
}

const translations = {
  en: {
    title: 'Cattle Details',
    subtitle: 'View and manage cattle information',
    edit: 'Edit',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete Cattle',
    confirmDelete: 'Are you sure you want to delete this cattle record?',
    basicInfo: 'Basic Information',
    name: 'Name',
    rfidTag: 'RFID Tag',
    breed: 'Breed',
    age: 'Age',
    weight: 'Weight',
    health: 'Health Status',
    owner: 'Owner',
    ownerId: 'Owner ID',
    locationInfo: 'Location Information',
    address: 'Address',
    coordinates: 'Coordinates',
    medicalHistory: 'Medical History',
    addMedicalRecord: 'Add Medical Record',
    collectionHistory: 'Collection History',
    totalCollected: 'Total Dung Collected',
    lastCollection: 'Last Collection',
    photo: 'Photo',
    changePhoto: 'Change Photo',
    loading: 'Loading...',
    saving: 'Saving...',
    success: 'Cattle updated successfully!',
    error: 'Failed to update cattle',
    notFound: 'Cattle not found',
    medicalRecordType: 'Type',
    medicalRecordDate: 'Date',
    medicalRecordDescription: 'Description',
    medicalRecordVet: 'Veterinarian',
    medicalRecordMedication: 'Medication',
    medicalRecordNextCheckup: 'Next Checkup',
    recordTypes: {
      checkup: 'Checkup',
      vaccination: 'Vaccination',
      treatment: 'Treatment',
      surgery: 'Surgery'
    },
    healthStatus: {
      healthy: 'Healthy',
      sick: 'Sick',
      recovering: 'Recovering',
      vaccination_due: 'Vaccination Due'
    },
    breeds: {
      gir: 'Gir',
      sindhi: 'Red Sindhi',
      holstein: 'Holstein Friesian',
      jersey: 'Jersey',
      sahiwal: 'Sahiwal',
      tharparkar: 'Tharparkar'
    }
  },
  hi: {
    title: 'पशु विवरण',
    subtitle: 'पशु की जानकारी देखें और प्रबंधित करें',
    edit: 'संपादित करें',
    save: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',
    delete: 'पशु हटाएं',
    confirmDelete: 'क्या आप वाकई इस पशु का रिकॉर्ड हटाना चाहते हैं?',
    basicInfo: 'बुनियादी जानकारी',
    name: 'नाम',
    rfidTag: 'RFID टैग',
    breed: 'नस्ल',
    age: 'आयु',
    weight: 'वजन',
    health: 'स्वास्थ्य स्थिति',
    owner: 'मालिक',
    ownerId: 'मालिक ID',
    locationInfo: 'स्थान की जानकारी',
    address: 'पता',
    coordinates: 'निर्देशांक',
    medicalHistory: 'चिकित्सा इतिहास',
    addMedicalRecord: 'चिकित्सा रिकॉर्ड जोड़ें',
    collectionHistory: 'संग्रह इतिहास',
    totalCollected: 'कुल गोबर संग्रह',
    lastCollection: 'अंतिम संग्रह',
    photo: 'फोटो',
    changePhoto: 'फोटो बदलें',
    loading: 'लोड हो रहा है...',
    saving: 'सहेजा जा रहा है...',
    success: 'पशु सफलतापूर्वक अपडेट किया गया!',
    error: 'पशु अपडेट करने में विफल',
    notFound: 'पशु नहीं मिला',
    medicalRecordType: 'प्रकार',
    medicalRecordDate: 'तारीख',
    medicalRecordDescription: 'विवरण',
    medicalRecordVet: 'पशु चिकित्सक',
    medicalRecordMedication: 'दवा',
    medicalRecordNextCheckup: 'अगली जांच',
    recordTypes: {
      checkup: 'जांच',
      vaccination: 'टीकाकरण',
      treatment: 'उपचार',
      surgery: 'सर्जरी'
    },
    healthStatus: {
      healthy: 'स्वस्थ',
      sick: 'बीमार',
      recovering: 'ठीक हो रहा',
      vaccination_due: 'टीकाकरण देय'
    },
    breeds: {
      gir: 'गिर',
      sindhi: 'लाल सिंधी',
      holstein: 'होल्स्टीन फ्रीजियन',
      jersey: 'जर्सी',
      sahiwal: 'साहीवाल',
      tharparkar: 'थारपारकर'
    }
  }
};

export default function CattleDetail({ languageContext }: CattleDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = languageContext;

  const [cattle, setCattle] = useState<Cattle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<Cattle>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newMedicalRecord, setNewMedicalRecord] = useState({
    type: 'checkup' as const,
    date: '',
    description: '',
    veterinarian: '',
    medication: '',
    nextCheckup: ''
  });
  const [showAddMedical, setShowAddMedical] = useState(false);

  useEffect(() => {
    if (id) {
      loadCattleDetail();
    }
  }, [id]);

  const loadCattleDetail = async () => {
    try {
      const response = await gauShalaApi.cattle.getCattleById(id!);
      if (response.success && response.data) {
        setCattle(response.data);
        setEditData(response.data);
      } else {
        setMessage({
          type: 'error',
          text: translations[languageContext.language].notFound
        });
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

  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(cattle || {});
    setMessage(null);
  };

  const handleSave = async () => {
    if (!cattle || !id) return;

    setIsSaving(true);
    try {
      const response = await gauShalaApi.cattle.updateCattle(id, editData);
      if (response.success && response.data) {
        setCattle(response.data);
        setIsEditing(false);
        setMessage({
          type: 'success',
          text: translations[languageContext.language].success
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: translations[languageContext.language].error
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const response = await gauShalaApi.cattle.deleteCattle(id);
      if (response.success) {
        navigate('/gaushala/cattle');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: translations[languageContext.language].error
      });
    }
    setShowDeleteConfirm(false);
  };

  const handleAddMedicalRecord = async () => {
    if (!cattle || !id) return;

    try {
      const recordData = {
        ...newMedicalRecord,
        date: new Date(newMedicalRecord.date).getTime(),
        nextCheckup: newMedicalRecord.nextCheckup ? new Date(newMedicalRecord.nextCheckup).getTime() : undefined
      };

      const response = await gauShalaApi.cattle.addMedicalRecord(id, recordData);
      if (response.success) {
        await loadCattleDetail(); // Reload to get updated medical history
        setShowAddMedical(false);
        setNewMedicalRecord({
          type: 'checkup',
          date: '',
          description: '',
          veterinarian: '',
          medication: '',
          nextCheckup: ''
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add medical record'
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getHealthStatusColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'sick': return 'text-red-600 bg-red-100';
      case 'recovering': return 'text-yellow-600 bg-yellow-100';
      case 'vaccination_due': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{translations[languageContext.language].loading}</p>
        </div>
      </div>
    );
  }

  if (!cattle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">{translations[languageContext.language].notFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/gaushala/cattle')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cattle List
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                <span className="text-3xl">🐄</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {cattle.name}
                </h1>
                <p className="text-gray-600">
                  RFID: {cattle.rfidTag}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                    {translations[languageContext.language].edit}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    {translations[languageContext.language].delete}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {translations[languageContext.language].cancel}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving
                      ? translations[languageContext.language].saving
                      : translations[languageContext.language].save
                    }
                  </button>
                </>
              )}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🐄</span>
                {translations[languageContext.language].basicInfo}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].name}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{cattle.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].rfidTag}
                  </label>
                  <p className="text-gray-900 font-mono">{cattle.rfidTag}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].breed}
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.breed || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, breed: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="gir">{translations[languageContext.language].breeds.gir}</option>
                      <option value="sindhi">{translations[languageContext.language].breeds.sindhi}</option>
                      <option value="holstein">{translations[languageContext.language].breeds.holstein}</option>
                      <option value="jersey">{translations[languageContext.language].breeds.jersey}</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{translations[languageContext.language].breeds[cattle.breed] || cattle.breed}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].health}
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.health || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, health: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="healthy">{translations[languageContext.language].healthStatus.healthy}</option>
                      <option value="sick">{translations[languageContext.language].healthStatus.sick}</option>
                      <option value="recovering">{translations[languageContext.language].healthStatus.recovering}</option>
                      <option value="vaccination_due">{translations[languageContext.language].healthStatus.vaccination_due}</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(cattle.health)}`}>
                      {translations[languageContext.language].healthStatus[cattle.health]}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].age}
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.age || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{cattle.age} months</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].weight}
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editData.weight || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{cattle.weight} kg</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].owner}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.owner || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, owner: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{cattle.owner}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].ownerId}
                  </label>
                  <p className="text-gray-900">{cattle.ownerId}</p>
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
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].address}
                  </label>
                  <p className="text-gray-900">{cattle.location.address || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].coordinates}
                  </label>
                  <p className="text-gray-900">
                    {cattle.location.latitude}, {cattle.location.longitude}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">🐄</span>
                  {translations[languageContext.language].medicalHistory}
                </h2>
                <button
                  onClick={() => setShowAddMedical(true)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <FileText className="h-4 w-4" />
                  {translations[languageContext.language].addMedicalRecord}
                </button>
              </div>

              {cattle.medicalHistory.length > 0 ? (
                <div className="space-y-4">
                  {cattle.medicalHistory.map((record, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {translations[languageContext.language].recordTypes[record.type]}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(record.date)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{record.description}</p>
                      <div className="text-sm text-gray-600">
                        <p>Veterinarian: {record.veterinarian}</p>
                        {record.medication && <p>Medication: {record.medication}</p>}
                        {record.nextCheckup && <p>Next Checkup: {formatDate(record.nextCheckup)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No medical records found</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                {translations[languageContext.language].photo}
              </h3>

              <div className="text-center">
                {cattle.photoUrl ? (
                  <img
                    src={cattle.photoUrl}
                    alt={cattle.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-6xl">🐄</span>
                  </div>
                )}

                <button className="text-sm text-blue-600 hover:text-blue-700">
                  {translations[languageContext.language].changePhoto}
                </button>
              </div>
            </div>

            {/* Collection Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                {translations[languageContext.language].collectionHistory}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].totalCollected}
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    {cattle.totalDungCollected} kg
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {translations[languageContext.language].lastCollection}
                  </label>
                  <p className="text-gray-900">
                    {cattle.lastDungCollection
                      ? formatDate(cattle.lastDungCollection)
                      : 'No collections yet'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {translations[languageContext.language].delete}
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                {translations[languageContext.language].confirmDelete}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {translations[languageContext.language].cancel}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {translations[languageContext.language].delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Medical Record Modal */}
        {showAddMedical && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {translations[languageContext.language].addMedicalRecord}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations[languageContext.language].medicalRecordType}
                  </label>
                  <select
                    value={newMedicalRecord.type}
                    onChange={(e) => setNewMedicalRecord(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checkup">{translations[languageContext.language].recordTypes.checkup}</option>
                    <option value="vaccination">{translations[languageContext.language].recordTypes.vaccination}</option>
                    <option value="treatment">{translations[languageContext.language].recordTypes.treatment}</option>
                    <option value="surgery">{translations[languageContext.language].recordTypes.surgery}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations[languageContext.language].medicalRecordDate}
                  </label>
                  <input
                    type="date"
                    value={newMedicalRecord.date}
                    onChange={(e) => setNewMedicalRecord(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations[languageContext.language].medicalRecordDescription}
                  </label>
                  <textarea
                    value={newMedicalRecord.description}
                    onChange={(e) => setNewMedicalRecord(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations[languageContext.language].medicalRecordVet}
                  </label>
                  <input
                    type="text"
                    value={newMedicalRecord.veterinarian}
                    onChange={(e) => setNewMedicalRecord(prev => ({ ...prev, veterinarian: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddMedical(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {translations[languageContext.language].cancel}
                </button>
                <button
                  onClick={handleAddMedicalRecord}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}