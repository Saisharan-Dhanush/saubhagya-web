import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { VoiceAnalytics } from './pages/VoiceAnalytics/VoiceAnalytics';
import { StrategicPlanning } from './pages/StrategicPlanning/StrategicPlanning';
import { OperationalMetrics } from './pages/OperationalMetrics/OperationalMetrics';
import { FinancialAnalytics } from './pages/FinancialAnalytics/FinancialAnalytics';
import { CarbonDashboard } from './pages/CarbonDashboard/CarbonDashboard';
import { MarketIntelligence } from './pages/MarketIntelligence/MarketIntelligence';
import { PredictiveAnalytics } from './pages/PredictiveAnalytics/PredictiveAnalytics';

const UrjaNeta: React.FC = () => {
  return (
    <BaseLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/voice" element={<VoiceAnalytics />} />
        <Route path="/strategic" element={<StrategicPlanning />} />
        <Route path="/operations" element={<OperationalMetrics />} />
        <Route path="/financial" element={<FinancialAnalytics />} />
        <Route path="/carbon" element={<CarbonDashboard />} />
        <Route path="/market" element={<MarketIntelligence />} />
        <Route path="/predictive" element={<PredictiveAnalytics />} />
      </Routes>
    </BaseLayout>
  );
};

export default UrjaNeta;