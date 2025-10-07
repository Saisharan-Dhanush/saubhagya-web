/**
 * Add Medical Record - Create new health record
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Heart } from 'lucide-react';
import { healthRecordsApi, cattleApi, type HealthRecord, type Cattle } from '../../../services/gaushala/api';
import { getLoggedInUserGaushalaId } from '../../../utils/auth';

export default function AddMedicalRecord() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [loadingCattle, setLoadingCattle] = useState(true);
  const [formData, setFormData] = useState<Partial<HealthRecord>>({
    cattleId: 0,
    gaushalaId: 0,
    recordType: 'VACCINATION',
    recordDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    medications: '',
    vaccineName: '',
    vaccineManufacturer: '',
    nextVaccinationDate: '',
    nextCheckupDate: '',
    veterinarianName: '',
    veterinarianContact: '',
    cost: 0,
    notes: '',
    status: 'COMPLETED',
  });

  useEffect(() => {
    const gaushalaId = getLoggedInUserGaushalaId();
    if (gaushalaId) {
      setFormData((prev) => ({ ...prev, gaushalaId }));
      loadCattle();
    }
  }, []);

  const loadCattle = async () => {
    setLoadingCattle(true);
    try {
      const response = await cattleApi.getAllCattle(0, 100);
      if (response.success && response.data) {
        setCattle(response.data.content);
      }
    } catch (error) {
      console.error('Error loading cattle:', error);
    } finally {
      setLoadingCattle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cattleId || formData.cattleId === 0) {
      alert('Please select a cattle');
      return;
    }
    if (!formData.recordType) {
      alert('Please select a record type');
      return;
    }

    setLoading(true);
    try {
      const response = await healthRecordsApi.createHealthRecord(formData as HealthRecord);
      if (response.success) {
        alert('Medical record created successfully!');
        navigate('/gaushala/health/records');
      } else {
        alert('Failed to create record: ' + response.error);
      }
    } catch (error) {
      console.error('Error creating record:', error);
      alert('Error creating record');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof HealthRecord, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/gaushala/health/records')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Back to Records
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-blue-100 p-3">
          <Heart className="text-blue-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold">Add Medical Record</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Cattle *</label>
            {loadingCattle ? (
              <div className="text-sm text-gray-500">Loading cattle...</div>
            ) : (
              <select
                value={formData.cattleId}
                onChange={(e) => handleChange('cattleId', parseInt(e.target.value))}
                className="w-full rounded-lg border px-4 py-2"
                required
              >
                <option value={0}>Select a cattle</option>
                {cattle.map((cow) => (
                  <option key={cow.id} value={cow.id}>
                    {cow.rfidTagNo} - {cow.name || `Cattle #${cow.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Record Type *</label>
            <select
              value={formData.recordType}
              onChange={(e) => handleChange('recordType', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
              required
            >
              <option value="VACCINATION">Vaccination</option>
              <option value="TREATMENT">Treatment</option>
              <option value="CHECKUP">Checkup</option>
              <option value="SURGERY">Surgery</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Record Date *</label>
          <input
            type="date"
            value={formData.recordDate}
            onChange={(e) => handleChange('recordDate', e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
            required
          />
        </div>

        {/* Vaccination specific fields */}
        {formData.recordType === 'VACCINATION' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine Name</label>
              <input
                type="text"
                value={formData.vaccineName}
                onChange={(e) => handleChange('vaccineName', e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
                placeholder="e.g., FMD Vaccine"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
              <input
                type="text"
                value={formData.vaccineManufacturer}
                onChange={(e) => handleChange('vaccineManufacturer', e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>
          </div>
        )}

        {/* Treatment/Checkup specific fields */}
        {(formData.recordType === 'TREATMENT' || formData.recordType === 'CHECKUP' || formData.recordType === 'SURGERY') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
                rows={2}
                placeholder="Diagnosis details..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
              <textarea
                value={formData.treatment}
                onChange={(e) => handleChange('treatment', e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
                rows={2}
                placeholder="Treatment provided..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medications</label>
              <input
                type="text"
                value={formData.medications}
                onChange={(e) => handleChange('medications', e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
                placeholder="Medicines prescribed..."
              />
            </div>
          </>
        )}

        {/* Veterinarian details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Veterinarian Name</label>
            <input
              type="text"
              value={formData.veterinarianName}
              onChange={(e) => handleChange('veterinarianName', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Veterinarian Contact</label>
            <input
              type="text"
              value={formData.veterinarianContact}
              onChange={(e) => handleChange('veterinarianContact', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="+91XXXXXXXXXX"
            />
          </div>
        </div>

        {/* Follow-up dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Next Vaccination Date</label>
            <input
              type="date"
              value={formData.nextVaccinationDate}
              onChange={(e) => handleChange('nextVaccinationDate', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Next Checkup Date</label>
            <input
              type="date"
              value={formData.nextCheckupDate}
              onChange={(e) => handleChange('nextCheckupDate', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cost (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            >
              <option value="COMPLETED">Completed</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
            rows={3}
            placeholder="Additional notes..."
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Save size={20} />
                Save Record
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/gaushala/health/records')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
