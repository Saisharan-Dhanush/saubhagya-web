import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Brain,
  Factory,
  Filter,
  DollarSign,
  Users,
  Zap,
  Globe,
  Clock,
  Target,
  Award,
  Calendar,
  FileText,
  Video,
  MessageSquare,
  Share2,
  Download,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { usePlatform } from '../../contexts/PlatformContext'
import { useExecutiveAnalytics } from '../../contexts/ExecutiveAnalyticsContext'

interface CrossModuleMetric {
  id: string
  name: string
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'stable'
  modules: string[]
  priority: 'high' | 'medium' | 'low'
  lastUpdated: Date
}

interface ExecutiveInsight {
  id: string
  title: string
  description: string
  impact: 'positive' | 'negative' | 'neutral'
  confidence: number
  actionRequired: boolean
  modules: string[]
  value?: string
  timeframe: string
}

interface CollaborationSession {
  id: string
  title: string
  participants: string[]
  status: 'active' | 'scheduled' | 'completed'
  startTime: Date
  duration: number
  modules: string[]
}

const ExecutiveCommandCenter: React.FC = () => {
  const { user, isExecutive } = useAuth()
  const { navigationState, sessionMetrics, navigateToModule } = usePlatform()
  const { kpis } = useExecutiveAnalytics()

  const [crossModuleMetrics, setCrossModuleMetrics] = useState<CrossModuleMetric[]>([
    {
      id: 'unified-revenue',
      name: 'Total Platform Revenue',
      value: 18750000, // 18.75 Cr combining all modules
      unit: '₹',
      change: 22.5,
      trend: 'up',
      modules: ['urjasanyojak', 'shuddhi-doot', 'urja-vyapar'],
      priority: 'high',
      lastUpdated: new Date()
    },
    {
      id: 'operational-efficiency',
      name: 'Cross-Platform Efficiency',
      value: 91.2,
      unit: '%',
      change: 8.3,
      trend: 'up',
      modules: ['urjasanyojak', 'shuddhi-doot'],
      priority: 'high',
      lastUpdated: new Date()
    },
    {
      id: 'executive-decisions',
      name: 'Strategic Decisions This Week',
      value: 12,
      unit: 'decisions',
      change: -15.2,
      trend: 'down',
      modules: ['urja-neta'],
      priority: 'medium',
      lastUpdated: new Date()
    }
  ])

  const [executiveInsights, setExecutiveInsights] = useState<ExecutiveInsight[]>([
    {
      id: 'cross-platform-synergy',
      title: 'Cross-Platform Operational Synergy',
      description: 'UrjaSanyojak and ShuddhiDoot integration showing 15% efficiency gain in biogas quality control',
      impact: 'positive',
      confidence: 94,
      actionRequired: false,
      modules: ['urjasanyojak', 'shuddhi-doot'],
      value: '+₹2.3Cr',
      timeframe: 'Q1 2025'
    },
    {
      id: 'sales-production-gap',
      title: 'Sales-Production Alignment Gap',
      description: 'UrjaVyapar sales commitments exceeding UrjaSanyojak production capacity by 12%',
      impact: 'negative',
      confidence: 87,
      actionRequired: true,
      modules: ['urjasanyojak', 'urja-vyapar'],
      value: 'Risk: ₹1.8Cr',
      timeframe: 'Immediate'
    },
    {
      id: 'quality-premium-opportunity',
      title: 'Premium Quality Market Opportunity',
      description: 'ShuddhiDoot purity levels enabling 25% premium pricing in international markets',
      impact: 'positive',
      confidence: 82,
      actionRequired: true,
      modules: ['shuddhi-doot', 'urja-vyapar'],
      value: '+₹4.2Cr',
      timeframe: '6 months'
    }
  ])

  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([
    {
      id: 'weekly-exec-review',
      title: 'Weekly Executive Review',
      participants: ['Dr. Rajesh Kumar', 'Priya Sharma', 'Amit Patel'],
      status: 'scheduled',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 60,
      modules: ['urjasanyojak', 'shuddhi-doot', 'urja-vyapar', 'urja-neta']
    },
    {
      id: 'production-sales-sync',
      title: 'Production-Sales Alignment',
      participants: ['Operations Team', 'Sales Team'],
      status: 'active',
      startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 min ago
      duration: 90,
      modules: ['urjasanyojak', 'urja-vyapar']
    }
  ])

  const [refreshing, setRefreshing] = useState(false)

  const formatCurrency = (value: number): string => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`
    } else {
      return `₹${value.toLocaleString()}`
    }
  }

  const handleRefreshData = async () => {
    setRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update timestamps
    setCrossModuleMetrics(prev => prev.map(metric => ({
      ...metric,
      lastUpdated: new Date()
    })))

    setRefreshing(false)
  }

  const handleModuleDeepDive = (moduleId: string) => {
    navigateToModule(moduleId)
  }

  if (!isExecutive()) {
    return (
      <Alert className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Executive Command Center requires executive-level access.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Command Center</h1>
          <p className="text-gray-600">Unified platform oversight and strategic decision support</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="default" className="bg-gold-100 text-gold-800 border-gold-300">
            Executive Access
          </Badge>
          <Button
            onClick={handleRefreshData}
            disabled={refreshing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Executive Reports</TabsTrigger>
        </TabsList>

        {/* Platform Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Cross-Module KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crossModuleMetrics.map((metric) => (
              <Card key={metric.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    <Badge
                      variant={metric.priority === 'high' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {metric.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-end space-x-2">
                      <span className="text-2xl font-bold">
                        {metric.unit === '₹' ? formatCurrency(metric.value) : `${metric.value}${metric.unit}`}
                      </span>
                      <div className={`flex items-center text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`h-4 w-4 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                        {Math.abs(metric.change)}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">Source Modules:</div>
                      <div className="flex flex-wrap gap-1">
                        {metric.modules.map((moduleId) => (
                          <Button
                            key={moduleId}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleModuleDeepDive(moduleId)}
                            className="h-6 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                          >
                            {moduleId.replace('-', '')}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400">
                      Updated: {metric.lastUpdated.toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Module Status Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Platform Module Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <Factory className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">UrjaSanyojak</div>
                      <div className="text-sm text-green-700">Active</div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                    99.2%
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Filter className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">ShuddhiDoot</div>
                      <div className="text-sm text-blue-700">Active</div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-300">
                    98.7%
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-900">UrjaVyapar</div>
                      <div className="text-sm text-purple-700">Active</div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-purple-100 text-purple-800 border-purple-300">
                    97.9%
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gold-50 rounded-lg border border-gold-200">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-8 w-8 text-gold-600" />
                    <div>
                      <div className="font-medium text-gold-900">UrjaNeta</div>
                      <div className="text-sm text-gold-700">Executive</div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-gold-100 text-gold-800 border-gold-300">
                    100%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategic Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {executiveInsights.map((insight) => (
              <Card key={insight.id} className={`border-l-4 ${
                insight.impact === 'positive' ? 'border-l-green-500 bg-green-50' :
                insight.impact === 'negative' ? 'border-l-red-500 bg-red-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-xs">
                          Confidence: {insight.confidence}%
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {insight.timeframe}
                        </Badge>
                        {insight.value && (
                          <Badge variant={insight.impact === 'positive' ? 'default' : 'destructive'} className="text-xs">
                            {insight.value}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {insight.actionRequired && (
                      <Button variant="outline" size="sm">
                        <Target className="h-4 w-4 mr-1" />
                        Action Required
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {insight.modules.map((moduleId) => (
                        <Button
                          key={moduleId}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModuleDeepDive(moduleId)}
                          className="h-6 px-2 text-xs"
                        >
                          {moduleId}
                        </Button>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Collaboration Tab */}
        <TabsContent value="collaboration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5" />
                  <span>Active Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {collaborationSessions.filter(s => s.status === 'active').map((session) => (
                  <div key={session.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-900">{session.title}</h4>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Live
                      </Badge>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      Participants: {session.participants.join(', ')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600">
                        Started: {Math.floor((Date.now() - session.startTime.getTime()) / 60000)}m ago
                      </span>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                ))}

                {collaborationSessions.filter(s => s.status === 'scheduled').map((session) => (
                  <div key={session.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900">{session.title}</h4>
                      <Badge variant="secondary">
                        Scheduled
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      Participants: {session.participants.join(', ')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">
                        Starts: {session.startTime.toLocaleTimeString()}
                      </span>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Executive Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Start Executive Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Cross-Module Insights
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Strategic Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Unified Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Platform Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1.2s</div>
                  <div className="text-sm text-blue-700">Avg Load Time</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">99.8%</div>
                  <div className="text-sm text-green-700">Platform Uptime</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">2.1s</div>
                  <div className="text-sm text-purple-700">SSO Response</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">94.2%</div>
                  <div className="text-sm text-orange-700">User Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6" />
              <span>Weekly Executive Summary</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>Cross-Module Analytics</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Target className="h-6 w-6" />
              <span>Strategic Planning Report</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Award className="h-6 w-6" />
              <span>Performance Review</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <DollarSign className="h-6 w-6" />
              <span>Financial Overview</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Team Productivity</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { ExecutiveCommandCenter }