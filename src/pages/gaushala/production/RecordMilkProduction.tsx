/**
 * Record Milk Production - Create new milk production record
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Milk } from 'lucide-react';
import { milkProductionApi, cattleApi, type MilkRecord, type Cattle } from '../../../services/gaushala/api';
import { getLoggedInUserGaushalaId } from '../../../utils/auth';

export default function RecordMilkProduction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [loadingCattle, setLoadingCattle] = useState(true);
  const [formData, setFormData] = useState<Partial<MilkRecord>>({
    cowId: 0,
    gaushalaId: 0,
    recordDate: new Date().toISOString().split('T')[0],
    morningQuantity: 0,
    eveningQuantity: 0,
    fatPercentage: 0,
    snfPercentage: 0,
    quality: 'GOOD',
    notes: '',
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
      // Load cattle list - filter for milking cows if possible
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

    if (!formData.cowId || formData.cowId === 0) {
      alert('Please select a cow');
      return;
    }
    if (!formData.recordDate) {
      alert('Please select a date');
      return;
    }
    if (formData.morningQuantity! < 0 || formData.eveningQuantity! < 0) {
      alert('Quantities cannot be negative');
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

  const calculateTotal = (): number => {
    return (formData.morningQuantity || 0) + (formData.eveningQuantity || 0);
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Cow *
            </label>
            {loadingCattle ? (
              <div className="text-sm text-gray-500">Loading cattle...</div>
            ) : (
              <select
                value={formData.cowId}
                onChange={(e) => handleChange('cowId', parseInt(e.target.value))}
                className="w-full rounded-lg border px-4 py-2"
                required
              >
                <option value={0}>Select a cow</option>
                {cattle.map((cow) => (
                  <option key={cow.id} value={cow.id}>
                    {cow.rfidTagNo} - {cow.name || `Cow #${cow.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Date *
            </label>
            <input
              type="date"
              value={formData.recordDate}
              onChange={(e) => handleChange('recordDate', e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Morning Quantity (Liters) *
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.morningQuantity}
              onChange={(e) => handleChange('morningQuantity', parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evening Quantity (Liters) *
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.eveningQuantity}
              onChange={(e) => handleChange('eveningQuantity', parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border px-4 py-2"
              required
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Total Quantity:</span>
            <span className="text-xl font-bold text-blue-900">{calculateTotal().toFixed(2)} L</span>
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
              SNF Percentage
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.snfPercentage}
              onChange={(e) => handleChange('snfPercentage', parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="e.g., 8.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality
          </label>
          <select
            value={formData.quality}
            onChange={(e) => handleChange('quality', e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="EXCELLENT">Excellent</option>
            <option value="GOOD">Good</option>
            <option value="AVERAGE">Average</option>
            <option value="POOR">Poor</option>
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
            placeholder="Additional notes about this production record..."
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
