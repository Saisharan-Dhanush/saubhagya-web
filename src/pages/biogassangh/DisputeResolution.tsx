import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { AlertTriangle, Camera, Scale, Clock, CheckCircle, XCircle, Eye, Save, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import biogasService, { DisputeResponse, CreateDisputeRequest } from '../../services/biogasService';

// Backend dispute types - matches Story 11.1 AC-37 to AC-44
type DisputeStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED';
type DisputeType = 'WEIGHT_MISMATCH' | 'QUALITY_ISSUE' | 'PAYMENT_DELAY' | 'COLLECTION_MISSED';

interface DisputeClaim {
  weight: number;
  quality: string;
  timestamp: string;
  photoproof?: string;
}

interface IoTReading {
  weight: number;
  quality: string;
  deviceId: string;
  confidence: number;
  timestamp: string;
}

interface Dispute {
  id: string;
  type: DisputeType;
  status: DisputeStatus;
  farmerClaim: DisputeClaim;
  iotReading: IoTReading;
  createdAt: string;
  resolution?: string;
  resolvedAt?: string;
}

const DisputeResolution: React.FC = () => {
  // Backend state management
  const [backendDisputes, setBackendDisputes] = useState<DisputeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'INVESTIGATING' | 'RESOLVED'>('ALL');
  const [isSaving, setIsSaving] = useState(false);

  // Add Dispute Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDispute, setNewDispute] = useState<CreateDisputeRequest>({
    transactionId: 0,
    clusterId: '1',
    disputeType: 'WEIGHT_DISCREPANCY',
    priority: 'MEDIUM',
    description: '',
    disputeReason: ''
  });

  // Fetch disputes on mount
  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all disputes (no cluster filter for now)
        const response = await biogasService.getDisputes(undefined, undefined, undefined, 0, 100);

        if (response.success && response.data) {
          console.log('Disputes loaded from backend:', response.data.content);
          setBackendDisputes(response.data.content);
        } else {
          setError(response.error || 'Failed to load disputes');
          console.error('Failed to load disputes:', response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load disputes');
        console.error('Error fetching disputes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  // Map backend disputes to frontend format for display
  const mapBackendToFrontend = (backendDispute: DisputeResponse): Dispute => {
    return {
      id: backendDispute.disputeRef,
      type: backendDispute.disputeType as DisputeType,
      status: backendDispute.status as DisputeStatus,
      farmerClaim: {
        weight: 45.0, // Mock data - backend doesn't store farmer claim details separately
        quality: 'A',
        timestamp: backendDispute.createdAt,
        photoproof: undefined
      },
      iotReading: {
        weight: 42.0, // Mock data - backend doesn't store IoT reading details separately
        quality: 'A',
        deviceId: 'SCALE-001',
        confidence: 0.95,
        timestamp: backendDispute.createdAt
      },
      createdAt: backendDispute.createdAt,
      resolution: backendDispute.resolutionNotes || undefined,
      resolvedAt: backendDispute.resolvedAt || undefined
    };
  };

  // Convert backend disputes to frontend format
  const disputes: Dispute[] = backendDisputes.map(mapBackendToFrontend);

  // Resolution functions using backend API
  const resolveDispute = async (disputeId: string, resolutionData: any) => {
    try {
      // Find the backend dispute ID from the dispute ref
      const backendDispute = backendDisputes.find(d => d.disputeRef === disputeId);
      if (!backendDispute) {
        console.error('Dispute not found:', disputeId);
        return;
      }

      const response = await biogasService.resolveDispute(backendDispute.disputeId, {
        resolutionType: resolutionData.favorFarmer ? 'FAVOR_FARMER' : 'FAVOR_IOT',
        resolutionNotes: resolutionData.resolution
      });

      if (response.success && response.data) {
        console.log('Dispute resolved:', response.data);
        // Refresh disputes list
        const refreshResponse = await biogasService.getDisputes(undefined, undefined, undefined, 0, 100);
        if (refreshResponse.success && refreshResponse.data) {
          setBackendDisputes(refreshResponse.data.content);
        }
      } else {
        console.error('Failed to resolve dispute:', response.error);
        setError(response.error || 'Failed to resolve dispute');
      }
    } catch (err) {
      console.error('Error resolving dispute:', err);
      setError(err instanceof Error ? err.message : 'Failed to resolve dispute');
    }
  };

  const escalateDispute = async (disputeId: string, reason: string) => {
    setIsSaving(true);
    try {
      const backendDispute = backendDisputes.find(d => d.disputeRef === disputeId);
      if (!backendDispute) {
        console.error('Dispute not found:', disputeId);
        const { toast } = await import('sonner');
        toast.error('Dispute not found');
        return;
      }

      const response = await biogasService.respondToDispute(backendDispute.disputeId, {
        responseText: `Escalated: ${reason}`,
        attachments: []
      });

      if (response.success) {
        console.log('Dispute escalated:', response.data);

        // Show success toast
        const { toast } = await import('sonner');
        toast.success('Dispute Escalation Saved!', {
          description: `Dispute #${disputeId} has been escalated to higher authority`
        });

        // Refresh disputes list
        const refreshResponse = await biogasService.getDisputes(undefined, undefined, undefined, 0, 100);
        if (refreshResponse.success && refreshResponse.data) {
          setBackendDisputes(refreshResponse.data.content);
        }
        setSelectedDispute(null);
      } else {
        console.error('Failed to escalate dispute:', response.error);
        setError(response.error || 'Failed to escalate dispute');

        // Show error toast
        const { toast } = await import('sonner');
        toast.error('Failed to Save Escalation', {
          description: response.error || 'An error occurred'
        });
      }
    } catch (err) {
      console.error('Error escalating dispute:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to escalate dispute';
      setError(errorMsg);

      // Show error toast
      const { toast } = await import('sonner');
      toast.error('Failed to Save Escalation', {
        description: errorMsg
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredDisputes = disputes.filter(dispute =>
    filter === 'ALL' || dispute.status === filter
  );

  const handleResolveDispute = async (disputeId: string, resolution: string, favorFarmer: boolean) => {
    setIsSaving(true);
    try {
      await resolveDispute(disputeId, {
        resolution,
        favorFarmer,
        resolvedBy: 'CLUSTER_MANAGER',
        timestamp: new Date().toISOString()
      });

      // Show success toast
      const { toast } = await import('sonner');
      toast.success('Dispute Resolution Saved!', {
        description: `Successfully resolved dispute #${disputeId} in favor of ${favorFarmer ? 'Farmer' : 'IoT'}`
      });

      setSelectedDispute(null);
    } catch (error) {
      console.error('Error resolving dispute:', error);

      // Show error toast
      const { toast } = await import('sonner');
      toast.error('Failed to Save Dispute Resolution', {
        description: error instanceof Error ? error.message : 'An error occurred while saving'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Add Dispute
  const handleAddDispute = async () => {
    // Validation
    if (!newDispute.transactionId || newDispute.transactionId <= 0 || !newDispute.disputeReason.trim() || !newDispute.description.trim()) {
      const { toast } = await import('sonner');
      toast.error('Validation Error', {
        description: 'Please fill in all required fields. Transaction ID must be a positive number.'
      });
      return;
    }

    setIsSaving(true);
    try {
      // Generate external ID for the dispute
      const externalId = `DISP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const disputeWithExternalId = { ...newDispute, externalId };

      const response = await biogasService.createDispute(disputeWithExternalId);

      if (response.success && response.data) {
        // Show success toast
        const { toast } = await import('sonner');
        toast.success('Dispute Created!', {
          description: `Successfully created dispute for transaction #${newDispute.transactionId}`
        });

        // Refresh disputes list
        const refreshResponse = await biogasService.getDisputes(undefined, undefined, undefined, 0, 100);
        if (refreshResponse.success && refreshResponse.data) {
          setBackendDisputes(refreshResponse.data.content);
        }

        // Reset form and close dialog
        setNewDispute({
          transactionId: 0,
          clusterId: '1',
          disputeType: 'WEIGHT_DISCREPANCY',
          priority: 'MEDIUM',
          description: '',
          disputeReason: ''
        });
        setIsAddDialogOpen(false);
      } else {
        // Show error toast
        const { toast } = await import('sonner');
        toast.error('Failed to Create Dispute', {
          description: response.error || 'An error occurred while creating the dispute'
        });
      }
    } catch (error) {
      console.error('Error creating dispute:', error);

      // Show error toast
      const { toast } = await import('sonner');
      toast.error('Failed to Create Dispute', {
        description: error instanceof Error ? error.message : 'An error occurred while creating'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getDisputeTypeLabel = (type: string) => {
    const labels = {
      'WEIGHT_MISMATCH': 'Weight Mismatch',
      'QUALITY_ISSUE': 'Quality Issue',
      'PAYMENT_DELAY': 'Payment Delay',
      'COLLECTION_MISSED': 'Collection Missed'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'OPEN': 'destructive',
      'INVESTIGATING': 'secondary',
      'RESOLVED': 'default',
      'ESCALATED': 'outline'
    };
    return colors[status as keyof typeof colors] || 'outline';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading disputes from backend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispute Resolution</h1>
          <p className="text-gray-600 mt-2">
            Resolve farmer disputes with side-by-side evidence comparison
          </p>
        </div>
        <div className="flex space-x-2">
          {/* Add Dispute Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Dispute</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Create New Dispute</DialogTitle>
                <DialogDescription>
                  Add a new dispute for transaction verification and resolution
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 overflow-y-auto flex-1">
                <div className="grid gap-2">
                  <Label htmlFor="transactionId">Transaction ID *</Label>
                  <Input
                    id="transactionId"
                    type="number"
                    placeholder="Enter transaction ID"
                    value={newDispute.transactionId || ''}
                    onChange={(e) => setNewDispute({ ...newDispute, transactionId: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="clusterId">Cluster ID *</Label>
                  <Input
                    id="clusterId"
                    placeholder="Enter cluster ID"
                    value={newDispute.clusterId}
                    onChange={(e) => setNewDispute({ ...newDispute, clusterId: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="disputeType">Dispute Type *</Label>
                  <Select
                    value={newDispute.disputeType}
                    onValueChange={(value) => setNewDispute({ ...newDispute, disputeType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dispute type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEIGHT_DISCREPANCY">WEIGHT_DISCREPANCY</SelectItem>
                      <SelectItem value="PAYMENT_ISSUE">PAYMENT_ISSUE</SelectItem>
                      <SelectItem value="QUALITY_CONCERN">QUALITY_CONCERN</SelectItem>
                      <SelectItem value="RATE_DISPUTE">RATE_DISPUTE</SelectItem>
                      <SelectItem value="DEVICE_MALFUNCTION">DEVICE_MALFUNCTION</SelectItem>
                      <SelectItem value="PROCESS_VIOLATION">PROCESS_VIOLATION</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={newDispute.priority}
                    onValueChange={(value) => setNewDispute({ ...newDispute, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRITICAL">CRITICAL</SelectItem>
                      <SelectItem value="LOW">LOW</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                      <SelectItem value="HIGH">HIGH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="disputeReason">Dispute Reason *</Label>
                  <Input
                    id="disputeReason"
                    placeholder="Brief reason for the dispute"
                    value={newDispute.disputeReason}
                    onChange={(e) => setNewDispute({ ...newDispute, disputeReason: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the dispute in detail..."
                    className="min-h-[100px]"
                    value={newDispute.description}
                    onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleAddDispute} disabled={isSaving}>
                  {isSaving ? 'Creating...' : 'Create Dispute'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Filter Buttons */}
          {['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status as any)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Disputes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Active Disputes ({filteredDisputes.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedDispute?.id === dispute.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDispute(dispute)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{getDisputeTypeLabel(dispute.type)}</h3>
                      <p className="text-sm text-gray-600">Dispute #{dispute.id}</p>
                    </div>
                    <Badge variant={getStatusColor(dispute.status) as any}>
                      {dispute.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-green-700">Farmer Claim:</p>
                      <p>Weight: {dispute.farmerClaim.weight} kg</p>
                      <p>Quality: Grade {dispute.farmerClaim.quality}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-700">IoT Reading:</p>
                      <p>Weight: {dispute.iotReading.weight} kg</p>
                      <p>Quality: Grade {dispute.iotReading.quality}</p>
                      <p>Confidence: {(dispute.iotReading.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Created: {new Date(dispute.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredDisputes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No disputes found for selected filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dispute Details & Resolution */}
        <Card>
          <CardHeader>
            <CardTitle>Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDispute ? (
              <div className="space-y-6">
                {/* Side-by-side Evidence Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Farmer Evidence */}
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                      <Scale className="h-4 w-4" />
                      <span>Farmer Evidence</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">{selectedDispute.farmerClaim.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality:</span>
                        <span className="font-medium">Grade {selectedDispute.farmerClaim.quality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">
                          {new Date(selectedDispute.farmerClaim.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {selectedDispute.farmerClaim.photoproof && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-600 mb-2">Photo Proof:</p>
                          <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* IoT Evidence */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>IoT Evidence</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">{selectedDispute.iotReading.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality:</span>
                        <span className="font-medium">Grade {selectedDispute.iotReading.quality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Device:</span>
                        <span className="font-medium">{selectedDispute.iotReading.deviceId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-medium">
                          {(selectedDispute.iotReading.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">
                          {new Date(selectedDispute.iotReading.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variance Analysis */}
                <div className="border rounded-lg p-4 bg-yellow-50">
                  <h3 className="font-semibold text-yellow-800 mb-3">Variance Analysis</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Weight Difference:</span>
                      <span className="font-medium">
                        {Math.abs(selectedDispute.farmerClaim.weight - selectedDispute.iotReading.weight).toFixed(1)} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality Match:</span>
                      <span className="font-medium">
                        {selectedDispute.farmerClaim.quality === selectedDispute.iotReading.quality ? '✓ Match' : '✗ Mismatch'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resolution Actions */}
                {selectedDispute.status === 'OPEN' && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Resolution Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        className="flex items-center space-x-2"
                        onClick={() => handleResolveDispute(
                          selectedDispute.id,
                          'Resolved in favor of farmer based on evidence review',
                          true
                        )}
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4" />
                        <span>{isSaving ? 'Saving...' : 'Save - Favor Farmer'}</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                        onClick={() => handleResolveDispute(
                          selectedDispute.id,
                          'Resolved in favor of IoT reading based on device confidence',
                          false
                        )}
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4" />
                        <span>{isSaving ? 'Saving...' : 'Save - Favor IoT'}</span>
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={() => escalateDispute(selectedDispute.id, 'Escalated for manual investigation')}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSaving ? 'Saving...' : 'Save & Escalate to Higher Authority'}</span>
                    </Button>
                  </div>
                )}

                {/* Resolution History */}
                {selectedDispute.resolution && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2">Resolution</h3>
                    <p className="text-sm text-gray-700">{selectedDispute.resolution}</p>
                    {selectedDispute.resolvedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Resolved on: {new Date(selectedDispute.resolvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a dispute to view details and resolution options</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisputeResolution;