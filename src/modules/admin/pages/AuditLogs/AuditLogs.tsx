import React from 'react';
import { Shield } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

const AuditLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          Comprehensive audit trail of all system activities and user actions
        </p>
      </div>

      <EmptyState
        icon={Shield}
        title="Audit Logs Not Available"
        message="Audit logs require the Reporting Service audit endpoints."
        missingEndpoints={[
          'GET /audit/logs - Fetch audit logs',
          'POST /audit/export - Export audit logs'
        ]}
      />
    </div>
  );
};

export default AuditLogs;
export { AuditLogs };
