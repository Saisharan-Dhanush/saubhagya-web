import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  Users,
  RefreshCw,
  Volume2,
  Download,
  Filter,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Clock
} from 'lucide-react';
import { useExecutiveAnalytics, StrategicInitiative } from '../../contexts/ExecutiveAnalyticsContext';

interface ScenarioModel {
  id: string;
  name: string;
  description: string;
  assumptions: {
    marketGrowth: number;
    investmentLevel: number;
    riskFactor: number;
    timeframe: number;
  };
  projectedOutcomes: {
    revenue: number;
    profit: number;
    marketShare: number;
    roi: number;
    confidence: number;
  };
  risks: Array<{
    category: string;
    probability: number;
    impact: number;
    mitigation: string;
  }>;
}

interface InvestmentOpportunity {
  id: string;
  title: string;
  sector: string;
  investmentRequired: number;
  projectedRoi: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeToBreakeven: number;
  strategicAlignment: number;
  competitiveAdvantage: string;
  marketSize: number;
  confidence: number;
  npv: number;
  irr: number;
  paybackPeriod: number;
  discountRate: number;
}

interface GeographicOpportunity {
  id: string;
  region: string;
  state: string;
  marketSize: number;
  penetrationRate: number;
  competitionLevel: 'low' | 'medium' | 'high';
  regulatorySupport: number;
  infrastructureScore: number;
  investmentRequired: number;
  projectedRevenue: number;
  riskScore: number;
  opportunityScore: number;
}

interface MonteCarloSimulation {
  scenario: string;
  iterations: number;
  outcomes: {
    revenue: { mean: number; stdDev: number; percentile95: number; percentile5: number };
    profit: { mean: number; stdDev: number; percentile95: number; percentile5: number };
    roi: { mean: number; stdDev: number; percentile95: number; percentile5: number };
  };
  confidenceLevel: number;
  riskOfLoss: number;
}

interface SensitivityAnalysis {
  variable: string;
  baseValue: number;
  unit: string;
  impact: {
    low: { change: number; revenueImpact: number; roiImpact: number };
    high: { change: number; revenueImpact: number; roiImpact: number };
  };
  elasticity: number;
}

interface RiskAssessment {
  id: string;
  category: 'market' | 'operational' | 'financial' | 'regulatory' | 'technology';
  title: string;
  description: string;
  probability: number;
  impact: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategy: string;
  owner: string;
  status: 'identified' | 'monitoring' | 'mitigating' | 'resolved';
  estimatedCost: number;
}

const StrategicPlanning: React.FC = () => {
  const { initiatives, refreshData, refreshing, updateInitiative } = useExecutiveAnalytics();

  const [selectedScenario, setSelectedScenario] = useState<string>('baseline');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('12m');
  const [activeTab, setActiveTab] = useState<string>('initiatives');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState<boolean>(false);

  // Mock data for strategic planning components
  const [scenarioModels] = useState<ScenarioModel[]>([
    {
      id: 'baseline',
      name: 'Baseline Growth',
      description: 'Conservative growth with current market conditions',
      assumptions: {
        marketGrowth: 12,
        investmentLevel: 80,
        riskFactor: 20,
        timeframe: 12
      },
      projectedOutcomes: {
        revenue: 1500000000,
        profit: 375000000,
        marketShare: 22,
        roi: 25,
        confidence: 0.85
      },
      risks: [
        { category: 'Market', probability: 0.3, impact: 0.4, mitigation: 'Diversify customer base' },
        { category: 'Regulatory', probability: 0.2, impact: 0.6, mitigation: 'Government relations program' }
      ]
    },
    {
      id: 'aggressive',
      name: 'Aggressive Expansion',
      description: 'High-growth strategy with significant market expansion',
      assumptions: {
        marketGrowth: 25,
        investmentLevel: 150,
        riskFactor: 45,
        timeframe: 18
      },
      projectedOutcomes: {
        revenue: 2250000000,
        profit: 450000000,
        marketShare: 35,
        roi: 42,
        confidence: 0.68
      },
      risks: [
        { category: 'Market', probability: 0.5, impact: 0.7, mitigation: 'Phased expansion approach' },
        { category: 'Financial', probability: 0.4, impact: 0.8, mitigation: 'Strategic partnerships' }
      ]
    },
    {
      id: 'conservative',
      name: 'Conservative Consolidation',
      description: 'Focus on operational efficiency and market consolidation',
      assumptions: {
        marketGrowth: 8,
        investmentLevel: 50,
        riskFactor: 10,
        timeframe: 24
      },
      projectedOutcomes: {
        revenue: 1200000000,
        profit: 360000000,
        marketShare: 18,
        roi: 18,
        confidence: 0.92
      },
      risks: [
        { category: 'Competition', probability: 0.4, impact: 0.3, mitigation: 'Innovation investment' },
        { category: 'Technology', probability: 0.2, impact: 0.4, mitigation: 'R&D partnerships' }
      ]
    }
  ]);

  const [investmentOpportunities] = useState<InvestmentOpportunity[]>([
    {
      id: 'ai_optimization',
      title: 'AI-Driven Production Optimization',
      sector: 'Technology',
      investmentRequired: 250000000,
      projectedRoi: 320,
      riskLevel: 'medium',
      timeToBreakeven: 18,
      strategicAlignment: 95,
      competitiveAdvantage: 'First-mover advantage in biogas AI optimization',
      marketSize: 1500000000,
      confidence: 0.82,
      npv: 485000000,
      irr: 42.5,
      paybackPeriod: 2.8,
      discountRate: 12
    },
    {
      id: 'carbon_trading',
      title: 'Carbon Credit Trading Platform',
      sector: 'Environmental',
      investmentRequired: 150000000,
      projectedRoi: 450,
      riskLevel: 'low',
      timeToBreakeven: 12,
      strategicAlignment: 88,
      competitiveAdvantage: 'Integrated production and trading ecosystem',
      marketSize: 2800000000,
      confidence: 0.91,
      npv: 625000000,
      irr: 58.3,
      paybackPeriod: 2.1,
      discountRate: 10
    },
    {
      id: 'rural_expansion',
      title: 'Rural Distribution Network Expansion',
      sector: 'Infrastructure',
      investmentRequired: 800000000,
      projectedRoi: 180,
      riskLevel: 'high',
      timeToBreakeven: 36,
      strategicAlignment: 92,
      competitiveAdvantage: 'Last-mile connectivity advantage',
      marketSize: 5000000000,
      confidence: 0.76,
      npv: 320000000,
      irr: 28.7,
      paybackPeriod: 4.2,
      discountRate: 15
    },
    {
      id: 'smart_grid_integration',
      title: 'Smart Grid Integration Platform',
      sector: 'Technology',
      investmentRequired: 400000000,
      projectedRoi: 280,
      riskLevel: 'medium',
      timeToBreakeven: 24,
      strategicAlignment: 89,
      competitiveAdvantage: 'Integrated energy distribution network',
      marketSize: 3200000000,
      confidence: 0.78,
      npv: 420000000,
      irr: 35.2,
      paybackPeriod: 3.5,
      discountRate: 13
    }
  ]);

  const [geographicOpportunities] = useState<GeographicOpportunity[]>([
    {
      id: 'maharashtra_west',
      region: 'Western Maharashtra',
      state: 'Maharashtra',
      marketSize: 850000000,
      penetrationRate: 12,
      competitionLevel: 'medium',
      regulatorySupport: 85,
      infrastructureScore: 78,
      investmentRequired: 180000000,
      projectedRevenue: 320000000,
      riskScore: 25,
      opportunityScore: 88
    },
    {
      id: 'punjab_rural',
      region: 'Rural Punjab',
      state: 'Punjab',
      marketSize: 620000000,
      penetrationRate: 8,
      competitionLevel: 'low',
      regulatorySupport: 92,
      infrastructureScore: 82,
      investmentRequired: 140000000,
      projectedRevenue: 280000000,
      riskScore: 18,
      opportunityScore: 94
    },
    {
      id: 'gujarat_industrial',
      region: 'Industrial Gujarat',
      state: 'Gujarat',
      marketSize: 950000000,
      penetrationRate: 15,
      competitionLevel: 'high',
      regulatorySupport: 78,
      infrastructureScore: 88,
      investmentRequired: 220000000,
      projectedRevenue: 380000000,
      riskScore: 35,
      opportunityScore: 82
    },
    {
      id: 'up_eastern',
      region: 'Eastern Uttar Pradesh',
      state: 'Uttar Pradesh',
      marketSize: 720000000,
      penetrationRate: 6,
      competitionLevel: 'low',
      regulatorySupport: 75,
      infrastructureScore: 65,
      investmentRequired: 160000000,
      projectedRevenue: 250000000,
      riskScore: 28,
      opportunityScore: 85
    },
    {
      id: 'karnataka_tech',
      region: 'Tech Corridor Karnataka',
      state: 'Karnataka',
      marketSize: 580000000,
      penetrationRate: 10,
      competitionLevel: 'medium',
      regulatorySupport: 88,
      infrastructureScore: 92,
      investmentRequired: 125000000,
      projectedRevenue: 210000000,
      riskScore: 22,
      opportunityScore: 90
    }
  ]);

  const [monteCarloResults] = useState<MonteCarloSimulation[]>([
    {
      scenario: 'baseline',
      iterations: 10000,
      outcomes: {
        revenue: { mean: 1500000000, stdDev: 180000000, percentile95: 1820000000, percentile5: 1210000000 },
        profit: { mean: 375000000, stdDev: 65000000, percentile95: 485000000, percentile5: 285000000 },
        roi: { mean: 25, stdDev: 4.2, percentile95: 32.5, percentile5: 18.8 }
      },
      confidenceLevel: 0.85,
      riskOfLoss: 0.12
    },
    {
      scenario: 'aggressive',
      iterations: 10000,
      outcomes: {
        revenue: { mean: 2250000000, stdDev: 385000000, percentile95: 2885000000, percentile5: 1680000000 },
        profit: { mean: 450000000, stdDev: 125000000, percentile95: 665000000, percentile5: 285000000 },
        roi: { mean: 42, stdDev: 8.5, percentile95: 56.2, percentile5: 28.5 }
      },
      confidenceLevel: 0.68,
      riskOfLoss: 0.28
    },
    {
      scenario: 'conservative',
      iterations: 10000,
      outcomes: {
        revenue: { mean: 1200000000, stdDev: 85000000, percentile95: 1345000000, percentile5: 1085000000 },
        profit: { mean: 360000000, stdDev: 42000000, percentile95: 430000000, percentile5: 305000000 },
        roi: { mean: 18, stdDev: 2.8, percentile95: 22.8, percentile5: 14.2 }
      },
      confidenceLevel: 0.92,
      riskOfLoss: 0.05
    }
  ]);

  const [sensitivityData] = useState<SensitivityAnalysis[]>([
    {
      variable: 'Market Growth Rate',
      baseValue: 12,
      unit: '%',
      impact: {
        low: { change: -20, revenueImpact: -180000000, roiImpact: -4.2 },
        high: { change: 30, revenueImpact: 285000000, roiImpact: 6.8 }
      },
      elasticity: 1.45
    },
    {
      variable: 'Raw Material Cost',
      baseValue: 35,
      unit: '₹/unit',
      impact: {
        low: { change: -15, revenueImpact: 125000000, roiImpact: 3.2 },
        high: { change: 25, revenueImpact: -185000000, roiImpact: -5.8 }
      },
      elasticity: -0.85
    },
    {
      variable: 'Carbon Credit Price',
      baseValue: 150000,
      unit: '₹/ton',
      impact: {
        low: { change: -30, revenueImpact: -95000000, roiImpact: -2.8 },
        high: { change: 40, revenueImpact: 165000000, roiImpact: 4.5 }
      },
      elasticity: 1.12
    },
    {
      variable: 'Regulatory Support',
      baseValue: 80,
      unit: 'score',
      impact: {
        low: { change: -25, revenueImpact: -220000000, roiImpact: -6.5 },
        high: { change: 20, revenueImpact: 145000000, roiImpact: 3.8 }
      },
      elasticity: 0.95
    },
    {
      variable: 'Technology Adoption Rate',
      baseValue: 65,
      unit: '%',
      impact: {
        low: { change: -30, revenueImpact: -155000000, roiImpact: -4.2 },
        high: { change: 35, revenueImpact: 198000000, roiImpact: 5.5 }
      },
      elasticity: 1.28
    }
  ]);

  const [riskAssessments] = useState<RiskAssessment[]>([
    {
      id: 'regulatory_changes',
      category: 'regulatory',
      title: 'Government Policy Changes',
      description: 'Potential changes in renewable energy subsidies and regulations',
      probability: 0.6,
      impact: 0.7,
      severity: 'high',
      mitigationStrategy: 'Active government relations and policy advocacy',
      owner: 'Government Affairs Team',
      status: 'monitoring',
      estimatedCost: 125000000
    },
    {
      id: 'market_saturation',
      category: 'market',
      title: 'Market Saturation Risk',
      description: 'Risk of market saturation in primary regions',
      probability: 0.4,
      impact: 0.8,
      severity: 'high',
      mitigationStrategy: 'Geographic diversification and new product development',
      owner: 'Strategic Planning Team',
      status: 'mitigating',
      estimatedCost: 200000000
    },
    {
      id: 'technology_disruption',
      category: 'technology',
      title: 'Disruptive Technology Threat',
      description: 'Emergence of competing renewable energy technologies',
      probability: 0.3,
      impact: 0.9,
      severity: 'critical',
      mitigationStrategy: 'R&D investment and technology partnerships',
      owner: 'Technology Innovation Team',
      status: 'mitigating',
      estimatedCost: 300000000
    }
  ]);

  const formatCurrency = (value: number): string => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'in-progress':
        return <PlayCircle className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'on-hold':
        return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityScore = (probability: number, impact: number): number => {
    return Math.round(probability * impact * 100);
  };

  const speakStrategicSummary = () => {
    const activeInitiatives = initiatives.filter(i => i.status === 'in-progress').length;
    const totalBudget = initiatives.reduce((sum, i) => sum + i.budget, 0);
    const avgRoi = initiatives.reduce((sum, i) => sum + i.roi, 0) / initiatives.length;
    const totalInvestmentOpps = investmentOpportunities.reduce((sum, o) => sum + o.investmentRequired, 0);
    const avgNpv = investmentOpportunities.reduce((sum, o) => sum + o.npv, 0) / investmentOpportunities.length;
    const topGeographicOpp = geographicOpportunities.sort((a, b) => b.opportunityScore - a.opportunityScore)[0];
    const highRisks = riskAssessments.filter(r => r.severity === 'high' || r.severity === 'critical').length;

    const summaryText = `Strategic Planning Executive Summary: ${activeInitiatives} strategic initiatives in progress with ${formatCurrency(totalBudget)} total budget and ${avgRoi.toFixed(1)}% average ROI. Investment portfolio includes ${investmentOpportunities.length} opportunities worth ${formatCurrency(totalInvestmentOpps)} with average NPV of ${formatCurrency(avgNpv)}. Top geographic opportunity is ${topGeographicOpp.region} with ${topGeographicOpp.opportunityScore} opportunity score. ${highRisks} high-priority risks require immediate attention. Monte Carlo analysis shows ${Math.round(monteCarloResults.find(r => r.scenario === selectedScenario)?.confidenceLevel * 100 || 0)}% confidence level for current scenario.`;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(summaryText);
      speechSynthesis.speak(utterance);
    }
  };

  const exportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      scenario: selectedScenario,
      timeframe: selectedTimeframe,
      summary: {
        activeInitiatives: initiatives.filter(i => i.status === 'in-progress').length,
        totalBudget: initiatives.reduce((sum, i) => sum + i.budget, 0),
        avgRoi: initiatives.reduce((sum, i) => sum + i.roi, 0) / initiatives.length,
        highPriorityRisks: riskAssessments.filter(r => r.severity === 'high' || r.severity === 'critical').length,
        totalInvestmentOpportunities: investmentOpportunities.length,
        topGeographicOpportunity: geographicOpportunities.sort((a, b) => b.opportunityScore - a.opportunityScore)[0]?.region || 'N/A'
      },
      initiatives,
      scenarios: scenarioModels,
      investments: {
        opportunities: investmentOpportunities,
        portfolioMetrics: {
          totalInvestment: investmentOpportunities.reduce((sum, o) => sum + o.investmentRequired, 0),
          averageNPV: investmentOpportunities.reduce((sum, o) => sum + o.npv, 0) / investmentOpportunities.length,
          averageIRR: investmentOpportunities.reduce((sum, o) => sum + o.irr, 0) / investmentOpportunities.length,
          averagePayback: investmentOpportunities.reduce((sum, o) => sum + o.paybackPeriod, 0) / investmentOpportunities.length
        }
      },
      geographic: {
        opportunities: geographicOpportunities,
        totalMarketSize: geographicOpportunities.reduce((sum, g) => sum + g.marketSize, 0),
        totalInvestmentRequired: geographicOpportunities.reduce((sum, g) => sum + g.investmentRequired, 0),
        averageOpportunityScore: geographicOpportunities.reduce((sum, g) => sum + g.opportunityScore, 0) / geographicOpportunities.length
      },
      simulation: {
        monteCarloResults,
        sensitivityAnalysis: sensitivityData,
        selectedScenarioConfidence: monteCarloResults.find(r => r.scenario === selectedScenario)?.confidenceLevel || 0
      },
      risks: {
        assessments: riskAssessments,
        totalExposure: riskAssessments.reduce((sum, r) => sum + r.estimatedCost, 0),
        activeMitigations: riskAssessments.filter(r => r.status === 'mitigating').length,
        resolvedRisks: riskAssessments.filter(r => r.status === 'resolved').length
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategic-planning-comprehensive-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedScenarioData = scenarioModels.find(s => s.id === selectedScenario);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Strategic Planning & Analysis</h2>
          <p className="text-gray-600">Long-term business planning, scenario modeling, and strategic initiatives</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={speakStrategicSummary}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Listen
          </Button>
          <Button
            onClick={exportReport}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''} mr-2`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Strategic Controls */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Scenario:</label>
          <Select value={selectedScenario} onValueChange={setSelectedScenario}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scenarioModels.map(scenario => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Timeframe:</label>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
              <SelectItem value="24m">24 Months</SelectItem>
              <SelectItem value="36m">36 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Advanced
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        {/* Strategic Initiatives Tab */}
        <TabsContent value="initiatives" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Initiative Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Initiative Portfolio Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {initiatives.filter(i => i.status === 'in-progress').length}
                    </div>
                    <div className="text-sm text-blue-700">Active Initiatives</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(initiatives.reduce((sum, i) => sum + i.budget, 0))}
                    </div>
                    <div className="text-sm text-green-700">Total Investment</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(initiatives.reduce((sum, i) => sum + i.roi, 0) / initiatives.length).toFixed(1)}%
                    </div>
                    <div className="text-sm text-purple-700">Average ROI</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length)}%
                    </div>
                    <div className="text-sm text-orange-700">Avg Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  ROI Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {initiatives.map((initiative) => (
                    <div key={initiative.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(initiative.status)}
                          <span className="font-medium">{initiative.name}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Budget: {formatCurrency(initiative.budget)} |
                          Spent: {formatCurrency(initiative.spent)} |
                          Progress: {initiative.progress}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          initiative.roi >= 300 ? 'text-green-600' :
                          initiative.roi >= 200 ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {initiative.roi}% ROI
                        </div>
                        <Badge variant="outline" className={getRiskColor(initiative.riskLevel)}>
                          {initiative.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Initiative Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {initiatives.map((initiative) => (
              <Card key={initiative.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{initiative.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{initiative.description}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        initiative.status === 'completed' ? 'bg-green-100 text-green-800' :
                        initiative.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        initiative.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {initiative.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Budget Utilization</span>
                      <div className="font-medium">
                        {formatCurrency(initiative.spent)} / {formatCurrency(initiative.budget)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected ROI</span>
                      <div className="font-medium text-green-600">{initiative.roi}%</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{initiative.progress}%</span>
                    </div>
                    <Progress value={initiative.progress} className="h-2" />
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600">Timeline</div>
                    <div className="font-medium">
                      {new Date(initiative.timeline.start).toLocaleDateString()} - {new Date(initiative.timeline.end).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600">Owner</div>
                    <div className="font-medium">{initiative.owner}</div>
                  </div>

                  {showAdvancedMetrics && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk Level:</span>
                          <Badge variant="outline" className={getRiskColor(initiative.riskLevel)}>
                            {initiative.riskLevel}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Milestones:</span>
                          <span>{initiative.timeline.milestones.length} planned</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scenario Modeling Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          {selectedScenarioData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Scenario Analysis: {selectedScenarioData.name}
                  </CardTitle>
                  <p className="text-gray-600">{selectedScenarioData.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Assumptions */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Key Assumptions</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Market Growth Rate</span>
                          <span className="font-medium">{selectedScenarioData.assumptions.marketGrowth}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Investment Level</span>
                          <span className="font-medium">{selectedScenarioData.assumptions.investmentLevel}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Risk Factor</span>
                          <span className="font-medium">{selectedScenarioData.assumptions.riskFactor}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Timeframe</span>
                          <span className="font-medium">{selectedScenarioData.assumptions.timeframe} months</span>
                        </div>
                      </div>
                    </div>

                    {/* Projected Outcomes */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Projected Outcomes</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(selectedScenarioData.projectedOutcomes.revenue)}
                          </div>
                          <div className="text-xs text-blue-700">Revenue</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(selectedScenarioData.projectedOutcomes.profit)}
                          </div>
                          <div className="text-xs text-green-700">Profit</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {selectedScenarioData.projectedOutcomes.marketShare}%
                          </div>
                          <div className="text-xs text-purple-700">Market Share</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">
                            {selectedScenarioData.projectedOutcomes.roi}%
                          </div>
                          <div className="text-xs text-orange-700">ROI</div>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <Badge
                          variant="outline"
                          className={`${
                            selectedScenarioData.projectedOutcomes.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
                            selectedScenarioData.projectedOutcomes.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {Math.round(selectedScenarioData.projectedOutcomes.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scenario Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Scenario Comparison Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">Scenario</th>
                          <th className="text-center py-3 px-4">Revenue</th>
                          <th className="text-center py-3 px-4">ROI</th>
                          <th className="text-center py-3 px-4">Market Share</th>
                          <th className="text-center py-3 px-4">Risk Level</th>
                          <th className="text-center py-3 px-4">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scenarioModels.map((scenario) => (
                          <tr
                            key={scenario.id}
                            className={`border-b border-gray-100 ${scenario.id === selectedScenario ? 'bg-blue-50' : ''}`}
                          >
                            <td className="py-3 px-4 font-medium">{scenario.name}</td>
                            <td className="text-center py-3 px-4">{formatCurrency(scenario.projectedOutcomes.revenue)}</td>
                            <td className="text-center py-3 px-4">{scenario.projectedOutcomes.roi}%</td>
                            <td className="text-center py-3 px-4">{scenario.projectedOutcomes.marketShare}%</td>
                            <td className="text-center py-3 px-4">{scenario.assumptions.riskFactor}%</td>
                            <td className="text-center py-3 px-4">
                              <Badge
                                variant="outline"
                                className={`${
                                  scenario.projectedOutcomes.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
                                  scenario.projectedOutcomes.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                {Math.round(scenario.projectedOutcomes.confidence * 100)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis for Selected Scenario */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Scenario Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedScenarioData.risks.map((risk, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{risk.category} Risk</div>
                          <div className="text-sm text-gray-600">{risk.mitigation}</div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-sm">
                            <span className="text-gray-600">Probability:</span> {Math.round(risk.probability * 100)}%
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Impact:</span> {Math.round(risk.impact * 100)}%
                          </div>
                          <Badge
                            variant="outline"
                            className={getSeverityScore(risk.probability, risk.impact) >= 50 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                          >
                            Score: {getSeverityScore(risk.probability, risk.impact)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Investment Portfolio Tab */}
        <TabsContent value="investments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Investment Opportunity Portfolio
              </CardTitle>
              <p className="text-gray-600">Prioritized investment opportunities with ROI analysis and strategic alignment</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {investmentOpportunities
                  .sort((a, b) => (b.projectedRoi * b.strategicAlignment) - (a.projectedRoi * a.strategicAlignment))
                  .map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                          <Badge variant="outline" className="mt-2">
                            {opportunity.sector}
                          </Badge>
                        </div>
                        <Badge
                          variant="outline"
                          className={getRiskColor(opportunity.riskLevel)}
                        >
                          {opportunity.riskLevel} risk
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(opportunity.investmentRequired)}
                          </div>
                          <div className="text-xs text-blue-700">Investment Required</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {opportunity.projectedRoi}%
                          </div>
                          <div className="text-xs text-green-700">Projected ROI</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {formatCurrency(opportunity.npv)}
                          </div>
                          <div className="text-xs text-purple-700">NPV</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">
                            {opportunity.irr}%
                          </div>
                          <div className="text-xs text-orange-700">IRR</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Time to Breakeven</span>
                          <span className="font-medium">{opportunity.timeToBreakeven} months</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Strategic Alignment</span>
                          <div className="flex items-center gap-2">
                            <Progress value={opportunity.strategicAlignment} className="h-2 w-16" />
                            <span className="font-medium">{opportunity.strategicAlignment}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Market Size</span>
                          <span className="font-medium">{formatCurrency(opportunity.marketSize)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payback Period</span>
                          <span className="font-medium">{opportunity.paybackPeriod} years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Discount Rate</span>
                          <span className="font-medium">{opportunity.discountRate}%</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-2">Competitive Advantage</div>
                        <div className="text-sm font-medium">{opportunity.competitiveAdvantage}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={`${
                            opportunity.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
                            opportunity.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {Math.round(opportunity.confidence * 100)}% Confidence
                        </Badge>
                        <Button size="sm" variant="outline">
                          Detailed Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Investment Portfolio Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Portfolio Optimization Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Risk-Return Profile</h4>
                  <div className="space-y-3">
                    {['low', 'medium', 'high'].map(risk => {
                      const opportunities = investmentOpportunities.filter(o => o.riskLevel === risk);
                      const avgRoi = opportunities.reduce((sum, o) => sum + o.projectedRoi, 0) / opportunities.length || 0;
                      const totalInvestment = opportunities.reduce((sum, o) => sum + o.investmentRequired, 0);

                      return (
                        <div key={risk} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium capitalize">{risk} Risk</div>
                            <div className="text-sm text-gray-600">{opportunities.length} opportunities</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{avgRoi.toFixed(1)}% ROI</div>
                            <div className="text-sm text-gray-600">{formatCurrency(totalInvestment)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Sector Distribution</h4>
                  <div className="space-y-3">
                    {Array.from(new Set(investmentOpportunities.map(o => o.sector))).map(sector => {
                      const sectorOpportunities = investmentOpportunities.filter(o => o.sector === sector);
                      const totalInvestment = sectorOpportunities.reduce((sum, o) => sum + o.investmentRequired, 0);

                      return (
                        <div key={sector} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{sector}</div>
                            <div className="text-sm text-gray-600">{sectorOpportunities.length} opportunities</div>
                          </div>
                          <div className="font-medium">{formatCurrency(totalInvestment)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Recommended Allocation</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-medium text-green-800">Optimal Portfolio</div>
                      <div className="text-sm text-green-700 mt-1">
                        Balanced risk-return allocation
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Expected ROI:</span>
                          <span className="font-medium">285%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Investment:</span>
                          <span className="font-medium">{formatCurrency(
                            investmentOpportunities.reduce((sum, o) => sum + o.investmentRequired, 0)
                          )}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Payback Period:</span>
                          <span className="font-medium">22 months</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Assessment Tab */}
        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Strategic Risk Assessment & Mitigation
              </CardTitle>
              <p className="text-gray-600">Comprehensive risk analysis with impact assessment and mitigation strategies</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Risk Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {['critical', 'high', 'medium', 'low'].map(severity => {
                    const risks = riskAssessments.filter(r => r.severity === severity);
                    return (
                      <div key={severity} className={`text-center p-4 rounded-lg ${
                        severity === 'critical' ? 'bg-red-100' :
                        severity === 'high' ? 'bg-orange-100' :
                        severity === 'medium' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <div className={`text-2xl font-bold ${
                          severity === 'critical' ? 'text-red-600' :
                          severity === 'high' ? 'text-orange-600' :
                          severity === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {risks.length}
                        </div>
                        <div className={`text-sm ${
                          severity === 'critical' ? 'text-red-700' :
                          severity === 'high' ? 'text-orange-700' :
                          severity === 'medium' ? 'text-yellow-700' :
                          'text-green-700'
                        }`}>
                          {severity.charAt(0).toUpperCase() + severity.slice(1)} Risk
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Risk Cards */}
                <div className="space-y-4">
                  {riskAssessments
                    .sort((a, b) => getSeverityScore(b.probability, b.impact) - getSeverityScore(a.probability, a.impact))
                    .map((risk) => (
                    <Card key={risk.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{risk.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className={
                                risk.category === 'market' ? 'bg-blue-100 text-blue-800' :
                                risk.category === 'operational' ? 'bg-green-100 text-green-800' :
                                risk.category === 'financial' ? 'bg-purple-100 text-purple-800' :
                                risk.category === 'regulatory' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {risk.category}
                              </Badge>
                              <Badge variant="outline" className={getRiskColor(risk.severity)}>
                                {risk.severity}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">
                              {getSeverityScore(risk.probability, risk.impact)}
                            </div>
                            <div className="text-sm text-gray-600">Risk Score</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Risk Metrics</div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Probability:</span>
                                <span className="font-medium">{Math.round(risk.probability * 100)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Impact:</span>
                                <span className="font-medium">{Math.round(risk.impact * 100)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Est. Cost:</span>
                                <span className="font-medium">{formatCurrency(risk.estimatedCost)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-600 mb-2">Mitigation Strategy</div>
                            <div className="text-sm">{risk.mitigationStrategy}</div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-600 mb-2">Management</div>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-gray-600">Owner:</span> {risk.owner}
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  risk.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                  risk.status === 'mitigating' ? 'bg-blue-100 text-blue-800' :
                                  risk.status === 'monitoring' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {risk.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Mitigation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Mitigation Investment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {formatCurrency(riskAssessments.reduce((sum, r) => sum + r.estimatedCost, 0))}
                  </div>
                  <div className="text-sm text-red-700 mt-2">Total Risk Exposure</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {riskAssessments.filter(r => r.status === 'mitigating').length}
                  </div>
                  <div className="text-sm text-blue-700 mt-2">Active Mitigations</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((riskAssessments.filter(r => r.status === 'resolved').length / riskAssessments.length) * 100)}%
                  </div>
                  <div className="text-sm text-green-700 mt-2">Risks Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Expansion Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Geographic Market Expansion Analysis
              </CardTitle>
              <p className="text-gray-600">Regional opportunity assessment and market penetration strategy</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Market Opportunity Map */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {geographicOpportunities
                    .sort((a, b) => b.opportunityScore - a.opportunityScore)
                    .map((region) => (
                    <Card key={region.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{region.region}</CardTitle>
                            <Badge variant="outline" className="mt-2">
                              {region.state}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {region.opportunityScore}
                            </div>
                            <div className="text-sm text-gray-600">Opportunity Score</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">
                              {formatCurrency(region.marketSize)}
                            </div>
                            <div className="text-xs text-blue-700">Market Size</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(region.projectedRevenue)}
                            </div>
                            <div className="text-xs text-green-700">Projected Revenue</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Current Penetration</span>
                            <div className="flex items-center gap-2">
                              <Progress value={region.penetrationRate} className="h-2 w-16" />
                              <span className="font-medium">{region.penetrationRate}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Regulatory Support</span>
                            <div className="flex items-center gap-2">
                              <Progress value={region.regulatorySupport} className="h-2 w-16" />
                              <span className="font-medium">{region.regulatorySupport}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Infrastructure</span>
                            <div className="flex items-center gap-2">
                              <Progress value={region.infrastructureScore} className="h-2 w-16" />
                              <span className="font-medium">{region.infrastructureScore}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Investment Required</span>
                            <span className="font-medium">{formatCurrency(region.investmentRequired)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Competition Level</span>
                            <Badge
                              variant="outline"
                              className={getRiskColor(region.competitionLevel)}
                            >
                              {region.competitionLevel}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Risk Score</span>
                            <span className={`font-medium ${
                              region.riskScore <= 20 ? 'text-green-600' :
                              region.riskScore <= 30 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {region.riskScore}/100
                            </span>
                          </div>
                        </div>

                        <Button size="sm" className="w-full">
                          View Detailed Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Regional Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Regional Expansion Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(geographicOpportunities.reduce((sum, r) => sum + r.marketSize, 0))}
                        </div>
                        <div className="text-sm text-blue-700 mt-2">Total Addressable Market</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(geographicOpportunities.reduce((sum, r) => sum + r.investmentRequired, 0))}
                        </div>
                        <div className="text-sm text-green-700 mt-2">Total Investment Required</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(geographicOpportunities.reduce((sum, r) => sum + r.projectedRevenue, 0))}
                        </div>
                        <div className="text-sm text-purple-700 mt-2">Total Projected Revenue</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.round(geographicOpportunities.reduce((sum, r) => sum + r.opportunityScore, 0) / geographicOpportunities.length)}
                        </div>
                        <div className="text-sm text-orange-700 mt-2">Avg Opportunity Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monte Carlo Simulation Tab */}
        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monte Carlo Simulation & Sensitivity Analysis
              </CardTitle>
              <p className="text-gray-600">Statistical modeling and risk assessment for strategic scenarios</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Monte Carlo Results */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Monte Carlo Simulation Results (10,000 iterations)</h4>
                  <div className="grid grid-cols-1 gap-6">
                    {monteCarloResults.map((result) => (
                      <Card key={result.scenario} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg capitalize">
                              {result.scenario} Scenario
                            </CardTitle>
                            <div className="flex items-center gap-4">
                              <Badge
                                variant="outline"
                                className={`${
                                  result.confidenceLevel >= 0.8 ? 'bg-green-100 text-green-800' :
                                  result.confidenceLevel >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                {Math.round(result.confidenceLevel * 100)}% Confidence
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`${
                                  result.riskOfLoss <= 0.1 ? 'bg-green-100 text-green-800' :
                                  result.riskOfLoss <= 0.25 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                {Math.round(result.riskOfLoss * 100)}% Risk of Loss
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Revenue Distribution */}
                            <div className="space-y-3">
                              <h5 className="font-medium text-blue-600">Revenue Distribution</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Mean:</span>
                                  <span className="font-medium">{formatCurrency(result.outcomes.revenue.mean)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Std Dev:</span>
                                  <span className="font-medium">{formatCurrency(result.outcomes.revenue.stdDev)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>95th %ile:</span>
                                  <span className="font-medium text-green-600">{formatCurrency(result.outcomes.revenue.percentile95)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>5th %ile:</span>
                                  <span className="font-medium text-red-600">{formatCurrency(result.outcomes.revenue.percentile5)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Profit Distribution */}
                            <div className="space-y-3">
                              <h5 className="font-medium text-green-600">Profit Distribution</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Mean:</span>
                                  <span className="font-medium">{formatCurrency(result.outcomes.profit.mean)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Std Dev:</span>
                                  <span className="font-medium">{formatCurrency(result.outcomes.profit.stdDev)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>95th %ile:</span>
                                  <span className="font-medium text-green-600">{formatCurrency(result.outcomes.profit.percentile95)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>5th %ile:</span>
                                  <span className="font-medium text-red-600">{formatCurrency(result.outcomes.profit.percentile5)}</span>
                                </div>
                              </div>
                            </div>

                            {/* ROI Distribution */}
                            <div className="space-y-3">
                              <h5 className="font-medium text-purple-600">ROI Distribution</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Mean:</span>
                                  <span className="font-medium">{result.outcomes.roi.mean.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Std Dev:</span>
                                  <span className="font-medium">{result.outcomes.roi.stdDev.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>95th %ile:</span>
                                  <span className="font-medium text-green-600">{result.outcomes.roi.percentile95.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>5th %ile:</span>
                                  <span className="font-medium text-red-600">{result.outcomes.roi.percentile5.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Sensitivity Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Sensitivity Analysis - Key Variables Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sensitivityData.map((variable, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{variable.variable}</CardTitle>
                              <Badge
                                variant="outline"
                                className={`${
                                  Math.abs(variable.elasticity) >= 1.2 ? 'bg-red-100 text-red-800' :
                                  Math.abs(variable.elasticity) >= 0.8 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}
                              >
                                Elasticity: {variable.elasticity.toFixed(2)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-lg font-bold text-gray-800">
                                  {variable.baseValue} {variable.unit}
                                </div>
                                <div className="text-sm text-gray-600">Base Value</div>
                              </div>
                              <div className="space-y-3">
                                <h5 className="font-medium text-red-600">Downside Scenario ({variable.impact.low.change}%)</h5>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Revenue Impact:</span>
                                    <span className="font-medium text-red-600">{formatCurrency(variable.impact.low.revenueImpact)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>ROI Impact:</span>
                                    <span className="font-medium text-red-600">{variable.impact.low.roiImpact.toFixed(1)}%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h5 className="font-medium text-green-600">Upside Scenario ({variable.impact.high.change}%)</h5>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Revenue Impact:</span>
                                    <span className="font-medium text-green-600">{formatCurrency(variable.impact.high.revenueImpact)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>ROI Impact:</span>
                                    <span className="font-medium text-green-600">+{variable.impact.high.roiImpact.toFixed(1)}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Long-term Planning Tab */}
        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Long-term Business Planning Framework
              </CardTitle>
              <p className="text-gray-600">Strategic roadmap and long-term vision execution</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Strategic Vision Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Strategic Vision Timeline (2024-2027)</h4>
                  <div className="space-y-4">
                    {[
                      {
                        year: '2024',
                        focus: 'Market Consolidation & Technology Integration',
                        goals: ['Achieve 25% market share', 'Complete AI optimization rollout', 'Launch carbon trading platform'],
                        investment: 850000000,
                        targetRoi: 280
                      },
                      {
                        year: '2025',
                        focus: 'Regional Expansion & Innovation',
                        goals: ['Expand to 5 new regions', 'Launch next-gen biogas technology', 'Establish R&D centers'],
                        investment: 1200000000,
                        targetRoi: 320
                      },
                      {
                        year: '2026',
                        focus: 'International Markets & Sustainability Leadership',
                        goals: ['Enter international markets', 'Achieve carbon neutrality', 'IPO preparation'],
                        investment: 1800000000,
                        targetRoi: 380
                      },
                      {
                        year: '2027',
                        focus: 'Global Leadership & Ecosystem Development',
                        goals: ['Global market presence', 'Complete ecosystem integration', 'Industry leadership'],
                        investment: 2500000000,
                        targetRoi: 450
                      }
                    ].map((phase) => (
                      <Card key={phase.year} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{phase.year}: {phase.focus}</CardTitle>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {phase.targetRoi}% ROI Target
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-600 mb-2">Strategic Goals</div>
                              <ul className="space-y-1">
                                {phase.goals.map((goal, index) => (
                                  <li key={index} className="text-sm flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    {goal}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Planned Investment</div>
                              <div className="text-2xl font-bold text-blue-600">
                                {formatCurrency(phase.investment)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Key Performance Indicators Tracking */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Long-term KPI Targets
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { metric: 'Annual Revenue', current: '₹125Cr', target: '₹500Cr', progress: 25 },
                          { metric: 'Market Share', current: '18.5%', target: '40%', progress: 46 },
                          { metric: 'Geographic Presence', current: '12 states', target: '28 states', progress: 43 },
                          { metric: 'Carbon Credits', current: '450 tons', target: '2,000 tons', progress: 23 },
                          { metric: 'Customer Base', current: '15,000', target: '100,000', progress: 15 }
                        ].map((kpi, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{kpi.metric}</span>
                              <span className="text-gray-600">{kpi.current} → {kpi.target}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={kpi.progress} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{kpi.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Strategic Success Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { factor: 'Technology Innovation', score: 85, trend: 'up' },
                          { factor: 'Market Position', score: 78, trend: 'up' },
                          { factor: 'Financial Health', score: 92, trend: 'stable' },
                          { factor: 'Operational Excellence', score: 87, trend: 'up' },
                          { factor: 'Sustainability Leadership', score: 74, trend: 'up' },
                          { factor: 'Talent & Culture', score: 81, trend: 'stable' }
                        ].map((factor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{factor.factor}</span>
                              {factor.trend === 'up' ?
                                <ArrowUpRight className="h-4 w-4 text-green-600" /> :
                                factor.trend === 'down' ?
                                <ArrowDownRight className="h-4 w-4 text-red-600" /> :
                                <Minus className="h-4 w-4 text-gray-600" />
                              }
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={factor.score} className="h-2 w-16" />
                              <span className="text-sm font-medium">{factor.score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicPlanning;