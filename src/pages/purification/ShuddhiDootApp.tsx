import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { WebSocketProvider } from '../../contexts/WebSocketContext';
import { AlertProvider } from '../../contexts/AlertContext';
import { PurificationLayout } from '../../components/PurificationLayout';
import {
  ProcessMonitoringPage,
  QualityControlPage,
  ProcessOptimizationPage,
  MaintenancePage,
  BatchManagementPage
} from './pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds for real-time data
      refetchInterval: 5000, // Refresh every 5 seconds
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export default function ShuddhiDootApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <AlertProvider>
          <BrowserRouter>
            <PurificationLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/monitoring" replace />} />
                <Route path="/monitoring" element={<ProcessMonitoringPage />} />
                <Route path="/quality" element={<QualityControlPage />} />
                <Route path="/optimization" element={<ProcessOptimizationPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/batches" element={<BatchManagementPage />} />
              </Routes>
            </PurificationLayout>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </AlertProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  );
}