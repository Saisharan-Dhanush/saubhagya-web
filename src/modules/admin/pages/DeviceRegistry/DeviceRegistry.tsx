import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wifi, WifiOff, Plus, Settings, Search, Smartphone, Bluetooth, Monitor } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'RFID' | 'IoT Scale' | 'CH4 Sensor' | 'GPS Unit';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  lastSeen: string;
  batteryLevel?: number;
}

const DeviceRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockDevices: Device[] = [
    {
      id: 'RFID-001',
      name: 'Cattle Tag Reader 1',
      type: 'RFID',
      status: 'online',
      location: 'Mathura Gaushala - Gate 1',
      lastSeen: '2 minutes ago',
      batteryLevel: 85
    },
    {
      id: 'SCALE-001',
      name: 'Biogas Scale Unit 1',
      type: 'IoT Scale',
      status: 'online',
      location: 'Mathura Cluster - Digester 1',
      lastSeen: '1 minute ago',
      batteryLevel: 92
    },
    {
      id: 'CH4-001',
      name: 'Methane Sensor 1',
      type: 'CH4 Sensor',
      status: 'maintenance',
      location: 'Vrindavan Cluster - Production Unit',
      lastSeen: '2 hours ago',
      batteryLevel: 45
    },
    {
      id: 'GPS-001',
      name: 'Vehicle Tracker 1',
      type: 'GPS Unit',
      status: 'online',
      location: 'Transport Vehicle TV-001',
      lastSeen: '30 seconds ago',
      batteryLevel: 78
    },
    {
      id: 'RFID-002',
      name: 'Cattle Tag Reader 2',
      type: 'RFID',
      status: 'offline',
      location: 'Goverdhan Gaushala - Feeding Area',
      lastSeen: '6 hours ago',
      batteryLevel: 12
    }
  ];

  const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500 flex items-center gap-1"><Wifi className="h-3 w-3" />Online</Badge>;
      case 'offline':
        return <Badge className="bg-red-500 flex items-center gap-1"><WifiOff className="h-3 w-3" />Offline</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500 flex items-center gap-1"><Settings className="h-3 w-3" />Maintenance</Badge>;
    }
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'RFID':
        return <Smartphone className="h-5 w-5" />;
      case 'IoT Scale':
        return <Monitor className="h-5 w-5" />;
      case 'CH4 Sensor':
        return <Bluetooth className="h-5 w-5" />;
      case 'GPS Unit':
        return <Smartphone className="h-5 w-5" />;
    }
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-500';
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredDevices = mockDevices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Registry</h1>
          <p className="text-muted-foreground">
            Manage IoT devices, RFID readers, sensors, and tracking units
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Devices</p>
                <p className="text-2xl font-bold">{mockDevices.length}</p>
              </div>
              <Monitor className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Online</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockDevices.filter(d => d.status === 'online').length}
                </p>
              </div>
              <Wifi className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Offline</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockDevices.filter(d => d.status === 'offline').length}
                </p>
              </div>
              <WifiOff className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockDevices.filter(d => d.status === 'maintenance').length}
                </p>
              </div>
              <Settings className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device Inventory</CardTitle>
          <CardDescription>
            All registered IoT devices and sensors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices by name, type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Device</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Location</th>
                  <th className="text-left p-4 font-medium">Battery</th>
                  <th className="text-left p-4 font-medium">Last Seen</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="border-b hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.type)}
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground">{device.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{device.type}</Badge>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(device.status)}
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{device.location}</p>
                    </td>
                    <td className="p-4">
                      {device.batteryLevel && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${getBatteryColor(device.batteryLevel).includes('green') ? 'bg-green-500' : 
                                getBatteryColor(device.batteryLevel).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${device.batteryLevel}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm ${getBatteryColor(device.batteryLevel)}`}>
                            {device.batteryLevel}%
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{device.lastSeen}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceRegistry;
export { DeviceRegistry };