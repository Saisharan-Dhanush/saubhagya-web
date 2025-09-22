import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Award,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  RefreshCw,
  Volume2,
  Download,
  Search,
  Eye,
  Zap,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  DollarSign,
  Calendar,
  Globe,
  Lightbulb,
  Minus as TrendingFlat,
  Star,
  Brain,
  Network,
  MapPin
} from 'lucide-react';
import { useExecutiveAnalytics } from '../../contexts/ExecutiveAnalyticsContext';

interface Competitor {
  id: string;
  name: string;
  tier: 'direct' | 'indirect' | 'emerging';
  marketShare: number;
  revenue: number;
  growth: number;
  employees: number;
  regions: string[];
  strengths: string[];
  weaknesses: string[];
  recentMoves: string[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  innovationScore: number;
  customerSatisfaction: number;
  financialHealth: number;
  operationalEfficiency: number;
  logo?: string;
}

interface MarketSegment {
  id: string;
  name: string;
  size: number;
  growth: number;
  ourShare: number;
  leader: string;
  leaderShare: number;
  opportunity: 'low' | 'medium' | 'high';
  barriers: string[];
  trends: string[];
}

interface SWOTAnalysis {
  strengths: Array<{
    factor: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
    score: number;
  }>;
  weaknesses: Array<{
    factor: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
    score: number;
    actionPlan?: string;
  }>;
  opportunities: Array<{
    factor: string;
    potential: 'high' | 'medium' | 'low';
    description: string;
    timeframe: string;
    investmentRequired: number;
    expectedReturn: number;
  }>;
  threats: Array<{
    factor: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    probability: number;
    mitigation: string;
    timeline: string;
  }>;
}

interface BenchmarkMetric {
  metric: string;
  ourValue: number;
  industryAverage: number;
  topPerformer: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  ranking: number;
  totalCompetitors: number;
}

interface CompetitiveAdvantage {
  id: string;
  advantage: string;
  category: 'technology' | 'operational' | 'financial' | 'market' | 'human';
  sustainability: 'sustainable' | 'temporary' | 'at-risk';
  strength: number;
  description: string;
  evidence: string[];
  threats: string[];
  reinforcementPlan: string;
}

const CompetitiveIntelligence: React.FC = () => {
  const { competitiveData, refreshData, refreshing } = useExecutiveAnalytics();

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('12m');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState<boolean>(false);

  // Mock data for competitive intelligence
  const [competitors] = useState<Competitor[]>([
    {
      id: 'comp001',
      name: 'EcoGas Solutions',
      tier: 'direct',
      marketShare: 25.3,
      revenue: 180000000000,
      growth: 18.5,
      employees: 3200,
      regions: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Punjab'],
      strengths: ['Government Relations', 'Scale Operations', 'Financial Resources'],
      weaknesses: ['Innovation Speed', 'Rural Penetration', 'Technology Adoption'],
      recentMoves: ['Acquired tech startup for ₹45Cr', 'Launched mobile app platform', 'Expanded to 3 new states'],
      threatLevel: 'high',
      innovationScore: 72,
      customerSatisfaction: 78,
      financialHealth: 91,
      operationalEfficiency: 85
    },
    {
      id: 'comp002',
      name: 'GreenTech Biogas',
      tier: 'direct',
      marketShare: 22.1,
      revenue: 158000000000,
      growth: 22.3,
      employees: 2800,
      regions: ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Kerala'],
      strengths: ['Technology Innovation', 'Customer Service', 'Digital Platform'],
      weaknesses: ['Market Coverage', 'Capital Efficiency', 'Brand Recognition'],
      recentMoves: ['IPO announced for Q2 2025', 'Partnership with IIT Chennai', 'AI optimization rollout'],
      threatLevel: 'critical',
      innovationScore: 89,
      customerSatisfaction: 85,
      financialHealth: 82,
      operationalEfficiency: 78
    },
    {
      id: 'comp003',
      name: 'Rural Energy Corp',
      tier: 'direct',
      marketShare: 15.7,
      revenue: 112000000000,
      growth: 12.8,
      employees: 1950,
      regions: ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Odisha'],
      strengths: ['Rural Network', 'Cost Efficiency', 'Local Partnerships'],
      weaknesses: ['Technology Infrastructure', 'Financial Resources', 'Scalability'],
      recentMoves: ['Secured ₹200Cr funding', 'Rural expansion program', 'Community partnership model'],
      threatLevel: 'medium',
      innovationScore: 65,
      customerSatisfaction: 82,
      financialHealth: 75,
      operationalEfficiency: 88
    },
    {
      id: 'comp004',
      name: 'CleanEnergy Dynamics',
      tier: 'indirect',
      marketShare: 8.2,
      revenue: 89000000000,
      growth: 35.1,
      employees: 1200,
      regions: ['West Bengal', 'Assam', 'Jharkhand'],
      strengths: ['Innovation', 'Agility', 'Technology Stack'],
      weaknesses: ['Market Presence', 'Scale', 'Financial Stability'],
      recentMoves: ['Series B funding ₹125Cr', 'AI research lab setup', 'International expansion plan'],
      threatLevel: 'medium',
      innovationScore: 95,
      customerSatisfaction: 87,
      financialHealth: 68,
      operationalEfficiency: 72
    }
  ]);

  const [marketSegments] = useState<MarketSegment[]>([
    {
      id: 'rural_communities',
      name: 'Rural Communities',
      size: 45000000000,
      growth: 15.2,
      ourShare: 22.1,
      leader: 'EcoGas Solutions',
      leaderShare: 28.5,
      opportunity: 'high',
      barriers: ['Infrastructure Development', 'Financing Solutions', 'Technology Adoption'],
      trends: ['Government push for clean energy', 'Rural digitization', 'Cooperative model adoption']
    },
    {
      id: 'industrial_waste',
      name: 'Industrial Waste Management',
      size: 28000000000,
      growth: 18.7,
      ourShare: 18.3,
      leader: 'GreenTech Biogas',
      leaderShare: 32.1,
      opportunity: 'medium',
      barriers: ['Regulatory Compliance', 'Technical Expertise', 'Capital Investment'],
      trends: ['Circular economy adoption', 'ESG compliance requirements', 'Zero waste initiatives']
    },
    {
      id: 'urban_waste',
      name: 'Urban Waste Processing',
      size: 35000000000,
      growth: 12.4,
      ourShare: 15.8,
      leader: 'EcoGas Solutions',
      leaderShare: 24.3,
      opportunity: 'medium',
      barriers: ['Urban Infrastructure', 'Municipal Partnerships', 'Scale Requirements'],
      trends: ['Smart city initiatives', 'Waste segregation mandates', 'Public-private partnerships']
    },
    {
      id: 'agricultural',
      name: 'Agricultural Biogas',
      size: 22000000000,
      growth: 20.8,
      ourShare: 25.6,
      leader: 'SAUBHAGYA',
      leaderShare: 25.6,
      opportunity: 'high',
      barriers: ['Farmer Education', 'Seasonal Variations', 'Supply Chain'],
      trends: ['Sustainable farming practices', 'Carbon credit awareness', 'Cooperative farming growth']
    }
  ]);

  const [swotAnalysis] = useState<SWOTAnalysis>({
    strengths: [
      {
        factor: 'Technology Innovation',
        impact: 'high',
        description: 'Advanced IoT integration and AI-driven optimization giving 15-20% efficiency advantage',
        score: 92
      },
      {
        factor: 'Rural Market Penetration',
        impact: 'high',
        description: 'Deep rural network with established community relationships across 12 states',
        score: 88
      },
      {
        factor: 'Operational Efficiency',
        impact: 'high',
        description: 'Lean operations model with 23% lower cost structure than industry average',
        score: 87
      },
      {
        factor: 'Financial Health',
        impact: 'medium',
        description: 'Strong balance sheet with low debt-to-equity ratio and positive cash flow',
        score: 85
      },
      {
        factor: 'Brand Trust',
        impact: 'medium',
        description: 'High customer satisfaction (4.6/5) and strong word-of-mouth referrals',
        score: 82
      }
    ],
    weaknesses: [
      {
        factor: 'Scale Limitations',
        impact: 'high',
        description: 'Smaller scale compared to top 2 competitors limiting economies of scale',
        score: 65,
        actionPlan: 'Aggressive expansion plan with ₹500Cr investment over 18 months'
      },
      {
        factor: 'Brand Recognition',
        impact: 'medium',
        description: 'Lower brand awareness in urban markets compared to established players',
        score: 58,
        actionPlan: 'Comprehensive brand building campaign focusing on ESG leadership'
      },
      {
        factor: 'Capital Resources',
        impact: 'medium',
        description: 'Limited access to large-scale funding compared to listed competitors',
        score: 62,
        actionPlan: 'IPO preparation and strategic investor partnerships'
      },
      {
        factor: 'Geographic Coverage',
        impact: 'medium',
        description: 'Presence in 12 states vs. competitors covering 15-20 states',
        score: 68,
        actionPlan: 'Phased expansion to 8 new states by 2025'
      }
    ],
    opportunities: [
      {
        factor: 'Government Policy Support',
        potential: 'high',
        description: 'New renewable energy policies creating ₹200Cr+ market opportunities',
        timeframe: '6-12 months',
        investmentRequired: 150000000,
        expectedReturn: 380000000
      },
      {
        factor: 'Carbon Credit Market',
        potential: 'high',
        description: 'International carbon market expansion with 40% price premium opportunities',
        timeframe: '12-18 months',
        investmentRequired: 200000000,
        expectedReturn: 650000000
      },
      {
        factor: 'Technology Integration',
        potential: 'medium',
        description: 'AI and IoT adoption creating competitive differentiation',
        timeframe: '3-9 months',
        investmentRequired: 120000000,
        expectedReturn: 280000000
      },
      {
        factor: 'Corporate ESG Demand',
        potential: 'high',
        description: 'Increasing corporate sustainability commitments driving B2B opportunities',
        timeframe: '6-15 months',
        investmentRequired: 80000000,
        expectedReturn: 320000000
      }
    ],
    threats: [
      {
        factor: 'New Market Entrants',
        severity: 'high',
        description: 'Well-funded startups with disruptive technology entering market',
        probability: 0.75,
        mitigation: 'Accelerate innovation and build switching costs through platform integration',
        timeline: '6-12 months'
      },
      {
        factor: 'Regulatory Changes',
        severity: 'medium',
        description: 'Potential changes in renewable energy subsidies affecting profitability',
        probability: 0.45,
        mitigation: 'Diversify revenue streams and reduce subsidy dependence',
        timeline: '12-24 months'
      },
      {
        factor: 'Economic Downturn',
        severity: 'medium',
        description: 'Economic slowdown affecting investment in renewable energy projects',
        probability: 0.35,
        mitigation: 'Focus on essential services and government contracts',
        timeline: '6-18 months'
      },
      {
        factor: 'Technology Disruption',
        severity: 'high',
        description: 'Breakthrough in alternative technologies making biogas less competitive',
        probability: 0.25,
        mitigation: 'Invest in R&D and maintain technology leadership',
        timeline: '24-36 months'
      }
    ]
  });

  const [benchmarkMetrics] = useState<BenchmarkMetric[]>([
    {
      metric: 'Revenue per Employee',
      ourValue: 10500000,
      industryAverage: 8200000,
      topPerformer: 12800000,
      unit: '₹',
      trend: 'up',
      ranking: 3,
      totalCompetitors: 15
    },
    {
      metric: 'Customer Acquisition Cost',
      ourValue: 25000,
      industryAverage: 32000,
      topPerformer: 18000,
      unit: '₹',
      trend: 'down',
      ranking: 4,
      totalCompetitors: 15
    },
    {
      metric: 'Customer Retention Rate',
      ourValue: 92,
      industryAverage: 85,
      topPerformer: 95,
      unit: '%',
      trend: 'up',
      ranking: 2,
      totalCompetitors: 15
    },
    {
      metric: 'Time to Market',
      ourValue: 8.5,
      industryAverage: 12.2,
      topPerformer: 6.8,
      unit: 'months',
      trend: 'down',
      ranking: 2,
      totalCompetitors: 15
    },
    {
      metric: 'Operational Efficiency',
      ourValue: 87.3,
      industryAverage: 78.5,
      topPerformer: 91.2,
      unit: '%',
      trend: 'up',
      ranking: 3,
      totalCompetitors: 15
    },
    {
      metric: 'Innovation Index',
      ourValue: 82,
      industryAverage: 68,
      topPerformer: 95,
      unit: 'score',
      trend: 'up',
      ranking: 4,
      totalCompetitors: 15
    }
  ]);

  const [competitiveAdvantages] = useState<CompetitiveAdvantage[]>([
    {
      id: 'tech_integration',
      advantage: 'IoT-AI Platform Integration',
      category: 'technology',
      sustainability: 'sustainable',
      strength: 92,
      description: 'Proprietary IoT platform with AI optimization providing 15-20% efficiency gains',
      evidence: ['15% higher biogas yield', '20% reduction in operational costs', '95% system uptime'],
      threats: ['Competitor technology catch-up', 'New disruptive technologies'],
      reinforcementPlan: 'Continuous R&D investment, patent protection, talent acquisition'
    },
    {
      id: 'rural_network',
      advantage: 'Deep Rural Penetration',
      category: 'market',
      sustainability: 'sustainable',
      strength: 88,
      description: 'Established community relationships and distribution network in rural areas',
      evidence: ['12 state presence', '85% rural customer base', 'Community partnership model'],
      threats: ['Competitor rural expansion', 'Digital disruption'],
      reinforcementPlan: 'Strengthen community partnerships, expand network, digital enhancement'
    },
    {
      id: 'cost_efficiency',
      advantage: 'Lean Operations Model',
      category: 'operational',
      sustainability: 'sustainable',
      strength: 85,
      description: 'Optimized operations delivering 23% cost advantage over industry average',
      evidence: ['23% lower OPEX', '87% operational efficiency', 'Automated processes'],
      threats: ['Scale disadvantages', 'Process replication by competitors'],
      reinforcementPlan: 'Process automation, scale expansion, continuous improvement'
    },
    {
      id: 'esg_leadership',
      advantage: 'ESG Leadership Position',
      category: 'market',
      sustainability: 'sustainable',
      strength: 89,
      description: 'Industry-leading ESG practices and carbon credit generation capabilities',
      evidence: ['A rating ESG score', '450 carbon credits generated', 'B Corp certification'],
      threats: ['ESG commoditization', 'Regulatory changes'],
      reinforcementPlan: 'ESG innovation, certification expansion, thought leadership'
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

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <TrendingFlat className="h-4 w-4 text-gray-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSustainabilityColor = (sustainability: string) => {
    switch (sustainability) {
      case 'sustainable':
        return 'bg-green-100 text-green-800';
      case 'temporary':
        return 'bg-yellow-100 text-yellow-800';
      case 'at-risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const speakCompetitiveSummary = () => {
    const marketShare = competitiveData.marketShare;
    const ranking = competitiveData.ranking;
    const strengthScore = competitiveData.strengthScore;

    const summaryText = `Competitive Intelligence Summary: We hold ${marketShare}% market share, ranking ${ranking} in the industry. Overall competitive strength score is ${strengthScore}%. We have ${competitors.filter(c => c.threatLevel === 'high' || c.threatLevel === 'critical').length} high-threat competitors. Key opportunities include government policy support and carbon credit market expansion.`;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(summaryText);
      speechSynthesis.speak(utterance);
    }
  };

  const exportCompetitiveReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      executiveSummary: {
        marketPosition: competitiveData,
        keyThreats: competitors.filter(c => c.threatLevel === 'high' || c.threatLevel === 'critical').length,
        topOpportunities: swotAnalysis.opportunities.slice(0, 3),
        competitiveAdvantages: competitiveAdvantages.length
      },
      competitors,
      marketSegments,
      swotAnalysis,
      benchmarkMetrics,
      competitiveAdvantages
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitive-intelligence-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Competitive Intelligence & Market Analysis</h2>
          <p className="text-gray-600">Comprehensive competitive positioning, market analysis, and strategic insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={speakCompetitiveSummary}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Listen
          </Button>
          <Button
            onClick={exportCompetitiveReport}
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

      {/* Competitive Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Market Share</p>
                <p className="text-2xl font-bold text-blue-600">
                  {competitiveData.marketShare}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Rank #{competitiveData.ranking} of {competitiveData.competitorCount}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Competitive Strength</p>
                <p className="text-2xl font-bold text-green-600">
                  {competitiveData.strengthScore}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Above industry average
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High-Threat Competitors</p>
                <p className="text-2xl font-bold text-orange-600">
                  {competitors.filter(c => c.threatLevel === 'high' || c.threatLevel === 'critical').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Requiring immediate attention
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Key Opportunities</p>
                <p className="text-2xl font-bold text-purple-600">
                  {swotAnalysis.opportunities.filter(o => o.potential === 'high').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  High-potential opportunities
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarking</TabsTrigger>
          <TabsTrigger value="advantages">Competitive Edge</TabsTrigger>
        </TabsList>

        {/* Market Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Market Position Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Market Position Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Market Share Visualization */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Market Share Distribution</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'EcoGas Solutions', share: 25.3, color: 'bg-red-500' },
                        { name: 'GreenTech Biogas', share: 22.1, color: 'bg-orange-500' },
                        { name: 'SAUBHAGYA', share: 18.5, color: 'bg-blue-500' },
                        { name: 'Rural Energy Corp', share: 15.7, color: 'bg-green-500' },
                        { name: 'CleanEnergy Dynamics', share: 8.2, color: 'bg-purple-500' },
                        { name: 'Others', share: 10.2, color: 'bg-gray-400' }
                      ].map((company, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded ${company.color}`}></div>
                            <span className="font-medium">{company.name}</span>
                            {company.name === 'SAUBHAGYA' && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Us
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{company.share}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competitive Positioning */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Competitive Positioning</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">3rd</div>
                        <div className="text-sm text-blue-700">Market Ranking</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">+3.2%</div>
                        <div className="text-sm text-green-700">YoY Growth</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{formatCurrency(125000000000)}</div>
                        <div className="text-sm text-purple-700">Revenue</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-sm text-orange-700">States Present</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Segments Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Market Segments Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketSegments.map((segment) => (
                    <Card key={segment.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{segment.name}</h4>
                              <Badge
                                variant="outline"
                                className={
                                  segment.opportunity === 'high' ? 'bg-green-100 text-green-800' :
                                  segment.opportunity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {segment.opportunity} opportunity
                              </Badge>
                              {segment.leader === 'SAUBHAGYA' && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Leader
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                              <div>
                                <div className="text-sm text-gray-600">Market Size</div>
                                <div className="font-medium">{formatCurrency(segment.size)}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Growth Rate</div>
                                <div className="font-medium text-green-600">+{segment.growth}%</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Our Share</div>
                                <div className="font-medium">{segment.ourShare}%</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Leader</div>
                                <div className="font-medium">{segment.leader} ({segment.leaderShare}%)</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Key Trends</div>
                            <div className="flex flex-wrap gap-1">
                              {segment.trends.map((trend, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {trend}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-600 mb-2">Market Barriers</div>
                            <div className="flex flex-wrap gap-1">
                              {segment.barriers.map((barrier, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                                  {barrier}
                                </Badge>
                              ))}
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
        </TabsContent>

        {/* Competitor Analysis Tab */}
        <TabsContent value="competitors" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Competitive Landscape */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Competitive Landscape Analysis
                </CardTitle>
                <div className="flex items-center gap-4 mt-4">
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6m">6 Months</SelectItem>
                      <SelectItem value="12m">12 Months</SelectItem>
                      <SelectItem value="24m">24 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Advanced Analysis
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {competitors.map((competitor) => (
                    <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-lg">{competitor.name}</CardTitle>
                              <Badge
                                variant="outline"
                                className={
                                  competitor.tier === 'direct' ? 'bg-red-100 text-red-800' :
                                  competitor.tier === 'indirect' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }
                              >
                                {competitor.tier} competitor
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getThreatColor(competitor.threatLevel)}
                              >
                                {competitor.threatLevel} threat
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span>Market Share: {competitor.marketShare}%</span>
                              <span>Revenue: {formatCurrency(competitor.revenue)}</span>
                              <span>Growth: {competitor.growth}%</span>
                              <span>Employees: {competitor.employees.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {Math.round((competitor.innovationScore + competitor.customerSatisfaction + competitor.financialHealth + competitor.operationalEfficiency) / 4)}
                            </div>
                            <div className="text-sm text-gray-600">Overall Score</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{competitor.innovationScore}</div>
                            <div className="text-xs text-blue-700">Innovation</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">{competitor.customerSatisfaction}</div>
                            <div className="text-xs text-green-700">Customer Sat</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">{competitor.financialHealth}</div>
                            <div className="text-xs text-purple-700">Financial</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-lg font-bold text-orange-600">{competitor.operationalEfficiency}</div>
                            <div className="text-xs text-orange-700">Operations</div>
                          </div>
                        </div>

                        {/* Geographic Presence */}
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Geographic Presence</div>
                          <div className="flex flex-wrap gap-1">
                            {competitor.regions.map((region, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                {region}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Strengths and Weaknesses */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Key Strengths</div>
                            <div className="space-y-1">
                              {competitor.strengths.map((strength, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  {strength}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Key Weaknesses</div>
                            <div className="space-y-1">
                              {competitor.weaknesses.map((weakness, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <AlertTriangle className="h-3 w-3 text-red-600" />
                                  {weakness}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Recent Strategic Moves */}
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Recent Strategic Moves</div>
                          <div className="space-y-2">
                            {competitor.recentMoves.map((move, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm p-2 bg-gray-50 rounded">
                                <Activity className="h-3 w-3 text-blue-600 mt-0.5" />
                                {move}
                              </div>
                            ))}
                          </div>
                        </div>

                        {showAdvancedAnalysis && (
                          <div className="pt-3 border-t border-gray-200">
                            <div className="text-sm font-medium text-gray-900 mb-3">Advanced Intelligence</div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-gray-600">Predicted Next Moves:</div>
                                <ul className="mt-1 space-y-1">
                                  <li>• Market expansion to new states</li>
                                  <li>• Technology acquisition or partnership</li>
                                  <li>• Price competition in key segments</li>
                                </ul>
                              </div>
                              <div>
                                <div className="text-gray-600">Vulnerability Assessment:</div>
                                <ul className="mt-1 space-y-1">
                                  <li>• Capital constraints limiting expansion</li>
                                  <li>• Technology gap in rural markets</li>
                                  <li>• Regulatory dependency risks</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SWOT Analysis Tab */}
        <TabsContent value="swot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Strategic SWOT Analysis
              </CardTitle>
              <p className="text-gray-600">Comprehensive analysis of Strengths, Weaknesses, Opportunities, and Threats</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {swotAnalysis.strengths.map((strength, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{strength.factor}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getImpactColor(strength.impact)}>
                              {strength.impact} impact
                            </Badge>
                            <span className="text-sm font-medium">{strength.score}/100</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">{strength.description}</div>
                        <Progress value={strength.score} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {swotAnalysis.weaknesses.map((weakness, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{weakness.factor}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getImpactColor(weakness.impact)}>
                              {weakness.impact} impact
                            </Badge>
                            <span className="text-sm font-medium">{weakness.score}/100</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">{weakness.description}</div>
                        <Progress value={weakness.score} className="h-2" />
                        {weakness.actionPlan && (
                          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            <strong>Action Plan:</strong> {weakness.actionPlan}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Lightbulb className="h-5 w-5" />
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {swotAnalysis.opportunities.map((opportunity, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-blue-800">{opportunity.factor}</span>
                              <Badge
                                variant="outline"
                                className={
                                  opportunity.potential === 'high' ? 'bg-green-100 text-green-800' :
                                  opportunity.potential === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {opportunity.potential} potential
                              </Badge>
                            </div>
                            <div className="text-sm text-blue-700 mt-1">{opportunity.description}</div>
                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                              <div>
                                <span className="text-gray-600">Timeframe:</span>
                                <div className="font-medium">{opportunity.timeframe}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Investment:</span>
                                <div className="font-medium">{formatCurrency(opportunity.investmentRequired)}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-medium text-green-600">
                              {formatCurrency(opportunity.expectedReturn)}
                            </div>
                            <div className="text-sm text-gray-600">Expected Return</div>
                            <div className="text-xs text-green-600 mt-1">
                              {Math.round((opportunity.expectedReturn / opportunity.investmentRequired) * 100)}% ROI
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Threats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="h-5 w-5" />
                      Threats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {swotAnalysis.threats.map((threat, index) => (
                      <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-orange-800">{threat.factor}</span>
                              <Badge
                                variant="outline"
                                className={
                                  threat.severity === 'high' ? 'bg-red-100 text-red-800' :
                                  threat.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }
                              >
                                {threat.severity} severity
                              </Badge>
                            </div>
                            <div className="text-sm text-orange-700 mt-1">{threat.description}</div>
                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                              <div>
                                <span className="text-gray-600">Timeline:</span>
                                <div className="font-medium">{threat.timeline}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Probability:</span>
                                <div className="font-medium">{Math.round(threat.probability * 100)}%</div>
                              </div>
                            </div>
                            <div className="mt-3 p-2 bg-white rounded text-sm">
                              <span className="text-gray-600">Mitigation:</span>
                              <div className="font-medium">{threat.mitigation}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benchmarking Tab */}
        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Competitive Benchmarking Analysis
              </CardTitle>
              <p className="text-gray-600">Performance comparison against industry standards and top performers</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {benchmarkMetrics.map((metric, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                            {getTrendIcon(metric.trend)}
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              Rank #{metric.ranking} of {metric.totalCompetitors}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                            {/* Our Performance */}
                            <div className="space-y-3">
                              <div className="text-sm text-gray-600">Our Performance</div>
                              <div className="text-2xl font-bold text-blue-600">
                                {metric.unit === '₹' ? formatCurrency(metric.ourValue) :
                                 metric.unit === 'months' ? `${metric.ourValue}${metric.unit}` :
                                 `${metric.ourValue}${metric.unit}`}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min((metric.ourValue / metric.topPerformer) * 100, 100)}%`
                                  }}
                                ></div>
                              </div>
                            </div>

                            {/* Industry Average */}
                            <div className="space-y-3">
                              <div className="text-sm text-gray-600">Industry Average</div>
                              <div className="text-2xl font-bold text-gray-600">
                                {metric.unit === '₹' ? formatCurrency(metric.industryAverage) :
                                 metric.unit === 'months' ? `${metric.industryAverage}${metric.unit}` :
                                 `${metric.industryAverage}${metric.unit}`}
                              </div>
                              <div className="text-sm">
                                <span className={`font-medium ${
                                  (metric.metric.includes('Cost') || metric.metric.includes('Time')) ?
                                  (metric.ourValue < metric.industryAverage ? 'text-green-600' : 'text-red-600') :
                                  (metric.ourValue > metric.industryAverage ? 'text-green-600' : 'text-red-600')
                                }`}>
                                  {(metric.metric.includes('Cost') || metric.metric.includes('Time')) ?
                                    (metric.ourValue < metric.industryAverage ? 'Better' : 'Worse') :
                                    (metric.ourValue > metric.industryAverage ? 'Above' : 'Below')
                                  } by {
                                    Math.abs(((metric.ourValue - metric.industryAverage) / metric.industryAverage) * 100).toFixed(1)
                                  }%
                                </span>
                              </div>
                            </div>

                            {/* Top Performer */}
                            <div className="space-y-3">
                              <div className="text-sm text-gray-600">Best in Class</div>
                              <div className="text-2xl font-bold text-green-600">
                                {metric.unit === '₹' ? formatCurrency(metric.topPerformer) :
                                 metric.unit === 'months' ? `${metric.topPerformer}${metric.unit}` :
                                 `${metric.topPerformer}${metric.unit}`}
                              </div>
                              <div className="text-sm">
                                <span className="text-orange-600 font-medium">
                                  Gap: {
                                    Math.abs(((metric.topPerformer - metric.ourValue) / metric.topPerformer) * 100).toFixed(1)
                                  }%
                                </span>
                              </div>
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

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Benchmarking Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {benchmarkMetrics.filter(m =>
                      (m.metric.includes('Cost') || m.metric.includes('Time')) ?
                      m.ourValue < m.industryAverage :
                      m.ourValue > m.industryAverage
                    ).length}
                  </div>
                  <div className="text-sm text-green-700 mt-2">Above Industry Average</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(benchmarkMetrics.reduce((sum, m) => sum + m.ranking, 0) / benchmarkMetrics.length)}
                  </div>
                  <div className="text-sm text-blue-700 mt-2">Average Ranking</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {benchmarkMetrics.filter(m => m.ranking <= 3).length}
                  </div>
                  <div className="text-sm text-purple-700 mt-2">Top 3 Rankings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitive Advantages Tab */}
        <TabsContent value="advantages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Competitive Advantages & Differentiation
              </CardTitle>
              <p className="text-gray-600">Analysis of sustainable competitive advantages and strategic differentiation</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {competitiveAdvantages.map((advantage) => (
                  <Card key={advantage.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{advantage.advantage}</CardTitle>
                            <Badge
                              variant="outline"
                              className={
                                advantage.category === 'technology' ? 'bg-blue-100 text-blue-800' :
                                advantage.category === 'operational' ? 'bg-green-100 text-green-800' :
                                advantage.category === 'financial' ? 'bg-purple-100 text-purple-800' :
                                advantage.category === 'market' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {advantage.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getSustainabilityColor(advantage.sustainability)}
                            >
                              {advantage.sustainability}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{advantage.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{advantage.strength}</div>
                          <div className="text-sm text-gray-600">Strength Score</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Evidence */}
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-3">Supporting Evidence</div>
                          <div className="space-y-2">
                            {advantage.evidence.map((evidence, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                                {evidence}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Threats */}
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-3">Potential Threats</div>
                          <div className="space-y-2">
                            {advantage.threats.map((threat, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5" />
                                {threat}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Reinforcement Plan */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-2">Reinforcement Strategy</div>
                        <div className="text-sm text-gray-700 p-3 bg-blue-50 rounded-lg">
                          {advantage.reinforcementPlan}
                        </div>
                      </div>

                      {/* Strength Meter */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Competitive Strength</span>
                          <span>{advantage.strength}/100</span>
                        </div>
                        <Progress value={advantage.strength} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advantage Portfolio Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Competitive Advantage Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By Category */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Advantages by Category</h4>
                  <div className="space-y-3">
                    {Array.from(new Set(competitiveAdvantages.map(a => a.category))).map(category => {
                      const categoryAdvantages = competitiveAdvantages.filter(a => a.category === category);
                      const avgStrength = categoryAdvantages.reduce((sum, a) => sum + a.strength, 0) / categoryAdvantages.length;

                      return (
                        <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded ${
                              category === 'technology' ? 'bg-blue-100' :
                              category === 'operational' ? 'bg-green-100' :
                              category === 'financial' ? 'bg-purple-100' :
                              category === 'market' ? 'bg-orange-100' :
                              'bg-gray-100'
                            }`}>
                              <Brain className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium capitalize">{category}</div>
                              <div className="text-sm text-gray-600">{categoryAdvantages.length} advantages</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{Math.round(avgStrength)}/100</div>
                            <div className="text-sm text-gray-600">Avg Strength</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* By Sustainability */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Sustainability Assessment</h4>
                  <div className="space-y-3">
                    {['sustainable', 'temporary', 'at-risk'].map(sustainability => {
                      const sustainabilityAdvantages = competitiveAdvantages.filter(a => a.sustainability === sustainability);
                      const percentage = (sustainabilityAdvantages.length / competitiveAdvantages.length) * 100;

                      return (
                        <div key={sustainability} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium capitalize">{sustainability} Advantages</span>
                            <span>{sustainabilityAdvantages.length} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-green-800">Strategic Recommendation</div>
                    <div className="text-sm text-green-700 mt-1">
                      Focus on reinforcing sustainable advantages while developing mitigation strategies for at-risk advantages.
                      Priority should be given to technology and market advantages as they provide the strongest differentiation.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetitiveIntelligence;