import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  Cell
} from 'recharts';
import { TrendingUp, Brain, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface PredictiveChartsProps {
  type: 'revenue-forecast' | 'demand-prediction' | 'scenario-analysis' | 'risk-assessment' | 'trend-analysis';
  data?: any;
  timeframe?: '3m' | '6m' | '12m' | '24m';
  confidence?: number;
  language?: 'en' | 'hi';
  showConfidenceInterval?: boolean;
  showSeasonality?: boolean;
  modelType?: 'linear' | 'exponential' | 'polynomial' | 'arima';
}

interface ForecastDataPoint {
  period: string;
  historical?: number;
  predicted: number;
  confidenceUpper: number;
  confidenceLower: number;
  trend: number;
  seasonality?: number;
  scenario?: 'optimistic' | 'realistic' | 'pessimistic';
}

interface ScenarioData {
  name: string;
  probability: number;
  outcomes: {
    revenue: number;
    profitability: number;
    marketShare: number;
    riskLevel: number;
  };
  factors: string[];
}

export default function PredictiveCharts({
  type,
  data,
  timeframe = '12m',
  confidence = 85,
  language = 'en',
  showConfidenceInterval = true,
  showSeasonality = false,
  modelType = 'exponential'
}: PredictiveChartsProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('realistic');
  const [showDetails, setShowDetails] = useState(false);

  // Translations
  const translations = {
    en: {
      historical: 'Historical',
      predicted: 'Predicted',
      optimistic: 'Optimistic',
      realistic: 'Realistic',
      pessimistic: 'Pessimistic',
      confidence: 'Confidence Interval',
      trend: 'Trend',
      seasonality: 'Seasonality',
      revenue: 'Revenue',
      demand: 'Demand',
      risk: 'Risk Level',
      probability: 'Probability',
      factors: 'Key Factors',
      modelAccuracy: 'Model Accuracy',
      scenarios: 'Scenarios',
      forecast: 'Forecast',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
      units: {
        revenue: '₹ Lakhs',
        demand: 'm³/day',
        risk: '%',
        efficiency: '%'
      },
      riskLevels: {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk',
        critical: 'Critical Risk'
      }
    },
    hi: {
      historical: 'ऐतिहासिक',
      predicted: 'अनुमानित',
      optimistic: 'आशावादी',
      realistic: 'यथार्थवादी',
      pessimistic: 'निराशावादी',
      confidence: 'विश्वसनीयता अंतराल',
      trend: 'रुझान',
      seasonality: 'मौसमी',
      revenue: 'राजस्व',
      demand: 'मांग',
      risk: 'जोखिम स्तर',
      probability: 'संभावना',
      factors: 'मुख्य कारक',
      modelAccuracy: 'मॉडल सटीकता',
      scenarios: 'परिदृश्य',
      forecast: 'पूर्वानुमान',
      months: ['जन', 'फर', 'मार', 'अप्र', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस'],
      quarters: ['त1', 'त2', 'त3', 'त4'],
      units: {
        revenue: '₹ लाख',
        demand: 'm³/दिन',
        risk: '%',
        efficiency: '%'
      },
      riskLevels: {
        low: 'कम जोखिम',
        medium: 'मध्यम जोखिम',
        high: 'उच्च जोखिम',
        critical: 'गंभीर जोखिम'
      }
    }
  };

  const t = translations[language];

  // Generate predictive data based on type
  const forecastData = useMemo((): ForecastDataPoint[] => {
    const periods = timeframe === '24m' ? 24 : timeframe === '12m' ? 12 : timeframe === '6m' ? 6 : 3;
    const baseValue = 125; // Base revenue in lakhs
    const data: ForecastDataPoint[] = [];

    // Historical data (past 6 months)
    for (let i = -6; i < 0; i++) {
      const monthIndex = (new Date().getMonth() + i + 12) % 12;
      const seasonalEffect = Math.sin((monthIndex / 12) * 2 * Math.PI) * 0.1;
      const trendEffect = i * 0.02;
      const noise = (Math.random() - 0.5) * 0.05;

      const value = baseValue * (1 + trendEffect + seasonalEffect + noise);

      data.push({
        period: t.months[monthIndex],
        historical: value,
        predicted: value,
        confidenceUpper: value * 1.05,
        confidenceLower: value * 0.95,
        trend: value,
        seasonality: seasonalEffect * baseValue
      });
    }

    // Future predictions
    for (let i = 0; i < periods; i++) {
      const monthIndex = (new Date().getMonth() + i) % 12;
      const seasonalEffect = Math.sin((monthIndex / 12) * 2 * Math.PI) * 0.1;

      let growthRate = 0.03; // 3% monthly growth
      let volatility = 0.1;

      // Adjust based on model type
      switch (modelType) {
        case 'exponential':
          growthRate = 0.02 + (i * 0.001);
          break;
        case 'polynomial':
          growthRate = 0.025 + (i * 0.0005) - (i * i * 0.00001);
          break;
        case 'linear':
          growthRate = 0.025;
          break;
        case 'arima':
          growthRate = 0.02 + (Math.random() * 0.01);
          volatility = 0.05;
          break;
      }

      const trendEffect = i * growthRate;
      const predicted = baseValue * (1 + trendEffect + seasonalEffect);

      // Add confidence intervals
      const confidenceRange = predicted * (volatility * ((100 - confidence) / 100));

      data.push({
        period: t.months[monthIndex],
        predicted: predicted,
        confidenceUpper: predicted + confidenceRange,
        confidenceLower: Math.max(0, predicted - confidenceRange),
        trend: baseValue * (1 + trendEffect),
        seasonality: seasonalEffect * baseValue
      });
    }

    return data;
  }, [timeframe, confidence, modelType, t.months]);

  // Generate scenario data
  const scenarioData = useMemo((): ScenarioData[] => {
    return [
      {
        name: t.optimistic,
        probability: 25,
        outcomes: {
          revenue: 280,
          profitability: 35,
          marketShare: 32,
          riskLevel: 25
        },
        factors: [
          language === 'hi' ? 'बाज़ार की मांग में 40% वृद्धि' : 'Market demand increases 40%',
          language === 'hi' ? 'सरकारी सहायता जारी' : 'Government support continues',
          language === 'hi' ? 'तकनीकी नवाचार सफल' : 'Technology innovations succeed'
        ]
      },
      {
        name: t.realistic,
        probability: 60,
        outcomes: {
          revenue: 210,
          profitability: 28,
          marketShare: 25,
          riskLevel: 40
        },
        factors: [
          language === 'hi' ? 'बाज़ार की मांग में 20% वृद्धि' : 'Market demand increases 20%',
          language === 'hi' ? 'स्थिर नियामक वातावरण' : 'Stable regulatory environment',
          language === 'hi' ? 'मध्यम प्रतिस्पर्धा' : 'Moderate competition'
        ]
      },
      {
        name: t.pessimistic,
        probability: 15,
        outcomes: {
          revenue: 160,
          profitability: 22,
          marketShare: 20,
          riskLevel: 65
        },
        factors: [
          language === 'hi' ? 'आर्थिक मंदी' : 'Economic slowdown',
          language === 'hi' ? 'बढ़ी प्रतिस्पर्धा' : 'Increased competition',
          language === 'hi' ? 'नियामक बाधाएं' : 'Regulatory barriers'
        ]
      }
    ];
  }, [language, t]);

  // Risk assessment data
  const riskData = useMemo(() => {
    return [
      { factor: 'Market Risk', level: 35, impact: 'medium', mitigation: 85 },
      { factor: 'Technology Risk', level: 20, impact: 'low', mitigation: 90 },
      { factor: 'Regulatory Risk', level: 45, impact: 'high', mitigation: 70 },
      { factor: 'Competition Risk', level: 55, impact: 'high', mitigation: 65 },
      { factor: 'Financial Risk', level: 25, impact: 'medium', mitigation: 85 },
      { factor: 'Operational Risk', level: 30, impact: 'medium', mitigation: 80 }
    ];
  }, []);

  // Custom tooltip for forecast charts
  const ForecastTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64">
        <p className="font-medium text-gray-900 mb-3">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {entry.value?.toFixed(1)}
              {entry.dataKey?.includes('confidence') && (
                <span className="text-xs text-gray-500 ml-1">
                  ({confidence}% confidence)
                </span>
              )}
            </span>
          </div>
        ))}
        {payload.some((p: any) => p.dataKey === 'predicted') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Brain className="h-3 w-3" />
              <span>Model: {modelType.toUpperCase()}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render different chart types
  const renderChart = () => {
    switch (type) {
      case 'revenue-forecast':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<ForecastTooltip />} />
              <Legend />

              {/* Confidence interval area */}
              {showConfidenceInterval && (
                <Area
                  type="monotone"
                  dataKey="confidenceUpper"
                  stroke="none"
                  fill="#93c5fd"
                  fillOpacity={0.3}
                  name={t.confidence}
                />
              )}

              {/* Historical data */}
              <Line
                type="monotone"
                dataKey="historical"
                stroke="#374151"
                strokeWidth={3}
                dot={{ fill: '#374151', strokeWidth: 2, r: 4 }}
                name={t.historical}
              />

              {/* Prediction line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#2563eb"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                name={t.predicted}
              />

              {/* Trend line */}
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
                name={t.trend}
              />

              {/* Seasonality */}
              {showSeasonality && (
                <Line
                  type="monotone"
                  dataKey="seasonality"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  dot={false}
                  name={t.seasonality}
                />
              )}

              {/* Confidence bounds */}
              {showConfidenceInterval && (
                <>
                  <Line
                    type="monotone"
                    dataKey="confidenceUpper"
                    stroke="#93c5fd"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    dot={false}
                    name="Upper Bound"
                  />
                  <Line
                    type="monotone"
                    dataKey="confidenceLower"
                    stroke="#93c5fd"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    dot={false}
                    name="Lower Bound"
                  />
                </>
              )}

              {/* Reference line for current period */}
              <ReferenceLine x={new Date().toLocaleDateString('en', { month: 'short' })} stroke="#dc2626" strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'scenario-analysis':
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={scenarioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value}${name === 'probability' ? '%' : name === 'revenue' ? ' ₹L' : '%'}`,
                    name
                  ]}
                />
                <Legend />

                <Area
                  type="monotone"
                  dataKey="probability"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name={t.probability}
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Scenario Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarioData.map((scenario, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedScenario === scenario.name.toLowerCase()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedScenario(scenario.name.toLowerCase())}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    <span className="text-sm text-gray-600">{scenario.probability}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">{t.revenue}:</span>
                      <div className="font-medium">₹{scenario.outcomes.revenue}L</div>
                    </div>
                    <div>
                      <span className="text-gray-600">ROI:</span>
                      <div className="font-medium">{scenario.outcomes.profitability}%</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-gray-700">{t.factors}:</h5>
                    {scenario.factors.slice(0, 2).map((factor, idx) => (
                      <div key={idx} className="text-xs text-gray-600">• {factor}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'risk-assessment':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={riskData}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={12} />
              <YAxis type="category" dataKey="factor" stroke="#6b7280" fontSize={12} width={90} />
              <Tooltip
                formatter={(value: any, name: any) => [`${value}%`, name]}
                labelFormatter={(label: any) => `Risk Factor: ${label}`}
              />
              <Legend />

              <Bar
                dataKey="level"
                fill="#dc2626"
                name="Risk Level"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="mitigation"
                fill="#16a34a"
                name="Mitigation %"
                radius={[0, 4, 4, 0]}
                fillOpacity={0.7}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'trend-analysis':
        const trendData = forecastData.map((item, index) => ({
          ...item,
          momentum: index > 0 ? (item.predicted - forecastData[index - 1].predicted) / forecastData[index - 1].predicted * 100 : 0,
          acceleration: index > 1 ?
            ((item.predicted - forecastData[index - 1].predicted) - (forecastData[index - 1].predicted - forecastData[index - 2].predicted)) : 0
        }));

        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
              <Tooltip content={<ForecastTooltip />} />
              <Legend />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="predicted"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.3}
                name="Revenue Trend"
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="momentum"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                name="Growth Momentum (%)"
              />

              <ReferenceLine yAxisId="right" y={0} stroke="#6b7280" strokeDasharray="2 2" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Predictive model loading...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Model Information Header */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">
              {t.forecast} - {modelType.toUpperCase()} Model
            </h3>
            <p className="text-xs text-blue-700">
              {t.modelAccuracy}: {confidence}% | {t.confidence}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {confidence >= 80 && <CheckCircle className="h-4 w-4 text-green-600" />}
          {confidence < 80 && confidence >= 60 && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
          {confidence < 60 && <AlertTriangle className="h-4 w-4 text-red-600" />}
          <span className="text-sm font-medium text-gray-900">{confidence}%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {renderChart()}
      </div>

      {/* Additional Insights */}
      {type === 'revenue-forecast' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Growth Trend</span>
            </div>
            <p className="text-xl font-bold text-green-600">+18.5%</p>
            <p className="text-xs text-green-700">Projected annual growth</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Target Achievement</span>
            </div>
            <p className="text-xl font-bold text-blue-600">85%</p>
            <p className="text-xs text-blue-700">Expected by year-end</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Peak Month</span>
            </div>
            <p className="text-xl font-bold text-purple-600">Dec</p>
            <p className="text-xs text-purple-700">Seasonal high expected</p>
          </div>
        </div>
      )}
    </div>
  );
}