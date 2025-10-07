import React from 'react';
import { Wifi } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

const DeviceRegistry: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Device Registry</h1>
        <p className="text-muted-foreground">
          Manage IoT devices, RFID readers, sensors, and tracking units
        </p>
      </div>

      <EmptyState
        icon={Wifi}
        title="Device Registry Not Available"
        message="Device management requires the IoT Service to be operational."
        missingEndpoints={[
          'GET /devices - List all devices',
          'POST /devices/provision - Provision new device',
          'GET /devices/:id/status - Get device status'
        ]}
      />
    </div>
  );
};

export default DeviceRegistry;
export { DeviceRegistry };
