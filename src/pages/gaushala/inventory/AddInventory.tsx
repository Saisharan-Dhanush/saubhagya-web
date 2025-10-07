/**
 * Add Inventory - Create new inventory item
 * Form with master data dropdowns loaded from API
 * 100% API-driven with NO hardcoded data
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package } from 'lucide-react';
import {
  inventoryApi,
  type Inventory,
  type InventoryType,
  type InventoryUnit,
} from '../../../services/gaushala/api';
import { getLoggedInUserGaushalaId } from '../../../utils/auth';

export default function AddInventory() {
  const navigate = useNavigate();

  // State
  const [inventoryTypes, setInventoryTypes] = useState<InventoryType[]>([]);
  const [inventoryUnits, setInventoryUnits] = useState<InventoryUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    inventoryTypeId: 0,
    inventoryUnitId: 0,
    quantity: 0,
    minimumStockLevel: 0,  // Changed from reorderLevel to match backend
    supplier: '',
    gaushalaId: 1,  // Default to 1
  });

  // Load master data from API
  useEffect(() => {
    loadMasterData();
    loadGaushalaId();
  }, []);

  const loadMasterData = async () => {
    try {
      const [typesResponse, unitsResponse] = await Promise.all([
        inventoryApi.getInventoryTypes(),
        inventoryApi.getInventoryUnits(),
      ]);

      if (typesResponse.success && typesResponse.data) {
        setInventoryTypes(typesResponse.data);
      }

      if (unitsResponse.success && unitsResponse.data) {
        setInventoryUnits(unitsResponse.data);
      }
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const loadGaushalaId = () => {
    const gaushalaId = getLoggedInUserGaushalaId();
    // Always set gaushalaId - use from token or default to 1
    setFormData(prev => ({ ...prev, gaushalaId: gaushalaId || 1 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.itemName.trim()) {
      alert('Please enter item name');
      return;
    }
    if (formData.inventoryTypeId === 0) {
      alert('Please select inventory type');
      return;
    }
    if (formData.inventoryUnitId === 0) {
      alert('Please select unit');
      return;
    }

    setLoading(true);
    try {
      const response = await inventoryApi.createInventory(formData);

      if (response.success) {
        alert('Inventory item created successfully!');
        navigate('/gaushala/inventory');
      } else {
        alert('Failed to create inventory item: ' + response.error);
      }
    } catch (error) {
      console.error('Error creating inventory:', error);
      alert('Error creating inventory item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/gaushala/inventory')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Inventory
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3">
            <Package className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Inventory Item</h1>
            <p className="text-sm text-gray-500">Create a new inventory item</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.itemName}
            onChange={(e) => handleChange('itemName', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter item name"
            required
          />
        </div>

        {/* Inventory Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inventory Type <span className="text-red-500">*</span>
          </label>
          {inventoryTypes.length === 0 ? (
            <div className="text-sm text-gray-500">Loading types...</div>
          ) : (
            <select
              value={formData.inventoryTypeId}
              onChange={(e) => handleChange('inventoryTypeId', parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={0}>Select inventory type</option>
              {inventoryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit <span className="text-red-500">*</span>
          </label>
          {inventoryUnits.length === 0 ? (
            <div className="text-sm text-gray-500">Loading units...</div>
          ) : (
            <select
              value={formData.inventoryUnitId}
              onChange={(e) => handleChange('inventoryUnitId', parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={0}>Select unit</option>
              {inventoryUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unitName} {unit.unitSymbol ? `(${unit.unitSymbol})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Reorder Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reorder Level <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.minimumStockLevel}
            onChange={(e) => handleChange('minimumStockLevel', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter reorder level"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Alert will be shown when quantity falls below this level
          </p>
        </div>

        {/* Supplier (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supplier
          </label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => handleChange('supplier', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter supplier name (optional)"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save size={20} />
                Create Inventory Item
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/gaushala/inventory')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}