/**
 * Add Shed - Create new shed with capacity and facilities
 * 100% API-driven, NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Home } from 'lucide-react';
import { shedApi, type Shed } from '../../../services/gaushala/api';
import { getLoggedInUserGaushalaId } from '../../../utils/auth';

export default function AddShed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gaushalaId: 0,
    shedName: '',
    shedNumber: '',
    capacity: 0,
    currentOccupancy: 0,
    shedType: '',
    areaSqFt: 0,
    ventilationType: '',
    flooringType: '',
    waterFacility: false,
    feedingFacility: false,
    status: 'ACTIVE',
    notes: '',
  });

  useEffect(() => {
    const gaushalaId = getLoggedInUserGaushalaId();
    if (gaushalaId) {
      setFormData(prev => ({ ...prev, gaushalaId }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shedName.trim() || !formData.shedNumber.trim()) {
      alert('Please enter shed name and number');
      return;
    }
    if (formData.capacity <= 0) {
      alert('Capacity must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const response = await shedApi.createShed(formData);
      if (response.success) {
        alert('Shed created successfully!');
        navigate('/gaushala/sheds');
      } else {
        alert('Failed to create shed: ' + response.error);
      }
    } catch (error) {
      console.error('Error creating shed:', error);
      alert('Error creating shed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate('/gaushala/sheds')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft size={20} />Back to Sheds
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-blue-100 p-3">
          <Home className="text-blue-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold">Add New Shed</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shed Name *</label>
            <input type="text" value={formData.shedName} onChange={(e) => handleChange('shedName', e.target.value)} className="w-full rounded-lg border px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shed Number *</label>
            <input type="text" value={formData.shedNumber} onChange={(e) => handleChange('shedNumber', e.target.value)} className="w-full rounded-lg border px-4 py-2" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
            <input type="number" min="1" value={formData.capacity} onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)} className="w-full rounded-lg border px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Occupancy</label>
            <input type="number" min="0" value={formData.currentOccupancy} onChange={(e) => handleChange('currentOccupancy', parseInt(e.target.value) || 0)} className="w-full rounded-lg border px-4 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shed Type</label>
            <select value={formData.shedType} onChange={(e) => handleChange('shedType', e.target.value)} className="w-full rounded-lg border px-4 py-2">
              <option value="">Select type</option>
              <option value="OPEN">Open</option>
              <option value="COVERED">Covered</option>
              <option value="SEMI_COVERED">Semi-Covered</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area (sq ft)</label>
            <input type="number" min="0" step="0.01" value={formData.areaSqFt} onChange={(e) => handleChange('areaSqFt', parseFloat(e.target.value) || 0)} className="w-full rounded-lg border px-4 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ventilation Type</label>
            <input type="text" value={formData.ventilationType} onChange={(e) => handleChange('ventilationType', e.target.value)} className="w-full rounded-lg border px-4 py-2" placeholder="e.g., Natural, Mechanical" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flooring Type</label>
            <input type="text" value={formData.flooringType} onChange={(e) => handleChange('flooringType', e.target.value)} className="w-full rounded-lg border px-4 py-2" placeholder="e.g., Concrete, Earthen" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="waterFacility" checked={formData.waterFacility} onChange={(e) => handleChange('waterFacility', e.target.checked)} className="rounded" />
            <label htmlFor="waterFacility" className="text-sm font-medium text-gray-700">Water Facility</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="feedingFacility" checked={formData.feedingFacility} onChange={(e) => handleChange('feedingFacility', e.target.checked)} className="rounded" />
            <label htmlFor="feedingFacility" className="text-sm font-medium text-gray-700">Feeding Facility</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full rounded-lg border px-4 py-2">
            <option value="ACTIVE">Active</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} className="w-full rounded-lg border px-4 py-2" rows={3} placeholder="Additional notes..."></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating...' : <><Save size={20} />Create Shed</>}
          </button>
          <button type="button" onClick={() => navigate('/gaushala/sheds')} className="px-6 py-2 border rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
}
