import React, { useEffect } from 'react';
import { usePlatform } from '../contexts/PlatformContext';
import { ExecutiveAnalyticsProvider } from '../contexts/ExecutiveAnalyticsContext';
import { ExecutiveCommandCenter } from '../components/executive/ExecutiveCommandCenter';

const ExecutiveDashboard: React.FC = () => {
  const { trackModuleUsage, updateBreadcrumbs } = usePlatform();

  // Track module usage and update breadcrumbs for platform integration
  useEffect(() => {
    trackModuleUsage('urja-neta');
    updateBreadcrumbs([
      { label: 'Executive', url: '/executive', module: 'urja-neta' },
      { label: 'Command Center', url: '/executive', module: 'urja-neta' }
    ]);
  }, []);

  return (
    <ExecutiveAnalyticsProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Executive Command Center</h1>
            <p className="text-gray-600">
              Unified platform analytics and cross-module insights for senior leadership
            </p>
          </div>
        </div>

        <ExecutiveCommandCenter />
      </div>
    </ExecutiveAnalyticsProvider>
  );
};

export default ExecutiveDashboard;