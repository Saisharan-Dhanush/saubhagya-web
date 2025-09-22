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
  Leaf,
  Globe,
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
  Calculator,
  Zap,
  Factory,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  DollarSign,
  Calendar,
  Users,
  Building,
  Wind,
  Recycle
} from 'lucide-react';
import { useExecutiveAnalytics } from '../../contexts/ExecutiveAnalyticsContext';

interface CarbonCreditData {
  id: string;
  projectName: string;
  creditType: 'VCS' | 'CDM' | 'Gold Standard' | 'CAR' | 'VER';
  creditsGenerated: number;
  creditsIssued: number;
  creditsSold: number;
  pricePerCredit: number;
  revenue: number;
  vintage: number;
  expiryDate: string;
  co2Reduced: number;
  verificationStatus: 'pending' | 'verified' | 'issued' | 'retired';
  buyer?: string;
  additionalityScore: number;
}

interface ESGMetrics {
  environmental: {
    carbonReduction: number;
    renewableEnergyGenerated: number;
    wasteReduction: number;
    waterConservation: number;
    biodiversityImpact: number;
    certifications: string[];
    score: number;
  };
  social: {
    jobsCreated: number;
    communityImpact: number;
    ruralFamiliesBenefited: number;
    healthImprovements: number;
    educationPrograms: number;
    genderEquity: number;
    score: number;
  };
  governance: {
    boardDiversity: number;
    transparencyIndex: number;
    ethicsScore: number;
    complianceRating: number;
    stakeholderEngagement: number;
    dataQuality: number;
    score: number;
  };
  overallRating: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
}

interface MarketTrend {
  date: string;
  vcsPrice: number;
  cdmPrice: number;
  goldStandardPrice: number;
  volume: number;
  volatility: number;
  marketCap: number;
}

interface ComplianceFramework {
  id: string;
  framework: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'pending';
  lastAssessment: string;
  nextDue: string;
  score: number;
  requirements: Array<{
    requirement: string;
    status: 'met' | 'partial' | 'not-met';
    evidence: string;
  }>;
  riskLevel: 'low' | 'medium' | 'high';
}

const CarbonAnalytics: React.FC = () => {
  const { carbonMetrics, refreshData, refreshing } = useExecutiveAnalytics();

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('12m');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [activeTab, setActiveTab] = useState<string>('credits');
  const [showProjections, setShowProjections] = useState<boolean>(false);

  // Mock data for carbon analytics
  const [carbonCredits] = useState<CarbonCreditData[]>([
    {
      id: 'cc001',
      projectName: 'Biogas Plant Maharashtra',
      creditType: 'VCS',
      creditsGenerated: 120,
      creditsIssued: 115,
      creditsSold: 98,
      pricePerCredit: 185000,
      revenue: 18130000,
      vintage: 2024,
      expiryDate: '2034-12-31',
      co2Reduced: 600,
      verificationStatus: 'issued',
      buyer: 'Green Energy Corp',
      additionalityScore: 92
    },
    {
      id: 'cc002',
      projectName: 'Rural Biogas Gujarat',
      creditType: 'Gold Standard',
      creditsGenerated: 85,
      creditsIssued: 85,
      creditsSold: 75,
      pricePerCredit: 210000,
      revenue: 15750000,
      vintage: 2024,
      expiryDate: '2034-06-30',
      co2Reduced: 425,
      verificationStatus: 'issued',
      buyer: 'Climate Solutions Ltd',
      additionalityScore: 89
    },
    {
      id: 'cc003',
      projectName: 'Community Biogas Punjab',
      creditType: 'CDM',
      creditsGenerated: 150,
      creditsIssued: 0,
      creditsSold: 0,
      pricePerCredit: 165000,
      revenue: 0,
      vintage: 2024,
      expiryDate: '2034-09-30',
      co2Reduced: 750,
      verificationStatus: 'pending',
      additionalityScore: 87
    },
    {
      id: 'cc004',
      projectName: 'Integrated Waste Management',
      creditType: 'VER',
      creditsGenerated: 200,
      creditsIssued: 180,
      creditsSold: 160,
      pricePerCredit: 155000,
      revenue: 24800000,
      vintage: 2024,
      expiryDate: '2034-03-31',
      co2Reduced: 1000,
      verificationStatus: 'issued',
      buyer: 'Carbon Offset International',
      additionalityScore: 94
    }
  ]);

  const [esgMetrics] = useState<ESGMetrics>({
    environmental: {
      carbonReduction: 2775,
      renewableEnergyGenerated: 45000,
      wasteReduction: 125000,
      waterConservation: 85000,
      biodiversityImpact: 78,
      certifications: ['ISO 14001', 'Gold Standard', 'VCS', 'B Corp'],
      score: 87
    },
    social: {
      jobsCreated: 1250,
      communityImpact: 85,
      ruralFamiliesBenefited: 12500,
      healthImprovements: 78,
      educationPrograms: 45,
      genderEquity: 72,
      score: 82
    },
    governance: {
      boardDiversity: 68,
      transparencyIndex: 91,
      ethicsScore: 89,
      complianceRating: 94,
      stakeholderEngagement: 86,
      dataQuality: 92,
      score: 88
    },
    overallRating: 'A'
  });

  const [marketTrends] = useState<MarketTrend[]>([
    { date: '2024-01', vcsPrice: 142000, cdmPrice: 128000, goldStandardPrice: 195000, volume: 2500000, volatility: 0.15, marketCap: 45000000000 },
    { date: '2024-02', vcsPrice: 148000, cdmPrice: 135000, goldStandardPrice: 201000, volume: 2750000, volatility: 0.12, marketCap: 47500000000 },
    { date: '2024-03', vcsPrice: 155000, cdmPrice: 140000, goldStandardPrice: 205000, volume: 2900000, volatility: 0.18, marketCap: 50200000000 },
    { date: '2024-04', vcsPrice: 162000, cdmPrice: 145000, goldStandardPrice: 210000, volume: 3100000, volatility: 0.14, marketCap: 52800000000 },
    { date: '2024-05', vcsPrice: 175000, cdmPrice: 158000, goldStandardPrice: 218000, volume: 3350000, volatility: 0.16, marketCap: 55600000000 },
    { date: '2024-06', vcsPrice: 185000, cdmPrice: 165000, goldStandardPrice: 225000, volume: 3500000, volatility: 0.11, marketCap: 58200000000 }
  ]);

  const [complianceFrameworks] = useState<ComplianceFramework[]>([
    {
      id: 'tcfd',
      framework: 'TCFD (Task Force on Climate-related Financial Disclosures)',
      status: 'compliant',
      lastAssessment: '2024-03-15',
      nextDue: '2025-03-15',
      score: 92,
      requirements: [
        { requirement: 'Climate Risk Governance', status: 'met', evidence: 'Board climate committee established' },
        { requirement: 'Strategy Disclosure', status: 'met', evidence: 'Climate strategy published' },
        { requirement: 'Risk Management', status: 'met', evidence: 'Climate risk framework implemented' },
        { requirement: 'Metrics & Targets', status: 'met', evidence: 'Net-zero targets set' }
      ],
      riskLevel: 'low'
    },
    {
      id: 'ghg',
      framework: 'GHG Protocol Corporate Standard',
      status: 'compliant',
      lastAssessment: '2024-02-28',
      nextDue: '2025-02-28',
      score: 89,
      requirements: [
        { requirement: 'Scope 1 Emissions', status: 'met', evidence: 'Direct emissions calculated' },
        { requirement: 'Scope 2 Emissions', status: 'met', evidence: 'Indirect emissions reported' },
        { requirement: 'Scope 3 Emissions', status: 'partial', evidence: 'Value chain assessment ongoing' },
        { requirement: 'Verification', status: 'met', evidence: 'Third-party verified' }
      ],
      riskLevel: 'low'
    },
    {
      id: 'science_targets',
      framework: 'Science Based Targets initiative (SBTi)',
      status: 'pending',
      lastAssessment: '2024-01-15',
      nextDue: '2024-07-15',
      score: 75,
      requirements: [
        { requirement: 'Target Setting', status: 'met', evidence: 'Targets submitted for validation' },
        { requirement: 'Coverage', status: 'partial', evidence: '85% scope 1&2 coverage achieved' },
        { requirement: 'Timeline', status: 'met', evidence: 'Net-zero by 2050 committed' },
        { requirement: 'Validation', status: 'not-met', evidence: 'Awaiting SBTi approval' }
      ],
      riskLevel: 'medium'
    },
    {
      id: 'cdp',
      framework: 'CDP Climate Change',
      status: 'compliant',
      lastAssessment: '2024-04-30',
      nextDue: '2025-04-30',
      score: 85,
      requirements: [
        { requirement: 'Climate Governance', status: 'met', evidence: 'A- rating achieved' },
        { requirement: 'Risk & Opportunity', status: 'met', evidence: 'Comprehensive assessment' },
        { requirement: 'Business Strategy', status: 'met', evidence: 'Climate integration documented' },
        { requirement: 'Targets & Performance', status: 'met', evidence: 'Progress tracking implemented' }
      ],
      riskLevel: 'low'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'issued':
      case 'compliant':
      case 'met':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
      case 'not-met':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getESGRatingColor = (rating: string) => {
    switch (rating) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C+':
      case 'C':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'D':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCreditTypeIcon = (type: string) => {
    switch (type) {
      case 'VCS':
        return <Shield className="h-4 w-4" />;
      case 'Gold Standard':
        return <Award className="h-4 w-4" />;
      case 'CDM':
        return <Globe className="h-4 w-4" />;
      case 'CAR':
        return <Factory className="h-4 w-4" />;
      case 'VER':
        return <Recycle className="h-4 w-4" />;
      default:
        return <Leaf className="h-4 w-4" />;
    }
  };

  const speakCarbonSummary = () => {
    const totalCredits = carbonCredits.reduce((sum, cc) => sum + cc.creditsGenerated, 0);
    const totalRevenue = carbonCredits.reduce((sum, cc) => sum + cc.revenue, 0);
    const avgPrice = totalRevenue / carbonCredits.reduce((sum, cc) => sum + cc.creditsSold, 0);

    const summaryText = `Carbon Analytics Summary: Generated ${totalCredits} carbon credits with total revenue of ${formatCurrency(totalRevenue)}. Average price per credit is ${formatCurrency(avgPrice)}. ESG rating is ${esgMetrics.overallRating}. Environmental score is ${esgMetrics.environmental.score}%, social score is ${esgMetrics.social.score}%, and governance score is ${esgMetrics.governance.score}%.`;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(summaryText);
      speechSynthesis.speak(utterance);
    }
  };

  const exportCarbonReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      carbonCredits,
      esgMetrics,
      marketTrends,
      complianceFrameworks,
      summary: {
        totalCredits: carbonCredits.reduce((sum, cc) => sum + cc.creditsGenerated, 0),
        totalRevenue: carbonCredits.reduce((sum, cc) => sum + cc.revenue, 0),
        co2Reduced: carbonCredits.reduce((sum, cc) => sum + cc.co2Reduced, 0),
        overallESGRating: esgMetrics.overallRating
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbon-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
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
          <h2 className="text-2xl font-bold text-gray-900">Carbon Analytics & ESG Reporting</h2>
          <p className="text-gray-600">Comprehensive carbon credit tracking, environmental impact analysis, and ESG compliance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={speakCarbonSummary}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Listen
          </Button>
          <Button
            onClick={exportCarbonReport}
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

      {/* Carbon Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Credits Generated</p>
                <p className="text-2xl font-bold text-green-600">
                  {carbonCredits.reduce((sum, cc) => sum + cc.creditsGenerated, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {carbonCredits.reduce((sum, cc) => sum + cc.co2Reduced, 0)} tons CO₂
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Carbon Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(carbonCredits.reduce((sum, cc) => sum + cc.revenue, 0))}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  +22% from last quarter
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ESG Rating</p>
                <p className={`text-2xl font-bold border-2 px-3 py-1 rounded-lg inline-block ${getESGRatingColor(esgMetrics.overallRating)}`}>
                  {esgMetrics.overallRating}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Top 10% in industry
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Market Price Avg</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(marketTrends[marketTrends.length - 1]?.vcsPrice || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  +18% this month
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="credits">Carbon Credits</TabsTrigger>
          <TabsTrigger value="esg">ESG Metrics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        {/* Carbon Credits Tab */}
        <TabsContent value="credits" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Credit Portfolio Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Carbon Credit Portfolio Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {carbonCredits.map((credit) => (
                    <Card key={credit.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{credit.projectName}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                {getCreditTypeIcon(credit.creditType)}
                                {credit.creditType}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getStatusColor(credit.verificationStatus)}
                              >
                                {credit.verificationStatus}
                              </Badge>
                              <Badge variant="outline">
                                Vintage {credit.vintage}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {credit.creditsGenerated}
                            </div>
                            <div className="text-sm text-gray-600">Credits Generated</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{credit.creditsIssued}</div>
                            <div className="text-xs text-blue-700">Issued</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">{credit.creditsSold}</div>
                            <div className="text-xs text-green-700">Sold</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">{formatCurrency(credit.pricePerCredit)}</div>
                            <div className="text-xs text-purple-700">Price/Credit</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-lg font-bold text-orange-600">{formatCurrency(credit.revenue)}</div>
                            <div className="text-xs text-orange-700">Revenue</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">CO₂ Reduction:</span>
                            <div className="font-medium">{credit.co2Reduced} tons</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Additionality Score:</span>
                            <div className="font-medium">{credit.additionalityScore}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Expires:</span>
                            <div className="font-medium">{new Date(credit.expiryDate).toLocaleDateString()}</div>
                          </div>
                        </div>

                        {credit.buyer && (
                          <div className="text-sm">
                            <span className="text-gray-600">Buyer:</span>
                            <span className="font-medium ml-2">{credit.buyer}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="text-sm">
                            <span className="text-gray-600">Utilization:</span>
                            <span className="font-medium ml-2">
                              {Math.round((credit.creditsSold / credit.creditsGenerated) * 100)}%
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Credit Type Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Credit Type Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(carbonCredits.map(cc => cc.creditType))).map(type => {
                      const typeCredits = carbonCredits.filter(cc => cc.creditType === type);
                      const totalCredits = typeCredits.reduce((sum, cc) => sum + cc.creditsGenerated, 0);
                      const totalRevenue = typeCredits.reduce((sum, cc) => sum + cc.revenue, 0);
                      const percentage = (totalCredits / carbonCredits.reduce((sum, cc) => sum + cc.creditsGenerated, 0)) * 100;

                      return (
                        <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded">
                              {getCreditTypeIcon(type)}
                            </div>
                            <div>
                              <div className="font-medium">{type}</div>
                              <div className="text-sm text-gray-600">{typeCredits.length} projects</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{totalCredits} credits</div>
                            <div className="text-sm text-gray-600">{formatCurrency(totalRevenue)}</div>
                            <div className="text-xs text-blue-600">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Additionality Score</span>
                        <span>{(carbonCredits.reduce((sum, cc) => sum + cc.additionalityScore, 0) / carbonCredits.length).toFixed(1)}%</span>
                      </div>
                      <Progress value={carbonCredits.reduce((sum, cc) => sum + cc.additionalityScore, 0) / carbonCredits.length} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Credit Issuance Rate</span>
                        <span>{Math.round((carbonCredits.reduce((sum, cc) => sum + cc.creditsIssued, 0) / carbonCredits.reduce((sum, cc) => sum + cc.creditsGenerated, 0)) * 100)}%</span>
                      </div>
                      <Progress value={(carbonCredits.reduce((sum, cc) => sum + cc.creditsIssued, 0) / carbonCredits.reduce((sum, cc) => sum + cc.creditsGenerated, 0)) * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sales Conversion Rate</span>
                        <span>{Math.round((carbonCredits.reduce((sum, cc) => sum + cc.creditsSold, 0) / carbonCredits.reduce((sum, cc) => sum + cc.creditsIssued, 0)) * 100)}%</span>
                      </div>
                      <Progress value={(carbonCredits.reduce((sum, cc) => sum + cc.creditsSold, 0) / carbonCredits.reduce((sum, cc) => sum + cc.creditsIssued, 0)) * 100} className="h-2" />
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(carbonCredits.reduce((sum, cc) => sum + cc.revenue, 0) / carbonCredits.reduce((sum, cc) => sum + cc.creditsSold, 0))}
                          </div>
                          <div className="text-xs text-green-700">Avg Price/Credit</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">
                            {carbonCredits.reduce((sum, cc) => sum + cc.co2Reduced, 0)}
                          </div>
                          <div className="text-xs text-blue-700">Total CO₂ Reduced</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ESG Metrics Tab */}
        <TabsContent value="esg" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* ESG Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  ESG Performance Dashboard
                </CardTitle>
                <div className="flex items-center gap-4 mt-4">
                  <div className={`text-3xl font-bold border-2 px-4 py-2 rounded-lg ${getESGRatingColor(esgMetrics.overallRating)}`}>
                    {esgMetrics.overallRating}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Overall ESG Rating</div>
                    <div className="text-sm text-gray-500">Industry ranking: Top 10%</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Environmental */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <Leaf className="h-5 w-5" />
                        Environmental
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{esgMetrics.environmental.score}</div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Carbon Reduction</span>
                          <span className="font-medium">{esgMetrics.environmental.carbonReduction} tons</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Renewable Energy</span>
                          <span className="font-medium">{esgMetrics.environmental.renewableEnergyGenerated.toLocaleString()} kWh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Waste Reduction</span>
                          <span className="font-medium">{esgMetrics.environmental.wasteReduction.toLocaleString()} kg</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Water Conservation</span>
                          <span className="font-medium">{esgMetrics.environmental.waterConservation.toLocaleString()} L</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-2">Certifications</div>
                        <div className="flex flex-wrap gap-1">
                          {esgMetrics.environmental.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Users className="h-5 w-5" />
                        Social
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{esgMetrics.social.score}</div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Jobs Created</span>
                          <span className="font-medium">{esgMetrics.social.jobsCreated.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Families Benefited</span>
                          <span className="font-medium">{esgMetrics.social.ruralFamiliesBenefited.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Health Improvements</span>
                          <span className="font-medium">{esgMetrics.social.healthImprovements}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Education Programs</span>
                          <span className="font-medium">{esgMetrics.social.educationPrograms}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Gender Equity</span>
                          <span className="font-medium">{esgMetrics.social.genderEquity}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Community Impact</span>
                          <span>{esgMetrics.social.communityImpact}%</span>
                        </div>
                        <Progress value={esgMetrics.social.communityImpact} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Governance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-700">
                        <Building className="h-5 w-5" />
                        Governance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{esgMetrics.governance.score}</div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Board Diversity</span>
                            <span>{esgMetrics.governance.boardDiversity}%</span>
                          </div>
                          <Progress value={esgMetrics.governance.boardDiversity} className="h-1" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Transparency Index</span>
                            <span>{esgMetrics.governance.transparencyIndex}%</span>
                          </div>
                          <Progress value={esgMetrics.governance.transparencyIndex} className="h-1" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Ethics Score</span>
                            <span>{esgMetrics.governance.ethicsScore}%</span>
                          </div>
                          <Progress value={esgMetrics.governance.ethicsScore} className="h-1" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Compliance Rating</span>
                            <span>{esgMetrics.governance.complianceRating}%</span>
                          </div>
                          <Progress value={esgMetrics.governance.complianceRating} className="h-1" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Data Quality</span>
                            <span>{esgMetrics.governance.dataQuality}%</span>
                          </div>
                          <Progress value={esgMetrics.governance.dataQuality} className="h-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* ESG Initiatives & Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  ESG Initiatives & Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      category: 'Environmental',
                      initiatives: [
                        { name: 'Carbon Neutrality by 2030', progress: 68, target: '100% by 2030', status: 'on-track' },
                        { name: 'Renewable Energy Adoption', progress: 85, target: '100% by 2026', status: 'ahead' },
                        { name: 'Waste Reduction Program', progress: 72, target: '50% reduction by 2025', status: 'on-track' },
                        { name: 'Water Conservation Initiative', progress: 58, target: '30% reduction by 2025', status: 'behind' }
                      ]
                    },
                    {
                      category: 'Social',
                      initiatives: [
                        { name: 'Rural Employment Generation', progress: 78, target: '2,000 jobs by 2025', status: 'on-track' },
                        { name: 'Women Empowerment Program', progress: 65, target: '40% female workforce', status: 'on-track' },
                        { name: 'Community Health Initiatives', progress: 82, target: '50 health centers', status: 'ahead' },
                        { name: 'Educational Scholarships', progress: 45, target: '1,000 scholarships', status: 'behind' }
                      ]
                    },
                    {
                      category: 'Governance',
                      initiatives: [
                        { name: 'Board Independence', progress: 75, target: '80% independence', status: 'on-track' },
                        { name: 'Transparency Reporting', progress: 90, target: 'Quarterly reports', status: 'ahead' },
                        { name: 'Ethics Training Program', progress: 88, target: '100% completion', status: 'on-track' },
                        { name: 'Stakeholder Engagement', progress: 70, target: 'Monthly sessions', status: 'on-track' }
                      ]
                    }
                  ].map((category) => (
                    <div key={category.category}>
                      <h4 className="font-medium text-gray-900 mb-3">{category.category} Initiatives</h4>
                      <div className="space-y-3">
                        {category.initiatives.map((initiative, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{initiative.name}</span>
                                <Badge
                                  variant="outline"
                                  className={
                                    initiative.status === 'ahead' ? 'bg-green-100 text-green-800' :
                                    initiative.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }
                                >
                                  {initiative.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">{initiative.target}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-24">
                                <Progress value={initiative.progress} className="h-2" />
                              </div>
                              <span className="text-sm font-medium w-12 text-right">{initiative.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Regulatory Compliance & Risk Assessment
              </CardTitle>
              <p className="text-gray-600">Comprehensive compliance tracking across all relevant frameworks</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Compliance Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {['compliant', 'partial', 'pending', 'non-compliant'].map(status => {
                    const frameworks = complianceFrameworks.filter(f => f.status === status);
                    return (
                      <div key={status} className={`text-center p-4 rounded-lg ${
                        status === 'compliant' ? 'bg-green-100' :
                        status === 'partial' ? 'bg-yellow-100' :
                        status === 'pending' ? 'bg-blue-100' :
                        'bg-red-100'
                      }`}>
                        <div className={`text-2xl font-bold ${
                          status === 'compliant' ? 'text-green-600' :
                          status === 'partial' ? 'text-yellow-600' :
                          status === 'pending' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {frameworks.length}
                        </div>
                        <div className={`text-sm ${
                          status === 'compliant' ? 'text-green-700' :
                          status === 'partial' ? 'text-yellow-700' :
                          status === 'pending' ? 'text-blue-700' :
                          'text-red-700'
                        }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Compliance Cards */}
                <div className="space-y-4">
                  {complianceFrameworks.map((framework) => (
                    <Card key={framework.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{framework.framework}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={getStatusColor(framework.status)}
                              >
                                {framework.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getStatusColor(framework.riskLevel)}
                              >
                                {framework.riskLevel} risk
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{framework.score}</div>
                            <div className="text-sm text-gray-600">Compliance Score</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Last Assessment:</span>
                            <div className="font-medium">{new Date(framework.lastAssessment).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Next Due:</span>
                            <div className="font-medium">{new Date(framework.nextDue).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-3">Requirements Status</div>
                          <div className="space-y-2">
                            {framework.requirements.map((req, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{req.requirement}</div>
                                  <div className="text-xs text-gray-600">{req.evidence}</div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={getStatusColor(req.status)}
                                >
                                  {req.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="text-sm">
                            <span className="text-gray-600">Overall Progress:</span>
                            <span className="font-medium ml-2">
                              {Math.round((framework.requirements.filter(r => r.status === 'met').length / framework.requirements.length) * 100)}%
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            View Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Analysis Tab */}
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Carbon Market Trends & Analysis
              </CardTitle>
              <p className="text-gray-600">Real-time market data and trend analysis for carbon credit pricing</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Market Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(marketTrends[marketTrends.length - 1]?.vcsPrice || 0)}
                    </div>
                    <div className="text-sm text-blue-700">VCS Price</div>
                    <div className="text-xs text-gray-600 mt-1">
                      +{((marketTrends[marketTrends.length - 1]?.vcsPrice - marketTrends[0]?.vcsPrice) / marketTrends[0]?.vcsPrice * 100).toFixed(1)}% YTD
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(marketTrends[marketTrends.length - 1]?.goldStandardPrice || 0)}
                    </div>
                    <div className="text-sm text-green-700">Gold Standard</div>
                    <div className="text-xs text-gray-600 mt-1">Premium Standard</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {((marketTrends[marketTrends.length - 1]?.volume || 0) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-purple-700">Monthly Volume</div>
                    <div className="text-xs text-gray-600 mt-1">Credits Traded</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {((marketTrends[marketTrends.length - 1]?.volatility || 0) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-orange-700">Volatility</div>
                    <div className="text-xs text-gray-600 mt-1">30-day average</div>
                  </div>
                </div>

                {/* Market Trend Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Price Trends by Credit Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['VCS', 'Gold Standard', 'CDM'].map(type => {
                          const currentPrice = type === 'VCS' ? marketTrends[marketTrends.length - 1]?.vcsPrice :
                                             type === 'Gold Standard' ? marketTrends[marketTrends.length - 1]?.goldStandardPrice :
                                             marketTrends[marketTrends.length - 1]?.cdmPrice;
                          const pastPrice = type === 'VCS' ? marketTrends[0]?.vcsPrice :
                                          type === 'Gold Standard' ? marketTrends[0]?.goldStandardPrice :
                                          marketTrends[0]?.cdmPrice;
                          const change = ((currentPrice - pastPrice) / pastPrice * 100);

                          return (
                            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded">
                                  {getCreditTypeIcon(type)}
                                </div>
                                <div>
                                  <div className="font-medium">{type}</div>
                                  <div className="text-sm text-gray-600">{formatCurrency(currentPrice)}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                  <span className="font-medium">{change >= 0 ? '+' : ''}{change.toFixed(1)}%</span>
                                </div>
                                <div className="text-xs text-gray-500">6-month change</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Market Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            opportunity: 'International Markets',
                            description: 'EU ETS pricing 35% higher than domestic',
                            potential: '₹8.5Cr additional revenue',
                            confidence: 78,
                            timeframe: '6-9 months'
                          },
                          {
                            opportunity: 'Article 6 Compliance',
                            description: 'Paris Agreement implementation creating premium',
                            potential: '₹12.2Cr market expansion',
                            confidence: 65,
                            timeframe: '12-18 months'
                          },
                          {
                            opportunity: 'Corporate ESG Demand',
                            description: 'Increased corporate carbon neutrality commitments',
                            potential: '₹15.8Cr demand growth',
                            confidence: 85,
                            timeframe: '3-6 months'
                          }
                        ].map((opp, index) => (
                          <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-green-800">{opp.opportunity}</div>
                                <div className="text-sm text-green-700 mt-1">{opp.description}</div>
                                <div className="text-sm text-gray-600 mt-2">
                                  <span className="font-medium">Timeframe:</span> {opp.timeframe}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="font-medium text-green-600">{opp.potential}</div>
                                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800">
                                  {opp.confidence}% confidence
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Price Forecasting */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Price Forecasting & Revenue Projections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {['Conservative', 'Baseline', 'Optimistic'].map((scenario, index) => {
                        const multiplier = index === 0 ? 1.1 : index === 1 ? 1.25 : 1.45;
                        const projectedPrice = marketTrends[marketTrends.length - 1]?.vcsPrice * multiplier;
                        const projectedRevenue = carbonCredits.reduce((sum, cc) => sum + (cc.creditsGenerated * projectedPrice), 0);

                        return (
                          <div key={scenario} className={`p-4 rounded-lg ${
                            scenario === 'Conservative' ? 'bg-yellow-50 border border-yellow-200' :
                            scenario === 'Baseline' ? 'bg-blue-50 border border-blue-200' :
                            'bg-green-50 border border-green-200'
                          }`}>
                            <div className="text-center">
                              <div className="font-medium text-gray-900">{scenario} Scenario</div>
                              <div className={`text-2xl font-bold mt-2 ${
                                scenario === 'Conservative' ? 'text-yellow-600' :
                                scenario === 'Baseline' ? 'text-blue-600' :
                                'text-green-600'
                              }`}>
                                {formatCurrency(projectedPrice)}
                              </div>
                              <div className="text-sm text-gray-600">Projected Price/Credit</div>
                              <div className="text-lg font-medium text-gray-900 mt-3">
                                {formatCurrency(projectedRevenue)}
                              </div>
                              <div className="text-sm text-gray-600">Total Revenue Potential</div>
                              <div className="text-xs text-gray-500 mt-2">
                                {(((projectedRevenue - carbonCredits.reduce((sum, cc) => sum + cc.revenue, 0)) / carbonCredits.reduce((sum, cc) => sum + cc.revenue, 0)) * 100).toFixed(1)}% increase
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projections Tab */}
        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Carbon Revenue & Impact Projections
              </CardTitle>
              <p className="text-gray-600">Long-term forecasting and strategic carbon planning</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Projection Controls */}
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Timeframe:</label>
                    <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12m">12 Months</SelectItem>
                        <SelectItem value="24m">24 Months</SelectItem>
                        <SelectItem value="36m">36 Months</SelectItem>
                        <SelectItem value="60m">60 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Growth Scenario:</label>
                    <Select defaultValue="baseline">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="baseline">Baseline</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProjections(!showProjections)}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Advanced Modeling
                  </Button>
                </div>

                {/* Revenue Projections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Growth Projections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { period: '2024 Q4', revenue: 78500000, growth: 15.2, confidence: 92 },
                          { period: '2025 Q1', revenue: 95200000, growth: 21.3, confidence: 87 },
                          { period: '2025 Q2', revenue: 118700000, growth: 24.7, confidence: 82 },
                          { period: '2025 Q3', revenue: 145800000, growth: 22.8, confidence: 78 },
                          { period: '2025 Q4', revenue: 175200000, growth: 25.1, confidence: 74 }
                        ].map((projection, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">{projection.period}</div>
                              <div className="text-sm text-gray-600">
                                +{projection.growth}% growth
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                {formatCurrency(projection.revenue)}
                              </div>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {projection.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Impact Projections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { metric: 'CO₂ Reduction', current: 2775, projected: 8500, unit: 'tons', growth: 206 },
                          { metric: 'Credits Generated', current: 555, projected: 1850, unit: 'credits', growth: 233 },
                          { metric: 'Projects Active', current: 4, projected: 15, unit: 'projects', growth: 275 },
                          { metric: 'Communities Impacted', current: 125, projected: 450, unit: 'communities', growth: 260 },
                          { metric: 'Jobs Created', current: 1250, projected: 4200, unit: 'jobs', growth: 236 }
                        ].map((impact, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{impact.metric}</span>
                              <span className="text-sm text-gray-600">
                                {impact.current.toLocaleString()} → {impact.projected.toLocaleString()} {impact.unit}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={75} className="h-2 flex-1" />
                              <span className="text-sm font-medium text-green-600">+{impact.growth}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Strategic Targets */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      2025-2027 Strategic Carbon Targets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {[
                        {
                          year: '2025',
                          targets: [
                            'Generate 1,500 carbon credits',
                            'Achieve ₹85Cr carbon revenue',
                            'Expand to 8 new regions',
                            'Launch carbon trading platform'
                          ],
                          investment: 180000000,
                          expectedRoi: 285
                        },
                        {
                          year: '2026',
                          targets: [
                            'Generate 2,500 carbon credits',
                            'Achieve ₹145Cr carbon revenue',
                            'International market entry',
                            'Carbon neutrality certification'
                          ],
                          investment: 320000000,
                          expectedRoi: 340
                        },
                        {
                          year: '2027',
                          targets: [
                            'Generate 4,000 carbon credits',
                            'Achieve ₹250Cr carbon revenue',
                            'Industry leadership position',
                            'Complete ESG integration'
                          ],
                          investment: 500000000,
                          expectedRoi: 420
                        }
                      ].map((target) => (
                        <Card key={target.year} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle className="text-lg">{target.year} Targets</CardTitle>
                            <Badge variant="outline" className="w-fit bg-blue-100 text-blue-800">
                              {target.expectedRoi}% ROI
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <div className="text-sm text-gray-600 mb-2">Strategic Goals</div>
                              <ul className="space-y-1">
                                {target.targets.map((goal, index) => (
                                  <li key={index} className="text-sm flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    {goal}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                              <div className="text-sm text-gray-600">Required Investment</div>
                              <div className="text-lg font-bold text-blue-600">
                                {formatCurrency(target.investment)}
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
      </Tabs>
    </div>
  );
};

export default CarbonAnalytics;