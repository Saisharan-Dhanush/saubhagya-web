import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Leaf,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Award,
  Shield,
  Globe,
  Factory,
  Recycle,
  TreePine,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Users,
  Building,
  Calendar,
  Download,
  Volume2,
  RefreshCw,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  TrendingFlat,
  MapPin,
  Layers,
  Database,
  Eye,
  Star,
  Info
} from 'lucide-react';

// Enhanced Interfaces for Comprehensive Carbon Analytics
interface CarbonCredit {
  id: string;
  type: 'VCS' | 'Gold Standard' | 'CDM' | 'CAR' | 'VER' | 'ACR';
  amount: number;
  price: number;
  marketPrice: number;
  date: string;
  project: string;
  location: string;
  status: 'Generated' | 'Verified' | 'Issued' | 'Sold' | 'Retired' | 'Pending';
  vintage: number;
  co2Reduction: number;
  methodology: string;
  additionalityScore: number;
  permanenceRating: number;
  leakageRisk: number;
  buyer?: string;
  certificationBody: string;
  monitoringData: Array<{
    date: string;
    co2Captured: number;
    efficiency: number;
  }>;
}

interface EnvironmentalImpact {
  metric: string;
  current: number;
  target: number;
  unit: string;
  trend: number;
  category: 'Carbon' | 'Water' | 'Biodiversity' | 'Waste' | 'Energy' | 'Air Quality' | 'Soil Health';
  methodology: string;
  confidence: number;
  verification: 'Third-party' | 'Self-reported' | 'Sensor-verified' | 'Blockchain-verified';
  impactLevel: 'Direct' | 'Indirect' | 'Induced';
  sdgAlignment: number[];
}

interface ESGMetric {
  category: 'Environmental' | 'Social' | 'Governance';
  score: number;
  maxScore: number;
  change: number;
  industryBenchmark: number;
  components: Array<{
    name: string;
    score: number;
    weight: number;
    benchmark: number;
    trend: number;
  }>;
  certifications: string[];
  ratingAgency: string;
  lastUpdated: string;
}

interface RegulatoryCompliance {
  regulation: string;
  jurisdiction: string;
  status: 'Compliant' | 'At Risk' | 'Non-Compliant' | 'Under Review';
  lastAudit: string;
  nextReview: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  complianceScore: number;
  actions: Array<{
    action: string;
    priority: 'High' | 'Medium' | 'Low';
    deadline: string;
    responsible: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }>;
  penalties?: number;
  auditTrail: Array<{
    date: string;
    auditor: string;
    finding: string;
    severity: string;
  }>;
}

interface MarketIntelligence {
  date: string;
  vcsPrice: number;
  goldStandardPrice: number;
  cdmPrice: number;
  carPrice: number;
  volume: number;
  volatility: number;
  marketCap: number;
  forecast: {
    short: number;
    medium: number;
    long: number;
    confidence: number;
  };
  drivers: string[];
  risks: string[];
  opportunities: string[];
}

interface SustainabilityGoal {
  goalId: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  deadline: string;
  impact: 'Direct' | 'Indirect' | 'Catalytic';
  projects: number;
  investment: number;
  roi: number;
  beneficiaries: number;
  kpis: Array<{
    indicator: string;
    current: number;
    target: number;
    unit: string;
  }>;
}

interface CarbonProject {
  id: string;
  name: string;
  type: 'Biogas' | 'Solar' | 'Wind' | 'Forestry' | 'Waste Management' | 'Energy Efficiency';
  location: string;
  startDate: string;
  status: 'Planning' | 'Implementation' | 'Operational' | 'Monitoring' | 'Completed';
  methodology: string;
  estimatedCredits: number;
  actualCredits: number;
  co2ReductionPotential: number;
  investment: number;
  paybackPeriod: number;
  riskAssessment: {
    technical: number;
    financial: number;
    regulatory: number;
    market: number;
    overall: number;
  };
  stakeholders: string[];
  communityImpact: number;
  jobsCreated: number;
}

// Advanced Mock Data Generation
const generateAdvancedCarbonCredits = (): CarbonCredit[] => [
  {
    id: 'VCS001',
    type: 'VCS',
    amount: 25000,
    price: 185000,
    marketPrice: 190000,
    date: '2024-09-01',
    project: 'SAUBHAGYA Biogas Maharashtra Cluster',
    location: 'Maharashtra, India',
    status: 'Verified',
    vintage: 2024,
    co2Reduction: 125000,
    methodology: 'ACM0006: Electricity and heat generation from biomass',
    additionalityScore: 94,
    permanenceRating: 89,
    leakageRisk: 5,
    buyer: 'Microsoft India Carbon Initiative',
    certificationBody: 'Verra',
    monitoringData: Array.from({ length: 12 }, (_, i) => ({
      date: `2024-${String(i + 1).padStart(2, '0')}-01`,
      co2Captured: 8500 + Math.random() * 2000,
      efficiency: 85 + Math.random() * 10
    }))
  },
  {
    id: 'GS002',
    type: 'Gold Standard',
    amount: 18000,
    price: 225000,
    marketPrice: 235000,
    date: '2024-09-05',
    project: 'Rural Energy Access Gujarat',
    location: 'Gujarat, India',
    status: 'Issued',
    vintage: 2024,
    co2Reduction: 90000,
    methodology: 'AMS-I.C: Thermal energy production with or without electricity',
    additionalityScore: 96,
    permanenceRating: 92,
    leakageRisk: 3,
    buyer: 'Tata Sustainability Fund',
    certificationBody: 'Gold Standard Foundation',
    monitoringData: Array.from({ length: 12 }, (_, i) => ({
      date: `2024-${String(i + 1).padStart(2, '0')}-01`,
      co2Captured: 6200 + Math.random() * 1500,
      efficiency: 88 + Math.random() * 8
    }))
  },
  {
    id: 'CDM003',
    type: 'CDM',
    amount: 12500,
    price: 165000,
    marketPrice: 172000,
    date: '2024-09-10',
    project: 'Integrated Waste Management Punjab',
    location: 'Punjab, India',
    status: 'Generated',
    vintage: 2024,
    co2Reduction: 62500,
    methodology: 'AMS-III.F: Avoidance of methane emissions through controlled biological treatment',
    additionalityScore: 91,
    permanenceRating: 85,
    leakageRisk: 8,
    certificationBody: 'UNFCCC',
    monitoringData: Array.from({ length: 12 }, (_, i) => ({
      date: `2024-${String(i + 1).padStart(2, '0')}-01`,
      co2Captured: 4200 + Math.random() * 1000,
      efficiency: 82 + Math.random() * 12
    }))
  },
  {
    id: 'CAR004',
    type: 'CAR',
    amount: 32000,
    price: 195000,
    marketPrice: 205000,
    date: '2024-09-15',
    project: 'SAUBHAGYA Carbon Sequestration Initiative',
    location: 'Rajasthan, India',
    status: 'Sold',
    vintage: 2024,
    co2Reduction: 160000,
    methodology: 'US Forest Projects: Improved Forest Management',
    additionalityScore: 93,
    permanenceRating: 88,
    leakageRisk: 6,
    buyer: 'Reliance Carbon Neutral Program',
    certificationBody: 'Climate Action Reserve',
    monitoringData: Array.from({ length: 12 }, (_, i) => ({
      date: `2024-${String(i + 1).padStart(2, '0')}-01`,
      co2Captured: 11000 + Math.random() * 3000,
      efficiency: 87 + Math.random() * 9
    }))
  }
];

const generateEnvironmentalImpacts = (): EnvironmentalImpact[] => [
  {
    metric: 'Total CO2 Equivalent Reduced',
    current: 437500,
    target: 500000,
    unit: 'tons CO2e',
    trend: 18.5,
    category: 'Carbon',
    methodology: 'GHG Protocol Corporate Standard',
    confidence: 96,
    verification: 'Third-party',
    impactLevel: 'Direct',
    sdgAlignment: [7, 13, 15]
  },
  {
    metric: 'Methane Emissions Prevented',
    current: 15200,
    target: 18000,
    unit: 'tons CH4',
    trend: 22.3,
    category: 'Carbon',
    methodology: 'IPCC 2019 Refinement Guidelines',
    confidence: 94,
    verification: 'Sensor-verified',
    impactLevel: 'Direct',
    sdgAlignment: [13, 14, 15]
  },
  {
    metric: 'Renewable Energy Generated',
    current: 125000,
    target: 150000,
    unit: 'MWh',
    trend: 15.8,
    category: 'Energy',
    methodology: 'IEA Renewable Energy Statistics',
    confidence: 98,
    verification: 'Blockchain-verified',
    impactLevel: 'Direct',
    sdgAlignment: [7, 9, 13]
  },
  {
    metric: 'Water Conservation Achieved',
    current: 2850000,
    target: 3200000,
    unit: 'liters',
    trend: 12.7,
    category: 'Water',
    methodology: 'Water Footprint Network Standard',
    confidence: 89,
    verification: 'Third-party',
    impactLevel: 'Indirect',
    sdgAlignment: [6, 12, 15]
  },
  {
    metric: 'Biodiversity Conservation Index',
    current: 78,
    target: 85,
    unit: 'index score',
    trend: 8.9,
    category: 'Biodiversity',
    methodology: 'CBD Aichi Biodiversity Targets',
    confidence: 87,
    verification: 'Third-party',
    impactLevel: 'Direct',
    sdgAlignment: [14, 15]
  },
  {
    metric: 'Waste Diverted from Landfills',
    current: 185000,
    target: 220000,
    unit: 'tons',
    trend: 25.4,
    category: 'Waste',
    methodology: 'Waste Management Hierarchy Protocol',
    confidence: 95,
    verification: 'Self-reported',
    impactLevel: 'Direct',
    sdgAlignment: [11, 12]
  },
  {
    metric: 'Air Quality Improvement',
    current: 68,
    target: 75,
    unit: 'AQI reduction',
    trend: 14.2,
    category: 'Air Quality',
    methodology: 'WHO Air Quality Guidelines',
    confidence: 91,
    verification: 'Sensor-verified',
    impactLevel: 'Indirect',
    sdgAlignment: [3, 11, 13]
  },
  {
    metric: 'Soil Health Enhancement',
    current: 72,
    target: 80,
    unit: 'soil health index',
    trend: 11.5,
    category: 'Soil Health',
    methodology: 'FAO Soil Health Assessment',
    confidence: 85,
    verification: 'Third-party',
    impactLevel: 'Direct',
    sdgAlignment: [2, 15]
  }
];

const generateESGMetrics = (): ESGMetric[] => [
  {
    category: 'Environmental',
    score: 94,
    maxScore: 100,
    change: 6.8,
    industryBenchmark: 78,
    components: [
      { name: 'Carbon Management', score: 96, weight: 0.35, benchmark: 82, trend: 8.2 },
      { name: 'Resource Efficiency', score: 92, weight: 0.25, benchmark: 75, trend: 6.5 },
      { name: 'Biodiversity Protection', score: 89, weight: 0.20, benchmark: 71, trend: 5.8 },
      { name: 'Pollution Prevention', score: 95, weight: 0.20, benchmark: 79, trend: 7.1 }
    ],
    certifications: ['B Corp Certified', 'ISO 14001', 'Carbon Trust Standard', 'Gold Standard'],
    ratingAgency: 'MSCI ESG Research',
    lastUpdated: '2024-09-01'
  },
  {
    category: 'Social',
    score: 89,
    maxScore: 100,
    change: 4.2,
    industryBenchmark: 74,
    components: [
      { name: 'Community Impact', score: 94, weight: 0.30, benchmark: 78, trend: 5.5 },
      { name: 'Employee Welfare', score: 87, weight: 0.25, benchmark: 72, trend: 3.8 },
      { name: 'Health & Safety', score: 91, weight: 0.25, benchmark: 75, trend: 4.2 },
      { name: 'Human Rights', score: 85, weight: 0.20, benchmark: 71, trend: 2.9 }
    ],
    certifications: ['Fair Trade Certified', 'SA8000', 'OHSAS 18001'],
    ratingAgency: 'Sustainalytics',
    lastUpdated: '2024-09-01'
  },
  {
    category: 'Governance',
    score: 91,
    maxScore: 100,
    change: 3.1,
    industryBenchmark: 81,
    components: [
      { name: 'Board Independence', score: 93, weight: 0.25, benchmark: 85, trend: 2.8 },
      { name: 'Transparency', score: 95, weight: 0.25, benchmark: 82, trend: 4.1 },
      { name: 'Risk Management', score: 88, weight: 0.25, benchmark: 79, trend: 2.5 },
      { name: 'Stakeholder Engagement', score: 89, weight: 0.25, benchmark: 77, trend: 3.2 }
    ],
    certifications: ['GRI Standards', 'SASB Standards', 'TCFD Supporter'],
    ratingAgency: 'ISS ESG',
    lastUpdated: '2024-09-01'
  }
];

const generateComplianceData = (): RegulatoryCompliance[] => [
  {
    regulation: 'EU Emissions Trading System (EU ETS)',
    jurisdiction: 'European Union',
    status: 'Compliant',
    lastAudit: '2024-08-15',
    nextReview: '2024-11-15',
    riskLevel: 'Low',
    complianceScore: 96,
    actions: [
      {
        action: 'Update MRV procedures for Phase 4',
        priority: 'Medium',
        deadline: '2024-10-31',
        responsible: 'Carbon Team Lead',
        status: 'In Progress'
      }
    ],
    auditTrail: [
      {
        date: '2024-08-15',
        auditor: 'Ernst & Young',
        finding: 'Full compliance with MRV regulations',
        severity: 'None'
      }
    ]
  },
  {
    regulation: 'India Carbon Credit Trading Scheme',
    jurisdiction: 'India',
    status: 'Compliant',
    lastAudit: '2024-07-20',
    nextReview: '2024-10-20',
    riskLevel: 'Low',
    complianceScore: 94,
    actions: [
      {
        action: 'Submit quarterly emissions report',
        priority: 'High',
        deadline: '2024-09-30',
        responsible: 'Compliance Officer',
        status: 'Pending'
      }
    ],
    auditTrail: [
      {
        date: '2024-07-20',
        auditor: 'KPMG India',
        finding: 'Minor documentation gaps',
        severity: 'Low'
      }
    ]
  },
  {
    regulation: 'UN Framework Convention on Climate Change',
    jurisdiction: 'Global',
    status: 'At Risk',
    lastAudit: '2024-06-10',
    nextReview: '2024-09-30',
    riskLevel: 'Medium',
    complianceScore: 78,
    actions: [
      {
        action: 'Enhance NDC alignment documentation',
        priority: 'High',
        deadline: '2024-09-25',
        responsible: 'Sustainability Director',
        status: 'In Progress'
      },
      {
        action: 'Update climate risk assessment',
        priority: 'Medium',
        deadline: '2024-10-15',
        responsible: 'Risk Management Team',
        status: 'Pending'
      }
    ],
    auditTrail: [
      {
        date: '2024-06-10',
        auditor: 'DNV GL',
        finding: 'Insufficient climate scenario analysis',
        severity: 'Medium'
      }
    ]
  },
  {
    regulation: 'Task Force on Climate-related Financial Disclosures (TCFD)',
    jurisdiction: 'Global',
    status: 'Compliant',
    lastAudit: '2024-05-25',
    nextReview: '2024-11-25',
    riskLevel: 'Low',
    complianceScore: 92,
    actions: [],
    auditTrail: [
      {
        date: '2024-05-25',
        auditor: 'PwC Sustainability',
        finding: 'Comprehensive TCFD disclosure framework',
        severity: 'None'
      }
    ]
  }
];

const generateMarketData = (): MarketIntelligence[] => {
  const baseDate = new Date('2024-01-01');
  return Array.from({ length: 270 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);

    const vcsBase = 175000;
    const gsBase = 220000;
    const cdmBase = 155000;
    const carBase = 185000;

    const seasonality = Math.sin((i / 365) * 2 * Math.PI) * 0.1;
    const trend = i * 50;
    const volatility = (Math.random() - 0.5) * 0.15;

    return {
      date: date.toISOString().split('T')[0],
      vcsPrice: Math.round(vcsBase + trend + (vcsBase * (seasonality + volatility))),
      goldStandardPrice: Math.round(gsBase + trend + (gsBase * (seasonality + volatility))),
      cdmPrice: Math.round(cdmBase + trend + (cdmBase * (seasonality + volatility))),
      carPrice: Math.round(carBase + trend + (carBase * (seasonality + volatility))),
      volume: Math.round(2500000 + (Math.random() * 1000000)),
      volatility: Math.abs(volatility),
      marketCap: Math.round(45000000000 + (i * 50000000) + (Math.random() * 5000000000)),
      forecast: {
        short: Math.round(vcsBase + trend + 10000 + (Math.random() * 5000)),
        medium: Math.round(vcsBase + trend + 25000 + (Math.random() * 10000)),
        long: Math.round(vcsBase + trend + 50000 + (Math.random() * 20000)),
        confidence: 85 + (Math.random() * 10)
      },
      drivers: ['Corporate ESG commitments', 'Regulatory compliance', 'Technology advancement'],
      risks: ['Policy uncertainty', 'Market volatility', 'Technology disruption'],
      opportunities: ['International expansion', 'Technology integration', 'Supply chain partnerships']
    };
  });
};

const generateSDGProgress = (): SustainabilityGoal[] => [
  {
    goalId: 7,
    title: 'Affordable and Clean Energy',
    description: 'Ensure access to affordable, reliable, sustainable and modern energy for all',
    progress: 87,
    target: 95,
    deadline: '2025-12-31',
    impact: 'Direct',
    projects: 15,
    investment: 2500000000,
    roi: 285,
    beneficiaries: 125000,
    kpis: [
      { indicator: 'Renewable energy capacity', current: 125, target: 150, unit: 'MW' },
      { indicator: 'Rural energy access', current: 87, target: 95, unit: '% population' },
      { indicator: 'Energy efficiency improvement', current: 22, target: 30, unit: '% reduction' }
    ]
  },
  {
    goalId: 13,
    title: 'Climate Action',
    description: 'Take urgent action to combat climate change and its impacts',
    progress: 92,
    target: 98,
    deadline: '2025-12-31',
    impact: 'Direct',
    projects: 12,
    investment: 1800000000,
    roi: 340,
    beneficiaries: 250000,
    kpis: [
      { indicator: 'GHG emissions reduction', current: 437500, target: 500000, unit: 'tons CO2e' },
      { indicator: 'Carbon credits generated', current: 87500, target: 100000, unit: 'credits' },
      { indicator: 'Climate adaptation measures', current: 8, target: 12, unit: 'initiatives' }
    ]
  },
  {
    goalId: 15,
    title: 'Life on Land',
    description: 'Protect, restore and promote sustainable use of terrestrial ecosystems',
    progress: 76,
    target: 85,
    deadline: '2026-12-31',
    impact: 'Direct',
    projects: 8,
    investment: 950000000,
    roi: 195,
    beneficiaries: 85000,
    kpis: [
      { indicator: 'Land restoration', current: 1250, target: 1600, unit: 'hectares' },
      { indicator: 'Biodiversity conservation', current: 78, target: 85, unit: 'index score' },
      { indicator: 'Sustainable land management', current: 92, target: 100, unit: '% of land' }
    ]
  },
  {
    goalId: 6,
    title: 'Clean Water and Sanitation',
    description: 'Ensure availability and sustainable management of water and sanitation for all',
    progress: 84,
    target: 90,
    deadline: '2025-12-31',
    impact: 'Indirect',
    projects: 6,
    investment: 650000000,
    roi: 158,
    beneficiaries: 95000,
    kpis: [
      { indicator: 'Water conservation', current: 2850000, target: 3200000, unit: 'liters/year' },
      { indicator: 'Water quality improvement', current: 84, target: 90, unit: '% compliance' },
      { indicator: 'Wastewater treatment', current: 78, target: 85, unit: '% treated' }
    ]
  },
  {
    goalId: 11,
    title: 'Sustainable Cities and Communities',
    description: 'Make cities and human settlements inclusive, safe, resilient and sustainable',
    progress: 72,
    target: 80,
    deadline: '2026-12-31',
    impact: 'Indirect',
    projects: 4,
    investment: 1200000000,
    roi: 225,
    beneficiaries: 180000,
    kpis: [
      { indicator: 'Waste reduction', current: 185000, target: 220000, unit: 'tons/year' },
      { indicator: 'Air quality improvement', current: 68, target: 75, unit: 'AQI reduction' },
      { indicator: 'Sustainable transport', current: 45, target: 60, unit: '% adoption' }
    ]
  },
  {
    goalId: 12,
    title: 'Responsible Consumption and Production',
    description: 'Ensure sustainable consumption and production patterns',
    progress: 89,
    target: 95,
    deadline: '2025-12-31',
    impact: 'Direct',
    projects: 10,
    investment: 850000000,
    roi: 275,
    beneficiaries: 150000,
    kpis: [
      { indicator: 'Circular economy adoption', current: 89, target: 95, unit: '% practices' },
      { indicator: 'Resource efficiency', current: 25, target: 35, unit: '% improvement' },
      { indicator: 'Sustainable supply chain', current: 92, target: 98, unit: '% suppliers' }
    ]
  }
];

const generateCarbonProjects = (): CarbonProject[] => [
  {
    id: 'PROJ001',
    name: 'Maharashtra Biogas Cluster Expansion',
    type: 'Biogas',
    location: 'Maharashtra, India',
    startDate: '2024-01-15',
    status: 'Operational',
    methodology: 'ACM0006: Electricity and heat generation from biomass',
    estimatedCredits: 35000,
    actualCredits: 25000,
    co2ReductionPotential: 175000,
    investment: 850000000,
    paybackPeriod: 6.5,
    riskAssessment: {
      technical: 85,
      financial: 78,
      regulatory: 92,
      market: 74,
      overall: 82
    },
    stakeholders: ['Local Farmers Cooperative', 'State Government', 'Technology Partner'],
    communityImpact: 88,
    jobsCreated: 450
  },
  {
    id: 'PROJ002',
    name: 'Solar-Biogas Hybrid Punjab',
    type: 'Solar',
    location: 'Punjab, India',
    startDate: '2024-03-01',
    status: 'Implementation',
    methodology: 'AMS-I.D: Grid connected renewable electricity generation',
    estimatedCredits: 28000,
    actualCredits: 0,
    co2ReductionPotential: 140000,
    investment: 1200000000,
    paybackPeriod: 7.2,
    riskAssessment: {
      technical: 90,
      financial: 82,
      regulatory: 88,
      market: 79,
      overall: 85
    },
    stakeholders: ['Solar Equipment Manufacturer', 'Local Community', 'Financial Institution'],
    communityImpact: 76,
    jobsCreated: 320
  },
  {
    id: 'PROJ003',
    name: 'Integrated Waste-to-Energy Gujarat',
    type: 'Waste Management',
    location: 'Gujarat, India',
    startDate: '2024-02-20',
    status: 'Monitoring',
    methodology: 'AMS-III.F: Avoidance of methane emissions through controlled biological treatment',
    estimatedCredits: 22000,
    actualCredits: 18000,
    co2ReductionPotential: 110000,
    investment: 650000000,
    paybackPeriod: 5.8,
    riskAssessment: {
      technical: 88,
      financial: 85,
      regulatory: 90,
      market: 76,
      overall: 85
    },
    stakeholders: ['Municipal Corporation', 'Waste Management Company', 'Local NGO'],
    communityImpact: 92,
    jobsCreated: 280
  }
];

// Enhanced Carbon Analytics Component
const EnhancedCarbonAnalytics: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6M');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  // Generate mock data
  const carbonCredits = useMemo(() => generateAdvancedCarbonCredits(), []);
  const environmentalImpacts = useMemo(() => generateEnvironmentalImpacts(), []);
  const esgMetrics = useMemo(() => generateESGMetrics(), []);
  const complianceData = useMemo(() => generateComplianceData(), []);
  const marketData = useMemo(() => generateMarketData(), []);
  const sdgProgress = useMemo(() => generateSDGProgress(), []);
  const carbonProjects = useMemo(() => generateCarbonProjects(), []);

  // Calculations
  const totalCreditsGenerated = carbonCredits.reduce((sum, credit) => sum + credit.amount, 0);
  const totalRevenue = carbonCredits.reduce((sum, credit) => sum + (credit.amount * credit.price), 0);
  const totalCO2Reduced = carbonCredits.reduce((sum, credit) => sum + credit.co2Reduction, 0);
  const averagePrice = totalRevenue / totalCreditsGenerated;
  const overallESGScore = esgMetrics.reduce((sum, metric) => sum + metric.score, 0) / esgMetrics.length;

  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];
  const statusColors = {
    'Compliant': '#10b981',
    'At Risk': '#f59e0b',
    'Non-Compliant': '#ef4444',
    'Under Review': '#6b7280'
  };

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
      case 'Compliant':
      case 'Verified':
      case 'Issued':
      case 'Sold':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'At Risk':
      case 'Pending':
      case 'Generated':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Non-Compliant':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < -5) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <TrendingFlat className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Real-time Indicators */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Enhanced Carbon Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive carbon credit revenue tracking, environmental impact measurement, and ESG compliance
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Real-time monitoring active</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Star className="h-3 w-3 mr-1" />
              ESG Rating: A+
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Shield className="h-3 w-3 mr-1" />
              Carbon Neutral Certified
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}>
            <Eye className="h-4 w-4 mr-2" />
            {showAdvancedMetrics ? 'Hide Advanced' : 'Show Advanced'}
          </Button>
          {['1M', '3M', '6M', '1Y', '2Y'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Key Metrics with Industry Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full flex items-end justify-start p-2">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbon Credits Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalCreditsGenerated / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              {totalCO2Reduced.toLocaleString()} tons CO2e reduced
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+18.5% vs benchmark</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full flex items-end justify-start p-2">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbon Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg {formatCurrency(averagePrice)}/credit
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+22.3% YoY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-bl-full flex items-end justify-start p-2">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ESG Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallESGScore.toFixed(1)}/100</div>
            <p className="text-xs text-muted-foreground">
              Industry ranking: Top 3%
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+4.7% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100 rounded-bl-full flex items-end justify-start p-2">
            <Globe className="h-6 w-6 text-orange-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(marketData[marketData.length - 1]?.vcsPrice || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              VCS current price
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+15.2% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full flex items-end justify-start p-2">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((complianceData.filter(c => c.status === 'Compliant').length / complianceData.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {complianceData.filter(c => c.status === 'Compliant').length}/{complianceData.length} frameworks
            </p>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">Fully compliant</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credits">Carbon Credits</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Impact</TabsTrigger>
          <TabsTrigger value="esg">ESG Metrics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        {/* Enhanced Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Real-time Carbon Credit Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Real-time Carbon Credit Generation</span>
                </CardTitle>
                <CardDescription>Live monitoring of carbon credit production and verification</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={marketData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number, name: string) => [
                        name.includes('Price') ? formatCurrency(value) : value.toLocaleString(),
                        name
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="volume" fill="#10b981" opacity={0.6} name="Credits Generated" />
                    <Line yAxisId="right" type="monotone" dataKey="vcsPrice" stroke="#3b82f6" strokeWidth={2} name="VCS Price" />
                    <Line yAxisId="right" type="monotone" dataKey="goldStandardPrice" stroke="#f59e0b" strokeWidth={2} name="Gold Standard Price" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Environmental Impact Overview</span>
                </CardTitle>
                <CardDescription>Key environmental metrics and sustainability targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {environmentalImpacts.slice(0, 5).map((impact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors[index] }} />
                        <div>
                          <div className="font-medium text-sm">{impact.metric}</div>
                          <div className="text-xs text-muted-foreground flex items-center space-x-1">
                            {getTrendIcon(impact.trend)}
                            <span>{impact.trend >= 0 ? '+' : ''}{impact.trend.toFixed(1)}% vs target</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{impact.current.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{impact.unit}</div>
                        <Badge variant={impact.current >= impact.target * 0.9 ? 'default' : 'secondary'} className="text-xs">
                          {((impact.current / impact.target) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SDG Impact Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>UN Sustainable Development Goals Impact</span>
              </CardTitle>
              <CardDescription>SAUBHAGYA's contribution to global sustainability targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sdgProgress.map((sdg, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {sdg.goalId}
                        </div>
                        <Badge variant={sdg.impact === 'Direct' ? 'default' : 'secondary'}>
                          {sdg.impact}
                        </Badge>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{sdg.projects} projects</div>
                        <div className="text-muted-foreground">ROI: {sdg.roi}%</div>
                      </div>
                    </div>

                    <h4 className="font-medium mb-2">{sdg.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{sdg.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{sdg.progress}% / {sdg.target}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(sdg.progress / sdg.target) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Investment: {formatCurrency(sdg.investment)} • Beneficiaries: {sdg.beneficiaries.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Carbon Project Portfolio Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Carbon Project Portfolio Status</span>
              </CardTitle>
              <CardDescription>Real-time status of active carbon credit generation projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {carbonProjects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{project.type}</Badge>
                          <Badge variant={project.status === 'Operational' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{project.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          {project.actualCredits > 0 ? project.actualCredits.toLocaleString() : project.estimatedCredits.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Carbon Credits</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Investment</div>
                        <div className="font-medium">{formatCurrency(project.investment)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Payback Period</div>
                        <div className="font-medium">{project.paybackPeriod} years</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Jobs Created</div>
                        <div className="font-medium">{project.jobsCreated.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Community Impact</div>
                        <div className="font-medium">{project.communityImpact}%</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Overall Risk Score</span>
                        <span>{project.riskAssessment.overall}/100</span>
                      </div>
                      <Progress value={project.riskAssessment.overall} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Carbon Credits Tab */}
        <TabsContent value="credits" className="space-y-6">
          {/* Credit Type Performance Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Credit Type Distribution</span>
                </CardTitle>
                <CardDescription>Portfolio breakdown by certification standard</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        carbonCredits.reduce((acc, credit) => {
                          acc[credit.type] = (acc[credit.type] || 0) + credit.amount;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([type, amount]) => ({ name: type, value: amount }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {carbonCredits.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Credits']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Quality Metrics</span>
                </CardTitle>
                <CardDescription>Additionality and verification scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carbonCredits.map((credit, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{credit.type}</span>
                        <Badge variant="outline">{credit.additionalityScore}%</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Additionality</span>
                          <span>{credit.additionalityScore}%</span>
                        </div>
                        <Progress value={credit.additionalityScore} className="h-1" />
                        <div className="flex justify-between text-xs">
                          <span>Permanence</span>
                          <span>{credit.permanenceRating}%</span>
                        </div>
                        <Progress value={credit.permanenceRating} className="h-1" />
                        <div className="flex justify-between text-xs">
                          <span>Leakage Risk</span>
                          <span className="text-red-600">{credit.leakageRisk}%</span>
                        </div>
                        <Progress value={100 - credit.leakageRisk} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Revenue Analysis</span>
                </CardTitle>
                <CardDescription>Financial performance by credit type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carbonCredits.map((credit, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{credit.type}</span>
                        <Badge variant={credit.status === 'Sold' ? 'default' : 'secondary'}>
                          {credit.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-muted-foreground">Market Price</div>
                          <div className="font-medium">{formatCurrency(credit.marketPrice)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Our Price</div>
                          <div className="font-medium">{formatCurrency(credit.price)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Premium</div>
                          <div className={`font-medium ${credit.price > credit.marketPrice ? 'text-green-600' : 'text-red-600'}`}>
                            {(((credit.price - credit.marketPrice) / credit.marketPrice) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Revenue</div>
                          <div className="font-medium">{formatCurrency(credit.amount * credit.price)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Credit Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Detailed Credit Portfolio</span>
              </CardTitle>
              <CardDescription>Comprehensive view of all carbon credit assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {carbonCredits.map((credit, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{credit.project}</CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{credit.type}</Badge>
                            <Badge variant={credit.status === 'Sold' ? 'default' : 'secondary'}>
                              {getStatusIcon(credit.status)}
                              <span className="ml-1">{credit.status}</span>
                            </Badge>
                            <Badge variant="outline">Vintage {credit.vintage}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{credit.amount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Credits</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{formatCurrency(credit.price)}</div>
                          <div className="text-xs text-blue-700">Price per Credit</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(credit.amount * credit.price)}</div>
                          <div className="text-xs text-green-700">Total Revenue</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">{credit.co2Reduction.toLocaleString()}</div>
                          <div className="text-xs text-purple-700">CO2 Reduced (tons)</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">{credit.additionalityScore}%</div>
                          <div className="text-xs text-orange-700">Additionality Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <div className="font-medium flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {credit.location}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Methodology:</span>
                          <div className="font-medium">{credit.methodology}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Certification:</span>
                          <div className="font-medium">{credit.certificationBody}</div>
                        </div>
                      </div>

                      {credit.buyer && (
                        <div className="mt-3 p-2 bg-green-50 rounded">
                          <span className="text-sm text-green-700">Buyer: {credit.buyer}</span>
                        </div>
                      )}

                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Monthly CO2 Capture Trend</div>
                        <ResponsiveContainer width="100%" height={150}>
                          <LineChart data={credit.monitoringData.slice(-6)}>
                            <XAxis
                              dataKey="date"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                            />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number) => [value.toFixed(0), 'CO2 Captured (tons)']}
                            />
                            <Line type="monotone" dataKey="co2Captured" stroke="#10b981" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Environmental Impact Tab */}
        <TabsContent value="environmental" className="space-y-6">
          {/* Environmental Metrics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5" />
                  <span>Environmental Performance Matrix</span>
                </CardTitle>
                <CardDescription>Comprehensive environmental impact assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={
                    environmentalImpacts.map((impact, index) => ({
                      name: impact.metric.split(' ').slice(0, 2).join(' '),
                      value: (impact.current / impact.target) * 100,
                      fill: colors[index % colors.length],
                      confidence: impact.confidence
                    }))
                  }>
                    <RadialBar
                      minAngle={15}
                      label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
                      background
                      clockWise
                      dataKey="value"
                    />
                    <Legend
                      iconSize={8}
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value.toFixed(1)}%`,
                        `Target Achievement (Confidence: ${props.payload?.confidence}%)`
                      ]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Impact Category Performance</span>
                </CardTitle>
                <CardDescription>Environmental performance by impact category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(
                    environmentalImpacts.reduce((acc, impact) => {
                      if (!acc[impact.category]) acc[impact.category] = [];
                      acc[impact.category].push(impact);
                      return acc;
                    }, {} as Record<string, typeof environmentalImpacts>)
                  ).map(([category, impacts], categoryIndex) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        {category === 'Carbon' && <Leaf className="h-4 w-4 text-green-600" />}
                        {category === 'Water' && <Droplets className="h-4 w-4 text-blue-600" />}
                        {category === 'Energy' && <Zap className="h-4 w-4 text-yellow-600" />}
                        {category === 'Biodiversity' && <TreePine className="h-4 w-4 text-green-800" />}
                        {category === 'Waste' && <Recycle className="h-4 w-4 text-purple-600" />}
                        {category === 'Air Quality' && <Wind className="h-4 w-4 text-gray-600" />}
                        {category === 'Soil Health' && <Factory className="h-4 w-4 text-brown-600" />}
                        <h4 className="font-medium">{category}</h4>
                      </div>
                      <div className="space-y-2">
                        {impacts.map((impact, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">{impact.metric}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {impact.verification}
                                </Badge>
                                <Badge variant={impact.confidence >= 90 ? 'default' : 'secondary'} className="text-xs">
                                  {impact.confidence}% confidence
                                </Badge>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm">{impact.current.toLocaleString()} {impact.unit}</span>
                              <div className="flex items-center space-x-1">
                                {getTrendIcon(impact.trend)}
                                <span className={`text-xs ${impact.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {impact.trend >= 0 ? '+' : ''}{impact.trend.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress to Target</span>
                                <span>{((impact.current / impact.target) * 100).toFixed(1)}%</span>
                              </div>
                              <Progress value={(impact.current / impact.target) * 100} className="h-2" />
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">SDG Alignment:</span>
                              <div className="flex space-x-1">
                                {impact.sdgAlignment.map((sdg) => (
                                  <Badge key={sdg} variant="outline" className="text-xs px-1 py-0">
                                    SDG {sdg}
                                  </Badge>
                                ))}
                              </div>
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

          {/* Environmental Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Environmental Impact Trends</span>
              </CardTitle>
              <CardDescription>Historical performance and future projections</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={marketData.slice(-24)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(),
                      name
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="volume" fill="#10b981" opacity={0.6} name="CO2 Reduction (tons)" />
                  <Line yAxisId="right" type="monotone" dataKey="volatility" stroke="#ef4444" strokeWidth={2} name="Environmental Risk Index" />
                  <Area yAxisId="left" type="monotone" dataKey="marketCap" fill="#3b82f6" opacity={0.1} name="Cumulative Impact" />
                  <ReferenceLine yAxisId="left" y={500000} stroke="#f59e0b" strokeDasharray="5 5" label="Target" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced ESG Metrics Tab */}
        <TabsContent value="esg" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {esgMetrics.map((esg, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {esg.category === 'Environmental' && <Leaf className="h-5 w-5 text-green-600" />}
                      {esg.category === 'Social' && <Users className="h-5 w-5 text-blue-600" />}
                      {esg.category === 'Governance' && <Building className="h-5 w-5 text-purple-600" />}
                      <span>{esg.category}</span>
                    </div>
                    <Badge variant="outline">
                      {esg.ratingAgency}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Industry benchmark: {esg.industryBenchmark} • {esg.change >= 0 ? '+' : ''}{esg.change.toFixed(1)}% YoY
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{esg.score}</div>
                      <div className="text-sm text-muted-foreground">out of {esg.maxScore}</div>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        {getTrendIcon(esg.change)}
                        <span className={`text-sm ${esg.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          vs industry: +{(esg.score - esg.industryBenchmark).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {esg.components.map((component, componentIndex) => (
                        <div key={componentIndex} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{component.name}</span>
                            <div className="flex items-center space-x-2">
                              <span>{component.score}</span>
                              <Badge variant={component.score > component.benchmark ? 'default' : 'secondary'} className="text-xs">
                                vs {component.benchmark}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Progress value={component.score} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Weight: {(component.weight * 100).toFixed(0)}%</span>
                              <span className={component.trend >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {component.trend >= 0 ? '+' : ''}{component.trend.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t">
                      <div className="text-sm font-medium mb-2">Certifications</div>
                      <div className="flex flex-wrap gap-1">
                        {esg.certifications.map((cert, certIndex) => (
                          <Badge key={certIndex} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ESG Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>ESG Performance Trends</span>
              </CardTitle>
              <CardDescription>Historical ESG scores and industry comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={marketData.slice(-18).map((data, index) => ({
                  date: data.date,
                  Environmental: Math.min(100, 88 + (index * 0.3) + Math.sin(index * 0.5) * 2),
                  Social: Math.min(100, 82 + (index * 0.2) + Math.cos(index * 0.3) * 1.5),
                  Governance: Math.min(100, 85 + (index * 0.25) + Math.sin(index * 0.4) * 1.8),
                  'Industry Average': 75 + (index * 0.1)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  />
                  <YAxis domain={[70, 100]} />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [value.toFixed(1), name]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Environmental" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Social" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Governance" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Industry Average" stroke="#9ca3af" strokeWidth={1} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Overview Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {['Compliant', 'At Risk', 'Non-Compliant', 'Under Review'].map((status, index) => {
              const count = complianceData.filter(c => c.status === status).length;
              const percentage = (count / complianceData.length) * 100;
              return (
                <Card key={status}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{status}</p>
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% of frameworks</p>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        status === 'Compliant' ? 'bg-green-100' :
                        status === 'At Risk' ? 'bg-yellow-100' :
                        status === 'Non-Compliant' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        {getStatusIcon(status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Compliance Framework Analysis */}
          <div className="space-y-4">
            {complianceData.map((framework, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{framework.regulation}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          variant="outline"
                          style={{ backgroundColor: statusColors[framework.status], color: 'white' }}
                        >
                          {getStatusIcon(framework.status)}
                          <span className="ml-1">{framework.status}</span>
                        </Badge>
                        <Badge variant="outline">{framework.jurisdiction}</Badge>
                        <Badge variant={framework.riskLevel === 'Low' ? 'default' :
                                       framework.riskLevel === 'Medium' ? 'secondary' : 'destructive'}>
                          {framework.riskLevel} Risk
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{framework.complianceScore}</div>
                      <div className="text-sm text-muted-foreground">Compliance Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Audit Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Audit:</span>
                          <span>{new Date(framework.lastAudit).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next Review:</span>
                          <span>{new Date(framework.nextReview).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Days Until Review:</span>
                          <span className={`font-medium ${
                            Math.ceil((new Date(framework.nextReview).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 30
                              ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {Math.ceil((new Date(framework.nextReview).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                      </div>

                      {framework.auditTrail.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Recent Audit Findings</h5>
                          <div className="space-y-2">
                            {framework.auditTrail.map((audit, auditIndex) => (
                              <div key={auditIndex} className="p-2 bg-gray-50 rounded text-sm">
                                <div className="font-medium">{audit.auditor}</div>
                                <div className="text-muted-foreground">{audit.finding}</div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(audit.date).toLocaleDateString()}
                                  </span>
                                  <Badge variant={audit.severity === 'None' ? 'default' : 'secondary'} className="text-xs">
                                    {audit.severity}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Action Items</h4>
                      {framework.actions.length > 0 ? (
                        <div className="space-y-2">
                          {framework.actions.map((action, actionIndex) => (
                            <div key={actionIndex} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-sm">{action.action}</span>
                                <Badge variant={
                                  action.priority === 'High' ? 'destructive' :
                                  action.priority === 'Medium' ? 'secondary' : 'default'
                                }>
                                  {action.priority}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Deadline:</span>
                                  <div className="font-medium">{new Date(action.deadline).toLocaleDateString()}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Responsible:</span>
                                  <div className="font-medium">{action.responsible}</div>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Badge variant={action.status === 'Completed' ? 'default' : 'secondary'} className="text-xs">
                                  {action.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">No pending actions</div>
                      )}

                      {framework.penalties && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-sm font-medium text-red-800">Penalties Incurred</div>
                          <div className="text-lg font-bold text-red-600">{formatCurrency(framework.penalties)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Compliance Progress</span>
                      <span className="text-sm">{framework.complianceScore}/100</span>
                    </div>
                    <Progress value={framework.complianceScore} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enhanced Market Intelligence Tab */}
        <TabsContent value="market" className="space-y-6">
          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">VCS Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(marketData[marketData.length - 1]?.vcsPrice || 0)}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  +{(((marketData[marketData.length - 1]?.vcsPrice || 0) - (marketData[marketData.length - 30]?.vcsPrice || 0)) / (marketData[marketData.length - 30]?.vcsPrice || 1) * 100).toFixed(1)}% (30d)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Gold Standard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(marketData[marketData.length - 1]?.goldStandardPrice || 0)}</div>
                <p className="text-xs text-muted-foreground">Premium tier pricing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Market Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((marketData[marketData.length - 1]?.volume || 0) / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">Credits traded monthly</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Volatility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((marketData[marketData.length - 1]?.volatility || 0) * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">30-day average</p>
              </CardContent>
            </Card>
          </div>

          {/* Market Price Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Carbon Credit Price Trends</span>
              </CardTitle>
              <CardDescription>Historical pricing and market dynamics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={marketData.slice(-90)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      name.includes('Price') ? formatCurrency(value) : value.toLocaleString(),
                      name
                    ]}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="vcsPrice" stroke="#10b981" strokeWidth={2} name="VCS Price" />
                  <Line yAxisId="left" type="monotone" dataKey="goldStandardPrice" stroke="#f59e0b" strokeWidth={2} name="Gold Standard Price" />
                  <Line yAxisId="left" type="monotone" dataKey="cdmPrice" stroke="#3b82f6" strokeWidth={2} name="CDM Price" />
                  <Bar yAxisId="right" dataKey="volume" fill="#8b5cf6" opacity={0.3} name="Trading Volume" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Market Intelligence and Forecasting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Price Forecasting</span>
                </CardTitle>
                <CardDescription>AI-powered market predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Short-term (30 days)', 'Medium-term (90 days)', 'Long-term (1 year)'].map((term, index) => {
                    const forecast = marketData[marketData.length - 1]?.forecast;
                    const prices = [forecast?.short, forecast?.medium, forecast?.long];
                    const confidence = forecast?.confidence || 85;

                    return (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{term}</span>
                          <Badge variant="outline">
                            {confidence.toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(prices[index] || 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(((prices[index] || 0) - (marketData[marketData.length - 1]?.vcsPrice || 0)) / (marketData[marketData.length - 1]?.vcsPrice || 1) * 100).toFixed(1)}% change expected
                        </div>
                        <Progress value={confidence} className="mt-2 h-1" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Market Opportunities</span>
                </CardTitle>
                <CardDescription>Strategic market insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Article 6 Implementation',
                      description: 'Paris Agreement Article 6 creating premium demand',
                      impact: '₹25.5Cr potential revenue',
                      confidence: 78,
                      timeframe: '6-12 months',
                      type: 'opportunity'
                    },
                    {
                      title: 'Corporate ESG Mandates',
                      description: 'Increased corporate sustainability reporting requirements',
                      impact: '₹18.2Cr market expansion',
                      confidence: 85,
                      timeframe: '3-6 months',
                      type: 'opportunity'
                    },
                    {
                      title: 'Technology Integration',
                      description: 'Blockchain and IoT integration premium',
                      impact: '₹12.8Cr value addition',
                      confidence: 72,
                      timeframe: '9-15 months',
                      type: 'opportunity'
                    },
                    {
                      title: 'Regulatory Uncertainty',
                      description: 'Potential changes in carbon pricing mechanisms',
                      impact: '15-25% price volatility',
                      confidence: 68,
                      timeframe: '12-18 months',
                      type: 'risk'
                    }
                  ].map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      item.type === 'opportunity' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-medium ${
                          item.type === 'opportunity' ? 'text-green-800' : 'text-yellow-800'
                        }`}>
                          {item.title}
                        </h4>
                        <Badge variant="outline" className={
                          item.type === 'opportunity' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }>
                          {item.confidence}% confidence
                        </Badge>
                      </div>
                      <p className={`text-sm mb-2 ${
                        item.type === 'opportunity' ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className={`font-medium ${
                          item.type === 'opportunity' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {item.impact}
                        </span>
                        <span className="text-muted-foreground">
                          {item.timeframe}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enhanced Projections Tab */}
        <TabsContent value="projections" className="space-y-6">
          {/* Revenue and Impact Projections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Revenue Projections</span>
                </CardTitle>
                <CardDescription>Financial forecasting by scenario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { scenario: 'Conservative', multiplier: 1.2, confidence: 95, color: 'yellow' },
                    { scenario: 'Baseline', multiplier: 1.5, confidence: 85, color: 'blue' },
                    { scenario: 'Optimistic', multiplier: 2.0, confidence: 70, color: 'green' }
                  ].map((proj, index) => {
                    const projectedRevenue = totalRevenue * proj.multiplier;
                    const currentPrice = marketData[marketData.length - 1]?.vcsPrice || 0;
                    const projectedPrice = currentPrice * proj.multiplier;

                    return (
                      <div key={index} className={`p-4 rounded-lg bg-${proj.color}-50 border border-${proj.color}-200`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className={`font-medium text-${proj.color}-800`}>{proj.scenario} Scenario</h4>
                          <Badge variant="outline" className={`bg-${proj.color}-100 text-${proj.color}-800`}>
                            {proj.confidence}% confidence
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Projected Revenue</div>
                            <div className={`text-xl font-bold text-${proj.color}-600`}>
                              {formatCurrency(projectedRevenue)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Avg Price/Credit</div>
                            <div className={`text-xl font-bold text-${proj.color}-600`}>
                              {formatCurrency(projectedPrice)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Growth: {(((projectedRevenue - totalRevenue) / totalRevenue) * 100).toFixed(1)}% increase
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Impact Projections</span>
                </CardTitle>
                <CardDescription>Environmental and social impact forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'CO2 Reduction', current: totalCO2Reduced, projected: totalCO2Reduced * 2.5, unit: 'tons CO2e' },
                    { metric: 'Credits Generated', current: totalCreditsGenerated, projected: totalCreditsGenerated * 2.2, unit: 'credits' },
                    { metric: 'Projects Active', current: carbonProjects.length, projected: carbonProjects.length * 4, unit: 'projects' },
                    { metric: 'Communities Impacted', current: 125, projected: 450, unit: 'communities' },
                    { metric: 'Jobs Created', current: 1250, projected: 4200, unit: 'jobs' }
                  ].map((impact, index) => {
                    const growth = (((impact.projected - impact.current) / impact.current) * 100);
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{impact.metric}</span>
                          <span className="text-sm text-muted-foreground">
                            {impact.current.toLocaleString()} → {impact.projected.toLocaleString()} {impact.unit}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={75} className="h-2 flex-1" />
                          <span className="text-sm font-medium text-green-600">+{growth.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategic Planning Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>2025-2027 Strategic Carbon Roadmap</span>
              </CardTitle>
              <CardDescription>Long-term strategic planning and milestone tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                  {
                    year: '2025',
                    targets: [
                      'Generate 150K carbon credits',
                      'Achieve ₹125Cr carbon revenue',
                      'Launch international markets',
                      'Complete 15 new projects',
                      'Implement blockchain verification'
                    ],
                    investment: 2500000000,
                    expectedRoi: 320,
                    keyMilestones: [
                      'Q1: EU market entry',
                      'Q2: Technology platform launch',
                      'Q3: Scale operations 3x',
                      'Q4: Carbon neutral certification'
                    ]
                  },
                  {
                    year: '2026',
                    targets: [
                      'Generate 250K carbon credits',
                      'Achieve ₹200Cr carbon revenue',
                      'Expand to 5 countries',
                      'Complete 25 projects',
                      'AI-powered optimization'
                    ],
                    investment: 4200000000,
                    expectedRoi: 385,
                    keyMilestones: [
                      'Q1: Asia-Pacific expansion',
                      'Q2: Strategic partnerships',
                      'Q3: Technology integration',
                      'Q4: Market leadership position'
                    ]
                  },
                  {
                    year: '2027',
                    targets: [
                      'Generate 400K carbon credits',
                      'Achieve ₹350Cr carbon revenue',
                      'Global market presence',
                      'Complete 40 projects',
                      'Industry transformation leadership'
                    ],
                    investment: 6800000000,
                    expectedRoi: 450,
                    keyMilestones: [
                      'Q1: Global platform launch',
                      'Q2: Industry standards setting',
                      'Q3: Ecosystem partnerships',
                      'Q4: Sustainable future achievement'
                    ]
                  }
                ].map((roadmap, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{roadmap.year} Vision</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {roadmap.expectedRoi}% ROI
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Strategic Targets</h5>
                        <ul className="space-y-1">
                          {roadmap.targets.map((target, targetIndex) => (
                            <li key={targetIndex} className="text-sm flex items-start space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{target}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Key Milestones</h5>
                        <ul className="space-y-1">
                          {roadmap.keyMilestones.map((milestone, milestoneIndex) => (
                            <li key={milestoneIndex} className="text-sm flex items-start space-x-2">
                              <Clock className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{milestone}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Investment Required</span>
                          <span className="font-medium">{formatCurrency(roadmap.investment)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expected ROI</span>
                          <span className="font-medium text-green-600">{roadmap.expectedRoi}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default EnhancedCarbonAnalytics;