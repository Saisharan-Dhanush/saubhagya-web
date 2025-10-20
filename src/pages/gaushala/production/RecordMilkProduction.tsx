/**
 * Record Milk Production - Create new milk production record
 * Updated to use shed-based tracking instead of individual cattle tracking
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Milk } from 'lucide-react';
import { milkProductionApi, shedApi, type MilkRecord, type Shed } from '../../../services/gaushala/api';
import { getLoggedInUserGaushalaId } from '../../../utils/auth';

export default function RecordMilkProduction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sheds, setSheds] = useState<Shed[]>([]);
  const [loadingSheds, setLoadingSheds] = useState(true);
  const [formData, setFormData] = useState<Partial<MilkRecord>>({
    shedNumber: '',
    gaushalaId: 0,
    milkQuantity: 0,
    fatPercentage: 0,
    snf: 0,
    notes: '',
    status: 'RECORDED',
  });

  useEffect(() => {
    // Get gaushalaId from JWT, or use fallback for testing
    const gaushalaId = getLoggedInUserGaushalaId() || 15;
    setFormData((prev) => ({ ...prev, gaushalaId }));
    loadSheds();
  }, []);

  const loadSheds = async () => {
    setLoadingSheds(true);
    try {
      // Load list of sheds
      const response = await shedApi.getAllSheds(0, 100);
      if (response.success && response.data) {
        // Filter only active sheds
        const activeSheds = response.data.content.filter(
          (shed) => shed.status === 'ACTIVE'
        );
        setSheds(activeSheds);
      }
    } catch (error) {
      console.error('Error loading sheds:', error);
    } finally {
      setLoadingSheds(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shedNumber || formData.shedNumber === '') {
      alert('Please select a shed');
      return;
    }
    if (!formData.milkQuantity || formData.milkQuantity <= 0) {
      alert('Milk quantity must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const response = await milkProductionApi.createMilkRecord(formData as MilkRecord);
      if (response.success) {
        alert('Milk production record created successfully!');
        navigate('/gaushala/production');
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

  const handleChange = (field: keyof MilkRecord, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/gaushala/production')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Back to Records
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-blue-100 p-3">
          <Milk className="text-blue-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold">Record Milk Production</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Shed *
            </label>
            {loadingSheds ? (
              <div className="text-sm text-gray-500">Loading sheds...</div>
            ) : (
              <select
                value={formData.shedNumber}
                onChange={(e) => handleChange('shedNumber', e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
                required
              >
                <option value="">Select a shed</option>
                {sheds.map((shed) => (
                  <option key={shed.id} value={shed.shedNumber}>
                    {shed.shedNumber} - {shed.shedName} (Capacity: {shed.currentOccupancy}/{shed.capacity})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Milk Quantity (Liters) *
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.milkQuantity}
              onChange={(e) => handleChange('milkQuantity', parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Total liters collected from this shed"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fat Percentage
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.fatPercentage}
              onChange={(e) => handleChange('fatPercentage', parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="e.g., 4.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SNF (Solids Not Fat)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.snf}
              onChange={(e) => handleChange('snf', parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="e.g., 8.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="RECORDED">Recorded</option>
            <option value="VERIFIED">Verified</option>
            <option value="PROCESSED">Processed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
            rows={3}
            placeholder="Additional notes about this production record (e.g., morning/evening collection, quality observations)..."
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
            onClick={() => navigate('/gaushala/production')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
