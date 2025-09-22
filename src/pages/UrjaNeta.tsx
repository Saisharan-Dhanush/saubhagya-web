import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExecutiveAnalyticsProvider } from '../contexts/ExecutiveAnalyticsContext'
import { usePlatform } from '../contexts/PlatformContext'
import ExecutiveSummary from '../components/executive/ExecutiveSummary'
import VoiceAnalytics from '../components/voice/VoiceAnalytics'
import StrategicPlanning from '../components/executive/StrategicPlanning'
import CarbonAnalytics from '../components/executive/CarbonAnalytics'
import CompetitiveIntelligence from '../components/executive/CompetitiveIntelligence'
import { TrendingUp, Mic, BarChart3, Leaf, Target, Brain, Globe } from 'lucide-react'

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const UrjaNeta: React.FC = () => {
  const { trackModuleUsage, updateBreadcrumbs } = usePlatform()
  const [activeTab, setActiveTab] = useState('summary');

  const dashboardTabs: DashboardTab[] = [
    {
      id: 'summary',
      label: 'Executive Summary',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Real-time KPIs and business intelligence'
    },
    {
      id: 'voice',
      label: 'Voice Analytics',
      icon: <Mic className="h-4 w-4" />,
      description: 'Voice-enabled business queries'
    },
    {
      id: 'strategic',
      label: 'Strategic Planning',
      icon: <Target className="h-4 w-4" />,
      description: 'Strategic initiatives and planning'
    },
    {
      id: 'carbon',
      label: 'Carbon Analytics',
      icon: <Leaf className="h-4 w-4" />,
      description: 'Environmental impact and carbon credits'
    },
    {
      id: 'competitive',
      label: 'Market Intelligence',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Competitive analysis and market insights'
    }
  ];

  const translations = {
    en: {
      title: 'UrjaNeta Executive Analytics',
      subtitle: 'Advanced voice-enabled business intelligence platform',
    },
    hi: {
      title: 'उर्जा नेता कार्यकारी विश्लेषण',
      subtitle: 'उन्नत वॉइस-सक्षम व्यापारिक बुद्धिमत्ता प्लेटफॉर्म',
    }
  };

  const t = translations['en']; // Default to English for now

  // Track module usage and update breadcrumbs for platform integration
  useEffect(() => {
    trackModuleUsage('urja-neta')
    updateBreadcrumbs([
      { label: 'UrjaNeta', url: '/urjaneta', module: 'urja-neta' },
      { label: 'Executive Analytics', url: '/urjaneta', module: 'urja-neta' }
    ])
  }, [])

  return (
    <ExecutiveAnalyticsProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              • Live Data
            </div>
          </div>
        </div>

        {/* Executive Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
            {dashboardTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col gap-1 p-3 h-auto"
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  <span className="text-xs font-medium hidden sm:inline">{tab.label}</span>
                </div>
                <span className="text-xs text-gray-500 hidden lg:inline">
                  {tab.description}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Executive Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <ExecutiveSummary />
          </TabsContent>

          {/* Voice Analytics Tab */}
          <TabsContent value="voice" className="space-y-6">
            <VoiceAnalytics />
          </TabsContent>

          {/* Strategic Planning Tab */}
          <TabsContent value="strategic" className="space-y-6">
            <StrategicPlanning />
          </TabsContent>

          {/* Carbon Analytics Tab */}
          <TabsContent value="carbon" className="space-y-6">
            <CarbonAnalytics />
          </TabsContent>

          {/* Competitive Intelligence Tab */}
          <TabsContent value="competitive" className="space-y-6">
            <CompetitiveIntelligence />
          </TabsContent>
        </Tabs>
      </div>
    </ExecutiveAnalyticsProvider>
  );
};

export default UrjaNeta;