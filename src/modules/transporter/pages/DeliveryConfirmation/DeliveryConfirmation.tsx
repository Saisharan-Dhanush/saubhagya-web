import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Camera,
  FileText,
  PenTool,
  Package,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  Save,
  Send,
  X
} from 'lucide-react';
import { transporterService } from '../../services/mockDataService';
import { Delivery } from '../../types';

interface ConfirmationForm {
  deliveryId: string;
  confirmedBy: string;
  customerSignature: string;
  photo: string;
  notes: string;
  actualQuantity: number;
  customerSatisfaction: number;
  deliveryIssues: string[];
}

const DeliveryConfirmation: React.FC = () => {
  const [pendingDeliveries, setPendingDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [confirmationForm, setConfirmationForm] = useState<ConfirmationForm>({
    deliveryId: '',
    confirmedBy: '',
    customerSignature: '',
    photo: '',
    notes: '',
    actualQuantity: 0,
    customerSatisfaction: 5,
    deliveryIssues: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryIssueOptions = [
    'Late delivery',
    'Quantity discrepancy',
    'Quality issues',
    'Customer unavailable',
    'Access problems',
    'Equipment malfunction',
    'Documentation issues'
  ];

  useEffect(() => {
    loadPendingDeliveries();
  }, []);

  const loadPendingDeliveries = async () => {
    try {
      setLoading(true);
      const response = await transporterService.getActiveDeliveries();
      if (response.success) {
        // Filter for deliveries that need confirmation (in_transit status)
        const pendingConfirmation = response.data.filter(
          d => d.status === 'in_transit' || d.status === 'picked_up'
        );
        setPendingDeliveries(pendingConfirmation);
      } else {
        setError('Failed to load pending deliveries');
      }
    } catch (err) {
      setError('Failed to load pending deliveries');
      console.error('Pending deliveries load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setConfirmationForm({
      deliveryId: delivery.id,
      confirmedBy: 'Driver', // Default value
      customerSignature: '',
      photo: '',
      notes: '',
      actualQuantity: delivery.biogasQuantity,
      customerSatisfaction: 5,
      deliveryIssues: []
    });
  };

  const handleIssueToggle = (issue: string) => {
    const currentIssues = confirmationForm.deliveryIssues;
    const updatedIssues = currentIssues.includes(issue)
      ? currentIssues.filter(i => i !== issue)
      : [...currentIssues, issue];

    setConfirmationForm({
      ...confirmationForm,
      deliveryIssues: updatedIssues
    });
  };

  const handleSignatureCapture = () => {
    // Simulate signature capture
    setConfirmationForm({
      ...confirmationForm,
      customerSignature: `signature_${Date.now()}.png`
    });
  };

  const handlePhotoCapture = () => {
    // Simulate photo capture
    setConfirmationForm({
      ...confirmationForm,
      photo: `delivery_photo_${Date.now()}.jpg`
    });
  };

  const handleSubmitConfirmation = async () => {
    if (!selectedDelivery) return;

    try {
      setSubmitting(true);

      const response = await transporterService.confirmDelivery(
        selectedDelivery.id,
        confirmationForm
      );

      if (response.success) {
        // Remove confirmed delivery from pending list
        setPendingDeliveries(prev =>
          prev.filter(d => d.id !== selectedDelivery.id)
        );
        setSelectedDelivery(null);
        setConfirmationForm({
          deliveryId: '',
          confirmedBy: '',
          customerSignature: '',
          photo: '',
          notes: '',
          actualQuantity: 0,
          customerSatisfaction: 5,
          deliveryIssues: []
        });

        // Show success message (in a real app, you might use a toast notification)
        alert('Delivery confirmed successfully!');
      } else {
        setError('Failed to confirm delivery');
      }
    } catch (err) {
      setError('Failed to confirm delivery');
      console.error('Confirmation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Confirmation</h1>
          <p className="text-muted-foreground">
            Confirm completed deliveries and collect customer feedback
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Confirmation</h1>
          <p className="text-muted-foreground">
            Confirm completed deliveries and collect customer feedback
          </p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delivery Confirmation</h1>
        <p className="text-muted-foreground">
          Confirm completed deliveries and collect customer feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Deliveries List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Pending Confirmations</span>
              <Badge variant="outline">{pendingDeliveries.length}</Badge>
            </CardTitle>
            <CardDescription>
              Deliveries ready for confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500">No deliveries pending confirmation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDelivery?.id === delivery.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectDelivery(delivery)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{delivery.customerName}</h4>
                        <p className="text-sm text-gray-600">#{delivery.id}</p>
                      </div>
                      <Badge className="bg-yellow-500 text-white">
                        {delivery.status === 'in_transit' ? 'In Transit' : 'Picked Up'}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{delivery.customerAddress}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span>{delivery.biogasQuantity}kg Biogas</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>ETA: {formatTime(delivery.estimatedArrival)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Confirmation Details</span>
            </CardTitle>
            <CardDescription>
              {selectedDelivery
                ? `Confirming delivery for ${selectedDelivery.customerName}`
                : 'Select a delivery to confirm'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDelivery ? (
              <div className="space-y-6">
                {/* Delivery Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Delivery Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span className="font-medium">{selectedDelivery.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scheduled Quantity:</span>
                      <span className="font-medium">{selectedDelivery.biogasQuantity}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery ID:</span>
                      <span className="font-medium">#{selectedDelivery.id}</span>
                    </div>
                  </div>
                </div>

                {/* Confirmation Form */}
                <div className="space-y-4">
                  {/* Confirmed By */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirmed By</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={confirmationForm.confirmedBy}
                      onChange={(e) => setConfirmationForm({
                        ...confirmationForm,
                        confirmedBy: e.target.value
                      })}
                    >
                      <option value="Driver">Driver</option>
                      <option value="Customer">Customer</option>
                      <option value="Supervisor">Supervisor</option>
                    </select>
                  </div>

                  {/* Actual Quantity */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Actual Quantity Delivered (kg)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={confirmationForm.actualQuantity}
                      onChange={(e) => setConfirmationForm({
                        ...confirmationForm,
                        actualQuantity: parseFloat(e.target.value) || 0
                      })}
                    />
                    {confirmationForm.actualQuantity !== selectedDelivery.biogasQuantity && (
                      <p className="text-sm text-yellow-600 mt-1">
                        Quantity differs from scheduled amount
                      </p>
                    )}
                  </div>

                  {/* Customer Satisfaction */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Customer Satisfaction (1-5)</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={confirmationForm.customerSatisfaction === rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => setConfirmationForm({
                            ...confirmationForm,
                            customerSatisfaction: rating
                          })}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Issues */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Issues (if any)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {deliveryIssueOptions.map((issue) => (
                        <label key={issue} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={confirmationForm.deliveryIssues.includes(issue)}
                            onChange={() => handleIssueToggle(issue)}
                          />
                          <span className="text-sm">{issue}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Signature and Photo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Customer Signature</label>
                      <Button
                        variant="outline"
                        onClick={handleSignatureCapture}
                        className="w-full"
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        {confirmationForm.customerSignature ? 'Signature Captured' : 'Capture Signature'}
                      </Button>
                      {confirmationForm.customerSignature && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Signature saved
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Delivery Photo</label>
                      <Button
                        variant="outline"
                        onClick={handlePhotoCapture}
                        className="w-full"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {confirmationForm.photo ? 'Photo Captured' : 'Take Photo'}
                      </Button>
                      {confirmationForm.photo && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Photo saved
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Any additional comments or observations..."
                      value={confirmationForm.notes}
                      onChange={(e) => setConfirmationForm({
                        ...confirmationForm,
                        notes: e.target.value
                      })}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSubmitConfirmation}
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? (
                      <>
                        <Save className="w-4 h-4 mr-2 animate-pulse" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Delivery
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedDelivery(null)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>

                {/* Validation Warnings */}
                {(!confirmationForm.customerSignature || !confirmationForm.photo) && (
                  <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Recommended:</p>
                        <ul className="mt-1 space-y-1">
                          {!confirmationForm.customerSignature && (
                            <li>• Capture customer signature for verification</li>
                          )}
                          {!confirmationForm.photo && (
                            <li>• Take delivery photo for documentation</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p>Select a pending delivery to begin confirmation process</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryConfirmation;
export { DeliveryConfirmation };