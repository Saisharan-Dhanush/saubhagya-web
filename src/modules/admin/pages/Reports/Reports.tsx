import React from 'react';
import { FileText } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revenue & Carbon Reports</h1>
        <p className="text-muted-foreground">
          Comprehensive financial and environmental impact reporting
        </p>
      </div>

      <EmptyState
        icon={FileText}
        title="Reports Not Available"
        message="Revenue and operational reports require Reporting Service endpoints."
        missingEndpoints={[
          'GET /reports/revenue - Revenue reports',
          'GET /reports/operations - Operational metrics'
        ]}
      />
    </div>
  );
};

export default Reports;
export { Reports };
