import React, { useEffect, useState } from 'react';
import { Wifi, Activity, AlertTriangle, CheckCircle, XCircle, Wrench, Filter, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  deviceRegistryService,
  Device,
  DeviceHealthSummary,
  DeviceType,
  DeviceStatus
} from '@/services/admin/device-registry.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const DeviceRegistry: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [healthSummary, setHealthSummary] = useState<DeviceHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  // Filters
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<DeviceType | ''>('');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | ''>('');
  const [clusterIdFilter, setClusterIdFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<Partial<Device>>({});
  const [saving, setSaving] = useState(false);

  const deviceTypes: DeviceType[] = ['WEIGHING_SCALE', 'FLOW_METER', 'CH4_SENSOR', 'H2S_SENSOR', 'RFID_READER', 'GPS_TRACKER'];
  const statuses: DeviceStatus[] = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OFFLINE'];

  const deviceTypeLabels: Record<DeviceType, string> = {
    WEIGHING_SCALE: 'Weighing Scale',
    FLOW_METER: 'Flow Meter',
    CH4_SENSOR: 'Methane Sensor',
    H2S_SENSOR: 'H2S Sensor',
    RFID_READER: 'RFID Reader',
    GPS_TRACKER: 'GPS Tracker'
  };

  const fetchDevices = async () => {
    try {
      setLoading(true);

      // Parse cluster ID safely - only if it's a valid number
      let parsedClusterId: number | undefined = undefined;
      if (clusterIdFilter && clusterIdFilter.trim()) {
        const parsed = parseInt(clusterIdFilter);
        if (!isNaN(parsed)) {
          parsedClusterId = parsed;
        }
      }

      const response = await deviceRegistryService.getDevices(
        currentPage,
        pageSize,
        parsedClusterId,
        deviceTypeFilter || undefined,
        statusFilter || undefined
      );

      setDevices(response.content || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      toast.error('Failed to load devices. Please ensure the IoT Service is running.');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthSummary = async () => {
    try {
      const summary = await deviceRegistryService.getDeviceHealthSummary();
      setHealthSummary(summary);
    } catch (error) {
      console.error('Failed to fetch health summary:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchHealthSummary();
  }, [currentPage, deviceTypeFilter, statusFilter, clusterIdFilter]);

  const getStatusBadge = (status: DeviceStatus) => {
    const config: Record<DeviceStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode }> = {
      ACTIVE: { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
      INACTIVE: { variant: 'secondary', icon: <XCircle className="h-3 w-3" /> },
      MAINTENANCE: { variant: 'outline', icon: <Wrench className="h-3 w-3" /> },
      OFFLINE: { variant: 'destructive', icon: <AlertTriangle className="h-3 w-3" /> }
    };

    const { variant, icon } = config[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        {icon}
        {status}
      </Badge>
    );
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const clearFilters = () => {
    setDeviceTypeFilter('');
    setStatusFilter('');
    setClusterIdFilter('');
    setCurrentPage(0);
  };

  const hasActiveFilters = deviceTypeFilter || statusFilter || clusterIdFilter;

  // Modal handlers
  const handleOpenAddModal = () => {
    setFormData({
      deviceType: 'WEIGHING_SCALE',
      status: 'ACTIVE',
      trustScore: 100,
      clusterId: 1,
    });
    setShowAddModal(true);
  };

  const handleOpenViewModal = async (device: Device) => {
    setSelectedDevice(device);
    setShowViewModal(true);
  };

  const handleOpenEditModal = (device: Device) => {
    setSelectedDevice(device);
    setFormData(device);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedDevice(null);
    setFormData({});
  };

  const handleSaveDevice = async () => {
    try {
      setSaving(true);

      if (showAddModal) {
        await deviceRegistryService.createDevice(formData);
        toast.success('Device created successfully');
      } else if (showEditModal && selectedDevice) {
        await deviceRegistryService.updateDevice(selectedDevice.id, formData);
        toast.success('Device updated successfully');
      }

      handleCloseModals();
      fetchDevices();
      fetchHealthSummary();
    } catch (error) {
      console.error('Failed to save device:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save device');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDevice = async (device: Device) => {
    if (!confirm(`Are you sure you want to delete device ${device.deviceId}?`)) {
      return;
    }

    try {
      await deviceRegistryService.deleteDevice(device.id);
      toast.success('Device deleted successfully');
      fetchDevices();
      fetchHealthSummary();
    } catch (error) {
      console.error('Failed to delete device:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete device');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Registry</h1>
          <p className="text-muted-foreground">
            Manage IoT devices, RFID readers, sensors, and tracking units
          </p>
        </div>
        <Button onClick={handleOpenAddModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </div>

      {/* Health Summary Cards */}
      {healthSummary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthSummary.totalDevices}</div>
              <p className="text-xs text-muted-foreground">
                {healthSummary.activeDevices} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online / Offline</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className="text-green-600">{healthSummary.activeDevices}</span>
                {' / '}
                <span className="text-red-600">{healthSummary.offlineDevices}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Device connectivity status
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthSummary.maintenanceDevices}</div>
              <p className="text-xs text-muted-foreground">
                Devices in maintenance mode
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Trust Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTrustScoreColor(healthSummary.averageTrustScore)}`}>
                {healthSummary.averageTrustScore.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                {healthSummary.devicesNeedingCalibration} need calibration
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filter Devices
              </CardTitle>
              <CardDescription>
                {totalElements} total device{totalElements !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Select value={deviceTypeFilter} onValueChange={(value) => {
                setDeviceTypeFilter(value === 'all' ? '' : value as DeviceType);
                setCurrentPage(0);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Device Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {deviceTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value === 'all' ? '' : value as DeviceStatus);
                setCurrentPage(0);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Cluster ID"
                value={clusterIdFilter}
                onChange={(e) => {
                  setClusterIdFilter(e.target.value);
                  setCurrentPage(0);
                }}
              />

              {hasActiveFilters && (
                <div className="md:col-span-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Devices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>
            Showing {devices.length} of {totalElements} devices (Page {currentPage + 1} of {totalPages || 1})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No devices found. Try adjusting your filters or ensure the IoT Service is running.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Firmware</TableHead>
                      <TableHead>Trust Score</TableHead>
                      <TableHead>Last Calibration</TableHead>
                      <TableHead>Cluster</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.deviceId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {deviceTypeLabels[device.deviceType]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{device.serialNumber}</TableCell>
                        <TableCell>{getStatusBadge(device.status)}</TableCell>
                        <TableCell className="text-xs">{device.firmwareVersion}</TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getTrustScoreColor(device.trustScore)}`}>
                            {device.trustScore}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDate(device.lastCalibration)}
                        </TableCell>
                        <TableCell>{device.clusterId}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenViewModal(device)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditModal(device)}
                              title="Edit Device"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDevice(device)}
                              title="Delete Device"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} devices
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + Math.max(0, currentPage - 2);
                      if (page >= totalPages) return null;
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page + 1}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Device Modal */}
      <Dialog open={showAddModal || showEditModal} onOpenChange={(open) => !open && handleCloseModals()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showAddModal ? 'Add New Device' : 'Edit Device'}</DialogTitle>
            <DialogDescription>
              {showAddModal ? 'Register a new IoT device in the system' : 'Update device information'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID *</Label>
                <Input
                  id="deviceId"
                  placeholder="IOT-DEVICE-001"
                  value={formData.deviceId || ''}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  placeholder="SN-123456789"
                  value={formData.serialNumber || ''}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceType">Device Type *</Label>
                <Select value={formData.deviceType} onValueChange={(value) => setFormData({ ...formData, deviceType: value as DeviceType })}>
                  <SelectTrigger id="deviceType">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {deviceTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as DeviceStatus })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firmwareVersion">Firmware Version</Label>
                <Input
                  id="firmwareVersion"
                  placeholder="v1.0.0"
                  value={formData.firmwareVersion || ''}
                  onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clusterId">Cluster ID *</Label>
                <Input
                  id="clusterId"
                  type="number"
                  placeholder="1"
                  value={formData.clusterId || ''}
                  onChange={(e) => setFormData({ ...formData, clusterId: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trustScore">Trust Score (0-100)</Label>
                <Input
                  id="trustScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="100"
                  value={formData.trustScore || ''}
                  onChange={(e) => setFormData({ ...formData, trustScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Cluster 1, Zone A"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModals} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveDevice} disabled={saving}>
              {saving ? 'Saving...' : (showAddModal ? 'Create Device' : 'Update Device')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Device Modal */}
      <Dialog open={showViewModal} onOpenChange={(open) => !open && handleCloseModals()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
            <DialogDescription>
              Complete information for device {selectedDevice?.deviceId}
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Device ID</Label>
                  <p className="font-medium">{selectedDevice.deviceId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Serial Number</Label>
                  <p className="font-medium">{selectedDevice.serialNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Device Type</Label>
                  <p className="font-medium">{deviceTypeLabels[selectedDevice.deviceType]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedDevice.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Firmware Version</Label>
                  <p className="font-medium">{selectedDevice.firmwareVersion}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trust Score</Label>
                  <p className={`font-semibold ${getTrustScoreColor(selectedDevice.trustScore)}`}>
                    {selectedDevice.trustScore}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cluster ID</Label>
                  <p className="font-medium">{selectedDevice.clusterId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedDevice.location || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Last Calibration</Label>
                  <p className="font-medium">{formatDate(selectedDevice.lastCalibration)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Next Calibration</Label>
                  <p className="font-medium">{formatDate(selectedDevice.nextCalibration)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p className="font-medium">{formatDate(selectedDevice.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="font-medium">{formatDate(selectedDevice.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModals}>
              Close
            </Button>
            <Button onClick={() => {
              handleCloseModals();
              if (selectedDevice) handleOpenEditModal(selectedDevice);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceRegistry;
export { DeviceRegistry };
