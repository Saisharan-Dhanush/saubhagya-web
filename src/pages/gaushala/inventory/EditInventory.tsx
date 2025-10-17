/**
 * Edit Inventory - Update existing inventory item
 * Loads data from API before rendering form
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Package } from 'lucide-react';
import {
  inventoryApi,
  type Inventory,
  type InventoryType,
  type InventoryUnit,
} from '../../../services/gaushala/api';

export default function EditInventory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [inventoryTypes, setInventoryTypes] = useState<InventoryType[]>([]);
  const [inventoryUnits, setInventoryUnits] = useState<InventoryUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Inventory>>({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [inventoryResponse, typesResponse, unitsResponse] = await Promise.all([
        inventoryApi.getInventoryById(parseInt(id)),
        inventoryApi.getInventoryTypes(),
        inventoryApi.getInventoryUnits(),
      ]);

      if (inventoryResponse.success && inventoryResponse.data) {
        setFormData(inventoryResponse.data);
      }
      if (typesResponse.success && typesResponse.data) {
        setInventoryTypes(typesResponse.data);
      }
      if (unitsResponse.success && unitsResponse.data) {
        setInventoryUnits(unitsResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    setSaving(true);
    try {
      const response = await inventoryApi.updateInventory(parseInt(id), formData);

      if (response.success) {
        alert('Inventory updated successfully!');
        navigate('/gaushala/inventory');
      } else {
        alert('Failed to update inventory: ' + response.error);
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Error updating inventory');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Inventory, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/gaushala/inventory')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-blue-100 p-3">
          <Package className="text-blue-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold">Edit Inventory</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
          <input
            type="text"
            value={formData.itemName || ''}
            onChange={(e) => handleChange('itemName', e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
          <select
            value={formData.inventoryTypeId || 0}
            onChange={(e) => handleChange('inventoryTypeId', parseInt(e.target.value))}
            className="w-full rounded-lg border px-4 py-2"
            required
          >
            {inventoryTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
          <select
            value={formData.inventoryUnitId || 0}
            onChange={(e) => handleChange('inventoryUnitId', parseInt(e.target.value))}
            className="w-full rounded-lg border px-4 py-2"
            required
          >
            {inventoryUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.unitName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
          <input
            type="number"
            min="0"
            value={formData.quantity || 0}
            onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
            className="w-full rounded-lg border px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock Level *</label>
          <input
            type="number"
            min="0"
            value={formData.minimumStockLevel || 0}
            onChange={(e) => handleChange('minimumStockLevel', parseFloat(e.target.value))}
            className="w-full rounded-lg border px-4 py-2"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Alert will be shown when quantity falls below this level
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
          <input
            type="text"
            value={formData.supplier || ''}
            onChange={(e) => handleChange('supplier', e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/gaushala/inventory')}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
