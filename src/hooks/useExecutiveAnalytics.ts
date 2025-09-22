import { useState, useEffect, useCallback, useMemo } from 'react';
import { useExecutiveAnalyticsContext } from '../contexts/ExecutiveAnalyticsContext';
import type { ExecutiveKPI, PredictiveAnalytics, CompetitiveIntelligence } from '../contexts/ExecutiveAnalyticsContext';

// Advanced analytics calculations
export interface AnalyticsCalculations {
  trendAnalysis: {
    momentum: number;
    acceleration: number;
    volatility: number;
    predictedDirection: 'bullish' | 'bearish' | 'neutral';
  };
  performanceScore: {
    overall: number;
    financial: number;
    operational: number;
    strategic: number;
    environmental: number;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    mitigation: string[];
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    action: string;
    expectedImpact: number;
    timeframe: string;
  }>;
}

export interface ExecutiveInsights {
  keyFindings: string[];
  opportunities: string[];
  concerns: string[];
  actionItems: Array<{
    item: string;
    urgency: 'immediate' | 'short-term' | 'long-term';
    owner: string;
  }>;
}

export interface PredictiveModels {
  revenue: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
    confidence: number;
    factors: string[];
  };
  growth: {
    rate: number;
    sustainability: number;
    drivers: string[];
    barriers: string[];
  };
  marketPosition: {
    predictedRank: number;
    marketShareChange: number;
    competitiveThreat: 'low' | 'medium' | 'high';
  };
}

export function useExecutiveAnalytics() {
  const { state, dispatch, refreshData, updateKPI, addAlert } = useExecutiveAnalyticsContext();
  const [calculatedAnalytics, setCalculatedAnalytics] = useState<AnalyticsCalculations | null>(null);
  const [insights, setInsights] = useState<ExecutiveInsights | null>(null);
  const [predictiveModels, setPredictiveModels] = useState<PredictiveModels | null>(null);

  // Calculate trend analysis
  const calculateTrendAnalysis = useCallback((kpis: ExecutiveKPI[]) => {
    const changes = kpis.map(kpi => kpi.change);
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const volatility = Math.sqrt(
      changes.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / changes.length
    );

    const momentum = avgChange;
    const acceleration = avgChange > 0 ? Math.min(avgChange / 10, 1) : Math.max(avgChange / 10, -1);

    let predictedDirection: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (momentum > 5 && acceleration > 0.2) predictedDirection = 'bullish';
    else if (momentum < -3 || acceleration < -0.3) predictedDirection = 'bearish';

    return {
      momentum,
      acceleration,
      volatility,
      predictedDirection
    };
  }, []);

  // Calculate performance scores
  const calculatePerformanceScore = useCallback((kpis: ExecutiveKPI[]) => {
    const scoresByCategory = kpis.reduce((acc, kpi) => {
      const achievementRatio = kpi.value / kpi.target;
      const score = Math.min(100, achievementRatio * 100);

      if (!acc[kpi.category]) acc[kpi.category] = [];
      acc[kpi.category].push(score);

      return acc;
    }, {} as Record<string, number[]>);

    const categoryScores = Object.entries(scoresByCategory).reduce((acc, [category, scores]) => {
      acc[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return acc;
    }, {} as Record<string, number>);

    const overall = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / Object.values(categoryScores).length;

    return {
      overall,
      financial: categoryScores.financial || 0,
      operational: categoryScores.operational || 0,
      strategic: categoryScores.strategic || 0,
      environmental: categoryScores.environmental || 0
    };
  }, []);

  // Assess risk level
  const assessRisk = useCallback((kpis: ExecutiveKPI[], performanceScore: any) => {
    const negativeKPIs = kpis.filter(kpi => kpi.change < 0).length;
    const underperformingKPIs = kpis.filter(kpi => kpi.value < kpi.target * 0.8).length;

    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const factors: string[] = [];
    const mitigation: string[] = [];

    if (performanceScore.overall < 60) {
      level = 'critical';
      factors.push('Overall performance below 60%');
      mitigation.push('Immediate performance improvement plan');
    } else if (performanceScore.overall < 75) {
      level = 'high';
      factors.push('Performance below target');
      mitigation.push('Enhanced monitoring and corrective actions');
    } else if (negativeKPIs > 2) {
      level = 'medium';
      factors.push('Multiple KPIs showing negative trends');
      mitigation.push('Trend analysis and targeted interventions');
    }

    if (underperformingKPIs > 0) {
      factors.push(`${underperformingKPIs} KPIs significantly below target`);
      mitigation.push('Resource reallocation and process optimization');
    }

    return { level, factors, mitigation };
  }, []);

  // Generate recommendations
  const generateRecommendations = useCallback((
    kpis: ExecutiveKPI[],
    trendAnalysis: any,
    performanceScore: any
  ) => {
    const recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      category: string;
      action: string;
      expectedImpact: number;
      timeframe: string;
    }> = [];

    // Performance-based recommendations
    if (performanceScore.financial < 80) {
      recommendations.push({
        priority: 'high',
        category: 'Financial',
        action: 'Implement revenue optimization strategies',
        expectedImpact: 15,
        timeframe: '2-3 months'
      });
    }

    if (performanceScore.operational < 85) {
      recommendations.push({
        priority: 'high',
        category: 'Operational',
        action: 'Optimize production efficiency and capacity utilization',
        expectedImpact: 12,
        timeframe: '1-2 months'
      });
    }

    // Trend-based recommendations
    if (trendAnalysis.predictedDirection === 'bearish') {
      recommendations.push({
        priority: 'high',
        category: 'Strategic',
        action: 'Implement defensive strategies and market repositioning',
        expectedImpact: 20,
        timeframe: '3-6 months'
      });
    }

    // Carbon credit opportunities
    const carbonKPI = kpis.find(kpi => kpi.id === 'carbon-credits');
    if (carbonKPI && carbonKPI.change > 15) {
      recommendations.push({
        priority: 'medium',
        category: 'Environmental',
        action: 'Accelerate carbon credit program expansion',
        expectedImpact: 25,
        timeframe: '4-6 months'
      });
    }

    return recommendations;
  }, []);

  // Generate executive insights
  const generateInsights = useCallback((
    kpis: ExecutiveKPI[],
    trendAnalysis: any,
    performanceScore: any
  ) => {
    const keyFindings: string[] = [];
    const opportunities: string[] = [];
    const concerns: string[] = [];
    const actionItems: Array<{
      item: string;
      urgency: 'immediate' | 'short-term' | 'long-term';
      owner: string;
    }> = [];

    // Key findings
    keyFindings.push(`Overall performance at ${performanceScore.overall.toFixed(1)}%`);
    keyFindings.push(`Market momentum is ${trendAnalysis.predictedDirection}`);

    const growingKPIs = kpis.filter(kpi => kpi.change > 10);
    if (growingKPIs.length > 0) {
      keyFindings.push(`${growingKPIs.length} KPIs showing strong growth (>10%)`);
    }

    // Opportunities
    const carbonKPI = kpis.find(kpi => kpi.id === 'carbon-credits');
    if (carbonKPI && carbonKPI.change > 20) {
      opportunities.push('Carbon credit market showing exceptional growth potential');
    }

    if (performanceScore.operational > 90) {
      opportunities.push('Operational excellence achieved - ready for scaling');
    }

    // Concerns
    const customerSatKPI = kpis.find(kpi => kpi.id === 'customer-satisfaction');
    if (customerSatKPI && customerSatKPI.change < 0) {
      concerns.push('Customer satisfaction declining - immediate attention required');
    }

    if (trendAnalysis.volatility > 15) {
      concerns.push('High market volatility indicates potential instability');
    }

    // Action items
    if (customerSatKPI && customerSatKPI.change < 0) {
      actionItems.push({
        item: 'Launch customer satisfaction improvement initiative',
        urgency: 'immediate',
        owner: 'Customer Success Team'
      });
    }

    actionItems.push({
      item: 'Review and update strategic planning based on current trends',
      urgency: 'short-term',
      owner: 'Strategic Planning Committee'
    });

    return { keyFindings, opportunities, concerns, actionItems };
  }, []);

  // Create predictive models
  const createPredictiveModels = useCallback((
    kpis: ExecutiveKPI[],
    predictiveAnalytics: PredictiveAnalytics
  ) => {
    const revenueKPI = kpis.find(kpi => kpi.id === 'revenue');
    const currentRevenue = revenueKPI?.value || 0;
    const growthRate = revenueKPI?.change || 0;

    const revenue = {
      nextMonth: currentRevenue * (1 + growthRate / 100),
      nextQuarter: currentRevenue * Math.pow(1 + growthRate / 100, 3),
      nextYear: predictiveAnalytics.revenue.predicted12Month,
      confidence: 85,
      factors: ['Market demand', 'Operational efficiency', 'Carbon credit revenue']
    };

    const growth = {
      rate: growthRate,
      sustainability: growthRate > 15 ? 75 : growthRate > 5 ? 85 : 95,
      drivers: ['Technology adoption', 'Market expansion', 'Government support'],
      barriers: ['Competition', 'Regulatory changes', 'Capital requirements']
    };

    const marketPosition = {
      predictedRank: 2,
      marketShareChange: 2.3,
      competitiveThreat: growthRate < 5 ? 'high' as const : growthRate > 15 ? 'low' as const : 'medium' as const
    };

    return { revenue, growth, marketPosition };
  }, []);

  // Main analytics calculation
  const calculateAnalytics = useCallback(() => {
    if (!state.kpis.length) return;

    const trendAnalysis = calculateTrendAnalysis(state.kpis);
    const performanceScore = calculatePerformanceScore(state.kpis);
    const riskAssessment = assessRisk(state.kpis, performanceScore);
    const recommendations = generateRecommendations(state.kpis, trendAnalysis, performanceScore);

    setCalculatedAnalytics({
      trendAnalysis,
      performanceScore,
      riskAssessment,
      recommendations
    });

    const insights = generateInsights(state.kpis, trendAnalysis, performanceScore);
    setInsights(insights);

    const predictiveModels = createPredictiveModels(state.kpis, state.predictiveAnalytics);
    setPredictiveModels(predictiveModels);
  }, [
    state.kpis,
    state.predictiveAnalytics,
    calculateTrendAnalysis,
    calculatePerformanceScore,
    assessRisk,
    generateRecommendations,
    generateInsights,
    createPredictiveModels
  ]);

  // Recalculate when data changes
  useEffect(() => {
    calculateAnalytics();
  }, [calculateAnalytics]);

  // Filter and sort KPIs
  const getKPIsByCategory = useCallback((category: string) => {
    return state.kpis.filter(kpi => kpi.category === category);
  }, [state.kpis]);

  const getTopPerformingKPIs = useCallback((count: number = 3) => {
    return [...state.kpis]
      .sort((a, b) => b.change - a.change)
      .slice(0, count);
  }, [state.kpis]);

  const getUnderperformingKPIs = useCallback((threshold: number = 0.8) => {
    return state.kpis.filter(kpi => kpi.value < kpi.target * threshold);
  }, [state.kpis]);

  // Alert management
  const createPerformanceAlert = useCallback((kpi: ExecutiveKPI) => {
    if (kpi.value < kpi.target * 0.7) {
      addAlert({
        id: `performance-${kpi.id}-${Date.now()}`,
        type: 'critical',
        title: `Critical Performance Alert: ${kpi.name}`,
        message: `${kpi.name} is significantly below target (${((kpi.value / kpi.target) * 100).toFixed(1)}% of target)`,
        category: 'performance',
        timestamp: new Date(),
        acknowledged: false,
        actionRequired: true,
        priority: 1
      });
    }
  }, [addAlert]);

  // Market comparison
  const getMarketComparison = useMemo(() => {
    const industryBenchmarks = {
      'biogas-production': 11000,
      'cbg-output': 7500,
      'revenue': 1000000,
      'carbon-credits': 380,
      'customer-satisfaction': 85
    };

    return state.kpis.map(kpi => {
      const benchmark = industryBenchmarks[kpi.id as keyof typeof industryBenchmarks] || kpi.target;
      const vsIndustry = ((kpi.value - benchmark) / benchmark) * 100;

      return {
        ...kpi,
        industryBenchmark: benchmark,
        vsIndustry,
        marketPosition: vsIndustry > 10 ? 'leader' : vsIndustry > 0 ? 'above-average' : vsIndustry > -10 ? 'average' : 'below-average'
      };
    });
  }, [state.kpis]);

  return {
    // State
    kpis: state.kpis,
    predictiveAnalytics: state.predictiveAnalytics,
    competitiveIntelligence: state.competitiveIntelligence,
    strategicPlanning: state.strategicPlanning,
    alerts: state.alerts,
    loading: state.loading,
    error: state.error,
    lastRefresh: state.lastRefresh,

    // Calculated analytics
    calculatedAnalytics,
    insights,
    predictiveModels,
    marketComparison: getMarketComparison,

    // Actions
    refreshData,
    updateKPI,
    addAlert,

    // Utility functions
    getKPIsByCategory,
    getTopPerformingKPIs,
    getUnderperformingKPIs,
    createPerformanceAlert,
    calculateAnalytics
  };
}