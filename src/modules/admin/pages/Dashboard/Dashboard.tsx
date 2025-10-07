import React from 'react';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and system health monitoring
        </p>
      </div>

      <EmptyState
        icon={BarChart3}
        title="Dashboard Metrics Not Available"
        message="System metrics require the Reporting Service to be fully implemented."
        missingEndpoints={[
          'GET /system/metrics - System health metrics',
          'GET /system/services - Microservices status',
          'GET /system/performance - Performance data'
        ]}
      />
    </div>
  );
};

export default Dashboard;
export { Dashboard };
