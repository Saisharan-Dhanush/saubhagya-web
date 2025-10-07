import React from 'react';
import { Settings } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

const Configuration: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">
          Manage platform settings, integrations, and security policies
        </p>
      </div>

      <EmptyState
        icon={Settings}
        title="Configuration Not Available"
        message="System configuration requires the Government Service endpoints."
        missingEndpoints={[
          'GET /config - Get system configuration',
          'PUT /config - Update system configuration'
        ]}
      />
    </div>
  );
};

export default Configuration;
export { Configuration };
