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
  Scatter
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Zap } from 'lucide-react';

interface ExecutiveChartsProps {
  data?: any;
  type: 'revenue-trend' | 'kpi-dashboard' | 'market-analysis' | 'performance-comparison' | 'carbon-analytics';
  language?: 'en' | 'hi';
  timeframe?: '7d' | '30d' | '90d' | '12m';
  showLegend?: boolean;
  showGrid?: boolean;
  animated?: boolean;
}

// Color palette for executive dashboards
const COLORS = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#dc2626',
  info: '#0891b2',
  gray: '#6b7280'
};

const CHART_COLORS = [
  '#2563eb', '#7c3aed', '#16a34a', '#f59e0b', '#dc2626',
  '#0891b2', '#ec4899', '#84cc16', '#f97316', '#8b5cf6'
];

export default function ExecutiveCharts({
  data,
  type,
  language = 'en',
  timeframe = '30d',
  showLegend = true,
  showGrid = true,
  animated = true
}: ExecutiveChartsProps) {
  const [activeDataKey, setActiveDataKey] = useState<string | null>(null);

  // Translations
  const t = {
    en: {
      revenue: 'Revenue',
      biogasProduction: 'Biogas Production',
      carbonCredits: 'Carbon Credits',
      customerSatisfaction: 'Customer Satisfaction',
      marketShare: 'Market Share',
      profitability: 'Profitability',
      efficiency: 'Efficiency',
      growth: 'Growth',
      target: 'Target',
      actual: 'Actual',
      projected: 'Projected',
      quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      units: {
        revenue: '₹ Lakhs',
        production: 'm³/day',
        credits: 'tons CO2',
        satisfaction: '%',
        share: '%',
        efficiency: '%'
      }
    },
    hi: {
      revenue: 'राजस्व',
      biogasProduction: 'बायोगैस उत्पादन',
      carbonCredits: 'कार्बन क्रेडिट',
      customerSatisfaction: 'ग्राहक संतुष्टि',
      marketShare: 'बाज़ार हिस्सेदारी',
      profitability: 'लाभप्रदता',
      efficiency: 'दक्षता',
      growth: 'वृद्धि',
      target: 'लक्ष्य',
      actual: 'वास्तविक',
      projected: 'अनुमानित',
      quarters: ['त1', 'त2', 'त3', 'त4'],
      months: ['जन', 'फर', 'मार', 'अप्र', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस'],
      units: {
        revenue: '₹ लाख',
        production: 'm³/दिन',
        credits: 'टन CO2',
        satisfaction: '%',
        share: '%',
        efficiency: '%'
      }
    }
  };

  const translations = t[language];

  // Generate mock data based on chart type
  const chartData = useMemo(() => {
    const generateTimeSeriesData = (periods: number, baseValue: number, volatility: number = 0.1) => {
      const data = [];
      for (let i = 0; i < periods; i++) {
        const trend = i * (0.02 + Math.random() * 0.03);
        const noise = (Math.random() - 0.5) * volatility;
        data.push({
          period: timeframe === '12m' ? translations.months[i % 12] :
                  timeframe === '90d' ? `Week ${i + 1}` : `Day ${i + 1}`,
          value: Math.max(0, baseValue * (1 + trend + noise)),
          target: baseValue * (1 + i * 0.025),
          projected: i > periods * 0.7 ? baseValue * (1 + i * 0.03) : undefined
        });
      }
      return data;
    };

    switch (type) {
      case 'revenue-trend':
        return generateTimeSeriesData(12, 125, 0.15).map((item, index) => ({
          ...item,
          revenue: item.value,
          carbonRevenue: item.value * 0.25,
          biogasRevenue: item.value * 0.75,
          growth: index > 0 ? ((item.value - generateTimeSeriesData(12, 125, 0.15)[index - 1]?.value) /
                   generateTimeSeriesData(12, 125, 0.15)[index - 1]?.value * 100) : 0
        }));

      case 'kpi-dashboard':
        return [
          {
            name: translations.revenue,
            current: 125,
            target: 150,
            previous: 110,
            unit: translations.units.revenue,
            trend: 'up',
            confidence: 85
          },
          {
            name: translations.biogasProduction,
            current: 12.5,
            target: 15,
            previous: 11.2,
            unit: translations.units.production,
            trend: 'up',
            confidence: 92
          },
          {
            name: translations.carbonCredits,
            current: 450,
            target: 500,
            previous: 380,
            unit: translations.units.credits,
            trend: 'up',
            confidence: 88
          },
          {
            name: translations.customerSatisfaction,
            current: 87,
            target: 90,
            previous: 89,
            unit: translations.units.satisfaction,
            trend: 'down',
            confidence: 75
          },
          {
            name: translations.efficiency,
            current: 82,
            target: 90,
            previous: 78,
            unit: translations.units.efficiency,
            trend: 'up',
            confidence: 90
          }
        ];

      case 'market-analysis':
        return [
          { name: 'SAUBHAGYA', value: 23.5, revenue: 290, color: COLORS.primary },
          { name: 'GreenTech Solutions', value: 28.2, revenue: 350, color: COLORS.danger },
          { name: 'Rural Energy Co', value: 18.7, revenue: 235, color: COLORS.warning },
          { name: 'BioGas Innovations', value: 15.3, revenue: 190, color: COLORS.success },
          { name: 'Others', value: 14.3, revenue: 175, color: COLORS.gray }
        ];

      case 'performance-comparison':
        return [
          {
            category: 'Technology',
            ourScore: 85,
            industryAvg: 72,
            topCompetitor: 88,
            importance: 95
          },
          {
            category: 'Cost Effectiveness',
            ourScore: 78,
            industryAvg: 70,
            topCompetitor: 75,
            importance: 85
          },
          {
            category: 'Rural Reach',
            ourScore: 92,
            industryAvg: 65,
            topCompetitor: 70,
            importance: 80
          },
          {
            category: 'Carbon Optimization',
            ourScore: 88,
            industryAvg: 60,
            topCompetitor: 82,
            importance: 75
          },
          {
            category: 'Customer Service',
            ourScore: 75,
            industryAvg: 78,
            topCompetitor: 85,
            importance: 70
          },
          {
            category: 'Innovation',
            ourScore: 72,
            industryAvg: 68,
            topCompetitor: 90,
            importance: 90
          }
        ];

      case 'carbon-analytics':
        return generateTimeSeriesData(12, 450, 0.12).map((item, index) => ({
          ...item,
          credits: item.value,
          price: 1500 + Math.random() * 200,
          revenue: item.value * (1500 + Math.random() * 200),
          efficiency: 85 + Math.random() * 10,
          forecast: index > 8 ? item.value * 1.15 : undefined
        }));

      default:
        return [];
    }
  }, [type, timeframe, translations]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-48">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Render different chart types
  const renderChart = () => {
    switch (type) {
      case 'revenue-trend':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
              <XAxis
                dataKey="period"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}

              <Area
                type="monotone"
                dataKey="biogasRevenue"
                stackId="1"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.6}
                name={translations.biogasProduction}
              />
              <Area
                type="monotone"
                dataKey="carbonRevenue"
                stackId="1"
                stroke={COLORS.success}
                fill={COLORS.success}
                fillOpacity={0.6}
                name={translations.carbonCredits}
              />

              <Line
                type="monotone"
                dataKey="target"
                stroke={COLORS.warning}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name={translations.target}
              />

              {chartData.some(d => d.projected) && (
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  name={translations.projected}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'kpi-dashboard':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}

              <Bar
                dataKey="current"
                fill={COLORS.primary}
                name={translations.actual}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="target"
                fill={COLORS.warning}
                name={translations.target}
                radius={[4, 4, 0, 0]}
                fillOpacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'market-analysis':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [`${value}%`, translations.marketShare]}
                labelFormatter={(label: any) => `${label}`}
              />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'performance-comparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              layout="horizontal"
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
              <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={12} />
              <YAxis
                type="category"
                dataKey="category"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                width={120}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}

              <Bar dataKey="ourScore" fill={COLORS.primary} name="Our Score" radius={[0, 4, 4, 0]} />
              <Bar dataKey="industryAvg" fill={COLORS.gray} name="Industry Average" radius={[0, 4, 4, 0]} />
              <Bar dataKey="topCompetitor" fill={COLORS.danger} name="Top Competitor" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'carbon-analytics':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
              <XAxis
                dataKey="period"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                yAxisId="credits"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="price"
                orientation="right"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}

              <Bar
                yAxisId="credits"
                dataKey="credits"
                fill={COLORS.success}
                name="Carbon Credits"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.8}
              />

              <Line
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke={COLORS.warning}
                strokeWidth={3}
                dot={{ fill: COLORS.warning, strokeWidth: 2, r: 4 }}
                name="Price per Ton"
              />

              {chartData.some(d => d.forecast) && (
                <Line
                  yAxisId="credits"
                  type="monotone"
                  dataKey="forecast"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Forecast"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chart type not implemented</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {renderChart()}
    </div>
  );
}

// Export additional chart utilities
export const EXECUTIVE_CHART_TYPES = [
  'revenue-trend',
  'kpi-dashboard',
  'market-analysis',
  'performance-comparison',
  'carbon-analytics'
] as const;

export const EXECUTIVE_COLORS = COLORS;
export const EXECUTIVE_CHART_COLORS = CHART_COLORS;