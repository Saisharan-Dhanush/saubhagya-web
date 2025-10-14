/**
 * Inventory Transfer Page - SAUB-FE-003
 * Batch tracking and transfer management for purified biogas
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  Truck,
  MapPin,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  Eye,
  Edit,
  Calendar
} from 'lucide-react';
import { InventoryTransfer, BatchTracking } from '../../Purification.types';
import { apiService } from '@/services/api';

interface TransferFormData {
  transferType: 'incoming' | 'outgoing' | 'internal';
  fromLocation: string;
  toLocation: string;
  batchIds: string[];
  requestedBy: string;
  vehicleInfo?: {
    vehicleNumber: string;
    driverName: string;
    driverContact: string;
  };
  notes?: string;
}

export const InventoryTransferPage: React.FC = () => {
  const [transfers, setTransfers] = useState<InventoryTransfer[]>([]);
  const [batches, setBatches] = useState<BatchTracking[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<InventoryTransfer | null>(null);
  const [newTransferForm, setNewTransferForm] = useState<TransferFormData>({
    transferType: 'outgoing',
    fromLocation: '',
    toLocation: '',
    batchIds: [],
    requestedBy: 'CURRENT_USER'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch inventory and batch tracking data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inventory data (includes transfers)
        const inventoryResponse = await apiService.getPurificationInventory();
        if (inventoryResponse.success && inventoryResponse.data) {
          const transfersData = (Array.isArray(inventoryResponse.data)
            ? inventoryResponse.data
            : inventoryResponse.data.transfers || []
          ).map((transfer: any) => ({
            ...transfer,
            id: transfer.id?.toString() || `transfer-${Date.now()}`,
            transferDate: new Date(transfer.transferDate || transfer.createdAt || Date.now()),
            status: transfer.status?.toLowerCase() || 'pending',
            totalVolume: transfer.totalVolume || 0,
            batchIds: transfer.batchIds || [],
            qualityCertificates: transfer.qualityCertificates || [],
            pesoDocuments: transfer.pesoDocuments || []
          }));
          setTransfers(transfersData);
        }

        // Fetch batches (we can get this from cycles or inventory)
        const cyclesResponse = await apiService.getPurificationCycles({ page: 0, size: 50 });
        if (cyclesResponse.success && cyclesResponse.data?.content) {
          const batchesData = cyclesResponse.data.content.map((cycle: any) => ({
            id: cycle.id?.toString() || `batch-${Date.now()}`,
            batchNumber: cycle.batchId || `BATCH-${cycle.id}`,
            sourceLocation: `Unit ${cycle.unitId || 'Unknown'}`,
            arrivalDate: new Date(cycle.startTime || cycle.createdAt),
            volume: cycle.initialVolume || 1000,
            initialQuality: {
              id: `test-${cycle.id}`,
              batchId: cycle.batchId,
              cycleId: cycle.id?.toString(),
              testDate: new Date(cycle.startTime || Date.now()),
              testType: 'final_quality',
              parameters: {
                ch4: cycle.finalCh4Percentage || cycle.currentCh4Percentage || 0,
                co2: cycle.co2Level || 0,
                h2s: cycle.h2sLevel || 0,
                moisture: cycle.moisture || 0,
                calificValue: 9000,
                density: 0.75
              },
              complianceStatus: cycle.status === 'COMPLETED' ? 'pass' : 'pending',
              pesoRating: cycle.status === 'COMPLETED' ? 'A' : 'Pending',
              technician: cycle.operatorId || 'Unknown'
            },
            currentStatus: cycle.status?.toLowerCase() || 'queued',
            assignedCycle: cycle.id?.toString(),
            expectedCompletion: cycle.endTime ? new Date(cycle.endTime) : undefined,
            traceabilityCode: `TC-${cycle.id}`,
            sourceType: 'biogas_sangh',
            documentation: []
          }));
          setBatches(batchesData);
        }
      } catch (error) {
        console.error('Failed to fetch inventory data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransferTypeColor = (type: string) => {
    switch (type) {
      case 'incoming': return 'bg-green-100 text-green-800';
      case 'outgoing': return 'bg-blue-100 text-blue-800';
      case 'internal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatchStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'quarantined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.batchIds.some(batch => batch.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || transfer.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreateTransfer = async () => {
    try {
      // Backend expects single batch transfer, not multiple
      // For now, use first batch from selection
      const firstBatchId = newTransferForm.batchIds[0];
      const batch = batches.find(b => b.batchNumber === firstBatchId);

      if (!batch || !batch.assignedCycle) {
        console.error('Selected batch has no assigned cycle');
        return;
      }

      // Match backend CreateInventoryTransferRequest DTO structure
      const transferData = {
        cycleId: batch.assignedCycle, // String UUID from batch's cycle
        batchTrackingNumber: firstBatchId,
        transferType: 'STORAGE_TO_DISTRIBUTION', // Backend expects: PRODUCTION_TO_STORAGE, STORAGE_TO_CYLINDER, STORAGE_TO_PIPELINE, STORAGE_TO_DISTRIBUTION
        sourceLocation: newTransferForm.fromLocation,
        destinationLocation: newTransferForm.toLocation,
        volumeTransferredM3: (batch.volume / 1000) || 1, // Convert L to m³
        pressureBar: 2.0, // Not captured in form, use default
        temperatureCelsius: 25, // Not captured in form, use default
        qualityGrade: batch.initialQuality.pesoRating || 'A',
        ch4Percentage: batch.initialQuality.parameters.ch4 || 95,
        initiatedBy: newTransferForm.requestedBy,
        containerIdentifier: null,
        vehicleIdentifier: newTransferForm.vehicleInfo?.vehicleNumber || null,
        notes: `${newTransferForm.notes || ''}\nDriver: ${newTransferForm.vehicleInfo?.driverName || 'N/A'}\nContact: ${newTransferForm.vehicleInfo?.driverContact || 'N/A'}`
      };

      const response = await apiService.createInventoryTransfer(transferData);
      if (response.success && response.data) {
        const newTransfer: InventoryTransfer = {
          ...response.data,
          id: response.data.id?.toString() || `transfer-${Date.now()}`,
          transferDate: new Date(response.data.transferDate || Date.now()),
          status: response.data.status?.toLowerCase() || 'pending',
          totalVolume: totalVolume,
          qualityCertificates: [],
          pesoDocuments: []
        };

        setTransfers(prev => [newTransfer, ...prev]);

        // Reset form
        setNewTransferForm({
          transferType: 'outgoing',
          fromLocation: '',
          toLocation: '',
          batchIds: [],
          requestedBy: 'CURRENT_USER'
        });
      }
    } catch (error) {
      console.error('Failed to create transfer:', error);
    }
  };

  const handleStatusUpdate = (transferId: string, newStatus: InventoryTransfer['status']) => {
    setTransfers(prev => prev.map(transfer =>
      transfer.id === transferId ? { ...transfer, status: newStatus } : transfer
    ));
  };

  const getTransferStats = () => {
    const total = transfers.length;
    const pending = transfers.filter(t => t.status === 'pending').length;
    const inTransit = transfers.filter(t => t.status === 'in_transit').length;
    const completed = transfers.filter(t => t.status === 'completed').length;
    const totalVolume = transfers.reduce((sum, t) => sum + t.totalVolume, 0);

    return { total, pending, inTransit, completed, totalVolume };
  };

  const stats = getTransferStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Transfer</h1>
          <p className="text-gray-600 mt-1">Batch tracking and transfer management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Records
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Transfer
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transfers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-purple-600">{stats.inTransit}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalVolume.toLocaleString()}L</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transfers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transfers">Transfers ({transfers.length})</TabsTrigger>
          <TabsTrigger value="batches">Batch Tracking ({batches.length})</TabsTrigger>
          <TabsTrigger value="new">New Transfer</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transfers" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by transfer ID, location, or batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Transfer List */}
          <div className="space-y-4">
            {filteredTransfers.map((transfer) => (
              <Card key={transfer.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{transfer.id}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {transfer.fromLocation}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {transfer.toLocation}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(transfer.status)}>
                        {transfer.status}
                      </Badge>
                      <Badge className={getTransferTypeColor(transfer.transferType)}>
                        {transfer.transferType}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Transfer Date</span>
                      <p className="font-medium">{transfer.transferDate.toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{transfer.transferDate.toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Volume</span>
                      <p className="font-medium">{transfer.totalVolume.toLocaleString()} L</p>
                      <p className="text-sm text-gray-500">{transfer.batchIds.length} batches</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Requested By</span>
                      <p className="font-medium">{transfer.requestedBy}</p>
                      {transfer.approvedBy && (
                        <p className="text-sm text-gray-500">Approved by {transfer.approvedBy}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Documents</span>
                      <p className="font-medium">{transfer.qualityCertificates.length} QC</p>
                      <p className="text-sm text-gray-500">{transfer.pesoDocuments.length} PESO</p>
                    </div>
                  </div>

                  {transfer.vehicleInfo && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Truck className="w-4 h-4 mr-2 text-blue-600" />
                        Vehicle Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="ml-1 font-medium">{transfer.vehicleInfo.vehicleNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Driver:</span>
                          <span className="ml-1 font-medium">{transfer.vehicleInfo.driverName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Contact:</span>
                          <span className="ml-1 font-medium">{transfer.vehicleInfo.driverContact}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {transfer.batchIds.map((batchId) => (
                        <Badge key={batchId} variant="outline" className="text-xs">
                          {batchId}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      {transfer.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(transfer.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(transfer.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {transfer.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(transfer.id, 'in_transit')}
                        >
                          Mark In Transit
                        </Button>
                      )}
                      {transfer.status === 'in_transit' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(transfer.id, 'completed')}
                        >
                          Mark Completed
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Batch Tracking
              </CardTitle>
              <CardDescription>
                Track individual batches through the purification process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batches.map((batch) => (
                  <div key={batch.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{batch.batchNumber}</h4>
                        <p className="text-sm text-gray-600">
                          From {batch.sourceLocation} • {batch.traceabilityCode}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getBatchStatusColor(batch.currentStatus)}>
                          {batch.currentStatus}
                        </Badge>
                        <Badge variant="outline">
                          {batch.sourceType.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Volume</span>
                        <p className="font-medium">{batch.volume.toLocaleString()} L</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Arrival</span>
                        <p className="font-medium">{batch.arrivalDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Quality Grade</span>
                        <p className="font-medium">{batch.initialQuality.pesoRating}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">CH₄ Content</span>
                        <p className="font-medium">{batch.initialQuality.parameters.ch4}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          Documentation: {batch.documentation.length} files
                        </span>
                        {batch.expectedCompletion && (
                          <span className="text-sm text-gray-600">
                            Expected: {batch.expectedCompletion.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        <FileText className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Create New Transfer
              </CardTitle>
              <CardDescription>
                Initiate a new inventory transfer request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transfer Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Transfer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="transferType">Transfer Type</Label>
                      <select
                        id="transferType"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newTransferForm.transferType}
                        onChange={(e) => setNewTransferForm(prev => ({
                          ...prev,
                          transferType: e.target.value as any
                        }))}
                      >
                        <option value="outgoing">Outgoing</option>
                        <option value="incoming">Incoming</option>
                        <option value="internal">Internal</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="fromLocation">From Location</Label>
                      <Input
                        id="fromLocation"
                        value={newTransferForm.fromLocation}
                        onChange={(e) => setNewTransferForm(prev => ({
                          ...prev,
                          fromLocation: e.target.value
                        }))}
                        placeholder="Enter source location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="toLocation">To Location</Label>
                      <Input
                        id="toLocation"
                        value={newTransferForm.toLocation}
                        onChange={(e) => setNewTransferForm(prev => ({
                          ...prev,
                          toLocation: e.target.value
                        }))}
                        placeholder="Enter destination location"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Information (if outgoing/incoming) */}
                {(newTransferForm.transferType === 'outgoing' || newTransferForm.transferType === 'incoming') && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Vehicle Information</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                        <Input
                          id="vehicleNumber"
                          value={newTransferForm.vehicleInfo?.vehicleNumber || ''}
                          onChange={(e) => setNewTransferForm(prev => ({
                            ...prev,
                            vehicleInfo: {
                              ...prev.vehicleInfo,
                              vehicleNumber: e.target.value,
                              driverName: prev.vehicleInfo?.driverName || '',
                              driverContact: prev.vehicleInfo?.driverContact || ''
                            }
                          }))}
                          placeholder="Enter vehicle number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="driverName">Driver Name</Label>
                        <Input
                          id="driverName"
                          value={newTransferForm.vehicleInfo?.driverName || ''}
                          onChange={(e) => setNewTransferForm(prev => ({
                            ...prev,
                            vehicleInfo: {
                              ...prev.vehicleInfo,
                              vehicleNumber: prev.vehicleInfo?.vehicleNumber || '',
                              driverName: e.target.value,
                              driverContact: prev.vehicleInfo?.driverContact || ''
                            }
                          }))}
                          placeholder="Enter driver name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="driverContact">Driver Contact</Label>
                        <Input
                          id="driverContact"
                          type="tel"
                          value={newTransferForm.vehicleInfo?.driverContact || ''}
                          onChange={(e) => setNewTransferForm(prev => ({
                            ...prev,
                            vehicleInfo: {
                              ...prev.vehicleInfo,
                              vehicleNumber: prev.vehicleInfo?.vehicleNumber || '',
                              driverName: prev.vehicleInfo?.driverName || '',
                              driverContact: e.target.value
                            }
                          }))}
                          placeholder="Enter driver contact"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Batch Selection */}
              <div>
                <Label>Select Batches</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {batches.filter(batch => batch.currentStatus === 'completed').map((batch) => (
                    <label key={batch.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newTransferForm.batchIds.includes(batch.batchNumber)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewTransferForm(prev => ({
                              ...prev,
                              batchIds: [...prev.batchIds, batch.batchNumber]
                            }));
                          } else {
                            setNewTransferForm(prev => ({
                              ...prev,
                              batchIds: prev.batchIds.filter(id => id !== batch.batchNumber)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="flex-1">{batch.batchNumber}</span>
                      <Badge className={getBatchStatusColor(batch.currentStatus)}>
                        {batch.currentStatus}
                      </Badge>
                      <span className="text-sm text-gray-600">{batch.volume}L</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes..."
                  value={newTransferForm.notes || ''}
                  onChange={(e) => setNewTransferForm(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  rows={3}
                />
              </div>

              {/* Summary */}
              {newTransferForm.batchIds.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Transfer Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Selected Batches:</span>
                      <span className="ml-1 font-medium">{newTransferForm.batchIds.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Volume:</span>
                      <span className="ml-1 font-medium">
                        {newTransferForm.batchIds.reduce((total, batchId) => {
                          const batch = batches.find(b => b.batchNumber === batchId);
                          return total + (batch?.volume || 0);
                        }, 0).toLocaleString()} L
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button
                  onClick={handleCreateTransfer}
                  disabled={!newTransferForm.fromLocation || !newTransferForm.toLocation || newTransferForm.batchIds.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Create Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Transfer Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Transfer Time</span>
                    <span className="font-medium">4.2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">On-Time Delivery Rate</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Transfer Efficiency</span>
                    <span className="font-medium">97.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Batch Size</span>
                    <span className="font-medium">1,120 L</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-green-600" />
                  Fleet Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Vehicles</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fuel Efficiency</span>
                    <span className="font-medium">12.5 km/L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Maintenance Due</span>
                    <span className="font-medium text-yellow-600">2 vehicles</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fleet Utilization</span>
                    <span className="font-medium">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};