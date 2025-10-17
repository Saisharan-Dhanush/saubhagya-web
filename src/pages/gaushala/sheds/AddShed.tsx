/**
 * Add Shed - Create new shed with capacity and facilities
 * Enhanced with shadcn components, validation, and better UX
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Home, AlertCircle } from 'lucide-react';
import { shedApi, type Shed } from '../../../services/gaushala/api';
import { getLoggedInUserGaushalaId } from '../../../utils/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { Textarea } from '../../../components/ui/textarea';
import { Alert, AlertDescription } from '../../../components/ui/alert';

export default function AddShed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.shedName.trim()) {
      newErrors.shedName = 'Shed name is required';
    } else if (formData.shedName.length < 3) {
      newErrors.shedName = 'Shed name must be at least 3 characters';
    }

    if (!formData.shedNumber.trim()) {
      newErrors.shedNumber = 'Shed number is required';
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    } else if (formData.capacity > 1000) {
      newErrors.capacity = 'Capacity seems too high (max 1000)';
    }

    if (formData.currentOccupancy < 0) {
      newErrors.currentOccupancy = 'Occupancy cannot be negative';
    } else if (formData.currentOccupancy > formData.capacity) {
      newErrors.currentOccupancy = 'Occupancy cannot exceed capacity';
    }

    if (formData.areaSqFt && formData.areaSqFt < 0) {
      newErrors.areaSqFt = 'Area cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await shedApi.createShed(formData);
      if (response.success) {
        navigate('/gaushala/sheds');
      } else {
        setErrors({ submit: response.error || 'Failed to create shed' });
      }
    } catch (error) {
      console.error('Error creating shed:', error);
      setErrors({ submit: 'An error occurred while creating the shed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/gaushala/sheds')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Sheds
        </Button>
        <div className="h-8 w-px bg-gray-300"></div>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3">
            <Home className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Add New Shed</h1>
            <p className="text-gray-600 text-sm">Create a new shed for housing cattle</p>
          </div>
        </div>
      </div>

      {/* Form Error Alert */}
      {errors.submit && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about the shed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shed Name */}
              <div className="space-y-2">
                <Label htmlFor="shedName">
                  Shed Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shedName"
                  placeholder="e.g., Main Cattle Shed"
                  value={formData.shedName}
                  onChange={(e) => handleChange('shedName', e.target.value)}
                  className={errors.shedName ? 'border-red-500' : ''}
                />
                {errors.shedName && (
                  <p className="text-sm text-red-500">{errors.shedName}</p>
                )}
              </div>

              {/* Shed Number */}
              <div className="space-y-2">
                <Label htmlFor="shedNumber">
                  Shed Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shedNumber"
                  placeholder="e.g., SHED-A1"
                  value={formData.shedNumber}
                  onChange={(e) => handleChange('shedNumber', e.target.value)}
                  className={errors.shedNumber ? 'border-red-500' : ''}
                />
                {errors.shedNumber && (
                  <p className="text-sm text-red-500">{errors.shedNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Capacity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="Maximum number of animals"
                  value={formData.capacity || ''}
                  onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                  className={errors.capacity ? 'border-red-500' : ''}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500">{errors.capacity}</p>
                )}
              </div>

              {/* Current Occupancy */}
              <div className="space-y-2">
                <Label htmlFor="currentOccupancy">Current Occupancy</Label>
                <Input
                  id="currentOccupancy"
                  type="number"
                  min="0"
                  placeholder="Number of animals currently housed"
                  value={formData.currentOccupancy || ''}
                  onChange={(e) => handleChange('currentOccupancy', parseInt(e.target.value) || 0)}
                  className={errors.currentOccupancy ? 'border-red-500' : ''}
                />
                {errors.currentOccupancy && (
                  <p className="text-sm text-red-500">{errors.currentOccupancy}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shed Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Shed Specifications</CardTitle>
            <CardDescription>Physical characteristics and facilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shed Type */}
              <div className="space-y-2">
                <Label htmlFor="shedType">Shed Type</Label>
                <Select
                  value={formData.shedType}
                  onValueChange={(value) => handleChange('shedType', value)}
                >
                  <SelectTrigger id="shedType">
                    <SelectValue placeholder="Select shed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="COVERED">Covered</SelectItem>
                    <SelectItem value="SEMI_COVERED">Semi-Covered</SelectItem>
                    <SelectItem value="ENCLOSED">Enclosed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label htmlFor="areaSqFt">Area (sq ft)</Label>
                <Input
                  id="areaSqFt"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Total area in square feet"
                  value={formData.areaSqFt || ''}
                  onChange={(e) => handleChange('areaSqFt', parseFloat(e.target.value) || 0)}
                  className={errors.areaSqFt ? 'border-red-500' : ''}
                />
                {errors.areaSqFt && (
                  <p className="text-sm text-red-500">{errors.areaSqFt}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ventilation Type */}
              <div className="space-y-2">
                <Label htmlFor="ventilationType">Ventilation Type</Label>
                <Input
                  id="ventilationType"
                  placeholder="e.g., Natural, Mechanical"
                  value={formData.ventilationType}
                  onChange={(e) => handleChange('ventilationType', e.target.value)}
                />
              </div>

              {/* Flooring Type */}
              <div className="space-y-2">
                <Label htmlFor="flooringType">Flooring Type</Label>
                <Input
                  id="flooringType"
                  placeholder="e.g., Concrete, Earthen"
                  value={formData.flooringType}
                  onChange={(e) => handleChange('flooringType', e.target.value)}
                />
              </div>
            </div>

            {/* Facilities */}
            <div className="space-y-4">
              <Label>Facilities Available</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="waterFacility"
                    checked={formData.waterFacility}
                    onCheckedChange={(checked) =>
                      handleChange('waterFacility', checked === true)
                    }
                  />
                  <Label
                    htmlFor="waterFacility"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Water Facility
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="feedingFacility"
                    checked={formData.feedingFacility}
                    onCheckedChange={(checked) =>
                      handleChange('feedingFacility', checked === true)
                    }
                  />
                  <Label
                    htmlFor="feedingFacility"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Feeding Facility
                  </Label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about the shed..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-initial"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Create Shed
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/gaushala/sheds')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
