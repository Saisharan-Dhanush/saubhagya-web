import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { AlertTriangle, Camera, Scale, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

// Mock types for DisputeResolution
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

// Mock data
const disputes: Dispute[] = [
  {
    id: 'DISP-001',
    type: 'WEIGHT_MISMATCH',
    status: 'OPEN',
    farmerClaim: {
      weight: 45.2,
      quality: 'A',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      photoproof: 'photo_001.jpg'
    },
    iotReading: {
      weight: 42.8,
      quality: 'A',
      deviceId: 'SCALE-001',
      confidence: 0.95,
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'DISP-002',
    type: 'QUALITY_ISSUE',
    status: 'INVESTIGATING',
    farmerClaim: {
      weight: 38.5,
      quality: 'A',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    iotReading: {
      weight: 38.7,
      quality: 'B',
      deviceId: 'SENSOR-002',
      confidence: 0.88,
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'DISP-003',
    type: 'PAYMENT_DELAY',
    status: 'RESOLVED',
    farmerClaim: {
      weight: 52.0,
      quality: 'A',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    iotReading: {
      weight: 51.8,
      quality: 'A',
      deviceId: 'SCALE-003',
      confidence: 0.97,
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    resolution: 'Payment processed after verification. Minor weight difference within acceptable tolerance.',
    resolvedAt: new Date(Date.now() - 43200000).toISOString()
  }
];

const loading = {
  disputes: false
};

// Mock functions
const resolveDispute = async (disputeId: string, resolutionData: any) => {
  console.log(`Resolving dispute ${disputeId}:`, resolutionData);
  // Mock API call
  return new Promise(resolve => setTimeout(resolve, 1000));
};

const escalateDispute = async (disputeId: string, reason: string) => {
  console.log(`Escalating dispute ${disputeId}:`, reason);
  // Mock API call
  return new Promise(resolve => setTimeout(resolve, 1000));
};

const DisputeResolution: React.FC = () => {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'INVESTIGATING' | 'RESOLVED'>('ALL');

  const filteredDisputes = disputes.filter(dispute =>
    filter === 'ALL' || dispute.status === filter
  );

  const handleResolveDispute = async (disputeId: string, resolution: string, favorFarmer: boolean) => {
    try {
      await resolveDispute(disputeId, {
        resolution,
        favorFarmer,
        resolvedBy: 'CLUSTER_MANAGER',
        timestamp: new Date().toISOString()
      });
      setSelectedDispute(null);
    } catch (error) {
      console.error('Error resolving dispute:', error);
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

  if (loading.disputes) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading disputes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center -mt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispute Resolution</h1>
          <p className="text-gray-600 mt-2">
            Resolve farmer disputes with side-by-side evidence comparison
          </p>
        </div>
        <div className="flex space-x-2">
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
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Favor Farmer</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                        onClick={() => handleResolveDispute(
                          selectedDispute.id,
                          'Resolved in favor of IoT reading based on device confidence',
                          false
                        )}
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Favor IoT</span>
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => escalateDispute(selectedDispute.id, 'Escalated for manual investigation')}
                    >
                      Escalate to Higher Authority
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