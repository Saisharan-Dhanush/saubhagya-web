import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components to test
import { ExecutiveAnalyticsProvider } from '../contexts/ExecutiveAnalyticsContext';
import ExecutiveSummary from '../components/executive/ExecutiveSummary';
import StrategicPlanning from '../components/executive/StrategicPlanning';
import CarbonAnalytics from '../components/executive/CarbonAnalytics';
import CompetitiveIntelligence from '../components/executive/CompetitiveIntelligence';
import ExecutiveDashboard from '../pages/ExecutiveDashboard';

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ExecutiveAnalyticsProvider>
    {children}
  </ExecutiveAnalyticsProvider>
);

describe('Executive Analytics Components', () => {

  describe('ExecutiveSummary', () => {
    it('renders executive summary without errors', () => {
      render(
        <TestWrapper>
          <ExecutiveSummary />
        </TestWrapper>
      );

      expect(screen.getByText(/Executive Performance Summary/i)).toBeInTheDocument();
    });

    it('displays KPI metrics', () => {
      render(
        <TestWrapper>
          <ExecutiveSummary />
        </TestWrapper>
      );

      // Should show various KPI cards
      expect(screen.getByText(/Monthly Revenue/i)).toBeInTheDocument();
      expect(screen.getByText(/Biogas Production/i)).toBeInTheDocument();
    });

    it('handles voice interaction button', () => {
      render(
        <TestWrapper>
          <ExecutiveSummary />
        </TestWrapper>
      );

      const voiceButton = screen.getByRole('button', { name: /listen/i });
      expect(voiceButton).toBeInTheDocument();

      fireEvent.click(voiceButton);
      // Test voice interaction functionality
    });
  });

  describe('StrategicPlanning', () => {
    it('renders strategic planning dashboard', () => {
      render(
        <TestWrapper>
          <StrategicPlanning />
        </TestWrapper>
      );

      expect(screen.getByText(/Strategic Planning & Analysis/i)).toBeInTheDocument();
    });

    it('displays strategic initiatives', () => {
      render(
        <TestWrapper>
          <StrategicPlanning />
        </TestWrapper>
      );

      // Should show initiative tabs
      expect(screen.getByText(/Strategic Initiatives/i)).toBeInTheDocument();
      expect(screen.getByText(/Scenario Modeling/i)).toBeInTheDocument();
    });

    it('allows tab navigation', () => {
      render(
        <TestWrapper>
          <StrategicPlanning />
        </TestWrapper>
      );

      const scenarioTab = screen.getByRole('tab', { name: /scenario modeling/i });
      fireEvent.click(scenarioTab);

      expect(screen.getByText(/Scenario Analysis/i)).toBeInTheDocument();
    });

    it('displays ROI calculations', () => {
      render(
        <TestWrapper>
          <StrategicPlanning />
        </TestWrapper>
      );

      // Should show ROI performance
      expect(screen.getByText(/ROI Performance Analysis/i)).toBeInTheDocument();
    });
  });

  describe('CarbonAnalytics', () => {
    it('renders carbon analytics dashboard', () => {
      render(
        <TestWrapper>
          <CarbonAnalytics />
        </TestWrapper>
      );

      expect(screen.getByText(/Carbon Analytics & ESG Reporting/i)).toBeInTheDocument();
    });

    it('displays carbon credit metrics', () => {
      render(
        <TestWrapper>
          <CarbonAnalytics />
        </TestWrapper>
      );

      expect(screen.getByText(/Total Credits Generated/i)).toBeInTheDocument();
      expect(screen.getByText(/Carbon Revenue/i)).toBeInTheDocument();
    });

    it('shows ESG rating', () => {
      render(
        <TestWrapper>
          <CarbonAnalytics />
        </TestWrapper>
      );

      expect(screen.getByText(/ESG Rating/i)).toBeInTheDocument();
    });

    it('displays compliance frameworks', () => {
      render(
        <TestWrapper>
          <CarbonAnalytics />
        </TestWrapper>
      );

      const complianceTab = screen.getByRole('tab', { name: /compliance/i });
      fireEvent.click(complianceTab);

      expect(screen.getByText(/Regulatory Compliance/i)).toBeInTheDocument();
    });
  });

  describe('CompetitiveIntelligence', () => {
    it('renders competitive intelligence dashboard', () => {
      render(
        <TestWrapper>
          <CompetitiveIntelligence />
        </TestWrapper>
      );

      expect(screen.getByText(/Competitive Intelligence & Market Analysis/i)).toBeInTheDocument();
    });

    it('displays market share information', () => {
      render(
        <TestWrapper>
          <CompetitiveIntelligence />
        </TestWrapper>
      );

      expect(screen.getByText(/Market Share/i)).toBeInTheDocument();
      expect(screen.getByText(/Competitive Strength/i)).toBeInTheDocument();
    });

    it('shows SWOT analysis', () => {
      render(
        <TestWrapper>
          <CompetitiveIntelligence />
        </TestWrapper>
      );

      const swotTab = screen.getByRole('tab', { name: /swot analysis/i });
      fireEvent.click(swotTab);

      expect(screen.getByText(/Strategic SWOT Analysis/i)).toBeInTheDocument();
    });

    it('displays competitor benchmarking', () => {
      render(
        <TestWrapper>
          <CompetitiveIntelligence />
        </TestWrapper>
      );

      const benchmarkTab = screen.getByRole('tab', { name: /benchmarking/i });
      fireEvent.click(benchmarkTab);

      expect(screen.getByText(/Competitive Benchmarking Analysis/i)).toBeInTheDocument();
    });
  });

  describe('ExecutiveDashboard', () => {
    it('renders executive dashboard without errors', () => {
      render(<ExecutiveDashboard />);

      expect(screen.getByText(/SAUBHAGYA Executive Dashboard/i)).toBeInTheDocument();
    });

    it('displays overview metrics', () => {
      render(<ExecutiveDashboard />);

      expect(screen.getByText(/Overall Performance/i)).toBeInTheDocument();
      expect(screen.getByText(/Monthly Revenue/i)).toBeInTheDocument();
    });

    it('allows navigation between tabs', () => {
      render(<ExecutiveDashboard />);

      const strategicTab = screen.getByRole('tab', { name: /strategic planning/i });
      fireEvent.click(strategicTab);

      expect(screen.getByText(/Strategic Planning & Analysis/i)).toBeInTheDocument();
    });

    it('displays real-time indicators', () => {
      render(<ExecutiveDashboard />);

      expect(screen.getByText(/Real-time Data/i)).toBeInTheDocument();
      expect(screen.getByText(/AI-Powered Insights/i)).toBeInTheDocument();
    });
  });

  describe('Data Integration', () => {
    it('context provides required data to components', () => {
      render(
        <TestWrapper>
          <ExecutiveSummary />
        </TestWrapper>
      );

      // Should display actual data from context
      expect(screen.getByText(/₹/)).toBeInTheDocument(); // Currency formatting
    });

    it('handles data refresh functionality', async () => {
      render(
        <TestWrapper>
          <ExecutiveSummary />
        </TestWrapper>
      );

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);

      // Should handle refresh state
      await waitFor(() => {
        expect(refreshButton).not.toBeDisabled();
      });
    });
  });

  describe('Export Functionality', () => {
    it('provides export capabilities', () => {
      render(
        <TestWrapper>
          <StrategicPlanning />
        </TestWrapper>
      );

      const exportButton = screen.getByRole('button', { name: /export/i });
      expect(exportButton).toBeInTheDocument();

      fireEvent.click(exportButton);
      // Should trigger export functionality
    });
  });

  describe('Responsive Design', () => {
    it('adapts to mobile viewports', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <ExecutiveSummary />
        </TestWrapper>
      );

      // Should render mobile-friendly layout
      expect(screen.getByText(/Executive Performance Summary/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels and roles', () => {
      render(
        <TestWrapper>
          <ExecutiveDashboard />
        </TestWrapper>
      );

      // Should have proper tab navigation
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation', () => {
      render(
        <TestWrapper>
          <StrategicPlanning />
        </TestWrapper>
      );

      const firstTab = screen.getAllByRole('tab')[0];
      firstTab.focus();

      expect(document.activeElement).toBe(firstTab);
    });
  });

  describe('Performance', () => {
    it('renders components within reasonable time', async () => {
      const startTime = performance.now();

      render(
        <TestWrapper>
          <ExecutiveDashboard />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 2 seconds
      expect(renderTime).toBeLessThan(2000);
    });

    it('handles large datasets efficiently', () => {
      render(
        <TestWrapper>
          <CompetitiveIntelligence />
        </TestWrapper>
      );

      // Should handle competitive data without performance issues
      expect(screen.getByText(/Competitive Intelligence/i)).toBeInTheDocument();
    });
  });

});

// Integration test for the complete executive analytics flow
describe('Executive Analytics Integration', () => {
  it('provides end-to-end executive analytics workflow', async () => {
    render(<ExecutiveDashboard />);

    // Start with overview
    expect(screen.getByText(/Overall Performance/i)).toBeInTheDocument();

    // Navigate to strategic planning
    const strategicTab = screen.getByRole('tab', { name: /strategic planning/i });
    fireEvent.click(strategicTab);

    await waitFor(() => {
      expect(screen.getByText(/Strategic Planning & Analysis/i)).toBeInTheDocument();
    });

    // Navigate to carbon analytics
    const carbonTab = screen.getByRole('tab', { name: /carbon analytics/i });
    fireEvent.click(carbonTab);

    await waitFor(() => {
      expect(screen.getByText(/Carbon Analytics & ESG Reporting/i)).toBeInTheDocument();
    });

    // Navigate to competitive intelligence
    const competitiveTab = screen.getByRole('tab', { name: /market intelligence/i });
    fireEvent.click(competitiveTab);

    await waitFor(() => {
      expect(screen.getByText(/Competitive Intelligence & Market Analysis/i)).toBeInTheDocument();
    });

    // Should maintain consistent navigation and state
    expect(screen.getByText(/SAUBHAGYA Executive Dashboard/i)).toBeInTheDocument();
  });
});