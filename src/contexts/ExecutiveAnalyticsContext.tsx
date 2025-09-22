import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ExecutiveKPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
  confidence: number;
  category: 'financial' | 'operational' | 'environmental' | 'strategic';
  priority: 'high' | 'medium' | 'low';
}

export interface PredictiveInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  category: string;
  actionRequired: boolean;
  timeline: string;
  estimatedValue?: number;
}

export interface StrategicInitiative {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  budget: number;
  spent: number;
  roi: number;
  timeline: {
    start: string;
    end: string;
    milestones: Array<{
      name: string;
      date: string;
      completed: boolean;
    }>;
  };
  riskLevel: 'low' | 'medium' | 'high';
  owner: string;
  category?: 'technology' | 'market-expansion' | 'operational' | 'financial' | 'strategic';
  businessValue?: string;
  kpis?: Array<{
    name: string;
    target: number;
    current: number;
    unit: string;
  }>;
}

export interface CarbonMetrics {
  creditsGenerated: number;
  creditsTarget: number;
  marketValue: number;
  projectedRevenue: number;
  co2Reduced: number;
  certifications: string[];
  marketTrends: {
    currentPrice: number;
    projectedPrice: number;
    volatility: number;
  };
  // Enhanced fields for CarbonAnalytics component
  esgRating: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  totalCreditsIssued: number;
  averagePricePerCredit: number;
  complianceFrameworks: number;
  creditsRetired: number;
  creditsPending: number;
}

export interface CompetitiveData {
  marketShare: number;
  ranking: number;
  competitorCount: number;
  strengthScore: number;
  weaknessAreas: string[];
  opportunities: string[];
  threats: string[];
  benchmarks: {
    efficiency: number;
    revenue: number;
    growth: number;
  };
  // Enhanced fields for CompetitiveIntelligence component
  highThreatCompetitors: number;
  keyOpportunities: number;
  overallCompetitiveStrength: number;
  marketGrowthRate: number;
  competitiveTrends: {
    innovation: number;
    customerSatisfaction: number;
    marketPresence: number;
  };
}

export interface VoiceQuery {
  id: string;
  query: string;
  timestamp: Date;
  response: string;
  confidence: number;
  category: string;
  language: 'en' | 'hi';
}

export interface PredictiveAnalytics {
  insights: PredictiveInsight[];
  forecasts: any[];
  trends: any[];
}

export interface CompetitiveIntelligence {
  competitiveData: CompetitiveData;
  benchmarks: any[];
  threats: string[];
  opportunities: string[];
}

export interface StrategicPlanning {
  initiatives: StrategicInitiative[];
  roadmap: any[];
  milestones: any[];
}

export interface ExecutiveAlerts {
  critical: PredictiveInsight[];
  warnings: PredictiveInsight[];
  opportunities: PredictiveInsight[];
}

interface ExecutiveAnalyticsContextType {
  // Data states
  kpis: ExecutiveKPI[];
  insights: PredictiveInsight[];
  initiatives: StrategicInitiative[];
  carbonMetrics: CarbonMetrics;
  competitiveData: CompetitiveData;
  voiceHistory: VoiceQuery[];

  // Loading states
  loading: boolean;
  refreshing: boolean;

  // Actions
  refreshData: () => Promise<void>;
  addVoiceQuery: (query: VoiceQuery) => void;
  updateKPI: (id: string, updates: Partial<ExecutiveKPI>) => void;
  updateInitiative: (id: string, updates: Partial<StrategicInitiative>) => void;

  // Computed values
  overallPerformanceScore: number;
  criticalAlerts: PredictiveInsight[];
  topOpportunities: PredictiveInsight[];
}

const ExecutiveAnalyticsContext = createContext<ExecutiveAnalyticsContextType | undefined>(undefined);

export const useExecutiveAnalytics = () => {
  const context = useContext(ExecutiveAnalyticsContext);
  if (!context) {
    throw new Error('useExecutiveAnalytics must be used within ExecutiveAnalyticsProvider');
  }
  return context;
};

interface ExecutiveAnalyticsProviderProps {
  children: ReactNode;
}

export const ExecutiveAnalyticsProvider: React.FC<ExecutiveAnalyticsProviderProps> = ({ children }) => {
  const [kpis, setKpis] = useState<ExecutiveKPI[]>([
    {
      id: 'revenue',
      name: 'Monthly Revenue',
      value: 125000000,
      unit: '₹',
      change: 15.8,
      trend: 'up',
      target: 150000000,
      confidence: 0.92,
      category: 'financial',
      priority: 'high'
    },
    {
      id: 'production',
      name: 'Biogas Production',
      value: 12500,
      unit: 'm³/day',
      change: 12.5,
      trend: 'up',
      target: 15000,
      confidence: 0.89,
      category: 'operational',
      priority: 'high'
    },
    {
      id: 'carbon_credits',
      name: 'Carbon Credits',
      value: 450,
      unit: 'tons CO2',
      change: 22.1,
      trend: 'up',
      target: 500,
      confidence: 0.85,
      category: 'environmental',
      priority: 'high'
    },
    {
      id: 'market_share',
      name: 'Market Share',
      value: 18.5,
      unit: '%',
      change: 3.2,
      trend: 'up',
      target: 25,
      confidence: 0.78,
      category: 'strategic',
      priority: 'medium'
    },
    {
      id: 'efficiency',
      name: 'Operational Efficiency',
      value: 87.3,
      unit: '%',
      change: 5.1,
      trend: 'up',
      target: 90,
      confidence: 0.91,
      category: 'operational',
      priority: 'medium'
    },
    {
      id: 'customer_satisfaction',
      name: 'Customer Satisfaction',
      value: 4.6,
      unit: '/5',
      change: -2.1,
      trend: 'down',
      target: 4.8,
      confidence: 0.83,
      category: 'strategic',
      priority: 'high'
    }
  ]);

  const [insights, setInsights] = useState<PredictiveInsight[]>([
    {
      id: 'revenue_forecast',
      title: 'Revenue Growth Acceleration',
      description: 'Current trajectory suggests 18% quarterly growth, exceeding targets by ₹25Cr',
      impact: 'positive',
      confidence: 0.87,
      category: 'financial',
      actionRequired: false,
      timeline: 'Next Quarter',
      estimatedValue: 25000000
    },
    {
      id: 'carbon_opportunity',
      title: 'Carbon Credit Market Expansion',
      description: 'International markets showing 35% price premium - opportunity for ₹8Cr additional revenue',
      impact: 'positive',
      confidence: 0.74,
      category: 'environmental',
      actionRequired: true,
      timeline: '3-6 months',
      estimatedValue: 80000000
    },
    {
      id: 'efficiency_risk',
      title: 'Production Efficiency Plateau',
      description: 'Three plants showing declining efficiency - risk of ₹12Cr revenue impact',
      impact: 'negative',
      confidence: 0.82,
      category: 'operational',
      actionRequired: true,
      timeline: 'Immediate',
      estimatedValue: -120000000
    }
  ]);

  const [initiatives, setInitiatives] = useState<StrategicInitiative[]>([
    {
      id: 'market_expansion',
      name: 'Regional Market Expansion',
      description: 'Expand operations to 5 new high-potential regions with focus on rural communities',
      status: 'in-progress',
      progress: 65,
      budget: 500000000,
      spent: 320000000,
      roi: 240,
      timeline: {
        start: '2024-01-01',
        end: '2024-12-31',
        milestones: [
          { name: 'Site Selection', date: '2024-03-15', completed: true },
          { name: 'Regulatory Approval', date: '2024-06-30', completed: true },
          { name: 'Construction Phase', date: '2024-10-15', completed: false },
          { name: 'Operations Launch', date: '2024-12-31', completed: false }
        ]
      },
      riskLevel: 'medium',
      owner: 'Regional Development Team',
      category: 'market-expansion',
      businessValue: 'Increase market presence and revenue base',
      kpis: [
        { name: 'New Regions', target: 5, current: 3, unit: 'regions' },
        { name: 'Revenue Increase', target: 25, current: 18, unit: '%' }
      ]
    },
    {
      id: 'ai_optimization',
      name: 'AI-Driven Production Optimization',
      description: 'Implement ML algorithms for biogas production efficiency and predictive maintenance',
      status: 'planning',
      progress: 25,
      budget: 200000000,
      spent: 50000000,
      roi: 380,
      timeline: {
        start: '2024-06-01',
        end: '2024-11-30',
        milestones: [
          { name: 'Algorithm Development', date: '2024-07-15', completed: false },
          { name: 'Pilot Testing', date: '2024-09-30', completed: false },
          { name: 'Full Deployment', date: '2024-11-30', completed: false }
        ]
      },
      riskLevel: 'low',
      owner: 'Technology Innovation Team',
      category: 'technology',
      businessValue: 'Improve operational efficiency and reduce costs',
      kpis: [
        { name: 'Efficiency Gain', target: 20, current: 5, unit: '%' },
        { name: 'Cost Reduction', target: 15, current: 0, unit: '%' }
      ]
    },
    {
      id: 'carbon_trading',
      name: 'Carbon Credit Trading Platform',
      description: 'Develop integrated platform for carbon credit generation and trading',
      status: 'in-progress',
      progress: 45,
      budget: 150000000,
      spent: 68000000,
      roi: 450,
      timeline: {
        start: '2024-03-01',
        end: '2025-01-31',
        milestones: [
          { name: 'Platform Design', date: '2024-05-15', completed: true },
          { name: 'Compliance Setup', date: '2024-08-30', completed: true },
          { name: 'Market Integration', date: '2024-12-15', completed: false },
          { name: 'Full Launch', date: '2025-01-31', completed: false }
        ]
      },
      riskLevel: 'medium',
      owner: 'Environmental Strategy Team',
      category: 'strategic',
      businessValue: 'Create new revenue stream from carbon credits',
      kpis: [
        { name: 'Credits Generated', target: 2000, current: 850, unit: 'tons' },
        { name: 'Revenue from Credits', target: 80, current: 35, unit: '₹Cr' }
      ]
    },
    {
      id: 'rural_digitization',
      name: 'Rural Digitization Initiative',
      description: 'Digital transformation of rural operations and farmer engagement',
      status: 'planning',
      progress: 15,
      budget: 120000000,
      spent: 18000000,
      roi: 280,
      timeline: {
        start: '2024-08-01',
        end: '2025-06-30',
        milestones: [
          { name: 'Technology Assessment', date: '2024-09-15', completed: false },
          { name: 'Pilot Implementation', date: '2024-12-31', completed: false },
          { name: 'Scale-up Phase', date: '2025-04-30', completed: false },
          { name: 'Full Deployment', date: '2025-06-30', completed: false }
        ]
      },
      riskLevel: 'high',
      owner: 'Digital Innovation Team',
      category: 'operational',
      businessValue: 'Improve farmer engagement and operational transparency',
      kpis: [
        { name: 'Farmers Onboarded', target: 10000, current: 1500, unit: 'farmers' },
        { name: 'Process Efficiency', target: 30, current: 8, unit: '%' }
      ]
    }
  ]);

  const [carbonMetrics, setCarbonMetrics] = useState<CarbonMetrics>({
    creditsGenerated: 450,
    creditsTarget: 500,
    marketValue: 67500000,
    projectedRevenue: 85000000,
    co2Reduced: 2250,
    certifications: ['Gold Standard', 'VCS', 'CDM'],
    marketTrends: {
      currentPrice: 150000,
      projectedPrice: 185000,
      volatility: 0.12
    },
    // Enhanced fields for CarbonAnalytics
    esgRating: 'A',
    environmentalScore: 87,
    socialScore: 82,
    governanceScore: 88,
    totalCreditsIssued: 420,
    averagePricePerCredit: 165000,
    complianceFrameworks: 4,
    creditsRetired: 380,
    creditsPending: 70
  });

  const [competitiveData, setCompetitiveData] = useState<CompetitiveData>({
    marketShare: 18.5,
    ranking: 3,
    competitorCount: 15,
    strengthScore: 85,
    weaknessAreas: ['Brand Recognition', 'Scale Limitations'],
    opportunities: ['Government Policy Support', 'Carbon Market Growth', 'Technology Integration'],
    threats: ['New Market Entrants', 'Regulatory Changes', 'Technology Disruption'],
    benchmarks: {
      efficiency: 87,
      revenue: 92,
      growth: 85
    },
    // Enhanced fields for CompetitiveIntelligence
    highThreatCompetitors: 2,
    keyOpportunities: 3,
    overallCompetitiveStrength: 85,
    marketGrowthRate: 15.2,
    competitiveTrends: {
      innovation: 82,
      customerSatisfaction: 88,
      marketPresence: 78
    }
  });

  const [voiceHistory, setVoiceHistory] = useState<VoiceQuery[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prevKpis =>
        prevKpis.map(kpi => ({
          ...kpi,
          value: kpi.value + (Math.random() - 0.5) * (kpi.value * 0.01), // ±1% variance
          change: kpi.change + (Math.random() - 0.5) * 2, // ±2% change variance
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshData = async (): Promise<void> => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Refresh insights with new data
      const newInsights: PredictiveInsight[] = [
        {
          id: 'market_trend_' + Date.now(),
          title: 'Emerging Market Opportunity',
          description: `New government incentives in ${['Maharashtra', 'Gujarat', 'Punjab'][Math.floor(Math.random() * 3)]} creating 25% growth potential`,
          impact: 'positive',
          confidence: 0.76,
          category: 'strategic',
          actionRequired: true,
          timeline: '2-4 months',
          estimatedValue: 35000000
        }
      ];

      setInsights(prev => [...newInsights, ...prev.slice(0, 2)]);
    } finally {
      setRefreshing(false);
    }
  };

  const addVoiceQuery = (query: VoiceQuery) => {
    setVoiceHistory(prev => [query, ...prev.slice(0, 19)]); // Keep last 20 queries
  };

  const updateKPI = (id: string, updates: Partial<ExecutiveKPI>) => {
    setKpis(prev => prev.map(kpi => kpi.id === id ? { ...kpi, ...updates } : kpi));
  };

  const updateInitiative = (id: string, updates: Partial<StrategicInitiative>) => {
    setInitiatives(prev => prev.map(init => init.id === id ? { ...init, ...updates } : init));
  };

  // Computed values
  const overallPerformanceScore = Math.round(
    kpis.reduce((sum, kpi) => sum + (kpi.value / kpi.target) * 100, 0) / kpis.length
  );

  const criticalAlerts = insights.filter(insight =>
    insight.impact === 'negative' && insight.actionRequired && insight.confidence > 0.7
  );

  const topOpportunities = insights.filter(insight =>
    insight.impact === 'positive' && insight.confidence > 0.7
  ).sort((a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0));

  const value: ExecutiveAnalyticsContextType = {
    kpis,
    insights,
    initiatives,
    carbonMetrics,
    competitiveData,
    voiceHistory,
    loading,
    refreshing,
    refreshData,
    addVoiceQuery,
    updateKPI,
    updateInitiative,
    overallPerformanceScore,
    criticalAlerts,
    topOpportunities
  };

  return (
    <ExecutiveAnalyticsContext.Provider value={value}>
      {children}
    </ExecutiveAnalyticsContext.Provider>
  );
};