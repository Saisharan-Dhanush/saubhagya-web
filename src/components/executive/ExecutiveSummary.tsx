import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  RefreshCw,
  Volume2,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { useExecutiveAnalytics } from '../../contexts/ExecutiveAnalyticsContext';

const ExecutiveSummary: React.FC = () => {
  const {
    kpis,
    insights,
    overallPerformanceScore,
    criticalAlerts,
    topOpportunities,
    refreshing,
    refreshData
  } = useExecutiveAnalytics();

  const getKPIIcon = (category: string) => {
    switch (category) {
      case 'financial':
        return <DollarSign className="h-5 w-5" />;
      case 'operational':
        return <Activity className="h-5 w-5" />;
      case 'environmental':
        return <Target className="h-5 w-5" />;
      case 'strategic':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' || change > 0) {
      return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    } else if (trend === 'down' || change < 0) {
      return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    }
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatCurrency = (value: number): string => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const formatValue = (value: number, unit: string): string => {
    if (unit === '₹') {
      return formatCurrency(value);
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const speakSummary = () => {
    const summaryText = `Executive Summary: Overall performance score is ${overallPerformanceScore}%. Revenue is ${formatCurrency(kpis.find(k => k.id === 'revenue')?.value || 0)} with ${kpis.find(k => k.id === 'revenue')?.change || 0}% growth. ${criticalAlerts.length} critical alerts require immediate attention.`;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(summaryText);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Overall Performance */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
          <p className="text-gray-600">Real-time business intelligence and key performance indicators</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getPerformanceColor(overallPerformanceScore)}`}>
              {overallPerformanceScore}%
            </div>
            <div className="text-sm text-gray-500">Overall Performance</div>
          </div>
          <Button
            onClick={speakSummary}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Listen
          </Button>
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}</strong>
            <div className="mt-2 space-y-1">
              {criticalAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="text-sm">
                  • {alert.title}: {alert.description}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Top Opportunities */}
      {topOpportunities.length > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Top Growth Opportunity</strong>
            <div className="mt-2 text-sm">
              {topOpportunities[0].title}: {topOpportunities[0].description}
              {topOpportunities[0].estimatedValue && (
                <span className="font-semibold ml-2">
                  Potential Value: {formatCurrency(topOpportunities[0].estimatedValue)}
                </span>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${
                kpi.category === 'financial' ? 'bg-blue-100 text-blue-600' :
                kpi.category === 'operational' ? 'bg-green-100 text-green-600' :
                kpi.category === 'environmental' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {getKPIIcon(kpi.category)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {formatValue(kpi.value, kpi.unit)}
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(kpi.trend, kpi.change)}
                  <span className={`text-sm font-medium ${
                    kpi.change > 0 ? 'text-green-600' :
                    kpi.change < 0 ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress to Target</span>
                  <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                </div>
                <Progress
                  value={(kpi.value / kpi.target) * 100}
                  className="h-2"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Target: {formatValue(kpi.target, kpi.unit)}
                  </span>
                  <Badge
                    variant="outline"
                    className={getConfidenceColor(kpi.confidence)}
                  >
                    {Math.round(kpi.confidence * 100)}% Confidence
                  </Badge>
                </div>
              </div>

              {kpi.priority === 'high' && (
                <div className="mt-2">
                  <Badge variant="destructive" className="text-xs">
                    High Priority
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.slice(0, 3).map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.impact === 'positive' ? 'border-green-500 bg-green-50' :
                  insight.impact === 'negative' ? 'border-red-500 bg-red-50' :
                  'border-gray-500 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <Badge
                    variant="outline"
                    className={getConfidenceColor(insight.confidence)}
                  >
                    {Math.round(insight.confidence * 100)}%
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-gray-600">{insight.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{insight.timeline}</span>
                  {insight.estimatedValue && (
                    <span className={`text-sm font-medium ${
                      insight.impact === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {insight.impact === 'positive' ? '+' : ''}{formatCurrency(insight.estimatedValue)}
                    </span>
                  )}
                </div>
                {insight.actionRequired && (
                  <Badge variant="outline" className="mt-2 text-xs bg-yellow-100 text-yellow-800">
                    Action Required
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Executive Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights
              .filter(insight => insight.actionRequired)
              .slice(0, 3)
              .map((insight) => (
                <div key={insight.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.timeline}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {insight.estimatedValue && (
                      <span className={`text-sm font-medium ${
                        insight.impact === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {insight.impact === 'positive' ? '+' : ''}{formatCurrency(insight.estimatedValue)}
                      </span>
                    )}
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;