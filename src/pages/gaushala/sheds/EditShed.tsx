/**
 * Edit Shed - Update existing shed details
 * Loads data from GET /api/v1/gaushala/sheds/{id} before rendering
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Home } from 'lucide-react';
import { shedApi, type Shed } from '../../../services/gaushala/api';

export default function EditShed() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Shed>>({});

  useEffect(() => {
    if (id) loadShed();
  }, [id]);

  const loadShed = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await shedApi.getShedById(parseInt(id));
      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error loading shed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      const response = await shedApi.updateShed(parseInt(id), formData);
      if (response.success) {
        alert('Shed updated successfully!');
        navigate('/gaushala/sheds');
      } else {
        alert('Failed to update shed: ' + response.error);
      }
    } catch (error) {
      console.error('Error updating shed:', error);
      alert('Error updating shed');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Shed, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate('/gaushala/sheds')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft size={20} />Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-blue-100 p-3"><Home className="text-blue-600" size={24} /></div>
        <h1 className="text-2xl font-bold">Edit Shed</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shed Name *</label>
            <input type="text" value={formData.shedName || ''} onChange={(e) => handleChange('shedName', e.target.value)} className="w-full rounded-lg border px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shed Number *</label>
            <input type="text" value={formData.shedNumber || ''} onChange={(e) => handleChange('shedNumber', e.target.value)} className="w-full rounded-lg border px-4 py-2" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
            <input type="number" min="1" value={formData.capacity || 0} onChange={(e) => handleChange('capacity', parseInt(e.target.value))} className="w-full rounded-lg border px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Occupancy</label>
            <input type="number" min="0" value={formData.currentOccupancy || 0} onChange={(e) => handleChange('currentOccupancy', parseInt(e.target.value))} className="w-full rounded-lg border px-4 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select value={formData.status || 'ACTIVE'} onChange={(e) => handleChange('status', e.target.value)} className="w-full rounded-lg border px-4 py-2">
            <option value="ACTIVE">Active</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea value={formData.notes || ''} onChange={(e) => handleChange('notes', e.target.value)} className="w-full rounded-lg border px-4 py-2" rows={3}></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
            <Save size={20} />{saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/gaushala/sheds')} className="px-6 py-2 border rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
}
